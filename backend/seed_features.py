#!/usr/bin/env python
"""Seed the featurize-features table with 8 sample features."""
import os
import sys
import uuid
from datetime import datetime, timezone, timedelta

import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.auth_app.services import UserService
from apps.features.services import FeatureService
from config.dynamodb import get_table, FEATURES_TABLE

user_service = UserService()
feature_service = FeatureService()

admin = user_service.get_user_by_email("admin@featurize.com")
if admin is None:
    print("Error: admin@featurize.com not found. Run seed.py first.")
    sys.exit(1)

regular_user = user_service.get_user_by_email("user@featurize.com")
if regular_user is None:
    print("Error: user@featurize.com not found. Run seed.py first.")
    sys.exit(1)

FEATURES = [
    {
        "title": "Dark mode support",
        "description": "Add a system-wide dark mode that respects the OS preference and allows manual toggle. Should persist across sessions.",
        "status": "PENDING",
        "voteCount": 12,
        "days_ago": 5,
    },
    {
        "title": "Export to CSV",
        "description": "Allow users to export any data table to CSV with a single click. Should support filtering and custom column selection.",
        "status": "PLANNED",
        "voteCount": 28,
        "days_ago": 10,
    },
    {
        "title": "Mobile app",
        "description": "Native iOS and Android apps with full feature parity to the web version plus push notifications for status updates.",
        "status": "IN_PROGRESS",
        "voteCount": 45,
        "days_ago": 20,
    },
    {
        "title": "API rate limiting dashboard",
        "description": "A dedicated dashboard showing API usage, rate limit consumption, and historical request graphs per API key.",
        "status": "PENDING",
        "voteCount": 8,
        "days_ago": 3,
    },
    {
        "title": "Bulk actions on table rows",
        "description": "Select multiple rows in any data table and perform bulk operations like delete, export, or status change in a single action.",
        "status": "PLANNED",
        "voteCount": 19,
        "days_ago": 8,
    },
    {
        "title": "Two-factor authentication",
        "description": "Support TOTP-based 2FA via authenticator apps (Google Authenticator, Authy) and backup codes for account recovery.",
        "status": "DONE",
        "voteCount": 67,
        "days_ago": 45,
    },
    {
        "title": "Custom webhook integrations",
        "description": "Configure outbound webhooks triggered on specific events with custom payloads, retry logic, and delivery logs.",
        "status": "PENDING",
        "voteCount": 5,
        "days_ago": 1,
    },
    {
        "title": "Real-time collaboration",
        "description": "See live cursors and edits from teammates in shared documents and dashboards without needing to refresh the page.",
        "status": "IN_PROGRESS",
        "voteCount": 33,
        "days_ago": 15,
    },
]

table = get_table(FEATURES_TABLE)
now = datetime.now(timezone.utc)
seeded_ids: list[str] = []

for feat in FEATURES:
    feature_id = str(uuid.uuid4())
    created_at = (now - timedelta(days=feat["days_ago"])).isoformat()

    item = {
        "PK": f"FEATURE#{feature_id}",
        "SK": "METADATA",
        "id": feature_id,
        "title": feat["title"],
        "description": feat["description"],
        "status": feat["status"],
        "authorId": admin["id"],
        "authorName": admin["name"],
        "voteCount": feat["voteCount"],
        "createdAt": created_at,
    }

    table.put_item(Item=item)
    seeded_ids.append(feature_id)
    print(f"  Created: {feat['title']} ({feat['status']}, {feat['voteCount']} votes)")

print("\nFeatures seeded successfully")

# Add votes for user@featurize.com on features at index 0, 2, 4, 6 (1st, 3rd, 5th, 7th)
print("\nAdding votes for user@featurize.com...")
user_id = regular_user["id"]
for idx in [0, 2, 4, 6]:
    feature_id = seeded_ids[idx]
    feature_service.toggle_vote(user_id=user_id, feature_id=feature_id)
    print(f"  Voted on feature #{idx + 1}: {FEATURES[idx]['title']}")

print("\nVotes seeded successfully")
