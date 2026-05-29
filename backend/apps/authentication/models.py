from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    gpu_allocation_limit = models.FloatField(default=4.0, help_text="GPU Memory Allocation Limit in GB")
    dark_mode = models.BooleanField(default=True)
    bio = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'auth_users'

    def __str__(self):
        return self.username
