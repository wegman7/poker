from django.contrib.auth.models import User
from rest_framework import serializers

from poker.models import Contact, Message, Room, Avatar

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
            # 'username',
            'friends',
            'friends_usernames',
            'avatar',
            'avatar_url'
            # 'test'
        )
        # lookup_field = 'username'
        # extra_kwargs = {
        #     'url': {'lookup_field': 'username'}
        # }

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
            'participants_usernames',
            'name'
        )

class AvatarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Avatar
        fields = ('__all__')