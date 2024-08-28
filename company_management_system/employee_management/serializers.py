from django.urls import reverse
from rest_framework import serializers
from .models import (
    Applicant,
    Attendance,
    Department,
    Employee,
    EmployeeRecord,
    JobPosting,
    Application,
    PerformanceReview,
    Leave,
    Payroll,
    ComplianceReport,
    TaskComment,
    Task,
    Todo,
)


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        employee = super().create(validated_data)
        if password:
            employee.set_password(password)
            employee.save()
        return employee

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save()
        return instance


class AdminEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"
        read_only_fields = ("id", "is_superuser", "is_staff")

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        employee = super().create(validated_data)
        if password:
            employee.set_password(password)  # Hash the password
            employee.save()
        return employee


class EmployeeBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "profile_image",
            "email",
            "position",
            "department",
        ]


class DepartmentSerializer(serializers.ModelSerializer):
    members = EmployeeBriefSerializer(many=True, read_only=True, source="employees")
    manager = EmployeeBriefSerializer(read_only=True)

    class Meta:
        model = Department
        fields = "__all__"


class EmployeeRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeRecord
        fields = "__all__"


class PerformanceReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceReview
        fields = "__all__"


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source="employee.username")

    class Meta:
        model = Attendance
        fields = [
            "id",
            "employee_id",
            "employee_name",
            "date",
            "time_in",
            "time_out",
            "status",
            "hours_worked",
            "is_overtime",
            "comments",
        ]


class AttendanceStatsSerializer(serializers.Serializer):
    total_days = serializers.IntegerField()
    days_present = serializers.IntegerField()
    days_absent = serializers.IntegerField()
    days_late = serializers.IntegerField()
    hours_worked = serializers.FloatField()
    average_hours_per_day = serializers.FloatField()
    overtime_hours = serializers.FloatField()
    absent_without_leave = serializers.IntegerField()
    sick_leave = serializers.IntegerField()
    casual_leave = serializers.IntegerField()
    total_leaves = serializers.IntegerField()
    other_leaves = serializers.IntegerField()


class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = "__all__"


class TaskCommentSerializer(serializers.ModelSerializer):
    commenter = serializers.SerializerMethodField()

    class Meta:
        model = TaskComment
        fields = ['id', 'task', 'comment', 'created_at', 'commenter']
        read_only_fields = ['created_at']

    def get_commenter(self, obj):
        employee = obj.created_by
        return {
            "id": employee.id,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "username": employee.username,
            "profile_image": employee.profile_image.url if employee.profile_image else None
        }

class TaskSerializer(serializers.ModelSerializer):
    comments = TaskCommentSerializer(many=True, read_only=True)
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(), many=True
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "assigned_to",
            "department",
            "status",
            "priority",
            "due_date",
            "created_at",
            "updated_at",
            "comments",
        ]


class PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payroll
        fields = "__all__"


class ComplianceReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceReport
        fields = "__all__"


class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = "__all__"

    def get_url(self, obj):
        request = self.context.get("request")
        if request is not None:
            return request.build_absolute_uri(
                reverse("jobposting-detail", args=[obj.id])
            )
        return ""


class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = "__all__"


class ApplicationSerializer(serializers.ModelSerializer):
    job_posting = JobPostingSerializer()
    applicant = ApplicantSerializer()

    class Meta:
        model = Application
        fields = "__all__"

class TodoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Todo
        fields = "__all__"