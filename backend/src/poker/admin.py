from django.contrib import admin

from .models import Message, Contact, Room

admin.site.register(Message)
admin.site.register(Contact)
admin.site.register(Room)