from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Contact, Avatar

@receiver(post_save, sender=User)
def create_contact(sender, instance, created, **kwargs):
    if created:
        avatar = Avatar.objects.get(image='avatars/default.png')
        contact = Contact.objects.create(user=instance, pk=instance.pk, id=instance.id)
        contact.avatar = avatar
        contact.save()

# @receiver(post_save, sender=User)
# def save_contact(sender, instance, **kwargs):
#     print(instance)
#     instance.contact.save()