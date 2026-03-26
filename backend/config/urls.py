from django.urls import path, include
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from config.dynamodb import get_table, USERS_TABLE


@require_GET
def health_check(request):
    try:
        table = get_table(USERS_TABLE)
        table.table_status  # triggers a DescribeTable call
        return JsonResponse({"status": "ok", "dynamodb": "connected"})
    except Exception as e:
        return JsonResponse({"status": "error", "detail": str(e)}, status=500)


urlpatterns = [
    path("api/health/", health_check, name="health-check"),
    path("api/auth/", include("apps.auth_app.urls")),
    path("api/features/", include("apps.features.urls")),
]
