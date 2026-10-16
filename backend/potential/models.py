from django.conf import settings
from django.db import models

class Workspace(models.Model):
    revision = models.PositiveIntegerField(default=1)
    data = models.JSONField()
    updated_at = models.DateTimeField(auto_now=True)

class Revision(models.Model):
    revision = models.PositiveIntegerField(unique=True)
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)

    class Meta:
        ordering = ['-revision']

class LoginAttempt(models.Model):
    key = models.CharField(max_length=64, unique=True)
    failures = models.PositiveIntegerField(default=0)
    window_start = models.DateTimeField()
