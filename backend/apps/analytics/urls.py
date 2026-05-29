from django.urls import path
from .views import ProjectAnalyticsView, SystemDashboardStatsView

urlpatterns = [
    path('project/<int:project_id>/', ProjectAnalyticsView.as_view(), name='analytics_project_report'),
    path('system-stats/', SystemDashboardStatsView.as_view(), name='analytics_system_stats'),
]
