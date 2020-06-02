from django.contrib.auth.models import User
from rest_framework import serializers

from poker.models import Contact, Message, Room # , Chat

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'username'
        )

class ContactSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Contact
        # fields = ('__all__')
        fields = (
            'user',
            'friends',
            'friends_usernames'
        )
        # depth = 2

class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ('__all__')

class RoomSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Room
        fields = (
            'id',
            'participants',
            'participants_usernames'
        )