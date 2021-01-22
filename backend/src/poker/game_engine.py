import time, asyncio, threading, json, copy
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from django.contrib.auth.models import User
from .models import Contact, Message, Room
from treys import Card, Evaluator
from .deck import Deck

BIG_BLIND = .5
SMALL_BLIND = .25

LONG_SLEEP = 0 # 3
MEDIUM_SLEEP = 0 # 2
SHORT_SLEEP = 0 # 1.5

REFRESH_RATE = .2

class Player():

    def reserveSeat(self, gameEngine, state, action):

        username = action['username']
        seat_id = action['seatId']

        self.username = username
        self.seat_id = seat_id
        self.reserved = True
        self.sitting_out = True
        self.in_hand = False
        self.dealer = False
        self.sit_in_after_hand = False
        self.sit_out_after_hand = False
        self.stand_up_after_hand = False
        self.add_chips_after_hand = 0
        self.dealer_placeholder = False

    def joinGame(self, gameEngine, state, action):

        chips = float(action['chips'])
        avatar = action['avatar']

        self.chips = chips
        self.chips_in_pot = 0
        self.time = None
        self.hole_cards = []
        self.spotlight = False
        self.draw_for_dealer = False
        self.small_blind = False
        self.big_blind = False
        self.last_to_act = False
        self.previous_player = None
        self.next_player = None
        self.all_in = False
        self.reserved = False
        self.avatar = avatar
        
        gameEngine.decideIfGameShouldStart()
    
    def becomeDealerPlaceholder(self):

        self.dealer_placeholder = True

    def sitIn(self, gameEngine, state, action):

        if state.hand_in_action:
            if self.sit_in_after_hand == False:
                self.sit_in_after_hand = True
            else:
                self.sit_in_after_hand = False
        else:
            self.sitting_out = False
        
        gameEngine.decideIfGameShouldStart()

    def sitOut(self, gameEngine, state, action):

        if self.in_hand:
            if self.sit_out_after_hand == False:
                self.sit_out_after_hand = True
            else:
                self.sit_out_after_hand = False
        else:
            self.sitting_out = True

    def standUp(self, gameEngine, state, action):

        if self.in_hand:
            if self.stand_up_after_hand == False:
                self.stand_up_after_hand = True
            else:
                self.stand_up_after_hand = False
        else:
            # we need to rotate the dealer chip before the player stands up or there will be no dealer chip to rotate once they're gone
            if self.dealer:
                self.becomeDealerPlaceholder()
                self.sitting_out = True
            else:
                self.state.players.pop(username)
                self.orderPlayers()

    def addChips(self, gameEngine, state, action):

        chips = action['chips']

        if self.in_hand:
            self.add_chips_after_hand = chips
            gameEngine.createHandHistory(self.username + ' has requested ' + str(self.add_chips_after_hand) + ', and will be added after the hand')
        else:
            self.chips += float(chips)
            gameEngine.createHandHistory(self.username + ' has added ' + str(chips))

    def fold(self, gameEngine, state, action):
        
        self.in_hand = False
        self.chips_in_pot = 0
        self.hole_cards = []
        self.small_blind = False
        self.big_blind = False
        self.spotlight = False

        gameEngine.createHandHistory(self.username + ' folds')
        state.last_action = 'Fold'
        state.last_action_username = self.username

        players_active = [player for player in state.players if state.players[player].in_hand]

        if len(players_active) < 2:
            winner_username = players_active[0]
            gameEngine.createHandHistory(winner_username + ' wins ' + str(state.pot))
            return gameEngine.betweenHands(winner_username)

        gameEngine.rotateSpotlight(self)

    def check(self, gameEngine, state, action):

        gameEngine.createHandHistory(self.username + ' checks')
        state.last_action = 'Check'
        state.last_action_username = self.username

        gameEngine.rotateSpotlight(self)

    def call(self, gameEngine, state, action):

        # if player enters amount greater than his stack, he automatically goes all in
        if state.current_bet >= self.chips + self.chips_in_pot:
            state.pot += self.chips
            self.chips_in_pot += self.chips
            self.chips = 0
            self.all_in = True
        else:
            difference = state.current_bet - self.chips_in_pot
            self.chips -= difference
            self.chips_in_pot = state.current_bet
            state.pot += difference

        gameEngine.createHandHistory(self.username + ' calls')
        state.last_action = 'Call'
        state.last_action_username = self.username

        gameEngine.rotateSpotlight(self)

    def bet(self, gameEngine, state, action):
        
        raise_amount = float(action['chipsInPot'])

        # if player enters amount greater than his stack, he automatically goes all in
        if raise_amount >= self.chips:
            raise_amount = self.chips + self.chips_in_pot
            self.all_in = True

        gameEngine.createHandHistory(self.username + ' bets ' + str(raise_amount))
        if state.current_bet == 0:
            state.last_action = 'Bet'
        else:
            state.last_action = 'Raise'
        state.last_action_username = self.username

        state.current_bet = raise_amount
        difference = raise_amount - self.chips_in_pot
        self.chips_in_pot += difference
        self.chips -= difference
        state.current_bet = raise_amount
        state.pot += difference

        # first we need to set the current last_to_act to false (instead of searching, setting all to false works fine)
        for player in state.players:
            state.players[player].last_to_act = False
        
        previous_player = state.players[self.previous_player]
        while True:
            # if we are the only one that's not all in, we must go to the next street by calling rotateSpotlight
            if previous_player.username == self.username:
                self.last_to_act = True
                break
            if previous_player.in_hand and not previous_player.all_in:
                previous_player.last_to_act = True
                break
            else:
                previous_player = state.players[previous_player.previous_player]

        # rotate spotlight and determine who's last to act
        gameEngine.rotateSpotlight(self)

