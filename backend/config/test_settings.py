import os
os.environ.setdefault('DJANGO_SECRET_KEY', 'test-only-key-never-used-for-runtime')
from .settings import *

# Only selected explicitly for unit tests, never as an application fallback.
DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': ':memory:'}}
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
