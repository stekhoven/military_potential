# Agentenleitlinien für Version 0.1 / Consignes pour les agents pour la version 0.1 / Linee guida per gli agenti per la versione 0.1

## Deutsch

### Auftrag und Arbeitsweise

- Version 0.1 ist als lokal startbare Mehrbenutzeranwendung implementiert. Pflege die Anwendung anhand bestätigter Anforderungen und ausdrücklich beauftragter Änderungen weiter. Das zentrale Repository ist [stekhoven/military_potential](https://github.com/stekhoven/military_potential); lokale Ordnernamen sind keine Repository-Referenz.
- Lies diese Datei, [README](README.md), [Dokumentationsübersicht](docs/README.md), [Fachkonzept](docs/konzept.de.md) und [Glossar](docs/glossar.de.md) vor Änderungen. Neuere bestätigte Benutzerentscheidungen haben Vorrang vor älteren Dokumentpassagen. Führe Konzept und Dokumentation zu Beginn eines beauftragten Baus konsistent nach.
- Kündige den Ansatz vor einem Arbeitspaket kurz an. Ein ausdrücklicher Auftrag für Version 0.1 oder ein Arbeitspaket deckt die zugehörigen Dateiänderungen, Tests und Fehlerbehebungen ab; frage dafür nicht bei jeder Datei erneut nach. Kläre neue Ziele, mehrdeutige Fachregeln oder Änderungen der bestätigten Modelllogik vor ihrer Umsetzung.
- Arbeite in kleinen, nachvollziehbaren Schritten und halte die Anwendung zwischen den Schritten lauffähig. Nutze Python/Django, React und PostgreSQL als vereinbarte Grundlage; zusätzliche Werkzeuge oder Abhängigkeiten brauchen einen konkreten Zweck.

### Fachliche Grundlage und Funktionsumfang

- Fachliche Referenz ist `temp/Potentialvergleich_v7.xlsx`. Excel liefert Funktionen, Nomenklatur, Definitionen und Vergleichswerte. Übernimm Zellnotizen als Indikatordefinitionen; führe keine Makros, eingebetteten Inhalte oder Excel-Formeln aus.
- Der Ausgangsbestand umfasst 121 Indikatoren, 35 bewertete Knoten, 5 Zielknoten und 136 Wirkungsbeziehungen. Diese Zahlen und die Excel-Zellpositionen sind keine festen Anwendungsgrenzen. Verwende stabile IDs und versionierte Modelle und Szenarien.
- Analysten bearbeiten Bewertungen, Verlässlichkeit, Zukunftswerte und Bemerkung / Quelle. Nur Chef Analysten verwalten Modellstruktur, Indikatoren, Zielknoten, Beziehungen, Gewichte, Fristigkeiten, Lenkbarkeit, Qualitätsparameter und Szenarien. Dazu gehören Hinzufügen, Bearbeiten und Entfernen von Indikatoren, Knoten, Zielknoten, Beziehungen und Szenarien; auch vorgegebene Szenarien bleiben bearbeitbar und entfernbar.
- Prüfe Anmeldung und Berechtigungen auf dem Server. Sichere zentrale Speicherung und erkenne gleichzeitige Änderungen, damit keine Bearbeitung still überschrieben wird. Entfernen aus einem neuen Modellstand muss historische Bewertungen und Auswertungen nachvollziehbar erhalten.
- Version 0.1 umfasst den Arbeitsablauf Bewertung → Berechnung → Mehrakteursvergleich → Herleitung bis zu Indikatoren und Quellen. Dazu gehören Knotenübersicht, Zeit und Trend, Chef-Verwaltung sowie ein interaktives Netzwerk mit Knotendetails. Die entfernte Excel-Lagekarte wird nicht nachgebaut; die Netzwerkansicht bleibt erforderlich. Plausibilisierung entfällt vollständig.

### Rechenkern und Kontrastansicht

- Erhalte die geprüfte v7-Kernberechnung: gewichtete Indikatoraggregation, normiertes Wirkungsnetz über vier Runden und bisherige Zeitlogik. Trenne direkte Zukunftsannahmen von fortgepflanzten Knotenwerten; speise Folgen nicht doppelt ein.
- Fehlende Werte bleiben sichtbar. Ein Knoten ohne nutzbare Bewertungen rechnet neutral mit 3 und ist als unbelegt markiert. Verlässlichkeit beeinflusst keine Potenzialwerte. Vollständigkeit verwendet aktive Indikatoren in Zähler und Nenner. Melde nicht berechenbare Zustände sichtbar; vermeide Division durch null und stille Ersatzwerte bei unbekannten IDs.
- Ergänze die bestätigte Kontrastansicht nach der Netzberechnung: `contrast_value = min(5, max(1, 3 + g * (raw_value - 3)))`. Standard ist `g = 1`; `g = 1.25` ist die erste Vergleichsvariante. Bewahre Rohwerte und ursprüngliche Modellwerte. Offizielle Modellwerte werden durch die Ansicht nicht still ersetzt.
- Ein Chef Analyst verwaltet g als versionierten Szenarioparameter. Verwende innerhalb des Szenarios denselben Faktor für alle Zielknoten, Akteure und Zeitstände. Zeige Originalwert, Faktor, Kontrastwert und eine allfällige Begrenzung auf 1–5 in der Herleitung. Ein angezeigtes Kontrast-Gesamtpotenzial wird aus den begrenzten Kontrast-Zielwerten gewichtet berechnet und separat beschriftet.
- Die Kontrastansicht verändert weder Eingabebewertungen noch Verlässlichkeit, Kantenstärken oder Netzwerkrunden. Die früher diskutierte Potenzierung der Kanten ist kein bestätigter Bestandteil von Version 0.1.

### Daten und Austausch

- Die vom Benutzer freigegebenen USA-Beispieldaten dürfen als klar gekennzeichneter, löschbarer Beispielakteur enthalten sein. Stelle gelöschte Beispiele bei Neustarts nicht ungefragt wieder her. Andere vertrauliche Tabelleninhalte, personenbezogene Daten und Kommentarautoren werden nicht als Beispieldaten übernommen.
- Implementiere JSON-Import und -Export mit Formatversion, Modell- und Szenarioreferenzen, stabilen IDs, Bewertungen, Verlässlichkeit, Quellen und Kontrastparameter. Validiere Struktur, Referenzen und Rollenrechte; Modell- und Szenarioimporte erfordern Chef-Rechte. Verhindere Teilimporte bei Fehlern und stille Überschreibungen. Berechne abgeleitete Werte aus den importierten Eingaben neu.
- Erhalte Daten bei Export und erneutem Import verlustfrei. Exportiere keine Zugangsdaten oder Sitzungsinformationen. Halte Excel-Arbeitsdateien unter `temp/`, lokale Datenbanken und erzeugte Exporte ausserhalb der Versionskontrolle; verwende für Tests synthetische oder ausdrücklich freigegebene Beispieldaten.
- Trage keine Zugangsdaten, personenbezogenen Daten oder vertraulichen Tabelleninhalte in Versionskontrolle oder Dokumentation ein. Die ausdrückliche Freigabe der USA-Beispieldaten gilt nur für diesen Beispieldatensatz und ist keine allgemeine Freigabe weiterer Inhalte.
- Halte den dokumentierten LLM-Einsatz für Codegenerierung und Recherche der initialen Beispieldaten transparent. Unterscheide technische Modellprüfung von sachlicher Quellenprüfung; behaupte keine fachliche Verifizierung der Beispieldaten ohne Beleg. Excel-Arbeitsdateien werden separat bereitgestellt und bleiben aus dem Repository ausgeschlossen.

### Sprache und Bedienung

- Anwendung, Hilfen und Projektdokumentation werden konsistent auf Deutsch, Französisch und Italienisch gepflegt. Das Sprachdropdown zeigt jeweils eine aktive Sprache und erhält Auswahl, Eingaben und Ergebnisse. Frei eingegebene Bemerkungen und Quellen bleiben in ihrer Originalsprache.
- Nutze passende Begriffe aus den bereitgestellten Reglementsfassungen und dem Glossar; erkläre Modellbegriffe. Verwende **Operative Domänen / Domaines opérationnels / Domini operativi** und unterscheide Umwelt von Umfeld. Gestalte nüchtern und modern mit eigenständigen, intuitiven Ansichten, verständlichen Fehlern, Tastaturbedienung und Tabellenalternativen für Grafiken.

### Prüfungen und Abschluss eines Arbeitspakets

- Prüfe fachlich relevante Änderungen mit v7-Referenzfällen bei `g = 1`, fehlenden Daten, Nullfällen, Zeitlogik und dynamischen Modelländerungen. Prüfe die Kontrasttransformation, Neutralwert 3, Begrenzung und gleichbleibende Vergleichsbasis.
- Prüfe serverseitige Rollenrechte, Speichern und Wiederöffnen, Schreibkonflikte, JSON-Rundlauf und ungültige Importe, Löschbarkeit des Beispiels sowie Vollständigkeit und Zustandserhalt aller drei Sprachen. Wähle zur Änderung passende Prüfungen und ergänze Tests für tatsächliche Fehler- und Regressionsrisiken.
- Dokumentiere den lokalen Start, Einrichtung der Datenbank und Benutzerkonten sowie die tatsächlich ausgeführten Prüfungen und Ergebnisse in allen drei Sprachen. Behaupte keine bestandenen Tests oder vollständige Funktionen ohne Prüfung. Berichte konkret, was fertig ist und welche Einschränkungen verbleiben.

## Français

### Mandat et méthode de travail

- La version 0.1 est implémentée comme application multiutilisateur démarrable localement. Fais évoluer l’application selon les exigences confirmées et les modifications expressément demandées. Le dépôt central est [stekhoven/military_potential](https://github.com/stekhoven/military_potential) ; les noms de dossiers locaux ne désignent pas le dépôt.
- Avant toute modification, lis ce fichier, le [README](README.md), l’[aperçu documentaire](docs/README.md), le [concept métier](docs/konzept.fr.md) et le [glossaire](docs/glossar.fr.md). Les décisions confirmées les plus récentes de l’utilisateur priment sur les passages documentaires plus anciens. Au début d’une réalisation mandatée, actualise le concept et la documentation de manière cohérente.
- Annonce brièvement l’approche avant un lot de travail. Un mandat explicite pour la version 0.1 ou un lot couvre les modifications de fichiers, tests et corrections associés ; ne redemande pas l’autorisation pour chaque fichier. Clarifie les nouveaux objectifs, les règles métier ambiguës ou les changements de logique confirmée avant de les réaliser.
- Avance par étapes ciblées et compréhensibles, en conservant une application exécutable entre les étapes. Utilise Python/Django, React et PostgreSQL comme base convenue ; tout outil ou dépendance supplémentaire doit avoir un objectif concret.

### Référence métier et périmètre fonctionnel

- La référence métier est `temp/Potentialvergleich_v7.xlsx`. Excel fournit fonctions, nomenclature, définitions et valeurs de référence. Reprends les notes de cellules comme définitions des indicateurs ; n’exécute ni macros, ni contenus incorporés, ni formules Excel.
- L’inventaire initial comprend 121 indicateurs, 35 nœuds évalués, 5 nœuds cibles et 136 relations d’effet. Ces nombres et les positions des cellules Excel ne sont pas des limites fixes de l’application. Utilise des identifiants stables et des modèles et scénarios versionnés.
- Les analystes modifient évaluations, fiabilité, valeurs futures et remarque / source. Seuls les analystes en chef gèrent structure du modèle, indicateurs, nœuds cibles, relations, pondérations, horizons d’effet, contrôlabilité, paramètres de qualité et scénarios. Cela comprend l’ajout, la modification et la suppression des indicateurs, nœuds, nœuds cibles, relations et scénarios ; les scénarios prédéfinis restent eux aussi modifiables et supprimables.
- Vérifie l’authentification et les autorisations sur le serveur. Assure le stockage centralisé et détecte les modifications simultanées pour éviter tout écrasement silencieux. Une suppression dans une nouvelle version du modèle doit préserver la traçabilité des évaluations et analyses historiques.
- La version 0.1 couvre le parcours évaluation → calcul → comparaison multiacteur → justification jusqu’aux indicateurs et sources. Elle comprend la vue des nœuds, les échéances et tendances, l’administration par l’analyste en chef et un réseau interactif avec détails des nœuds. L’ancienne feuille Excel Lagekarte n’est pas reproduite ; la vue réseau reste requise. L’ajustement de plausibilité est entièrement supprimé.

### Moteur de calcul et vue de contraste

- Conserve le calcul principal v7 vérifié : agrégation pondérée des indicateurs, réseau d’effet normalisé sur quatre itérations et logique temporelle existante. Sépare les hypothèses futures directes des valeurs de nœuds propagées ; ne compte pas deux fois les effets consécutifs.
- Les valeurs manquantes restent visibles. Un nœud sans évaluations exploitables est calculé à la valeur neutre 3 et signalé comme non étayé. La fiabilité ne modifie pas les potentiels. La complétude utilise les indicateurs actifs au numérateur et au dénominateur. Signale les états non calculables ; évite les divisions par zéro et les valeurs de remplacement silencieuses pour des identifiants inconnus.
- Ajoute la vue de contraste confirmée après le calcul du réseau : `contrast_value = min(5, max(1, 3 + g * (raw_value - 3)))`. La valeur par défaut est `g = 1` ; `g = 1.25` est la première variante de comparaison. Conserve les valeurs brutes et les valeurs initiales du modèle. La vue ne remplace pas silencieusement les valeurs officielles du modèle.
- Un analyste en chef gère g comme paramètre de scénario versionné. Dans le scénario, applique le même facteur à tous les nœuds cibles, acteurs et échéances. La justification montre valeur initiale, facteur, valeur de contraste et éventuel bornage à 1–5. Un potentiel global de contraste affiché est calculé par pondération des valeurs cibles de contraste bornées et porte un libellé distinct.
- La vue de contraste ne modifie ni évaluations saisies, ni fiabilité, ni intensité des arêtes, ni itérations du réseau. L’exponentiation des arêtes discutée auparavant ne fait pas partie du périmètre confirmé de la version 0.1.

### Données et échanges

- Les données d’exemple des USA autorisées par l’utilisateur peuvent figurer comme acteur d’exemple clairement identifié et supprimable. Ne recrée pas automatiquement les exemples supprimés au redémarrage. Ne reprends pas comme exemples d’autres contenus confidentiels du tableur, données personnelles ou auteurs de commentaires.
- Réalise l’importation et l’exportation JSON avec version du format, références du modèle et du scénario, identifiants stables, évaluations, fiabilité, sources et paramètre de contraste. Valide structure, références et droits des rôles ; les importations de modèles et de scénarios exigent les droits d’analyste en chef. Empêche les importations partielles en cas d’erreur et les écrasements silencieux. Recalcule les valeurs dérivées à partir des saisies importées.
- Préserve les données sans perte lors d’une exportation suivie d’une réimportation. N’exporte ni identifiants d’accès ni informations de session. Garde les fichiers de travail Excel sous `temp/`, les bases locales et les exports générés hors du contrôle de version ; utilise des données synthétiques ou des exemples expressément autorisés pour les tests.
- N’ajoute aucune donnée d’accès, donnée personnelle ou contenu confidentiel du tableur au contrôle de version ou à la documentation. L’autorisation explicite des données d’exemple des USA concerne uniquement cet ensemble d’exemple et n’autorise pas d’autres contenus de manière générale.
- Maintiens la transparence sur l’usage documenté de LLM pour générer le code et rechercher les données initiales d’exemple. Distingue la vérification technique du modèle de celle des sources factuelles ; n’affirme pas que les exemples ont été vérifiés sur le fond sans preuve. Les classeurs de travail Excel sont fournis séparément et restent exclus du dépôt.

### Langue et utilisation

- Maintiens de manière cohérente l’application, les aides et la documentation en allemand, français et italien. Le menu de langue affiche une seule langue active et conserve sélection, saisies et résultats. Les remarques et sources saisies librement restent dans leur langue d’origine.
- Utilise les termes appropriés des versions fournies du règlement et du glossaire ; explique les termes du modèle. Emploie **Operative Domänen / Domaines opérationnels / Domini operativi** et distingue milieu et environnement. Adopte une présentation sobre et moderne avec des vues propres et intuitives, des erreurs compréhensibles, une utilisation au clavier et des tableaux en alternative aux graphiques.

### Vérifications et clôture d’un lot de travail

- Vérifie les modifications métier avec les cas de référence v7 à `g = 1`, les données manquantes, les cas nuls, la logique temporelle et les changements dynamiques du modèle. Vérifie la transformation de contraste, la valeur neutre 3, le bornage et le maintien d’une base de comparaison commune.
- Vérifie les droits des rôles sur le serveur, l’enregistrement et la réouverture, les conflits d’écriture, le cycle exportation/réimportation JSON et les imports invalides, la suppression de l’exemple ainsi que la complétude et la conservation de l’état dans les trois langues. Choisis les contrôles adaptés au changement et ajoute des tests pour les risques réels d’erreur et de régression.
- Documente dans les trois langues le démarrage local, la configuration de la base et des comptes ainsi que les vérifications réellement exécutées et leurs résultats. N’annonce ni tests réussis ni fonctions complètes sans vérification. Indique concrètement ce qui est terminé et les limites restantes.

## Italiano

### Mandato e metodo di lavoro

- La versione 0.1 è implementata come applicazione multiutente avviabile localmente. Mantieni e sviluppa l’applicazione in base ai requisiti confermati e alle modifiche espressamente richieste. Il repository centrale è [stekhoven/military_potential](https://github.com/stekhoven/military_potential); i nomi delle cartelle locali non identificano il repository.
- Prima di modificare i file, leggi questo documento, il [README](README.md), l’[indice della documentazione](docs/README.md), il [concetto funzionale](docs/konzept.it.md) e il [glossario](docs/glossar.it.md). Le decisioni confermate più recenti dell’utente prevalgono sui passaggi precedenti della documentazione. All’inizio di una realizzazione autorizzata, aggiorna in modo coerente concetto e documentazione.
- Annuncia brevemente l’approccio prima di un pacchetto di lavoro. Un incarico esplicito per la versione 0.1 o un pacchetto comprende le modifiche ai file, i test e le correzioni pertinenti; non richiedere nuovamente l’autorizzazione per ogni file. Chiarisci nuovi obiettivi, regole funzionali ambigue o modifiche alla logica confermata prima di realizzarli.
- Procedi con passi mirati e comprensibili, mantenendo l’applicazione avviabile tra un passo e l’altro. Usa Python/Django, React e PostgreSQL come base concordata; ogni strumento o dipendenza aggiuntiva richiede uno scopo concreto.

### Riferimento funzionale e ambito

- Il riferimento funzionale è `temp/Potentialvergleich_v7.xlsx`. Excel fornisce funzioni, nomenclatura, definizioni e valori di riferimento. Riprendi le note delle celle come definizioni degli indicatori; non eseguire macro, contenuti incorporati o formule Excel.
- Il contenuto iniziale comprende 121 indicatori, 35 nodi valutati, 5 nodi obiettivo e 136 relazioni d’effetto. Questi numeri e le posizioni delle celle Excel non sono limiti fissi dell’applicazione. Usa ID stabili e modelli e scenari versionati.
- Gli analisti modificano valutazioni, attendibilità, valori futuri e osservazione / fonte. Solo i capi analista gestiscono struttura del modello, indicatori, nodi obiettivo, relazioni, ponderazioni, orizzonti d’effetto, controllabilità, parametri di qualità e scenari. Ciò comprende aggiunta, modifica e rimozione di indicatori, nodi, nodi obiettivo, relazioni e scenari; anche gli scenari predefiniti rimangono modificabili e rimovibili.
- Verifica autenticazione e autorizzazioni sul server. Garantisci la memorizzazione centrale e rileva le modifiche simultanee per evitare sovrascritture silenziose. La rimozione in una nuova versione del modello deve preservare la tracciabilità delle valutazioni e delle analisi storiche.
- La versione 0.1 comprende il percorso valutazione → calcolo → confronto tra attori → derivazione fino a indicatori e fonti. Include panoramica dei nodi, tempi e tendenze, gestione del capo analista e rete interattiva con dettagli dei nodi. Il precedente foglio Excel Lagekarte non viene riprodotto; la vista della rete rimane necessaria. La correzione di plausibilità viene eliminata completamente.

### Motore di calcolo e vista di contrasto

- Mantieni il calcolo principale v7 verificato: aggregazione ponderata degli indicatori, rete d’effetto normalizzata su quattro passaggi e logica temporale esistente. Separa le ipotesi future dirette dai valori dei nodi propagati; non conteggiare due volte gli effetti successivi.
- I valori mancanti rimangono visibili. Un nodo senza valutazioni utilizzabili viene calcolato con il valore neutro 3 e segnalato come privo di riscontri. L’attendibilità non modifica i potenziali. La completezza usa gli indicatori attivi sia al numeratore sia al denominatore. Segnala gli stati non calcolabili; evita divisioni per zero e valori sostitutivi silenziosi per ID sconosciuti.
- Aggiungi la vista di contrasto confermata dopo il calcolo della rete: `contrast_value = min(5, max(1, 3 + g * (raw_value - 3)))`. Il valore predefinito è `g = 1`; `g = 1.25` è la prima variante di confronto. Conserva i valori grezzi e quelli originali del modello. La vista non sostituisce silenziosamente i valori ufficiali del modello.
- Un capo analista gestisce g come parametro di scenario versionato. All’interno dello scenario applica lo stesso fattore a tutti i nodi obiettivo, attori e momenti di riferimento. La derivazione mostra valore originale, fattore, valore di contrasto ed eventuale limitazione a 1–5. Un potenziale complessivo di contrasto visualizzato viene calcolato ponderando i valori obiettivo di contrasto limitati ed è contrassegnato separatamente.
- La vista di contrasto non modifica valutazioni inserite, attendibilità, intensità degli archi o passaggi della rete. L’elevamento a potenza degli archi discusso in precedenza non fa parte dell’ambito confermato della versione 0.1.

### Dati e scambio

- I dati di esempio degli USA autorizzati dall’utente possono essere inclusi come attore di esempio chiaramente identificato e rimovibile. Non ricreare automaticamente gli esempi eliminati al riavvio. Non riprendere come esempi altri contenuti riservati del foglio, dati personali o autori dei commenti.
- Realizza importazione ed esportazione JSON con versione del formato, riferimenti a modello e scenario, ID stabili, valutazioni, attendibilità, fonti e parametro di contrasto. Valida struttura, riferimenti e diritti dei ruoli; le importazioni di modelli e scenari richiedono i diritti di capo analista. Impedisci importazioni parziali in caso di errore e sovrascritture silenziose. Ricalcola i valori derivati dai dati importati.
- Conserva i dati senza perdite durante esportazione e successiva reimportazione. Non esportare credenziali o informazioni di sessione. Mantieni i file di lavoro Excel sotto `temp/`, i database locali e le esportazioni generate fuori dal controllo di versione; usa dati sintetici o esempi espressamente autorizzati per i test.
- Non inserire credenziali, dati personali o contenuti riservati del foglio di calcolo nel controllo di versione o nella documentazione. L’autorizzazione esplicita dei dati di esempio degli USA riguarda soltanto questo insieme di esempio e non autorizza in generale altri contenuti.
- Mantieni trasparente l’uso documentato dei LLM per generare il codice e ricercare i dati iniziali di esempio. Distingui la verifica tecnica del modello dalla verifica fattuale delle fonti; non dichiarare verificati i dati di esempio senza riscontri. I file di lavoro Excel vengono forniti separatamente e rimangono esclusi dal repository.

### Lingua e utilizzo

- Mantieni in modo coerente applicazione, guide e documentazione in tedesco, francese e italiano. Il menu della lingua mostra una sola lingua attiva e conserva selezione, dati inseriti e risultati. Osservazioni e fonti inserite liberamente rimangono nella lingua originale.
- Usa i termini appropriati delle versioni fornite del regolamento e del glossario; spiega i termini del modello. Usa **Operative Domänen / Domaines opérationnels / Domini operativi** e distingui ambiente e contesto. Adotta una presentazione sobria e moderna con viste proprie e intuitive, errori comprensibili, utilizzo da tastiera e tabelle alternative ai grafici.

### Verifiche e chiusura di un pacchetto di lavoro

- Verifica le modifiche funzionali con casi di riferimento v7 a `g = 1`, dati mancanti, casi nulli, logica temporale e modifiche dinamiche del modello. Verifica trasformazione di contrasto, valore neutro 3, limiti e mantenimento di una base di confronto comune.
- Verifica i diritti dei ruoli sul server, salvataggio e riapertura, conflitti di scrittura, ciclo esportazione/reimportazione JSON e importazioni non valide, rimozione dell’esempio, completezza e conservazione dello stato in tutte e tre le lingue. Scegli controlli adatti alla modifica e aggiungi test per rischi reali di errore e regressione.
- Documenta nelle tre lingue l’avvio locale, la configurazione del database e degli account, le verifiche effettivamente eseguite e i risultati. Non dichiarare test superati o funzioni complete senza verifica. Indica concretamente ciò che è terminato e i limiti rimanenti.
