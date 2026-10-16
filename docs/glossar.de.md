# Glossar für das Werkzeug zum Vergleich militärischen Potenzials

[Deutsch](glossar.de.md) · [Français](glossar.fr.md) · [Italiano](glossar.it.md) · [Dokumentation](README.md)

Stand: 16. Oktober 2026. Quellcode: [stekhoven/military_potential](https://github.com/stekhoven/military_potential).

## Verwendung und Quellen

Der [Transparenzhinweis im Fachkonzept](konzept.de.md#llm-transparency) erläutert den Einsatz von LLMs für Codegenerierung und Recherche der anfänglichen Beispieldaten. Reglementsbelege und Modellbegriffe bleiben davon getrennt ausgewiesen.

Das Glossar verbindet die Terminologie der drei bereitgestellten Fassungen des Reglements 50.041, Stand 1. Oktober 2019, mit den projektspezifischen Modellbegriffen. Reglementarische Definitionen werden sinngemäss zusammengefasst. Die Belege nennen zuerst die PDF-Seite und danach die aufgedruckte Seite; die Seitenzahlen unterscheiden sich zwischen den Sprachfassungen.

Die Modellbegriffe beschreiben die Bedeutung im Werkzeug. Sie beanspruchen keine reglementarische Definition. Insbesondere ist **Operative Domänen** eine verbindliche Modellbezeichnung; sie wird nicht mit dem reglementarischen Begriff **Operationsraum** gleichgesetzt.

Die Oberfläche zeigt über ein Dropdown jeweils Deutsch, Französisch oder Italienisch. Die unten aufgeführten Glossar-IDs verbinden die Sprachfassungen. Technische IDs der Indikatoren, Knoten und Beziehungen bleiben bei Sprachwechseln und Umbenennungen unverändert. Übersetzte Namen sind Anzeigetexte.

## Begriffe mit Reglementsbeleg

| Glossar-ID | Deutsch | Français | Italiano | Bedeutung und Beleg |
| --- | --- | --- | --- | --- |
| `actor` | Akteur | Acteur | Attore | Handelnde Person, Gruppe oder Organisation. Im Werkzeug die Einheit, deren Potenzial bewertet und verglichen wird. [Reglement 50.041 d, PDF-Seite 10 / Druckseite 2](50_041_d-BFA17.pdf#page=10). |
| `environment` | Umwelt | Milieu | Ambiente | Gelände, Wetter, Tages- und Jahreszeit sowie Bevölkerung bilden den reglementarischen Begriff. Der gleichnamige Modellbereich wird durch seine Indikatoren konkretisiert. [Reglement, PDF-Seite 49 / Druckseite 41](50_041_d-BFA17.pdf#page=49). |
| `context` | Umfeld | Environnement | Contesto | Übergeordneter Zusammenhang aus Akteuren verschiedener gesellschaftlicher Bereiche und der Umwelt. **Umfeld** und **Umwelt** bleiben getrennte Begriffe. [Reglement, PDF-Seite 49 / Druckseite 41](50_041_d-BFA17.pdf#page=49). |
| `effect` | Wirkung | Effet | Effetto | Ergebnis von militärischen oder nichtmilitärischen Handlungen beziehungsweise Massnahmen; es kann direkt oder indirekt sowie beabsichtigt oder unbeabsichtigt entstehen. Eine Wirkung im Modell ist eine fachliche Annahme über einen Zusammenhang. [Reglement, PDF-Seite 52 / Druckseite 44](50_041_d-BFA17.pdf#page=52). |
| `operations_area` | Operationsraum | Espace d’opération | Spazio delle operazioni | Räumlicher Verantwortungsbereich eines operativen Kommandanten. Der Begriff dient der terminologischen Abgrenzung; die Modellgruppe heisst **Operative Domänen**. [Reglement, PDF-Seite 42 / Druckseite 34](50_041_d-BFA17.pdf#page=42). |

## Projektspezifische Modellbegriffe

| Glossar-ID | Deutsch | Français | Italiano | Definition im Werkzeug |
| --- | --- | --- | --- | --- |
| `operational_domains` | Operative Domänen | Domaines opérationnels | Domini operativi | Modellgruppe für die nach Domänen gegliederten Knoten. Die Bezeichnung folgt der Projektvorgabe; sie ist keine behauptete reglementarische Entsprechung zu Operationsraum. |
| `node` | Knoten | Nœud | Nodo | Eindeutig identifiziertes Element des Wirkungsnetzes. Ein bewerteter Knoten fasst zugeordnete Indikatoren zusammen; seine Beziehungen beschreiben angenommene Wirkungen auf andere Knoten. |
| `indicator` | Indikator | Indicateur | Indicatore | Definierter, einem Knoten zugeordneter Bewertungsgegenstand. Er besitzt eine stabile ID, eine fachliche Beschreibung, ein Gewicht und akteursbezogene Eingaben. |
| `target_node` | Zielknoten | Nœud cible | Nodo obiettivo | Ausgabeknoten, der Wirkungen aus dem Netz zusammenführt und einen Potenzialfaktor darstellt. Er wird von einem bewerteten Knoten mit eigenen Indikatoren unterschieden. |
| `potential_factor` | Potenzialfaktor | Facteur de potentiel | Fattore di potenziale | Aus dem Wirkungsnetz abgeleitete Dimension des militärischen Potenzials. Sie wird als Ergebnis eines Zielknotens ausgewiesen und besitzt ein Szenariogewicht. |
| `will_to_fight` | Kampfwille | Volonté de combattre | Volontà di combattere | Modellbezeichnung für die Bereitschaft eines Akteurs, einen Kampf aufzunehmen und fortzuführen. Der Potenzialfaktor wird aus den ihm zugeordneten Wirkungsbeziehungen abgeleitet. Die französische und italienische Bezeichnung sind Projektübersetzungen; ein eindeutiges Stichwort wurde in den bereitgestellten Reglementen nicht nachgewiesen. |
| `overall_potential` | Gesamtpotenzial | Potentiel global | Potenziale complessivo | Nach den Gewichten des ausgewählten Szenarios zusammengeführtes Ergebnis der Potenzialfaktoren. Es ist eine modellabhängige Vergleichsgrösse und keine unabhängig gemessene physische Grösse. |
| `assessment` | Bewertung | Évaluation | Valutazione | Fachliche Eingabe zu einem Indikator für einen Akteur und Zeitpunkt auf der Modellskala von 1 bis 5. Ein höherer Wert ist für den betrachteten Akteur günstiger. Eine fehlende Bewertung bleibt als fehlend gespeichert und sichtbar; ein rechnerischer Ersatzwert ist keine Eingabe. |
| `reliability` | Verlässlichkeit | Fiabilité | Attendibilità | Qualitätsangabe mit zwei getrennten Dimensionen: A–C kennzeichnet die Quelle, 1–3 die Information. Die Kombination ergibt etwa A1 oder B2. Die Erläuterungen der Kategorien folgen der freigegebenen Modellhilfe. Verlässlichkeit verändert den Potenzialwert nicht und wird nicht als Wahrscheinlichkeit interpretiert. Fehlende Angaben erhalten einen eigenen Status. |
| `source_note` | Bemerkung / Quelle | Remarque / source | Osservazione / fonte | Fachliche Begründung und Herkunft einer Bewertung, gegebenenfalls mit Fundstelle oder Link. Die Quellenangabe dokumentiert den Beleg; die Verlässlichkeit bewertet dessen Qualität. |
| `weight` | Gewicht | Poids | Peso | Parameter, der den relativen Anteil einer Grösse in einer Aggregation steuert. Indikatorgewichte innerhalb eines Knotens und Szenariogewichte der Potenzialfaktoren sind unterschiedliche Ebenen. Gewicht 0 deaktiviert den betreffenden Beitrag. |
| `relation` | Wirkungsbeziehung | Relation d’effet | Relazione d’effetto | Gerichtete Modellannahme von einem Quellknoten zu einem Zielknoten. Sie enthält Vorzeichen, Stärke und Fristigkeit. Das Vorzeichen beschreibt die Richtung der modellierten Wirkung, nicht eine Wertung des Quellknotens. |
| `leverage` | Hebel | Levier | Leva | Vorzeichenbehafteter, normierter Wirkungskoeffizient eines Knotens gegenüber einem bestimmten Zielknoten unter Berücksichtigung direkter und indirekter Wirkungen. Er ist unabhängig von der Bewertung. Ein tatsächlicher Beitrag entsteht erst durch die Verknüpfung mit der Bewertung oder Bewertungsänderung. Derselbe Knoten kann gegenüber verschiedenen Zielknoten unterschiedliche Hebel besitzen. |
| `influence` | Einfluss | Influence | Influenza | Betrag des Hebels gegenüber einem bestimmten Zielknoten. Er beschreibt die Stärke des modellierten Wirkungszusammenhangs ohne dessen Vorzeichen, unabhängig von der Bewertung. Er ist von der direkten Wirkungsstärke einer einzelnen Beziehung zu unterscheiden. |
| `controllability` | Lenkbarkeit | Contrôlabilité | Controllabilità | Modellangabe dazu, in welchem Umfang ein Knoten gezielt beeinflusst werden kann: lenkbar, bedingt lenkbar oder nicht lenkbar. Sie ist von Einfluss und Bewertung getrennt. |
| `scenario` | Szenario | Scénario | Scenario | Benannte Kombination von Modellannahmen und Gewichtungen mit Bezug zu einer Modellversion. Sie wird von den Bewertungen eines Akteurs getrennt geführt. Vorgegebene Bedrohungsbilder sind Szenarien; der Chef Analyst verwaltet auch neue Varianten. |
| `time_horizon` | Fristigkeit K / M / L | Horizon d’effet K / M / L | Orizzonte d’effetto K / M / L | Kategorie einer Beziehung: K für kurzfristig, M für mittelfristig, L für langfristig. Die technischen Codes bleiben in allen Sprachen gleich. Die Berücksichtigung der Kategorien folgt der freigegebenen Rechenregel. Ein Schritt im Netz ist keine addierbare Kalenderdauer. |
| `time_point` | Zeitpunkt | Échéance | Momento di riferimento | Bezugszeit der Bewertung oder Auswertung, insbesondere heute, in fünf oder in zehn Jahren. Der Zeitpunkt ist von der Fristigkeit einer Beziehung zu unterscheiden. |
| `trend` | Trend | Tendance | Tendenza | Aus den Modellwerten abgeleitete Veränderungsrichtung zwischen ausdrücklich bezeichneten Zeitpunkten. Referenz, Zielzeitpunkt und Differenz bleiben erkennbar. Ein Trend ist keine zusätzliche Messung oder eigenständige Prognose. |
| `derivation` | Herleitung | Justification | Derivazione | Nachvollziehbare Darstellung, welche Knoten und Indikatoren wie zum ausgewählten Ergebnis beitragen. Sie nennt Akteur, Szenario, Zeitpunkt und verwendeten Stand und unterscheidet Eingaben, berechnete Beiträge und allfällige Begrenzungen. |
| `model_version` | Modellversion | Version du modèle | Versione del modello | Identifizierter Stand der Modellstruktur und Rechenregeln. Eine Auswertung verweist zusätzlich auf das Szenario und den verwendeten Bewertungsstand. Frühere Ergebnisse müssen auch nach Änderungen an Indikatoren oder Knoten zuordenbar bleiben. |
| `raw_value` | Rohwert | Valeur brute | Valore grezzo | Berechneter Zielwert vor Begrenzung auf 1–5 und vor der Kontrasttransformation. Der ursprüngliche offizielle Modellwert ist der auf 1–5 begrenzte Rohwert. Beide bleiben nachvollziehbar. |
| `contrast_view` | Kontrastansicht | Vue de contraste | Vista di contrasto | Zusätzlich beschriftete Sicht auf die Ergebnisse mit `min(5, max(1, 3 + g × (Rohwert − 3)))`. Sie hebt Abstände zum Neutralwert hervor, ohne Eingaben oder Netzberechnung zu verändern. Das Kontrast-Gesamtpotenzial wird separat aus den begrenzten Kontrast-Zielwerten gewichtet. |
| `contrast_factor` | Spreizungsfaktor g | Facteur d’amplification g | Fattore di amplificazione g | Versionierter Szenarioparameter, den nur der Chef Analyst verwaltet. Standard 1, erste Vergleichsvariante 1.25. Innerhalb eines Szenarios gilt derselbe Faktor für alle Zielknoten, Akteure und Zeitstände. |
| `format_version` | Formatversion | Version du format | Versione del formato | Kennung der unterstützten JSON-Austauschstruktur. Sie ist von Modell- und Szenarioversionen zu unterscheiden. Der Import prüft Struktur, Werte und Referenzen vor der vollständigen Speicherung. |
| `example_actor` | Beispielakteur | Acteur d’exemple | Attore di esempio | Klar gekennzeichneter, löschbarer Datensatz der freigegebenen USA-Beispielwerte. Nach dem Löschen wird er beim Neustart nicht automatisch wiederhergestellt. |
| `write_conflict` | Schreibkonflikt | Conflit d’écriture | Conflitto di scrittura | Gleichzeitige Bearbeitung eines Datensatzes, dessen gespeicherte Version sich seit dem Öffnen geändert hat. Der Server verhindert stilles Überschreiben und meldet den Konflikt; ungespeicherte eigene Eingaben bleiben erhalten. |

## Redaktionelle Regeln

- In Beschriftungen, Hilfen und Dokumentation dieselben Begriffe verwenden. Verwechslungen zwischen Umwelt und Umfeld sowie zwischen Operativen Domänen und Operationsraum vermeiden.
- Bei weiteren Fachbegriffen zuerst die passende Sprachfassung des Reglements prüfen. Bei fehlender oder abweichender Entsprechung den Begriff als projektspezifisch erklären und keine reglementarische Gleichsetzung behaupten.
- Übersetzungen gemeinsam pflegen. Das Glossar übersetzt keine Bewertungen, Quelleninhalte oder andere fachliche Benutzereingaben automatisch.
- Im Werkzeug nur die gewählte Sprache anzeigen. Die parallelen Sprachspalten in diesem Glossar dienen der terminologischen Abstimmung.
