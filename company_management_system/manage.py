import os
import sys


def main():
    """Run administrative tasks."""

    # Check if sys.stdout and sys.stderr are None (common issue in EXE files)
    if sys.stdout is None:
        sys.stdout = open("stdout.log", "w")
    if sys.stderr is None:
        sys.stderr = open("stderr.log", "w")

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'company_management_system.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()