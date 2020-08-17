from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Contact, Avatar

@receiver(post_save, sender=User)
def create_contact(sender, instance, created, **kwargs):
    print('inside signals')
    if created:
        avatar = Avatar.objects.get(image='avatars/default.jpg')
        contact = Contact.objects.create(user=instance)
        contact.avatar = avatar
        contact.save()

# @receiver(post_save, sender=User)
# def save_contact(sender, instance, **kwargs):
#     print(instance)
#     instance.contact.save()