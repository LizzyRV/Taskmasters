from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    nombre = models.CharField(max_length=100, blank=True, null=True)
    apellido = models.CharField(max_length=100, blank=True, null=True)
    username = models.CharField(max_length=100, blank=True, unique = True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    estado = models.BooleanField(default=True)  # True para activo, False para inactivo

    def __str__(self):
        return self.username
