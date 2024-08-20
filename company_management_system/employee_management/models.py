from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

def employee_image_path(instance, filename):
    return f"profile_images/employees/{instance.id}/{filename}"

class EmployeeManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        if password:
            user.set_password(password) 
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        return self.create_user(username, email, password, **extra_fields)

class Employee(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    phone = models.CharField(max_length=15)
    alternate_phone = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField()
    date_of_birth = models.DateField()
    employment_date = models.DateField()
    department = models.ForeignKey(
        "Department",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="employees",
    )
    position = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    manager = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="subordinates",
    )
    emergency_contact = models.CharField(max_length=255, null=True, blank=True)
    profile_image = models.ImageField(
        upload_to=employee_image_path, null=True, blank=True
    )
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_hr_manager = models.BooleanField(default=False)  # Field to indicate HR manager

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    objects = EmployeeManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    manager = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_departments",
    )
    contact_info = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    office_phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.name


class EmployeeRecord(models.Model):
    employee = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    contract_type = models.CharField(max_length=100)
    job_history = models.TextField(blank=True)
    current_salary = models.DecimalField(max_digits=10, decimal_places=2)
    benefits = models.TextField(blank=True)

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - {self.contract_type}"

class JobPosting(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    experience = models.TextField(blank=True)
    specifications = models.TextField(blank=True)
    qualifications = models.TextField()
    location = models.CharField(max_length=255, choices=[('onsite', 'Onsite'), ('remote', 'Remote'), ('hybrid', 'Hybrid')], default='onsite')
    job_type = models.CharField(max_length=50, choices=[('fulltime', 'Full-Time'), ('parttime', 'Part-Time'), ('contract', 'Contract')], default='fulltime')
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    application_deadline = models.DateTimeField(null=True, blank=True)
    posted_by = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='job_postings')
    date_posted = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Applicant(models.Model):
    job_posting = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='applicants')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    
    resume = models.FileField(upload_to='resumes/')
    status = models.CharField(max_length=50, choices=[('applied', 'Applied'), ('shortlisted', 'Shortlisted'), ('rejected', 'Rejected')])

    def __str__(self):
        return f"{self.name} - {self.job_posting.title}"

class Application(models.Model):
    STATUS_CHOICES = [
        ('under_review', 'Under Review'),
        ('reviewed', 'Reviewed'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('interviewed', 'Interviewed'),
        ('offer_made', 'Offer Made'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected'),
    ]
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE)
    job_posting = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField()
    submission_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='under_review')
    status_history = models.JSONField(default=list)  # Store status history as a list of dicts

    def save(self, *args, **kwargs):
        if self.pk:  
            previous_status = Application.objects.get(pk=self.pk).status
            if previous_status != self.status:
                self.status_history.append({
                    'status': previous_status,
                    'changed_at': timezone.now().isoformat(),
                })
        super().save(*args, **kwargs)
        
class PerformanceReview(models.Model):
    employee = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="performance_reviews"
    )
    reviewer = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        related_name="given_reviews",
    )
    review_date = models.DateField()
    comments = models.TextField()
    rating = models.IntegerField()

    def __str__(self):
        return f"Performance Review of {self.employee.first_name} {self.employee.last_name}"

class Attendance(models.Model):
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=20, choices=[
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('leave', 'Leave'),
        ('vacation', 'Vacation'),
        ('holiday', 'Holiday'),
        ('half_day', 'Half Day'),
        ('sick_leave', 'Sick Leave'),
        ('casual_leave', 'Casual Leave'),
        ('annual_leave', 'Annual Leave'),
    ])
    
    time_in = models.TimeField(null=True, blank=True)
    time_out = models.TimeField(null=True, blank=True)
    comments = models.TextField(blank=True)

class Leave(models.Model):
    LEAVE_TYPES = [
        ('sick', 'Sick'),
        ('casual', 'Casual'),
        ('annual', 'Annual'),
        ('maternity', 'Maternity'),
        ('paternity', 'Paternity'),
    ]
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    reason = models.TextField()
    
class Payroll(models.Model):
    employee = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="payrolls"
    )
    payment_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    details = models.TextField(blank=True)

    def __str__(self):
        return f"Payroll for {self.employee.first_name} {self.employee.last_name} on {self.payment_date}"


class ComplianceReport(models.Model):
    report_name = models.CharField(max_length=255)
    generated_on = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to="compliance_reports/")

    def __str__(self):
        return self.report_name
