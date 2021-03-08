from django.urls import path
from .views import RegisterView, LoginView, VerifyEmailView, TestView, ResetPasswordView, ResetPasswordTokenCheckView, SetNewPasswordView, ChangePasswordView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', LoginView.as_view(), name="login"),
    path('email-verify/', VerifyEmailView.as_view(), name="email-verify"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('test/', TestView.as_view(), name='test'),
    path('reset-password/', ResetPasswordView.as_view(), name="reset-password"),
    path('reset-password/<uidb64>/<token>/', ResetPasswordTokenCheckView.as_view(), name="reset-password-confirm"),
    path('set-password/', SetNewPasswordView.as_view(), name="set-password"),
    path('change-password/', ChangePasswordView.as_view(), name='change-password')
]