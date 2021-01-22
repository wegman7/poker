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

        return player

    def testStandingUpWhileDealer(self):
        game_engine = GameEngine('test')
        game_engine.start()
        
        player0 = self.createPlayer('player0', 0, 50)
        player1 = self.createPlayer('player1', 1, 50)
        player2 = self.createPlayer('player2', 2, 50)

        time.sleep(.2)

        game_engine.state.players[player0.username] = player0
        game_engine.state.players[player1.username] = player1
        game_engine.state.players[player2.username] = player2

        game_engine.decideIfGameShouldStart()

        game_engine.makeAction({'command': 'fold', 'username': 'player1'})

        time.sleep(.2)

        game_engine.makeAction({'command': 'stand_up', 'username': 'player1'})

        # game_engine.makeAction({'command': 'call', 'username': 'player2', 'chips': 50, 'chipsInPot': .5})

        time.sleep(.2)

        game_engine.makeAction({'command': 'fold', 'username': 'player2'})

        time.sleep(.2)

        print(game_engine.state.players['player0'].dealer)