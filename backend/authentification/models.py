from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    nombre = models.CharField(max_length=100, blank=True, null=True)
    apellido = models.CharField(max_length=100, blank=True, null=True)
    username = models.CharField(max_length=100, blank=True, null=True, unique = True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    estado = models.BooleanField(default=True)  # True para activo, False para inactivo

    def __str__(self):
        return self.username

'''class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('vendedor', 'Vendedor'),
        ('comprador', 'Comprador'),
    )
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='comprador')'''