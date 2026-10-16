#!/bin/sh
set -eu
python backend/manage.py migrate --noinput
python backend/manage.py initialize
exec gunicorn --chdir backend config.wsgi:application --bind 0.0.0.0:8000 --workers 2 --threads 2 --access-logfile -
