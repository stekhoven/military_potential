# Glossaire de l’outil de comparaison du potentiel militaire

[Deutsch](glossar.de.md) · [Français](glossar.fr.md) · [Italiano](glossar.it.md) · [Documentation](README.md)

État : 16 octobre 2026. Code source : [stekhoven/military_potential](https://github.com/stekhoven/military_potential).

## Utilisation et sources

La [notice de transparence du concept](konzept.fr.md#llm-transparency) explique l’utilisation de LLM pour générer le code et rechercher les données d’exemple initiales. Les références au règlement et les termes du modèle restent identifiés séparément.

Le glossaire associe la terminologie des trois versions fournies du règlement 50.041, état au 1er octobre 2019, aux termes propres au modèle du projet. Les définitions réglementaires sont reformulées. Les références indiquent d’abord la page du PDF, puis la page imprimée ; la pagination diffère selon la version linguistique.

Les termes du modèle décrivent leur sens dans l’outil. Ils ne revendiquent pas de définition réglementaire. En particulier, **Domaines opérationnels** est une désignation imposée pour le modèle ; elle n’est pas assimilée au terme réglementaire **espace d’opération**.

L’interface affiche une seule langue, choisie dans un menu déroulant : Deutsch, Français ou Italiano. Les identifiants du glossaire ci-dessous relient les versions linguistiques. Les identifiants techniques des indicateurs, des nœuds et des relations restent inchangés lors d’un changement de langue ou de nom. Les noms traduits sont des libellés d’affichage.

## Termes attestés dans le règlement

| Identifiant du glossaire | Deutsch | Français | Italiano | Sens et référence |
| --- | --- | --- | --- | --- |
| `actor` | Akteur | Acteur | Attore | Personne, groupe ou organisation qui agit. Dans l’outil, unité dont le potentiel est évalué et comparé. [Règlement 50.041 f, page PDF 9 / page imprimée 1](50_041_f-BFA17.pdf#page=9). |
| `environment` | Umwelt | Milieu | Ambiente | Le terme réglementaire comprend le terrain, les conditions météorologiques, le moment de la journée, la saison et la population. Le domaine du modèle portant ce nom est précisé par ses indicateurs. [Règlement, page PDF 35 / page imprimée 27](50_041_f-BFA17.pdf#page=35). |
| `context` | Umfeld | Environnement | Contesto | Ensemble plus large comprenant les acteurs des différents domaines de la société et le milieu. **Environnement** et **milieu** restent deux termes distincts. [Règlement, page PDF 27 / page imprimée 19](50_041_f-BFA17.pdf#page=27). |
| `effect` | Wirkung | Effet | Effetto | Résultat d’actes ou de mesures militaires ou non militaires ; il peut être direct ou indirect, intentionnel ou non. Dans le modèle, un effet représente une hypothèse métier sur une relation. [Règlement, page PDF 25 / page imprimée 17](50_041_f-BFA17.pdf#page=25). |
| `operations_area` | Operationsraum | Espace d’opération | Spazio delle operazioni | Domaine de responsabilité spatiale d’un commandant opératif. Le terme sert à distinguer les notions ; le groupe du modèle est nommé **Domaines opérationnels**. [Règlement, page PDF 27 / page imprimée 19](50_041_f-BFA17.pdf#page=27). |

## Termes propres au modèle du projet

| Identifiant du glossaire | Deutsch | Français | Italiano | Définition dans l’outil |
| --- | --- | --- | --- | --- |
| `operational_domains` | Operative Domänen | Domaines opérationnels | Domini operativi | Groupe du modèle réunissant les nœuds organisés par domaine. Cette désignation suit la consigne du projet ; elle ne prétend pas être un équivalent réglementaire d’espace d’opération. |
| `node` | Knoten | Nœud | Nodo | Élément du réseau d’effets possédant un identifiant unique. Un nœud évalué regroupe les indicateurs qui lui sont affectés ; ses relations décrivent les effets supposés sur d’autres nœuds. |
| `indicator` | Indikator | Indicateur | Indicatore | Objet d’évaluation défini et affecté à un nœud. Il possède un identifiant stable, une description métier, un poids et des données propres à chaque acteur. |
| `target_node` | Zielknoten | Nœud cible | Nodo obiettivo | Nœud de sortie qui regroupe les effets du réseau et représente un facteur de potentiel. Il se distingue d’un nœud évalué disposant de ses propres indicateurs. |
| `potential_factor` | Potenzialfaktor | Facteur de potentiel | Fattore di potenziale | Dimension du potentiel militaire dérivée du réseau d’effets. Elle est présentée comme le résultat d’un nœud cible et possède un poids de scénario. |
| `will_to_fight` | Kampfwille | Volonté de combattre | Volontà di combattere | Désignation du modèle pour la disposition d’un acteur à engager et à poursuivre un combat. Le facteur de potentiel est dérivé des relations d’effet qui lui sont affectées. Les désignations française et italienne sont des traductions du projet ; aucune entrée correspondante univoque n’a été attestée dans les règlements fournis. |
| `overall_potential` | Gesamtpotenzial | Potentiel global | Potenziale complessivo | Résultat regroupant les facteurs de potentiel selon les poids du scénario sélectionné. C’est une grandeur de comparaison dépendant du modèle, sans être une grandeur physique mesurée indépendamment. |
| `assessment` | Bewertung | Évaluation | Valutazione | Saisie métier concernant un indicateur pour un acteur et une échéance, sur l’échelle du modèle de 1 à 5. Une valeur plus élevée est plus favorable à l’acteur considéré. Une évaluation absente reste enregistrée et signalée comme manquante ; une valeur de remplacement utilisée dans le calcul ne constitue pas une saisie. |
| `reliability` | Verlässlichkeit | Fiabilité | Attendibilità | Information de qualité comportant deux dimensions distinctes : A–C caractérise la source, 1–3 l’information. Leur combinaison donne notamment A1 ou B2. L’explication des catégories suit l’aide validée du modèle. La fiabilité ne modifie pas la valeur du potentiel et n’est pas interprétée comme une probabilité. Les données manquantes ont leur propre statut. |
| `source_note` | Bemerkung / Quelle | Remarque / source | Osservazione / fonte | Justification métier et origine d’une évaluation, avec référence précise ou lien si nécessaire. La référence documente l’élément justificatif ; la fiabilité en évalue la qualité. |
| `weight` | Gewicht | Poids | Peso | Paramètre qui détermine la part relative d’une grandeur dans une agrégation. Les poids des indicateurs au sein d’un nœud et les poids de scénario des facteurs de potentiel constituent deux niveaux distincts. Un poids de 0 désactive la contribution concernée. |
| `relation` | Wirkungsbeziehung | Relation d’effet | Relazione d’effetto | Hypothèse orientée du modèle reliant un nœud source à un nœud destination. Elle comporte un signe, une intensité et un horizon d’effet. Le signe indique le sens de l’effet modélisé, sans porter de jugement sur le nœud source. |
| `leverage` | Hebel | Levier | Leva | Coefficient d’effet normalisé et signé d’un nœud envers un nœud cible donné, compte tenu des effets directs et indirects. Il est indépendant de l’évaluation. Une contribution effective ne résulte que de son association avec l’évaluation ou sa variation. Un même nœud peut avoir des leviers différents selon le nœud cible. |
| `influence` | Einfluss | Influence | Influenza | Valeur absolue du levier envers un nœud cible donné. Elle décrit l’intensité du lien d’effet modélisé sans son signe, indépendamment de l’évaluation. Elle se distingue de l’intensité directe d’une relation isolée. |
| `controllability` | Lenkbarkeit | Contrôlabilité | Controllabilità | Information du modèle sur la mesure dans laquelle il est possible d’agir intentionnellement sur un nœud : contrôlable, contrôlable sous conditions ou non contrôlable. Elle est distincte de l’influence et de l’évaluation. |
| `scenario` | Szenario | Scénario | Scenario | Ensemble nommé d’hypothèses et de pondérations du modèle, rattaché à une version du modèle. Il est géré séparément des évaluations d’un acteur. Les situations de menace prédéfinies sont des scénarios ; le analyste en chef gère également les nouvelles variantes. |
| `time_horizon` | Fristigkeit K / M / L | Horizon d’effet K / M / L | Orizzonte d’effetto K / M / L | Catégorie d’une relation : K pour le court terme, M pour le moyen terme, L pour le long terme. Les codes techniques sont identiques dans toutes les langues. La prise en compte des catégories suit la règle de calcul validée. Un pas dans le réseau ne constitue pas une durée calendaire à additionner. |
| `time_point` | Zeitpunkt | Échéance | Momento di riferimento | Repère temporel d’une évaluation ou d’un résultat, notamment aujourd’hui, dans cinq ans ou dans dix ans. L’échéance se distingue de l’horizon d’effet d’une relation. |
| `trend` | Trend | Tendance | Tendenza | Direction de l’évolution dérivée des valeurs du modèle entre des échéances explicitement indiquées. La référence, l’échéance cible et l’écart restent visibles. Une tendance ne constitue ni une mesure supplémentaire ni une prévision autonome. |
| `derivation` | Herleitung | Justification | Derivazione | Présentation traçable indiquant quels nœuds et indicateurs contribuent au résultat sélectionné et de quelle manière. Elle précise l’acteur, le scénario, l’échéance et l’état utilisé et distingue les saisies, les contributions calculées et les éventuelles bornes appliquées. |
| `model_version` | Modellversion | Version du modèle | Versione del modello | État identifié de la structure du modèle et des règles de calcul. Un résultat fait également référence au scénario et à l’état des évaluations utilisé. Les résultats antérieurs doivent rester identifiables après modification d’indicateurs ou de nœuds. |
| `raw_value` | Rohwert | Valeur brute | Valore grezzo | Valeur cible calculée avant le bornage à 1–5 et la transformation de contraste. La valeur officielle initiale du modèle est la valeur brute bornée à 1–5. Les deux restent traçables. |
| `contrast_view` | Kontrastansicht | Vue de contraste | Vista di contrasto | Vue supplémentaire explicitement identifiée des résultats avec `min(5, max(1, 3 + g × (valeur brute − 3)))`. Elle accentue les écarts à la valeur neutre sans modifier les saisies ni le calcul du réseau. Le potentiel global de contraste est calculé séparément par pondération des valeurs cibles de contraste bornées. |
| `contrast_factor` | Spreizungsfaktor g | Facteur d’amplification g | Fattore di amplificazione g | Paramètre de scénario versionné géré uniquement par le analyste en chef. Valeur par défaut 1, première variante de comparaison 1.25. Dans un scénario, le même facteur s’applique à tous les nœuds cibles, acteurs et échéances. |
| `format_version` | Formatversion | Version du format | Versione del formato | Identifiant de la structure d’échange JSON prise en charge. À distinguer des versions du modèle et du scénario. L’importation vérifie structure, valeurs et références avant l’enregistrement complet. |
| `example_actor` | Beispielakteur | Acteur d’exemple | Attore di esempio | Ensemble identifié et supprimable des valeurs d’exemple USA autorisées. Après suppression, il n’est pas automatiquement recréé au redémarrage. |
| `write_conflict` | Schreibkonflikt | Conflit d’écriture | Conflitto di scrittura | Modification simultanée d’un enregistrement dont la version stockée a changé depuis son ouverture. Le serveur empêche tout écrasement silencieux et signale le conflit ; les propres saisies non enregistrées sont conservées. |

## Règles rédactionnelles

- Employer les mêmes termes dans les libellés, les aides et la documentation. Éviter les confusions entre milieu et environnement ainsi qu’entre Domaines opérationnels et espace d’opération.
- Pour les autres termes métier, consulter d’abord la version linguistique correspondante du règlement. Si l’équivalence manque ou diffère, expliquer le terme propre au projet sans prétendre à une équivalence réglementaire.
- Maintenir les traductions ensemble. Le glossaire ne traduit pas automatiquement les évaluations, les contenus des sources ou les autres saisies métier.
- Afficher uniquement la langue sélectionnée dans l’outil. Les colonnes linguistiques parallèles du glossaire servent à la concordance terminologique.
