from concurrent.futures import ThreadPoolExecutor
from copy import deepcopy
import json
from threading import Barrier
from unittest import skipUnless

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import close_old_connections, connection
from django.test import Client, TestCase, TransactionTestCase

from potential.models import Revision, Workspace


def loc(value):
    return dict.fromkeys(('de', 'fr', 'it'), value)


def fixture():
    return {'schema_version': '0.1', 'model': {
        'id': 'm', 'label': loc('Model'),
        'nodes': [{'id': 'n', 'label': loc('Node'), 'group': 'military', 'controllability': 'yes'}],
        'targets': [{'id': 't', 'label': loc('Target')}],
        'indicators': [{'id': 'i', 'node_id': 'n', 'label': loc('Indicator'), 'definition': loc('Definition'), 'weight': 1, 'weight_note': ''}],
        'edges': [{'source': 'n', 'target': 't', 'strength': 1, 'term': 'K'}],
        'quality_thresholds': {'green': .1, 'red': .25}},
        'scenarios': [{'id': 's', 'label': loc('Scenario'), 'description': loc(''), 'weights': {'t': 1}, 'gain': 1}],
        'actors': [{'id': 'demo', 'label': 'Demo', 'is_example': True, 'assessments': {
            'i': {'value': 4, 'future5': 5, 'future10': None, 'reliability': 'A1', 'note': 'Public source'}}}]}


