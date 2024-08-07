from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .serializers import EmployeeSerializer
from .models import Employee
from django.core.files.storage import FileSystemStorage

def upload_file(storage, file, employee):
    filename = storage.save(f'profile_images/employees/{employee.id}/{file.name}', file)
    print(f'File saved to: {filename}')
    return storage.url(filename)

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

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

    def perform_update(self, serializer):
        employee = serializer.save()
        if 'profile_image' in self.request.FILES:
            print('Profile image found in request.')
            image = self.request.FILES['profile_image']
            fs = FileSystemStorage()
            uploaded_file_url = upload_file(fs, image, employee)
            print(f'Uploaded file URL: {uploaded_file_url}')
            employee.profile_image = uploaded_file_url
            employee.save()
            return Response({'employee': serializer.data, 'image_url': uploaded_file_url}, status=status.HTTP_200_OK)
        else:
            print('No profile image in request.')
        return Response(serializer.data, status=status.HTTP_200_OK)
