import logging
import threading

logger = logging.getLogger(__name__)

# Safe celery import fallback
try:
    from celery import shared_task
except ImportError:
    # Create a mock decorator if celery is not installed
    def shared_task(*args, **kwargs):
        def decorator(func):
            # Attach a mock delay method to the function
            def mock_delay(*args, **kwargs):
                raise ImportError("Celery is not installed in this environment.")
            func.delay = mock_delay
            return func
        return decorator

from apps.projects.models import Project
from .models import ProcessingJob
from .services import CVProcessingService

def run_interpolation_sync(project_id, job_id):
    """
    Executes the frame interpolation synchronously.
    """
    try:
        project = Project.objects.get(id=project_id)
        job = ProcessingJob.objects.get(id=job_id)
        CVProcessingService.run_frame_interpolation(project, job)
    except Exception as e:
        logger.error(f"Error in run_interpolation_sync: {str(e)}")


@shared_task(name="apps.processing.tasks.interpolate_project_celery")
def interpolate_project_celery(project_id, job_id):
    """
    Celery background task.
    """
    run_interpolation_sync(project_id, job_id)


def trigger_interpolation(project, job_type="INTERPOLATE"):
    """
    Triggers the interpolation background job.
    Attempts to queue with Celery, falling back to a daemon thread
    if Redis/Celery is unavailable or fails.
    """
    # Create the ProcessingJob database record
    job = ProcessingJob.objects.create(
        project=project,
        job_type=job_type,
        status='PENDING',
        progress=0,
        logs="Initializing processing environment..."
    )

    project.status = 'PROCESSING'
    project.progress = 0
    project.save()

    # Try Celery first, catch ConnectionError if Redis is down
    try:
        # Delay the task asynchronously using Celery
        interpolate_project_celery.delay(project.id, job.id)
        job.logs += "\nSuccessfully queued with Celery background worker system."
        job.save()
    except Exception as e:
        # Fall back to a native Python daemon thread for asynchronous local execution
        job.logs += f"\nCelery/Redis worker not active ({str(e)}). Falling back to native background Thread runner..."
        job.save()
        
        thread = threading.Thread(target=run_interpolation_sync, args=(project.id, job.id), daemon=True)
        thread.start()

    return job
