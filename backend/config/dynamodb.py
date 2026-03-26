import boto3
from decouple import config

USERS_TABLE = "featurize-users"
FEATURES_TABLE = "featurize-features"
VOTES_TABLE = "featurize-votes"

_dynamodb = boto3.resource(
    "dynamodb",
    aws_access_key_id=config("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=config("AWS_SECRET_ACCESS_KEY"),
    region_name=config("AWS_REGION", default="us-east-1"),
)


def get_table(table_name: str):
    return _dynamodb.Table(table_name)