class State():

    # WE CAN PROBABLY CHANGE STATE.SIDEPOT TO USER.SIDEPOT, AND JUST MAKE IT EITHER NONE OR THE MAX THE PLAYER CAN WIN AD SHOWDOWN

    def __init__(self):

        self.players = {}
        self.spotlight = None
        self.street = 'preflop'
        self.community_cards = []
        self.big_blind = BIG_BLIND
        self.small_blind = SMALL_BLIND
        self.pot = 0.0
        self.side_pot = {}
        self.current_bet = BIG_BLIND
        self.hand_in_action = False
        self.previous_street_pot = 0.0
        self.show_hands = False
        self.last_action = None
        self.last_action_username = None
        self.time = time.time()


event = threading.Event()

class GameEngine(threading.Thread):

    def __init__(self, room_name):

        super().__init__(daemon=True)
        
        self.state = State()
        self.actions = []
        self.room_name = room_name
        self.channel_layer = get_channel_layer()
    
    def initializePlayer(self, username, seat_id, chips, avatar):

        return {
            'username': username,
            'seat_id': seat_id,
            'chips': chips,
            'chips_in_pot': 0,
            'time': None,
            'hole_cards': [],
            'spotlight': False,
            'sitting_out': False,
            'dealer': False,
            'draw_for_dealer': False,
            'small_blind': False,
            'big_blind': False,
            'in_hand': False,
            'last_to_act': False,
            'previous_player': None,
            'next_player': None,
            'all_in': False,
            'reserved': False,
            'sit_in_after_hand': False,
            'sit_out_after_hand': False,
            'stand_up_after_hand': False,
            'add_chips_after_hand': 0,
            'avatar': avatar
        }
    
    def run(self):

        print('starting game...')
        while True:
            self.tick()
            self.returnState()
            time.sleep(REFRESH_RATE)
    
    def tick(self):
        if self.actions:
            actions_thread = threading.Thread(target=self.makeActions, args=(self.actions.copy(),))
            actions_thread.start()
            self.actions = []
    
    def makeActions(self, actions):

        # PROBABLY BETTER TO DO IT THIS WAY. NOT SURE EXACTLY HOW TO HANDLE SITACTIONS YET

        for action in actions:
            # if it's a new player, we need to create an instance
            if action['username'] not in self.state.players:
                new_player = Player()
                self.state.players[action['username']] = new_player
            
            player = self.state.players[action['username']]

            getattr(player, action['command'])(self, self.state, action)

        self.makeSitActions()
    
    # there should be a method to determine if a move is legal
    def isLegalMove(self, action):

        # stop player from making fold/call/bet if they don't have spotlight

        # stop player from sitting in if they have no chips

        pass
    
    def makeAction(self, data):

        print(data['username'], ': ', data)
        
        # convert the frontend command name to backend command name
        data['command'] = self.commands[data['command']]
        
        self.actions.append(data)
    
    def makeSitActions(self):

        for username, player in self.state.players.items():
            if player.sit_out_after_hand and (not self.state.hand_in_action or not player.in_hand):
                player.sitting_out = True
                player.sit_out_after_hand = False
            if player.sit_in_after_hand and (not self.state.hand_in_action or not player.in_hand):
                player.sitting_out = False
                playersit_in_after_hand = False
            if player.add_chips_after_hand > 0 and (not self.state.hand_in_action or not player.in_hand):
                player.chips += player.add_chips_after_hand
                self.createHandHistory(username + ' added ' + str(player.add_chips_after_hand))
                player.add_chips_after_hand = 0
            if player.stand_up_after_hand and (not self.state.hand_in_action or not player.in_hand) and not player.dealer:
                # we need to rotate the dealer chip before the player stands up or there will be no dealer chip to rotate once they're gone
                if player.dealer:
                    player.becomeDealerPlaceholder()
                    player.sitting_out = True
                else:
                    self.state.players.pop(username)
                    self.orderPlayers()

    def decideIfGameShouldStart(self):

        # if there are two or more players, start the game
        players_in_game = len([k for k in self.state.players if not self.state.players[k].sitting_out])

        if players_in_game > 1:
            if self.state.hand_in_action:
                self.orderPlayers()
            else:
                self.startGame()
                self.orderPlayers()
                self.newHand()
    
    def orderPlayers(self):

        # create a sorted list based on the absolute order, then remove players sitting out
        y = sorted(self.state.players.items(), key=lambda item: item[1].seat_id)
        y = [player for player in y]
        # we need to check if there's only one player at the table because we call orderPlayers from makeSitActions after a player stands up
        if len(y) < 2:
            return

        # update x according to sorted list
        for i, player in enumerate(y):
            if i == 0:
                self.state.players[player[0]].next_player = y[i+1][0]
                self.state.players[player[0]].previous_player = y[len(y)-1][0]
            elif i != 0 and i != len(y)-1:
                self.state.players[player[0]].next_player = y[i+1][0]
                self.state.players[player[0]].previous_player = y[i-1][0]
            else:
                self.state.players[player[0]].next_player = y[0][0]
                self.state.players[player[0]].previous_player = y[i-1][0]
    
    def rotateDealerChip(self):

        for username, player in self.state.players.items():
            if player.dealer or player.dealer_placeholder:
                player.dealer = False
                next_player = self.state.players[player.next_player]
                while True:
                    if next_player.sitting_out:
                        next_player = self.state.players[next_player.next_player]
                    else:
                        next_player.dealer = True
                        break
                if player.dealer_placeholder:
                    self.state.players.pop(username)
                    self.orderPlayers()
                break

    def postBlinds(self, number_of_players):

        if number_of_players == 2:
            for username, player in self.state.players.items():
                if not player.sitting_out:
                    if player.dealer:
                        player.small_blind = True
                        player.spotlight = True
                        player.last_to_act = False

                        # if player doesn't have enough to match blind, he must go all in
                        if player.chips <= self.state.small_blind:
                            player.chips_in_pot = player.chips
                            player.chips = 0
                            player.all_in = True
                        else:
                            player.chips_in_pot = self.state.small_blind
                            player.chips = player.chips - player.chips_in_pot
                        self.state.pot += player.chips_in_pot
                    else:
                        player.big_blind = True
                        player.spotlight = False
                        # if player is all in from blinds, he will not be last to act (he won't act at all)
                        if not player.all_in:
                            player.last_to_act = True
                        else:
                            self.state.players[player.previous_player].last_to_act = True

                        # if player doesn't have enough to match blind, he must go all in
                        if player.chips <= self.state.big_blind:
                            player.chips_in_pot = player.chips
                            player.chips = 0
                            player.all_in = True
                        else:
                            player.chips_in_pot = self.state.big_blind
                            player.chips = player.chips - player.chips_in_pot
                        self.state.pot += player.chips_in_pot
        
        if number_of_players > 2:
            for username, player in self.state.players.items():
                if not player.sitting_out:
                    # the player left of the dealer will always start in the splotlight; we wil use this to determine blinds and then move spotlight to left of bb
                    if player.dealer:
                        # look for next player that is not sitting out
                        next_player = self.state.players[player.next_player]
                        while True:
                            if next_player.sitting_out:
                                next_player = self.state.players[next_player.next_player]
                            else:
                                next_player.small_blind = True
                                break

                        # if player doesn't have enough to match blind, he must go all in
                        if next_player.chips <= self.state.small_blind:
                            next_player.chips_in_pot = next_player.chips
                            next_player.chips = 0
                            next_player.all_in = True
                        else:
                            next_player.chips_in_pot = self.state.small_blind
                            next_player.chips = next_player.chips - next_player.chips_in_pot
                        self.state.pot += next_player.chips_in_pot

                        # look for the next player that is not sitting out
                        next_player = self.state.players[next_player.next_player]
                        while True:
                            if next_player.sitting_out:
                                next_player = self.state.players[next_player.next_player]
                            else:
                                next_player.big_blind = True
                                next_player.last_to_act = True
                                break

                        # if player doesn't have enough to match blind, he must go all in
                        if next_player.chips <= self.state.big_blind:
                            next_player.chips_in_pot = next_player.chips
                            next_player.chips = 0
                            next_player.all_in = True
                        else:
                            next_player.chips_in_pot = self.state.big_blind
                            next_player.chips = next_player.chips - next_player.chips_in_pot
                        self.state.pot += next_player.chips_in_pot

                        # look for the next player that is not sitting out
                        next_player = self.state.players[next_player.next_player]
                        while True:
                            if next_player.sitting_out:
                                next_player = self.state.players[next_player.next_player]
                            else:
                                next_player.spotlight = True
                                break
    
    def rotateSpotlight(self, player):
        
        player.spotlight = False
        if player.last_to_act:
            # if there are not at least two players with chips behind, show cards and deal until showdown
            players_active = [player for player in self.state.players.values() if not player.all_in and player.in_hand]
            if len(players_active) < 2:
                # self.updated_state = copy.deepcopy(self.state)
                # self.returnState()
                time.sleep(MEDIUM_SLEEP)
                self.state.show_hands = True
                time.sleep(MEDIUM_SLEEP)
            self.betweenStreets()
        else:
            next_player = self.state.players[player.next_player]
            while True:
                if not next_player.in_hand or next_player.all_in:
                    if next_player.last_to_act:
                        # if there are not at least two players with chips behind, show cards and deal until showdown
                        players_active = [player for player in self.state.players.values() if not player.all_in and player.in_hand]
                        if len(players_active) < 2:
                            # self.updated_state = copy.deepcopy(self.state)
                            # self.returnState()
                            time.sleep(MEDIUM_SLEEP)
                            self.state.show_hands = True
                            time.sleep(MEDIUM_SLEEP)
                        self.betweenStreets()
                        break
                    else:
                        next_player = self.state.players[next_player.next_player]
                else:
                    next_player.spotlight = True
                    break
    
    def determineFirstAndLastToAct(self):
        for username, player in self.state.players.items():
            if player.dealer:
                next_player = self.state.players[player.next_player]
                previous_player = self.state.players[player.previous_player]
                # determine first to act
                while True:
                    if next_player.in_hand and not next_player.all_in:
                        next_player.spotlight = True
                        break
                    else:
                        next_player = self.state.players[next_player.next_player]
                # determine last to act
                if player.in_hand and not player.all_in:
                    player.last_to_act = True
                else:
                    while True:
                        if previous_player.in_hand and not previous_player.all_in:
                            previous_player.last_to_act = True
                            break
                        else:
                            previous_player = self.state.players[previous_player.previous_player]
    
    def startGame(self):
        
        print('starting game...')

        players_sorted = sorted(self.state.players, key=lambda player: self.state.players[player].seat_id)
        self.state.players[players_sorted[0]].dealer = True

    def newHand(self):

        print('starting new hand...')

        self.state.time = time.time()
        self.state.show_hands = False
        self.state.community_cards = []
        self.deck = Deck()
        
        # reset everything but dealer position
        number_of_players = 0
        for username, player in self.state.players.items():
            player.spotlight = False
            player.small_blind = False
            player.big_blind = False
            player.last_to_act = False
            player.all_in = False
            player.in_hand = False
            player.hole_cards = []
            player.chips_in_pot = 0
            if not player.reserved and player.chips == 0:
                player.sitting_out = True
            if not player.sitting_out:
                number_of_players += 1
        
        if number_of_players < 2:
            print('stopping game...')
            # if we don't set dealer to false on every player, we might get two dealers when the game restarts
            for username, player in self.state.players.items():
                player.dealer = False
            return None
        
        self.createHandHistory('New hand')

        for username, player in self.state.players.items():
            if not player.sitting_out:
                player.hole_cards.append(self.deck.dealCard())
                player.hole_cards.append(self.deck.dealCard())
                player.in_hand = True
        
        self.rotateDealerChip()
        self.postBlinds(number_of_players)

        self.state.current_bet = BIG_BLIND
        self.state.street = 'preflop'
        self.state.hand_in_action = True
    
    def dealStreet(self):
        print('dealing new street')
        
        # create side pot for any player who is still in the hand and has less than the current bet in the pot
        players_in_hand = {k: v for k, v in self.state.players.items() if v.in_hand}
        for username, player in players_in_hand.items():
            side_pot = 0
            # create side pot for player if he isn't matching the bet. if there's already a side pot, we skip this
            if player.chips == 0 and username not in self.state.side_pot:
                # iterate through each player sitting and put as much as we match into side pot
                for other_player in self.state.players.values():
                    if not other_player.sitting_out:
                        # if the other player has us covered, they only match our chips in pot
                        if other_player.chips_in_pot > player.chips_in_pot:
                            side_pot += player.chips_in_pot
                        # otherwise, we take as much as they have in the pot
                        else:
                            side_pot += other_player.chips_in_pot
                # need to add whatever was already in the pot before this round of betting
                side_pot += self.state.previous_street_pot
                self.state.side_pot[username] = side_pot
        
        # reset current bet
        self.state.current_bet = 0
        self.state.previous_street_pot = self.state.pot
        # reset 'chips_in_pot', spotlight and last to act
        for username, player in self.state.players.items():
            player.chips_in_pot = 0
            player.spotlight = False
            player.last_to_act = False
        # self.returnState()
        time.sleep(SHORT_SLEEP)
        
        if self.state.street == 'preflop':
            number_of_cards = 3
            self.state.street = 'flop'
        elif self.state.street == 'flop':
            number_of_cards = 1
            self.state.street = 'turn'
        elif self.state.street == 'turn':
            number_of_cards = 1
            self.state.street = 'river'
        else:
            return self.showdown()
        for _ in range(number_of_cards):
            card = self.deck.dealCard()
            self.createHandHistory('Card dealt: ' + card['rank'] + card['suit'])
            self.state.community_cards.append(card)
        

        # if there are not at least two players with chips behind, show cards and deal until showdown
        players_active = [player for player in self.state.players.values() if not player.all_in and player.in_hand]
        if len(players_active) < 2:
            self.state.show_hands = True
            self.betweenStreets()
        else:
            self.determineFirstAndLastToAct()
    
    def showdown(self):
        
        self.state.show_hands = True
        
        # self.returnState()
        time.sleep(LONG_SLEEP)
        # convert cards to correct format for treys library
        first_card_board = self.state.community_cards[0]['rank'] + self.state.community_cards[0]['suit'].lower()
        second_card_board = self.state.community_cards[1]['rank'] + self.state.community_cards[1]['suit'].lower()
        third_card_board = self.state.community_cards[2]['rank'] + self.state.community_cards[2]['suit'].lower()
        fourth_card_board = self.state.community_cards[3]['rank'] + self.state.community_cards[3]['suit'].lower()
        fifth_card_board = self.state.community_cards[4]['rank'] + self.state.community_cards[4]['suit'].lower()

        # then create a list of community cards
        board = [
            Card.new(first_card_board),
            Card.new(second_card_board),
            Card.new(third_card_board),
            Card.new(fourth_card_board),
            Card.new(fifth_card_board)
        ]

        results = {}

        # do the same thing for each active player
        evaluator = Evaluator()
        winning_hand = 7463
        for username, player in self.state.players.items():
            if player.in_hand:

                first_card = player.hole_cards[0]['rank'] + player.hole_cards[0]['suit'].lower()
                second_card = player.hole_cards[1]['rank'] + player.hole_cards[1]['suit'].lower()

                hand = [Card.new(first_card), Card.new(second_card)]
                player_result = {}
                player_result['score'] = evaluator.evaluate(board, hand)
                # player_result['score'] = 1
                player_result['hand_class'] = evaluator.get_rank_class(player_result['score'])
                player_result['hand_class_string'] = evaluator.class_to_string(player_result['hand_class'])

                results[username] = player_result
        
        # we're going to loop through, finding the winner and paying out any side bets. we keep doing this until the winner does not have a side bet
        while True:
            # find the winner(s)
            winning_hand = min(results.values(), key = lambda value: value['score'])
            winners = {k for k, v in results.items() if v == winning_hand}
            print('winners ', winners)
            print('side pots ', self.state.side_pot)

            # find minimum side pot of all winners
            if len(self.state.side_pot) > 0:
                if len(set.intersection(winners, set(self.state.side_pot))) > 0:
                    minimum_side_pot_of_winners_username = min({k: v for k, v in self.state.side_pot.items() if k in winners}, key=lambda item: self.state.side_pot[item])
                    minimum_side_pot_of_winners = self.state.side_pot[minimum_side_pot_of_winners_username]
                    print(minimum_side_pot_of_winners_username)
                else:
                    minimum_side_pot_of_winners = self.state.pot
                # split the pot if necessary
                payout = minimum_side_pot_of_winners/len(winners)
                for winner in winners:
                    self.createHandHistory(
                        winner + ' shows ' 
                        + self.state.players[winner].hole_cards[0]['rank'] 
                        + self.state.players[winner].hole_cards[0]['suit']
                        + self.state.players[winner].hole_cards[1]['rank']
                        + self.state.players[winner].hole_cards[1]['suit']
                        + ' and wins ' + str(payout) + ' with ' + results[winner]['hand_class_string']
                    )
                    self.state.players[winner].chips += payout
                    self.state.players[winner].chips_in_pot += payout
                    self.state.pot -= payout
                # subract the side pot that is currently paying out from all other side pots. when a sidepot reaches 0, remove it
                for side_pot in dict(self.state.side_pot):
                    self.state.side_pot[side_pot] -= minimum_side_pot_of_winners
                    if self.state.side_pot[side_pot] <= 0:
                        self.state.side_pot.pop(side_pot)
                try:
                    results.pop(minimum_side_pot_of_winners_username)
                except:
                    pass
                # self.state['side_pot'].pop(minimum_side_pot_of_winners_username)
                winning_hand = 7463
                if len(self.state.side_pot) < 1:
                    break
            else:
                # split the pot if necessary
                payout = self.state.pot/len(winners)
                for winner in winners:
                    self.createHandHistory(
                        winner + ' shows ' 
                        + self.state.players[winner].hole_cards[0]['rank'] 
                        + self.state.players[winner].hole_cards[0]['suit']
                        + self.state.players[winner].hole_cards[1]['rank']
                        + self.state.players[winner].hole_cards[1]['suit']
                        + ' and wins ' + str(payout) + ' with ' + results[winner]['hand_class_string']
                    )
                    self.state.players[winner].chips += payout
                    self.state.players[winner].chips_in_pot += payout
                    self.state.pot -= payout
                break
        
        self.betweenHands(winner)
    
    def betweenHands(self, winner_username):

        # self.updated_state = copy.deepcopy(self.state)
        # self.returnState()
        time.sleep(LONG_SLEEP)

        winner = self.state.players[winner_username]
        # put all active chips in the pot, then return them to the winner. the pot will be "0" if there was a split pot/ side pot where somebody went all in, since it was already divided
        if self.state.pot != 0:
            winnerchips_in_pot = self.state.pot
            winner.chips += self.state.pot

        # reset pot
        self.state.pot = 0
        self.state.previous_street_pot = 0
        self.state.last_action = None
        self.state.last_action_username = None
        # self.returnState()

        time.sleep(LONG_SLEEP)
        self.state.hand_in_action = False
        self.makeSitActions()
        self.newHand()
        # self.returnState()
    
    def betweenStreets(self):
        
        # self.returnState()
        time.sleep(SHORT_SLEEP)
        self.state.last_action = None
        self.state.last_action_username = None
        self.dealStreet()
        # self.returnState()
    
    def returnState(self):

        # convert objects to dicts
        players = {}
        for player in self.state.players:
            players[player] = self.state.players[player].__dict__
        state = copy.copy(self.state).__dict__
        state['players'] = players
        
        content = {
            'type': 'state',
            'state': state
        }

        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": "sendMessage",
                "text": json.dumps(content)
            }
        )
    
    def messageToDict(self, message):

        return {
            'id': message.id,
            'author': message.contact.user.username,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }
    
    def createHandHistory(self, data):

        # user = User.objects.get(username='Dealer')
        # contact = Contact.objects.get(user=user)
        # room_name = self.room_name.replace('poker-', '')
        # chat = Room.objects.get(name=room_name)
        # new_message = Message.objects.create(
        #     contact = contact,
        #     content = data
        # )
        # chat.messages.add(new_message)
        # new_message_json = json.dumps(self.messageToDict(new_message))
        # content = {
        #     'type': 'new_message',
        #     'message': new_message_json
        # }
        # # this sends the new message to the chat consumer
        # async_to_sync(self.channel_layer.group_send)(
        #     self.room_name.replace('poker-', 'chat-'),
        #     {
        #         "type": "sendMessageToGroup",
        #         "text": json.dumps(content)
        #     }
        # )
        print('Dealer: ', data)
    
    commands = {
        'reserve': 'reserveSeat',
        'sit': 'joinGame',
        'sit_in': 'sitIn',
        'sit_out': 'sitOut',
        'stand_up': 'standUp',
        'add_chips': 'addChips',
        'fold': 'fold',
        'check': 'check',
        'call': 'call',
        'bet': 'bet'
    }