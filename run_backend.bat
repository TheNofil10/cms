@echo off

call .venv/Scripts/activate
cd company_management_system/
python manage.py runserver
