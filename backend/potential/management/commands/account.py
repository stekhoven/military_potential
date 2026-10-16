import getpass
import sys
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

class Command(BaseCommand):
    help = 'Create a local account or explicitly reset its password and role.'

    def add_arguments(self, parser):
        parser.add_argument('username')
        parser.add_argument('--role', choices=['chief', 'analyst'], required=True)
        parser.add_argument('--password-stdin', action='store_true')

    def handle(self, *args, **options):
        password = sys.stdin.readline().rstrip('\n') if options['password_stdin'] else getpass.getpass('Password / Mot de passe / Password: ')
        if not options['password_stdin'] and password != getpass.getpass('Confirm / Confirmer / Confermare: '):
            raise CommandError('Passwords differ / Mots de passe différents / Password diverse')
        User = get_user_model()
        user = User.objects.filter(username=options['username']).first() or User(username=options['username'])
        try:
            user.full_clean(exclude=['password'])
            validate_password(password, user)
        except ValidationError as exc:
            raise CommandError('; '.join(exc.messages)) from exc
        with transaction.atomic():
            user.is_active = True
            user.set_password(password)
            user.save()
            chief, _ = Group.objects.get_or_create(name='chief')
            if options['role'] == 'chief':
                user.groups.add(chief)
            else:
                user.groups.remove(chief)
                user.is_superuser = False
                user.save(update_fields=['is_superuser'])
        self.stdout.write(self.style.SUCCESS(options['username'] + ': ' + options['role']))
