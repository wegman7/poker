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
            'current_bet': BIG_BLIND,
            'hand_in_action': False
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
            'all_in': False
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
                        next_player = next_player['next_player']
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
                        player['chips_in_pot'] = self.state['small_blind']
                        player['chips'] = player['chips'] - player['chips_in_pot']
                        self.state['pot'] += player['chips_in_pot']
                    else:
                        player['big_blind'] = True
                        player['spotlight'] = False
                        player['last_to_act'] = True
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
                        next_player['chips_in_pot'] = self.state['small_blind']
                        next_player['chips'] = next_player['chips'] - next_player['chips_in_pot']
                        self.state['pot'] += next_player['chips_in_pot']
                        next_player['spotlight'] = False

                        next_next_player = self.state['players'][next_player['next_player']]
                        next_next_player['big_blind'] = True
                        next_next_player['last_to_act'] = True
                        next_next_player['chips_in_pot'] = self.state['big_blind']
                        next_next_player['chips'] = next_next_player['chips'] - next_next_player['chips_in_pot']
                        self.state['pot'] += next_next_player['chips_in_pot']

                        next_next_next_player = self.state['players'][next_next_player['next_player']]
                        next_next_next_player['spotlight'] = True
    
    def rotateSpotlight(self, username):
        player = self.state['players'][username]
        player['spotlight'] = False
        next_player = self.state['players'][player['next_player']]
        while True:
            if not next_player['in_hand']:
                next_player = self.state['players'][next_player['next_player']]
            else:
                next_player['spotlight'] = True
                break
    
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
        for username, player in self.state['players'].items():
            player['spotlight'] = False
            player['small_blind'] = False
            player['big_blind'] = False
            player['last_to_act'] = False
            if not player['sitting_out']:
                player['hole_cards'] = []
                player['hole_cards'].append(self.deck.dealCard())
                player['hole_cards'].append(self.deck.dealCard())
                player['in_hand'] = True
        
        number_of_players = 0
        for username, player in self.state['players'].items():
            if not player['sitting_out']:
                number_of_players += 1
        
        if number_of_players < 2:
            return None
        
        self.rotateDealerChip()
        self.postBlinds(number_of_players)

        self.state['current_bet'] = BIG_BLIND
        self.state['street'] = 'preflop'
        self.state['hand_in_action'] = True
    
    def dealStreet(self, street):
        # reset current bet
        self.state['current_bet'] = 0
        # reset 'chips_in_pot', spotlight and last to act
        for username, player in self.state['players'].items():
            player['chips_in_pot'] = 0
            player['spotlight'] = False
            player['last_to_act'] = False

        self.state['street'] = street
        if street == 'flop':
            number_of_cards = 3
        else:
            number_of_cards = 1
        for _ in range(number_of_cards):
            card = self.deck.dealCard()
            self.createHandHistory('Card dealt: ' + card['rank'] + card['suit'])
            self.state['community_cards'].append(card)
        
        # determine first and last to act
        for username, player in self.state['players'].items():
            if player['dealer']:
                player['last_to_act'] = True
                next_player = self.state['players'][player['next_player']]
                previous_player = self.state['players'][player['previous_player']]
                # determine first to act
                while True:
                    if next_player['in_hand']:
                        next_player['spotlight'] = True
                        break
                    else:
                        next_player = self.state['players'][next_player['next_player']]
                # determine last to act
                while True:
                    if player['in_hand']:
                        player['last_to_act'] = True
                        break
                    else:
                        if previous_player['in_hand']:
                            previous_player['last_to_act'] = True
                            break
                        else:
                            previous_player = self.state['players'][previous_player['previous_player']]
    
    def endHand(self, winner_username):
        winner = self.state['players'][winner_username]
        # put all active chips in the pot, then return them to the winner
        winner['chips_in_pot'] = 0
        winner['chips'] += self.state['pot']
        winner['hole_cards'] = []
        # reset pot
        self.state['pot'] = 0
        self.state['hand_in_action'] = False
        self.state['community_cards'] = []

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

        # if we're last to act, rotate last to act to the previous player
        if not my_player['last_to_act']:
            self.rotateSpotlight(username)
        # if current player is last to act, deal the next street
        else:
            if self.state['street'] == 'preflop':
                self.dealStreet('flop')
            elif self.state['street'] == 'flop':
                self.dealStreet('turn')
            elif self.state['street'] == 'turn':
                self.dealStreet('river')
            else:
                self.showdown()
    
    def check(self, data):
        username = data['username']
        my_player = self.state['players'][username]

        self.createHandHistory(username + ' checks')

        if not my_player['last_to_act']:
            self.rotateSpotlight(username)
        # if current player is last to act, deal the next street
        else:
            if self.state['street'] == 'preflop':
                self.dealStreet('flop')
            elif self.state['street'] == 'flop':
                self.dealStreet('turn')
            elif self.state['street'] == 'turn':
                self.dealStreet('river')
            else:
                self.showdown()
    
    def call(self, data):
        username = data['username']
        my_player = self.state['players'][username]

        # if player enters amount greater than his stack, he automatically goes all in
        if raise_amount > my_player['chips']:
            raise_amount = my_player['chips']
            my_player['all_in'] = True

        self.createHandHistory(username + ' calls')
        
        difference = self.state['current_bet'] - my_player['chips_in_pot']
        my_player['chips'] -= difference
        my_player['chips_in_pot'] = self.state['current_bet']
        self.state['pot'] += difference

        if not my_player['last_to_act']:
            self.rotateSpotlight(username)
        # if current player is last to act, deal the next street
        else:
            if self.state['street'] == 'preflop':
                self.dealStreet('flop')
            elif self.state['street'] == 'flop':
                self.dealStreet('turn')
            elif self.state['street'] == 'turn':
                self.dealStreet('river')
            else:
                self.showdown()
    
    def bet(self, data):
        username = data['username']
        raise_amount = int(data['chipsInPot'])
        my_player = self.state['players'][username]

        # if player enters amount greater than his stack, he automatically goes all in
        if raise_amount > my_player['chips']:
            raise_amount = my_player['chips']
            my_player['all_in'] = True

        self.createHandHistory(username + ' bets ' + str(raise_amount))

        self.state['current_bet'] = raise_amount
        difference = raise_amount - my_player['chips_in_pot']
        my_player['chips_in_pot'] += difference
        my_player['chips'] -= difference
        self.state['current_bet'] = raise_amount
        self.state['pot'] += difference

        # rotate spotlight and determine who's last to act
        self.rotateSpotlight(username)

        # first we need to set the current last_to_act to false (instead of searching, setting all to false works fine)
        for username, player in self.state['players'].items():
            player['last_to_act'] = False
        
        previous_player = self.state['players'][my_player['previous_player']]
        while True:
            if previous_player['in_hand']:
                previous_player['last_to_act'] = True
                break
            else:
                previous_player = self.state['players'][previous_player['previous_player']]
    
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

        # do the same thing for each actice player
        evaluator = Evaluator()
        winning_hand = 7463
        for username, player in self.state['players'].items():
            if player['in_hand']:

                first_card = player['hole_cards'][0]['rank'] + player['hole_cards'][0]['suit'].lower()
                second_card = player['hole_cards'][1]['rank'] + player['hole_cards'][1]['suit'].lower()

                hand = [Card.new(first_card), Card.new(second_card)]
                score = evaluator.evaluate(board, hand)

                if score < winning_hand:
                    winning_hand = score

                    hand_class = evaluator.get_rank_class(score)
                    hand_class_string = evaluator.class_to_string(hand_class)
                    winner = username
        self.createHandHistory(winner + ' wins ' + str(self.state['pot']) + ' with ' + hand_class_string)
        self.endHand(winner)