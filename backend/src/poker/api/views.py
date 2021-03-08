from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from .serializers import ContactSerializer, RoomSerializer, AvatarSerializer, ContactDetailSerializer
from poker.models import Contact, Room, Avatar
from poker.permissions import IsOwner

class ContactViewSet(viewsets.ModelViewSet):

    serializer_class = ContactSerializer
    queryset = Contact.objects.all()


class ChangeContactAvatarView(generics.GenericAPIView):

    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request):

        contact = Contact.objects.filter(user=request.user.id).first()
        if not contact:
            raise NotFound

        avatar = Avatar.objects.filter(id=request.data['id']).first()
        if not avatar:
            raise NotFound
        contact.avatar = avatar
        contact.save()
        
        return Response(status=status.HTTP_200_OK)

class ContactDetailView(generics.GenericAPIView):

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ContactDetailSerializer

    def get(self, request):

        contact = Contact.objects.filter(user=request.user.id).first()
        if not contact:
            raise NotFound

        
        data = {
            'username': request.user.username,
            'avatar': str(contact.avatar)
        }

        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class RoomViewSet(viewsets.ModelViewSet):

    serializer_class = RoomSerializer
    queryset = Room.objects.all()

class AvatarViewSet(viewsets.ModelViewSet):

    serializer_class = AvatarSerializer
    queryset = Avatar.objects.all()