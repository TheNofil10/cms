from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from employee_management.models import Employee  # Use relative import

class Command(BaseCommand):
    help = 'Hashes passwords for existing employees'

    def handle(self, *args, **kwargs):
        employees = Employee.objects.all()
        for employee in employees:
            if not employee.check_password(employee.password):
                # Update with a default password or prompt for new passwords
                employee.set_password('new_default_password')
                employee.save()
                self.stdout.write(self.style.SUCCESS(f'Updated password for {employee.username}'))
