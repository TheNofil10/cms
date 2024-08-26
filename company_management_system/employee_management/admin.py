from django.contrib import admin
from django.contrib import admin 
from .models import Employee, Task, TaskComment
# Register your models here.

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'priority', 'due_date', 'department']
    search_fields = ['title', 'description']

class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'task', 'comment', 'created_at', 'created_by')


admin.site.register(Employee)