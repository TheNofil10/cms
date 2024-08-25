from datetime import datetime
from django.conf import settings
from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from django.utils import timezone
from django.utils.timezone import make_aware
from rest_framework.views import APIView
from django.db.models import Sum, Count, F, FloatField
from django.db.models.functions import Cast
from .permissions import IsAdminOrHRManager, IsManager
from rest_framework.viewsets import ModelViewSet
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated, IsAdminUser
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
)
from .models import (
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
)
from django.core.files.storage import default_storage

import cohere

co = cohere.Client(settings.COHERE_API_KEY)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_post(request):
    job_data = request.data.get('job')
    if not job_data:
        return Response({"error": "No job data provided"}, status=status.HTTP_400_BAD_REQUEST)

    title = job_data.get('title')
    description = job_data.get('description')
    qualifications = job_data.get('qualifications')
    specifications = job_data.get('specifications')
    location = job_data.get('location')
    job_type = job_data.get('job_type')
    posted_by = job_data.get('posted_by')

    if not all([title, description, qualifications, specifications, location, job_type]):
        return Response({'error': 'All job fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        post_response = co.generate(
            model='command-xlarge-nightly',
            prompt=f"Create an engaging and professional social media post for a job opening with the following details:\n\nTitle: {title}\nSpecifications: {specifications}\nLocation: {location}\nType: {job_type}\nDescription: {description}\nQualifications: {qualifications}\n\nThe post should be catchy and encourage people to apply give the response with only the post no other thing.",
            max_tokens=300
        )
        post_content = post_response.generations[0].text.strip()
        return Response({'postContent': post_content})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_job_details(request):
    title = request.data.get('title')
    qualifications = request.data.get('qualifications')
    experience = request.data.get('experience')
    
    
    if not title or not qualifications or not experience:
        return Response({'error': 'Title, experience and qualifications are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        description_response = co.generate(
            model='command-xlarge-nightly',
            prompt=f"Generate a detailed job description for a job titled: '{title}' with this experience:\n {experience} and these qualifications: {qualifications} - no headings, no qualifications , no other thing labels only the job description in bullets.",
            max_tokens=300
        )
        description = description_response.generations[0].text.strip()

        specifications_response = co.generate(
            model='command-xlarge-nightly',
            prompt=f"Generate detailed job specifications for a job titled '{title}' this is the job title: {title} no headings , no qualifications , no other thing labels only the job specifications in bullter.",
            max_tokens=300
        )
        specifications = specifications_response.generations[0].text.strip()

        qualifications_response = co.generate(
            model='command-xlarge-nightly',
            prompt=f"Enhance the following qualifications to be written in a professional way: '{qualifications}' this is the job title: {title} no headings or labels only the qualifications.",
            max_tokens=150
        )
        enhanced_qualifications = qualifications_response.generations[0].text.strip()
        
        experience_response = co.generate(
            model='command-xlarge-nightly',
            prompt=f"Enhance the following experience to be written in a professional way: '{experience}' this is the job title: {title} no headings or labels only the qualifications.",
            max_tokens=150
        )
        enhanced_experience = experience_response.generations[0].text.strip()
        return Response({
            'description': description,
            'specifications': specifications,
            'qualifications': enhanced_qualifications,
            'experience': enhanced_experience,
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def get_permissions(self):
        if self.action == "destroy":
            return [IsAdminUser()]
        elif self.action in ["create", "update", "partial_update"]:
            if self.request.user.is_hr_manager or self.request.user.is_superuser:
                return [IsAuthenticated()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Employee.objects.all()
        if user.is_hr_manager:
            return Employee.objects.all()
        return Employee.objects.filter(department=user.department)

    def perform_create(self, serializer):
        employee = serializer.save(is_active=True)
        if "profile_image" in self.request.FILES:
            employee.profile_image = self.request.FILES["profile_image"]
            employee.save()

    def perform_update(self, serializer):
        instance = serializer.save()
        if "profile_image" in self.request.FILES:
            instance.profile_image = self.request.FILES["profile_image"]
            instance.save()

    def destroy(self, request, *args, **kwargs):
        employee = self.get_object()
        if request.user.is_superuser or request.user.is_hr_manager:
            return super().destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)


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
        if self.action in ['create', 'destroy']:
            return [IsAdminUser()]
        elif self.action in ['update', 'partial_update']:
            return [IsAuthenticated(), IsManager()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or (user.is_authenticated and hasattr(user, "is_hr_manager") and user.is_hr_manager):
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
            return Response(
                {"detail": "No department assigned"}, status=status.HTTP_404_NOT_FOUND
            )
        department = employee.department
        manager = employee.department.manager
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)

class EmployeeRecordViewSet(viewsets.ModelViewSet):
    queryset = EmployeeRecord.objects.all()
    serializer_class = EmployeeRecordSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrHRManager()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_hr_manager:
            return Attendance.objects.all()
        elif user.is_manager:
            return Attendance.objects.filter(employee__department=user.department)
        return Attendance.objects.filter(employee=user)


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
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_leave(request):
    employee = request.user
    data = request.data
    leave = Leave.objects.create(
        employee=employee,
        leave_type=data['leave_type'],
        start_date=data['start_date'],
        end_date=data['end_date'],
        reason=data['reason'],
    )
    return Response({"detail": "Leave request submitted successfully."}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_leave_manager(request, leave_id):
    user = request.user

    try:
        leave = Leave.objects.get(id=leave_id, employee__department=user.department, status='pending')
    except Leave.DoesNotExist:
        return Response({"detail": "Leave request not found or already processed."}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action')

    if action == 'approve':
        leave.status = 'approved_by_manager'
        leave.manager_approval_date = timezone.now()
    elif action == 'reject':
        leave.status = 'rejected'
    else:
        return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

    leave.save()
    return Response({"detail": f"Leave request {action}d successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_leave_hr(request, leave_id):
    user = request.user

    if not user.is_hr_manager:
        return Response({"detail": "Not authorized to approve leave requests."}, status=status.HTTP_403_FORBIDDEN)

    try:
        leave = Leave.objects.get(id=leave_id, status='approved_by_manager')
    except Leave.DoesNotExist:
        return Response({"detail": "Leave request not found or already processed."}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action')

    if action == 'approve':
        leave.status = 'approved_by_hr'
        leave.hr_approval_date = timezone.now()

        # Create attendance records for each date from start_date to end_date
        current_date = leave.start_date
        while current_date <= leave.end_date:
            Attendance.objects.create(
                employee=leave.employee,
                date=current_date,
                status='leave',
                comments=f"{leave.leave_type} leave approved."
            )
            current_date += timezone.timedelta(days=1)

    elif action == 'reject':
        leave.status = 'rejected'
    else:
        return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

    leave.save()
    return Response({"detail": f"Leave request {action}d successfully."}, status=status.HTTP_200_OK)


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
        
        if not user.is_hr_manager and not user.is_superuser and not user.is_manager:
            return Response({"detail": "Not authorized to view company-wide stats"}, status=403)

        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')
        employee_id = request.query_params.get('employee_id')
        username = request.query_params.get('username')

        if not start_date_str or not end_date_str:
            return Response({"detail": "Start date and end date are required."}, status=400)

        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"detail": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        start_date = make_aware(datetime.combine(start_date, datetime.min.time()))
        end_date = make_aware(datetime.combine(end_date, datetime.max.time()))

        # Base queryset
        attendance_qs = Attendance.objects.filter(date__range=[start_date, end_date])

        if user.is_manager:
            # Limit data to manager's department
            attendance_qs = attendance_qs.filter(employee__department=user.department)
        elif employee_id:
            attendance_qs = attendance_qs.filter(employee__id=employee_id)
        elif username:
            attendance_qs = attendance_qs.filter(employee__username=username)

        # Calculate stats
        total_days = attendance_qs.values('date').distinct().count()
        days_present = attendance_qs.filter(status='Present').count()
        days_absent = attendance_qs.filter(status='Absent').count()
        days_late = attendance_qs.filter(status='Late').count()
        overtime_hours = attendance_qs.filter(is_overtime=True).aggregate(
            total_overtime=Sum(Cast('hours_worked', FloatField()))
        )['total_overtime'] or Decimal('0.00')
        absent_without_leave = attendance_qs.filter(status='Absent').count()

        total_hours = attendance_qs.aggregate(
            total_hours=Sum(Cast('hours_worked', FloatField()))
        )['total_hours'] or Decimal('0.00')
        average_hours_per_day = Decimal(total_hours) / total_days if total_days else Decimal('0.00')

        sick_leave = attendance_qs.filter(status='sick_leave').count()
        casual_leave = attendance_qs.filter(status='casual_leave').count()

        data = {
            'total_days': total_days,
            'days_present': days_present,
            'days_absent': days_absent,
            'days_late': days_late,
            'hours_worked': round(total_hours, 2),
            'average_hours_per_day': round(average_hours_per_day, 2),
            'overtime_hours': round(overtime_hours, 2),
            'absent_without_leave': absent_without_leave,
            'sick_leave': sick_leave,
            'casual_leave': casual_leave,
        }
        return Response(data)

class DepartmentAttendanceStatsView(APIView):
    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        user = request.user
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

        if not start_date_str or not end_date_str:
            return Response({"detail": "Start date and end date are required."}, status=400)

        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"detail": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        start_date = make_aware(datetime.combine(start_date, datetime.min.time()))
        end_date = make_aware(datetime.combine(end_date, datetime.max.time()))

        attendance_records = Attendance.objects.filter(
            employee__department=user.department,
            date__range=[start_date, end_date]
        )

        total_days = attendance_records.values('date').distinct().count()
        days_present = attendance_records.filter(status='Present').count()
        days_absent = attendance_records.filter(status='Absent').count()
        days_late = attendance_records.filter(status='Late').count()
        overtime_hours = attendance_records.filter(is_overtime=True).aggregate(
            total_overtime=Sum(Cast('hours_worked', FloatField()))
        )['total_overtime'] or Decimal('0.00')

        total_hours = attendance_records.aggregate(
            total_hours=Sum(Cast('hours_worked', FloatField()))
        )['total_hours'] or Decimal('0.00')
        average_hours_per_day = Decimal(total_hours) / total_days if total_days else Decimal('0.00')

        data = {
            'total_days': total_days,
            'days_present': days_present,
            'days_absent': days_absent,
            'days_late': days_late,
            'hours_worked': round(total_hours, 2),
            'average_hours_per_day': round(average_hours_per_day, 2),
            'overtime_hours': round(overtime_hours, 2),
        }
        return Response(data)

class EmployeeAttendanceStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee = request.user

        # Extract dates from request query parameters
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

        if not start_date_str or not end_date_str:
            return Response({"detail": "Start date and end date are required."}, status=400)

        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"detail": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        # Ensure dates are aware
        start_date = make_aware(datetime.combine(start_date, datetime.min.time()))
        end_date = make_aware(datetime.combine(end_date, datetime.max.time()))

        attendance_records = Attendance.objects.filter(employee=employee, date__range=[start_date, end_date])

        total_days = attendance_records.values('date').distinct().count()
        days_present = attendance_records.filter(status='Present').count()
        days_absent = attendance_records.filter(status='Absent').count()
        days_late = attendance_records.filter(status='Late').count()
        overtime_hours = attendance_records.filter(is_overtime=True).aggregate(
            total_overtime=Sum(Cast('hours_worked', FloatField()))
        )['total_overtime'] or Decimal('0.00')
        absent_without_leave = attendance_records.filter(status='Absent').count()

        total_hours = attendance_records.aggregate(
            total_hours=Sum(Cast('hours_worked', FloatField()))
        )['total_hours'] or Decimal('0.00')
        average_hours_per_day = Decimal(total_hours) / total_days if total_days else Decimal('0.00')

        # Calculate leave days
        sick_leave =  attendance_records.filter(status='sick_leave').count()
        casual_leave =  attendance_records.filter(status='casual_leave').count()

        data = {
            'total_days': total_days,
            'days_present': days_present,
            'days_absent': days_absent,
            'days_late': days_late,
            'sick_leave': sick_leave,
            'casual_leave': casual_leave,
            'hours_worked': round(total_hours, 2),
            'average_hours_per_day': round(average_hours_per_day, 2),
            'overtime_hours': round(overtime_hours, 2),
            'absent_without_leave': absent_without_leave,
        }
        return Response(data)

class LeaveManagementView(APIView):
    permission_classes = [IsAuthenticated, IsManager]

    def post(self, request, leave_id):
        user = request.user
        action = request.data.get('action')

        try:
            leave = Leave.objects.get(id=leave_id)
        except Leave.DoesNotExist:
            return Response({"detail": "Leave request not found."}, status=status.HTTP_404_NOT_FOUND)

        if leave.employee.department != user.department:
            return Response({"detail": "Not authorized to manage this leave request."}, status=status.HTTP_403_FORBIDDEN)

        if action == 'approve':
            leave.status = 'approved'
        elif action == 'reject':
            leave.status = 'rejected'
        else:
            return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({"detail": "Not authorized to view this information."}, status=status.HTTP_403_FORBIDDEN)

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer


class ComplianceReportViewSet(viewsets.ModelViewSet):
    queryset = ComplianceReport.objects.all()
    serializer_class = ComplianceReportSerializer

class JobPostingViewSet(viewsets.ModelViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            if self.request.user.is_hr_manager or self.request.user.is_superuser:
                return [IsAuthenticated()]
        return [IsAuthenticated()]

    def perform_update(self, serializer):
        print("Incoming data:", self.request.data)
        serializer.save(updated_by=self.request.user)
        
    def perform_destroy(self, instance):
        instance.delete()
        
class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        applicant = self.get_object()
        status = request.data.get('status')
        if status not in ['pending', 'interviewed', 'hired']:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        applicant.status = status
        applicant.save()
        serializer = self.get_serializer(applicant)
        return Response(serializer.data)

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get('status')
        
        # Define valid status transitions
        valid_statuses = ['Applied', 'Reviewed', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected']
        if new_status not in valid_statuses:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the status and save
        application.status = new_status
        application.save()
        
        serializer = self.get_serializer(application)
        return Response(serializer.data)
    
class ApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        job_id = self.kwargs['job_id']
        return Application.objects.filter(job_posting_id=job_id)

class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer
