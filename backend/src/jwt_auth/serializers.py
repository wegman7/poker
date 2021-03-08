from rest_framework import serializers
from .models import User
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed, NotFound, PermissionDenied
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes, smart_str, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password'
        ]
    
    def validate(self, attrs):

        validate_password(attrs.get('password'))
        return attrs
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(max_length=255, min_length=3)
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)

    class Meta:
        model = User
        fields = [
            'email',
            'password',
            'tokens'
        ]

    def validate(self, attrs):

        email = attrs.get('email')
        password = attrs.get('password')

        user = auth.authenticate(email=email, password=password)

        if not user:
            raise AuthenticationFailed('Invalid credentials.')
        if not user.is_active:
            raise AuthenticationFailed('Account is disabled.')
        if not user.is_verified:
            raise AuthenticationFailed('You must verify your account.')

        return {
            'email': user.email,
            'username': user.username,
            'tokens': user.tokens
        }

class ResetPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField(max_length=68)
    
    def validate(self, attrs):

        email = attrs.get('email')
        if not User.objects.filter(email=email):
            raise NotFound
        return attrs

class SetNewPasswordSerializer(serializers.Serializer):

    password = serializers.CharField(max_length=68, write_only=True)
    token = serializers.CharField(min_length=1, max_length=68, write_only=True)
    uidb64 = serializers.CharField(min_length=1, max_length=68, write_only=True)

    def validate(self, attrs):

        password = attrs.get('password')
        token = attrs.get('token')
        uidb64 = attrs.get('uidb64')

        user_id = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.filter(id=user_id).first()
        if user:
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('Invalid token.', 401)
            validate_password(password)
            user.set_password(password)
            user.save()
            return user
        else:
            raise AuthenticationFailed('Invalid user.', 401)

class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField(max_length=68, write_only=True)
    new_password = serializers.CharField(max_length=68, write_only=True)
    email = serializers.EmailField(max_length=68)

    def validate(self, attrs):

        old_password = attrs.get('old_password')
        new_password = attrs.get('new_password')
        email = attrs.get('email')

        user = auth.authenticate(email=email, password=old_password)
        if not user:
            raise PermissionDenied('Invalid password.')

        validate_password(new_password)
        user.set_password(new_password)
        user.save()
        return attrs


class TestSerializer(serializers.Serializer):

    text = serializers.CharField()

    def validate(self, attrs):
        return attrs