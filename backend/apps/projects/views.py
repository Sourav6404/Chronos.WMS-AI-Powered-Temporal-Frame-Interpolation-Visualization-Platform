from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Project, UploadedFile
from .serializers import ProjectSerializer, UploadedFileSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='upload-file')
    def upload_file(self, request, pk=None):
        project = self.get_object()
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        is_sequence = request.data.get('is_sequence_frame', 'false').lower() == 'true'
        frame_num = request.data.get('frame_number')
        if frame_num:
            try:
                frame_num = int(frame_num)
            except ValueError:
                frame_num = None

        # Create UploadedFile record
        uploaded_file = UploadedFile.objects.create(
            project=project,
            file=file_obj,
            filename=file_obj.name,
            is_sequence_frame=is_sequence,
            frame_number=frame_num
        )

        # If it's a direct video upload (not a sequence), also set it as the original video for the project
        if not is_sequence and file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
            project.original_video = file_obj
            project.status = 'CREATED'
            project.save()

        serializer = UploadedFileSerializer(uploaded_file)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
