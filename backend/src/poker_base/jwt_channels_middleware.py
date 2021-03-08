from channels.db import database_sync_to_async
import jwt
from django.conf import settings
from jwt_auth.models import User
from django.contrib.auth.models import AnonymousUser

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except Exception:
        return AnonymousUser()

class JwtChannelsAuthMiddleware:

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):

        try:
            token = scope["subprotocols"][1]
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=settings.SIMPLE_JWT['ALGORITHM'])
            user_id = payload['user_id']
            scope['user'] = await get_user(user_id)
        except Exception:
            scope['user'] = AnonymousUser()

        return await self.app(scope, receive, send)