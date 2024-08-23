# employee_management/permissions.py
from rest_framework.permissions import BasePermission

class IsAdminOrHRManager(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if getattr(request.user, 'is_hr_manager', False):
            if view.action in ['update', 'partial_update', 'destroy']:
                return True
        return False

class IsAdminHRManagerHODOrManager(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user and 
            (request.user.is_superuser or request.user.is_hr_manager or request.user.is_hod or request.user.is_manager)
        )

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_manager
