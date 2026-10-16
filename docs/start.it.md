# Avviare localmente la versione 0.1

[Deutsch](start.de.md) · [Français](start.fr.md) · [Italiano](start.it.md) · [Documentazione](README.md)

## Prerequisiti

- Git, Python da 3.12 sull’host e Docker Desktop o Docker Engine con Compose in esecuzione.
- Il file autorizzato `temp/Potentialvergleich_v7.xlsx` nel progetto.
- Accesso a Internet per la prima compilazione, per scaricare contenitori e dipendenze. Il normale utilizzo dell’applicazione non richiede account esterni.

L’avvio normale esegue Django, React e PostgreSQL in contenitori. L’applicazione è raggiungibile su [http://127.0.0.1:8000](http://127.0.0.1:8000). Questa installazione locale consente a più account autenticati di utilizzare lo stesso server; l’accesso dalla rete dell’organizzazione richiede una configurazione separata.

## Ottenere il repository

Il repository del codice sorgente è disponibile su [GitHub](https://github.com/stekhoven/military_potential):

```sh
git clone https://github.com/stekhoven/military_potential.git
cd military_potential
mkdir -p temp
```

Collocare quindi il file di lavoro v7 autorizzato in `temp/Potentialvergleich_v7.xlsx`. È volutamente escluso dal repository Git. Senza questo file, la prima configurazione non può importare il modello. Non sono forniti neppure credenziali locali, database ed esportazioni.

Gli LLM sono stati utilizzati per generare il codice e ricercare i dati di esempio iniziali. Prima di utilizzare questi valori per analisi, consultare la [nota di trasparenza e le indicazioni per verificare le fonti](konzept.it.md#llm-transparency).

## Configurazione e account utente

Eseguire i comandi seguenti dalla cartella principale del progetto:

```sh
python3 scripts/setup.py
```

Lo script crea il file locale `.env`, escluso da Git, con segreti casuali e avvia `docker compose up -d --build`. Configurazione e dati esistenti vengono conservati. Il primo avvio inizializza lo schema del database e importa la struttura v7 e soltanto l’attore di esempio USA autorizzato. Non esiste una password applicativa predefinita.

Creare il proprio account di capo analista:

```sh
docker compose exec app python backend/manage.py account chef --role chief
```

La password viene richiesta senza visualizzarla e deve contenere almeno dieci caratteri. Creare gli account analista nello stesso modo, con un nome distinto per ogni account:

```sh
docker compose exec app python backend/manage.py account analyst --role analyst
```

Accedere quindi nel browser. Un nuovo comando `account` con un nome esistente reimposta espressamente password e ruolo. Account e password non vengono esportati in JSON.

## Primo flusso di lavoro

1. Scegliere la lingua nel menu a discesa e aprire l’attore di esempio USA identificato oppure creare il proprio attore.
2. Modificare valori attuali, attendibilità, valori futuri e osservazione / fonte nelle valutazioni. Le definizioni accompagnano gli indicatori. I campi futuri vuoti vengono ripresi secondo le regole v7.
3. Salvare, scegliere uno scenario e selezionare più attori per il confronto. Il confronto utilizza la stessa base di modello e scenario.
4. Passare tra analisi, panoramica dei nodi, derivazione e rete. Valori originali e valori di contrasto rimangono identificati separatamente. La derivazione conduce a indicatori e fonti.
5. Come capo analista, gestire modello e scenari e impostare g per ogni scenario. Il valore predefinito è 1; la prima variante di confronto è 1.25. I valori originali del modello vengono conservati e le limitazioni a 1–5 vengono indicate.
6. Esportare o importare JSON tramite la funzione di scambio. L’importazione verifica l’intero file prima del salvataggio. Gli analisti possono importare soltanto valutazioni; le modifiche a modello e scenari richiedono i diritti di capo analista. Le modifiche esistenti non vengono sovrascritte silenziosamente.

Entrambi i ruoli possono creare, rinominare e rimuovere attori ordinari. Soltanto il capo analista può rinominare, contrassegnare come esempio o rimuovere l’attore di esempio USA; gli analisti possono modificarne le valutazioni. Non viene ricreato al riavvio. Le revisioni salvate precedenti rimangono conservate per la tracciabilità. In caso di conflitto di scrittura, i propri dati inseriti non salvati vengono conservati; prima di salvare nuovamente occorre confrontarli con lo stato più recente.

## Arresto, riavvio e diagnosi

```sh
docker compose stop
```

```sh
docker compose up -d
```

```sh
docker compose logs -f app
```

PostgreSQL conserva i dati nel volume Compose. L’arresto o una nuova compilazione non li elimina. `.env`, file di lavoro sotto `temp/`, database locali ed esportazioni generate rimangono esclusi da Git. Un’esportazione JSON contiene lo stato attuale del modello e delle valutazioni, comprese le fonti.

## Accesso opzionale dalla rete locale

Per impostazione predefinita, l’applicazione ascolta soltanto su `127.0.0.1`; gli host autorizzati sono `localhost,127.0.0.1,[::1]`. Per un accesso configurato consapevolmente da più postazioni, aggiungere i seguenti valori al `.env` locale:

```dotenv
APP_BIND_ADDRESS=0.0.0.0
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,[::1],rechnername,192.0.2.10
```

Sostituire `rechnername` e l’indirizzo di esempio `192.0.2.10` con il nome host e l’IP LAN effettivi. Eseguire quindi `docker compose up -d`. Le altre postazioni aprono `http://<nome-host-o-IP-effettivo>:8000` e usano account propri. Il database rimane raggiungibile soltanto tramite l’interfaccia locale dell’host. Questa variante utilizza HTTP; una distribuzione con HTTPS richiede una configurazione separata. L’avvio predefinito non modifica alcuna apertura di rete.

## Sviluppo nativo

Dopo l’installazione normale, Django può essere eseguito sull’host con lo stesso database PostgreSQL. Utilizzare Python da 3.12 e Node.js 22 da 22.12. Arrestare il contenitore applicativo; il database rimane attivo:

```sh
docker compose stop app
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python backend/manage.py migrate
.venv/bin/python backend/manage.py initialize
.venv/bin/python backend/manage.py runserver 127.0.0.1:8000
```

In un secondo terminale, nella cartella `frontend/`:

```sh
npm ci
npm run dev
```

L’interfaccia di sviluppo si apre su [http://127.0.0.1:5173](http://127.0.0.1:5173), l’API funziona sulla porta 8000. La connessione dell’host a PostgreSQL utilizza la porta 55432; il file locale `.env` fornisce la configurazione d’accesso. `initialize` importa soltanto quando lo spazio di lavoro è ancora vuoto.

## Verifiche e limiti

Stato delle verifiche del 15 ottobre 2026. La precedente verifica ZIP/XML del concetto viene distinta dalle verifiche applicative seguenti:

| Verifica eseguita | Risultato |
| --- | --- |
| Backend su PostgreSQL reale | 27 test superati: confronto di riferimento v7, dati mancanti, casi nulli, logica temporale, contrasto, autenticazione, CSRF, ruoli compresi i diritti sull’esempio, cronologia, scritture concorrenti, ciclo JSON, importazione atomica, eliminazione e riavvio dell’esempio. |
| Frontend | 7 test e compilazione di produzione Vite superati. |
| Browser Chromium | Percorso completo superato: DE/FR/IT con conservazione dello stato, salvataggio e riapertura, modifiche dinamiche al modello e agli scenari, comprese eliminazione di tutti e sei gli scenari e successiva creazione con ricalcolo, g = 1.25, dettagli e zoom della rete, derivazione, confronto tra due attori, ciclo JSON e annullamento in caso di errore, conflitto tra due sessioni con download della propria bozza e ricaricamento, cronologia di sola lettura, diritti degli analisti e rimozione dell’esempio disabilitata, accesso su schermo stretto. |
| Avvio normale dei contenitori | `python3 scripts/setup.py`, compilazione e avvio con Gunicorn 26.2 e PostgreSQL 17 verificati con successo. |

Nuova verifica per la pubblicazione del repository il 16 ottobre 2026: `.venv/bin/python backend/manage.py test potential.tests --settings=config.test_settings --verbosity 1` ha prodotto 26 test superati e un test PostgreSQL sulle scritture concorrenti saltato, poiché SQLite è stato scelto esplicitamente come database di test. I sette test frontend e la compilazione di produzione sono riusciti. Sono stati verificati i collegamenti documentali locali e l’esclusione da Git dei file locali di lavoro e configurazione. Le verifiche complete PostgreSQL, browser e contenitori del 15 ottobre rimangono documentate senza modifiche come stato distinto.

Il comando PostgreSQL eseguito è:

```sh
.venv/bin/python backend/manage.py test potential.tests --verbosity 2 --noinput
```

Sono state superate anche: importazione v7 rigorosa rispetto al catalogo DE/FR/IT completo (121 definizioni integrali delle note delle celle), corrispondenza dei 32 termini del glossario, D1–D9 e formula di contrasto nei tre concetti e collegamenti Markdown locali. Questi controlli strutturali non sostituiscono una verifica nel browser.

Il comando PostgreSQL sopra riportato richiede un `.env` locale e un database attivo. Per le ulteriori verifiche:

Nella cartella `frontend/`:

```sh
npm test
npm run build
```

### Ripetere la verifica nel browser

Dopo `npm ci` e `npm run build` nella cartella `frontend/`, installare Chromium:

```sh
npx playwright install chromium
```

Eseguire quindi dalla cartella principale del progetto; Node.js 22 da 22.12 deve essere disponibile nel PATH, PostgreSQL deve essere attivo e la porta 8001 libera:

```sh
.venv/bin/python scripts/browser_check.py
```

Gli script `scripts/browser_check.py` e `scripts/browser-check.mjs` creano un database PostgreSQL temporaneo isolato e password casuali per gli account QA. Eseguono i test su questa copia e rimuovono poi database e server di test. I dati salvati dell’applicazione rimangono invariati. Schermate e log del server vengono salvati soltanto nella cartella `artifacts/`, esclusa da Git. L’esecuzione nel browser è stata completata con successo in questo stato delle verifiche.

Sono possibili anche test backend isolati con `--settings=config.test_settings`. Questa configurazione esplicita utilizza SQLite in memoria. Il normale utilizzo impiega PostgreSQL; il percorso sopra documentato è stato verificato con questo database. L’accesso opzionale da altre postazioni LAN non è stato verificato separatamente. La versione 0.1 utilizza account locali; l’autenticazione interna dell’organizzazione non fa parte di questa versione.
