# Glossario dello strumento per il confronto del potenziale militare

[Deutsch](glossar.de.md) · [Français](glossar.fr.md) · [Italiano](glossar.it.md) · [Documentazione](README.md)

Stato: 16 ottobre 2026. Codice sorgente: [stekhoven/military_potential](https://github.com/stekhoven/military_potential).

## Uso e fonti

La [nota di trasparenza del concetto](konzept.it.md#llm-transparency) spiega l’utilizzo di LLM per generare il codice e ricercare i dati di esempio iniziali. I riferimenti al regolamento e i termini del modello rimangono identificati separatamente.

Il glossario collega la terminologia delle tre versioni fornite del regolamento 50.041, stato al 1° ottobre 2019, ai termini propri del modello del progetto. Le definizioni regolamentari sono parafrasate. I riferimenti indicano prima la pagina del PDF e poi la pagina stampata; la numerazione varia tra le versioni linguistiche.

I termini del modello ne descrivono il significato nello strumento. Non rivendicano una definizione regolamentare. In particolare, **Domini operativi** è una denominazione vincolante del modello; non viene equiparata al termine regolamentare **spazio delle operazioni**.

L’interfaccia visualizza una sola lingua, selezionata da un menu a discesa: Deutsch, Français o Italiano. Gli identificatori del glossario riportati sotto collegano le versioni linguistiche. Gli identificatori tecnici degli indicatori, dei nodi e delle relazioni rimangono invariati quando cambia la lingua o la denominazione. I nomi tradotti sono etichette di visualizzazione.

## Termini attestati nel regolamento

| Identificatore del glossario | Deutsch | Français | Italiano | Significato e riferimento |
| --- | --- | --- | --- | --- |
| `actor` | Akteur | Acteur | Attore | Persona, gruppo o organizzazione che agisce. Nello strumento è l’unità di cui si valuta e confronta il potenziale. [Regolamento 50.041 i, pagina PDF 14 / pagina stampata 6](50_041_i-BFA17.pdf#page=14). |
| `environment` | Umwelt | Milieu | Ambiente | Il termine regolamentare comprende terreno, condizioni meteorologiche, ore del giorno, stagioni e popolazione. L’omonimo ambito del modello viene precisato dai suoi indicatori. [Regolamento, pagina PDF 10 / pagina stampata 2](50_041_i-BFA17.pdf#page=10). |
| `context` | Umfeld | Environnement | Contesto | Quadro più ampio che comprende gli attori dei diversi ambiti della società e l’ambiente. **Contesto** e **ambiente** rimangono termini distinti. [Regolamento, pagina PDF 21 / pagina stampata 13](50_041_i-BFA17.pdf#page=21). |
| `effect` | Wirkung | Effet | Effetto | Risultato di azioni o misure militari o non militari; può essere diretto o indiretto, intenzionale o non intenzionale. Nel modello, un effetto rappresenta un’ipotesi funzionale su una relazione. [Regolamento, pagina PDF 25 / pagina stampata 17](50_041_i-BFA17.pdf#page=25). |
| `operations_area` | Operationsraum | Espace d’opération | Spazio delle operazioni | Ambito di responsabilità nello spazio di un comandante operativo. Il termine serve a distinguere le nozioni; il gruppo del modello si chiama **Domini operativi**. [Regolamento, pagina PDF 49 / pagina stampata 41](50_041_i-BFA17.pdf#page=49). |

## Termini propri del modello del progetto

| Identificatore del glossario | Deutsch | Français | Italiano | Definizione nello strumento |
| --- | --- | --- | --- | --- |
| `operational_domains` | Operative Domänen | Domaines opérationnels | Domini operativi | Gruppo del modello che riunisce i nodi suddivisi per dominio. La denominazione segue la prescrizione del progetto; non pretende di essere un equivalente regolamentare di spazio delle operazioni. |
| `node` | Knoten | Nœud | Nodo | Elemento della rete di effetti con identificatore univoco. Un nodo valutato aggrega gli indicatori assegnati; le sue relazioni descrivono gli effetti ipotizzati su altri nodi. |
| `indicator` | Indikator | Indicateur | Indicatore | Oggetto di valutazione definito e assegnato a un nodo. Possiede un identificatore stabile, una descrizione funzionale, un peso e dati riferiti a ciascun attore. |
| `target_node` | Zielknoten | Nœud cible | Nodo obiettivo | Nodo di uscita che aggrega gli effetti della rete e rappresenta un fattore di potenziale. Si distingue da un nodo valutato dotato di propri indicatori. |
| `potential_factor` | Potenzialfaktor | Facteur de potentiel | Fattore di potenziale | Dimensione del potenziale militare derivata dalla rete di effetti. Viene presentata come risultato di un nodo obiettivo e possiede un peso di scenario. |
| `will_to_fight` | Kampfwille | Volonté de combattre | Volontà di combattere | Denominazione del modello per la disponibilità di un attore a iniziare e proseguire un combattimento. Il fattore di potenziale deriva dalle relazioni d’effetto che gli sono assegnate. Le denominazioni francese e italiana sono traduzioni del progetto; nei regolamenti forniti non è stata attestata una voce corrispondente univoca. |
| `overall_potential` | Gesamtpotenzial | Potentiel global | Potenziale complessivo | Risultato che aggrega i fattori di potenziale secondo i pesi dello scenario selezionato. È una grandezza di confronto dipendente dal modello, senza essere una grandezza fisica misurata indipendentemente. |
| `assessment` | Bewertung | Évaluation | Valutazione | Dato analitico inserito per un indicatore, un attore e un momento di riferimento sulla scala del modello da 1 a 5. Un valore più alto è più favorevole per l’attore considerato. Una valutazione assente rimane registrata e segnalata come mancante; un valore sostitutivo usato nel calcolo non è un dato inserito. |
| `reliability` | Verlässlichkeit | Fiabilité | Attendibilità | Indicazione di qualità con due dimensioni distinte: A–C caratterizza la fonte, 1–3 l’informazione. La combinazione produce, ad esempio, A1 o B2. La spiegazione delle categorie segue la guida approvata del modello. L’attendibilità non modifica il valore del potenziale e non viene interpretata come probabilità. I dati mancanti hanno uno stato separato. |
| `source_note` | Bemerkung / Quelle | Remarque / source | Osservazione / fonte | Motivazione analitica e origine di una valutazione, eventualmente con riferimento preciso o collegamento. La citazione della fonte documenta l’elemento giustificativo; l’attendibilità ne valuta la qualità. |
| `weight` | Gewicht | Poids | Peso | Parametro che determina la quota relativa di una grandezza in un’aggregazione. I pesi degli indicatori all’interno di un nodo e i pesi di scenario dei fattori di potenziale appartengono a livelli distinti. Un peso pari a 0 disattiva il contributo interessato. |
| `relation` | Wirkungsbeziehung | Relation d’effet | Relazione d’effetto | Ipotesi diretta del modello da un nodo sorgente a un nodo destinazione. Comprende segno, intensità e orizzonte d’effetto. Il segno descrive la direzione dell’effetto modellato, senza esprimere un giudizio sul nodo sorgente. |
| `leverage` | Hebel | Levier | Leva | Coefficiente d’effetto normalizzato con segno di un nodo rispetto a uno specifico nodo obiettivo, considerando gli effetti diretti e indiretti. È indipendente dalla valutazione. Un contributo effettivo deriva soltanto dalla combinazione con la valutazione o la sua variazione. Lo stesso nodo può avere leve diverse rispetto a nodi obiettivo differenti. |
| `influence` | Einfluss | Influence | Influenza | Valore assoluto della leva rispetto a uno specifico nodo obiettivo. Descrive l’intensità della relazione d’effetto modellata senza il segno, indipendentemente dalla valutazione. Si distingue dall’intensità diretta di una singola relazione. |
| `controllability` | Lenkbarkeit | Contrôlabilité | Controllabilità | Indicazione del modello sulla misura in cui è possibile influenzare intenzionalmente un nodo: controllabile, parzialmente controllabile o non controllabile. È distinta dall’influenza e dalla valutazione. |
| `scenario` | Szenario | Scénario | Scenario | Insieme denominato di ipotesi e ponderazioni del modello, collegato a una versione del modello. Viene gestito separatamente dalle valutazioni di un attore. I quadri di minaccia predefiniti sono scenari; il capo analista gestisce anche le nuove varianti. |
| `time_horizon` | Fristigkeit K / M / L | Horizon d’effet K / M / L | Orizzonte d’effetto K / M / L | Categoria di una relazione: K per il breve termine, M per il medio termine, L per il lungo termine. I codici tecnici sono identici in tutte le lingue. Le categorie vengono considerate secondo la regola di calcolo approvata. Un passo nella rete non costituisce una durata di calendario da sommare. |
| `time_point` | Zeitpunkt | Échéance | Momento di riferimento | Riferimento temporale di una valutazione o di un risultato, in particolare oggi, tra cinque anni o tra dieci anni. Il momento di riferimento si distingue dall’orizzonte d’effetto di una relazione. |
| `trend` | Trend | Tendance | Tendenza | Direzione del cambiamento derivata dai valori del modello tra momenti esplicitamente indicati. Riferimento, momento di arrivo e differenza rimangono visibili. Una tendenza non costituisce una misurazione supplementare né una previsione autonoma. |
| `derivation` | Herleitung | Justification | Derivazione | Presentazione tracciabile di quali nodi e indicatori contribuiscono al risultato selezionato e in che modo. Indica attore, scenario, momento di riferimento e stato utilizzato e distingue dati inseriti, contributi calcolati ed eventuali limiti applicati. |
| `model_version` | Modellversion | Version du modèle | Versione del modello | Stato identificato della struttura del modello e delle regole di calcolo. Un risultato fa inoltre riferimento allo scenario e allo stato delle valutazioni utilizzato. I risultati precedenti devono rimanere identificabili anche dopo modifiche agli indicatori o ai nodi. |
| `raw_value` | Rohwert | Valeur brute | Valore grezzo | Valore obiettivo calcolato prima della limitazione a 1–5 e della trasformazione di contrasto. Il valore ufficiale originale del modello è il valore grezzo limitato a 1–5. Entrambi rimangono tracciabili. |
| `contrast_view` | Kontrastansicht | Vue de contraste | Vista di contrasto | Vista aggiuntiva esplicitamente identificata dei risultati con `min(5, max(1, 3 + g × (valore grezzo − 3)))`. Evidenzia gli scostamenti dal valore neutro senza modificare dati inseriti o calcolo della rete. Il potenziale complessivo di contrasto viene calcolato separatamente ponderando i valori obiettivo di contrasto limitati. |
| `contrast_factor` | Spreizungsfaktor g | Facteur d’amplification g | Fattore di amplificazione g | Parametro di scenario versionato gestito soltanto dal capo analista. Valore predefinito 1, prima variante di confronto 1.25. In uno scenario si applica lo stesso fattore a tutti i nodi obiettivo, attori e momenti di riferimento. |
| `format_version` | Formatversion | Version du format | Versione del formato | Identificatore della struttura di scambio JSON supportata. Si distingue dalle versioni del modello e dello scenario. L’importazione verifica struttura, valori e riferimenti prima del salvataggio completo. |
| `example_actor` | Beispielakteur | Acteur d’exemple | Attore di esempio | Insieme identificato e rimovibile dei valori di esempio USA autorizzati. Dopo l’eliminazione non viene ricreato automaticamente al riavvio. |
| `write_conflict` | Schreibkonflikt | Conflit d’écriture | Conflitto di scrittura | Modifica simultanea di un record la cui versione memorizzata è cambiata dall’apertura. Il server impedisce sovrascritture silenziose e segnala il conflitto; i propri dati inseriti non salvati vengono conservati. |

## Regole redazionali

- Usare gli stessi termini nelle etichette, nelle guide e nella documentazione. Evitare confusioni tra ambiente e contesto nonché tra Domini operativi e spazio delle operazioni.
- Per altri termini specialistici, consultare prima la versione linguistica corrispondente del regolamento. Se manca un’equivalenza o il significato è diverso, spiegare il termine proprio del progetto senza rivendicare un’equivalenza regolamentare.
- Aggiornare insieme le traduzioni. Il glossario non traduce automaticamente valutazioni, contenuti delle fonti o altri dati analitici inseriti dagli utenti.
- Nello strumento visualizzare soltanto la lingua selezionata. Le colonne linguistiche parallele del glossario servono al coordinamento terminologico.
