# Generated by Django 5.0.8 on 2024-08-23 07:49

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee_management', '0039_employee_is_hod_employee_is_manager'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='department',
            name='manager',
        ),
        migrations.AddField(
            model_name='department',
            name='HOD',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='department_head', to=settings.AUTH_USER_MODEL),
        ),
    ]