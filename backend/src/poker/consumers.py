import json
import asyncio
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User
from channels.generic.websocket import WebsocketConsumer
import copy, time

from .models import Contact, Message, Room


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.room_name = 'chat-' + self.scope['url_route']['kwargs']['room_name']
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)
        print('connected')
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        
        self.commands[data['command']](self, data)

    def retreiveMessages(self, data):
        room_id = data['room_id']
        chat = Room.objects.get(id=room_id)
        messages = reversed(chat.messages.all().order_by('-timestamp')[:100])
        data = []
        for message in messages:
            data.append({
                'id': message.id,
                'author': message.contact.user.username,
                'content': message.content,
                'timestamp': str(message.timestamp)
            })
        data = {
            'type': 'old_messages',
            'messages': data
        }
        self.sendMessage(data)
    
    def messageToDict(self, message):
        return {
            'id': message.id,
            'author': message.contact.user.username,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }
    
    def createMessage(self, data):
        user = User.objects.get(username=data['author'])
        contact = Contact.objects.get(user=user)
        room_id = self.room_name.replace('chat-', '')
        chat = Room.objects.get(id=room_id)
        new_message = Message.objects.create(
            contact = contact,
            content = data['content']
        )
        chat.messages.add(new_message)
        new_message_json = json.dumps(self.messageToDict(new_message))
        content = {
            'type': 'new_message',
            'message': new_message_json
        }
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": "sendMessageToGroup",
                "text": json.dumps(content)
            }
        )
    
    def sendMessageToGroup(self, event):
        self.send(text_data=event["text"])
    
    def sendMessage(self, data):
        data_to_send = json.dumps(data)
        self.send(text_data=data_to_send)

    def disconnectFromChat(self, data):
        self.close()
    
    commands = {
        'fetch_messages': retreiveMessages,
        'new_message': createMessage,
        'disconnect': disconnectFromChat
    }

    def disconnect(self, close_code):
        # Called when the socket closes
        async_to_sync(self.channel_layer.group_discard)(self.room_name, self.channel_name)
        pass

from .state import State

TIME_BANK = 30

class PokerConsumer(WebsocketConsumer):
    groups = ["broadcast"]

    state = {}        

    def connect(self):
        self.room_name = 'poker-' + self.scope['url_route']['kwargs']['room_name']
        if self.room_name not in self.state:
            self.state[self.room_name] = State(self.createHandHistory)
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)
        print('connected')
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)
    
    def reserveSeat(self, data):
        self.state[self.room_name].reserveSeat(data)
        self.returnState(None)

    def addPlayer(self, data):
        self.state[self.room_name].addPlayer(data)
        self.returnState(None)
    
    def sitIn(self, data):
        self.state[self.room_name].sitIn(data)
        self.returnState(None)

    def sitOut(self, data):
        self.state[self.room_name].sitOut(data)
        self.returnState(None)

    def standUp(self, data):
        self.state[self.room_name].standUp(data)
        self.returnState(None)

    def addChips(self, data):
        self.state[self.room_name].addChips(data)
        self.returnState(None)
    
    def fold(self, data):
        self.state[self.room_name].fold(data)
        self.returnState(None)
    
    def check(self, data):
        self.state[self.room_name].check(data)
        self.returnState(None)
    
    def call(self, data):
        self.state[self.room_name].call(data)
        self.returnState(None)
    
    def bet(self, data):
        self.state[self.room_name].bet(data)
        self.returnState(None)

    def returnState(self, data):
        print('sending state...')
        content = {
            'type': 'state',
            'state': self.state[self.room_name].state
        }
        self.initializeMessageToGroup(content)
    
    def createHandHistory(self, data):
        user = User.objects.get(username='Dealer')
        contact = Contact.objects.get(user=user)
        room_id = self.room_name.replace('poker-', '')
        chat = Room.objects.get(id=room_id)
        new_message = Message.objects.create(
            contact = contact,
            content = data
        )
        chat.messages.add(new_message)
        new_message_json = json.dumps(self.messageToDict(new_message))
        content = {
            'type': 'new_message',
            'message': new_message_json
        }
        # this sends the new message to the chat consumer
        async_to_sync(self.channel_layer.group_send)(
            self.room_name.replace('poker-', 'chat-'),
            {
                "type": "sendMessageToGroup",
                "text": json.dumps(content)
            }
        )
    
    def messageToDict(self, message):
        return {
            'id': message.id,
            'author': message.contact.user.username,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }
    
    def initializeMessageToGroup(self, content):
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": "sendMessageToGroup",
                "text": json.dumps(content)
            }
        )
    
    def sendMessageToGroup(self, event):
        print('sending message to group...')
        self.send(text_data=event["text"])
    
    def sendMessage(self, data):
        data_to_send = json.dumps(data)
        self.send(text_data=data_to_send)

    def disconnectFromChat(self, data):
        self.close()

    def disconnect(self, close_code):
        # Called when the socket closes
        async_to_sync(self.channel_layer.group_discard)(self.room_name, self.channel_name)
        pass
    
    commands = {
        'fetch_state': returnState,
        'reserve': reserveSeat,
        'sit': addPlayer,
        'sit_in': sitIn,
        'sit_out': sitOut,
        'stand_up': standUp,
        'add_chips': addChips,
        'fold': fold,
        'check': check,
        'call': call,
        'bet': bet,
        'disconnect': disconnectFromChat,
    }
