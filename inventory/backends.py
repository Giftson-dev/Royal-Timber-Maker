from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            username = kwargs.get(UserModel.REQUIRED_FIELDS[0])
        # Try to fetch by email first
        users = UserModel.objects.filter(email=username)
        for user in users:
            if user.check_password(password):
                return user
        
        # Then try by username
        try:
            user = UserModel.objects.get(username=username)
            if user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            pass
            
        return None
