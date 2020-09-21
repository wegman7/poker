from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
import poker.routing

from poker.consumers import PokerGameConsumer

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            poker.routing.websocket_urlpatterns
        )
    ),
    "channel": ChannelNameRouter({"poker_game": PokerGameConsumer}),
})