# Fachkonzept für das Werkzeug zum Vergleich militärischen Potenzials

[Deutsch](konzept.de.md) · [Français](konzept.fr.md) · [Italiano](konzept.it.md) · [Glossar](glossar.de.md) · [Dokumentation](README.md)

Stand: 16. Oktober 2026. Fachliche Referenz ist `temp/Potentialvergleich_v7.xlsx`; v3 bleibt lokal als Vergleichsstand erhalten. Die lokal startbare Mehrbenutzeranwendung Version 0.1 ist umgesetzt. Die Umsetzung folgt den Leitlinien in AGENTS.md und den nachstehend bestätigten Anforderungen. Dieses Konzept berücksichtigt die bestätigten Entscheidungen D1 bis D9 und die anschliessend bestätigte Entfernung der Plausibilisierung aus dem Tool.

Das Quellcode-Repository ist [stekhoven/military_potential auf GitHub](https://github.com/stekhoven/military_potential). Excel-Arbeitsdateien, lokale Konfiguration, Datenbanken und erzeugte Exporte bleiben ausserhalb von Git. Für die erste Einrichtung muss die freigegebene v7-Datei lokal bereitgestellt werden; die [Startanleitung](start.de.md) beschreibt den Ablauf.

<a id="llm-transparency"></a>

## Transparenz zum Einsatz von LLMs

Grosse Sprachmodelle (Large Language Models, LLMs) wurden für die Generierung des Anwendungscodes und für die Recherche der anfänglichen USA-Beispieldaten eingesetzt. Die Beispielwerte dienen der Demonstration und sind keine verifizierte Aussage über tatsächliche militärische Fähigkeiten.

Vor einer fachlichen Nutzung prüft der verantwortliche Analyst die Originalquellen, Aktualität, Bewertungen und Verlässlichkeit. Die dokumentierten Softwaretests prüfen Berechnung und Anwendungsverhalten; sie bestätigen nicht die sachliche Richtigkeit der recherchierten Daten oder der Modellannahmen.

## 1 Ziel und bestätigte Anforderungen

Das Werkzeug übernimmt die Funktionalitäten, Nomenklatur und Berechnungsregeln des geprüften Modells. Analysten bearbeiten Bewertungen, Verlässlichkeit, Zukunftsannahmen und Bemerkungen beziehungsweise Quellen. Chef Analysten verwalten zusätzlich Modellstruktur, Indikatoren, Zielknoten, Wirkungsbeziehungen, Gewichtungen und Szenarien. Die Ansichten unterstützen eine nachvollziehbare Bewertung und den Vergleich mehrerer Akteure.

Die verbindliche deutsche Bezeichnung lautet **Operative Domänen**. Die französische Fassung verwendet **Domaines opérationnels**, die italienische **Domini operativi**. Technische IDs bleiben bei Umbenennung und Übersetzung erhalten. Reglementsbegriffe werden anhand der drei bereitgestellten Fassungen von Reglement 50.041 verwendet; Begriffe des Modells werden im [Glossar](glossar.de.md) erklärt.

Die Oberfläche zeigt jeweils **eine Sprache**. Das Dropdown bietet **Deutsch**, **Français** und **Italiano**. Ein Sprachwechsel erhält Auswahl, Eingaben und Ergebnisse. Die Anwendung wird lokal gestartet und unterstützt mehrere Benutzer mit Anmeldung, zentraler Speicherung und serverseitig geprüften Rollenrechten.

Das Design ist nüchtern und modern: ruhige Farben, klare Typografie, verständliche Formulare und gezielte Hervorhebungen. Die fachlichen Inhalte der Excel-Datei werden in eigenständige, benutzerfreundliche Ansichten überführt.

## 2 Bestand und Quellzuordnung von v7

| Gegenstand | Bestand der Vorlage | Übernahme |
| --- | --- | --- |
| Indikatoren | 121 eindeutige IDs | Alle Definitionen und Knotenzuordnungen; Überschriften und Reservezeilen ausschliessen. |
| Bewertete Knoten | 35 | PMESII, Umwelt und sieben Operative Domänen. |
| Potenzialfaktoren | 5 Zielknoten | X1 Personal, X2 Material, X3 Führung und Ausbildung, X4 Durchhaltefähigkeit, X5 Kampfwille. |
| Wirkungsbeziehungen | 136 | Quelle, Ziel, Stärke, Vorzeichen und Fristigkeit erhalten. |
| Szenarien | 6 belegte Vorlagen | Namen, Annahmen und Faktorengewichte übernehmen; Chef Analyst kann Szenarien erstellen, bearbeiten und entfernen. |
| Akteure und Zeitstände | 4 vorbereitete Akteursblöcke; heute, in 5 Jahren, in 10 Jahren | Akteursbewertungen getrennt vom Modell führen. |

Diese Zahlen beschreiben den Importbestand. Die Anwendung unterstützt eine veränderliche Zahl von Indikatoren, Knoten, Zielknoten und Szenarien. Erweiterungen verändern Berechnung, Tabellen, Diagramme und Netzwerk konsistent. Andere vertrauliche Bewertungen, Akteursnamen und Quellenbemerkungen bleiben ausserhalb der Projektdokumentation und der Versionskontrolle. Die ausdrücklich freigegebenen USA-Werte sind die einzige Ausnahme als gekennzeichneter, löschbarer Beispieldatensatz.

### Arbeitsblätter und Eingaben

| Excel-Quelle | Inhalt und Übernahme |
| --- | --- |
| `Anleitung!A1:B23` | Fachliche Regeln, Einführung und Hilfen. |
| `Bewertung!A4:E149` | ID, Gruppe, Knoten-ID, Knoten- und Indikatorbezeichnung; nur belegte Indikatorzeilen. |
| Zellnotizen zu `Bewertung!E5:E149` | 121 vollständige Definitionen aus den Kommentarbestandteilen lesen, nicht nur die sichtbaren Zelltitel. Kommentarautoren werden nicht übernommen. |
| `Bewertung!F3:Y149` | Vier Akteursblöcke mit heutigen Werten, Verlässlichkeit, Zukunftswerten und Bemerkung / Quelle. |
| `Modell!A4:I18` | Szenariobereich; belegt sind die Zeilen 5 bis 10. A Nummer, B Name, C Annahme, E bis I die Faktorengewichte. |
| `Modell!A23:D57` | Knotenkatalog: A ID, B Name, C Gruppe, D Lenkbarkeit. |
| `Modell!E21:AR22` und `E23:AR57` | Zielbezeichnungen, Ziel-IDs und gerichtete Wirkungsmatrix; Zeile wirkt auf Spalte. |
| `Modell!A61:E197` | Indikatorgewichte samt Begründung / Quelle; belegte IDs in Zeilen 62 bis 182. |
| `Modell!D202` und `D204` | Konfigurierbare Schwellen der Datenqualitätsampel; die Zwischenbeschriftung in D203 ist abgeleitet. |
| `Berechnung!A1:AW976` | Rechenschritte und gespeicherte Vergleichswerte. |
| `Übersicht!B1:R48` | Knotenwerte mehrerer Akteure und aller drei Zeitstände mit Trend. |
| `Herleitung!B1:O49` | Rechnung, Zusammensetzung, Knotenbeiträge, Qualitätsangaben und Indikatordetails. |
| `Auswertung!B1:T40` | Kompakte Auswertung mehrerer Akteure; Szenario in D3, Zeitpunkt in L3. |

| Feld in Bewertung | Akteur 1 | Akteur 2 | Akteur 3 | Akteur 4 |
| --- | --- | --- | --- | --- |
| Name | F3 | K3 | P3 | U3 |
| Bewertung heute | F | K | P | U |
| Verlässlichkeit | G | L | Q | V |
| Bewertung in 5 Jahren | H | M | R | W |
| Bewertung in 10 Jahren | I | N | S | X |
| Bemerkung / Quelle | J | O | T | Y |

Die Indikatorgewichte werden über die ID aus `Modell!A62:D197` zugeordnet. Die aktuelle Zeilenposition ist ein Quellbeleg, kein dauerhafter Schlüssel. Der Import liest auch die erweiterten x14-Validierungen für die Knotenzuordnung und die Akteursauswahl. Quellnotizen und Bemerkungen werden als Daten behandelt.

| Eingabe | Zulässiger Bereich |
| --- | --- |
| Heutige und zukünftige Bewertungen | Ganze Zahlen 1 bis 5; fehlend als eigener Zustand. Zukunftswerte sind absolute Bewertungen. |
| Indikatorgewicht | Dezimalzahl 0 bis 10; 0 deaktiviert den Indikator. |
| Verlässlichkeit | A1, A2, A3, B1, B2, B3, C1, C2 oder C3; fehlend separat. |
| Wirkung | ±1, ±2 oder ±3 mit K, M oder L; keine Beziehung als eigener Leerzustand. |
| Faktorengewicht | Ganze Zahl 0 bis 3. |
| Lenkbarkeit | Lenkbar, bedingt lenkbar oder nicht lenkbar. |
| Schwellen der Datenqualität | Werte von 0 bis 1; untere Schwelle kleiner als obere. |

### Berechnungsbereiche

Alle folgenden Bereiche gehören zum Blatt `Berechnung`.

| Bereich | Zweck |
| --- | --- |
| A52:AN196 | Indikatorwerte und Gewichtszuordnung. |
| AQ50:AW54 | Vollständigkeit, Verlässlichkeit und unsicherer Anteil. |
| A201:AE236 | Direkte Knotenwerte, Änderungen und Knotenwerte mit Folgewirkungen. |
| C242:AP281; C282 | Direkte Wirkungsmatrix D und Normierungsfaktor s. |
| C285:AP324 | Fristigkeitsmatrix. |
| C328:AP367 | N. |
| C371:AP410, C414:AP453, C457:AP496 | N², N³ und N⁴. |
| C500:AP539 | Totalwirkung T. |
| C543:AP582 | N₅ ohne L-Beziehungen. |
| C586:AP625, C629:AP668, C672:AP711 | N₅², N₅³ und N₅⁴. |
| C715:AP754 | Totalwirkung T₅. |
| A759:AB794 | Rolle, Einfluss, Hebel und Lenkbarkeit. |
| A799:AD805 | Potenzialfaktoren und Gesamtpotenzial aller Akteure und Zeitstände. |
| A877:L912 | Heutige Knotenbeiträge und Veränderungsbeiträge. |
| A915:B919 | Anteile der vier Wirkungsrunden. |
| A923:E937 | Akteursvergleich und Zeitverlauf. |
| A941:J976 | Zehnjahrestreiber je Akteur. |

## 3 Vergleich von v3 und v7

Die 121 Indikator-IDs und ihre Knotenzuordnungen, die 35 bewerteten Knoten, die Ziel-IDs X1 bis X5, alle 136 Wirkungsbeziehungen sowie die gültigen Indikator- und Szenariogewichte sind unverändert. Die Definitionstexte der 121 Zellnotizen sind ebenfalls erhalten; v7 stellt dem bisherigen Text jeweils den Indikatortitel voran.

| Änderung | Bedeutung für das Tool |
| --- | --- |
| Kompakte Auswertung mit Akteuren nebeneinander | Gemeinsames Szenario und gemeinsamer Zeitpunkt; klare Vergleichswerte, Entwicklung, Datenqualität und Kernaussagen. |
| Neue Blätter Übersicht und Herleitung | Knotenwerte mit Zeit und Trend sowie eine prüfbare Erklärung bis zum Indikator anbieten. |
| Lagekarte entfernt | Die Excel-Lagekarte wird nicht nachgebildet. Die eigenständige interaktive Netzwerkansicht bleibt als bestätigte Tool-Anforderung erhalten. |
| Plausibilisierung entfernt | Entfällt nach ausdrücklicher Bestätigung auch im Tool; keine manuellen Ergebnisaufschläge und kein entsprechendes Eingabefeld. |
| Indikatorgewichte im Modell | Chef-Analyst-Bearbeitung von der Bewertung trennen; Zuordnung über IDs. |
| Neue Bezeichnungen der Potenzialfaktoren | Fachliche Bezeichnungen aus v7 übernehmen und als Modellbegriffe übersetzen. |
| Konfigurierbare Qualitätsampel | Quellenqualität separat von den Potenzialwerten darstellen; Schwellen als Modellparameter führen. |
| Szenarioliste eingegrenzt | Der frühere Übergriff der Auswahlliste in den Knotenkatalog ist in v7 behoben. |

Die Kernberechnung ist erhalten. Unterschiede der verglichenen Kernformeln betreffen die neue Gewichtsquelle, die entfernte Korrekturfunktion und die Vollständigkeitsnenner. Bestätigte Produktentscheidungen werden bei der Übernahme nicht durch Excel-Eigenheiten ersetzt.

## 4 Rechenregeln und Erklärbarkeit

1. Ein Knotenwert ist der gewichtete Mittelwert vorhandener Indikatorbewertungen. Fehlende Bewertungen bleiben fehlend; Gewicht 0 schliesst einen Indikator aus. Ohne nutzbare gewichtete Daten verwendet der Knoten rechnerisch den Neutralwert 3 und wird sichtbar als unbelegt gekennzeichnet.
2. Fehlende heutige Bewertungen werden auch bei ausgefüllten Zukunftsfeldern rechnerisch ausgeschlossen. Ein leerer Fünfjahreswert übernimmt heute; ein leerer Zehnjahreswert übernimmt den effektiven Fünfjahreswert. Dies wird bei der Eingabe erklärt.
3. `s = max(max_i Σ_j |D_ij|, max_j Σ_i |D_ij|)`; `N = D / s`; `T = N + N² + N³ + N⁴`. Die vier Runden bilden Wirkungsschritte ab. Kalenderdauern entlang eines Pfades werden nicht addiert. Gegenläufige Pfade können sich aufheben.
4. Heutige Potenziale verwenden alle Fristigkeiten. Für Fünfjahresänderungen werden L-Beziehungen vor der Bildung der Potenzen entfernt. Der Normierungsfaktor s und der Hebelnenner bleiben auf das vollständige Netz bezogen. Zehnjahresänderungen verwenden T.
5. Für Ziel j gilt `q_j = Σ_i |T_ij|`, `h_ij = T_ij / q_j` und Einfluss `|h_ij|`. Der heutige Rohfaktor ist `3 + Σ_i h_ij × (x_i − 3)`. Zukunftsfaktoren starten beim heutigen Rohfaktor und verwenden direkte Knotenänderungen: `Δx5 = x5 − xheute` und `Δx10 = x10 − xheute`.
6. Knotenwerte einschliesslich fortgepflanzter Folgen werden getrennt berechnet und nicht nochmals als direkte Eingaben in die Zukunftspotenziale eingesetzt. Ausgegebene Potenzialfaktoren werden auf 1 bis 5 begrenzt. Das Gesamtpotenzial ist das gewichtete Mittel dieser begrenzten Faktoren.
7. Verlässlichkeit beeinflusst keine Potenzialwerte. Grün gilt für A1, A2 und B1, gelb für B2, rot bei Quelle C oder Informationsstufe 3. Fehlende Verlässlichkeit wird gesondert angezeigt. Die Ampel eines Akteurs oder Knotens bezeichnet den unsicheren Anteil nach den konfigurierten Schwellen; ohne Qualitätsangaben erscheint der Zustand unbekannt.
8. Vollständigkeit ist der Anteil bewerteter aktiver Indikatoren an allen aktiven Indikatoren. Deaktivierte Indikatoren werden separat gezählt. Ohne aktive Indikatoren erscheint kein Prozentwert. Damit wird die bestätigte D9-Korrektur umgesetzt.
9. Bei fehlenden Voraussetzungen wie Normierungsfaktor 0, Summe der Faktorengewichte 0 oder unerreichbarem Ziel wird der betroffene Wert als nicht berechenbar gemeldet. Es gibt keine Division durch null und keine stillen Ersatzwerte für diese Fälle. Andere berechenbare Teile bleiben zugänglich.
10. Unbekannte oder doppelte IDs werden beim Import gemeldet. Der in Excel vorhandene stille Rückfall eines fehlgeschlagenen Gewichts-Lookups auf 1 wird nicht übernommen.

### Herleitung

Die Herleitung verbindet die Rechnung mit allen beitragenden Knoten und deren Indikatoren. Für jeden Knoten sind Wert, Einfluss, vorzeichenbehafteter Hebel, Beitrag, Gewichtung, Verlässlichkeit und Belege erreichbar. Die vollständigen Indikatordefinitionen erscheinen als Feldhilfe oder im Detailpanel.

Die heutige Faktorherleitung und die Veränderung des Gesamtpotenzials haben unterschiedliche Bezugsgrössen; diese werden ausdrücklich beschriftet. Zukünftige Einzelfaktorherleitungen werden aus denselben Rechenregeln abgeleitet und separat validiert. Das Diagramm unterscheidet Rohwert, Begrenzung und Endwert. Bei einer Auswahl der grössten Beiträge wird der Rest ausgewiesen.

Die Wörter trägt und bremst richten sich nach dem tatsächlichen Vorzeichen des Beitrags. Ein relativ kleinster positiver Beitrag ist kein bremsender Beitrag. Fehlende Daten sind auch bei einem rechnerischen Neutralwert sichtbar. Modellwirkungen werden als Annahmen erklärt.

### Kontrastansicht nach der Netzberechnung

Die offizielle Rechnung und die ursprünglichen Modellwerte bleiben erhalten. Die zusätzliche Kontrastansicht spreizt die fertig berechneten rohen Zielwerte um den Neutralwert 3:

`contrast_value = min(5, max(1, 3 + g * (raw_value - 3)))`

Standard ist `g = 1`; `g = 1.25` ist die erste Vergleichsvariante. Bei `g = 1` entspricht die Kontrastansicht dem auf 1–5 begrenzten ursprünglichen Zielwert. Der Chef Analyst verwaltet g als versionierten Szenarioparameter. Innerhalb des Szenarios gilt derselbe Faktor für alle Zielknoten, Akteure und Zeitstände. Die Herleitung zeigt Rohwert, ursprünglichen begrenzten Modellwert, g, unbeschränkte Transformation, Kontrastwert und jede Begrenzung. Das separat beschriftete Kontrast-Gesamtpotenzial ist das gewichtete Mittel der bereits begrenzten Kontrast-Zielwerte.

Eingaben, Verlässlichkeit, Kantenstärken, vier Netzwerkrunden und Zeitlogik ändern sich dadurch nicht. Die früher diskutierte Potenzierung der Kanten gehört nicht zu Version 0.1. Die Kontrastansicht ist keine zusätzliche Plausibilisierung und ersetzt keine offiziellen Werte. Vergleiche kennzeichnen die gemeinsame Szenario- und Kontrastbasis sichtbar.

## 5 Rollen, Änderungen und Versionen

| Tätigkeit | Analyst | Chef Analyst |
| --- | --- | --- |
| Bewertungen, Verlässlichkeit, Zukunftswerte und Bemerkung / Quelle bearbeiten | Ja | Ja |
| Gewöhnliche Akteure erstellen, umbenennen und entfernen | Ja | Ja |
| Auswertung, Herleitung, Übersicht und Netzwerk untersuchen | Ja | Ja |
| Gewichte, Wirkungsstärken, Fristigkeiten und Lenkbarkeit verändern | Nein | Ja |
| Indikatoren und Knotenstruktur verwalten | Nein | Ja |
| Zielknoten bearbeiten, hinzufügen und entfernen | Nein | Ja |
| Szenarien erstellen, bearbeiten und entfernen, einschliesslich Vorlagen | Nein | Ja |
| Schwellen der Datenqualitätsampel verändern | Nein | Ja |
| Kontrastfaktor g verwalten, Modell / Szenarien importieren und Beispielakteur entfernen | Nein | Ja |
| JSON exportieren und Bewertungen importieren | Ja | Ja |

Anmeldung und Schreibrechte werden auf dem Server geprüft. Die Rolle stammt aus dem Benutzerkonto. Die Strukturverwaltung verlangt stabile IDs, Definitionen, Gruppenzuordnung und konsistente Wirkungsbeziehungen. Für neue Zielknoten werden die Szenariogewichte bewusst gesetzt; unvollständige Modelle werden sichtbar gemeldet.

Änderungen an einer gespeicherten Modell- oder Szenarioversion erzeugen eine neue Version. Entfernen wirkt auf den neuen Stand. Frühere Bewertungen und Auswertungen behalten ihre Referenzen und bleiben nachvollziehbar. Bewertungsdaten, Modellparameter und Szenarioannahmen bleiben getrennt. Eine Namensänderung allein erzeugt keine neue fachliche ID.

Gemeinsame Akteursvergleiche verwenden dasselbe Szenario und denselben Zeitpunkt. Die Zuordnung einer Szenarioversion zur Modellversion bleibt explizit. Zwei gleichzeitige Bearbeitungen desselben Datensatzes dürfen sich nicht still überschreiben: Die Anwendung zeigt den Konflikt, erhält eigene Eingaben und ermöglicht einen bewussten Abgleich.

## 6 Ansichten und Gestaltung

Die Navigation erschliesst Arbeitsübersicht, Bewertungen, Auswertung, Knotenübersicht, Herleitung, Netzwerk sowie Modell und Szenarien. Auswahlkontext, Filter und ungespeicherte Eingaben bleiben bei Ansichts- und Sprachwechseln erhalten. Ein sichtbarer Speicherstatus unterscheidet ungespeicherte Änderungen, erfolgreichen Speicherstand und Fehler.

| Ansicht | Bedienung und Inhalt |
| --- | --- |
| Arbeitsübersicht | Vollständigkeit und Qualitätslücken erkennen und direkt zur gefilterten Bearbeitung wechseln. |
| Bewertungen | Über Gruppe und Knoten navigieren; Indikatoren suchen; Bewertung, Verlässlichkeit, Zukunftswerte und Belege zusammen bearbeiten. |
| Auswertung | Mehrere Akteure nebeneinander mit Gesamtpotenzial, Rang, Potenzialfaktoren und Datenqualität vergleichen; Entwicklung und Kernaussagen gezielt öffnen. |
| Knotenübersicht | Gruppen aufklappen; Werte aller gewählten Akteure heute, in 5 und in 10 Jahren mit Trend vergleichen. |
| Herleitung | Akteur und Zielknoten wählen; Rechnung, Beiträge, Qualität und Indikatoren untersuchen. Alle Knoten bleiben zugänglich; drei hervorgehobene Knoten sind keine Beschränkung. |
| Netzwerk | Gerichtete Beziehungen eines gewählten Akteurs untersuchen; Gruppen, Stärke, Vorzeichen und Fristigkeit filtern. |
| Modell und Szenarien | Chef Analyst bearbeitet Parameter und Struktur, erstellt Varianten und prüft ihre Auswirkungen. |

Die v7-Trendanzeige bezieht sich auf heute bis in 10 Jahren, unabhängig vom gewählten Zeitpunkt. Der Bezugszeitraum und die neutrale Bandbreite von ±0.05 bleiben sichtbar. Diagramme stellen die drei vorhandenen Zeitstände dar; zusätzliche Zwischenprognosen werden ohne eigenes Zeitmodell nicht erfunden.

Das Netzwerk enthält die jeweils gültigen Knoten und Zielknoten. Filter verändern nur die Darstellung. Ein Popup oder fixierbares Panel zeigt Definition, Werte, Qualitätsangaben, Indikatoren, Quellen, Rolle, Einfluss, Hebel und Lenkbarkeit. Ein- und ausgehende Beziehungen lassen sich hervorheben. Kantendetails zeigen Quelle, Ziel, Stärke und Fristigkeit.

Bewertungsfarben und Qualitätskennzeichnungen bleiben unterscheidbar; Pfeile, Vorzeichen, Beschriftungen und Linienarten ergänzen Farbe. Diagramme besitzen Tabellenalternativen. Formulare, Knotenlisten und Detailansichten sind per Tastatur bedienbar. Fehlerhafte Eingaben oder ein gescheiterter Speichervorgang verwerfen keine Arbeit.

### Ansichtsskizzen

```text
BEWERTUNGEN
[Akteur ▾] [Gruppe / Knoten ▾] [Suche / Filter]                    [Deutsch ▾]
Indikator und Definition | Heute | Verlässlichkeit | 5 J | 10 J
Bemerkung / Quelle      [                                      ]
Speicherstatus          [Änderungen speichern]
```

```text
AUSWERTUNG
[Akteure auswählen ▾] [Szenario ▾] [Zeitpunkt ▾]                   [Deutsch ▾]
                        Akteur A             Akteur B
Gesamtpotenzial         <Wert>               <Wert>
Potenzialfaktoren       <Vergleichsbalken und Werte>
Qualität / erfasst      <Status>             <Status>
Trend heute → 10 J      <Trend>              <Trend>
[Entwicklung] [Knotenübersicht] [Herleitung öffnen]
```

```text
HERLEITUNG UND NETZWERK
[Akteur ▾] [Zielknoten ▾] [Szenario ▾] [Zeitpunkt ▾]               [Deutsch ▾]
Rechnung / Beiträge oder Wirkungsnetz       Fixierbare Knotendetails
                                           Definition, Bewertung und Qualität
                                           Indikatoren, Gewichte und Quellen
                                           Ein- und ausgehende Beziehungen
[Filter zurücksetzen]                      [Zur Bewertung]
```

## 7 Sprache und Terminologie

Navigation, Fachbegriffe, Katalogdefinitionen, Hilfen, Fehlermeldungen, Diagramme und Ausgaben erscheinen in der gewählten Sprache. Zahlen und Datumsangaben folgen der Sprachwahl. Originale Bemerkungen, Quellenzitate und Links bleiben in ihrer Eingabesprache erhalten. Ein Sprachwechsel löst weder Speicherung noch Import aus und verändert keine Rechenwerte.

Das Glossar unterscheidet reglementarisch belegte Begriffe von definierten Modellbegriffen. Insbesondere werden Umwelt und Umfeld auseinandergehalten. Für Umwelt gilt französisch milieu und italienisch ambiente; Umfeld entspricht environnement beziehungsweise contesto. Operative Domänen wird nicht ungeprüft mit Operationsraum gleichgesetzt. Die Projektübersetzungen von Kampfwille sind als Modellterminologie gekennzeichnet.

Die Katalogübersetzungen verwenden gemeinsame Schlüssel und werden auf Vollständigkeit geprüft. Neue Modellbegriffe benötigen die drei Sprachfassungen. Das Bearbeitungsformular zeigt jeweils die ausgewählte Sprache und macht fehlende Übersetzungen gezielt auffindbar.

## 8 Technische Struktur und Import

Version 0.1 verwendet Python für Import und Rechenkern, Django für Anwendungsschnittstelle, Anmeldung und Rollen, React für die Oberfläche und PostgreSQL für die zentrale Speicherung. Ein dokumentierter lokaler Startweg führt zur Mehrbenutzeranwendung im Browser. Die Umgebung erhält lokale Benutzerkonten. Die eingesetzten Versionen sind in `requirements.txt` und `frontend/package-lock.json` festgehalten; `compose.yaml` legt PostgreSQL 17 fest.

| Bestandteil | Inhalt |
| --- | --- |
| Modellversion | Katalog, Definitionen, Gruppen, Indikatorgewichte, Wirkungen, Zielknoten, Qualitätsparameter und Übersetzungsschlüssel. |
| Szenarioversion | Modellreferenz, Name, Annahmen und gegebenenfalls abweichende Modellparameter; Faktorengewichte und Kontrastfaktor g. |
| Bewertungsstand | Akteur, Indikator-ID, heutiger Wert, Zukunftswerte, Verlässlichkeit und Bemerkung / Quelle. |
| Ergebnis | Abgeleitete Werte und Beiträge mit Modell-, Szenario- und Bewertungsreferenz. |
| Versionshistorie | Änderungszuordnung zum Benutzerkonto und nachvollziehbare Vorgängerstände; keine Kontodaten in der Dokumentation. |

Import, Validierung, Berechnung, Speicherung und Oberfläche werden getrennt. Der Import liest Excel als Datenquelle, einschliesslich Zellnotizen und erweiterter Validierungen. Makros, eingebettete Inhalte oder Excel-Formeln werden dabei nicht ausgeführt. Geteilte OOXML-Formeln werden für den fachlichen Vergleich korrekt aufgelöst. Gespeicherte Excel-Ergebnisse sind Referenzwerte, keine Ersatzberechnung.

Die neue Datei erzeugt eine geprüfte Modellversion. Bestehende Bewertungen und Quellen werden nicht still überschrieben; geänderte IDs oder Bedeutungen verlangen eine ausdrückliche Zuordnung. Arbeitsdateien unter `temp/` bleiben ausserhalb der Versionskontrolle. Testdaten werden synthetisch erzeugt oder stammen ausschliesslich aus dem ausdrücklich freigegebenen USA-Beispiel. Die Excel-Dateien bleiben unverändert.

Verbindliche Ergebnisse werden serverseitig aus den referenzierten Ständen berechnet. Der Server prüft Rollen, Eingabewerte und die bearbeitete Datensatzversion. Zusammengehörige Änderungen werden konsistent gespeichert; Konflikte und Fehler werden verständlich angezeigt.

### Löschbares Beispiel und JSON-Austausch

Die ausdrücklich freigegebenen USA-Werte werden als gekennzeichneter Beispielakteur angeboten. Ein Chef Analyst kann diesen Akteur entfernen; Neustarts stellen ihn nicht automatisch wieder her. Der Import übernimmt weder andere Akteursblöcke noch Kommentarautoren. Persönliche Daten sowie andere vertrauliche Inhalte bleiben ausgeschlossen. Die Ausnahme gilt ausschliesslich für den freigegebenen Beispieldatensatz.

JSON ist das Austauschformat. Der aktuelle vollständige Eingabestand verwendet `schema_version: "0.1"` mit den Bereichen `model`, `scenarios` und `actors`. Der Szenarioparameter g heisst im Austauschformat `gain`. Die gespeicherte Versionshistorie bleibt auf dem Server und ist kein Bestandteil des Eingabeexports. Eine explizite Formatversion, stabile IDs sowie Modell- und Szenarioreferenzen verbinden Katalog, Parameter und Bewertungen. Der Export enthält Bewertungen, Zukunftsfelder, Verlässlichkeit, Bemerkungen / Quellen, Übersetzungen und g; abgeleitete Werte werden beim Import neu berechnet. Zugangsdaten und Sitzungen gehören nicht in den Export.

Der Server prüft die gesamte Datei vor dem Schreiben: Datentypen und Bereiche, IDs, Referenzen und Rollenrechte. Modell- und Szenarioimporte sind Chef Analysten vorbehalten. Fehler führen zum vollständigen Abbruch statt zum Teilimport. Bereits vorhandene Datensätze werden nicht still überschrieben; ein Konflikt wird gemeldet. Export und erneuter Import erhalten die Eingaben verlustfrei. Excel-Arbeitsdateien, lokale Datenbanken und erzeugte Exporte bleiben ausserhalb der Versionskontrolle.

## 9 Bestätigte Entscheidungen

| ID | Entscheidung |
| --- | --- |
| D1 | Lokal startbare Mehrbenutzeranwendung mit Anmeldung, zentraler Speicherung und serverseitigen Rollenrechten. |
| D2 | Chef Analyst darf Gewichte, Wirkungen, Fristigkeiten und Struktur ändern sowie Indikatoren, Zielknoten und Szenarien verwalten. |
| D3 | Fehlende Werte bleiben sichtbar; ohne nutzbare Daten rechnet ein Knoten neutral mit 3. |
| D4 | Verlässlichkeit bleibt eine Qualitätsangabe und verändert keine Potenzialwerte. |
| D5 | Bisherige Zeitlogik und Fortführung leerer Zukunftsfelder bleiben erhalten. |
| D6 | Durch v7 und anschliessende Bestätigung ersetzt: Plausibilisierung entfällt vollständig, auch im Tool. |
| D7 | Nicht berechenbare Zustände sichtbar melden; keine Division durch null. |
| D8 | Chef Analyst kann Szenarien erstellen, bearbeiten und entfernen, auch die vorgegebenen. |
| D9 | Vollständigkeit mit einheitlicher Grundgesamtheit aktiver Indikatoren berechnen; ohne aktive Indikatoren keinen Prozentwert anzeigen. |

Für diese Punkte bestehen keine offenen Fachentscheidungen. Ein Widerspruch einer späteren Quelldatei zu bestätigten Produktanforderungen wird gezielt geklärt. Die Veröffentlichung des aktuellen Quellcodestands im oben genannten GitHub-Repository ist ausdrücklich beauftragt. Der Anwendungsbetrieb und die Arbeitsdaten bleiben lokal.

## 10 Umsetzung und Prüfungen

Version 0.1 enthält den v7-Import und unabhängigen Rechenkern, Anmeldung und Rollen, zentrale Speicherung mit Konflikterkennung, Bewertungen, Mehrakteursvergleich, Knotenübersicht, Herleitung und Netzwerk. Chef-Verwaltung, dynamische Modelländerungen, JSON-Austausch, löschbares Beispiel und Kontrastansicht sind in allen drei Sprachen umgesetzt. Die [Startanleitung](start.de.md#prüfungen-und-grenzen) dokumentiert die ausgeführten Anwendungsprüfungen und verbleibenden Grenzen getrennt von der folgenden historischen Excel-Prüfung.

Die lesende Bestands- und Formelprüfung v3 gegen v7 wurde mit Python-Standardbibliothek als ZIP/XML ausgeführt. Alle 121 Indikatoren, 35 bewerteten Knoten, 5 Zielknoten, 136 Beziehungen und 6 Szenarien wurden abgeglichen. Die 121 Definitionsnotizen sind den IDs zugeordnet. Alle 12.398 geteilten Formeln wurden vor der Analyse aufgelöst.

Unabhängig nachgerechnet wurden 420 direkte Knotenwerte und 60 rohe Potenzialfaktoren je Version. Die direkten Knotenwerte stimmen exakt mit den gespeicherten v7-Ergebnissen überein; die Faktorabweichung bleibt unter `5 × 10⁻¹⁵`. Zwischen den Versionen sind die nachgerechneten Rohfaktoren identisch. Für 4.800 Matrixwerte aus N, T und T₅ bleibt die Abweichung zum v7-Cache unter `2 × 10⁻¹⁸`. Dies ist ein Vergleich mit gespeicherten Ergebnissen und keine vollständige Neuberechnung durch Excel.

In den sieben v7-Blättern wurden keine gespeicherten Formel-Fehlerwerte oder verbliebenen Verweise auf die entfernten Korrekturfelder gefunden. Makros, aktive oder eingebettete Objekte, externe Beziehungen und Datenverbindungen wurden nicht gefunden. Es wurde nichts ausgeführt.

| Abnahmekriterien der Anwendung | Kriterium |
| --- | --- |
| Vollständige Übernahme | Alle belegten IDs, Beziehungen, Gewichte, Definitionen und Szenarien einmalig zugeordnet; Reservezeilen ausgeschlossen. |
| Rechenvergleich | Knotenwerte, Netzwerkrunden, Faktoren, Gesamtpotenzial und Beiträge stimmen mit den v7-Referenzfällen innerhalb dokumentierter Toleranzen überein. |
| Fehlende und ungültige Daten | Neutralwert als unbelegt markiert; unbekannte IDs gemeldet; Nullfälle, fehlende Zukunftswerte, negative Wirkungen und Zyklen geprüft. |
| Erklärbarkeit | Beiträge, Rest und Begrenzung ergeben den Endwert; Wörter trägt und bremst entsprechen dem Vorzeichen. |
| Dynamische Struktur | Indikatoren, Zielknoten und Szenarien hinzufügen, bearbeiten und entfernen; Referenzen, Berechnung, Gewichte und Ansichten bleiben konsistent. |
| Rollen | Nur Chef Analyst kann Modell und Szenarien schreiben; Prüfung auf dem Server. |
| Sprache | Alle drei Sprachen vollständig; jeweils eine Sprache; Eingaben und Ergebnisse bleiben beim Wechsel erhalten. |
| Speicherung | Wiederöffnen erhält Version und Daten; gleichzeitige Änderungen führen zu sichtbarem Konflikt ohne stillen Datenverlust. |
| Bedienung | Mehrakteursvergleich, Zeithorizont und Trendbezug sind verständlich; Tabellenalternativen und Tastaturzugang vorhanden. |
| Kontrastansicht | Neutralwert 3 unverändert; g = 1 und g = 1.25, Begrenzung, gemeinsame Vergleichsbasis und separates gewichtetes Kontrast-Gesamtpotenzial geprüft. |
| JSON und Beispieldaten | Verlustfreier Rundlauf, ungültige Referenzen, Rollenrechte, Konflikte und vollständiger Abbruch bei Fehlern geprüft; gelöschtes USA-Beispiel bleibt bei Neustart gelöscht. |

Historischer Prüfstand vor dem Anwendungsbau: Die damalige Dokumentationsprüfung ergab: Technische Inhalte, Zahlen und Entscheidungsstände stimmen in allen drei Konzeptfassungen überein; die vollständige Strukturzuordnung wurde gegen v7 geprüft. Die damaligen 26 Glossarbegriffe sind sprachübergreifend zugeordnet, mit 5 Reglementsbelegen je Sprache. Alle lokalen Verweise sind gültig; Akteursnamen und Quellenbemerkungen aus der Arbeitsdatei wurden nicht übernommen. Die v7-Datei blieb unverändert. Der Ausschluss von `temp/` wurde mit `git check-ignore` geprüft. Diese frühere Prüfung ist keine Prüfung des Anwendungscodes. Die tatsächlich ausgeführten Anwendungsprüfungen und verbleibenden Grenzen stehen in der [Startdokumentation](start.de.md).

## Anhang A Strukturelle Einzelzuordnung

Die folgenden Tabellen enthalten ausschliesslich IDs und Zellbezüge der v7-Datei. Namen, Bewertungen, Quellenbemerkungen und numerische Wirkungsannahmen bleiben in der Quelldatei. Indikator-IDs sind jeweils in aufsteigender Reihenfolge der Quellzeilen angegeben.

### Knoten und Indikatoren

| Knoten-ID | Modellbereich | Bewertungsbereich | Indikator-IDs in Zeilenreihenfolge | Indikatorgewichte | Berechnungsbereich |
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

### Zielknoten

| Ziel-ID | Definition und ID | Faktorberechnung | Szenariogewichte |
| --- | --- | --- | --- |
| X1 | `Modell!AN21:AN22` | `Berechnung!A800:AD800` | `Modell!E5:E10` |
| X2 | `Modell!AO21:AO22` | `Berechnung!A801:AD801` | `Modell!F5:F10` |
| X3 | `Modell!AP21:AP22` | `Berechnung!A802:AD802` | `Modell!G5:G10` |
| X4 | `Modell!AQ21:AQ22` | `Berechnung!A803:AD803` | `Modell!H5:H10` |
| X5 | `Modell!AR21:AR22` | `Berechnung!A804:AD804` | `Modell!I5:I10` |

### Wirkungsbeziehungen

Alle 136 belegten Beziehungen sind über Quell-ID, Ziel-ID und Zelle im Blatt `Modell` zugeordnet. Stärke und Fristigkeit werden aus der jeweiligen Zelle gelesen.

| Quell-ID | Ziel-ID und Quellzelle |
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
