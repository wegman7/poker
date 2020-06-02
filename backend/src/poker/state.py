import random, copy

class Deck():

    def __init__(self):
        self.deck = []
        for i in range(52):
            self.deck.append(i)
        random.shuffle(self.deck)

    def dealCard(self):
        card_number = self.deck.pop(len(self.deck) - 1)
        suit_number = card_number % 4
        rank_number = card_number % 13

        card = {
            'suit': self.convert_numeric_to_suit[suit_number],
            'rank': self.convert_numeric_to_rank[rank_number]
        }

        return card
    
    def compareHighcards(self, high_cards):
        high_cards = copy.deepcopy(high_cards)
        cards = []
        for high_card in high_cards:
            high_card[0]['suit'] = self.convert_suit_to_numeric[high_card[0]['suit']]
            high_card[0]['rank'] = self.convert_rank_to_numeric[high_card[0]['rank']]
            cards.append(high_card[0])
        
        ranks = [card['rank'] for card in cards]
        highest_rank = max(ranks)
        cards = [card for card in cards if card['rank'] == highest_rank]

        suits = [card['suit'] for card in cards]
        highest_suit = max(suits)
        highest_card = [card for card in cards if card['suit'] == highest_suit][0]

        highest_card = {
            'suit': self.convert_numeric_to_suit[highest_card['suit']],
            'rank': self.convert_numeric_to_rank[highest_card['rank']]
        }

        return highest_card
    
    def compareHands(self, hands):
        print(hands)

    convert_numeric_to_rank = {
        0: '2',
        1: '3',
        2: '4',
        3: '5',
        4: '6',
        5: '7',
        6: '8',
        7: '9',
        8: 'T',
        9: 'J',
        10: 'Q',
        11: 'K',
        12: 'A'
    }

    convert_numeric_to_suit = {
        0: 'C',
        1: 'D',
        2: 'H',
        3: 'S'
    }

    convert_rank_to_numeric = {
        '2': 0,
        '3': 1,
        '4': 2,
        '5': 3,
        '6': 4,
        '7': 5,
        '8': 6,
        '9': 7,
        'T': 8,
        'J': 9,
        'Q': 10,
        'K': 11,
        'A': 12
    }

    convert_suit_to_numeric = {
        'C': 0,
        'D': 1,
        'H': 2,
        'S': 3
    }

BIG_BLIND = 2
SMALL_BLIND = 1

