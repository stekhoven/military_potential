#!/usr/bin/env python3
"""Run browser checks against an isolated, disposable PostgreSQL database."""
import os
from pathlib import Path
import secrets
import subprocess
import sys
import time
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
from django.conf import settings
import psycopg
from psycopg import sql


def main():
    os.chdir(ROOT)
    if not (ROOT / 'frontend/dist/index.html').exists():
        raise SystemExit('Build frontend first: cd frontend && npm ci && npm run build')
    database = 'potential_browser_' + secrets.token_hex(5)
    conf = settings.DATABASES['default']
    connection = psycopg.connect(dbname='postgres', user=conf['USER'], password=conf['PASSWORD'],
                                 host=conf['HOST'], port=conf['PORT'], autocommit=True)
    connection.execute(sql.SQL('CREATE DATABASE {}').format(sql.Identifier(database)))
    env = {**os.environ, 'POSTGRES_DB': database, 'QA_BASE_URL': 'http://127.0.0.1:8001',
           'QA_CHIEF_PASSWORD': secrets.token_urlsafe(24), 'QA_ANALYST_PASSWORD': secrets.token_urlsafe(24)}
    process = None
    artifacts = ROOT / 'artifacts'
    artifacts.mkdir(exist_ok=True)
    try:
        for args in (['migrate', '--noinput'], ['initialize']):
            subprocess.run([sys.executable, 'backend/manage.py', *args], env=env, check=True, stdout=subprocess.DEVNULL)
        for user, role, key in [('qa_chief', 'chief', 'QA_CHIEF_PASSWORD'), ('qa_analyst', 'analyst', 'QA_ANALYST_PASSWORD')]:
            subprocess.run([sys.executable, 'backend/manage.py', 'account', user, '--role', role, '--password-stdin'],
                           input=env[key] + '\n', text=True, env=env, check=True, stdout=subprocess.DEVNULL)
        with (artifacts / 'browser-server.log').open('w') as log:
            process = subprocess.Popen([sys.executable, 'backend/manage.py', 'runserver', '127.0.0.1:8001', '--noreload'],
                                       env=env, stdout=log, stderr=log)
            for _ in range(100):
                if process.poll() is not None:
                    raise RuntimeError('Browser server exited; see artifacts/browser-server.log')
                try:
                    with urllib.request.urlopen(env['QA_BASE_URL'] + '/api/session/', timeout=1) as response:
                        if response.status == 200:
                            break
                except OSError:
                    time.sleep(.1)
            else:
                raise RuntimeError('Browser server did not become ready')
            subprocess.run([os.environ.get('NODE_BINARY', 'node'), 'scripts/browser-check.mjs'], env=env, check=True)
    finally:
        if process is not None:
            process.terminate()
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()
        connection.execute(sql.SQL('DROP DATABASE {} WITH (FORCE)').format(sql.Identifier(database)))
        connection.close()


if __name__ == '__main__':
    main()
