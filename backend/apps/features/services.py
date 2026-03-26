import uuid
from datetime import datetime, timezone
from typing import Optional

from boto3.dynamodb.conditions import Attr, Key

from config.dynamodb import get_table, FEATURES_TABLE, VOTES_TABLE

VALID_STATUSES = {"PENDING", "PLANNED", "IN_PROGRESS", "DONE"}


class FeatureService:
    def create_feature(
        self,
        title: str,
        description: str,
        author_id: str,
        author_name: str,
    ) -> dict:
        feature_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()

        item = {
            "PK": f"FEATURE#{feature_id}",
            "SK": "METADATA",
            "id": feature_id,
            "title": title,
            "description": description,
            "status": "PENDING",
            "authorId": author_id,
            "authorName": author_name,
            "voteCount": 0,
            "createdAt": created_at,
        }

        get_table(FEATURES_TABLE).put_item(Item=item)
        return self._strip_keys(item)

    def get_features(
        self,
        status: Optional[str] = None,
        sort: str = "top",
        page: int = 1,
        page_size: int = 10,
        user_id: Optional[str] = None,
    ) -> dict:
        table = get_table(FEATURES_TABLE)

        if status:
            response = table.query(
                IndexName="status-createdAt-index",
                KeyConditionExpression=Key("status").eq(status),
            )
            items = response.get("Items", [])
        else:
            response = table.scan(FilterExpression=Attr("SK").eq("METADATA"))
            items = response.get("Items", [])

        # Sort in Python
        if sort == "new":
            items.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
        else:  # top
            items.sort(key=lambda x: int(x.get("voteCount", 0)), reverse=True)

        total = len(items)
        start = (page - 1) * page_size
        page_items = items[start : start + page_size]

        # Enrich with hasVoted
        if user_id:
            page_items = self._attach_has_voted(page_items, user_id)
        else:
            for item in page_items:
                item["hasVoted"] = False

        return {
            "items": [self._strip_keys(i) for i in page_items],
            "total": total,
            "page": page,
            "page_size": page_size,
            "has_more": (start + page_size) < total,
        }

    def get_feature_by_id(
        self,
        feature_id: str,
        user_id: Optional[str] = None,
    ) -> Optional[dict]:
        response = get_table(FEATURES_TABLE).get_item(
            Key={"PK": f"FEATURE#{feature_id}", "SK": "METADATA"}
        )
        item = response.get("Item")
        if item is None:
            return None

        if user_id:
            item["hasVoted"] = self._has_voted(user_id, feature_id)
        else:
            item["hasVoted"] = False

        return self._strip_keys(item)

    def toggle_vote(self, feature_id: str, user_id: str) -> dict:
        votes_table = get_table(VOTES_TABLE)
        vote_key = {"PK": f"USER#{user_id}", "SK": f"FEATURE#{feature_id}"}

        existing = votes_table.get_item(Key=vote_key).get("Item")

        features_table = get_table(FEATURES_TABLE)
        feature_key = {"PK": f"FEATURE#{feature_id}", "SK": "METADATA"}

        if existing:
            # Remove vote
            votes_table.delete_item(Key=vote_key)
            response = features_table.update_item(
                Key=feature_key,
                UpdateExpression="ADD voteCount :delta",
                ExpressionAttributeValues={":delta": -1},
                ReturnValues="UPDATED_NEW",
            )
            vote_count = int(response["Attributes"]["voteCount"])
            return {"voted": False, "vote_count": vote_count}
        else:
            # Add vote
            votes_table.put_item(
                Item={
                    "PK": f"USER#{user_id}",
                    "SK": f"FEATURE#{feature_id}",
                    "userId": user_id,
                    "featureId": feature_id,
                }
            )
            response = features_table.update_item(
                Key=feature_key,
                UpdateExpression="ADD voteCount :delta",
                ExpressionAttributeValues={":delta": 1},
                ReturnValues="UPDATED_NEW",
            )
            vote_count = int(response["Attributes"]["voteCount"])
            return {"voted": True, "vote_count": vote_count}

    def update_status(self, feature_id: str, status: str) -> dict:
        if status not in VALID_STATUSES:
            raise ValueError(f"Invalid status: {status}")

        response = get_table(FEATURES_TABLE).update_item(
            Key={"PK": f"FEATURE#{feature_id}", "SK": "METADATA"},
            UpdateExpression="SET #s = :s",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={":s": status},
            ReturnValues="ALL_NEW",
        )
        return self._strip_keys(response["Attributes"])

    # ── Private helpers ──────────────────────────────────────────────────────

    def _has_voted(self, user_id: str, feature_id: str) -> bool:
        response = get_table(VOTES_TABLE).get_item(
            Key={"PK": f"USER#{user_id}", "SK": f"FEATURE#{feature_id}"}
        )
        return "Item" in response

    def _attach_has_voted(self, items: list, user_id: str) -> list:
        """Batch-check votes for a list of features for a given user."""
        if not items:
            return items

        votes_table = get_table(VOTES_TABLE)
        keys = [
            {"PK": f"USER#{user_id}", "SK": f"FEATURE#{item['id']}"}
            for item in items
        ]

        response = votes_table.meta.client.batch_get_item(
            RequestItems={
                VOTES_TABLE: {
                    "Keys": keys,
                    "ProjectionExpression": "SK",
                }
            }
        )

        voted_set: set = {
            vote_item["SK"].split("#", 1)[1]
            for vote_item in response.get("Responses", {}).get(VOTES_TABLE, [])
        }

        for item in items:
            item["hasVoted"] = item["id"] in voted_set

        return items

    def _strip_keys(self, item: dict) -> dict:
        """Remove DynamoDB internal keys (PK, SK) from a returned item."""
        return {k: v for k, v in item.items() if k not in ("PK", "SK")}
