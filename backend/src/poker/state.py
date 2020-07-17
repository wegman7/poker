from treys import Card, Evaluator
from .deck import Deck

BIG_BLIND = 2
SMALL_BLIND = 1

class State():

    def __init__(self, createHandHistory):
        self.state = {
            'players': {},
            'spotlight': None,
            'street': 'preflop',
            'community_cards': [],
            'big_blind': BIG_BLIND,
            'small_blind': SMALL_BLIND,
            'pot': 0,
            'side_pot': {},
            'current_bet': BIG_BLIND,
            'hand_in_action': False,
            'previous_street_pot': 0
        }

        self.createHandHistory = createHandHistory

        self.convert_username_to_seat_id = {}
    
    def initializePlayer(self, username, seat_id, chips):

        self.convert_username_to_seat_id[username] = seat_id

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
            'add_chips_after_hand': False
        }
    
    def reserveSeat(self, data):

        username = data['username']
        seat_id = data['seatId']

        self.state['players'][username] = {
            'username': username,
            'seat_id': seat_id,
            'reserved': True,
            'sitting_out': True
        }

    def addPlayer(self, data):

        username = data['username']
        seat_id = data['seatId']
        chips = int(data['chips'])
        self.state['players'][username] = self.initializePlayer(username, seat_id, chips)

        # if there are two or more players, start the game
        players_in_game = 0
        for player in self.state['players']:
            if not self.state['players'][player]['sitting_out']:
                players_in_game += 1

        if players_in_game > 1:
            if self.state['hand_in_action']:
                self.orderPlayers()
            else:
                self.startGame()
                self.orderPlayers()
                self.newHand()
    
    def makeSitAction(self):
        for username, player in dict(self.state['players']).items():
            if player['sit_out_after_hand']:
                player['sitting_out'] = True
                player['sit_out_after_hand'] = False
            if player['sit_in_after_hand']:
                player['sitting_out'] = False
                player['sit_in_after_hand'] = False
            if player['stand_up_after_hand']:
                self.state['players'].pop(username)
            if player['add_chips_after_hand'] > 0:
                player['chips'] += player['add_chips_after_hand']
                player['add_chips_after_hand'] = 0

    
    def sitIn(self, data):
        username = data['username']
        player = self.state['players'][username]
        if self.state['hand_in_action']:
            if player['sit_in_after_hand'] == False:
                player['sit_in_after_hand'] = True
            else:
                player['sit_in_after_hand'] = False
        else:
            player['sitting_out'] = False
        number_of_players = len({k:v for k, v in self.state['players'].items() if not v['sitting_out']})
        if number_of_players > 1:
            self.startGame()
            self.orderPlayers()
            self.newHand()

    def sitOut(self, data):
        username = data['username']
        player = self.state['players'][username]
        if self.state['hand_in_action']:
            if player['sit_out_after_hand'] == False:
                player['sit_out_after_hand'] = True
            else:
                player['sit_out_after_hand'] = False
        else:
            player['sitting_out'] = True

    def standUp(self, data):
        username = data['username']
        player = self.state['players'][username]
        if self.state['hand_in_action']:
            if player['stand_up_after_hand'] == False:
                player['stand_up_after_hand'] = True
            else:
                player['stand_up_after_hand'] = False
        else:
            self.state['players'].pop(username)

    def addChips(self, data):
        username = data['username']
        chips = data['chips']
        player = self.state['players'][username]
        if self.state['hand_in_action']:
            player['add_chips_after_hand'] = chips
        else:
            player['chips'] += int(chips)
    
    def orderPlayers(self):
        
        # determine id of dealer
        for username, player in self.state['players'].items():
            if player['dealer']:
                dealer_id = player['seat_id']

        # create placeholder id that will give us an absolute order
        for username, player in self.state['players'].items():
            if player['seat_id'] <= dealer_id:
                player['placeholder_id'] = player['seat_id'] + 9
            else:
                player['placeholder_id'] = player['seat_id']

        # create a sorted list based on the absolute order, then remove players sitting out
        y = sorted(self.state['players'].items(), key=lambda item: item[1]['placeholder_id'])
        y = [player for player in y if not player[1]['sitting_out']]

        # update x according to sorted list
        for i, player in enumerate(y):
            if i == 0:
                self.state['players'][player[0]]['next_player'] = y[i+1][0]
                self.state['players'][player[0]]['previous_player'] = y[len(y)-1][0]
            elif i != 0 and i != len(y)-1:
                self.state['players'][player[0]]['next_player'] = y[i+1][0]
                self.state['players'][player[0]]['previous_player'] = y[i-1][0]
            else:
                self.state['players'][player[0]]['next_player'] = y[0][0]
                self.state['players'][player[0]]['previous_player'] = y[i-1][0]
    
    def rotateDealerChip(self):
        for username, player in self.state['players'].items():
            if player['dealer']:
                player['dealer'] = False
                next_player = self.state['players'][player['next_player']]
                while True:
                    if next_player['sitting_out']:
                        next_player = self.state['players'][next_player['next_player']]
                    else:
                        next_player['dealer'] = True
                        break
                break

    def postBlinds(self, number_of_players):
        if number_of_players == 2:
            for username, player in self.state['players'].items():
                if not player['sitting_out']:
                    if player['dealer']:
                        player['small_blind'] = True
                        player['spotlight'] = True
                        player['last_to_act'] = False

                        # if player doesn't have enough to match blind, he must go all in
                        if player['chips'] <= self.state['small_blind']:
                            player['chips_in_pot'] = player['chips']
                            player['chips'] = 0
                            player['all_in'] = True
                        else:
                            player['chips_in_pot'] = self.state['small_blind']
                            player['chips'] = player['chips'] - player['chips_in_pot']
                        self.state['pot'] += player['chips_in_pot']
                    else:
                        player['big_blind'] = True
                        player['spotlight'] = False
                        # if player is all in from blinds, he will not be last to act (he won't act at all)
                        if not player['all_in']:
                            player['last_to_act'] = True
                        else:
                            self.state['players'][player['previous_player']]['last_to_act'] = True

                        # if player doesn't have enough to match blind, he must go all in
                        if player['chips'] <= self.state['big_blind']:
                            player['chips_in_pot'] = player['chips']
                            player['chips'] = 0
                            player['all_in'] = True
                        else:
                            player['chips_in_pot'] = self.state['big_blind']
                            player['chips'] = player['chips'] - player['chips_in_pot']
                        self.state['pot'] += player['chips_in_pot']
        
        if number_of_players > 2:
            for username, player in self.state['players'].items():
                if not player['sitting_out']:
                    # the player left of the dealer will always start in the splotlight; we wil use this to determine blinds and then move spotlight to left of bb
                    if player['dealer']:
                        next_player = self.state['players'][player['next_player']]
                        next_player['small_blind'] = True

                        # if player doesn't have enough to match blind, he must go all in
                        if next_player['chips'] <= self.state['small_blind']:
                            next_player['chips_in_pot'] = next_player['chips']
                            next_player['chips'] = 0
                            next_player['all_in'] = True
                        else:
                            next_player['chips_in_pot'] = self.state['small_blind']
                            next_player['chips'] = next_player['chips'] - next_player['chips_in_pot']
                        self.state['pot'] += next_player['chips_in_pot']

                        next_next_player = self.state['players'][next_player['next_player']]
                        next_next_player['big_blind'] = True
                        next_next_player['last_to_act'] = True

                        # if player doesn't have enough to match blind, he must go all in
                        if next_next_player['chips'] <= self.state['big_blind']:
                            next_next_player['chips_in_pot'] = next_next_player['chips']
                            next_next_player['chips'] = 0
                            next_next_player['all_in'] = True
                        else:
                            next_next_player['chips_in_pot'] = self.state['big_blind']
                            next_next_player['chips'] = next_next_player['chips'] - next_next_player['chips_in_pot']
                        self.state['pot'] += next_next_player['chips_in_pot']

                        next_next_next_player = self.state['players'][next_next_player['next_player']]
                        next_next_next_player['spotlight'] = True
    
    def rotateSpotlight(self, username):
        player = self.state['players'][username]
        player['spotlight'] = False
        if player['last_to_act']:
            self.dealStreet()
        else:
            next_player = self.state['players'][player['next_player']]
            while True:
                if not next_player['in_hand'] or next_player['all_in']:
                    if next_player['last_to_act']:
                        self.dealStreet()
                        break
                    else:
                        next_player = self.state['players'][next_player['next_player']]
                else:
                    next_player['spotlight'] = True
                    break
    
    def determineFirstAndLastToAct(self):
        for username, player in self.state['players'].items():
            if player['dealer']:
                player['last_to_act'] = True
                next_player = self.state['players'][player['next_player']]
                previous_player = self.state['players'][player['previous_player']]
                # determine first to act
                while True:
                    if next_player['in_hand'] and not next_player['all_in']:
                        next_player['spotlight'] = True
                        break
                    else:
                        next_player = self.state['players'][next_player['next_player']]
                # determine last to act
                while True:
                    if player['in_hand'] and not next_player['all_in']:
                        player['last_to_act'] = True
                        break
                    else:
                        if previous_player['in_hand'] and not next_player['all_in']:
                            previous_player['last_to_act'] = True
                            break
                        else:
                            previous_player = self.state['players'][previous_player['previous_player']]
    
    def startGame(self):
        print('starting game...')
        self.deck = Deck()
        
        # deal one card to each active player
        cards = []
        for username, player in self.state['players'].items():
            if not player['sitting_out']:
                player['hole_cards'].append(self.deck.dealCard())
                cards.append(player['hole_cards'])
        
        high_card = self.deck.compareHighcards(cards)
        
        # give the dealer chip to the player with the high card
        for username, player in self.state['players'].items():
            if not player['sitting_out']:
                if player['hole_cards'][0] == high_card:
                    player['dealer'] = True

    def newHand(self):
        print('starting new hand...')

        self.createHandHistory('New hand')

        self.deck = Deck()
        
        # reset everything but dealer position
        number_of_players = 0
        for username, player in self.state['players'].items():
            player['spotlight'] = False
            player['small_blind'] = False
            player['big_blind'] = False
            player['last_to_act'] = False
            player['all_in'] = False
            player['hole_cards'] = []
            if player['chips'] == 0:
                player['sitting_out'] = True
            if not player['sitting_out']:
                number_of_players += 1
        
        if number_of_players < 2:
            return None

        for username, player in self.state['players'].items():
            if not player['sitting_out']:
                player['hole_cards'].append(self.deck.dealCard())
                player['hole_cards'].append(self.deck.dealCard())
                player['in_hand'] = True
        
        self.rotateDealerChip()
        self.postBlinds(number_of_players)

        self.state['current_bet'] = BIG_BLIND
        self.state['street'] = 'preflop'
        self.state['hand_in_action'] = True
    
    def dealStreet(self):
        print('dealing new street')
        
        # create side pot for any player who is still in the hand and has less than the current bet in the pot
        players_at_table = self.state['players'].items()
        players_in_hand = [(username, player) for (username, player) in players_at_table if player['in_hand']]
        for username, player in players_in_hand:
            side_pot = 0
            # create side pot for player if he isn't matching the bet. if there's already a side pot, we skip this
            if player['chips'] == 0 and username not in self.state['side_pot']:
                # iterate through each player sitting and put as much as we match into side pot
                for other_player in self.state['players'].values():
                    if not other_player['sitting_out']:
                        # if the other player has us covered, they only match our chips in pot
                        if other_player['chips_in_pot'] > player['chips_in_pot']:
                            side_pot += player['chips_in_pot']
                        # otherwise, we take as much as they have in the pot
                        else:
                            side_pot += other_player['chips_in_pot']
                # need to add whatever was already in the pot before this round of betting
                side_pot += self.state['previous_street_pot']
                self.state['side_pot'][username] = side_pot
        
        # reset current bet
        self.state['current_bet'] = 0
        self.state['previous_street_pot'] = self.state['pot']
        # reset 'chips_in_pot', spotlight and last to act
        for username, player in self.state['players'].items():
            player['chips_in_pot'] = 0
            player['spotlight'] = False
            player['last_to_act'] = False
        
        if self.state['street'] == 'preflop':
            number_of_cards = 3
            self.state['street'] = 'flop'
        elif self.state['street'] == 'flop':
            number_of_cards = 1
            self.state['street'] = 'turn'
        elif self.state['street'] == 'turn':
            number_of_cards = 1
            self.state['street'] = 'river'
        else:
            return self.showdown()
        for _ in range(number_of_cards):
            card = self.deck.dealCard()
            self.createHandHistory('Card dealt: ' + card['rank'] + card['suit'])
            self.state['community_cards'].append(card)
        

        # if there are not at least two players with chips behind, we deal the rest of the cards
        players_sitting = self.state['players'].values()
        players_active = [player for player in players_sitting if not player['all_in'] and player['in_hand']]
        if len(players_active) < 2:
            self.dealStreet()
        else:
            self.determineFirstAndLastToAct()
    
    def endHand(self, winner_username):
        winner = self.state['players'][winner_username]
        # put all active chips in the pot, then return them to the winner
        winner['chips_in_pot'] = 0
        winner['chips'] += self.state['pot']
        winner['hole_cards'] = []
        # reset pot
        self.state['pot'] = 0
        self.state['previous_street_pot'] = 0
        self.state['hand_in_action'] = False
        self.state['community_cards'] = []

        self.makeSitAction()
        self.newHand()
    
    def fold(self, data):
        username = data['username']
        my_player = self.state['players'][username]
        my_player['in_hand'] = False
        my_player['chips_in_pot'] = 0
        my_player['hole_cards'] = []
        my_player['small_blind'] = False
        my_player['big_blind'] = False
        my_player['spotlight'] = False

        self.createHandHistory(username + ' folds')

        players_sitting = self.state['players'].items()
        players_active = [player for player in players_sitting if player[1]['in_hand']]

        if len(players_active) < 2:
            winner_username = players_active[0][0]
            self.createHandHistory(winner_username + ' wins ' + str(self.state['pot']))
            return self.endHand(winner_username)

        self.rotateSpotlight(username)
    
    def check(self, data):
        username = data['username']
        my_player = self.state['players'][username]

        self.createHandHistory(username + ' checks')

        self.rotateSpotlight(username)
    
    def call(self, data):
        username = data['username']
        my_player = self.state['players'][username]

        # if player enters amount greater than his stack, he automatically goes all in
        if self.state['current_bet'] >= my_player['chips'] + my_player['chips_in_pot']:
            self.state['pot'] += my_player['chips']
            my_player['chips_in_pot'] += my_player['chips']
            my_player['chips'] = 0
            my_player['all_in'] = True
        else:
            difference = self.state['current_bet'] - my_player['chips_in_pot']
            my_player['chips'] -= difference
            my_player['chips_in_pot'] = self.state['current_bet']
            self.state['pot'] += difference

        self.createHandHistory(username + ' calls')

        self.rotateSpotlight(username)
    
    def bet(self, data):
        username = data['username']
        raise_amount = int(data['chipsInPot'])
        my_player = self.state['players'][username]

        # if player enters amount greater than his stack, he automatically goes all in
        if raise_amount >= my_player['chips']:
            raise_amount = my_player['chips'] + my_player['chips_in_pot']
            my_player['all_in'] = True

        self.createHandHistory(username + ' bets ' + str(raise_amount))

        self.state['current_bet'] = raise_amount
        difference = raise_amount - my_player['chips_in_pot']
        my_player['chips_in_pot'] += difference
        my_player['chips'] -= difference
        self.state['current_bet'] = raise_amount
        self.state['pot'] += difference

        # first we need to set the current last_to_act to false (instead of searching, setting all to false works fine)
        for the_username, the_player in self.state['players'].items():
            the_player['last_to_act'] = False
        
        previous_player = self.state['players'][my_player['previous_player']]
        while True:
            if previous_player['in_hand']:
                previous_player['last_to_act'] = True
                break
            else:
                previous_player = self.state['players'][previous_player['previous_player']]

        # rotate spotlight and determine who's last to act
        self.rotateSpotlight(username)
    
    def showdown(self):
        # convert cards to correct format for treys library
        first_card_board = self.state['community_cards'][0]['rank'] + self.state['community_cards'][0]['suit'].lower()
        second_card_board = self.state['community_cards'][1]['rank'] + self.state['community_cards'][1]['suit'].lower()
        third_card_board = self.state['community_cards'][2]['rank'] + self.state['community_cards'][2]['suit'].lower()
        fourth_card_board = self.state['community_cards'][3]['rank'] + self.state['community_cards'][3]['suit'].lower()
        fifth_card_board = self.state['community_cards'][4]['rank'] + self.state['community_cards'][4]['suit'].lower()
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
        for username, player in self.state['players'].items():
            if player['in_hand']:
                print(username, player)

                first_card = player['hole_cards'][0]['rank'] + player['hole_cards'][0]['suit'].lower()
                second_card = player['hole_cards'][1]['rank'] + player['hole_cards'][1]['suit'].lower()

                hand = [Card.new(first_card), Card.new(second_card)]
                player_result = {}
                player_result['score'] = evaluator.evaluate(board, hand)
                player_result['hand_class'] = evaluator.get_rank_class(player_result['score'])
                player_result['hand_class_string'] = evaluator.class_to_string(player_result['hand_class'])

                results[username] = player_result
        
        # we're going to loop through, finding the winner and paying out any side bets. we keep doing this until the winner does not have a side bet
        while True:
            # find the winner(s)
            winning_hand = min(results.values(), key = lambda value: value['score'])
            winners = {k for k, v in results.items() if v == winning_hand}
            print('winners ', winners)
            print('side pots ', self.state['side_pot'])


            # find minimum side pot of all winners
            if len(self.state['side_pot']) > 0:
                if len(set.intersection(winners, set(self.state['side_pot']))) > 0:
                    print('inside one')
                    minimum_side_pot_of_winners_username = min({k: v for k, v in self.state['side_pot'].items() if k in winners}, key=lambda item: self.state['side_pot'][item])
                    minimum_side_pot_of_winners = self.state['side_pot'][minimum_side_pot_of_winners_username]
                    print(minimum_side_pot_of_winners_username)
                else:
                    print('inside two')
                    minimum_side_pot_of_winners = self.state['pot']
                # split the pot if necessary
                payout = minimum_side_pot_of_winners/len(winners)
                print('payout ', payout)
                for winner in winners:
                    self.createHandHistory(winner + ' wins side pot of ' + str(payout) + ' with ' + results[winner]['hand_class_string'])
                    self.state['players'][winner]['chips'] += payout
                    self.state['pot'] -= payout
                # subract the side pot that is currently paying out from all other side pots. when a sidepot reaches 0, remove it
                for side_pot in dict(self.state['side_pot']):
                    self.state['side_pot'][side_pot] -= minimum_side_pot_of_winners
                    if self.state['side_pot'][side_pot] <= 0:
                        self.state['side_pot'].pop(side_pot)
                results.pop(minimum_side_pot_of_winners_username)
                # self.state['side_pot'].pop(minimum_side_pot_of_winners_username)
                winning_hand = 7463
                if len(self.state['side_pot']) < 1:
                    break
            else:
                # split the pot if necessary
                payout = self.state['pot']/len(winners)
                for winner in winners:
                    self.createHandHistory(winner + ' wins side pot of ' + str(payout) + ' with ' + results[winner]['hand_class_string'])
                    self.state['players'][winner]['chips'] += payout
                    self.state['pot'] -= payout
                break
        
        self.endHand(winner)