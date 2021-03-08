from rest_framework.views import APIView
from rest_framework import authentication, permissions, generics, status
from rest_framework.response import Response
from .serializers import RegisterSerializer, LoginSerializer, ResetPasswordSerializer, SetNewPasswordSerializer, ChangePasswordSerializer, TestSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
import jwt
from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes, smart_str, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.shortcuts import redirect
import threading
import os
from dotenv import load_dotenv
load_dotenv()

class RegisterView(generics.GenericAPIView):

    serializer_class = RegisterSerializer

    def post(self, request):

        user_fields = request.data
        serializer = self.serializer_class(data=user_fields)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data

        # get user instance and use it to generate a token
        user = User.objects.get(email=user_data['email'])
        token = RefreshToken.for_user(user).access_token

        current_site = get_current_site(request).domain
        relativeLink = reverse('email-verify')
        
        absurl = 'http://' + current_site + relativeLink + '?token=' + str(token)
        email_body = 'Hi ' + user.username + ', please use link below to verify your account.\n\n' + absurl
        data = { 
            'to': user.email,
            'subject': 'Verify your account',
            'body': email_body
        }

        send_email = threading.Thread(target=Util.send_email, args=(data,))
        send_email.start()

        return Response(user_data, status=status.HTTP_201_CREATED)

class VerifyEmailView(generics.GenericAPIView):

    def get(self, request):
        
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=settings.SIMPLE_JWT['ALGORITHM'])
            user = User.objects.get(id=payload['user_id'])
            if not user.is_verified:
                user.is_verified = True
                user.save()

            return HttpResponse("<div>Successfully activated account.</div>")

        except jwt.ExpiredSignatureError as identifier:
            return HttpResponse("<div style='color: red;'>Error: Account activation expired.</div>")

        except jwt.exceptions.DecodeError as identifier:
            return HttpResponse("<div style='color: red;'>Error: Invalid token.</div>")

class LoginView(generics.GenericAPIView):

    serializer_class = LoginSerializer

    def post(self, request):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class ResetPasswordView(generics.GenericAPIView):

    serializer_class = ResetPasswordSerializer

    def post(self, request):
        
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer_data = serializer.data

        user = User.objects.get(email=serializer_data['email'])
        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)

        current_site = get_current_site(request).domain
        relativeLink = reverse('reset-password-confirm', kwargs={'uidb64': uidb64, 'token': token})

        absurl = 'http://' + current_site + relativeLink
        email_body = 'Hi ' + user.username + ', please use link below to reset your password.\n\n' + absurl
        data = { 
            'to': user.email,
            'subject': 'Reset your password',
            'body': email_body
        }

        send_email = threading.Thread(target=Util.send_email, args=(data,))
        send_email.start()

        return Response({'Success': 'An email has been sent with a link to reset your password.'}, status=status.HTTP_200_OK)

class ResetPasswordTokenCheckView(generics.GenericAPIView):

    def get(self, request, uidb64, token):
        
        user_id = smart_str(urlsafe_base64_decode(uidb64))
        user = User.objects.filter(id=user_id).first()
        frontend_url = os.environ.get('FRONTEND_URL')

        if user:
            if not PasswordResetTokenGenerator().check_token(user, token):
                # return Response({'Error': 'Token is not valid, please request a new one.'}, status=status.HTTP_401_UNAUTHORIZED)
                return redirect(frontend_url + 'reset-password/' + '?token_valid=false' + '&user=null' + '&token=null' + '&error=Invalid token.')

            # return Response({'Success': 'true', 'Message': 'Credentials valid', 'uidb64': uidb64, 'token': token}, status=status.HTTP_200_OK)
            return redirect(frontend_url + 'reset-password/' + '?token_valid=true' + '&user=' + uidb64 + '&token=' + token + '&error=null')

        else:
            # return Response({'Error': 'Token is not valid, please request a new one.'}, status=status.HTTP_401_UNAUTHORIZED)
            return redirect(frontend_url + 'reset-password/' + '?token_valid=false' + '&user=null' + '&token=null' + '&error=Invalid user.')

class SetNewPasswordView(generics.GenericAPIView):

    serializer_class = SetNewPasswordSerializer

    def patch(self, request):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response({'Success': True, 'Message': 'Password reset success.'}, status=status.HTTP_200_OK)

class ChangePasswordView(generics.GenericAPIView):

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def patch(self, request):

        request.data['email'] = request.user.email

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response({'Success': True, 'Message': 'Successfully changed password.'}, status=status.HTTP_200_OK)

class TestView(generics.GenericAPIView):

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TestSerializer

    def get(self, request):

        return HttpResponse("testing...")
    
    def post(self, request):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid()
        print(serializer.data)

        return Response("test complete")