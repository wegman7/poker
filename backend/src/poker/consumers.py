import json
import asyncio
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User
from channels.consumer import SyncConsumer
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
import copy, time

from .models import Contact, Message, Room


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.room_name = 'chat-' + self.scope['url_route']['kwargs']['room_name']
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)
        print('connected')
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        print('inside receive in ChatConsumer ', text_data)
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

class PlayerConsumer(AsyncWebsocketConsumer):
    groups = ["broadcast"]

    async def connect(self):
        self.room_name = 'poker-' + self.scope['url_route']['kwargs']['room_name']
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        print('connected')
        await self.channel_layer.send('poker_game', {
            'type': 'connectToTable',
            'room_name': self.room_name
        })
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        print('receive')
        data = json.loads(text_data)
        if data['command'] == 'disconnect':
            await self.disconnectFromRoom()
        else:
            await self.channel_layer.send('poker_game', {
                'type': 'makeAction',
                'data': data
            })
    
    async def sendMessage(self, event):
        print('sending state...')
        await self.send(text_data=event['text'])

    async def disconnectFromRoom(self):
        await self.close()

    async def disconnect(self, close_code):
        print('disconnect')
        # Called when the socket closes
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
    
    commands = {
        # 'fetch_state': returnState,
        'reserve': 'reserveSeat',
        'sit': 'addPlayer',
        'sit_in': 'sitIn',
        'sit_out': 'sitOut',
        'stand_up': 'standUp',
        'add_chips': 'addChips',
        'fold': 'fold',
        'check': 'check',
        'call': 'call',
        'bet': 'bet',
        'disconnect': disconnectFromRoom,
    }

class PokerGameConsumer(SyncConsumer):

    def __init__(self, *args, **kwargs):
        print('INIT')
        self.room_name = 'poker-5'
        self.state = State(self.room_name)
        self.state.start()

    def connectToTable(self, event):
        print('CONNECT', event)
        self.state.returnState()
    
    def makeAction(self, event):
        self.state.makeAction(event['data'])
    
    # def reserveSeat(self, event):
    #     self.state.reserveSeat(event['data'])
    #     # self.returnState(None)

    # def addPlayer(self, event):
    #     self.state.addPlayer(event['data'])
    #     # self.returnState(None)
    
    # def sitIn(self, event):
    #     self.state.sitIn(event['data'])
    #     # self.returnState(None)

    # def sitOut(self, event):
    #     self.state.sitOut(event['data'])
    #     # self.returnState(None)

    # def standUp(self, event):
    #     self.state.standUp(event['data'])
    #     # self.returnState(None)

    # def addChips(self, event):
    #     self.state.addChips(event['data'])
    #     # self.returnState(None)
    
    # def fold(self, event):
    #     self.statefold(event['data'])
    #     # self.returnState(None)
    
    # def check(self, event):
    #     self.state.check(event['data'])
    #     # self.returnState(None)
    
    # def call(self, event):
    #     self.state.call(event['data'])
    #     # self.returnState(None)
    
    # def bet(self, event):
    #     self.state.bet(event['data'])
    #     # self.returnState(None)