from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .serializers import EmployeeSerializer, AdminEmployeeSerializer
from .models import Employee
from django.core.files.storage import FileSystemStorage

def upload_file(storage, file, employee):
    filename = storage.save(f'profile_images/employees/{employee.id}/{file.name}', file)
    print(f'File saved to: {filename}')
    return storage.url(filename)

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        elif self.request.method in ['GET', 'PATCH']:
            return [IsAuthenticated()]
        else:
            return [IsAdminUser()]

    def perform_create(self, serializer):
        employee = serializer.save()
        if 'profile_image' in self.request.FILES:
            print('Profile image found in request.')
            image = self.request.FILES['profile_image']
            fs = FileSystemStorage()
            uploaded_file_url = upload_file(fs, image, employee)
            print(f'Uploaded file URL: {uploaded_file_url}')
            employee.profile_image = uploaded_file_url
            employee.save()
            return Response({'employee': serializer.data, 'image_url': uploaded_file_url}, status=status.HTTP_201_CREATED)
        else:
            print('No profile image in request.')
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request):
        if request.user.is_admin:
            employees = Employee.objects.all()
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data)
        else:
            serializer = EmployeeSerializer(request.user)
            return Response(serializer.data)

    def patch(self, request):
        if request.user.is_admin:
            return Response(status=status.HTTP_403_FORBIDDEN)
        employee = request.user
        serializer = EmployeeSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        if request.user.is_admin:
            employees = Employee.objects.all()
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, pk):
        if request.user.is_admin:
            employee = Employee.objects.get(pk=pk)
            employee.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

class AdminEmployeeView(viewsets.ViewSet):
    serializer_class = AdminEmployeeSerializer

    def list(self, request):
        employees = Employee.objects.all()
        serializer = AdminEmployeeSerializer(employees, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = AdminEmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        employee = Employee.objects.get(pk=pk)
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)