import uuid
from datetime import datetime, timezone

import bcrypt
from boto3.dynamodb.conditions import Attr

from config.dynamodb import get_table, USERS_TABLE


class UserService:
    def create_user(
        self,
        name: str,
        email: str,
        password: str,
        role: str = "USER",
    ) -> dict:
        if self.get_user_by_email(email) is not None:
            raise ValueError("EMAIL_TAKEN")

        user_id = str(uuid.uuid4())
        password_hash = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt(rounds=12)
        ).decode("utf-8")
        created_at = datetime.now(timezone.utc).isoformat()

        item = {
            "PK": f"USER#{email}",
            "id": user_id,
            "name": name,
            "email": email,
            "password_hash": password_hash,
            "role": role,
            "createdAt": created_at,
        }

        table = get_table(USERS_TABLE)
        table.put_item(Item=item)

        return {
            "id": user_id,
            "name": name,
            "email": email,
            "role": role,
            "createdAt": created_at,
        }

    def get_user_by_email(self, email: str) -> dict | None:
        table = get_table(USERS_TABLE)
        response = table.get_item(Key={"PK": f"USER#{email}"})
        return response.get("Item")

    def get_user_by_id(self, user_id: str) -> dict | None:
        table = get_table(USERS_TABLE)
        response = table.scan(FilterExpression=Attr("id").eq(user_id))
        items = response.get("Items", [])
        return items[0] if items else None

    def verify_password(self, plain: str, hashed: str) -> bool:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
