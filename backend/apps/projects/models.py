from django.db import models
from django.conf import settings

class Project(models.Model):
    STATUS_CHOICES = (
        ('CREATED', 'Created'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    )

    MODEL_CHOICES = (
        ('RIFE', 'RIFE (Real-Time Intermediate Flow Estimation)'),
        ('DAIN', 'DAIN (Depth-Aware Video Frame Interpolation)'),
        ('FILM', 'FILM (Frame Interpolation for Large Motion)'),
        ('SUPER_SLOMO', 'Super SloMo (Super Slow Motion)'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='CREATED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Interpolation Configuration
    frame_rate = models.IntegerField(default=30)
    interpolation_factor = models.IntegerField(default=2, help_text="Multiplier factor e.g., 2x, 4x, 8x")
    selected_model = models.CharField(max_length=30, choices=MODEL_CHOICES, default='RIFE')
    
    # Result files
    original_video = models.FileField(upload_to='original_videos/', null=True, blank=True)
    interpolated_video = models.FileField(upload_to='interpolated_videos/', null=True, blank=True)
    
    # Progress tracking
    progress = models.IntegerField(default=0)

    class Meta:
        db_table = 'projects'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.status})"


class UploadedFile(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='uploaded_files')
    file = models.FileField(upload_to='project_files/')
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_sequence_frame = models.BooleanField(default=False)
    frame_number = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'uploaded_files'
        ordering = ['frame_number', 'uploaded_at']

    def __str__(self):
        return self.filename
