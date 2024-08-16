from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import (ApplicantViewSet, DepartmentMemberListView, DepartmentViewSet, EmployeeDepartmentView, EmployeeViewSet, AdminEmployeeView,EmployeeRecordViewSet, JobPostingViewSet, ApplicationViewSet,
                    PerformanceReviewViewSet, LeaveViewSet, PayrollViewSet, ComplianceReportViewSet)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'employee-records', EmployeeRecordViewSet)
router.register(r'job-postings', JobPostingViewSet)
router.register(r'performance-reviews', PerformanceReviewViewSet)
router.register(r'leaves', LeaveViewSet)
router.register(r'payrolls', PayrollViewSet)
router.register(r'compliance-reports', ComplianceReportViewSet)
router.register(r'applications', ApplicationViewSet)
router.register(r'applicants', ApplicantViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/employees/', AdminEmployeeView.as_view({'get': 'list'}), name='admin_employee_list'),
    path('admin/employees/create/', AdminEmployeeView.as_view({'post': 'create'}), name='admin_employee_create'),
    path('admin/employees/<pk>/', AdminEmployeeView.as_view({'delete': 'destroy'}), name='admin_employee_delete'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('department-members/', DepartmentMemberListView.as_view(), name='department-member-list'),
    path('department/me', EmployeeDepartmentView.as_view(), name='employee_department'),
]
