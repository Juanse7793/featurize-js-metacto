from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

from apps.auth_app.services import UserService

_user_service = UserService()


class DynamoUser:
    """Minimal user object compatible with simplejwt's for_user()."""

    is_authenticated = True

    def __init__(self, user_id: str, email: str, role: str) -> None:
        self.id = user_id
        self.pk = user_id  # simplejwt reads .pk for the token subject
        self.email = email
        self.role = role

    def __str__(self) -> str:
        return self.email


class DynamoJWTAuthentication(JWTAuthentication):
    """
    Overrides get_user() to resolve the JWT user_id claim against DynamoDB
    instead of the Django ORM.
    """

    def get_user(self, validated_token) -> DynamoUser:  # type: ignore[override]
        user_id: str = validated_token.get("user_id")
        if not user_id:
            raise InvalidToken("Token contains no recognizable user identification")

        item = _user_service.get_user_by_id(user_id)
        if item is None:
            raise InvalidToken("No user found for this token")

        return DynamoUser(
            user_id=item["id"],
            email=item["email"],
            role=item["role"],
        )
