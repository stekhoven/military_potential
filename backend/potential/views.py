import hashlib
import json
import mimetypes
from datetime import timedelta
from functools import wraps
from pathlib import Path

from django.conf import settings
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.db import transaction
from django.db.models import F
from django.http import FileResponse, Http404, JsonResponse
from django.middleware.csrf import get_token
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from .engine import calculate
from .models import LoginAttempt, Revision, Workspace
from .validation import ValidationError, validate_bundle


def response(data, status=200):
    result = JsonResponse(data, status=status, json_dumps_params={'ensure_ascii': False, 'allow_nan': False})
    result['Cache-Control'] = 'no-store'
    return result


def fail(code, status=400, **extra):
    return response({'error': code, **extra}, status)


def csrf_failure(request, reason=''):
    return fail('CSRF_FAILED', 403)


def chief(user):
    return user.is_superuser or user.groups.filter(name='chief').exists()


def session_data(request):
    user = request.user
    return {'user': {'username': user.username, 'role': 'chief' if chief(user) else 'analyst'} if user.is_authenticated else None,
            'csrf_token': get_token(request)}


def authenticated(view):
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return fail('AUTH_REQUIRED', 401)
        return view(request, *args, **kwargs)
    return wrapped


def parse_body(request, fields):
    if request.content_type != 'application/json':
        raise ValueError('INVALID_JSON')
    try:
        def reject_constant(value):
            raise ValueError('INVALID_JSON')
        def unique_object(pairs):
            result = {}
            for key, value in pairs:
                if key in result:
                    raise ValueError('INVALID_JSON')
                result[key] = value
            return result
        data = json.loads(request.body, parse_constant=reject_constant, object_pairs_hook=unique_object)
    except (ValueError, UnicodeDecodeError, RecursionError):
        raise ValueError('INVALID_JSON') from None
    if not isinstance(data, dict) or set(data) != set(fields):
        raise ValueError('INVALID_REQUEST')
    return data


def serialized(workspace):
    return {'revision': workspace.revision, 'bundle': workspace.data, 'updated_at': workspace.updated_at.isoformat()}


@ensure_csrf_cookie
@require_http_methods(['GET'])
def session(request):
    return response(session_data(request))


@require_http_methods(['POST'])
def login(request):
    try:
        data = parse_body(request, ['username', 'password'])
    except ValueError as exc:
        return fail(str(exc))
    if not all(isinstance(data[key], str) for key in data) or len(data['username']) > 150 or len(data['password']) > 1024:
        return fail('INVALID_REQUEST')
    try:
        for value in data.values():
            value.encode('utf-8')
            if '\0' in value:
                return fail('INVALID_REQUEST')
    except UnicodeEncodeError:
        return fail('INVALID_REQUEST')
    key = hashlib.sha256((request.META.get('REMOTE_ADDR', '') + '\0' + data['username']).encode()).hexdigest()
    now = timezone.now()
    attempt, _ = LoginAttempt.objects.get_or_create(key=key, defaults={'window_start': now})
    if attempt.window_start < now - timedelta(minutes=15):
        LoginAttempt.objects.filter(pk=attempt.pk).update(failures=0, window_start=now)
        attempt.failures = 0
    if attempt.failures >= 10:
        return fail('LOGIN_THROTTLED', 429)
    user = authenticate(request, username=data['username'], password=data['password'])
    if user is None:
        LoginAttempt.objects.filter(pk=attempt.pk).update(failures=F('failures') + 1)
        return fail('LOGIN_FAILED', 401)
    LoginAttempt.objects.filter(pk=attempt.pk).delete()
    auth_login(request, user)
    return response(session_data(request))


@require_http_methods(['POST'])
def logout(request):
    auth_logout(request)
    return response(session_data(request))


@authenticated
@require_http_methods(['GET', 'PUT'])
def state(request):
    if request.method == 'GET':
        workspace = Workspace.objects.filter(pk=1).first()
        return response(serialized(workspace)) if workspace else fail('NOT_INITIALIZED', 503)
    return save(request)


