from poker.api.views import ContactViewSet, RoomViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'contact', ContactViewSet, basename='contact')
router.register(r'room', RoomViewSet, basename='room')
urlpatterns = router.urls