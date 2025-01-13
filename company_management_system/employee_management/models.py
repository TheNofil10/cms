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

def employee_documents_path(instance, filename):
    print("instance ==> ",instance)
    return f"employee_documents/employees/{instance}/{filename}"
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
    permanent_address = models.TextField()
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
    is_hr_manager = models.BooleanField(default=False)  
    is_manager = models.BooleanField(default=False)
    check_in_time = models.TimeField(null=True, blank=True)  
    working_hours = models.FloatField(null=True, blank=True)  
    location = models.TextField(null=True, blank=True)  
    
    #step 7 :
    eobi_no = models.CharField(max_length=255, null=True, blank=True)
    blood_group = models.CharField(max_length=5, null=True, blank=True)  # Example: "O+"
    gender = models.CharField(max_length=10, null=True, blank=True)  # Choices can be added
    marital_status = models.BooleanField(null=True, blank=True)  # True for Married, False for Single
    cnic_no = models.CharField(max_length=15, null=True, blank=True)  # 13 digits + spaces or dashes
    cnic_issue_date = models.DateField(null=True, blank=True)
    cnic_expiry_date = models.DateField(null=True, blank=True)
    dv_license_no = models.CharField(max_length=255, null=True, blank=True)
    dv_license_issue_date = models.DateField(null=True, blank=True)
    dv_license_expiry_date = models.DateField(null=True, blank=True)
    company_email = models.EmailField(max_length=255, null=True, blank=True)
    father_name = models.CharField(max_length=255, null=True, blank=True)
    father_cnic_no = models.CharField(max_length=15, null=True, blank=True)
    
    #step 9
    
    # Fields for Next of Kin
    nok_name = models.CharField(max_length=255, blank=True)  # Next of Kin Name
    nok_relationship = models.CharField(max_length=255, blank=True)  # Relationship with the user
    nok_cnic = models.CharField(max_length=15, unique=False, blank=True)  # CNIC Number
    nok_contact = models.CharField(max_length=15, blank=True)  # Contact Number
    nok_email = models.EmailField(max_length=255, blank=True)  # Email Address
    nok_permanent_address = models.TextField(blank=True)  # Permanent Address
    
    
    #step 10
    nationality = models.CharField(max_length=255, null=False, blank=True)
    religion = models.CharField(max_length=255, null=False, blank=True)
    disability = models.CharField(max_length=255, null=True, blank=True)  # Optional field
    
    
    #step 13
    ref_name_1 = models.CharField(max_length=255,blank=True)
    ref_mobile_1 = models.CharField(max_length=15,blank=True)
    ref_email_1 = models.EmailField(blank=True, null=True)
    ref_designation_1 = models.CharField(max_length=255,blank=True)
    ref_company_1 = models.CharField(max_length=255,blank=True)

    ref_name_2 = models.CharField(max_length=255,blank=True)
    ref_mobile_2 = models.CharField(max_length=15,blank=True)
    ref_email_2 = models.EmailField(blank=True, null=True)
    ref_designation_2 = models.CharField(max_length=255,blank=True)
    ref_company_2 = models.CharField(max_length=255,blank=True)
    
    
    #step 14
    spouse_name = models.CharField(max_length=255,blank=True)
    spouse_date_of_birth = models.DateField(blank=True)
    spouse_relationship = models.CharField(max_length=255,blank=True)
    spouse_cnic = models.CharField(max_length=15,blank=True)

    remaining_anaual_leave = models.IntegerField(default=15)
    remaining_sick_leave = models.IntegerField(default=8)
    remaining_casual_leave = models.IntegerField(default=10)
    
    
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    objects = EmployeeManager()
    
    def save(self, *args, **kwargs):
        if self.department and (self.manager is None):
            self.manager = self.department.manager
        super().save(*args, **kwargs)

        
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class EmergencyContact(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='emergency_contacts')
    
    em_name_1 = models.CharField(max_length=255)
    em_relationship_1 = models.CharField(max_length=255)
    em_contact_1 = models.CharField(max_length=20, null=True, blank=True)
    em_email_1 = models.EmailField()

    em_name_2 = models.CharField(max_length=255)
    em_relationship_2 = models.CharField(max_length=255)
    em_contact_2 = models.CharField(max_length=20, null=True, blank=True)
    em_email_2 = models.EmailField()

    def __str__(self):
        return f"Emergency Contact for {self.employee.first_name} {self.employee.last_name}"


class Qualification(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='qualifications')
    institute = models.CharField(max_length=255, null=True, blank=True)
    degree = models.CharField(max_length=255, null=True, blank=True)
    year_from = models.IntegerField(null=True, blank=True)
    year_to = models.IntegerField(null=True, blank=True)
    gpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.degree} from {self.institute}"


class Employment(models.Model):
    employee = models.ForeignKey(Employee,on_delete=models.CASCADE,related_name="employments")
    company_name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    year_from = models.PositiveIntegerField()
    year_to = models.PositiveIntegerField()
    reason_for_leaving = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.company_name} - {self.designation}"


