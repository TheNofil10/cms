# Generated by Django 5.0.8 on 2024-08-24 07:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee_management', '0041_remove_department_hod_remove_employee_is_hod_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='is_manager',
            field=models.BooleanField(default=False),
        ),
    ]
