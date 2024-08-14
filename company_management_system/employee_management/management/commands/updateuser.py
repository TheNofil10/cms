from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from employee_management.models import Employee  # Adjust the import path as needed

class Command(BaseCommand):
    help = 'Updates a user\'s information'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the user to update')
        parser.add_argument('--email', type=str, help='New email address for the user')
        parser.add_argument('--password', type=str, help='New password for the user')

    def handle(self, *args, **kwargs):
        username = kwargs['username']
        new_email = kwargs.get('email')
        new_password = kwargs.get('password')

        # Try to find the user in the User model first
        try:
            user = User.objects.get(username=username)
            self._update_user(user, new_email, new_password)
        except User.DoesNotExist:
            # If not found, try to find the user in the Employee model
            try:
                employee = Employee.objects.get(username=username)
                self._update_employee(employee, new_email, new_password)
            except Employee.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'User with username {username} does not exist'))

    def _update_user(self, user, new_email, new_password):
        if new_email:
            user.email = new_email
            self.stdout.write(self.style.SUCCESS(f'Updated email for {user.username} to {new_email}'))

        if new_password:
            user.set_password(new_password)
            self.stdout.write(self.style.SUCCESS(f'Updated password for {user.username}'))

        user.save()

    def _update_employee(self, employee, new_email, new_password):
        if new_email:
            employee.email = new_email
            self.stdout.write(self.style.SUCCESS(f'Updated email for {employee.username} to {new_email}'))

        if new_password:
            employee.set_password(new_password)
            self.stdout.write(self.style.SUCCESS(f'Updated password for {employee.username}'))

        employee.save()
