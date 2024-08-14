from rest_framework import viewsets, status,generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import EmployeeBriefSerializer, EmployeeSerializer, AdminEmployeeSerializer, DepartmentSerializer
from .models import Employee, Department
from django.core.files.storage import default_storage

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [IsAdminUser()]
        elif self.action in ['update', 'partial_update']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Employee.objects.all()
        if user.is_authenticated:
            return Employee.objects.filter(department=user.department)
        return Employee.objects.none()

    def perform_create(self, serializer):
        employee = serializer.save(is_active=True)
        if 'profile_image' in self.request.FILES:
            employee.profile_image = self.request.FILES['profile_image']
            employee.save()


    def perform_update(self, serializer):
        instance = serializer.save()
        if 'profile_image' in self.request.FILES:
            instance.profile_image = self.request.FILES['profile_image']
            instance.save()

    def update(self, request, *args, **kwargs):
        employee = self.get_object()

        if request.user.is_superuser:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if request.user != employee:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(employee, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        employee = self.get_object()

        if request.user.is_superuser and (request.user != employee):
            return super().destroy(request, *args, **kwargs)

        if employee.is_superuser and (request.user != employee):
            return Response(status=status.HTTP_403_FORBIDDEN)

        return super().destroy(request, *args, **kwargs)


    def destroy(self, request, *args, **kwargs):
        employee = self.get_object()

        if request.user.is_superuser and (request.user != employee):
            return super().destroy(request, *args, **kwargs)

        if employee.is_superuser and (request.user != employee):
            return Response(status=status.HTTP_403_FORBIDDEN)

        return super().destroy(request, *args, **kwargs)

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
            if 'profile_image' in request.FILES:
                image = request.FILES['profile_image']
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
    permission_classes = [IsAdminUser]
    
class DepartmentMemberListView(generics.ListAPIView):
    serializer_class = EmployeeBriefSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the current employee
        current_employee = self.request.user
        
        # Filter employees by the current employee's department
        return Employee.objects.filter(department=current_employee.department)
    
class EmployeeDepartmentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee = request.user  # Get the logged-in employee
        if not employee.department:
            return Response({'detail': 'No department assigned'}, status=status.HTTP_404_NOT_FOUND)
        department = employee.department  # Get the employee's department
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)
