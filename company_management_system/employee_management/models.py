from django.db import models

def employee_image_path(instance, filename):
    return f'profile_images/employees/{instance.id}/{filename}'

class Employee(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128) 
    phone = models.CharField(max_length=15)
    address = models.TextField()
    date_of_birth = models.DateField()
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    profile_image = models.ImageField(upload_to=employee_image_path, null=True, blank=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'