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
                # 70-80% chance of being 'present'
                status = random.choices(
                    ['present', 'absent', 'leave', 'vacation', 'sick_leave', 'casual_leave'],
                    weights=[75, 5, 5, 5, 5, 5],
                    k=1
                )[0]

                if status == 'present':
                    # Randomize time_in between 8:00 AM and 10:00 AM
                    time_in_hour = random.randint(8, 10)
                    time_in_minute = random.randint(0, 59)
                    time_in = timezone.make_aware(datetime.combine(current_date, datetime.strptime(f"{time_in_hour}:{time_in_minute}", "%H:%M").time()))

                    # Randomize time_out between 4:00 PM and 6:00 PM
                    time_out_hour = random.randint(16, 18)
                    time_out_minute = random.randint(0, 59)
                    time_out = timezone.make_aware(datetime.combine(current_date, datetime.strptime(f"{time_out_hour}:{time_out_minute}", "%H:%M").time()))
                else:
                    time_in = None
                    time_out = None

                if not Attendance.objects.filter(employee=employee, date=current_date).exists():
                    Attendance.objects.create(
                        employee=employee,
                        date=current_date,
                        status=status,
                        time_in=time_in,
                        time_out=time_out
                    )
                    self.stdout.write(self.style.SUCCESS(f"Added attendance record for {employee.id} on {current_date} with status '{status}' with in at: {time_in} and out at: {time_out}"))

                current_date += timedelta(days=1)

        self.stdout.write(self.style.SUCCESS('Attendance update complete.'))
