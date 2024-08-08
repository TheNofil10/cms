from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, AdminEmployeeView

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/employees/', AdminEmployeeView.as_view({'get': 'list'}), name='admin_employee_list'),
    path('admin/employees/create/', AdminEmployeeView.as_view({'post': 'create'}), name='admin_employee_create'),
    path('admin/employees/<pk>/', AdminEmployeeView.as_view({'delete': 'destroy'}), name='admin_employee_delete'),
]
