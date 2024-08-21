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

                time_in = None
                time_out = None
                is_overtime = False

                if status == 'present':
                    # Randomize time_in between 8:00 AM and 10:30 AM
                    time_in_hour = random.randint(8, 10)
                    time_in_minute = random.randint(0, 59)
                    time_in = timezone.make_aware(datetime.combine(current_date, datetime.strptime(f"{time_in_hour}:{time_in_minute}", "%H:%M").time()))

                    # Check if late
                    if time_in_hour == 10 and time_in_minute > 30:
                        status = 'late'

                    # Randomize time_out between 4:00 PM and 7:00 PM
                    time_out_hour = random.randint(16, 19)
                    time_out_minute = random.randint(0, 59)
                    time_out = timezone.make_aware(datetime.combine(current_date, datetime.strptime(f"{time_out_hour}:{time_out_minute}", "%H:%M").time()))

                    # Check for overtime
                    if time_out_hour > 18 or (time_out_hour == 18 and time_out_minute > 0):
                        is_overtime = True

                    # Calculate hours worked
                    hours_worked = (time_out - time_in).seconds / 3600.0
                else:
                    hours_worked = 0

                if not Attendance.objects.filter(employee=employee, date=current_date).exists():
                    Attendance.objects.create(
                        employee=employee,
                        date=current_date,
                        status=status,
                        time_in=time_in,
                        time_out=time_out,
                        hours_worked=hours_worked,
                        is_overtime=is_overtime
                    )
                    self.stdout.write(self.style.SUCCESS(f"Added attendance record for {employee.id} on {current_date} with status '{status}', in at: {time_in}, out at: {time_out}, hours worked: {hours_worked}, overtime: {is_overtime}"))

                current_date += timedelta(days=1)

        self.stdout.write(self.style.SUCCESS('Attendance update complete.'))