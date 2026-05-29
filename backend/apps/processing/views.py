import os
import cv2
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from apps.projects.models import Project, UploadedFile
from .models import ProcessingJob
from .serializers import ProcessingJobSerializer
from .tasks import trigger_interpolation
from .services import CVProcessingService

class InterpolateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        project_id = request.data.get('project_id')
        if not project_id:
            return Response({"error": "project_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, id=project_id, user=request.user)

        # Trigger temporal interpolation task
        job = trigger_interpolation(project)
        serializer = ProcessingJobSerializer(job)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)


class JobStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        job = get_object_or_404(ProcessingJob, id=pk, project__user=request.user)
        serializer = ProcessingJobSerializer(job)
        return Response(serializer.data)


class OpticalFlowView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Computes/fetches motion vectors between two specific sequential frames
        to allow the frontend to overlay motion arrows/heatmaps.
        """
        project_id = request.data.get('project_id')
        frame_idx = request.data.get('frame_index', 0)

        if not project_id:
            return Response({"error": "project_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, id=project_id, user=request.user)
        frames = list(project.uploaded_files.filter(is_sequence_frame=True).order_by('frame_number'))

        if len(frames) < 2:
            return Response({"error": "Not enough frames found in project for optical flow analysis."}, status=status.HTTP_400_BAD_REQUEST)

        if frame_idx >= len(frames) - 1:
            frame_idx = len(frames) - 2

        img0_path = frames[frame_idx].file.path
        img1_path = frames[frame_idx+1].file.path

        img0 = cv2.imread(img0_path)
        img1 = cv2.imread(img1_path)

        if img0 is None or img1 is None:
            return Response({"error": "Could not read frames from disk."}, status=status.HTTP_400_BAD_REQUEST)

        flow_heatmap, motion_vectors, avg_mag = CVProcessingService.generate_optical_flow(img0, img1)

        # We return motion vectors and a small status response
        return Response({
            "project_id": project.id,
            "frame_index": frame_idx,
            "average_magnitude": avg_mag,
            "motion_vectors": motion_vectors[:500]  # limit payload size
        })
