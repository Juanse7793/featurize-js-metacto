from django.urls import path

from apps.features.views import FeaturesListCreateView, FeatureVoteView, FeatureStatusView

urlpatterns = [
    path("", FeaturesListCreateView.as_view(), name="features-list-create"),
    path("<str:feature_id>/vote", FeatureVoteView.as_view(), name="feature-vote"),
    path("<str:feature_id>/status", FeatureStatusView.as_view(), name="feature-status"),
]
