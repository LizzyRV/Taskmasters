from django.contrib.auth.tokens import PasswordResetTokenGenerator
from datetime import timedelta
from django.utils import timezone

class CustomPasswordResetTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        # Genera un valor hash que incluya el ID del usuario, el timestamp, y si el usuario está activo.
        return f"{user.pk}{timestamp}{user.is_active}"

    def is_token_valid_for_user(self, user, timestamp):
        # Verificar si el token aún es válido comparándolo con el límite de tiempo.
        # Establecemos un período de validez de 3 días para el token.
        token_valid_until = timestamp + timedelta(days=3)
        return timezone.now() <= token_valid_until

custom_token_generator = CustomPasswordResetTokenGenerator()
