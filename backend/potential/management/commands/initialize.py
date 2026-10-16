from pathlib import Path
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from potential.importer import load_workbook
from potential.models import Revision, Workspace
from potential.validation import validate_bundle

class Command(BaseCommand):
    help = 'Import the approved v7 source only when no workspace exists.'

    def add_arguments(self, parser):
        parser.add_argument('--workbook', default=str(settings.BASE_DIR / 'temp/Potentialvergleich_v7.xlsx'))

    def handle(self, *args, **options):
        if Workspace.objects.exists():
            self.stdout.write('Workspace exists; data preserved.')
            return
        source = Path(options['workbook'])
        if not source.exists():
            raise CommandError('Missing workbook: ' + str(source))
        bundle = load_workbook(source)
        validate_bundle(bundle)
        with transaction.atomic():
            Workspace.objects.create(pk=1, revision=1, data=bundle)
            Revision.objects.create(revision=1, data=bundle)
        self.stdout.write(self.style.SUCCESS('v7 imported as revision 1.'))
