from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import (
    ApplicantViewSet, ApplicationListView, AttendanceCheckView, AttendanceViewSet, CompanyAttendanceStatsView, ComplianceReportViewSet,
    DepartmentEmployeeView, DepartmentMemberListView, DepartmentViewSet, EmployeeAttendanceStatsView, EmployeeAttendanceView,
    EmployeeDepartmentView, EmployeeSuggestionView, EmployeeViewSet, AdminEmployeeView, EmployeeRecordViewSet, JobPostingViewSet, ApplicationViewSet,EmployeeDocumentsViewSet,
    LeaveManagementView, LeaveViewSet, PayrollViewSet, PerformanceReviewViewSet, TaskCommentViewSet, TaskViewSet, TodoViewSet, apply_leave, approve_leave_hr, approve_leave_manager, generate_job_details, generate_post, live_attendance,approve_app_attendance_manager,AppAttendanceViewSet
    ,UpdateEmployeeDocuments)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'employee-documents', EmployeeDocumentsViewSet)  # Add this line

router.register(r'departments', DepartmentViewSet)
router.register(r'employee-records', EmployeeRecordViewSet)
router.register(r'job-postings', JobPostingViewSet)
router.register(r'performance-reviews', PerformanceReviewViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'leaves', LeaveViewSet, basename='leave')
router.register(r'payrolls', PayrollViewSet)
router.register(r'compliance-reports', ComplianceReportViewSet)
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'applicants', ApplicantViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'task-comments', TaskCommentViewSet, basename='task-comments')
router.register(r'todos', TodoViewSet, basename='todo')
router.register(r'app-attendance', AppAttendanceViewSet, basename='app-attendance')


task_comment_list = TaskCommentViewSet.as_view({'get': 'list'})
application_list = ApplicationViewSet.as_view({'get': 'list', 'post': 'create'})
application_detail = ApplicationViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'})
application_status_update = ApplicationViewSet.as_view({'post': 'update_status'})

urlpatterns = [
    path('', include(router.urls)),
    path('generate-post/', generate_post, name='generate-post'),
    path('update-employee-documents/<int:employee_id>/', UpdateEmployeeDocuments.as_view(), name='update-employee-documents'),

    path('generate-job-details/', generate_job_details, name='generate_job_details'),
    path('admin/employees/', AdminEmployeeView.as_view({'get': 'list'}), name='admin_employee_list'),
    path('admin/employees/create/', AdminEmployeeView.as_view({'post': 'create'}), name='admin_employee_create'),
    path('admin/employees/<pk>/', AdminEmployeeView.as_view({'delete': 'destroy'}), name='admin_employee_delete'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('department-members/', DepartmentMemberListView.as_view(), name='department-member-list'),
    path('department/me/', EmployeeDepartmentView.as_view(), name='employee_department'),
    path('applications/', application_list, name='application-list'),
    path('applications/<int:pk>/', application_detail, name='application-detail'),
    path('applications/<int:pk>/update_status/', application_status_update, name='application-update-status'),
    path('job-postings/<int:job_id>/applications/', ApplicationListView.as_view(), name='job-posting-applications-list'),
    path('attendance/stats/company/', CompanyAttendanceStatsView.as_view(), name='company-attendance-stats'),
    path('attendance/stats/employee/', EmployeeAttendanceStatsView.as_view(), name='employee-attendance-stats'),
    path('attendance/', EmployeeAttendanceView.as_view(), name='employee-attendance'),
    path('admin/attendance/', AttendanceViewSet.as_view({'get': 'list'}), name='admin-attendance'),
    path('admin/attendance/update/<int:pk>/', AttendanceViewSet.as_view({'patch': 'partial_update'}), name='attendance-detail'),
    path('department/employees/', DepartmentEmployeeView.as_view(), name='department-employee-list'),
    path('leaves/<int:leave_id>/manage/', LeaveManagementView.as_view(), name='manage-leave'),
    path('attendance/check/', AttendanceCheckView.as_view(), name='attendance-check'),
    path('apply-leave/', apply_leave, name='apply-leave'),
    path('approve-leave-manager/<int:leave_id>/', approve_leave_manager, name='approve_leave_manager'),
    path('approve_app_attendance_manager/<int:application_id>/', approve_app_attendance_manager, name='approve_app_attendance_manager'),
    path('approve-leave-hr/<int:leave_id>/', approve_leave_hr, name='approve_leave_hr'),
    path('employee-suggestions/', EmployeeSuggestionView.as_view({'get': 'list'}), name='employee-suggestions'),
    path('tasks/<int:task_id>/comments/', task_comment_list, name='task-comments-list'),
    path('admin/live-attendance/', live_attendance, name='live-attendance'),
]