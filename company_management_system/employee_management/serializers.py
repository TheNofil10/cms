from rest_framework import serializers
from .models import Department, Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class AdminEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ('id', 'is_superuser', 'is_staff')

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        employee = Employee.objects.create_user(**validated_data)
        if password:
            employee.set_password(password)
            employee.save()
        return employee
    
class EmployeeBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['first_name', 'last_name', 'username', 'profile_image', 'email', 'position', 'department']

class DepartmentSerializer(serializers.ModelSerializer):
    members = EmployeeBriefSerializer(many=True, read_only=True, source='employees')

    class Meta:
        model = Department
        fields = '__all__'