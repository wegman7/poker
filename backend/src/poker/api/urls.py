from poker.api.views import ContactViewSet, RoomViewSet, AvatarViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'contact', ContactViewSet, basename='contact')
router.register(r'room', RoomViewSet, basename='room')
router.register(r'avatar', AvatarViewSet, basename='avatar')
urlpatterns = router.urls