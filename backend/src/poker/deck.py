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