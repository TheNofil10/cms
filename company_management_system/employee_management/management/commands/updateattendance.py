import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from employee_management.models import Attendance, Employee


class Command(BaseCommand):
    help = 'Updates attendance records with random data for all employees'

    def handle(self, *args, **kwargs):
        today = timezone.now().date()
        employees = Employee.objects.all()

        for employee in employees:
            employment_date = employee.employment_date
            if not employment_date:
                self.stdout.write(self.style.WARNING(f"Employee {employee.id} does not have an employment date. Skipping."))
                continue

            current_date = employment_date
            while current_date <= today:
                status = random.choice(['present', 'absent', 'leave','vacation','sick_leave','casual_leave'])
                if not Attendance.objects.filter(employee=employee, date=current_date).exists():
                    Attendance.objects.create(
                        employee=employee,
                        date=current_date,
                        status=status
                    )
                    self.stdout.write(self.style.SUCCESS(f"Added attendance record for {employee.id} on {current_date} with status '{status}'"))

                current_date += timedelta(days=1)

        self.stdout.write(self.style.SUCCESS('Attendance update complete.'))
