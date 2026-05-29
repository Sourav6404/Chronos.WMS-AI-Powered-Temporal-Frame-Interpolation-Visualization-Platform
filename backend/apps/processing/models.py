from django.db import models
from apps.projects.models import Project

class ProcessingJob(models.Model):
    JOB_TYPES = (
        ('INTERPOLATE', 'Frame Interpolation'),
        ('OPTICAL_FLOW', 'Optical Flow Visualization'),
        ('EXPORT', 'Video Assembly and Export'),
    )

    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='jobs')
    job_type = models.CharField(max_length=20, choices=JOB_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    progress = models.IntegerField(default=0)
    logs = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'processing_jobs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.job_type} - {self.status} ({self.progress}%)"
