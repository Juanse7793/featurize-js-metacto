#!/usr/bin/env python
"""Clear all items from the featurize-features DynamoDB table."""
import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from config.dynamodb import get_table, FEATURES_TABLE

table = get_table(FEATURES_TABLE)

scan = table.scan(ProjectionExpression="PK, SK")
items = scan.get("Items", [])

count = 0
with table.batch_writer() as batch:
    for item in items:
        batch.delete_item(Key={"PK": item["PK"], "SK": item["SK"]})
        count += 1

print(f"Deleted {count} items from {FEATURES_TABLE}")
