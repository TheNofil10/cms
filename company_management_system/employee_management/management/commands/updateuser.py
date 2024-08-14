from django.core.management.base import BaseCommand
from employee_management.models import Employee

class Command(BaseCommand):
    help = "Updates a user's information"

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the user to update')
        parser.add_argument('--email', type=str, help='New email address for the user')
        parser.add_argument('--password', type=str, help='New password for the user')

    def handle(self, *args, **kwargs):
        username = kwargs['username']
        new_email = kwargs.get('email')
        new_password = kwargs.get('password')

        try:
            employee = Employee.objects.get(username=username)
            self._update_employee(employee, new_email, new_password)
        except Employee.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User with username {username} does not exist'))

    def _update_employee(self, employee, new_email, new_password):
        if new_email:
            employee.email = new_email
            self.stdout.write(self.style.SUCCESS(f'Updated email for {employee.username} to {new_email}'))

        if new_password:
            employee.set_password(new_password)  # This hashes the password
            self.stdout.write(self.style.SUCCESS(f'Updated password for {employee.username}'))

        employee.save()
