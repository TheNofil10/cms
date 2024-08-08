from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.hashers import make_password

def employee_image_path(instance, filename):
    return f'profile_images/employees/{instance.id}/{filename}'

class EmployeeManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('date_of_birth', '1970-01-01')  # Default date of birth for superusers

        return self.create_user(username, email, password, **extra_fields)

class Employee(AbstractBaseUser, PermissionsMixin):  # Inherit from PermissionsMixin for is_superuser
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, blank=True)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    date_of_birth = models.DateField()
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    profile_image = models.ImageField(upload_to=employee_image_path, null=True, blank=True)
    is_staff = models.BooleanField(default=False)  # Required for admin access
    is_active = models.BooleanField(default=True)  # Required for active user
    
    USERNAME_FIELD = 'username' 
    REQUIRED_FIELDS = ['email', 'password']

    objects = EmployeeManager()

    def set_password(self, password):
        self.password = make_password(password)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
