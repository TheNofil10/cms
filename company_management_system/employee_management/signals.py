from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Department, Employee

@receiver(post_save, sender=Department)
def update_employees_managers(sender, instance, **kwargs):
    print(f"Department updated: {instance.name}")
    Employee.objects.filter(department=instance).update(manager=instance.manager)
    print(f"Updated managers for employees in {instance.name}")