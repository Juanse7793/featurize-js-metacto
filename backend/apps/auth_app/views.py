from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from apps.auth_app.backends import DynamoUser
from apps.auth_app.serializers import RegisterSerializer, LoginSerializer, UserSerializer
from apps.auth_app.services import UserService

_user_service = UserService()


def _tokens_for_user(user: DynamoUser) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request) -> Response:
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "VALIDATION_ERROR", "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_data = _user_service.create_user(
                name=serializer.validated_data["name"],
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )
        except ValueError:
            return Response(
                {"error": "EMAIL_TAKEN", "message": "A user with this email already exists.", "field": "email"},
                status=status.HTTP_409_CONFLICT,
            )

        dynamo_user = DynamoUser(
            user_id=user_data["id"],
            email=user_data["email"],
            role=user_data["role"],
        )
        tokens = _tokens_for_user(dynamo_user)

        return Response(
            {"user": user_data, **tokens},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request) -> Response:
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "VALIDATION_ERROR", "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        item = _user_service.get_user_by_email(email)
        if item is None or not _user_service.verify_password(password, item["password_hash"]):
            return Response(
                {"error": "INVALID_CREDENTIALS", "message": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user_data = {k: v for k, v in item.items() if k not in ("PK", "password_hash")}
        dynamo_user = DynamoUser(
            user_id=item["id"],
            email=item["email"],
            role=item["role"],
        )
        tokens = _tokens_for_user(dynamo_user)

        return Response({"user": user_data, **tokens}, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request) -> Response:
        dynamo_user: DynamoUser = request.user
        item = _user_service.get_user_by_id(dynamo_user.id)
        if item is None:
            return Response(
                {"error": "NOT_FOUND", "message": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user_data = {k: v for k, v in item.items() if k not in ("PK", "password_hash")}
        return Response(user_data, status=status.HTTP_200_OK)
