from django.test import TestCase
from .game_engine import GameEngine, Player, State
import time

# may need to add a small delay for the game_engine to be able catch up. also need to comment out the contents of createHandHistory
class PokerTests(TestCase):

    def createPlayer(self, username, seat_id, chips):

        player = Player()
        player.username = username
        player.seat_id = seat_id
        player.sitting_out = False
        player.in_hand = False
        player.dealer = False
        player.sit_in_after_hand = False
        player.sit_out_after_hand = False
        player.stand_up_after_hand = False
        player.add_chips_after_hand = 0
        player.dealer_placeholder = False
        player.chips = chips
        player.chips_in_pot = 0
        player.time = None
        player.hole_cards = []
        player.spotlight = False
        player.draw_for_dealer = False
        player.small_blind = False
        player.big_blind = False
        player.last_to_act = False
        player.previous_player = None
        player.next_player = None
        player.all_in = False
        player.reserved = False
        player.avatar = 'avatar'
        player.max_win = None

        return player

    def isShowdownCorrect(self):
        game_engine = GameEngine('test')
        game_engine.start()
        
        player0 = self.createPlayer('player0', 0, 500)
        player1 = self.createPlayer('player1', 1, 200)
        player2 = self.createPlayer('player2', 2, 100)
        player3 = self.createPlayer('player3', 3, 50)

        time.sleep(.2)

        game_engine.state.players[player0.username] = player0
        game_engine.state.players[player1.username] = player1
        game_engine.state.players[player2.username] = player2
        game_engine.state.players[player3.username] = player3

        game_engine.decideIfGameShouldStart()

        time.sleep(.2)

        game_engine.makeAction({'command': 'bet', 'username': 'player0', 'chips': 500, 'chipsInPot': 500})

        time.sleep(.2)

        game_engine.makeAction({'command': 'call', 'username': 'player1', 'chips': 200, 'chipsInPot': 0})

        time.sleep(.2)

        game_engine.makeAction({'command': 'call', 'username': 'player2', 'chips': 99.75, 'chipsInPot': 0.25})

        time.sleep(.2)

        game_engine.makeAction({'command': 'call', 'username': 'player3', 'chips': 49.5, 'chipsInPot': 0.5})

        time.sleep(.4)

        # PUT THIS AT THE END OF EVALUATEHANDS
        # results = {'player0': {'score': 1, 'hand_class': 8, 'hand_class_string': 'Pair'}, 
        #     'player1': {'score': 1, 'hand_class': 8, 'hand_class_string': 'Pair'},
        #     'player2': {'score': 2, 'hand_class': 8, 'hand_class_string': 'Pair'},
        #     'player3': {'score': 1, 'hand_class': 8, 'hand_class_string': 'Pair'}
        # }

    def isTimebankWorking(self):

        game_engine = GameEngine('test')
        game_engine.start()
        
        player0 = self.createPlayer('player0', 0, 50)
        player1 = self.createPlayer('player1', 1, 50)

        time.sleep(.2)

        game_engine.state.players[player0.username] = player0
        game_engine.state.players[player1.username] = player1

        game_engine.decideIfGameShouldStart()

        time.sleep(.4)