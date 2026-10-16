# Démarrer la version 0.1 localement

[Deutsch](start.de.md) · [Français](start.fr.md) · [Italiano](start.it.md) · [Documentation](README.md)

## Prérequis

- Git, Python dès 3.12 sur l’hôte et Docker Desktop ou Docker Engine avec Compose en cours d’exécution.
- Le fichier autorisé `temp/Potentialvergleich_v7.xlsx` dans le projet.
- Accès Internet lors du premier build pour télécharger les conteneurs et dépendances. L’exploitation courante ne nécessite aucun compte externe.

Le démarrage normal exécute Django, React et PostgreSQL dans des conteneurs. L’application est accessible à [http://127.0.0.1:8000](http://127.0.0.1:8000). Cette installation locale permet à plusieurs comptes authentifiés d’utiliser le même serveur ; un accès depuis le réseau de l’organisation exige une configuration distincte.

## Obtenir le dépôt

Le dépôt du code source est disponible sur [GitHub](https://github.com/stekhoven/military_potential) :

```sh
git clone https://github.com/stekhoven/military_potential.git
cd military_potential
mkdir -p temp
```

Placer ensuite le fichier de travail v7 autorisé sous `temp/Potentialvergleich_v7.xlsx`. Il est volontairement exclu du dépôt Git. Sans ce fichier, la première installation ne peut pas importer le modèle. Les données d’accès locales, bases de données et exportations ne sont pas fournies non plus.

Des LLM ont été utilisés pour générer le code et rechercher les données d’exemple initiales. Avant une utilisation métier de ces valeurs, consulter la [notice de transparence et les indications de vérification des sources](konzept.fr.md#llm-transparency).

## Installation et comptes utilisateurs

Exécuter les commandes suivantes à la racine du projet :

```sh
python3 scripts/setup.py
```

Le script crée le fichier local `.env`, exclu de Git, avec des secrets aléatoires et lance `docker compose up -d --build`. La configuration et les données existantes sont préservées. Le premier démarrage initialise le schéma de la base et importe la structure v7 ainsi que le seul acteur d’exemple USA autorisé. Aucun mot de passe applicatif n’est prédéfini.

Créer son propre compte de analyste en chef :

```sh
docker compose exec app python backend/manage.py account chef --role chief
```

Le mot de passe est demandé sans affichage et doit contenir au moins dix caractères. Créer les comptes analystes de la même manière, avec un nom de compte distinct pour chacun :

```sh
docker compose exec app python backend/manage.py account analyst --role analyst
```

Se connecter ensuite dans le navigateur. Une nouvelle commande `account` avec un nom existant réinitialise explicitement son mot de passe et son rôle. Les comptes et mots de passe ne sont pas exportés en JSON.

## Premier parcours de travail

1. Choisir la langue dans le menu déroulant et ouvrir l’acteur d’exemple USA identifié ou créer son propre acteur.
2. Modifier les valeurs actuelles, la fiabilité, les valeurs futures et la remarque / source dans les évaluations. Les définitions accompagnent les indicateurs. Les champs futurs vides sont repris selon les règles v7.
3. Enregistrer, choisir un scénario et sélectionner plusieurs acteurs à comparer. La comparaison utilise une base commune de modèle et de scénario.
4. Passer entre l’analyse, la vue des nœuds, la justification et le réseau. Les valeurs initiales et de contraste restent identifiées séparément. La justification mène aux indicateurs et aux sources.
5. En tant que analyste en chef, gérer modèle et scénarios et définir g par scénario. La valeur par défaut est 1 ; la première variante de comparaison est 1.25. Les valeurs initiales du modèle sont conservées et les bornages à 1–5 sont indiqués.
6. Exporter ou importer du JSON par la fonction d’échange. L’importation vérifie tout le fichier avant l’enregistrement. Les analystes peuvent importer uniquement des évaluations ; les modifications du modèle et des scénarios exigent les droits de analyste en chef. Les modifications existantes ne sont pas écrasées silencieusement.

Les deux rôles peuvent créer, renommer et supprimer les acteurs ordinaires. Seul le analyste en chef peut renommer, identifier comme exemple ou supprimer l’acteur d’exemple USA ; les analystes peuvent modifier ses évaluations. Il n’est pas recréé au redémarrage. Les révisions enregistrées précédentes restent conservées pour assurer la traçabilité. En cas de conflit d’écriture, les propres saisies non enregistrées sont conservées ; il faut les rapprocher de l’état plus récent avant un nouvel enregistrement.

## Arrêt, redémarrage et diagnostic

```sh
docker compose stop
```

```sh
docker compose up -d
```

```sh
docker compose logs -f app
```

PostgreSQL stocke durablement les données dans le volume Compose. Un arrêt ou un nouveau build ne les supprime pas. `.env`, les fichiers de travail sous `temp/`, les bases locales et les exportations générées restent exclus de Git. Un export JSON contient l’état actuel du modèle et des évaluations, y compris les sources.

## Accès facultatif depuis le réseau local

Par défaut, l’application écoute uniquement sur `127.0.0.1` ; les hôtes autorisés sont `localhost,127.0.0.1,[::1]`. Pour un accès délibérément configuré depuis plusieurs postes, ajouter les valeurs suivantes au `.env` local :

```dotenv
APP_BIND_ADDRESS=0.0.0.0
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,[::1],rechnername,192.0.2.10
```

Remplacer `rechnername` et l’adresse d’exemple `192.0.2.10` par le véritable nom d’hôte et l’IP du LAN. Exécuter ensuite `docker compose up -d`. Les autres postes ouvrent `http://<nom-hote-ou-IP-reel>:8000` et utilisent leurs propres comptes. La base reste accessible uniquement par l’interface locale de l’hôte. Cette variante utilise HTTP ; une mise à disposition HTTPS est à configurer séparément. Le démarrage par défaut ne modifie aucune ouverture réseau.

## Développement natif

Après l’installation normale, Django peut fonctionner sur l’hôte avec la même base PostgreSQL. Utiliser Python dès 3.12 et Node.js 22 dès 22.12. Arrêter le conteneur applicatif ; la base reste active :

```sh
docker compose stop app
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python backend/manage.py migrate
.venv/bin/python backend/manage.py initialize
.venv/bin/python backend/manage.py runserver 127.0.0.1:8000
```

Dans un second terminal, dans le dossier `frontend/` :

```sh
npm ci
npm run dev
```

L’interface de développement ouvre à [http://127.0.0.1:5173](http://127.0.0.1:5173), l’API fonctionne sur le port 8000. La connexion de l’hôte à PostgreSQL utilise le port 55432 ; le fichier local `.env` fournit la configuration d’accès. `initialize` n’importe que si l’espace de travail est encore vide.

## Vérifications et limites

État des vérifications du 15 octobre 2026. La vérification ZIP/XML antérieure du concept est distinguée des vérifications applicatives suivantes :

| Vérification exécutée | Résultat |
| --- | --- |
| Backend sur un véritable PostgreSQL | 27 tests réussis : comparaison de référence v7, données manquantes, cas nuls, logique temporelle, contraste, authentification, CSRF, rôles dont droits sur l’exemple, historique, écritures concurrentes, cycle JSON, importation atomique ainsi que suppression et redémarrage de l’exemple. |
| Frontend | 7 tests et build de production Vite réussis. |
| Navigateur Chromium | Parcours complet réussi : DE/FR/IT avec conservation de l’état, enregistrement et réouverture, modifications dynamiques du modèle et des scénarios, dont suppression des six scénarios puis création et recalcul, g = 1.25, détails et zoom du réseau, justification, comparaison de deux acteurs, cycle JSON et annulation sur erreur, conflit entre deux sessions avec téléchargement du brouillon propre et rechargement, historique en lecture seule, droits analystes et suppression de l’exemple désactivée, connexion sur écran étroit. |
| Démarrage normal des conteneurs | `python3 scripts/setup.py`, build et démarrage avec Gunicorn 26.2 et PostgreSQL 17 vérifiés avec succès. |

Nouvelle vérification pour la publication du dépôt le 16 octobre 2026 : `.venv/bin/python backend/manage.py test potential.tests --settings=config.test_settings --verbosity 1` a produit 26 tests réussis et un test PostgreSQL d’écritures concurrentes ignoré, SQLite ayant été explicitement choisi comme base de test. Les sept tests frontend et le build de production ont réussi. Les liens documentaires locaux et l’exclusion Git des fichiers locaux de travail et de configuration ont été vérifiés. Les vérifications complètes PostgreSQL, navigateur et conteneurs du 15 octobre restent documentées sans modification comme état distinct.

La commande PostgreSQL exécutée est :

```sh
.venv/bin/python backend/manage.py test potential.tests --verbosity 2 --noinput
```

Ont également réussi : importation v7 stricte contre le catalogue DE/FR/IT complet (121 définitions intégrales des notes de cellule), correspondance des 32 termes du glossaire, D1–D9 et formule de contraste dans les trois concepts ainsi que liens Markdown locaux. Ces contrôles de structure ne remplacent pas une vérification dans le navigateur.

La commande PostgreSQL ci-dessus nécessite un `.env` local et une base active. Pour les autres vérifications :

Dans le dossier `frontend/` :

```sh
npm test
npm run build
```

### Répéter la vérification dans le navigateur

Après `npm ci` et `npm run build` dans `frontend/`, installer Chromium :

```sh
npx playwright install chromium
```

Exécuter ensuite à la racine du projet ; Node.js 22 dès 22.12 doit être disponible dans le PATH, PostgreSQL doit fonctionner et le port 8001 doit être libre :

```sh
.venv/bin/python scripts/browser_check.py
```

Les scripts `scripts/browser_check.py` et `scripts/browser-check.mjs` créent une base PostgreSQL temporaire isolée et des mots de passe aléatoires pour les comptes QA. Ils testent cette copie puis suppriment la base et le serveur de test. Les données enregistrées de l’application restent intactes. Les captures d’écran et le journal du serveur sont enregistrés uniquement dans `artifacts/`, exclu de Git. L’exécution dans le navigateur a réussi dans cet état des vérifications.

Des tests backend isolés sont également possibles avec `--settings=config.test_settings`. Cette configuration explicite utilise SQLite en mémoire. L’exploitation normale utilise PostgreSQL ; le parcours documenté ci-dessus a été vérifié avec cette base. L’accès facultatif depuis d’autres postes du LAN n’a pas été vérifié séparément. La version 0.1 utilise des comptes locaux ; une authentification interne à l’organisation ne fait pas partie de cet état.