class ApiTests(TestCase):
    def setUp(self):
        self.bundle = fixture()
        Workspace.objects.create(pk=1, revision=1, data=self.bundle)
        Revision.objects.create(revision=1, data=self.bundle)
        self.analyst = get_user_model().objects.create_user('analyst', password='Sample-Password-Only')
        self.chief = get_user_model().objects.create_user('chief', password='Sample-Password-Only')
        self.chief.groups.add(Group.objects.create(name='chief'))
        self.client.force_login(self.chief)

    def write(self, bundle, revision=1, path='/api/state/'):
        method = self.client.post if path.endswith('import/') else self.client.put
        return method(path, data={'revision': revision, 'bundle': bundle}, content_type='application/json')

    def test_auth_and_csrf_enforced(self):
        anonymous = Client(enforce_csrf_checks=True)
        self.assertIsNone(anonymous.get('/api/session/').json()['user'])
        self.assertEqual(anonymous.get('/api/state/').status_code, 401)
        self.assertEqual(anonymous.post('/api/login/', data={'username': 'chief', 'password': 'Sample-Password-Only'}, content_type='application/json').status_code, 403)
        token = anonymous.cookies['csrftoken'].value
        login = anonymous.post('/api/login/', data={'username': 'chief', 'password': 'Sample-Password-Only'}, content_type='application/json', HTTP_X_CSRFTOKEN=token)
        self.assertEqual(login.json()['user']['role'], 'chief')
        self.assertEqual(anonymous.get('/api/state/').status_code, 200)
        self.assertEqual(anonymous.put('/api/state/', data={'revision': 1, 'bundle': self.bundle}, content_type='application/json').status_code, 403)
        self.assertEqual(anonymous.post('/api/logout/', HTTP_X_CSRFTOKEN=login.json()['csrf_token']).status_code, 200)
        self.assertEqual(anonymous.get('/api/history/').status_code, 401)

    def test_login_throttle(self):
        self.client.logout()
        for _ in range(10):
            result = self.client.post('/api/login/', data={'username': 'chief', 'password': 'wrong'}, content_type='application/json')
            self.assertEqual(result.status_code, 401)
        self.assertEqual(self.client.post('/api/login/', data={'username': 'chief', 'password': 'wrong'}, content_type='application/json').status_code, 429)

    def test_login_invalid_unicode(self):
        for field in ('username', 'password'):
            for value in ('\ud800', '\0'):
                data = {'username': 'chief', 'password': 'password'}
                data[field] = value
                self.assertEqual(self.client.post('/api/login/', data=json.dumps(data), content_type='application/json').status_code, 400)

    def test_analyst_permissions_for_every_model_section(self):
        self.client.force_login(self.analyst)
        mutations = [
            lambda b: b['model']['indicators'][0].update(weight=2),
            lambda b: b['model']['targets'][0].update(label=loc('Changed')),
            lambda b: b['model']['edges'][0].update(strength=-1),
            lambda b: b['model']['nodes'][0].update(controllability='no'),
            lambda b: b['model']['quality_thresholds'].update(green=.05),
            lambda b: b['scenarios'][0].update(gain=1.25),
            lambda b: b.update(scenarios=[]),
            lambda b: b['scenarios'][0].update(model=deepcopy(b['model'])),
        ]
        for mutate in mutations:
            changed = deepcopy(self.bundle)
            mutate(changed)
            self.assertEqual(self.write(changed).status_code, 403)
            self.assertEqual(self.write(changed, path='/api/import/').status_code, 403)
        self.assertEqual(Revision.objects.count(), 1)
        changed = deepcopy(self.bundle)
        changed['actors'][0]['assessments']['i'].update(value=2, reliability='C3', note='New source')
        self.assertEqual(self.write(changed).status_code, 200)

    def test_optimistic_conflict_and_immutable_history(self):
        changed = deepcopy(self.bundle)
        changed['actors'][0]['assessments']['i']['value'] = 2
        self.assertEqual(self.write(changed).json()['revision'], 2)
        self.assertEqual(self.write(self.bundle).status_code, 409)
        self.assertEqual(Revision.objects.get(revision=1).data, self.bundle)
        old = self.client.get('/api/history/1/').json()
        self.assertEqual(old['bundle'], self.bundle)
        self.assertEqual(self.client.get('/api/history/').json()['versions'][0]['username'], 'chief')
        old_calculation = self.client.post('/api/calculate/', data={'revision': 1, 'scenario_id': 's'}, content_type='application/json').json()
        new_calculation = self.client.post('/api/calculate/', data={'revision': 2, 'scenario_id': 's'}, content_type='application/json').json()
        self.assertEqual(old_calculation['actors'][0]['targets']['t']['raw'][0], 4)
        self.assertEqual(new_calculation['actors'][0]['targets']['t']['raw'][0], 2)

    def test_analyst_can_manage_normal_actors_but_not_example_metadata(self):
        self.client.force_login(self.analyst)
        for field, value in [('is_example', False), ('label', 'Changed')]:
            changed = deepcopy(self.bundle)
            changed['actors'][0][field] = value
            self.assertEqual(self.write(changed).status_code, 403)
        changed = deepcopy(self.bundle)
        changed['actors'] = []
        self.assertEqual(self.write(changed).status_code, 403)
        changed = deepcopy(self.bundle)
        changed['actors'].append({'id': 'normal', 'label': 'Normal actor', 'is_example': False, 'assessments': {}})
        self.assertEqual(self.write(changed).status_code, 200)
        changed['actors'][1]['is_example'] = True
        self.assertEqual(self.write(changed, revision=2).status_code, 403)
        changed['actors'] = changed['actors'][:1]
        self.assertEqual(self.write(changed, revision=2).status_code, 200)

    def test_json_roundtrip_and_invalid_import_atomicity(self):
        exported = self.client.get('/api/export/')
        self.assertIn('attachment', exported['Content-Disposition'])
        self.assertEqual(exported.json(), self.bundle)
        self.assertEqual(self.write(exported.json(), path='/api/import/').status_code, 200)
        bad = deepcopy(self.bundle)
        bad['actors'][0]['assessments']['unknown'] = bad['actors'][0]['assessments']['i']
        result = self.write(bad, revision=2, path='/api/import/')
        self.assertEqual(result.status_code, 400)
        self.assertEqual(result.json()['error'], 'UNKNOWN_REFERENCE')
        self.assertEqual(Workspace.objects.get(pk=1).revision, 2)
        self.assertEqual(Revision.objects.count(), 2)
        self.assertNotIn('password', exported.content.decode())
        self.assertNotIn('session', exported.content.decode())

    def test_strict_json_transport(self):
        for body in ['{"revision":1,"revision":2,"bundle":{}}', '{"revision":NaN,"bundle":{}}', '[]', '{']:
            self.assertEqual(self.client.put('/api/state/', data=body, content_type='application/json').status_code, 400)
        self.assertEqual(self.client.put('/api/state/', data='{}', content_type='text/plain').status_code, 400)
        self.assertEqual(Revision.objects.count(), 1)

    def test_deletions_and_restart_do_not_recreate_example(self):
        changed = deepcopy(self.bundle)
        changed['actors'] = []
        self.assertEqual(self.write(changed).status_code, 200)
        from django.core.management import call_command
        call_command('initialize', '--workbook', '/does/not/exist.xlsx', verbosity=0)
        self.assertEqual(self.client.get('/api/state/').json()['bundle']['actors'], [])
        self.assertEqual(self.client.get('/api/history/1/').json()['bundle']['actors'], self.bundle['actors'])

    def test_chief_dynamic_model_and_scenarios(self):
        changed = deepcopy(self.bundle)
        model = changed['model']
        model['indicators'].append({**deepcopy(model['indicators'][0]), 'id': 'i2'})
        model['targets'].append({'id': 't2', 'label': loc('New target')})
        model['edges'].append({'source': 'n', 'target': 't2', 'strength': -3, 'term': 'L'})
        changed['scenarios'][0]['weights']['t2'] = 1
        changed['scenarios'][0]['gain'] = 1.25
        self.assertEqual(self.write(changed).status_code, 200)
        result = self.client.post('/api/calculate/', data={'revision': 2, 'scenario_id': 's'}, content_type='application/json')
        self.assertEqual(result.status_code, 200)
        self.assertIn('t2', result.json()['actors'][0]['targets'])
        changed['scenarios'] = []
        self.assertEqual(self.write(changed, revision=2).status_code, 200)
        self.assertEqual(self.client.post('/api/calculate/', data={'revision': 3, 'scenario_id': 's'}, content_type='application/json').status_code, 400)

    def test_null_calculation_is_serializable(self):
        changed = deepcopy(self.bundle)
        changed['model']['edges'] = []
        changed['scenarios'][0]['weights']['t'] = 0
        self.assertEqual(self.write(changed).status_code, 200)
        result = self.client.post('/api/calculate/', data={'revision': 2, 'scenario_id': 's'}, content_type='application/json')
        self.assertEqual(result.status_code, 200)
        self.assertIn('NORMALIZATION_ZERO', result.json()['actors'][0]['errors'])
        self.assertNotIn('NaN', result.content.decode())


@skipUnless(connection.vendor == 'postgresql', 'Real concurrent writes require PostgreSQL')
class ConcurrentWritesTests(TransactionTestCase):
    def test_only_one_concurrent_write_wins(self):
        original = fixture()
        Workspace.objects.create(pk=1, revision=1, data=original)
        Revision.objects.create(revision=1, data=original)
        user = get_user_model().objects.create_user('chief')
        user.groups.add(Group.objects.create(name='chief'))
        clients = [Client(), Client()]
        for client in clients:
            client.force_login(user)
        barrier = Barrier(2)

        def write(client, value):
            close_old_connections()
            bundle = deepcopy(original)
            bundle['actors'][0]['assessments']['i']['value'] = value
            barrier.wait(timeout=10)
            result = client.put('/api/state/', data={'revision': 1, 'bundle': bundle}, content_type='application/json')
            close_old_connections()
            return result.status_code

        with ThreadPoolExecutor(max_workers=2) as pool:
            a = pool.submit(write, clients[0], 1)
            b = pool.submit(write, clients[1], 5)
            self.assertEqual(sorted([a.result(), b.result()]), [200, 409])
        self.assertEqual(Workspace.objects.get(pk=1).revision, 2)
        self.assertEqual(Revision.objects.count(), 2)
