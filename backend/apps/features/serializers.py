from rest_framework import serializers

VALID_STATUSES = ["PENDING", "PLANNED", "IN_PROGRESS", "DONE"]


class CreateFeatureSerializer(serializers.Serializer):
    title = serializers.CharField(min_length=3, max_length=100)
    description = serializers.CharField(min_length=10, max_length=500)


class UpdateStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=VALID_STATUSES)


class FeatureSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    status = serializers.CharField(read_only=True)
    authorId = serializers.CharField(read_only=True)
    authorName = serializers.CharField(read_only=True)
    voteCount = serializers.IntegerField(read_only=True)
    hasVoted = serializers.BooleanField(read_only=True)
    createdAt = serializers.CharField(read_only=True)
