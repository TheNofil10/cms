from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.contrib.auth import get_user_model

def employee_image_path(instance, filename):
    return f'profile_images/employees/{instance.id}/{filename}'

class EmployeeManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)  # Ensure the password is hashed
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        return self.create_user(username, email, password, **extra_fields)

class Employee(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    alternate_phone = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField()
    date_of_birth = models.DateField()
    employment_date = models.DateField()
    department = models.ForeignKey('Department', null=True, blank=True, on_delete=models.SET_NULL, related_name='employees')
    position = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    manager = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='subordinates')
    emergency_contact = models.CharField(max_length=255, null=True, blank=True)
    profile_image = models.ImageField(upload_to=employee_image_path, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_hr_manager = models.BooleanField(default=False)  # Field to indicate HR manager

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = EmployeeManager()

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    manager = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_departments')
    contact_info = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    office_phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.name
