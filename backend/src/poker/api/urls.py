from django.urls import path
from poker.api.views import ContactViewSet, RoomViewSet, AvatarViewSet, ContactDetailView, ChangeContactAvatarView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'contact', ContactViewSet, basename='contact')
router.register(r'room', RoomViewSet, basename='room')
router.register(r'avatar', AvatarViewSet, basename='avatar')
urlpatterns = router.urls

urlpatterns += [
    path('contact-details/', ContactDetailView.as_view(), name="contact-details"),
    path('change-avatar/', ChangeContactAvatarView.as_view(), name="change-avatar")
]