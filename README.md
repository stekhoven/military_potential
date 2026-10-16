# Potenzialvergleich · Version 0.1

[Deutsch](docs/start.de.md) · [Français](docs/start.fr.md) · [Italiano](docs/start.it.md)

[GitHub · stekhoven/military_potential](https://github.com/stekhoven/military_potential)

## Deutsch

Lokal startbare Mehrbenutzeranwendung für Bewertungen, Mehrakteursvergleich, Zeit und Trend, Herleitung und Wirkungsnetz. Grundlage sind Python/Django, React und PostgreSQL. Analysten bearbeiten Bewertungen und Belege; Chef Analysten verwalten zusätzlich Modell und Szenarien. Die Oberfläche zeigt eine per Dropdown gewählte Sprache.

**Start:** Python ab 3.12, Git und laufendes Docker mit Compose vorausgesetzt. Repository klonen:

```sh
git clone https://github.com/stekhoven/military_potential.git
cd military_potential
mkdir -p temp
```

Die Excel-Arbeitsdatei ist nicht im Repository enthalten. Die separat bereitgestellte, freigegebene Datei unter `temp/Potentialvergleich_v7.xlsx` ablegen und im Projektverzeichnis ausführen:

```sh
python3 scripts/setup.py
docker compose exec app python backend/manage.py account chef --role chief
```

Das Passwort wird verdeckt abgefragt. Danach [http://127.0.0.1:8000](http://127.0.0.1:8000) öffnen. Der Erststart übernimmt v7 und den gekennzeichneten, löschbaren USA-Beispielakteur. Weitere Starts erhalten gespeicherte Daten. JSON ermöglicht den Austausch; die Kontrastansicht um Neutralwert 3 erhält die ursprünglichen Modellwerte.

**LLM-Unterstützung:** Grosse Sprachmodelle (LLMs) wurden für die Codegenerierung und die Recherche der initialen Beispieldaten eingesetzt. Die Daten sind Beispiele; vor einer fachlichen Nutzung prüfen Analysten die Aussagen, Originalquellen und Verlässlichkeit. Technische Tests prüfen Berechnung und Funktion, nicht die sachliche Richtigkeit der Ausgangsdaten. Die Herkunft ist im [Fachkonzept](docs/konzept.de.md#llm-transparency) erläutert.

**Anleitung und Prüfstand:** [Lokaler Start](docs/start.de.md) · [Fachkonzept](docs/konzept.de.md) · [Glossar](docs/glossar.de.md) · [Dokumentation](docs/README.md) · [Agentenleitlinien](AGENTS.md)

## Français

Application multiutilisateur démarrable localement pour les évaluations, la comparaison multiacteur, les échéances et tendances, la justification et le réseau d’effets. Elle repose sur Python/Django, React et PostgreSQL. Les analystes modifient évaluations et justificatifs ; les analystes en chef gèrent également modèle et scénarios. L’interface affiche une langue choisie dans un menu déroulant.

**Démarrage :** Python dès 3.12, Git et Docker avec Compose en cours d’exécution sont requis. Cloner le dépôt :

```sh
git clone https://github.com/stekhoven/military_potential.git
cd military_potential
mkdir -p temp
```

Le classeur de travail Excel n’est pas inclus dans le dépôt. Placer le fichier autorisé, fourni séparément, sous `temp/Potentialvergleich_v7.xlsx`, puis exécuter à la racine du projet :

```sh
python3 scripts/setup.py
docker compose exec app python backend/manage.py account chef --role chief
```

Le mot de passe est demandé sans affichage. Ouvrir ensuite [http://127.0.0.1:8000](http://127.0.0.1:8000). Le premier démarrage reprend v7 et l’acteur d’exemple USA identifié et supprimable. Les démarrages suivants conservent les données enregistrées. JSON permet l’échange ; la vue de contraste autour de la valeur neutre 3 préserve les valeurs initiales du modèle.

**Assistance par LLM :** De grands modèles de langage (LLM) ont été utilisés pour générer le code et rechercher les données initiales d’exemple. Ces données sont des exemples ; avant un usage métier, les analystes vérifient les affirmations, les sources originales et la fiabilité. Les tests techniques contrôlent les calculs et le fonctionnement, pas l’exactitude factuelle des données initiales. Le [concept](docs/konzept.fr.md#llm-transparency) précise leur provenance.

**Instructions et état des vérifications :** [Démarrage local](docs/start.fr.md) · [Concept](docs/konzept.fr.md) · [Glossaire](docs/glossar.fr.md) · [Documentation](docs/README.md) · [Consignes des agents](AGENTS.md)

## Italiano

Applicazione multiutente avviabile localmente per valutazioni, confronto tra attori, tempi e tendenze, derivazione e rete di effetti. Si basa su Python/Django, React e PostgreSQL. Gli analisti modificano valutazioni e fonti; i capi analista gestiscono anche modello e scenari. L’interfaccia mostra una lingua scelta dal menu a discesa.

**Avvio:** sono richiesti Python da 3.12, Git e Docker con Compose in esecuzione. Clonare il repository:

```sh
git clone https://github.com/stekhoven/military_potential.git
cd military_potential
mkdir -p temp
```

Il file di lavoro Excel non è incluso nel repository. Collocare il file autorizzato, fornito separatamente, in `temp/Potentialvergleich_v7.xlsx`, quindi eseguire dalla cartella del progetto:

```sh
python3 scripts/setup.py
docker compose exec app python backend/manage.py account chef --role chief
```

La password viene richiesta senza visualizzarla. Aprire quindi [http://127.0.0.1:8000](http://127.0.0.1:8000). Il primo avvio importa v7 e l’attore di esempio USA identificato e rimovibile. Gli avvii successivi conservano i dati salvati. JSON consente lo scambio; la vista di contrasto attorno al valore neutro 3 conserva i valori originali del modello.

**Supporto tramite LLM:** sono stati utilizzati modelli linguistici di grandi dimensioni (LLM) per generare il codice e ricercare i dati iniziali di esempio. I dati sono esempi; prima di un uso specialistico, gli analisti verificano le affermazioni, le fonti originali e l’attendibilità. I test tecnici verificano calcoli e funzionamento, non l’esattezza fattuale dei dati iniziali. Il [concetto](docs/konzept.it.md#llm-transparency) ne descrive la provenienza.

**Istruzioni e stato delle verifiche:** [Avvio locale](docs/start.it.md) · [Concetto](docs/konzept.it.md) · [Glossario](docs/glossar.it.md) · [Documentazione](docs/README.md) · [Linee guida degli agenti](AGENTS.md)
