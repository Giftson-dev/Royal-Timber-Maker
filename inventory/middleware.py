from django.utils.deprecation import MiddlewareMixin
from django.utils.timezone import now
from .models import UserActivity

class UserActivityMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.user.is_authenticated:
            # We don't want to fail the request if something goes wrong with tracking
            try:
                activity, created = UserActivity.objects.get_or_create(user=request.user)
                activity.last_interaction_time = now()
                activity.last_interaction_path = request.path
                activity.save()
            except Exception:
                pass
