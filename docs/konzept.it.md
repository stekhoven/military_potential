# Concetto funzionale dello strumento per il confronto del potenziale militare

[Deutsch](konzept.de.md) · [Français](konzept.fr.md) · [Italiano](konzept.it.md) · [Glossario](glossar.it.md) · [Documentazione](README.md)

Stato: 16 ottobre 2026. Il riferimento funzionale è `temp/Potentialvergleich_v7.xlsx`; v3 rimane disponibile localmente come versione di confronto. La versione 0.1 dell’applicazione multiutente avviabile localmente è realizzata. Segue le linee guida di AGENTS.md e i requisiti confermati di seguito. Questo concetto tiene conto delle decisioni confermate da D1 a D9 e della successiva conferma della rimozione della verifica di plausibilità dallo strumento.

Il repository del codice sorgente è [stekhoven/military_potential su GitHub](https://github.com/stekhoven/military_potential). File di lavoro Excel, configurazione locale, database ed esportazioni generate rimangono esclusi da Git. Per la prima configurazione occorre fornire localmente il file v7 autorizzato; la [guida di avvio](start.it.md) descrive la procedura.

<a id="llm-transparency"></a>

## Trasparenza sull’utilizzo di LLM

I modelli linguistici di grandi dimensioni (Large Language Models, LLM) sono stati utilizzati per generare il codice applicativo e ricercare i dati di esempio iniziali relativi agli USA. I valori di esempio servono alla dimostrazione e non costituiscono un’affermazione verificata sulle capacità militari reali.

Prima di un utilizzo per analisi, l’analista responsabile verifica le fonti originali, la loro attualità, le valutazioni e l’attendibilità. I test software documentati verificano i calcoli e il comportamento dell’applicazione; non confermano la correttezza fattuale dei dati ricercati o delle ipotesi del modello.

## 1 Obiettivo e requisiti confermati

Lo strumento riprende funzionalità, nomenclatura e regole di calcolo del modello verificato. Gli analisti modificano valutazioni, attendibilità, ipotesi future e osservazioni o fonti. I capi analisti gestiscono inoltre struttura del modello, indicatori, nodi obiettivo, relazioni d’effetto, ponderazioni e scenari. Le viste sostengono una valutazione tracciabile e il confronto tra più attori.

La denominazione tedesca vincolante è **Operative Domänen**. La versione francese utilizza **Domaines opérationnels**, quella italiana **Domini operativi**. Gli ID tecnici rimangono invariati in caso di modifica della denominazione e di traduzione. I termini regolamentari vengono utilizzati sulla base delle tre versioni fornite del regolamento 50.041; i termini del modello sono spiegati nel [Glossario](glossar.it.md).

L’interfaccia visualizza **una sola lingua** alla volta. Il menu a discesa offre **Deutsch**, **Français** e **Italiano**. Il cambio di lingua conserva selezioni, dati inseriti e risultati. L’applicazione viene avviata localmente e supporta più utenti con autenticazione, memorizzazione centrale e diritti dei ruoli verificati sul server.

Il design è sobrio e moderno: colori discreti, tipografia chiara, moduli comprensibili ed evidenziazioni mirate. I contenuti funzionali del file Excel vengono trasferiti in viste autonome e intuitive.

## 2 Inventario e corrispondenza con le fonti di v7

| Oggetto | Contenuto del modello Excel | Trasferimento |
| --- | --- | --- |
| Indicatori | 121 ID univoci | Tutte le definizioni e le assegnazioni ai nodi; escludere intestazioni e righe di riserva. |
| Nodi valutati | 35 | PMESII, ambiente e sette Domini operativi. |
| Fattori di potenziale | 5 nodi obiettivo | X1 personale, X2 materiale, X3 condotta e istruzione, X4 capacità di resistenza, X5 volontà di combattere. |
| Relazioni d’effetto | 136 | Conservare origine, destinazione, intensità, segno e orizzonte d’effetto. |
| Scenari | 6 modelli predefiniti compilati | Riprendere nomi, ipotesi e pesi dei fattori; il capo analista può creare, modificare e rimuovere scenari. |
| Attori e momenti di riferimento | 4 blocchi predisposti per gli attori; oggi, tra 5 anni, tra 10 anni | Gestire le valutazioni degli attori separatamente dal modello. |

Queste cifre descrivono il contenuto da importare. L’applicazione supporta un numero variabile di indicatori, nodi, nodi obiettivo e scenari. Le estensioni modificano in modo coerente calcoli, tabelle, diagrammi e rete. Le altre valutazioni riservate, i nomi degli attori e le osservazioni sulle fonti rimangono esclusi dalla documentazione del progetto e dal controllo di versione. I valori USA espressamente autorizzati sono l’unica eccezione, come insieme di esempio identificato e rimovibile.

### Fogli di lavoro e dati inseriti

| Fonte Excel | Contenuto e trasferimento |
| --- | --- |
| `Anleitung!A1:B23` | Regole funzionali, introduzione e guide. |
| `Bewertung!A4:E149` | ID, gruppo, ID del nodo, denominazioni del nodo e dell’indicatore; soltanto righe di indicatori compilate. |
| Note delle celle di `Bewertung!E5:E149` | Leggere le 121 definizioni complete dai componenti dei commenti, oltre ai titoli visibili delle celle. Gli autori dei commenti non vengono trasferiti. |
| `Bewertung!F3:Y149` | Quattro blocchi di attori con valori attuali, attendibilità, valori futuri e osservazione / fonte. |
| `Modell!A4:I18` | Area degli scenari; sono compilate le righe da 5 a 10. A numero, B nome, C ipotesi, da E a I pesi dei fattori. |
| `Modell!A23:D57` | Catalogo dei nodi: A ID, B nome, C gruppo, D controllabilità. |
| `Modell!E21:AR22` e `E23:AR57` | Denominazioni e ID di destinazione e matrice degli effetti orientati; la riga influenza la colonna. |
| `Modell!A61:E197` | Pesi degli indicatori con motivazione / fonte; ID compilati nelle righe da 62 a 182. |
| `Modell!D202` e `D204` | Soglie configurabili del semaforo della qualità dei dati; l’etichetta intermedia in D203 è derivata. |
| `Berechnung!A1:AW976` | Passaggi di calcolo e valori di confronto memorizzati. |
| `Übersicht!B1:R48` | Valori dei nodi di più attori per tutti e tre i momenti di riferimento, con tendenza. |
| `Herleitung!B1:O49` | Calcolo, composizione, contributi dei nodi, indicazioni di qualità e dettagli degli indicatori. |
| `Auswertung!B1:T40` | Analisi compatta di più attori; scenario in D3, momento di riferimento in L3. |

| Campo in Bewertung | Attore 1 | Attore 2 | Attore 3 | Attore 4 |
| --- | --- | --- | --- | --- |
| Nome | F3 | K3 | P3 | U3 |
| Valutazione attuale | F | K | P | U |
| Attendibilità | G | L | Q | V |
| Valutazione tra 5 anni | H | M | R | W |
| Valutazione tra 10 anni | I | N | S | X |
| Osservazione / fonte | J | O | T | Y |

I pesi degli indicatori vengono associati tramite l’ID di `Modell!A62:D197`. La posizione attuale della riga è un riferimento alla fonte, non una chiave permanente. L’importazione legge anche le convalide estese x14 per l’assegnazione dei nodi e la selezione degli attori. Note sulle fonti e osservazioni vengono trattate come dati.

| Dato inserito | Intervallo ammesso |
| --- | --- |
| Valutazioni attuali e future | Numeri interi da 1 a 5; il dato mancante ha uno stato proprio. I valori futuri sono valutazioni assolute. |
| Peso dell’indicatore | Numero decimale da 0 a 10; 0 disattiva l’indicatore. |
| Attendibilità | A1, A2, A3, B1, B2, B3, C1, C2 o C3; il dato mancante è separato. |
| Effetto | ±1, ±2 o ±3 con K, M o L; l’assenza di relazione ha uno stato vuoto proprio. |
| Peso del fattore | Numero intero da 0 a 3. |
| Controllabilità | Controllabile, parzialmente controllabile o non controllabile. |
| Soglie della qualità dei dati | Valori da 0 a 1; la soglia inferiore è minore di quella superiore. |

### Intervalli di calcolo

Tutti gli intervalli seguenti appartengono al foglio `Berechnung`.

| Intervallo | Scopo |
| --- | --- |
| A52:AN196 | Valori degli indicatori e associazione dei pesi. |
| AQ50:AW54 | Completezza, attendibilità e quota incerta. |
| A201:AE236 | Valori diretti dei nodi, variazioni e valori dei nodi con effetti conseguenti. |
| C242:AP281; C282 | Matrice degli effetti diretti D e fattore di normalizzazione s. |
| C285:AP324 | Matrice degli orizzonti d’effetto. |
| C328:AP367 | N. |
| C371:AP410, C414:AP453, C457:AP496 | N², N³ e N⁴. |
| C500:AP539 | Effetto totale T. |
| C543:AP582 | N₅ senza relazioni L. |
| C586:AP625, C629:AP668, C672:AP711 | N₅², N₅³ e N₅⁴. |
| C715:AP754 | Effetto totale T₅. |
| A759:AB794 | Ruolo, influenza, leva e controllabilità. |
| A799:AD805 | Fattori di potenziale e potenziale complessivo di tutti gli attori e momenti di riferimento. |
| A877:L912 | Contributi attuali dei nodi e contributi alla variazione. |
| A915:B919 | Quote dei quattro passaggi d’effetto. |
| A923:E937 | Confronto tra attori ed evoluzione temporale. |
| A941:J976 | Fattori determinanti a dieci anni per ogni attore. |

## 3 Confronto tra v3 e v7

I 121 ID degli indicatori e le loro assegnazioni ai nodi, i 35 nodi valutati, gli ID obiettivo da X1 a X5, tutte le 136 relazioni d’effetto e i pesi validi degli indicatori e degli scenari sono invariati. Sono conservati anche i testi delle definizioni delle 121 note delle celle; v7 antepone a ciascun testo precedente il titolo dell’indicatore.

| Modifica | Significato per lo strumento |
| --- | --- |
| Analisi compatta con attori affiancati | Scenario e momento di riferimento comuni; valori di confronto chiari, evoluzione, qualità dei dati e osservazioni principali. |
| Nuovi fogli Übersicht e Herleitung | Offrire valori dei nodi con tempo e tendenza e una spiegazione verificabile fino all’indicatore. |
| Carta della situazione rimossa | La carta della situazione di Excel non viene riprodotta. La vista di rete interattiva autonoma rimane un requisito confermato dello strumento. |
| Verifica di plausibilità rimossa | In seguito alla conferma esplicita, viene eliminata anche dallo strumento; nessuna maggiorazione manuale dei risultati né relativo campo di inserimento. |
| Pesi degli indicatori nel modello | Separare la modifica da parte del capo analista dalla valutazione; associazione tramite ID. |
| Nuove denominazioni dei fattori di potenziale | Riprendere le denominazioni funzionali di v7 e tradurle come termini del modello. |
| Semaforo di qualità configurabile | Mostrare la qualità delle fonti separatamente dai valori del potenziale; gestire le soglie come parametri del modello. |
| Elenco degli scenari delimitato | In v7 è risolta la precedente estensione dell’elenco di selezione nel catalogo dei nodi. |

Il calcolo centrale è conservato. Le differenze tra le formule centrali confrontate riguardano la nuova fonte dei pesi, la funzione di correzione rimossa e i denominatori della completezza. Durante il trasferimento, le particolarità di Excel non sostituiscono le decisioni di prodotto confermate.

## 4 Regole di calcolo e spiegabilità

1. Il valore di un nodo è la media ponderata delle valutazioni degli indicatori disponibili. Le valutazioni mancanti rimangono mancanti; un peso pari a 0 esclude l’indicatore. In assenza di dati ponderati utilizzabili, il nodo usa nel calcolo il valore neutro 3 ed è contrassegnato chiaramente come privo di dati.
2. Le valutazioni attuali mancanti vengono escluse dal calcolo anche quando i campi futuri sono compilati. Un valore a cinque anni vuoto riprende il valore attuale; un valore a dieci anni vuoto riprende il valore effettivo a cinque anni. Questo comportamento viene spiegato durante l’inserimento.
3. `s = max(max_i Σ_j |D_ij|, max_j Σ_i |D_ij|)`; `N = D / s`; `T = N + N² + N³ + N⁴`. I quattro passaggi rappresentano passi d’effetto. Le durate di calendario lungo un percorso non vengono sommate. Percorsi di segno opposto possono annullarsi.
4. I potenziali attuali utilizzano tutti gli orizzonti d’effetto. Per le variazioni a cinque anni, le relazioni L vengono rimosse prima di calcolare le potenze. Il fattore di normalizzazione s e il denominatore della leva continuano a riferirsi alla rete completa. Le variazioni a dieci anni utilizzano T.
5. Per il nodo obiettivo j valgono `q_j = Σ_i |T_ij|`, `h_ij = T_ij / q_j` e l’influenza `|h_ij|`. Il fattore grezzo attuale è `3 + Σ_i h_ij × (x_i − 3)`. I fattori futuri partono dal fattore grezzo attuale e utilizzano le variazioni dirette dei nodi: `Δx5 = x5 − xheute` e `Δx10 = x10 − xheute`.
6. I valori dei nodi, inclusi gli effetti propagati, vengono calcolati separatamente e non vengono riutilizzati come dati diretti nei potenziali futuri. I fattori di potenziale visualizzati sono limitati all’intervallo da 1 a 5. Il potenziale complessivo è la media ponderata di questi fattori limitati.
7. L’attendibilità non influenza i valori del potenziale. Il verde vale per A1, A2 e B1, il giallo per B2, il rosso per una fonte C o un livello dell’informazione 3. L’attendibilità mancante viene mostrata separatamente. Il semaforo di un attore o di un nodo indica la quota incerta secondo le soglie configurate; in assenza di indicazioni di qualità compare lo stato sconosciuto.
8. La completezza è la quota di indicatori attivi valutati rispetto a tutti gli indicatori attivi. Gli indicatori disattivati vengono conteggiati separatamente. In assenza di indicatori attivi non viene mostrata alcuna percentuale. In questo modo si applica la correzione D9 confermata.
9. In assenza dei presupposti, ad esempio fattore di normalizzazione 0, somma dei pesi dei fattori 0 o nodo obiettivo irraggiungibile, il valore interessato viene segnalato come non calcolabile. In questi casi non vengono effettuate divisioni per zero né applicati valori sostitutivi silenziosi. Le altre parti calcolabili rimangono accessibili.
10. Gli ID sconosciuti o duplicati vengono segnalati durante l’importazione. Non viene ripreso il ripiego silenzioso di Excel sul peso 1 quando la ricerca del peso non riesce.

### Derivazione

La derivazione collega il calcolo a tutti i nodi che contribuiscono e ai rispettivi indicatori. Per ogni nodo sono accessibili valore, influenza, leva con segno, contributo, ponderazione, attendibilità ed elementi giustificativi. Le definizioni complete degli indicatori compaiono come guida del campo o nel pannello dei dettagli.

La derivazione del fattore attuale e la variazione del potenziale complessivo hanno grandezze di riferimento diverse, indicate esplicitamente. Le derivazioni dei singoli fattori futuri vengono ricavate dalle stesse regole di calcolo e validate separatamente. Il diagramma distingue valore grezzo, limite applicato e valore finale. Quando viene mostrata una selezione dei contributi maggiori, il resto viene indicato.

I termini sostiene e frena si basano sul segno effettivo del contributo. Un contributo positivo relativamente più piccolo non è un contributo frenante. I dati mancanti rimangono visibili anche quando il calcolo usa un valore neutro. Gli effetti del modello sono spiegati come ipotesi.

### Vista di contrasto dopo il calcolo della rete

Il calcolo ufficiale e i valori originali del modello vengono conservati. La vista di contrasto aggiuntiva amplifica gli scostamenti dei valori obiettivo grezzi già calcolati rispetto al valore neutro 3:

`contrast_value = min(5, max(1, 3 + g * (raw_value - 3)))`

Il valore predefinito è `g = 1`; `g = 1.25` è la prima variante di confronto. Con `g = 1`, la vista di contrasto corrisponde al valore obiettivo originale limitato a 1–5. Il capo analista gestisce g come parametro di scenario versionato. Lo stesso fattore si applica a tutti i nodi obiettivo, attori e momenti di riferimento dello scenario. La derivazione presenta valore grezzo, valore originale limitato del modello, g, trasformazione senza limiti, valore di contrasto e ogni limitazione applicata. Il potenziale complessivo di contrasto, etichettato separatamente, è la media ponderata dei valori obiettivo di contrasto già limitati.

Dati inseriti, attendibilità, intensità degli archi, quattro passaggi della rete e logica temporale non cambiano. L’elevamento a potenza degli archi discusso in precedenza non fa parte della versione 0.1. La vista di contrasto non è un’ulteriore correzione di plausibilità e non sostituisce i valori ufficiali. I confronti indicano chiaramente la base comune di scenario e contrasto.

## 5 Ruoli, modifiche e versioni

| Attività | Analista | Capo analista |
| --- | --- | --- |
| Modificare valutazioni, attendibilità, valori futuri e osservazione / fonte | Sì | Sì |
| Creare, rinominare e rimuovere attori ordinari | Sì | Sì |
| Esaminare analisi, derivazione, panoramica e rete | Sì | Sì |
| Modificare pesi, intensità degli effetti, orizzonti d’effetto e controllabilità | No | Sì |
| Gestire indicatori e struttura dei nodi | No | Sì |
| Modificare, aggiungere e rimuovere nodi obiettivo | No | Sì |
| Creare, modificare e rimuovere scenari, compresi quelli predefiniti | No | Sì |
| Modificare le soglie del semaforo della qualità dei dati | No | Sì |
| Gestire il fattore di contrasto g, importare modelli / scenari e rimuovere l’attore di esempio | No | Sì |
| Esportare JSON e importare valutazioni | Sì | Sì |

Autenticazione e diritti di scrittura vengono verificati sul server. Il ruolo deriva dall’account utente. La gestione della struttura richiede ID stabili, definizioni, assegnazione ai gruppi e relazioni d’effetto coerenti. Per nuovi nodi obiettivo, i pesi di scenario vengono impostati consapevolmente; i modelli incompleti vengono segnalati chiaramente.

Le modifiche a una versione salvata del modello o dello scenario generano una nuova versione. La rimozione agisce sul nuovo stato. Le valutazioni e le analisi precedenti conservano i propri riferimenti e rimangono tracciabili. Dati di valutazione, parametri del modello e ipotesi di scenario rimangono separati. Una sola modifica del nome non genera un nuovo ID funzionale.

I confronti tra attori utilizzano lo stesso scenario e lo stesso momento di riferimento. L’associazione tra una versione dello scenario e la versione del modello rimane esplicita. Due modifiche simultanee dello stesso record non possono sovrascriversi silenziosamente: l’applicazione mostra il conflitto, conserva i propri dati inseriti e consente un confronto consapevole.

## 6 Viste e presentazione

La navigazione dà accesso a quadro di lavoro, valutazioni, analisi, panoramica dei nodi, derivazione, rete, modello e scenari. Contesto di selezione, filtri e dati non salvati rimangono disponibili al cambio di vista e di lingua. Uno stato di salvataggio visibile distingue modifiche non salvate, stato salvato con successo ed errori.

| Vista | Utilizzo e contenuto |
| --- | --- |
| Quadro di lavoro | Riconoscere lacune di completezza e qualità e passare direttamente alla modifica filtrata. |
| Valutazioni | Navigare per gruppo e nodo; cercare indicatori; modificare insieme valutazione, attendibilità, valori futuri ed elementi giustificativi. |
| Analisi | Confrontare più attori affiancati per potenziale complessivo, posizione in graduatoria, fattori di potenziale e qualità dei dati; aprire in modo mirato evoluzione e osservazioni principali. |
| Panoramica dei nodi | Espandere i gruppi; confrontare i valori di tutti gli attori selezionati oggi, tra 5 e tra 10 anni con la relativa tendenza. |
| Derivazione | Selezionare attore e nodo obiettivo; esaminare calcolo, contributi, qualità e indicatori. Tutti i nodi rimangono accessibili; tre nodi evidenziati non costituiscono un limite. |
| Rete | Esaminare le relazioni orientate di un attore selezionato; filtrare gruppi, intensità, segno e orizzonte d’effetto. |
| Modello e scenari | Il capo analista modifica parametri e struttura, crea varianti e ne verifica gli effetti. |

L’indicazione della tendenza di v7 si riferisce al periodo da oggi a tra 10 anni, indipendentemente dal momento selezionato. Il periodo di riferimento e la fascia neutra di ±0.05 rimangono visibili. I diagrammi rappresentano i tre momenti esistenti; non vengono inventate ulteriori previsioni intermedie senza un modello temporale dedicato.

La rete contiene i nodi e i nodi obiettivo validi per la versione selezionata. I filtri modificano soltanto la visualizzazione. Un popup o un pannello fissabile mostra definizione, valori, indicazioni di qualità, indicatori, fonti, ruolo, influenza, leva e controllabilità. Le relazioni in entrata e in uscita possono essere evidenziate. I dettagli delle relazioni mostrano origine, destinazione, intensità e orizzonte d’effetto.

I colori delle valutazioni e le indicazioni di qualità rimangono distinguibili; frecce, segni, etichette e tipi di linea completano il colore. I diagrammi dispongono di alternative tabellari. Moduli, elenchi dei nodi e viste di dettaglio sono utilizzabili da tastiera. Dati non validi o un salvataggio non riuscito non eliminano il lavoro.

### Schemi delle viste

```text
VALUTAZIONI
[Attore ▾] [Gruppo / Nodo ▾] [Ricerca / Filtri]                   [Italiano ▾]
Indicatore e definizione | Oggi | Attendibilità | 5 a | 10 a
Osservazione / fonte    [                                      ]
Stato salvataggio       [Salva modifiche]
```

```text
ANALISI
[Seleziona attori ▾] [Scenario ▾] [Momento ▾]                     [Italiano ▾]
                        Attore A             Attore B
Potenziale complessivo  <Valore>             <Valore>
Fattori di potenziale   <Barre comparative e valori>
Qualità / compilato     <Stato>              <Stato>
Tendenza oggi → 10 a    <Tendenza>           <Tendenza>
[Evoluzione] [Panoramica dei nodi] [Apri derivazione]
```

```text
DERIVAZIONE E RETE
[Attore ▾] [Nodo obiettivo ▾] [Scenario ▾] [Momento ▾]             [Italiano ▾]
Calcolo / contributi o rete degli effetti   Dettagli dei nodi fissabili
                                           Definizione, valutazione e qualità
                                           Indicatori, pesi e fonti
                                           Relazioni in entrata e in uscita
[Reimposta filtri]                         [Alla valutazione]
```

## 7 Lingua e terminologia

Navigazione, termini specialistici, definizioni del catalogo, guide, messaggi d’errore, diagrammi e risultati compaiono nella lingua selezionata. Numeri e date seguono la scelta linguistica. Osservazioni originali, citazioni delle fonti e collegamenti rimangono nella lingua di inserimento. Un cambio di lingua non attiva né salvataggio né importazione e non modifica i valori calcolati.

Il glossario distingue i termini attestati nei regolamenti dai termini definiti per il modello. In particolare, Umwelt e Umfeld vengono mantenuti distinti. Umwelt corrisponde al francese milieu e all’italiano ambiente; Umfeld corrisponde rispettivamente a environnement e contesto. Operative Domänen non viene equiparato senza verifica a Operationsraum. Le traduzioni di progetto di Kampfwille sono indicate come terminologia del modello.

Le traduzioni del catalogo utilizzano chiavi comuni e vengono verificate per completezza. I nuovi termini del modello richiedono le tre versioni linguistiche. Il modulo di modifica mostra la lingua selezionata e consente di trovare in modo mirato le traduzioni mancanti.

## 8 Struttura tecnica e importazione

La versione 0.1 usa Python per importazione e motore di calcolo, Django per interfaccia applicativa, autenticazione e ruoli, React per l’interfaccia utente e PostgreSQL per la memorizzazione centrale. Una procedura documentata di avvio locale dà accesso all’applicazione multiutente nel browser. L’ambiente dispone di account utente locali. Le versioni utilizzate sono registrate in `requirements.txt` e `frontend/package-lock.json`; `compose.yaml` stabilisce PostgreSQL 17.

| Componente | Contenuto |
| --- | --- |
| Versione del modello | Catalogo, definizioni, gruppi, pesi degli indicatori, effetti, nodi obiettivo, parametri di qualità e chiavi di traduzione. |
| Versione dello scenario | Riferimento al modello, nome, ipotesi ed eventuali parametri del modello differenti; pesi dei fattori e fattore di contrasto g. |
| Stato delle valutazioni | Attore, ID dell’indicatore, valore attuale, valori futuri, attendibilità e osservazione / fonte. |
| Risultato | Valori e contributi derivati con riferimento a modello, scenario e valutazioni. |
| Cronologia delle versioni | Associazione delle modifiche all’account utente e stati precedenti tracciabili; nessun dato degli account nella documentazione. |

Importazione, validazione, calcolo, memorizzazione e interfaccia vengono separati. L’importazione legge Excel come fonte di dati, comprese le note delle celle e le convalide estese. Non vengono eseguiti macro, contenuti incorporati o formule Excel. Le formule OOXML condivise vengono risolte correttamente per il confronto funzionale. I risultati Excel memorizzati sono valori di riferimento, non un calcolo sostitutivo.

Il nuovo file genera una versione verificata del modello. Le valutazioni e le fonti esistenti non vengono sovrascritte silenziosamente; ID o significati modificati richiedono un’associazione esplicita. I file di lavoro in `temp/` rimangono esclusi dal controllo di versione. I dati di test sono sintetici o provengono esclusivamente dall’esempio USA espressamente autorizzato. I file Excel rimangono invariati.

I risultati che fanno fede vengono calcolati sul server a partire dagli stati referenziati. Il server verifica ruoli, dati inseriti e versione del record modificato. Le modifiche correlate vengono salvate in modo coerente; conflitti ed errori vengono mostrati in modo comprensibile.

### Esempio rimovibile e scambio JSON

I valori USA espressamente autorizzati vengono proposti come attore di esempio identificato. Un capo analista può rimuovere questo attore; i riavvii non lo ricreano automaticamente. L’importazione non riprende gli altri blocchi di attori né gli autori dei commenti. I dati personali e gli altri contenuti riservati rimangono esclusi. L’eccezione riguarda soltanto l’insieme di esempio autorizzato.

JSON è il formato di scambio. Lo stato completo attuale dei dati inseriti utilizza `schema_version: "0.1"` con le sezioni `model`, `scenarios` e `actors`. Il parametro di scenario g è denominato `gain` nel formato di scambio. La cronologia salvata rimane sul server e non fa parte dell’esportazione dei dati inseriti. Una versione esplicita del formato, ID stabili e riferimenti a modello e scenario collegano catalogo, parametri e valutazioni. L’esportazione comprende valutazioni, campi futuri, attendibilità, osservazioni / fonti, traduzioni e g; i valori derivati vengono ricalcolati all’importazione. Credenziali e sessioni non fanno parte dell’esportazione.

Il server verifica l’intero file prima di scrivere: tipi e intervalli dei valori, ID, riferimenti e diritti dei ruoli. Le importazioni di modelli e scenari sono riservate ai capi analista. Gli errori causano l’annullamento completo anziché un’importazione parziale. I record esistenti non vengono sovrascritti silenziosamente; viene segnalato un conflitto. Esportazione e successiva reimportazione conservano i dati inseriti senza perdite. File Excel di lavoro, database locali ed esportazioni generate rimangono esclusi dal controllo di versione.

## 9 Decisioni confermate

| ID | Decisione |
| --- | --- |
| D1 | Applicazione multiutente avviabile localmente con autenticazione, memorizzazione centrale e diritti dei ruoli verificati sul server. |
| D2 | Il capo analista può modificare pesi, effetti, orizzonti d’effetto e struttura e gestire indicatori, nodi obiettivo e scenari. |
| D3 | I valori mancanti rimangono visibili; in assenza di dati utilizzabili, un nodo usa nel calcolo il valore neutro 3. |
| D4 | L’attendibilità rimane un’indicazione di qualità e non modifica i valori del potenziale. |
| D5 | Sono conservate la logica temporale esistente e la continuità dei campi futuri vuoti. |
| D6 | Sostituita da v7 e dalla successiva conferma: la verifica di plausibilità viene eliminata completamente, anche dallo strumento. |
| D7 | Segnalare chiaramente gli stati non calcolabili; nessuna divisione per zero. |
| D8 | Il capo analista può creare, modificare e rimuovere scenari, compresi quelli predefiniti. |
| D9 | Calcolare la completezza con la stessa popolazione di riferimento degli indicatori attivi; non mostrare percentuali in assenza di indicatori attivi. |

Per questi punti non rimangono decisioni funzionali aperte. Un eventuale contrasto tra un file sorgente successivo e i requisiti di prodotto confermati viene chiarito in modo mirato. La pubblicazione dello stato attuale del codice sorgente nel repository GitHub indicato sopra è espressamente richiesta. L’esecuzione dell’applicazione e i dati di lavoro rimangono locali.

## 10 Realizzazione e verifiche

La versione 0.1 comprende importazione v7 e motore di calcolo indipendente, autenticazione e ruoli, memorizzazione centrale con rilevamento dei conflitti, valutazioni, confronto tra attori, panoramica dei nodi, derivazione e rete. Gestione del capo analista, modifiche dinamiche del modello, scambio JSON, esempio rimovibile e vista di contrasto sono realizzati nelle tre lingue. La [guida di avvio](start.it.md#verifiche-e-limiti) documenta le verifiche applicative eseguite e i limiti rimanenti separatamente dalla verifica Excel storica riportata sotto.

La verifica in sola lettura dell’inventario e delle formule di v3 rispetto a v7 è stata eseguita come ZIP/XML con la libreria standard di Python. Sono stati confrontati tutti i 121 indicatori, i 35 nodi valutati, i 5 nodi obiettivo, le 136 relazioni e i 6 scenari. Le 121 note di definizione sono associate agli ID. Tutte le 12.398 formule condivise sono state risolte prima dell’analisi.

Sono stati ricalcolati indipendentemente 420 valori diretti dei nodi e 60 fattori grezzi di potenziale per versione. I valori diretti dei nodi coincidono esattamente con i risultati v7 memorizzati; lo scarto dei fattori rimane inferiore a `5 × 10⁻¹⁵`. I fattori grezzi ricalcolati sono identici tra le versioni. Per 4.800 valori delle matrici N, T e T₅, lo scarto rispetto alla cache v7 rimane inferiore a `2 × 10⁻¹⁸`. Si tratta di un confronto con risultati memorizzati, non di un ricalcolo completo mediante Excel.

Nei sette fogli di v7 non sono stati trovati valori di errore delle formule memorizzati né riferimenti residui ai campi di correzione rimossi. Non sono stati trovati macro, oggetti attivi o incorporati, relazioni esterne o connessioni dati. Non è stato eseguito alcun contenuto.

| Criteri di accettazione dell’applicazione | Criterio |
| --- | --- |
| Trasferimento completo | Tutti gli ID compilati, le relazioni, i pesi, le definizioni e gli scenari sono associati una sola volta; le righe di riserva sono escluse. |
| Confronto dei calcoli | Valori dei nodi, passaggi nella rete, fattori, potenziale complessivo e contributi coincidono con i casi di riferimento v7 entro tolleranze documentate. |
| Dati mancanti e non validi | Valore neutro contrassegnato come privo di dati; ID sconosciuti segnalati; verificati casi con zero, valori futuri mancanti, effetti negativi e cicli. |
| Spiegabilità | Contributi, resto e limite applicato ricostruiscono il valore finale; i termini sostiene e frena corrispondono al segno. |
| Struttura dinamica | Aggiungere, modificare e rimuovere indicatori, nodi obiettivo e scenari; riferimenti, calcolo, pesi e viste rimangono coerenti. |
| Ruoli | Soltanto il capo analista può modificare modello e scenari; verifica sul server. |
| Lingua | Tutte e tre le lingue complete; una sola lingua per volta; dati inseriti e risultati conservati al cambio di lingua. |
| Memorizzazione | La riapertura conserva versione e dati; le modifiche simultanee generano un conflitto visibile senza perdita silenziosa di dati. |
| Utilizzo | Confronto tra più attori, orizzonte temporale e riferimento della tendenza sono comprensibili; sono disponibili alternative tabellari e accesso da tastiera. |
| Vista di contrasto | Valore neutro 3 invariato; verificati g = 1 e g = 1.25, limiti, base comune di confronto e potenziale complessivo di contrasto ponderato separato. |
| JSON ed esempio | Verificati ciclo senza perdite, riferimenti non validi, diritti dei ruoli, conflitti e annullamento completo in caso di errore; l’esempio USA eliminato rimane assente al riavvio. |

Stato storico prima della realizzazione dell’applicazione: la verifica documentale di allora ha rilevato che contenuti tecnici, numeri e stato delle decisioni coincidono nelle tre versioni del concetto; la corrispondenza strutturale completa è stata verificata rispetto a v7. I 26 termini del glossario di allora sono associati tra le lingue, con 5 riferimenti al regolamento per lingua. Tutti i collegamenti locali sono validi; non sono stati ripresi nomi di attori o osservazioni sulle fonti dal file di lavoro. Il file v7 è rimasto invariato. L’esclusione di `temp/` è stata verificata con `git check-ignore`. Questa verifica precedente non riguarda il codice applicativo. Le verifiche applicative effettivamente eseguite e i limiti rimanenti sono riportati nella [documentazione di avvio](start.it.md).

## Allegato A Corrispondenza strutturale dettagliata

Le tabelle seguenti contengono esclusivamente ID e riferimenti di cella del file v7. Nomi, valutazioni, osservazioni sulle fonti e ipotesi numeriche degli effetti rimangono nel file sorgente. Gli ID degli indicatori sono riportati nell’ordine crescente delle righe sorgente.

### Nodi e indicatori

| ID del nodo | Intervallo del modello | Intervallo di valutazione | ID degli indicatori nell’ordine delle righe | Ponderazioni degli indicatori | Intervallo di calcolo |
| --- | --- | --- | --- | --- | --- |
| NP1 | `Modell!A23:D23` | `Bewertung!A6:E7` | P01, P02 | `Modell!A62:D63` | `Berechnung!A202:AE202` |
| NP2 | `Modell!A24:D24` | `Bewertung!A8:E11` | P03, P04, P05, P13 | `Modell!A64:D67` | `Berechnung!A203:AE203` |
| NP3 | `Modell!A25:D25` | `Bewertung!A12:E15` | P06, P07, P08, P09 | `Modell!A68:D71` | `Berechnung!A204:AE204` |
| NP4 | `Modell!A26:D26` | `Bewertung!A16:E18` | P10, P11, P12 | `Modell!A72:D74` | `Berechnung!A205:AE205` |
| NM1 | `Modell!A27:D27` | `Bewertung!A20:E22` | M01, M02, M03 | `Modell!A75:D77` | `Berechnung!A206:AE206` |
| NM2 | `Modell!A28:D28` | `Bewertung!A23:E26` | M04, M05, M06, M26 | `Modell!A78:D81` | `Berechnung!A207:AE207` |
| NM3 | `Modell!A29:D29` | `Bewertung!A27:E29` | M07, M08, M09 | `Modell!A82:D84` | `Berechnung!A208:AE208` |
| NM4 | `Modell!A30:D30` | `Bewertung!A30:E31` | M10, M11 | `Modell!A85:D86` | `Berechnung!A209:AE209` |
| NM5 | `Modell!A31:D31` | `Bewertung!A32:E34` | M12, M13, M27 | `Modell!A87:D89` | `Berechnung!A210:AE210` |
| NM6 | `Modell!A32:D32` | `Bewertung!A35:E38` | M14, M15, M16, M17 | `Modell!A90:D93` | `Berechnung!A211:AE211` |
| NM7 | `Modell!A33:D33` | `Bewertung!A39:E42` | M18, M19, M20, M21 | `Modell!A94:D97` | `Berechnung!A212:AE212` |
| NM8 | `Modell!A34:D34` | `Bewertung!A43:E46` | M22, M23, M24, M25 | `Modell!A98:D101` | `Berechnung!A213:AE213` |
| NE1 | `Modell!A35:D35` | `Bewertung!A48:E49` | E01, E02 | `Modell!A102:D103` | `Berechnung!A214:AE214` |
| NE2 | `Modell!A36:D36` | `Bewertung!A50:E52` | E03, E04, E05 | `Modell!A104:D106` | `Berechnung!A215:AE215` |
| NE3 | `Modell!A37:D37` | `Bewertung!A53:E57` | E06, E07, E08, E09, E10 | `Modell!A107:D111` | `Berechnung!A216:AE216` |
| NE4 | `Modell!A38:D38` | `Bewertung!A58:E59` | E11, E12 | `Modell!A112:D113` | `Berechnung!A217:AE217` |
| NS1 | `Modell!A39:D39` | `Bewertung!A61:E65` | S01, S02, S03, S04, S05 | `Modell!A114:D118` | `Berechnung!A218:AE218` |
| NS2 | `Modell!A40:D40` | `Bewertung!A66:E68` | S06, S07, S08 | `Modell!A119:D121` | `Berechnung!A219:AE219` |
| NS3 | `Modell!A41:D41` | `Bewertung!A69:E72` | S09, S10, S11, S12 | `Modell!A122:D125` | `Berechnung!A220:AE220` |
| NI1 | `Modell!A42:D42` | `Bewertung!A74:E76` | I01, I02, I03 | `Modell!A126:D128` | `Berechnung!A221:AE221` |
| NI2 | `Modell!A43:D43` | `Bewertung!A77:E80` | I04, I05, I06, I07 | `Modell!A129:D132` | `Berechnung!A222:AE222` |
| NI3 | `Modell!A44:D44` | `Bewertung!A81:E84` | I08, I09, I10, I11 | `Modell!A133:D136` | `Berechnung!A223:AE223` |
| NN1 | `Modell!A45:D45` | `Bewertung!A86:E88` | N01, N02, N03 | `Modell!A137:D139` | `Berechnung!A224:AE224` |
| NN2 | `Modell!A46:D46` | `Bewertung!A89:E91` | N04, N05, N06 | `Modell!A140:D142` | `Berechnung!A225:AE225` |
| NN3 | `Modell!A47:D47` | `Bewertung!A92:E93` | N07, N08 | `Modell!A143:D144` | `Berechnung!A226:AE226` |
| NN4 | `Modell!A48:D48` | `Bewertung!A94:E96` | N09, N10, N11 | `Modell!A145:D147` | `Berechnung!A227:AE227` |
| NU1 | `Modell!A49:D49` | `Bewertung!A98:E100` | U01, U02, U03 | `Modell!A148:D150` | `Berechnung!A228:AE228` |
| NU2 | `Modell!A50:D50` | `Bewertung!A101:E102` | U04, U05 | `Modell!A151:D152` | `Berechnung!A229:AE229` |
| WR | `Modell!A51:D51` | `Bewertung!A104:E108` | WR01, WR02, WR03, WR04, WR05 | `Modell!A153:D157` | `Berechnung!A230:AE230` |
| LR | `Modell!A52:D52` | `Bewertung!A109:E113` | LR01, LR02, LR03, LR04, LR05 | `Modell!A158:D162` | `Berechnung!A231:AE231` |
| BO | `Modell!A53:D53` | `Bewertung!A114:E118` | BO01, BO02, BO03, BO04, BO05 | `Modell!A163:D167` | `Berechnung!A232:AE232` |
| MR | `Modell!A54:D54` | `Bewertung!A119:E123` | MR01, MR02, MR03, MR04, MR05 | `Modell!A168:D172` | `Berechnung!A233:AE233` |
| ER | `Modell!A55:D55` | `Bewertung!A124:E126` | ER01, ER02, ER03 | `Modell!A173:D175` | `Berechnung!A234:AE234` |
| CR | `Modell!A56:D56` | `Bewertung!A127:E129` | CR01, CR02, CR03 | `Modell!A176:D178` | `Berechnung!A235:AE235` |
| IR | `Modell!A57:D57` | `Bewertung!A130:E133` | IR01, IR02, IR03, IR04 | `Modell!A179:D182` | `Berechnung!A236:AE236` |

### Nodi obiettivo

| ID obiettivo | Definizione e ID | Calcolo del fattore | Ponderazioni degli scenari |
| --- | --- | --- | --- |
| X1 | `Modell!AN21:AN22` | `Berechnung!A800:AD800` | `Modell!E5:E10` |
| X2 | `Modell!AO21:AO22` | `Berechnung!A801:AD801` | `Modell!F5:F10` |
| X3 | `Modell!AP21:AP22` | `Berechnung!A802:AD802` | `Modell!G5:G10` |
| X4 | `Modell!AQ21:AQ22` | `Berechnung!A803:AD803` | `Modell!H5:H10` |
| X5 | `Modell!AR21:AR22` | `Berechnung!A804:AD804` | `Modell!I5:I10` |

### Relazioni d’influenza

Tutte le 136 relazioni compilate sono associate tramite ID sorgente, ID di destinazione e cella del foglio `Modell`. L’intensità e l’orizzonte temporale vengono letti nella rispettiva cella.

| ID sorgente | ID di destinazione e cella sorgente |
| --- | --- |
| NP1 | NP2 @ `Modell!F23`; NE1 @ `Modell!Q23`; NS2 @ `Modell!V23`; X5 @ `Modell!AR23` |
| NP2 | NP3 @ `Modell!G24`; NM4 @ `Modell!L24`; NE2 @ `Modell!R24`; X3 @ `Modell!AP24` |
| NP3 | NM3 @ `Modell!K25`; NM5 @ `Modell!M25`; NE4 @ `Modell!T25`; X2 @ `Modell!AO25`; X4 @ `Modell!AQ25`; X5 @ `Modell!AR25` |
| NP4 | NM2 @ `Modell!J26`; NM4 @ `Modell!L26`; NE2 @ `Modell!R26`; NS2 @ `Modell!V26`; X1 @ `Modell!AN26` |
| NM1 | NM3 @ `Modell!K27`; X3 @ `Modell!AP27` |
| NM2 | NE2 @ `Modell!R28`; X1 @ `Modell!AN28`; X4 @ `Modell!AQ28` |
| NM3 | NM1 @ `Modell!I29`; LR @ `Modell!AH29`; BO @ `Modell!AI29`; MR @ `Modell!AJ29`; X3 @ `Modell!AP29`; X5 @ `Modell!AR29` |
| NM4 | NM1 @ `Modell!I30`; WR @ `Modell!AG30`; LR @ `Modell!AH30`; BO @ `Modell!AI30`; MR @ `Modell!AJ30`; ER @ `Modell!AK30`; X2 @ `Modell!AO30` |
| NM5 | WR @ `Modell!AG31`; ER @ `Modell!AK31`; IR @ `Modell!AM31`; X3 @ `Modell!AP31`; X5 @ `Modell!AR31` |
| NM6 | NS3 @ `Modell!W32`; X1 @ `Modell!AN32`; X4 @ `Modell!AQ32` |
| NM7 | NE2 @ `Modell!R33`; LR @ `Modell!AH33`; MR @ `Modell!AJ33`; X2 @ `Modell!AO33`; X4 @ `Modell!AQ33` |
| NM8 | LR @ `Modell!AH34`; BO @ `Modell!AI34`; MR @ `Modell!AJ34`; X2 @ `Modell!AO34`; X4 @ `Modell!AQ34` |
| NE1 | NE2 @ `Modell!R35`; NE3 @ `Modell!S35`; NS1 @ `Modell!U35`; NI3 @ `Modell!Z35`; NN1 @ `Modell!AA35`; NN2 @ `Modell!AB35` |
| NE2 | NM2 @ `Modell!J36`; NM3 @ `Modell!K36`; NM4 @ `Modell!L36`; NM8 @ `Modell!P36`; NE1 @ `Modell!Q36`; NE3 @ `Modell!S36`; X4 @ `Modell!AQ36` |
| NE3 | NM4 @ `Modell!L37`; NM8 @ `Modell!P37`; NE1 @ `Modell!Q37`; MR @ `Modell!AJ37`; X2 @ `Modell!AO37`; X4 @ `Modell!AQ37` |
| NE4 | NM8 @ `Modell!P38`; NE3 @ `Modell!S38`; X4 @ `Modell!AQ38` |
| NS1 | NM2 @ `Modell!J39`; NE1 @ `Modell!Q39`; NE3 @ `Modell!S39`; NI3 @ `Modell!Z39` |
| NS2 | NP1 @ `Modell!E40`; NS3 @ `Modell!W40`; X5 @ `Modell!AR40` |
| NS3 | NM2 @ `Modell!J41`; X1 @ `Modell!AN41`; X5 @ `Modell!AR41` |
| NI1 | NS2 @ `Modell!V42`; NS3 @ `Modell!W42`; IR @ `Modell!AM42` |
| NI2 | NP1 @ `Modell!E43`; NS2 @ `Modell!V43`; IR @ `Modell!AM43`; X5 @ `Modell!AR43` |
| NI3 | NI2 @ `Modell!Y44`; NN3 @ `Modell!AC44`; ER @ `Modell!AK44`; CR @ `Modell!AL44`; X3 @ `Modell!AP44` |
| NN1 | NE1 @ `Modell!Q45`; X4 @ `Modell!AQ45` |
| NN2 | NE1 @ `Modell!Q46`; NE3 @ `Modell!S46`; X4 @ `Modell!AQ46` |
| NN3 | NI1 @ `Modell!X47`; X3 @ `Modell!AP47` |
| NN4 | NS3 @ `Modell!W48`; X1 @ `Modell!AN48`; X4 @ `Modell!AQ48` |
| NU1 | BO @ `Modell!AI49`; MR @ `Modell!AJ49`; X4 @ `Modell!AQ49`; X5 @ `Modell!AR49` |
| NU2 | BO @ `Modell!AI50`; X4 @ `Modell!AQ50` |
| WR | LR @ `Modell!AH51`; MR @ `Modell!AJ51`; X2 @ `Modell!AO51`; X3 @ `Modell!AP51` |
| LR | BO @ `Modell!AI52`; X2 @ `Modell!AO52`; X3 @ `Modell!AP52`; X4 @ `Modell!AQ52` |
| BO | X1 @ `Modell!AN53`; X2 @ `Modell!AO53`; X4 @ `Modell!AQ53` |
| MR | X2 @ `Modell!AO54`; X4 @ `Modell!AQ54` |
| ER | LR @ `Modell!AH55`; X2 @ `Modell!AO55`; X3 @ `Modell!AP55` |
| CR | IR @ `Modell!AM56`; X3 @ `Modell!AP56`; X4 @ `Modell!AQ56` |
| IR | X3 @ `Modell!AP57`; X5 @ `Modell!AR57` |
