from rest_framework import serializers

from apps.auth_app.services import UserService

_user_service = UserService()


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=2, max_length=50)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_password(self, value: str) -> str:
        if not any(ch.isdigit() for ch in value):
            raise serializers.ValidationError(
                "Password must contain at least one number."
            )
        return value

    def validate_email(self, value: str) -> str:
        if _user_service.get_user_by_email(value) is not None:
            raise serializers.ValidationError("A user with this email already exists.")
        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    role = serializers.CharField(read_only=True)
    createdAt = serializers.CharField(read_only=True)
