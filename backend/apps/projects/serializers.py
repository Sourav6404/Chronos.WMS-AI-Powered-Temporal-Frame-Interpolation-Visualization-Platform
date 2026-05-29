from rest_framework import serializers
from .models import Project, UploadedFile

class UploadedFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = UploadedFile
        fields = ('id', 'file', 'filename', 'uploaded_at', 'is_sequence_frame', 'frame_number', 'file_url')

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None


class ProjectSerializer(serializers.ModelSerializer):
    uploaded_files = UploadedFileSerializer(many=True, read_only=True)
    user = serializers.ReadOnlyField(source='user.username')
    original_video_url = serializers.SerializerMethodField()
    interpolated_video_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'id', 'user', 'name', 'description', 'status', 'created_at', 'updated_at',
            'frame_rate', 'interpolation_factor', 'selected_model', 'original_video',
            'interpolated_video', 'original_video_url', 'interpolated_video_url',
            'progress', 'uploaded_files'
        )
        read_only_fields = ('id', 'user', 'status', 'created_at', 'updated_at', 'interpolated_video', 'progress')

    def get_original_video_url(self, obj):
        if obj.original_video:
            return obj.original_video.url
        return None

    def get_interpolated_video_url(self, obj):
        if obj.interpolated_video:
            return obj.interpolated_video.url
        return None
