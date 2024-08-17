from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import (
    ApplicantSerializer,
    EmployeeBriefSerializer,
    EmployeeSerializer,
    AdminEmployeeSerializer,
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
    Employee,
    Department,
    EmployeeRecord,
    JobPosting,
    Application,
    PerformanceReview,
    Leave,
    Payroll,
    ComplianceReport,
)
from django.core.files.storage import default_storage

import cohere

co = cohere.Client(settings.COHERE_API_KEY)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_job_details(request):
    title = request.data.get('title')
    qualifications = request.data.get('qualifications')

    if not title or not qualifications:
        return Response({'error': 'Title and qualifications are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Generate the job description
        description_response = co.generate(
            model='command-xlarge-nightly',
            prompt=f"Generate a detailed job description for a job titled '{title}' no headings or labels only the job description.",
            max_tokens=300
        )
        description = description_response.generations[0].text.strip()

        # Generate the job specifications
        specifications_response = co.generate(
            model='command-xlarge-nightly',
            prompt=f"Generate detailed job specifications for a job titled '{title}' no headings or labels only the job specifications.",
            max_tokens=300
        )
        specifications = specifications_response.generations[0].text.strip()

        # Enhance the qualifications
        qualifications_response = co.generate(
            model='command-xlarge-nightly',
            prompt=f"Enhance the following qualifications to be written in a professional way: '{qualifications}' no headings or labels only the qualifications.",
            max_tokens=150
        )
        enhanced_qualifications = qualifications_response.generations[0].text.strip()

        return Response({
            'description': description,
            'specifications': specifications,
            'qualifications': enhanced_qualifications
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
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
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

class DepartmentMemberListView(generics.ListAPIView):
    serializer_class = EmployeeBriefSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        current_employee = self.request.user

        return Employee.objects.filter(department=current_employee.department)


class EmployeeDepartmentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee = request.user
        if not employee.department:
            return Response(
                {"detail": "No department assigned"}, status=status.HTTP_404_NOT_FOUND
            )
        department = employee.department
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)


class EmployeeRecordViewSet(viewsets.ModelViewSet):
    queryset = EmployeeRecord.objects.all()
    serializer_class = EmployeeRecordSerializer


class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer


class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer


class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer


class ComplianceReportViewSet(viewsets.ModelViewSet):
    queryset = ComplianceReport.objects.all()
    serializer_class = ComplianceReportSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import JobPosting
from .serializers import JobPostingSerializer

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

    def get_queryset(self):
        return self.queryset.filter(job_posting__posted_by_id=self.request.user)

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def create(self, request, *args, **kwargs):
        applicant_data = request.data.get('applicant')
        if applicant_data:
            applicant, created = Applicant.objects.get_or_create(email=applicant_data.get('email'), defaults=applicant_data)
            request.data['applicant'] = applicant.id

        return super().create(request, *args, **kwargs)