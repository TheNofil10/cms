from datetime import datetime, timedelta
from django.conf import settings
from django.utils.dateparse import parse_date
from decimal import Decimal
from rest_framework.exceptions import ValidationError
from rest_framework import mixins
from rest_framework.decorators import api_view, permission_classes, action
from collections import defaultdict
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from django.utils import timezone
from django.http import JsonResponse
from django.db import connection
from django.views.decorators.http import require_GET
from django.utils.timezone import make_aware
from rest_framework.views import APIView
from django.db.models import Sum, Count, F, FloatField
from django.db.models.functions import Cast
from .permissions import IsAdminHRManagerHODOrManager, IsAdminOrHRManager, IsManager
from rest_framework.viewsets import ModelViewSet
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
import os
from .serializers import (
    ApplicantSerializer,
    AttendanceStatsSerializer,
    EmployeeBriefSerializer,
    EmployeeSerializer,
    AdminEmployeeSerializer,
    AttendanceSerializer,
    DepartmentSerializer,
    EmployeeRecordSerializer,
    JobPostingSerializer,
    ApplicationSerializer,
    PerformanceReviewSerializer,
    LeaveSerializer,
    PayrollSerializer,
    ComplianceReportSerializer,
    TaskCommentSerializer,
    TaskSerializer,
    TodoSerializer,
    AppattendanceSerializer,
    EmployeeDocumentsSerializer,
    EmployeeEmergencyContactSerializer,
    EmployeeQualificationSerializer,
    EmployeeEmploymentSerializer,
    EmployeeDependentSerializer
)
from .models import (
    Dependent,
    Qualification,
    Employment,
    Applicant,
    Attendance,
    Employee,
    Department,
    EmployeeRecord,
    JobPosting,
    Application,
    Leave,
    PerformanceReview,
    Payroll,
    ComplianceReport,
    Task,
    TaskComment,
    Todo,
    EmployeeAppAttendance,
    EmployeeDocuments,
    EmergencyContact,
)
from django.core.files.storage import default_storage
from datetime import timedelta
from django.utils import timezone
from django.utils.dateparse import parse_date

import cohere

import logging
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import Employee
from .serializers import AdminEmployeeSerializer


logger = logging.getLogger(__name__)


co = cohere.Client(settings.COHERE_API_KEY)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_post(request):
    job_data = request.data.get("job")
    if not job_data:
        return Response(
            {"error": "No job data provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    title = job_data.get("title")
    description = job_data.get("description")
    qualifications = job_data.get("qualifications")
    specifications = job_data.get("specifications")
    location = job_data.get("location")
    job_type = job_data.get("job_type")
    posted_by = job_data.get("posted_by")

    if not all(
        [title, description, qualifications, specifications, location, job_type]
    ):
        return Response(
            {"error": "All job fields are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        post_response = co.generate(
            model="command-xlarge-nightly",
            prompt=f"Create an engaging and professional social media post for a job opening with the following details:\n\nTitle: {title}\nSpecifications: {specifications}\nLocation: {location}\nType: {job_type}\nDescription: {description}\nQualifications: {qualifications}\n\nThe post should be catchy and encourage people to apply give the response with only the post no other thing.",
            max_tokens=300,
        )
        post_content = post_response.generations[0].text.strip()
        return Response({"postContent": post_content})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_job_details(request):
    title = request.data.get("title")
    qualifications = request.data.get("qualifications")
    experience = request.data.get("experience")

    if not title or not qualifications or not experience:
        return Response(
            {"error": "Title, experience and qualifications are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        description_response = co.generate(
            model="command-xlarge-nightly",
            prompt=f"Generate a detailed job description for a job titled: '{title}' with this experience:\n {experience} and these qualifications: {qualifications} - no headings, no qualifications , no other thing labels only the job description in bullets.",
            max_tokens=300,
        )
        description = description_response.generations[0].text.strip()

        specifications_response = co.generate(
            model="command-xlarge-nightly",
            prompt=f"Generate detailed job specifications for a job titled '{title}' this is the job title: {title} no headings , no qualifications , no other thing labels only the job specifications in bullter.",
            max_tokens=300,
        )
        specifications = specifications_response.generations[0].text.strip()

        qualifications_response = co.generate(
            model="command-xlarge-nightly",
            prompt=f"Enhance the following qualifications to be written in a professional way: '{qualifications}' this is the job title: {title} no headings or labels only the qualifications.",
            max_tokens=150,
        )
        enhanced_qualifications = qualifications_response.generations[0].text.strip()

        experience_response = co.generate(
            model="command-xlarge-nightly",
            prompt=f"Enhance the following experience to be written in a professional way: '{experience}' this is the job title: {title} no headings or labels only the qualifications.",
            max_tokens=150,
        )
        enhanced_experience = experience_response.generations[0].text.strip()
        return Response(
            {
                "description": description,
                "specifications": specifications,
                "qualifications": enhanced_qualifications,
                "experience": enhanced_experience,
            }
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    def parse_nested_data(self, data, prefix):
        """Parses nested data like qualifications[0][field]."""
        parsed_data = defaultdict(dict)
        for key, value in data.items():
            if key.startswith(prefix):
                # Extract the index and field name
                index, field = key[len(prefix):-1].split('][')
                parsed_data[int(index)][field] = value[0]  # Use the first value from the list
        return list(parsed_data.values())

    def handle_qualifications(self, employee, qualifications_data):
        """Handles saving qualifications for an employee."""
        for qualification in qualifications_data:
            qualification["employee"] = employee.id  # Associate with the employee
            qualification_serializer = EmployeeQualificationSerializer(data=qualification)
            if qualification_serializer.is_valid():
                print("data is valid")
                qualification_serializer.save()
                print("qualification saved")
            else:
                raise ValidationError(
                    {"qualification_errors": qualification_serializer.errors}
                )
                
    def handle_employments(self, employee, employments_data):
        """Handles saving employment records for an employee."""
        for employment in employments_data:
            employment["employee"] = employee.id  # Associate with the employee
            employment_serializer = EmployeeEmploymentSerializer(data=employment)
            if employment_serializer.is_valid():
                employment_serializer.save()
            else:
                raise ValidationError({"employment_errors": employment_serializer.errors})
            
                
    def handle_dependents(self, employee, dependent_data):
        """Handles saving employment records for an employee."""
        for employment in dependent_data:
            employment["employee"] = employee.id  # Associate with the employee
            dependent_serializer = EmployeeDependentSerializer(data=employment)
            if dependent_serializer.is_valid():
                dependent_serializer.save()
            else:
                raise ValidationError({"employment_errors": dependent_serializer.errors})
    def get_permissions(self):
        if self.action == "destroy":
            if self.request.user.is_hr_manager or self.request.user.is_superuser:
                return [IsAuthenticated()]
            return [IsAdminUser()]
        elif self.action in ["create", "update", "partial_update"]:
            if self.request.user.is_hr_manager or self.request.user.is_superuser:
                return [IsAuthenticated()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Employee.objects.all()
        elif user.is_hr_manager:
            return Employee.objects.filter(is_superuser=False)
        return Employee.objects.filter(department=user.department, is_superuser=False)
        
    def perform_create(self, serializer):
        print(self.request.FILES)
        # Save the employee instance
        
        print("data ",self.request.data)
        employee = serializer.save(is_active=True)
        # Handle qualifications
        qualifications_data = self.parse_nested_data(self.request.data, "qualifications[")
        print("qualifications data is ",qualifications_data)
        if qualifications_data:
            self.handle_qualifications(employee, qualifications_data)
            
        # Handle dependent

        

        employments_data = self.parse_nested_data(self.request.data, "employments[")
        print("employments data is ",employments_data)
        if employments_data:
            self.handle_employments(employee, employments_data)
        # Handle profile image upload
        if "profile_image" in self.request.FILES:
            employee.profile_image = self.request.FILES["profile_image"]
            employee.save()
        print("here")
        # Handle employee documents upload
        if "documents" in self.request.data:
            print("found")
            # Loop through each document and create an EmployeeDocuments entry
            for document in self.request.data.getlist("documents"):
                # Assuming you have the EmployeeDocumentsViewSet set up for the employee
                print("document is ",document)
                document_data = {
                    'employee': employee.id,
                    'document': document
                }
                print("document data are ",document_data)
                # Create the document using EmployeeDocumentsViewSet logic
                document_serializer = EmployeeDocumentsSerializer(data=document_data)
                if document_serializer.is_valid():
                    document_serializer.save()
                else:
                    print(f"Error with document upload: {document_serializer.errors}")
                    
            if "em_contact_1" in self.request.data:
                emergency_contact_data = {
                    'employee': employee.id,
                    'em_name_1': self.request.data["em_contact_1"],
                    'em_relationship_1': self.request.data["em_relationship_1"],
                    'em_contact_1': self.request.data["em_contact_1"],
                    'em_email_1': self.request.data["em_email_1"],
                    'em_name_2': self.request.data["em_contact_2"],
                    'em_relationship_2': self.request.data["em_relationship_2"],
                    'em_contact_2': self.request.data["em_contact_2"],
                    'em_email_2': self.request.data["em_email_2"],
                }
                emergency_contact_serializer = EmployeeEmergencyContactSerializer(data=emergency_contact_data)
                if emergency_contact_serializer.is_valid():
                    emergency_contact_serializer.save()
                else:
                    print(f"Error with emergency contact upload: {emergency_contact_serializer.errors}")

    def perform_update(self, serializer):
        instance = serializer.save()
        if "profile_image" in self.request.FILES:
            instance.profile_image = self.request.FILES["profile_image"]
            instance.save()

    def update(self, request, *args, **kwargs):
        print("Update operation invoked")
        print(f"Request user: {request.user}, is_superuser: {request.user.is_superuser}, is_hr_manager: {getattr(request.user, 'is_hr_manager', False)}")

        # Fetch the employee being updated
        employee = self.get_object()
        print(f"Employee to update: {employee}, ID: {employee.id}")


        # Debug request data and files
        print("Request data:", request.data)
        print("request user is ",request.user)
        # Check permissions
        if request.user.is_superuser:
            print("User is superuser, proceeding with update.")
            print("Validating the serializer.")
            serializer = self.get_serializer(employee, data=request.data, partial=True)
            print("Serializer data:", serializer.initial_data)
            if not serializer.is_valid():
                print(f"Validation failed: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            print("Validation successful, performing the update.")
            self.perform_update(serializer)

            print("Update successful, returning updated employee data.")
            return Response("Employee updated successfully.", status=status.HTTP_200_OK)

        if getattr(request.user, "is_hr_manager", False) and request.user != employee:
            print("User is HR manager and not the employee being updated, proceeding with update.")
            print("Validating the serializer.")
            serializer = self.get_serializer(employee, data=request.data, partial=True)
            print("Serializer data:", serializer.initial_data)
            if not serializer.is_valid():
                print(f"Validation failed: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            print("Validation successful, performing the update.")
            self.perform_update(serializer)

            print("Update successful, returning updated employee data.")
            return Response("Employee updated successfully.", status=status.HTTP_200_OK)

        if request.user != employee:
            print(f"Permission denied: Request user ({request.user.id}) is not allowed to update employee ({employee.id})")
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Validate and perform the update
        print("Validating the serializer.")
        serializer = self.get_serializer(employee, data=request.data, partial=True)
        print("Serializer data:", serializer.initial_data)
        if not serializer.is_valid():
            print(f"Validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        print("Validation successful, performing the update.")
        self.perform_update(serializer)

        print("Update successful, returning updated employee data.")
        return Response(serializer.data)

class EmployeeDocumentsViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDocuments.objects.all()
    serializer_class = EmployeeDocumentsSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        employee = serializer.validated_data['employee']
        if "document" in self.request.FILES:
            document = self.request.FILES["document"]
            # Save the document
            serializer.save(document=document, employee=employee)
            
    
    def destroy(self, request, *args, **kwargs):
        document = self.get_object()

        # Access the file path properly
        document_path = document.document.path  # Get the file path

        # Get the folder path from the document path
        folder_path = os.path.dirname(document_path)

        # Check if the file exists and delete it
        if os.path.exists(document_path):
            os.remove(document_path)

        # Now check if the folder is empty
        if not os.listdir(folder_path):  # If the folder is empty
            try:
                os.rmdir(folder_path)  # Remove the folder
            except OSError as e:
                print(f"Error deleting folder {folder_path}: {e}")

        # Delete the document entry in the database
        document.delete()

        return Response({"message": "Document deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class AdminEmployeeView(viewsets.ViewSet):
    serializer_class = AdminEmployeeSerializer
    permission_classes = [IsAdminUser]

    def list(self, request):
        employees = Employee.objects.all()
        serializer = AdminEmployeeSerializer(employees, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = AdminEmployeeSerializer(data=request.data)
        if serializer.is_valid():
            employee = serializer.save()
            if "profile_image" in request.FILES:
                image = request.FILES["profile_image"]
                employee.profile_image = image
                employee.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        try:
            employee = Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.user.is_superuser and (request.user.id != employee.id):
            employee.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        if employee.is_superuser and (request.user.id != employee.id):
            return Response(status=status.HTTP_403_FORBIDDEN)

        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        if self.action in ["create", "destroy"]:
            return [IsAdminUser()]
        elif self.action in ["update", "partial_update"]:
            return [IsAuthenticated(), IsAdminHRManagerHODOrManager()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or (
            user.is_authenticated
            and hasattr(user, "is_hr_manager")
            and user.is_hr_manager
        ):
            return Department.objects.all()
        if user.is_authenticated:
            return Department.objects.filter(employees=user)
        return Department.objects.none()

    def partial_update(self, request, *args, **kwargs):
        department = self.get_object()
        manager_id = request.data.get("manager")
        if manager_id:
            try:
                manager = Employee.objects.get(id=manager_id)
                department.manager = manager
                department.save()
                serializer = self.get_serializer(department)
                return Response(serializer.data)
            except Employee.DoesNotExist:
                return Response(
                    {"detail": "Manager not found"}, status=status.HTTP_404_NOT_FOUND
                )
        return super().partial_update(request, *args, **kwargs)


class EmployeeSuggestionView(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        query = self.request.query_params.get("q", "")
        if query:
            return Employee.objects.filter(
                Q(first_name__icontains=query)
                | Q(last_name__icontains=query)
                | Q(username__icontains=query)
                | Q(id__icontains=query)
            )
        return Employee.objects.none()


class DepartmentEmployeeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_manager:
            employees = Employee.objects.filter(department=user.department)
            serializer = EmployeeBriefSerializer(employees, many=True)
            return Response(serializer.data)
        return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)


class DepartmentMemberListView(generics.ListAPIView):
    serializer_class = EmployeeBriefSerializer
    permission_classes = [IsAuthenticated, IsManager]

    def get_queryset(self):
        user = self.request.user
        if user.is_manager:
            return Employee.objects.filter(department=user.department)
        return Employee.objects.none()


class ManageDepartmentView(generics.RetrieveUpdateAPIView):
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsManager]

    def get_object(self):
        user = self.request.user
        return user.department


class DepartmentEmployeeView(APIView):
    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        user = request.user
        if user.is_manager:
            employees = Employee.objects.filter(department=user.department)
            serializer = EmployeeBriefSerializer(employees, many=True)
            return Response(serializer.data)
        return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)


class EmployeeDepartmentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee = request.user
        if not employee.department:
            response = Response(
                {"detail": "No department assigned"}, status=status.HTTP_404_NOT_FOUND
            )
        else:
            department = employee.department
            manager = employee.department.manager
            serializer = DepartmentSerializer(department)
            response = Response(serializer.data)

        response["Access-Control-Allow-Origin"] = "*"  # Manually add CORS header
        return response


class EmployeeRecordViewSet(viewsets.ModelViewSet):
    queryset = EmployeeRecord.objects.all()
    serializer_class = EmployeeRecordSerializer

@require_GET
def live_attendance(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM rawdata")
        rows = cursor.fetchall()
        
        columns = [col[0] for col in cursor.description]
        
        data = [dict(zip(columns, row)) for row in rows]
        
    return JsonResponse(data, safe=False)

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminOrHRManager()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        date_filter = self.request.query_params.get("dateFilter")

        today = timezone.now().date()
        yesterday = today - timedelta(days=1)
        week_start = today - timedelta(days=today.weekday())
        week_end = yesterday
        month_start = today.replace(day=1)
        month_end = yesterday
        year_start = today.replace(month=1, day=1)
        year_end = yesterday

        # Start with the base queryset
        queryset = Attendance.objects.all()

        # Apply date filter if provided
        if date_filter:
            if date_filter == "today":
                queryset = queryset.filter(date=today)
            elif date_filter == "yesterday":
                queryset = queryset.filter(date=yesterday)
            elif date_filter == "this_week":
                queryset = queryset.filter(date__range=[week_start, week_end])
            elif date_filter == "this_month":
                queryset = queryset.filter(date__range=[month_start, month_end])
            elif date_filter == "this_year":
                queryset = queryset.filter(date__range=[year_start, year_end])
            elif date_filter == "custom" and start_date and end_date:
                start_date = parse_date(start_date)
                end_date = parse_date(end_date)
                if start_date and end_date:
                    queryset = queryset.filter(date__range=[start_date, end_date])
                else:
                    queryset = Attendance.objects.none()

        # Apply user-based filtering
        if user.is_superuser or user.is_hr_manager:
            # Superusers or HR managers can view all records
            return queryset
        elif user.is_manager:
            # Managers can only see attendance records for their department
            return queryset.filter(employee__department=user.department)
        else:
            # Regular users can only see their own attendance records
            return queryset.filter(employee=user)


class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_hr_manager:
            return Leave.objects.all()
        elif user.is_manager:
            return Leave.objects.filter(employee__department=user.department)
        return Leave.objects.filter(employee=user)

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    
class AppAttendanceViewSet(viewsets.ModelViewSet):
    queryset = EmployeeAppAttendance.objects.all()
    serializer_class = AppattendanceSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_hr_manager:
            return EmployeeAppAttendance.objects.all()
        elif user.is_manager:
            return EmployeeAppAttendance.objects.filter(employee__department=user.department)
        return EmployeeAppAttendance.objects.filter(employee=user)

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]
        return [IsAuthenticated()]


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def apply_leave(request):
    employee = request.user
    data = request.data
    leave = Leave.objects.create(
        employee=employee,
        leave_type=data["leave_type"],
        start_date=data["start_date"],
        end_date=data["end_date"],
        reason=data["reason"],
    )
    return Response(
        {"detail": "Leave request submitted successfully."},
        status=status.HTTP_201_CREATED,
    )



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_app_attendance_manager(request, application_id):
    # Get the attendance record by ID
    app_attendance = get_object_or_404(EmployeeAppAttendance, id=application_id)

    # Extract date and time from the log
    log_date = app_attendance.date
    log_time = datetime.combine(log_date, app_attendance.time)  # Combine date and time for calculations

    # Ensure log_time includes microseconds (this will include milliseconds as well)
    log_time_with_microseconds = log_time.replace(microsecond=log_time.microsecond)  # Ensure microseconds included

    # Print log time to confirm microseconds are included (will show in microsecond format)
    print(f"Log time with microseconds: {log_time_with_microseconds}")

    # Check if an attendance record exists for the employee on the given date
    attendance_record = Attendance.objects.filter(
        employee=app_attendance.employee,
        date=log_date
    ).first()  # Get the first record if exists

    if not attendance_record:  # No attendance record for the day
        if app_attendance.log_type == "IN":
            # Create a new attendance record for time-in
            Attendance.objects.create(
                employee=app_attendance.employee,
                date=log_date,
                time_in=log_time_with_microseconds,  # Store datetime with microseconds
                status="present",
                comments="Logged in from app",
                hours_worked=None,  # Will calculate when out is logged
                is_overtime=False,
            )
            print(f"Time-in logged for {app_attendance.employee} at {log_time_with_microseconds}.")
    else:
        print("Processing time-out...")
        time_in = attendance_record.time_in
        if app_attendance.log_type == "OUT":
            if time_in:  # Ensure time-in exists
                # Combine time-in with date for proper calculations
                time_in_datetime = datetime.combine(log_date, time_in)
                time_diff = log_time_with_microseconds - time_in_datetime  # Calculate time difference

                worked = time_diff.total_seconds() / 3600  # Worked hours in decimal
                overtime = max(0, worked - 8)  # Calculate overtime hours

                # Update attendance record
                attendance_record.time_out = log_time_with_microseconds  # Store datetime for time_out with microseconds
                attendance_record.hours_worked = round(worked, 2)  # Rounded to 2 decimal places
                attendance_record.is_overtime = overtime > 0  # Boolean field
                attendance_record.comments += " | Logged out from app"
                attendance_record.save()

                print(f"Time-out logged for {app_attendance.employee} at {log_time_with_microseconds}.")
            else:
                print(f"Time-in is missing for {app_attendance.employee} on {log_date}.")
        else:
            print(f"Log type '{app_attendance.log_type}' is not handled.")

    # Optionally update the app attendance status
    app_attendance.status = "approved_by_manager"
    app_attendance.save()

    # Respond back to the frontend
    return Response(
        {"message": "Attendance application approved successfully."},
        status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_leave_manager(request, leave_id):
    user = request.user

    try:
        leave = Leave.objects.get(
            id=leave_id, employee__department=user.department, status="pending"
        )
    except Leave.DoesNotExist:
        return Response(
            {"detail": "Leave request not found or already processed."},
            status=status.HTTP_404_NOT_FOUND,
        )

    action = request.data.get("action")

    if action == "approve":
        leave.status = "approved_by_manager"
        leave.manager_approval_date = timezone.now()
    elif action == "reject":
        leave.status = "rejected"
    else:
        return Response(
            {"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST
        )

    leave.save()
    return Response(
        {"detail": f"Leave request {action}d successfully."}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_leave_hr(request, leave_id):
    user = request.user

    if not user.is_hr_manager:
        return Response(
            {"detail": "Not authorized to approve leave requests."},
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        leave = Leave.objects.get(id=leave_id, status="approved_by_manager")
    except Leave.DoesNotExist:
        return Response(
            {"detail": "Leave request not found or already processed."},
            status=status.HTTP_404_NOT_FOUND,
        )

    action = request.data.get("action")

    if action == "approve":
        leave.status = "approved_by_hr"
        leave.hr_approval_date = timezone.now()

        current_date = leave.start_date
        while current_date <= leave.end_date:
            Attendance.objects.create(
                employee=leave.employee,
                date=current_date,
                status=leave.leave_type,
                comments=f"{leave.leave_type} leave approved.",
            )
            current_date += timezone.timedelta(days=1)

    elif action == "reject":
        leave.status = "rejected"
    else:
        return Response(
            {"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST
        )

    leave.save()
    return Response(
        {"detail": f"Leave request {action}d successfully."}, status=status.HTTP_200_OK
    )


class EmployeeAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee = request.user
        attendance = Attendance.objects.filter(employee=employee)
        if not attendance.exists():
            return Response({"detail": "No attendance records found."}, status=404)
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)


class CompanyAttendanceStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Ensure the user has the appropriate permissions to view company-wide stats
        if not user.is_hr_manager and not user.is_superuser and not user.is_manager:
            return Response(
                {"detail": "Not authorized to view company-wide stats"}, status=403
            )

        start_date_str = request.query_params.get("start_date")
        end_date_str = request.query_params.get("end_date")
        employee_id = request.query_params.get("employee_id")
        username = request.query_params.get("username")

        # Default to the last 30 days if no date parameters are provided
        if not start_date_str or not end_date_str:
            end_date = timezone.now().date()
            start_date = end_date - timedelta(days=30)
        else:
            try:
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            except ValueError:
                return Response(
                    {"detail": "Invalid date format. Use YYYY-MM-DD."}, status=400
                )

        # Make the dates timezone-aware
        start_date = make_aware(datetime.combine(start_date, datetime.min.time()))
        end_date = make_aware(datetime.combine(end_date, datetime.max.time()))

        # Query attendance records within the given date range
        attendance_qs = Attendance.objects.filter(date__range=[start_date, end_date])

        # Filter by department if the user is a manager, or by employee ID/username if provided
        if user.is_manager:
            attendance_qs = attendance_qs.filter(employee__department=user.department)
        elif employee_id:
            attendance_qs = attendance_qs.filter(employee__id=employee_id)
        elif username:
            attendance_qs = attendance_qs.filter(employee__username=username)

        # Compute various attendance statistics
        total_days = attendance_qs.values("date").distinct().count()
        days_present = attendance_qs.filter(status="Present").count()
        days_absent = attendance_qs.filter(status="Absent").count()
        days_late = attendance_qs.filter(status="Late").count()
        overtime_hours = attendance_qs.filter(is_overtime=True).aggregate(
            total_overtime=Sum(Cast("hours_worked", FloatField()))
        )["total_overtime"] or Decimal("0.00")
        absent_without_leave = attendance_qs.filter(status="Absent").count()

        total_hours = attendance_qs.aggregate(
            total_hours=Sum(Cast("hours_worked", FloatField()))
        )["total_hours"] or Decimal("0.00")
        average_hours_per_day = (
            Decimal(total_hours) / total_days if total_days else Decimal("0.00")
        )

        total_leaves = attendance_qs.filter(
            Q(status="maternity_leave")
            | Q(status="paternity_leave")
            | Q(status="sick_leave")
            | Q(status="casual_leave")
            | Q(status="annual_leave")
        ).count()
        sick_leave = attendance_qs.filter(status="sick_leave").count()
        casual_leave = attendance_qs.filter(status="casual_leave").count()
        annual_leave = attendance_qs.filter(status="annual_leave").count()

        other_leaves = attendance_qs.filter(
            Q(status="maternity_leave") | Q(status="paternity_leave")
        ).count()

        # Prepare data for the response
        data = {
            "total_days": total_days,
            "days_present": days_present,
            "days_absent": days_absent,
            "days_late": days_late,
            "hours_worked": round(total_hours, 2),
            "average_hours_per_day": round(average_hours_per_day, 2),
            "overtime_hours": round(overtime_hours, 2),
            "absent_without_leave": absent_without_leave,
            "sick_leave": sick_leave,
            "casual_leave": casual_leave,
            "annual_leave": annual_leave,
            "other_leaves": other_leaves,
            "total_leaves": total_leaves,
        }
        return Response(data)


class EmployeeAttendanceStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee = request.user
        start_date_str = request.query_params.get("start_date")
        end_date_str = request.query_params.get("end_date")

        if not start_date_str or not end_date_str:
            end_date = timezone.now().date()
            start_date = end_date - timedelta(days=7)
        else:
            try:
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            except ValueError:
                return Response(
                    {"detail": "Invalid date format. Use YYYY-MM-DD."}, status=400
                )

        # Make the dates timezone-aware
        start_date = make_aware(datetime.combine(start_date, datetime.min.time()))
        end_date = make_aware(datetime.combine(end_date, datetime.max.time()))

        # Query attendance records for the employee within the given date range
        attendance_records = Attendance.objects.filter(
            employee=employee, date__range=[start_date, end_date]
        )

        # Compute various attendance statistics
        total_leaves = attendance_records.filter(
            Q(status="maternity_leave")
            | Q(status="paternity_leave")
            | Q(status="sick_leave")
            | Q(status="casual_leave")
            | Q(status="annual_leave")
        ).count()
        total_days = attendance_records.values("date").distinct().count()
        days_present = attendance_records.filter(status="Present").count()
        days_absent = attendance_records.filter(status="Absent").count()
        days_late = attendance_records.filter(status="Late").count()
        overtime_hours = attendance_records.filter(is_overtime=True).aggregate(
            total_overtime=Sum(Cast("hours_worked", FloatField()))
        )["total_overtime"] or Decimal("0.00")
        absent_without_leave = attendance_records.filter(status="Absent").count()

        total_hours = attendance_records.aggregate(
            total_hours=Sum(Cast("hours_worked", FloatField()))
        )["total_hours"] or Decimal("0.00")
        average_hours_per_day = (
            Decimal(total_hours) / total_days if total_days else Decimal("0.00")
        )

        sick_leave = attendance_records.filter(status="sick_leave").count()
        casual_leave = attendance_records.filter(status="casual_leave").count()
        annual_leave = attendance_records.filter(status="annual_leave").count()

        other_leaves = attendance_records.filter(
            Q(status="maternity_leave") | Q(status="paternity_leave")
        ).count()

        data = {
            "total_days": total_days,
            "days_present": days_present,
            "days_absent": days_absent,
            "days_late": days_late,
            "sick_leave": sick_leave,
            "casual_leave": casual_leave,
            "hours_worked": round(total_hours, 2),
            "average_hours_per_day": round(average_hours_per_day, 2),
            "overtime_hours": round(overtime_hours, 2),
            "absent_without_leave": absent_without_leave,
            "other_leaves": other_leaves,
            "total_leaves": total_leaves,
        }
        return Response(data)


class LeaveManagementView(APIView):
    permission_classes = [IsAuthenticated, IsManager]

    def post(self, request, leave_id):
        user = request.user
        action = request.data.get("action")

        try:
            leave = Leave.objects.get(id=leave_id)
        except Leave.DoesNotExist:
            return Response(
                {"detail": "Leave request not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if leave.employee.department != user.department:
            return Response(
                {"detail": "Not authorized to manage this leave request."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if action == "approve":
            leave.status = "approved"
        elif action == "reject":
            leave.status = "rejected"
        else:
            return Response(
                {"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST
            )

        leave.save()
        return Response({"detail": f"Leave request {action}d successfully."})


class AttendanceCheckView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_manager:
            attendance = Attendance.objects.filter(employee__department=user.department)
            serializer = AttendanceSerializer(attendance, many=True)
            return Response(serializer.data)
        return Response(
            {"detail": "Not authorized to view this information."},
            status=status.HTTP_403_FORBIDDEN,
        )


class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()


class ComplianceReportViewSet(viewsets.ModelViewSet):
    queryset = ComplianceReport.objects.all()
    serializer_class = ComplianceReportSerializer


class JobPostingViewSet(viewsets.ModelViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            if self.request.user.is_hr_manager or self.request.user.is_superuser:
                return [IsAuthenticated()]
        return [IsAuthenticated()]

    def perform_update(self, serializer):
        print("Incoming data:", self.request.data)
        serializer.save(updated_by=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_manager:
            return Task.objects.filter(department=user.department)
        return Task.objects.filter(assigned_to=user)

    def perform_update(self, serializer):
        user = self.request.user
        task = self.get_object()
        if user in task.assigned_to.all() or user.is_manager:
            serializer.save()
        else:
            return Response(
                {"detail": "Not authorized to view this information."},
                status=status.HTTP_403_FORBIDDEN,
            )


class TaskCommentViewSet(viewsets.ModelViewSet):
    serializer_class = TaskCommentSerializer

    def get_queryset(self):
        task_id = self.kwargs.get("task_id")
        if task_id:
            return TaskComment.objects.filter(task_id=task_id)
        return super().get_queryset()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["post"])
    def update_status(self, request, pk=None):
        applicant = self.get_object()
        status = request.data.get("status")
        if status not in ["pending", "interviewed", "hired"]:
            return Response(
                {"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST
            )
        applicant.status = status
        applicant.save()
        serializer = self.get_serializer(applicant)
        return Response(serializer.data)


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get("status")

        valid_statuses = [
            "Applied",
            "Reviewed",
            "Interview Scheduled",
            "Offer Extended",
            "Hired",
            "Rejected",
        ]
        if new_status not in valid_statuses:
            return Response(
                {"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST
            )

        application.status = new_status
        application.save()

        serializer = self.get_serializer(application)
        return Response(serializer.data)


class ApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        job_id = self.kwargs["job_id"]
        return Application.objects.filter(job_posting_id=job_id)


class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(employee=self.request.user)

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)