class State():

    def __init__(self):
        self.state = {
            'players': [None, None, None, None, None, None, None, None, None],
            'spotlight': None,
            'street': 'preflop',
            'community_cards': [],
            'big_blind': BIG_BLIND,
            'small_blind': SMALL_BLIND,
            'pot': 0,
            'current_bet': BIG_BLIND,
            'hand_in_action': False
        }

        self.convert_username_to_seat_id = {}
    
    def initializePlayer(self, username, seat_id, chips):

        self.convert_username_to_seat_id[username] = seat_id

        return {
            'username': username,
            'seat_id': seat_id,
            'chips': chips,
            'chips_in_pot': None,
            'time': None,
            'hole_cards': [],
            'spotlight': False,
            'sitting_out': False,
            'dealer': False,
            'draw_for_dealer': False,
            'small_blind': False,
            'big_blind': False,
            'in_hand': False,
            'last_to_act': False
        }
    
    def reserveSeat(self, data):

        username = data['username']
        seat_id = data['seatId']

        self.state['players'][seat_id] = {
            'username': username,
            'reserved': True,
            'sitting_out': True
        }

    def addPlayer(self, data):

        username = data['username']
        seat_id = data['seatId']
        chips = int(data['chips'])
        player = self.initializePlayer(username, seat_id, chips)

        self.state['players'][seat_id] = player

        if self.state['hand_in_action']:
            return None

        # if there are two or more players, start the game
        players_in_game = 0
        for player in self.state['players']:
            if player:
                if not player['sitting_out']:
                    players_in_game += 1
        if players_in_game > 1:
            self.startGame()
    
    def rotateDealerChip(self):
        dealer_is_next = False
        while True:
            for player in self.state['players']:
                if player:
                    if dealer_is_next:
                        player['dealer'] = True
                        player['last_to_act'] = True
                        return None
                    if player['dealer']:
                        player['dealer'] = False
                        player['last_to_act'] = False
                        dealer_is_next = True
    
    def startGame(self):
        print('starting game...')
        self.deck = Deck()
        
        cards = []
        for player in self.state['players']:
            if player:
                if not player['sitting_out']:
                    player['hole_cards'].append(self.deck.dealCard())
                    cards.append(player['hole_cards'])
        
        high_card = self.deck.compareHighcards(cards)
        
        for player in self.state['players']:
            if player:
                if not player['sitting_out']:
                    if player['hole_cards'][0] == high_card:
                        player['dealer'] = True
        
        self.newHand()

    def newHand(self):
        print('starting new hand...')

        total_players = [players for players in (active_player for active_player in self.state['players'] if active_player is not None) if players['in_hand'] == True]

        self.deck = Deck()
        for player in self.state['players']:
            if player:
                if not player['sitting_out']:
                    player['hole_cards'] = []
                    player['hole_cards'].append(self.deck.dealCard())
                    player['hole_cards'].append(self.deck.dealCard())
                    player['in_hand'] = True
                    if player['dealer']:
                        player['last_to_act'] = True
        
        players_in_game = 0
        for player in self.state['players']:
            if player:
                if not player['sitting_out']:
                    players_in_game += 1
        
        if players_in_game < 2:
            return None
        
        if players_in_game == 2:
            for player in self.state['players']:
                if player:
                    if not player['sitting_out']:
                        if player['dealer']:
                            player['small_blind'] = True
                            player['chips_in_pot'] = self.state['small_blind']
                            player['chips'] = player['chips'] - player['chips_in_pot']
                            player['spotlight'] = True
                            self.state['pot'] += player['chips_in_pot']
                        else:
                            player['big_blind'] = True
                            player['chips_in_pot'] = self.state['big_blind']
                            player['chips'] = player['chips'] - player['chips_in_pot']
                            self.state['pot'] += player['chips_in_pot']
            self.state['hand_in_action'] = True
        
        if players_in_game > 2:
            after_dealer = False
            after_small_blind = False
            after_big_blind = False
            while True:
                for player in (sitting_in for sitting_in in (not_empty for not_empty in self.state['players'] if not_empty is not None) if not sitting_in['sitting_out']):
                    if after_big_blind:
                        player['spotlight'] = True
                        self.state['hand_in_action'] = True
                        return None
                    if after_small_blind and not after_big_blind:
                        after_big_blind = True
                        player['big_blind'] = True
                        player['chips_in_pot'] = self.state['big_blind']
                        player['chips'] = player['chips'] - player['chips_in_pot']
                        self.state['pot'] += player['chips_in_pot']
                    if after_dealer and not after_small_blind:
                        after_small_blind = True
                        player['small_blind'] = True
                        player['chips_in_pot'] = self.state['small_blind']
                        player['chips'] = player['chips'] - player['chips_in_pot']
                        self.state['pot'] += player['chips_in_pot']
                    if player['dealer']:
                        after_dealer = True
    
    def dealStreet(self, street):
        total_players = [players for players in (active_player for active_player in self.state['players'] if active_player is not None) if players['in_hand'] == True]

        # reset current bet
        self.state['current_bet'] = 0
        # reset 'bet_amount', which is chips in front of each player
        for player in total_players:
            player['chips_in_pot'] = 0

        self.state['street'] = street
        if street == 'flop':
            number_of_cards = 3
        else:
            number_of_cards = 1
        for _ in range(number_of_cards):
            self.state['community_cards'].append(self.deck.dealCard())
        
        for player in total_players:
            player['spotlight'] = False
        after_dealer = False
        while True:
            for player in total_players:
                if after_dealer:
                    player['spotlight'] = True
                    return None
                if player['dealer']:
                    after_dealer = True
        
    
    def rotateSpotlight(self, my_player):
        print('rotating spotlight')
        # look for a player to the left of my_player to change spotlight to
        for player in (sitting_in for sitting_in in (not_empty for not_empty in self.state['players'] if not_empty is not None) if sitting_in['in_hand']):
            if player['seat_id'] > my_player['seat_id']:
                player['spotlight'] = True
                my_player['spotlight'] = False
                return None
        # if the next active player's seat_id is not higher than my_player, it must be the next lowest seat_id
        for player in (sitting_in for sitting_in in (not_empty for not_empty in self.state['players'] if not_empty is not None) if sitting_in['in_hand']):
            player['spotlight'] = True
            my_player['spotlight'] = False
            return None
    
    def endHand(self):
        winner = [player for player in (active_player for active_player in self.state['players'] if active_player is not None) if player['in_hand'] == True][0]
        # put all active chips in the pot, then return them to the winner
        winner['chips_in_pot'] = 0
        winner['chips'] += self.state['pot']
        winner['hole_cards'] = None
        # reset pot
        self.state['pot'] = 0
        self.state['hand_in_action'] = False

        total_players = [players for players in (active_player for active_player in self.state['players'] if active_player is not None) if players['in_hand'] == True]
        for player in total_players:
            player['last_to_act'] = False
        
        self.rotateDealerChip()
        self.newHand()
    
    def fold(self, data):
        username = data['username']
        my_player = self.state['players'][self.convert_username_to_seat_id[username]]
        my_player['spotlight'] = False
        my_player['in_hand'] = False
        my_player['chips_in_pot'] = 0
        my_player['hole_cards'] = None
        my_player['small_blind'] = False
        my_player['big_blind'] = False
        total_players = [players for players in (active_player for active_player in self.state['players'] if active_player is not None) if players['in_hand'] == True]
        if my_player['last_to_act']:
            for player in reversed(total_players):
                player['last_to_act'] = True
                break
        my_player['last_to_act'] = False
        if len(total_players) < 2:
            return self.endHand()
            print('ending hand')
        next_player = False

        self.rotateSpotlight(my_player)
    
    def check(self, data):
        print(data)
        print(self.state['street'])
        username = data['username']
        my_player = self.state['players'][self.convert_username_to_seat_id[username]]
        total_players = [players for players in (active_player for active_player in self.state['players'] if active_player is not None) if players['in_hand'] == True]

        if self.state['street'] == 'preflop':
            for player in total_players:
                player['small_blind'] = False
                player['big_blind'] = False
            self.dealStreet('flop')
        elif self.state['street'] == 'flop':
            # if current player is last to act, deal the next street
            if my_player['last_to_act']:
                print('acting last')
                return self.dealStreet('turn')
            self.rotateSpotlight(my_player)
        elif self.state['street'] == 'turn':
            # if current player is last to act, deal the next street
            if my_player['last_to_act']:
                print('acting last')
                return self.dealStreet('river')
            self.rotateSpotlight(my_player)
        else:
            # if current player is last to act on the river, we showdown
            if my_player['last_to_act']:
                self.showdown()
            self.rotateSpotlight(my_player)
    
    def call(self, data):
        print(data)
        username = data['username']
        my_player = self.state['players'][self.convert_username_to_seat_id[username]]

        difference = self.state['current_bet'] - my_player['chips_in_pot']
        my_player['chips'] -= difference
        my_player['chips_in_pot'] = self.state['current_bet']
        self.state['pot'] += difference

        # look at all players and see if they have matched the current bet, if so we deal the next street
        total_players = [players for players in (active_player for active_player in self.state['players'] if active_player is not None) if players['in_hand'] == True]
        for player in total_players:
            if player['chips_in_pot'] != self.state['current_bet']:
                return self.rotateSpotlight(my_player)
        
        if my_player['small_blind']:
            return self.rotateSpotlight(my_player)

        # reset 'chips_in_pot'
        total_players = [players for players in (active_player for active_player in self.state['players'] if active_player is not None) if players['in_hand'] == True]
        for player in total_players:
            player['chips_in_pot'] = 0
        
        if self.state['street'] == 'preflop':
            for player in total_players:
                player['small_blind'] = False
                player['big_blind'] = False
            self.dealStreet('flop')
        elif self.state['street'] == 'flop' or self.state['street'] == 'turn':
            self.dealStreet('turn/river')
        else:
            self.showdown()
    
    def bet(self, data):
        print(data)
        username = data['username']
        raise_amount = int(data['chipsInPot'])
        my_player = self.state['players'][self.convert_username_to_seat_id[username]]

        self.state['current_bet'] = raise_amount
        difference = raise_amount - my_player['chips_in_pot']
        my_player['chips_in_pot'] += difference
        my_player['chips'] -= difference
        self.state['current_bet'] = raise_amount
        self.state['pot'] += difference

        self.rotateSpotlight(my_player)
    
    def showdown(self):
        print('SHOWDOWN!!')