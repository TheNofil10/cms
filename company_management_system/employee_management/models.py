from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.hashers import make_password

def employee_image_path(instance, filename):
    return f'profile_images/employees/{instance.id}/{filename}'

class Employee(AbstractBaseUser):
    id = models.AutoField(primary_key=True,)
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
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'address']

    class Meta:
        permissions = (
            ('is_admin', 'Is Admin'),
            ('is_employee', 'Is Employee'),
        )
        
    @property
    def is_anonymous(self):
        return False

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_staff(self):
        return False

    @property
    def is_superuser(self):
        return False

    def set_password(self, password):
        self.password = make_password(password)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'