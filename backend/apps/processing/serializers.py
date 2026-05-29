from rest_framework import serializers
from .models import ProcessingJob

class ProcessingJobSerializer(serializers.ModelSerializer):
    project_name = serializers.ReadOnlyField(source='project.name')

    class Meta:
        model = ProcessingJob
        fields = ('id', 'project', 'project_name', 'job_type', 'status', 'progress', 'logs', 'created_at', 'updated_at')
        read_only_fields = ('id', 'status', 'progress', 'logs', 'created_at', 'updated_at')
