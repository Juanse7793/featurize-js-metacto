#!/usr/bin/env python
"""
Seed script — creates initial admin and regular user in DynamoDB.
Run from /backend with the venv activated:
    python seed.py
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.auth_app.services import UserService  # noqa: E402

_service = UserService()

SEEDS = [
    {
        "name": "Admin",
        "email": "admin@featurize.com",
        "password": "Admin1234!",
        "role": "ADMIN",
    },
    {
        "name": "Juan",
        "email": "user@featurize.com",
        "password": "User1234!",
        "role": "USER",
    },
]


def main() -> None:
    for seed in SEEDS:
        if _service.get_user_by_email(seed["email"]) is not None:
            print(f"Skipping {seed['email']} — already exists.")
            continue
        _service.create_user(
            name=seed["name"],
            email=seed["email"],
            password=seed["password"],
            role=seed["role"],
        )
        print(f"Created {seed['role']} user: {seed['email']}")

    print("Seed completed.")


if __name__ == "__main__":
    main()
