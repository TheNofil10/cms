# Generated by Django 5.0.8 on 2024-08-17 04:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee_management', '0025_jobposting_posted_by'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobposting',
            name='posted_by',
        ),
        migrations.AddField(
            model_name='jobposting',
            name='posted_by_id',
            field=models.ForeignKey(default=44, on_delete=django.db.models.deletion.CASCADE, related_name='job_postings', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
