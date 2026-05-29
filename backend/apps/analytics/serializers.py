from rest_framework import serializers
from .models import AnalyticsReport

class AnalyticsReportSerializer(serializers.ModelSerializer):
    project_name = serializers.ReadOnlyField(source='project.name')

    class Meta:
        model = AnalyticsReport
        fields = (
            'id', 'project', 'project_name', 'average_psnr', 'average_ssim', 
            'motion_intensity', 'processing_speed_fps', 'gpu_memory_used_gb', 
            'frame_smoothness_index', 'model_confidence_score', 'created_at'
        )
