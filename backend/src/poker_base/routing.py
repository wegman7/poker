from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
import poker.routing
from .jwt_channels_middleware import JwtChannelsAuthMiddleware

from poker.consumers import TitanConsumer, HenryConsumer

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': JwtChannelsAuthMiddleware(
        URLRouter(
            poker.routing.websocket_urlpatterns
        )
    ),
    "channel": ChannelNameRouter({
        "poker-Titan": TitanConsumer.as_asgi(),
        "poker-Henry": HenryConsumer.as_asgi()
        }),
})