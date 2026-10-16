# Version 0.1 lokal starten

[Deutsch](start.de.md) · [Français](start.fr.md) · [Italiano](start.it.md) · [Dokumentation](README.md)

## Voraussetzungen

- Git, Python ab 3.12 auf dem Host sowie laufendes Docker Desktop oder Docker Engine mit Compose.
- Die freigegebene Datei `temp/Potentialvergleich_v7.xlsx` im Projektverzeichnis.
- Internetzugang beim ersten Build zum Laden der Container und Abhängigkeiten. Der laufende Anwendungsbetrieb benötigt keine externen Konten.

Der reguläre Start führt Django, React und PostgreSQL in Containern aus. Die Anwendung ist unter [http://127.0.0.1:8000](http://127.0.0.1:8000) erreichbar. Die lokale Bereitstellung dient der gemeinsamen Nutzung mehrerer angemeldeter Konten über diesen Server; eine Freigabe ins Organisationsnetz ist separat zu konfigurieren.

## Repository beziehen

Das Quellcode-Repository liegt auf [GitHub](https://github.com/stekhoven/military_potential):

```sh
git clone https://github.com/stekhoven/military_potential.git
cd military_potential
mkdir -p temp
```

Die freigegebene v7-Arbeitsdatei anschliessend als `temp/Potentialvergleich_v7.xlsx` ablegen. Sie ist bewusst nicht im Git-Repository enthalten. Ohne diese Datei kann die erste Einrichtung das Modell nicht importieren. Lokale Zugangsdaten, Datenbanken und Exporte werden ebenfalls nicht mitgeliefert.

LLMs wurden zur Codegenerierung und zur Recherche der anfänglichen Beispieldaten eingesetzt. Vor einer fachlichen Nutzung der Beispielwerte den [Transparenzhinweis und die Hinweise zur Quellenprüfung](konzept.de.md#llm-transparency) beachten.

## Einrichtung und Benutzerkonten

Alle folgenden Befehle werden aus dem Projektverzeichnis ausgeführt:

```sh
python3 scripts/setup.py
```

Das Skript erzeugt die von Git ausgeschlossene lokale `.env` mit zufälligen Geheimnissen und startet `docker compose up -d --build`. Vorhandene Konfiguration und Daten werden erhalten. Der erste Anwendungsstart richtet das Datenbankschema ein und importiert die v7-Struktur sowie ausschliesslich den freigegebenen USA-Beispielakteur. Es gibt kein vorbelegtes Anwendungspasswort.

Ein eigenes Chef-Analyst-Konto anlegen:

```sh
docker compose exec app python backend/manage.py account chef --role chief
```

Das Passwort wird verdeckt abgefragt und muss mindestens zehn Zeichen enthalten. Weitere Analystenkonten auf dieselbe Weise anlegen, jeweils mit einem eigenen Kontonamen:

```sh
docker compose exec app python backend/manage.py account analyst --role analyst
```

Danach im Browser anmelden. Ein erneuter `account`-Aufruf mit einem vorhandenen Kontonamen setzt dessen Passwort und Rolle ausdrücklich neu. Konten und Passwörter werden nicht über JSON exportiert.

## Erster Arbeitsablauf

1. Sprache im Dropdown auswählen und den gekennzeichneten USA-Beispielakteur öffnen oder einen eigenen Akteur anlegen.
2. In den Bewertungen heutige Werte, Verlässlichkeit, Zukunftswerte und Bemerkung / Quelle bearbeiten. Definitionen stehen direkt am Indikator. Leere Zukunftswerte werden nach den v7-Regeln fortgeführt.
3. Änderungen speichern, Szenario wählen und mehrere Akteure für den Vergleich auswählen. Der Vergleich verwendet dieselbe Modell- und Szenariobasis.
4. Zwischen Auswertung, Knotenübersicht, Herleitung und Netzwerk wechseln. Originalwerte und Kontrastwerte bleiben getrennt erkennbar. Die Herleitung führt zu den Indikatoren und Quellen.
5. Als Chef Analyst Modell und Szenarien verwalten sowie g pro Szenario einstellen. Standard ist 1; die erste Vergleichsvariante ist 1.25. Die ursprünglichen Modellwerte bleiben erhalten; Begrenzungen auf 1–5 werden ausgewiesen.
6. JSON über die Austauschfunktion exportieren oder importieren. Der Import prüft die gesamte Datei vor dem Speichern. Analysten dürfen ausschliesslich Bewertungen importieren; Modell- und Szenarioänderungen erfordern Chef-Rechte. Bestehende Änderungen werden nicht still überschrieben.

Gewöhnliche Akteure dürfen beide Rollen anlegen, umbenennen und entfernen. Den USA-Beispielakteur darf nur der Chef Analyst umbenennen, als Beispiel kennzeichnen oder entfernen; Analysten können seine Bewertungen bearbeiten. Er wird bei Neustarts nicht wieder angelegt. Frühere gespeicherte Revisionen bleiben zur Nachvollziehbarkeit erhalten. Bei einem Schreibkonflikt bleiben eigene ungespeicherte Eingaben erhalten; vor erneutem Speichern müssen sie mit dem neueren Stand abgeglichen werden.

## Stoppen, erneut starten und Diagnose

```sh
docker compose stop
```

```sh
docker compose up -d
```

```sh
docker compose logs -f app
```

PostgreSQL speichert dauerhaft im Compose-Datenvolume. Stoppen oder ein erneuter Build entfernt die Daten nicht. `.env`, Arbeitsdateien unter `temp/`, lokale Datenbanken und erzeugte Exporte bleiben ausserhalb von Git. Ein JSON-Export enthält den aktuellen Modell- und Bewertungsstand einschliesslich Quellen.

## Optionaler Zugriff im lokalen Netz

Standardmässig bindet die Anwendung ausschliesslich an `127.0.0.1`; die erlaubten Hosts sind `localhost,127.0.0.1,[::1]`. Für den bewusst eingerichteten Zugriff mehrerer Arbeitsplätze können in der lokalen `.env` folgende Werte ergänzt werden:

```dotenv
APP_BIND_ADDRESS=0.0.0.0
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,[::1],rechnername,192.0.2.10
```

`rechnername` und die Beispieladresse `192.0.2.10` durch den tatsächlichen Hostnamen beziehungsweise die tatsächliche LAN-IP ersetzen. Danach `docker compose up -d` ausführen. Andere Arbeitsplätze öffnen `http://<tatsächlicher-Hostname-oder-IP>:8000` und verwenden eigene Konten. Die Datenbank bleibt ausschliesslich über die lokale Hostschnittstelle erreichbar. Diese Variante verwendet HTTP; eine Bereitstellung mit HTTPS ist separat einzurichten. Der Standardstart verändert keine Netzfreigabe.

## Native Entwicklung

Nach der regulären Einrichtung kann Django auf dem Host gegen dieselbe PostgreSQL-Datenbank laufen. Dafür Python ab 3.12 und Node.js 22 ab 22.12 verwenden. Den Anwendungscontainer stoppen; die Datenbank bleibt aktiv:

```sh
docker compose stop app
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python backend/manage.py migrate
.venv/bin/python backend/manage.py initialize
.venv/bin/python backend/manage.py runserver 127.0.0.1:8000
```

In einem zweiten Terminal im Ordner `frontend/`:

```sh
npm ci
npm run dev
```

Die Entwicklungsoberfläche öffnet unter [http://127.0.0.1:5173](http://127.0.0.1:5173), die API läuft auf Port 8000. Die Hostverbindung zu PostgreSQL nutzt Port 55432; die lokale `.env` liefert die Zugangskonfiguration. `initialize` importiert nur bei noch leerem Arbeitsbereich.

## Prüfungen und Grenzen

Prüfstand vom 15. Oktober 2026. Die frühere ZIP/XML-Prüfung im Fachkonzept wird von den folgenden Anwendungsprüfungen getrennt geführt:

| Ausgeführte Prüfung | Ergebnis |
| --- | --- |
| Backend auf echtem PostgreSQL | 27 Tests bestanden: v7-Referenzvergleich, fehlende Daten, Nullfälle, Zeitlogik, Kontrast, Authentifizierung, CSRF, Rollen einschliesslich Beispielrechten, Versionshistorie, konkurrierende Schreibzugriffe, JSON-Rundlauf, atomarer Import sowie Löschen und Neustart des Beispiels. |
| Frontend | 7 Tests und Vite-Produktionsbuild bestanden. |
| Browser mit Chromium | Durchgängiger Ablauf bestanden: DE/FR/IT mit Zustandserhalt, Speichern und Wiederöffnen, dynamische Modell- und Szenarioänderungen einschliesslich Entfernen aller sechs Szenarien und Neuanlage mit erneuter Berechnung, g = 1.25, Netzwerkdetails und Zoom, Herleitung, Vergleich zweier Akteure, JSON-Rundlauf und Fehlerabbruch, Schreibkonflikt in zwei Sitzungen mit Download des eigenen Entwurfs und Neuladen, schreibgeschützte Historie, Analystenrechte und gesperrtes Löschen des Beispiels, mobiles Anmeldefenster. |
| Regulärer Containerstart | `python3 scripts/setup.py`, Build und Start mit Gunicorn 26.2 und PostgreSQL 17 erfolgreich geprüft. |

Erneute Prüfung für die Repository-Veröffentlichung am 16. Oktober 2026: `.venv/bin/python backend/manage.py test potential.tests --settings=config.test_settings --verbosity 1` ergab 26 bestandene Tests und einen übersprungenen PostgreSQL-Test für konkurrierende Schreibzugriffe, da ausdrücklich SQLite als Testdatenbank gewählt wurde. Die sieben Frontendtests und der Produktionsbuild bestanden. Lokale Dokumentationsverweise und der Git-Ausschluss lokaler Arbeits- und Konfigurationsdateien wurden geprüft. Die vollständigen PostgreSQL-, Browser- und Containerprüfungen vom 15. Oktober bleiben als eigener Prüfstand unverändert dokumentiert.

Der ausgeführte PostgreSQL-Testbefehl lautet:

```sh
.venv/bin/python backend/manage.py test potential.tests --verbosity 2 --noinput
```

Zusätzlich bestanden: strikter v7-Import gegen den vollständigen DE/FR/IT-Katalog (121 vollständige Zellnotizdefinitionen), sprachübergreifende Zuordnung der 32 Glossarbegriffe, D1–D9 und Kontrastformel in allen Konzeptfassungen sowie lokale Markdownverweise. Diese Strukturprüfungen ersetzen keine Browserprüfung.

Der oben aufgeführte PostgreSQL-Befehl setzt eine lokale `.env` und laufende Datenbank voraus. Für weitere Prüfungen:

Im Ordner `frontend/`:

```sh
npm test
npm run build
```

### Browserprüfung wiederholen

Nach `npm ci` und `npm run build` im Ordner `frontend/` Chromium installieren:

```sh
npx playwright install chromium
```

Danach aus dem Projektverzeichnis ausführen; Node.js 22 ab 22.12 muss im PATH verfügbar sein, PostgreSQL muss laufen und Port 8001 frei sein:

```sh
.venv/bin/python scripts/browser_check.py
```

Die Skripte `scripts/browser_check.py` und `scripts/browser-check.mjs` erzeugen eine isolierte temporäre PostgreSQL-Datenbank und zufällige Testpasswörter für QA-Konten. Sie testen auf dieser Kopie und entfernen Datenbank sowie Testserver anschliessend. Gespeicherte Anwendungsdaten bleiben unberührt. Screenshots und Serverprotokoll werden ausschliesslich im von Git ausgeschlossenen Ordner `artifacts/` abgelegt. Der Browserlauf ist in diesem Prüfstand erfolgreich abgeschlossen.

Alternativ sind isolierte Backendtests mit `--settings=config.test_settings` möglich. Diese explizite Testkonfiguration verwendet SQLite im Arbeitsspeicher. Der reguläre Anwendungsbetrieb verwendet PostgreSQL; der oben dokumentierte Lauf wurde damit geprüft. Der optionale Zugriff aus weiteren LAN-Arbeitsplätzen wurde nicht gesondert geprüft. Version 0.1 verwendet lokale Benutzerkonten; eine organisationsinterne Anmeldung ist nicht Teil dieses Stands.
