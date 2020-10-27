from django.urls import path, include
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import url
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('poker.api.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^.*', TemplateView.as_view(template_name='index.html'))
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)