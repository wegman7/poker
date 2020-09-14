from django.contrib.auth.models import User
from django.db import models

class Avatar(models.Model):
    image = models.ImageField(default='default.png', upload_to='avatars')

    def __str__(self):
        return str(self.image)

class Contact(models.Model):
    user = models.ForeignKey(User, related_name='friends', on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', blank=True)
    avatar = models.ForeignKey(Avatar, on_delete=models.PROTECT, null=True, blank=True)
    # test = models.TextField(blank=True)

    def username(self):
        return self.user.username

    def friends_usernames(self):
        friends = []
        for friend in self.friends.all():
            friends.append(friend.user.username)
        return friends
    
    def avatar_url(self):
        # we still need to return a string if there is no avatar to avoid a rest framework error
        if not self.avatar:
            return 'no avatar'
        else:
            return str(self.avatar.image)
    
    def __str__(self):
        return self.user.username

class Message(models.Model):
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.contact.user.username

class Room(models.Model):
    participants = models.ManyToManyField(Contact)
    messages = models.ManyToManyField(Message, blank=True)
    name = models.TextField()

    def participants_usernames(self):
        participants = []
        for participant in self.participants.all():
            participants.append(participant.user.username)
        return participants

    def __str__(self):
        return '%s' % self.id