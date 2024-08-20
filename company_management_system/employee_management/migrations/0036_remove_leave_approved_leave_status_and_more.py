# Generated by Django 5.0.8 on 2024-08-20 07:50

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee_management', '0035_jobposting_experience'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='leave',
            name='approved',
        ),
        migrations.AddField(
            model_name='leave',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending', max_length=20),
        ),
        migrations.AlterField(
            model_name='leave',
            name='employee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='leave',
            name='leave_type',
            field=models.CharField(choices=[('sick', 'Sick'), ('casual', 'Casual'), ('annual', 'Annual'), ('maternity', 'Maternity'), ('paternity', 'Paternity')], max_length=20),
        ),
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('status', models.CharField(choices=[('present', 'Present'), ('absent', 'Absent'), ('leave', 'Leave'), ('vacation', 'Vacation'), ('holiday', 'Holiday'), ('half_day', 'Half Day')], max_length=20)),
                ('time_in', models.TimeField(blank=True, null=True)),
                ('time_out', models.TimeField(blank=True, null=True)),
                ('comments', models.TextField(blank=True)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]