class Dependent(models.Model):
    employee = models.ForeignKey(Employee, related_name='dependents', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    relation = models.CharField(max_length=255)
    cnic = models.CharField(max_length=15)
    
    def __str__(self):
        return self.name
class EmployeeDocuments(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="documents")
    document = models.FileField(upload_to=employee_documents_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Document for {self.employee.first_name} {self.employee.last_name}"

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

    def save(self, *args, **kwargs):
        # Check if the department already exists (update case)
        if self.pk:
            old_manager = Department.objects.get(pk=self.pk).manager
            if old_manager and old_manager != self.manager:
                # If the manager changed, set the old manager's is_manager to False
                old_manager.is_manager = False
                old_manager.save()

        # Save the department object itself
        super().save(*args, **kwargs)

        # Handle the new manager if one is assigned
        if self.manager:
            self.manager.is_manager = True
            self.manager.save()

            # Ensure other employees are not set as manager
            self.employees.exclude(pk=self.manager.pk).update(is_manager=False)

        # Update employee managers for the department
        self.update_employee_managers()

    def update_employee_managers(self):
        # Update the employees' manager field to the new department's manager
        Employee.objects.filter(department=self).update(manager=self.manager)

    def __str__(self):
        return self.name


class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    assigned_to = models.ManyToManyField(get_user_model(), related_name='tasks')
    department = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class TaskComment(models.Model):
    task = models.ForeignKey(Task, related_name='comments', on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(Employee, on_delete=models.CASCADE)
 
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
        ('Late', 'Late'),
        ('vacation', 'Vacation'),
        ('holiday', 'Holiday'),
        ('half_day', 'Half Day'),
        ('sick_leave', 'Sick Leave'),
        ('casual_leave', 'Casual Leave'),
        ('annual_leave', 'Annual Leave'),
        ('maternity_leave', 'Maternity Leave'),
        ('paternity_leave', 'Paternity Leave'),
    ])
    
    time_in = models.TimeField(null=True, blank=True)
    time_out = models.TimeField(null=True, blank=True)
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2, default=0,null=True, blank=True)
    is_overtime = models.BooleanField(default=False)
    comments = models.TextField(blank=True)

class Leave(models.Model):
    LEAVE_STATUS = [
        ('pending', 'Pending'),
        ('approved_by_manager', 'Approved by Manager'),
        ('approved_by_hr', 'Approved by HR'),
        ('rejected', 'Rejected'),
    ]
    
    LEAVE_TYPES = [
        ('sick_leave', 'Sick Leave'),
        ('casual_leave', 'Casual Leave'),
        ('annual_leave', 'Annual Leave'),
        ('maternity_leave', 'Maternity Leave'),
        ('paternity_leave', 'Paternity Leave'),
    ]
    
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=30, choices=LEAVE_STATUS, default='pending')
    manager_approval_date = models.DateField(null=True, blank=True)
    hr_approval_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def total_days(self):
        return (self.end_date - self.start_date).days + 1
   
   
class Encodings(models.Model):
    encoding_id = models.AutoField(primary_key=True, db_column='encodingID')  # Mapping to 'encodingID' in the database
    employee_id = models.IntegerField(null=True, blank=True, db_column='employeeid')  # Mapping to 'employeeid' in the database
    encoding = models.TextField(null=True, blank=True, db_column='encoding')  # Mapping to 'encoding' in the database

    class Meta:
        db_table = 'encodings'  # Ensure the table name is 'encodings'
        verbose_name = 'Encoding'
        verbose_name_plural = 'Encodings'

    def __str__(self):
        return f"Encoding {self.encoding_id} for Employee {self.employee_id}"

class EmployeeAppAttendance(models.Model):
    # Fields corresponding to the table columns
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE)

    time = models.TimeField()  # Time of attendance log
    date = models.DateField()  # Date of attendance log
    log_type = models.CharField(
        max_length=3, choices=[('IN', 'IN'), ('OUT', 'OUT')]
    )  # Type of log (IN/OUT)
    status = models.CharField(max_length=30)

    x_coordinate = models.CharField(max_length=50)  # X coordinate as string
    y_coordinate = models.CharField(max_length=50)  # Y coordinate as string
    location_address = models.CharField(
        max_length=255, blank=True, null=True
    )  # Location address (optional)
    image = models.BinaryField(blank=True, null=True)  # Store as binary data (BLOB)
        # Metadata
    class Meta: 
        db_table = 'employee_management_temp_appattendance'  # Custom table name
        verbose_name = 'Employee Attendance'
        verbose_name_plural = 'Employee Attendances'



   
class Payroll(models.Model):
    employee = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="payrolls"
    )
    payment_date = models.DateField()
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)  
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)  
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0) 
    net_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  
    details = models.TextField(blank=True)  
    overtime_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0) 
    overtime_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0) 

    def save(self, *args, **kwargs):
        self.net_salary = self.base_salary + self.bonus - self.deductions
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payroll for {self.employee.first_name} {self.employee.last_name} on {self.payment_date}"
    
class Benefit(models.Model):
    employee = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="benefits")
    type = models.CharField(max_length=100)  
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.type} - {self.amount}"

class Deduction(models.Model):
    employee = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="deductions")
    type = models.CharField(max_length=100) 
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.type} - {self.amount}"

class Todo(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    task = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('cancelled', 'Cancelled')])
    created_at = models.DateTimeField(auto_now_add=True)

    def perform_create(self, serializer):
        try:
            serializer.save(emmployee=self.request.user)
        except Exception as e:
            print(f"Error saving Todo: {e}")
            raise e

class ComplianceReport(models.Model):
    report_name = models.CharField(max_length=255)
    generated_on = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to="compliance_reports/")

    def __str__(self):
        return self.report_name
