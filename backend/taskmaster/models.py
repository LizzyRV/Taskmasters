from django.db import models
from authentification.models import User


STATUS  = [
    ('Pendiente', 'Pendiente'),
    ('En progreso','En progreso'),
    ('Tarea completada','Tarea completada')
]


PRIORITY = [
    ('P', 'Prioritaria'),
    ('R', 'Requiere seguimiento'),
    ('N', 'No prioritaria')
]

class Category(models.Model):
    name = models.CharField(max_length = 100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    name = models.CharField(max_length = 100)
    description = models.TextField(blank=True, null=True)
    expiration_date = models.DateTimeField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY, default='R')
    status = models.CharField(max_length=20, choices=STATUS, default='Pendiente')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

