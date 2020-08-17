from django.contrib import admin

from .models import Message, Contact, Room, Avatar

admin.site.register(Message)
admin.site.register(Contact)
admin.site.register(Room)
admin.site.register(Avatar)