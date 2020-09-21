from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer), # maybe take off the '$' at the end?
    re_path(r'ws/poker/(?P<room_name>\w+)/$', consumers.PlayerConsumer)
]