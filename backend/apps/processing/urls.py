from django.urls import path
from .views import InterpolateView, JobStatusView, OpticalFlowView

urlpatterns = [
    path('interpolate/', InterpolateView.as_view(), name='processing_interpolate'),
    path('job/<int:pk>/', JobStatusView.as_view(), name='processing_job_status'),
    path('optical-flow/', OpticalFlowView.as_view(), name='processing_optical_flow'),
]
