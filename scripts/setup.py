#!/usr/bin/env python3
"""Prepare private local settings and start the Docker application."""
import os
from pathlib import Path
import secrets
import subprocess

root = Path(__file__).resolve().parents[1]
os.chdir(root)
config = root / '.env'
if not config.exists():
    fd = os.open(config, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    with os.fdopen(fd, 'w') as handle:
        handle.write('DJANGO_SECRET_KEY=' + secrets.token_urlsafe(64) + '\n')
        handle.write('POSTGRES_PASSWORD=' + secrets.token_urlsafe(32) + '\n')
if not (root / 'temp/Potentialvergleich_v7.xlsx').exists():
    raise SystemExit('Missing / Absent / Mancante: temp/Potentialvergleich_v7.xlsx')
subprocess.run(['docker', 'compose', 'up', '-d', '--build'], check=True)
print('http://127.0.0.1:8000')
print('Account / Compte / Account: docker compose exec app python backend/manage.py account chef --role chief')
