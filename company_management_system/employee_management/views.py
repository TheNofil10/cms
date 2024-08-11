from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import EmployeeSerializer, AdminEmployeeSerializer
from .models import Employee
import os

def upload_file(storage, file, employee):
    filename = file.name.replace(' ', '_')
    file_path = os.path.join(f'profile_images/employees/{employee.id}', filename)
    filename = storage.save(file_path, file)
    return storage.url(filename)
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
        if self.request.user.is_superuser:
            return Employee.objects.all()
        return Employee.objects.filter(id=self.request.user.id)

    def perform_create(self, serializer):
        employee = serializer.save()
        if 'profile_image' in self.request.FILES:
            image = self.request.FILES['profile_image']
            upload_file(image, employee)
            employee.save()

    def perform_update(self, serializer):
        employee = serializer.save()
        if 'profile_image' in self.request.FILES:
            image = self.request.FILES['profile_image']
            upload_file(image, employee)
            employee.save()

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

        if not employee.is_superuser:
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
            if 'profile_image' in request.FILES:
                image = request.FILES['profile_image']
                upload_file(image, employee)
                employee.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        employee = Employee.objects.get(pk=pk)
        if employee.is_superuser:
            return Response(status=status.HTTP_403_FORBIDDEN)
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
