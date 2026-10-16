# Dokumentation / Documentation / Documentazione

| | Deutsch | Français | Italiano |
| --- | --- | --- | --- |
| Start / Démarrage / Avvio | [Lokaler Start](start.de.md) | [Démarrage local](start.fr.md) | [Avvio locale](start.it.md) |
| Konzept / Concept / Concetto | [Fachkonzept](konzept.de.md) | [Concept fonctionnel](konzept.fr.md) | [Concetto funzionale](konzept.it.md) |
| Begriffe / Termes / Termini | [Glossar](glossar.de.md) | [Glossaire](glossar.fr.md) | [Glossario](glossar.it.md) |
| LLM-Einsatz / Utilisation de LLM / Utilizzo di LLM | [Transparenz](konzept.de.md#llm-transparency) | [Transparence](konzept.fr.md#llm-transparency) | [Trasparenza](konzept.it.md#llm-transparency) |

[GitHub: stekhoven/military_potential](https://github.com/stekhoven/military_potential)

## Deutsch

Version 0.1 ist umgesetzt. Das Konzept verbindet die v7-Fachlogik mit den bestätigten Produktentscheidungen: lokal startbarer Mehrbenutzerbetrieb, serverseitige Rollenrechte, dynamische Modellstruktur, JSON-Austausch, löschbares USA-Beispiel und zusätzliche Kontrastansicht um 3. Plausibilisierung entfällt. Die Anwendung verwendet eine aktive Sprache per Dropdown. Die [Startanleitung](start.de.md) beschreibt das Klonen des Repositorys und die Einrichtung. Die Excel-Referenz ist nicht im Repository enthalten und muss für die erste Einrichtung unter `temp/Potentialvergleich_v7.xlsx` bereitgestellt werden.

Der [Katalog](../data/catalog-i18n.json) enthält 35 Knoten, fünf Zielknoten, 121 vollständige Indikatorbeschreibungen aus den Zellnotizen sowie sechs Szenarien in DE/FR/IT. Die Anzahl bleibt im Tool veränderlich. Kommentarautoren und andere Akteursblöcke werden nicht übernommen. Das [Glossar](glossar.de.md) erläutert 32 Reglements- und Modellbegriffe, unter anderem die Unterscheidung Umwelt / Umfeld und die verbindliche Bezeichnung **Operative Domänen**.

Die frühere Bestands- und Formelprüfung v3 gegen v7 ist im Konzept als historischer Prüfstand dokumentiert. Sie ist kein Test des Anwendungscodes. Die Startanleitung beschreibt die tatsächlich ausgeführten Anwendungsprüfungen und verbleibende Grenzen. Arbeitsdateien unter `temp/`, lokale Konfiguration und erzeugte Exporte bleiben ausserhalb von Git.

Der [Transparenzhinweis](konzept.de.md#llm-transparency) erläutert den Einsatz von LLMs für Codegenerierung und Recherche der anfänglichen Beispieldaten sowie die erforderliche Prüfung der Originalquellen.

## Français

La version 0.1 est réalisée. Le concept relie la logique métier v7 aux décisions produit confirmées : exploitation multiutilisateur démarrable localement, droits vérifiés sur le serveur, structure dynamique du modèle, échange JSON, exemple USA supprimable et vue de contraste supplémentaire autour de 3. L’ajustement de plausibilité est supprimé. L’application utilise une langue active choisie dans un menu déroulant. Le [guide de démarrage](start.fr.md) décrit le clonage du dépôt et l’installation. La référence Excel n’est pas incluse dans le dépôt et doit être placée sous `temp/Potentialvergleich_v7.xlsx` pour la première installation.

Le [catalogue](../data/catalog-i18n.json) comprend 35 nœuds, cinq nœuds cibles, 121 descriptions complètes des indicateurs issues des notes de cellule et six scénarios en DE/FR/IT. Le nombre reste modifiable dans l’outil. Les auteurs des commentaires et les autres blocs d’acteurs ne sont pas repris. Le [glossaire](glossar.fr.md) explique 32 termes du règlement et du modèle, notamment la distinction milieu / environnement et la dénomination obligatoire **Domaines opérationnels**.

La vérification antérieure de l’inventaire et des formules v3 contre v7 est documentée dans le concept comme état historique. Elle ne constitue pas un test du code applicatif. Le guide de démarrage décrit les vérifications applicatives réellement exécutées et les limites restantes. Les fichiers de travail sous `temp/`, la configuration locale et les exportations générées restent exclus de Git.

La [notice de transparence](konzept.fr.md#llm-transparency) explique l’utilisation de LLM pour la génération du code et la recherche des données d’exemple initiales, ainsi que la vérification nécessaire des sources originales.

## Italiano

La versione 0.1 è realizzata. Il concetto collega la logica funzionale v7 alle decisioni di prodotto confermate: utilizzo multiutente avviabile localmente, diritti verificati sul server, struttura dinamica del modello, scambio JSON, esempio USA rimovibile e vista di contrasto aggiuntiva attorno a 3. La correzione di plausibilità viene eliminata. L’applicazione utilizza una lingua attiva scelta dal menu a discesa. La [guida di avvio](start.it.md) descrive la clonazione del repository e la configurazione. Il riferimento Excel non è incluso nel repository e deve essere collocato in `temp/Potentialvergleich_v7.xlsx` per la prima configurazione.

Il [catalogo](../data/catalog-i18n.json) comprende 35 nodi, cinque nodi obiettivo, 121 descrizioni complete degli indicatori tratte dalle note delle celle e sei scenari in DE/FR/IT. Il numero rimane modificabile nello strumento. Autori dei commenti e altri blocchi di attori non vengono ripresi. Il [glossario](glossar.it.md) spiega 32 termini del regolamento e del modello, tra cui la distinzione ambiente / contesto e la denominazione vincolante **Domini operativi**.

La precedente verifica dell’inventario e delle formule v3 rispetto a v7 è documentata nel concetto come stato storico. Non costituisce un test del codice applicativo. La guida di avvio descrive le verifiche applicative effettivamente eseguite e i limiti rimanenti. File di lavoro sotto `temp/`, configurazione locale ed esportazioni generate rimangono esclusi da Git.

La [nota di trasparenza](konzept.it.md#llm-transparency) spiega l’utilizzo di LLM per generare il codice e ricercare i dati di esempio iniziali, insieme alla necessaria verifica delle fonti originali.
