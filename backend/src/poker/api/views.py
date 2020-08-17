from rest_framework import viewsets

from .serializers import ContactSerializer, RoomSerializer, AvatarSerializer
from poker.models import Contact, Room, Avatar

class ContactViewSet(viewsets.ModelViewSet):

    serializer_class = ContactSerializer
    queryset = Contact.objects.all()
    # lookup_field = 'username'

    # def get_queryset(self):
    #     queryset = Contact.objects.filter(user=self.request.user)
    #     return queryset

    # def partial_update(self, request, pk=None):
    #     print(request.data)

class RoomViewSet(viewsets.ModelViewSet):

    serializer_class = RoomSerializer
    queryset = Room.objects.all()

class AvatarViewSet(viewsets.ModelViewSet):

    serializer_class = AvatarSerializer
    queryset = Avatar.objects.all()