from django.urls import reverse
from rest_framework import serializers
import base64
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
    EmployeeAppAttendance,
    EmployeeDocuments,
    EmergencyContact,
    Qualification,
    Employment,
    Dependent,
    Voucher,
    VoucherDocuments,
)

class EmployeeDocumentsSerializer(serializers.ModelSerializer):
    document = serializers.FileField()  # This field is required for document upload

    class Meta:
        model = EmployeeDocuments
        fields = ["id","employee", "document", "uploaded_at"]

class EmployeeQualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qualification
        fields = "__all__"
        
class EmployeeEmploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employment
        fields = "__all__"

class EmployeeEmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = "__all__"
class EmployeeDependentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dependent
        fields = "__all__"

class EmployeeSerializer(serializers.ModelSerializer):
    # Include documents as a nested serializer
    documents = EmployeeDocumentsSerializer(many=True, read_only=True)
    emergency_contacts = EmployeeEmergencyContactSerializer(many=True, read_only=True)
    qualifications = EmployeeQualificationSerializer(many=True, read_only=True)
    employments = EmployeeEmploymentSerializer(many=True, read_only=True)
    dependents = EmployeeDependentSerializer(many=True, read_only=True)

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

    
    def perform_update(self, serializer):
        try:
            instance = serializer.save()
            if "profile_image" in self.request.FILES:
                instance.profile_image = self.request.FILES["profile_image"]
                instance.save()
        except  Exception as e:
            print(f"Validation error: {e}")
            raise
        except Exception as e:
            print(f"Error during update: {e}")
            raise

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


class AppattendanceSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeAppAttendance
        fields = "__all__"

    def get_image(self, obj):
        # If image exists, convert binary data to Base64
        if obj.image:
            image_base64 = base64.b64encode(obj.image).decode('utf-8')
            return f"data:image/jpeg;base64,{image_base64}"
        return None  # Return None if no image
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

class PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payroll
        fields = ['id', 'employee', 'payment_date', 'base_salary', 'bonus', 'deductions', 'net_salary', 'details', 'overtime_hours', 'overtime_rate']

class TodoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Todo
        fields = "__all__"
        

class VoucherDocumentSerializer(serializers.ModelSerializer):
    document = serializers.FileField()

    class Meta:
        model = VoucherDocuments
        fields = ["voucher", "document", "uploaded_at"]


class VoucherSerializer(serializers.ModelSerializer):
    employee_first_name = serializers.CharField(source='employee.first_name', read_only=True)
    employee_middle_name = serializers.CharField(source='employee.middle_name', read_only=True)
    employee_last_name = serializers.CharField(source='employee.last_name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    documents = VoucherDocumentSerializer(many=True, read_only=True)
    # head_of_department_first_name = serializers.CharField(source='employee.first_name', read_only=True)
    # head_of_department_first_name = serializers.CharField(source='employee.last_name', read_only=True)
    
    class Meta:
        model = Voucher
        fields = [
            'id', 'department', 'employee','department_name', 'employee_first_name', 'employee_middle_name', 'employee_last_name',
            'date', 'amount', 'reason', 'project', 'category', 'other_category', 'status', 'documents', 'reason_for_rejection', 
            'archived'
        ]
        
    def create(self, validated_data):
        validated_data['status'] = 'pending'
        return super().create(validated_data)
