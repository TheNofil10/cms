from rest_framework import serializers
from .models import Employee
from rest_framework.exceptions import ValidationError


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
    
class AdminEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ('id', 'email', 'is_superuser', 'is_staff')
