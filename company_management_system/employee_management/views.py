from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .serializers import EmployeeSerializer
from .models import Employee
from django.core.files.storage import FileSystemStorage
from rest_framework.views import APIView

def upload_file(storage, file, username):
    filename = storage.save(f'media/userpics/{username}/{file.name}', file)
    return storage.url(filename)

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def perform_create(self, serializer):
        employee = serializer.save()
        if 'profileImage' in self.request.FILES:
            image = self.request.FILES['profileImage']
            fs = FileSystemStorage()
            uploaded_file_url = upload_file(fs, image, employee.username)
            return Response({'employee': serializer.data, 'image_url': uploaded_file_url}, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class EmployeeListView(APIView):
    def get(self, request):
        employees = Employee.objects.all()
        return Response({'employees': employees})