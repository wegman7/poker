from rest_framework import viewsets

from .serializers import ContactSerializer, RoomSerializer
from poker.models import Contact, Room

class ContactViewSet(viewsets.ModelViewSet):

    serializer_class = ContactSerializer
    queryset = Contact.objects.all()

    # def get_queryset(self):
    #     queryset = Contact.objects.filter(user=self.request.user)
    #     return queryset

class RoomViewSet(viewsets.ModelViewSet):

    serializer_class = RoomSerializer
    queryset = Room.objects.all()