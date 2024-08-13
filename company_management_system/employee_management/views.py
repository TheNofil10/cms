from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import EmployeeSerializer, AdminEmployeeSerializer
from .models import Employee
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
        if self.request.user.is_superuser:
            return Employee.objects.all()
        return Employee.objects.filter(id=self.request.user.id)

    def perform_create(self, serializer):
        serializer.save(is_active=True)

    def perform_update(self, serializer):
        # Save the instance first
        instance = serializer.save()
        # Check if a new profile image is uploaded
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
