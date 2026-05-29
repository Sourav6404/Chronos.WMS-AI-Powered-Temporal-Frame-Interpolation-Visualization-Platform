from django.db import models
from apps.projects.models import Project

class AnalyticsReport(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='analytics_report')
    average_psnr = models.FloatField(default=30.0, help_text="Peak Signal-to-Noise Ratio (dB)")
    average_ssim = models.FloatField(default=0.9, help_text="Structural Similarity Index")
    motion_intensity = models.FloatField(default=0.0, help_text="Average motion vector magnitude")
    processing_speed_fps = models.FloatField(default=0.0, help_text="Frames synthesized per second")
    gpu_memory_used_gb = models.FloatField(default=0.0, help_text="GPU RAM used in gigabytes")
    frame_smoothness_index = models.FloatField(default=0.95, help_text="Smoothness variance coefficient")
    model_confidence_score = models.FloatField(default=0.92)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'analytics_reports'

    def __str__(self):
        return f"Analytics Report - {self.project.name}"
