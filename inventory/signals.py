from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from .models import AdminNotification

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    AdminNotification.objects.create(
        message=f"User '{user.username}' logged in successfully from IP: {request.META.get('REMOTE_ADDR', 'Unknown')}."
    )
