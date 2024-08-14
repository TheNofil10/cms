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
        fields = ['id','first_name', 'last_name', 'username', 'profile_image', 'email', 'position', 'department']

class DepartmentSerializer(serializers.ModelSerializer):
    members = EmployeeBriefSerializer(many=True, read_only=True, source='employees')
    manager_name = serializers.SerializerMethodField()
    manager_image = serializers.SerializerMethodField()
    manager_email = serializers.SerializerMethodField()
    manager_phone = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = '__all__'

    def get_manager_name(self, obj):
        if obj.manager:
            return f"{obj.manager.first_name} {obj.manager.last_name}"
        return "N/A"
    
    def get_manager_image(self, obj):
        if obj.manager and obj.manager.profile_image:
            return obj.manager.profile_image.url
        return "N/A"
    
    def get_manager_email(self, obj):
        if obj.manager:
            return obj.manager.email
        return "N/A"
    
    def get_manager_phone(self, obj):
        if obj.manager:
            return obj.manager.phone
        return "N/A"