def save(request):
    try:
        data = parse_body(request, ['revision', 'bundle'])
        if type(data['revision']) is not int or data['revision'] < 1:
            return fail('INVALID_REQUEST')
        validate_bundle(data['bundle'])
    except ValidationError as exc:
        return fail(exc.code, path=exc.path)
    except (ValueError, RecursionError) as exc:
        return fail(str(exc) if isinstance(exc, ValueError) else 'INVALID_JSON')
    with transaction.atomic():
        workspace = Workspace.objects.filter(pk=1).first()
        if workspace is None:
            return fail('NOT_INITIALIZED', 503)
        if workspace.revision != data['revision']:
            return fail('CONFLICT', 409, revision=workspace.revision)
        # Analysts can edit actor data only. The server compares every model field,
        # including optional scenario models and all scenario parameters.
        if not chief(request.user):
            for key in ('schema_version', 'model', 'scenarios'):
                if data['bundle'][key] != workspace.data[key]:
                    return fail('FORBIDDEN', 403)
            previous_examples = {a['id']: {k: a[k] for k in ('id', 'label', 'is_example')}
                                 for a in workspace.data['actors'] if a['is_example']}
            next_examples = {a['id']: {k: a[k] for k in ('id', 'label', 'is_example')}
                             for a in data['bundle']['actors'] if a['is_example']}
            if previous_examples != next_examples:
                return fail('FORBIDDEN', 403)
        now = timezone.now()
        changed = Workspace.objects.filter(pk=1, revision=data['revision']).update(
            data=data['bundle'], revision=data['revision'] + 1, updated_at=now)
        if changed != 1:
            return fail('CONFLICT', 409)
        Revision.objects.create(revision=data['revision'] + 1, data=data['bundle'], created_by=request.user)
    return response({'revision': data['revision'] + 1, 'bundle': data['bundle'], 'updated_at': now.isoformat()})


@authenticated
@require_http_methods(['POST'])
def import_bundle(request):
    return save(request)


@authenticated
@require_http_methods(['GET'])
def export_bundle(request):
    workspace = Workspace.objects.filter(pk=1).first()
    if workspace is None:
        return fail('NOT_INITIALIZED', 503)
    result = response(workspace.data)
    result['Content-Disposition'] = f'attachment; filename="potential-v01-r{workspace.revision}.json"'
    return result


@authenticated
@require_http_methods(['POST'])
def calculate_view(request):
    try:
        data = parse_body(request, ['revision', 'scenario_id'])
    except ValueError as exc:
        return fail(str(exc))
    if type(data['revision']) is not int or not isinstance(data['scenario_id'], str):
        return fail('INVALID_REQUEST')
    snapshot = Revision.objects.filter(revision=data['revision']).first()
    if snapshot is None:
        return fail('NOT_FOUND', 404)
    if data['scenario_id'] not in {s['id'] for s in snapshot.data['scenarios']}:
        return fail('UNKNOWN_REFERENCE')
    return response(calculate(snapshot.data, data['scenario_id']))


@authenticated
@require_http_methods(['GET'])
def history(request):
    return response({'versions': [{'revision': item.revision, 'created_at': item.created_at.isoformat(),
                                  'username': item.created_by.username if item.created_by else None}
                                 for item in Revision.objects.select_related('created_by')]})


@authenticated
@require_http_methods(['GET'])
def historical_state(request, revision):
    snapshot = Revision.objects.filter(revision=revision).first()
    if snapshot is None:
        return fail('NOT_FOUND', 404)
    return response({'revision': snapshot.revision, 'bundle': snapshot.data, 'updated_at': snapshot.created_at.isoformat()})


@require_http_methods(['GET'])
def frontend(request):
    root = (settings.BASE_DIR / 'frontend/dist').resolve()
    asset = request.path.removeprefix('/')
    path = (root / asset).resolve() if asset.startswith('assets/') else root / 'index.html'
    if not path.is_relative_to(root) or not path.is_file():
        raise Http404('Build the frontend first: npm run build')
    result = FileResponse(path.open('rb'), content_type=mimetypes.guess_type(path)[0] or 'application/octet-stream')
    result['Cache-Control'] = 'public, max-age=31536000, immutable' if asset.startswith('assets/') else 'no-cache'
    return result
