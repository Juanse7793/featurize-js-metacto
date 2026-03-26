from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from apps.features.serializers import CreateFeatureSerializer, UpdateStatusSerializer
from apps.features.services import FeatureService

_feature_service = FeatureService()


class FeaturesListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request) -> Response:
        filter_status = request.query_params.get("status")
        sort = request.query_params.get("sort", "top")
        try:
            page = int(request.query_params.get("page", 1))
        except ValueError:
            page = 1

        user_id = None
        if request.user and getattr(request.user, "is_authenticated", False):
            user_id = request.user.id

        result = _feature_service.get_features(
            status=filter_status,
            sort=sort,
            page=page,
            user_id=user_id,
        )
        return Response(result)

    def post(self, request) -> Response:
        serializer = CreateFeatureSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "VALIDATION_ERROR", "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        feature = _feature_service.create_feature(
            title=serializer.validated_data["title"],
            description=serializer.validated_data["description"],
            author_id=request.user.id,
            author_name=request.user.email,
        )
        return Response(feature, status=status.HTTP_201_CREATED)


class FeatureVoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, feature_id: str) -> Response:
        result = _feature_service.toggle_vote(
            feature_id=feature_id,
            user_id=request.user.id,
        )
        return Response(result)


class FeatureStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, feature_id: str) -> Response:
        if request.user.role != "ADMIN":
            return Response(
                {"error": "FORBIDDEN", "message": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = UpdateStatusSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "VALIDATION_ERROR", "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        feature = _feature_service.update_status(
            feature_id=feature_id,
            status=serializer.validated_data["status"],
        )
        return Response(feature)
