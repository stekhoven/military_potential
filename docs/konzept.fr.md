# Concept fonctionnel de l’outil de comparaison du potentiel militaire

[Deutsch](konzept.de.md) · [Français](konzept.fr.md) · [Italiano](konzept.it.md) · [Glossaire](glossar.fr.md) · [Documentation](README.md)

État : 16 octobre 2026. La référence métier est `temp/Potentialvergleich_v7.xlsx` ; v3 reste disponible localement comme état de comparaison. La version 0.1 de l’application multiutilisateur démarrable localement est réalisée. Elle suit les consignes d’AGENTS.md et les exigences confirmées ci-dessous. Ce concept tient compte des décisions confirmées D1 à D9 et de la suppression de l’ajustement de plausibilité dans l’outil, confirmée ultérieurement.

Le dépôt du code source est [stekhoven/military_potential sur GitHub](https://github.com/stekhoven/military_potential). Les fichiers de travail Excel, la configuration locale, les bases et les exportations générées restent exclus de Git. Le fichier v7 autorisé doit être fourni localement pour la première installation ; le [guide de démarrage](start.fr.md) décrit la procédure.

<a id="llm-transparency"></a>

## Transparence sur l’utilisation de LLM

Des grands modèles de langage (Large Language Models, LLM) ont été utilisés pour générer le code applicatif et rechercher les données d’exemple initiales concernant les USA. Les valeurs d’exemple servent à la démonstration et ne constituent pas une affirmation vérifiée sur les capacités militaires réelles.

Avant une utilisation métier, l’analyste responsable vérifie les sources originales, leur actualité, les évaluations et la fiabilité. Les tests logiciels documentés vérifient les calculs et le comportement de l’application ; ils ne confirment pas l’exactitude factuelle des données recherchées ni des hypothèses du modèle.

## 1 Objectif et exigences confirmées

L’outil reprend les fonctionnalités, la nomenclature et les règles de calcul du modèle vérifié. Les analystes modifient les évaluations, la fiabilité, les hypothèses futures et les remarques ou les sources. Les analystes en chef gèrent également la structure du modèle, les indicateurs, les nœuds cibles, les relations d’effet, les pondérations et les scénarios. Les vues facilitent une évaluation traçable et la comparaison de plusieurs acteurs.

La dénomination allemande obligatoire est **Operative Domänen**. La version française utilise **Domaines opérationnels**, la version italienne **Domini operativi**. Les identifiants techniques sont conservés lors des changements de nom et des traductions. Les termes réglementaires suivent les trois versions fournies du règlement 50.041 ; les termes propres au modèle sont expliqués dans le [glossaire](glossar.fr.md).

L’interface affiche **une seule langue** à la fois. Le menu déroulant propose **Deutsch**, **Français** et **Italiano**. Un changement de langue conserve la sélection, les saisies et les résultats. L’application est démarrée localement et prend en charge plusieurs utilisateurs avec authentification, stockage centralisé et droits associés aux rôles vérifiés sur le serveur.

Le design est sobre et moderne : couleurs calmes, typographie claire, formulaires compréhensibles et mises en évidence ciblées. Le contenu métier du fichier Excel est repris dans des vues autonomes et faciles à utiliser.

## 2 Inventaire et correspondance des sources de v7

| Élément | Contenu du prototype | Reprise |
| --- | --- | --- |
| Indicateurs | 121 identifiants uniques | Toutes les définitions et affectations aux nœuds ; exclure les titres et les lignes de réserve. |
| Nœuds évalués | 35 | PMESII, milieu et sept Domaines opérationnels. |
| Facteurs de potentiel | 5 nœuds cibles | X1 Personnel, X2 Matériel, X3 Commandement et instruction, X4 Capacité à durer, X5 Volonté de combattre. |
| Relations d’effet | 136 | Conserver la source, la cible, l’intensité, le signe et l’horizon d’effet. |
| Scénarios | 6 modèles prédéfinis renseignés | Reprendre les noms, les hypothèses et les poids des facteurs ; le analyste en chef peut créer, modifier et supprimer des scénarios. |
| Acteurs et échéances | 4 groupes de saisie préparés ; aujourd’hui, dans 5 ans, dans 10 ans | Gérer les évaluations des acteurs séparément du modèle. |

Ces chiffres décrivent le contenu importé. L’application prend en charge un nombre variable d’indicateurs, de nœuds, de nœuds cibles et de scénarios. Les ajouts mettent à jour de manière cohérente les calculs, les tableaux, les diagrammes et le réseau. Les autres évaluations confidentielles, noms d’acteurs et remarques sur les sources restent exclus de la documentation du projet et du contrôle de version. Les valeurs USA expressément autorisées constituent la seule exception, sous forme d’ensemble d’exemple identifié et supprimable.

### Feuilles de calcul et saisies

| Source Excel | Contenu et reprise |
| --- | --- |
| `Anleitung!A1:B23` | Règles métier, introduction et aides. |
| `Bewertung!A4:E149` | Identifiant, groupe, identifiant du nœud, noms du nœud et de l’indicateur ; uniquement les lignes d’indicateurs renseignées. |
| Notes de cellule de `Bewertung!E5:E149` | Lire les 121 définitions complètes dans les composants de commentaires, et non uniquement les titres visibles des cellules. Les auteurs des commentaires ne sont pas repris. |
| `Bewertung!F3:Y149` | Quatre groupes d’acteurs avec valeurs actuelles, fiabilité, valeurs futures et remarque / source. |
| `Modell!A4:I18` | Zone des scénarios ; les lignes 5 à 10 sont renseignées. A numéro, B nom, C hypothèse, E à I poids des facteurs. |
| `Modell!A23:D57` | Catalogue des nœuds : A identifiant, B nom, C groupe, D contrôlabilité. |
| `Modell!E21:AR22` et `E23:AR57` | Libellés cibles, identifiants cibles et matrice d’effets orientée ; la ligne agit sur la colonne. |
| `Modell!A61:E197` | Poids des indicateurs avec justification / source ; identifiants renseignés dans les lignes 62 à 182. |
| `Modell!D202` et `D204` | Seuils configurables de l’indicateur de qualité des données à trois couleurs ; le libellé intermédiaire de D203 est dérivé. |
| `Berechnung!A1:AW976` | Étapes de calcul et valeurs de comparaison enregistrées. |
| `Übersicht!B1:R48` | Valeurs des nœuds de plusieurs acteurs aux trois échéances avec tendance. |
| `Herleitung!B1:O49` | Calcul, composition, contributions des nœuds, indications de qualité et détails des indicateurs. |
| `Auswertung!B1:T40` | Analyse compacte de plusieurs acteurs ; scénario en D3, échéance en L3. |

| Champ de Bewertung | Acteur 1 | Acteur 2 | Acteur 3 | Acteur 4 |
| --- | --- | --- | --- | --- |
| Nom | F3 | K3 | P3 | U3 |
| Évaluation actuelle | F | K | P | U |
| Fiabilité | G | L | Q | V |
| Évaluation dans 5 ans | H | M | R | W |
| Évaluation dans 10 ans | I | N | S | X |
| Remarque / source | J | O | T | Y |

Les poids des indicateurs sont associés par identifiant depuis `Modell!A62:D197`. La position actuelle de la ligne est une référence à la source, et non une clé permanente. L’importation lit également les validations étendues x14 pour l’affectation aux nœuds et la sélection des acteurs. Les notes de source et les remarques sont traitées comme des données.

| Saisie | Domaine autorisé |
| --- | --- |
| Évaluations actuelles et futures | Nombres entiers de 1 à 5 ; l’absence est un état distinct. Les valeurs futures sont des évaluations absolues. |
| Poids d’un indicateur | Nombre décimal de 0 à 10 ; 0 désactive l’indicateur. |
| Fiabilité | A1, A2, A3, B1, B2, B3, C1, C2 ou C3 ; absence traitée séparément. |
| Effet | ±1, ±2 ou ±3 avec K, M ou L ; l’absence de relation est un état vide distinct. |
| Poids d’un facteur | Nombre entier de 0 à 3. |
| Contrôlabilité | Contrôlable, contrôlable sous conditions ou non contrôlable. |
| Seuils de qualité des données | Valeurs de 0 à 1 ; le seuil inférieur est plus petit que le seuil supérieur. |

### Plages de calcul

Toutes les plages suivantes appartiennent à la feuille `Berechnung`.

| Plage | Fonction |
| --- | --- |
| A52:AN196 | Valeurs des indicateurs et association des poids. |
| AQ50:AW54 | Complétude, fiabilité et part incertaine. |
| A201:AE236 | Valeurs directes des nœuds, variations et valeurs des nœuds avec effets consécutifs. |
| C242:AP281; C282 | Matrice d’effet direct D et facteur de normalisation s. |
| C285:AP324 | Matrice des horizons d’effet. |
| C328:AP367 | N. |
| C371:AP410, C414:AP453, C457:AP496 | N², N³ et N⁴. |
| C500:AP539 | Effet total T. |
| C543:AP582 | N₅ sans relations L. |
| C586:AP625, C629:AP668, C672:AP711 | N₅², N₅³ et N₅⁴. |
| C715:AP754 | Effet total T₅. |
| A759:AB794 | Rôle, influence, levier et contrôlabilité. |
| A799:AD805 | Facteurs de potentiel et potentiel global de tous les acteurs et échéances. |
| A877:L912 | Contributions actuelles des nœuds et contributions aux variations. |
| A915:B919 | Parts des quatre itérations d’effet. |
| A923:E937 | Comparaison des acteurs et évolution temporelle. |
| A941:J976 | Déterminants à dix ans pour chaque acteur. |

## 3 Comparaison de v3 et v7

Les 121 identifiants d’indicateurs et leurs affectations aux nœuds, les 35 nœuds évalués, les identifiants cibles X1 à X5, les 136 relations d’effet ainsi que les poids valides des indicateurs et des scénarios restent inchangés. Les définitions des 121 notes de cellule sont également conservées ; v7 fait précéder le texte existant par le titre de l’indicateur.

| Changement | Conséquence pour l’outil |
| --- | --- |
| Analyse compacte avec acteurs côte à côte | Scénario et échéance communs ; valeurs de comparaison claires, évolution, qualité des données et constats principaux. |
| Nouvelles feuilles Übersicht et Herleitung | Proposer les valeurs des nœuds avec échéances et tendance ainsi qu’une explication vérifiable jusqu’à l’indicateur. |
| Suppression de la carte de situation | La carte de situation Excel n’est pas reproduite. La vue réseau interactive autonome reste une exigence confirmée de l’outil. |
| Suppression de l’ajustement de plausibilité | Également supprimé de l’outil après confirmation explicite ; aucune correction manuelle des résultats ni champ de saisie correspondant. |
| Poids des indicateurs dans le modèle | Séparer la modification par le analyste en chef de l’évaluation ; association par identifiants. |
| Nouveaux noms des facteurs de potentiel | Reprendre les dénominations métier de v7 et les traduire comme des termes du modèle. |
| Indicateur de qualité configurable | Présenter la qualité des sources séparément des valeurs de potentiel ; gérer les seuils comme des paramètres du modèle. |
| Liste de scénarios délimitée | Le débordement antérieur de la liste de sélection dans le catalogue des nœuds est corrigé dans v7. |

Le calcul central est conservé. Les différences entre les formules centrales comparées concernent la nouvelle source des poids, la suppression de la fonction de correction et les dénominateurs de complétude. Les particularités d’Excel ne remplacent pas les décisions produit confirmées lors de la reprise.

## 4 Règles de calcul et explicabilité

1. La valeur d’un nœud est la moyenne pondérée des évaluations d’indicateurs disponibles. Les évaluations manquantes restent manquantes ; un poids de 0 exclut l’indicateur. En l’absence de données pondérées exploitables, le nœud utilise la valeur neutre 3 dans le calcul et est visiblement signalé comme non étayé.
2. Les évaluations actuelles manquantes sont exclues du calcul même si les champs futurs sont renseignés. Une valeur à cinq ans laissée vide reprend la valeur actuelle ; une valeur à dix ans laissée vide reprend la valeur effective à cinq ans. Ce comportement est expliqué lors de la saisie.
3. `s = max(max_i Σ_j |D_ij|, max_j Σ_i |D_ij|)` ; `N = D / s` ; `T = N + N² + N³ + N⁴`. Les quatre itérations représentent des étapes d’effet. Les durées calendaires le long d’un chemin ne sont pas additionnées. Les chemins opposés peuvent se compenser.
4. Les potentiels actuels utilisent tous les horizons d’effet. Pour les variations à cinq ans, les relations L sont supprimées avant le calcul des puissances. Le facteur de normalisation s et le dénominateur du levier restent rapportés au réseau complet. Les variations à dix ans utilisent T.
5. Pour la cible j, `q_j = Σ_i |T_ij|`, `h_ij = T_ij / q_j` et l’influence vaut `|h_ij|`. Le facteur brut actuel est `3 + Σ_i h_ij × (x_i − 3)`. Les facteurs futurs partent du facteur brut actuel et utilisent les variations directes des nœuds : `Δx5 = x5 − xheute` et `Δx10 = x10 − xheute`.
6. Les valeurs des nœuds incluant les effets consécutifs propagés sont calculées séparément et ne sont pas réintroduites comme saisies directes dans les potentiels futurs. Les facteurs de potentiel affichés sont bornés entre 1 et 5. Le potentiel global est la moyenne pondérée de ces facteurs bornés.
7. La fiabilité ne modifie aucune valeur de potentiel. Le vert correspond à A1, A2 et B1, le jaune à B2, le rouge à une source C ou à un niveau d’information 3. La fiabilité manquante est affichée séparément. L’indicateur de qualité d’un acteur ou d’un nœud représente la part incertaine selon les seuils configurés ; sans indication de qualité, son état est inconnu.
8. La complétude est la part des indicateurs actifs évalués parmi tous les indicateurs actifs. Les indicateurs désactivés sont comptés séparément. Sans indicateur actif, aucun pourcentage n’est affiché. Cette règle applique la correction D9 confirmée.
9. Lorsque les conditions nécessaires manquent, par exemple facteur de normalisation 0, somme des poids des facteurs 0 ou cible inaccessible, la valeur concernée est signalée comme non calculable. Aucune division par zéro ni valeur de remplacement silencieuse n’est utilisée dans ces cas. Les autres parties calculables restent accessibles.
10. Les identifiants inconnus ou en double sont signalés à l’importation. Le remplacement silencieux par 1 utilisé dans Excel lorsqu’une recherche de poids échoue n’est pas repris.

### Justification

La justification relie le calcul à tous les nœuds contributeurs et à leurs indicateurs. Pour chaque nœud, la valeur, l’influence, le levier signé, la contribution, la pondération, la fiabilité et les justificatifs sont accessibles. Les définitions complètes des indicateurs apparaissent comme aide de champ ou dans le panneau de détails.

La justification du facteur actuel et celle de la variation du potentiel global se rapportent à des grandeurs différentes ; celles-ci sont explicitement identifiées. Les justifications des facteurs futurs individuels sont dérivées des mêmes règles de calcul et validées séparément. Le diagramme distingue la valeur brute, le bornage et la valeur finale. Si les contributions principales sont sélectionnées, le reste est indiqué.

Les mots soutient et freine suivent le signe réel de la contribution. Une contribution positive relativement plus petite n’est pas une contribution défavorable. Les données manquantes restent visibles même lorsqu’une valeur neutre est utilisée dans le calcul. Les effets du modèle sont expliqués comme des hypothèses.

### Vue de contraste après le calcul du réseau

Le calcul officiel et les valeurs initiales du modèle sont conservés. La vue de contraste supplémentaire amplifie l’écart des valeurs cibles brutes déjà calculées autour de la valeur neutre 3 :

`contrast_value = min(5, max(1, 3 + g * (raw_value - 3)))`

La valeur par défaut est `g = 1` ; `g = 1.25` est la première variante de comparaison. À `g = 1`, la vue de contraste correspond à la valeur cible initiale bornée à 1–5. Le analyste en chef gère g comme paramètre de scénario versionné. Le même facteur s’applique à tous les nœuds cibles, acteurs et échéances du scénario. La justification présente la valeur brute, la valeur initiale bornée du modèle, g, la transformation non bornée, la valeur de contraste et tout bornage. Le potentiel global de contraste, libellé séparément, est la moyenne pondérée des valeurs cibles de contraste déjà bornées.

Les saisies, la fiabilité, l’intensité des arêtes, les quatre itérations du réseau et la logique temporelle ne changent pas. L’exponentiation des arêtes discutée précédemment ne fait pas partie de la version 0.1. La vue de contraste n’est pas un ajustement de plausibilité supplémentaire et ne remplace pas les valeurs officielles. Les comparaisons indiquent visiblement leur base commune de scénario et de contraste.

## 5 Rôles, modifications et versions

| Activité | Analyste | Analyste en chef |
| --- | --- | --- |
| Modifier les évaluations, la fiabilité, les valeurs futures et la remarque / source | Oui | Oui |
| Créer, renommer et supprimer les acteurs ordinaires | Oui | Oui |
| Examiner l’analyse, la justification, la vue d’ensemble et le réseau | Oui | Oui |
| Modifier les poids, les intensités d’effet, les horizons d’effet et la contrôlabilité | Non | Oui |
| Gérer les indicateurs et la structure des nœuds | Non | Oui |
| Modifier, ajouter et supprimer des nœuds cibles | Non | Oui |
| Créer, modifier et supprimer des scénarios, y compris les modèles prédéfinis | Non | Oui |
| Modifier les seuils de l’indicateur de qualité des données | Non | Oui |
| Gérer le facteur de contraste g, importer des modèles / scénarios et supprimer l’acteur d’exemple | Non | Oui |
| Exporter en JSON et importer des évaluations | Oui | Oui |

L’authentification et les droits d’écriture sont vérifiés sur le serveur. Le rôle provient du compte utilisateur. La gestion de la structure exige des identifiants stables, des définitions, une affectation aux groupes et des relations d’effet cohérentes. Les poids de scénario des nouveaux nœuds cibles sont définis explicitement ; les modèles incomplets sont visiblement signalés.

Toute modification d’une version enregistrée du modèle ou d’un scénario crée une nouvelle version. La suppression s’applique au nouvel état. Les évaluations et analyses antérieures conservent leurs références et restent traçables. Les données d’évaluation, les paramètres du modèle et les hypothèses de scénario restent séparés. Un changement de nom seul ne crée pas de nouvel identifiant métier.

Les comparaisons communes entre acteurs utilisent le même scénario et la même échéance. Le rattachement d’une version de scénario à la version du modèle reste explicite. Deux modifications simultanées du même enregistrement ne doivent pas s’écraser silencieusement : l’application signale le conflit, conserve les saisies de l’utilisateur et permet un rapprochement explicite.

## 6 Vues et présentation

La navigation donne accès à la vue d’ensemble du travail, aux évaluations, à l’analyse, à la vue d’ensemble des nœuds, à la justification, au réseau ainsi qu’au modèle et aux scénarios. Le contexte de sélection, les filtres et les saisies non enregistrées sont conservés lors des changements de vue et de langue. Un état d’enregistrement visible distingue les modifications non enregistrées, l’enregistrement réussi et les erreurs.

| Vue | Utilisation et contenu |
| --- | --- |
| Vue d’ensemble du travail | Repérer les lacunes de complétude et de qualité, puis accéder directement à la modification filtrée. |
| Évaluations | Naviguer par groupe et par nœud ; rechercher des indicateurs ; modifier ensemble l’évaluation, la fiabilité, les valeurs futures et les justificatifs. |
| Analyse | Comparer plusieurs acteurs côte à côte selon le potentiel global, le rang, les facteurs de potentiel et la qualité des données ; ouvrir de manière ciblée l’évolution et les constats principaux. |
| Vue d’ensemble des nœuds | Développer les groupes ; comparer les valeurs de tous les acteurs sélectionnés aujourd’hui, dans 5 ans et dans 10 ans avec leur tendance. |
| Justification | Choisir l’acteur et le nœud cible ; examiner le calcul, les contributions, la qualité et les indicateurs. Tous les nœuds restent accessibles ; les trois nœuds mis en évidence ne constituent pas une limite. |
| Réseau | Examiner les relations orientées d’un acteur sélectionné ; filtrer par groupe, intensité, signe et horizon d’effet. |
| Modèle et scénarios | Le analyste en chef modifie les paramètres et la structure, crée des variantes et vérifie leurs conséquences. |

La tendance de v7 porte sur la période d’aujourd’hui à dans 10 ans, indépendamment de l’échéance sélectionnée. La période de référence et la bande neutre de ±0.05 restent visibles. Les diagrammes présentent les trois échéances existantes ; aucune prévision intermédiaire supplémentaire n’est inventée sans modèle temporel propre.

Le réseau contient les nœuds et nœuds cibles valides pour l’état sélectionné. Les filtres modifient uniquement la représentation. Une fenêtre contextuelle ou un panneau pouvant être épinglé présente la définition, les valeurs, les indications de qualité, les indicateurs, les sources, le rôle, l’influence, le levier et la contrôlabilité. Les relations entrantes et sortantes peuvent être mises en évidence. Le détail des arêtes indique la source, la cible, l’intensité et l’horizon d’effet.

Les couleurs d’évaluation et les indications de qualité restent distinctes ; des flèches, des signes, des libellés et des types de lignes complètent la couleur. Les diagrammes possèdent des alternatives tabulaires. Les formulaires, les listes de nœuds et les vues détaillées sont accessibles au clavier. Une saisie incorrecte ou un échec d’enregistrement ne supprime aucun travail.

### Esquisses des vues

```text
ÉVALUATIONS
[Acteur ▾] [Groupe / nœud ▾] [Recherche / filtres]                [Français ▾]
Indicateur et définition | Aujourd’hui | Fiabilité | 5 ans | 10 ans
Remarque / source       [                                      ]
État d’enregistrement   [Enregistrer les modifications]
```

```text
ANALYSE
[Sélectionner les acteurs ▾] [Scénario ▾] [Échéance ▾]             [Français ▾]
                        Acteur A             Acteur B
Potentiel global        <Valeur>             <Valeur>
Facteurs de potentiel   <Barres comparatives et valeurs>
Qualité / renseigné     <État>               <État>
Tendance actuel → 10 ans <Tendance>          <Tendance>
[Évolution] [Vue d’ensemble des nœuds] [Ouvrir la justification]
```

```text
JUSTIFICATION ET RÉSEAU
[Acteur ▾] [Nœud cible ▾] [Scénario ▾] [Échéance ▾]                [Français ▾]
Calcul / contributions ou réseau d’effets   Détails des nœuds à épingler
                                           Définition, évaluation et qualité
                                           Indicateurs, poids et sources
                                           Relations entrantes et sortantes
[Réinitialiser les filtres]                 [Vers l’évaluation]
```

## 7 Langue et terminologie

La navigation, les termes métier, les définitions du catalogue, les aides, les messages d’erreur, les diagrammes et les sorties apparaissent dans la langue sélectionnée. Les nombres et les dates suivent ce choix. Les remarques originales, les citations de sources et les liens restent dans leur langue de saisie. Un changement de langue ne déclenche ni enregistrement ni importation et ne modifie aucune valeur calculée.

Le glossaire distingue les termes attestés dans le règlement des termes définis pour le modèle. En particulier, Umwelt et Umfeld restent distincts. Umwelt correspond à milieu en français et à ambiente en italien ; Umfeld correspond à environnement et à contesto. Operative Domänen n’est pas assimilé sans vérification à Operationsraum. Les traductions de Kampfwille sont identifiées comme une terminologie du modèle propre au projet.

Les traductions du catalogue utilisent des clés communes et font l’objet d’un contrôle de complétude. Les nouveaux termes du modèle nécessitent les trois versions linguistiques. Le formulaire de modification affiche la langue sélectionnée et permet de repérer précisément les traductions manquantes.

## 8 Structure technique et importation

La version 0.1 utilise Python pour l’importation et le moteur de calcul, Django pour l’interface applicative, l’authentification et les rôles, React pour l’interface utilisateur et PostgreSQL pour le stockage centralisé. Une procédure de démarrage local documentée donne accès à l’application multiutilisateur dans le navigateur. L’environnement dispose de comptes utilisateurs locaux. Les versions utilisées sont consignées dans `requirements.txt` et `frontend/package-lock.json` ; `compose.yaml` fixe PostgreSQL 17.

| Composant | Contenu |
| --- | --- |
| Version du modèle | Catalogue, définitions, groupes, poids des indicateurs, effets, nœuds cibles, paramètres de qualité et clés de traduction. |
| Version du scénario | Référence du modèle, nom, hypothèses et, le cas échéant, paramètres du modèle différents ; poids des facteurs et facteur de contraste g. |
| État d’évaluation | Acteur, identifiant de l’indicateur, valeur actuelle, valeurs futures, fiabilité et remarque / source. |
| Résultat | Valeurs dérivées et contributions avec références au modèle, au scénario et à l’état d’évaluation. |
| Historique des versions | Rattachement des modifications au compte utilisateur et états antérieurs traçables ; aucune donnée de compte dans la documentation. |

L’importation, la validation, le calcul, le stockage et l’interface sont séparés. L’importation lit Excel comme source de données, y compris les notes de cellule et les validations étendues. Les macros, contenus incorporés et formules Excel ne sont pas exécutés. Les formules OOXML partagées sont correctement résolues pour la comparaison métier. Les résultats Excel enregistrés sont des valeurs de référence, et non un calcul de substitution.

Le nouveau fichier crée une version vérifiée du modèle. Les évaluations et sources existantes ne sont pas écrasées silencieusement ; les changements d’identifiants ou de sens exigent une correspondance explicite. Les fichiers de travail sous `temp/` restent exclus du contrôle de version. Les données de test sont synthétiques ou proviennent exclusivement de l’exemple USA expressément autorisé. Les fichiers Excel restent inchangés.

Les résultats faisant foi sont calculés sur le serveur à partir des états référencés. Le serveur vérifie les rôles, les valeurs saisies et la version de l’enregistrement modifié. Les modifications liées sont enregistrées de manière cohérente ; les conflits et erreurs sont présentés de façon compréhensible.

### Exemple supprimable et échange JSON

Les valeurs USA expressément autorisées sont proposées comme acteur d’exemple identifié. Un analyste en chef peut supprimer cet acteur ; les redémarrages ne le recréent pas automatiquement. L’importation ne reprend ni les autres blocs d’acteurs ni les auteurs des commentaires. Les données personnelles et les autres contenus confidentiels restent exclus. L’exception concerne uniquement l’ensemble d’exemple autorisé.

JSON est le format d’échange. L’état complet actuel des saisies utilise `schema_version: "0.1"` avec les sections `model`, `scenarios` et `actors`. Le paramètre de scénario g est nommé `gain` dans le format d’échange. L’historique enregistré reste sur le serveur et ne fait pas partie de l’exportation des saisies. Une version explicite du format, des identifiants stables et les références du modèle et du scénario relient le catalogue, les paramètres et les évaluations. L’exportation comprend les évaluations, les champs futurs, la fiabilité, les remarques / sources, les traductions et g ; les valeurs dérivées sont recalculées à l’importation. Les données d’accès et les sessions ne font pas partie de l’exportation.

Le serveur vérifie le fichier entier avant toute écriture : types et plages de valeurs, identifiants, références et droits des rôles. Les importations de modèles et de scénarios sont réservées aux analystes en chef. Les erreurs provoquent l’annulation complète au lieu d’une importation partielle. Les enregistrements existants ne sont pas écrasés silencieusement ; un conflit est signalé. L’exportation suivie d’une réimportation préserve les saisies sans perte. Les fichiers Excel de travail, les bases locales et les exportations générées restent exclus du contrôle de version.

## 9 Décisions confirmées

| ID | Décision |
| --- | --- |
| D1 | Application multiutilisateur démarrée localement, avec authentification, stockage centralisé et droits associés aux rôles vérifiés sur le serveur. |
| D2 | Le analyste en chef peut modifier les poids, les effets, les horizons d’effet et la structure ainsi que gérer les indicateurs, les nœuds cibles et les scénarios. |
| D3 | Les valeurs manquantes restent visibles ; sans données exploitables, un nœud utilise la valeur neutre 3 dans le calcul. |
| D4 | La fiabilité reste une indication de qualité et ne modifie aucune valeur de potentiel. |
| D5 | La logique temporelle existante et la reprise des valeurs dans les champs futurs vides sont conservées. |
| D6 | Remplacée par v7 et la confirmation ultérieure : l’ajustement de plausibilité est entièrement supprimé, y compris dans l’outil. |
| D7 | Signaler visiblement les états non calculables ; aucune division par zéro. |
| D8 | Le analyste en chef peut créer, modifier et supprimer des scénarios, y compris ceux prédéfinis. |
| D9 | Calculer la complétude sur la même population d’indicateurs actifs ; sans indicateur actif, ne pas afficher de pourcentage. |

Aucune décision métier ne reste ouverte sur ces points. Une contradiction entre un fichier source ultérieur et les exigences produit confirmées fera l’objet d’une clarification ciblée. La publication de l’état actuel du code source dans le dépôt GitHub indiqué ci-dessus est expressément demandée. L’exploitation de l’application et les données de travail restent locales.

## 10 Réalisation et vérifications

La version 0.1 comprend l’importation v7 et le moteur de calcul indépendant, l’authentification et les rôles, le stockage centralisé avec détection des conflits, les évaluations, la comparaison multiacteur, la vue des nœuds, la justification et le réseau. La gestion par l’analyste en chef, les modifications dynamiques du modèle, l’échange JSON, l’exemple supprimable et la vue de contraste sont réalisés dans les trois langues. Le [guide de démarrage](start.fr.md#vérifications-et-limites) documente les vérifications applicatives exécutées et les limites restantes, séparément de la vérification Excel historique ci-dessous.

La vérification en lecture seule de l’inventaire et des formules de v3 à v7 a été effectuée au format ZIP/XML avec la bibliothèque standard de Python. Les 121 indicateurs, 35 nœuds évalués, 5 nœuds cibles, 136 relations et 6 scénarios ont été comparés. Les 121 notes de définition sont associées aux identifiants. Les 12 398 formules partagées ont toutes été résolues avant l’analyse.

Un calcul indépendant a vérifié 420 valeurs directes de nœuds et 60 facteurs de potentiel bruts par version. Les valeurs directes des nœuds correspondent exactement aux résultats v7 enregistrés ; l’écart des facteurs reste inférieur à `5 × 10⁻¹⁵`. Les facteurs bruts recalculés sont identiques entre les versions. Pour 4 800 valeurs matricielles de N, T et T₅, l’écart par rapport au cache v7 reste inférieur à `2 × 10⁻¹⁸`. Il s’agit d’une comparaison avec des résultats enregistrés, et non d’un recalcul complet par Excel.

Aucune valeur d’erreur de formule enregistrée ni référence résiduelle aux champs de correction supprimés n’a été trouvée dans les sept feuilles de v7. Aucune macro, aucun objet actif ou incorporé, aucune relation externe ni connexion de données n’a été trouvé. Rien n’a été exécuté.

| Critères de réception de l’application | Critère |
| --- | --- |
| Reprise complète | Tous les identifiants, relations, poids, définitions et scénarios renseignés sont associés une seule fois ; les lignes de réserve sont exclues. |
| Comparaison des calculs | Les valeurs des nœuds, les itérations du réseau, les facteurs, le potentiel global et les contributions correspondent aux cas de référence v7 dans les tolérances documentées. |
| Données manquantes ou non valides | Valeur neutre signalée comme non étayée ; identifiants inconnus signalés ; cas nuls, valeurs futures manquantes, effets négatifs et cycles vérifiés. |
| Explicabilité | Les contributions, le reste et le bornage donnent la valeur finale ; les mots soutient et freine correspondent au signe. |
| Structure dynamique | Ajouter, modifier et supprimer des indicateurs, nœuds cibles et scénarios ; les références, le calcul, les poids et les vues restent cohérents. |
| Rôles | Seul le analyste en chef peut modifier le modèle et les scénarios ; vérification sur le serveur. |
| Langue | Les trois langues sont complètes ; une seule langue à la fois ; les saisies et résultats sont conservés lors du changement. |
| Stockage | La réouverture conserve la version et les données ; les modifications simultanées entraînent un conflit visible sans perte silencieuse de données. |
| Utilisation | La comparaison de plusieurs acteurs, l’horizon temporel et la référence de tendance sont compréhensibles ; des alternatives tabulaires et un accès au clavier sont disponibles. |
| Vue de contraste | Valeur neutre 3 inchangée ; g = 1 et g = 1.25, bornage, base commune de comparaison et potentiel global de contraste pondéré séparé vérifiés. |
| JSON et exemple | Cycle sans perte, références invalides, droits des rôles, conflits et annulation complète en cas d’erreur vérifiés ; l’exemple USA supprimé reste absent au redémarrage. |

État historique avant la réalisation de l’application : la vérification documentaire d’alors a établi que les contenus techniques, les nombres et l’état des décisions concordent dans les trois versions du concept ; la correspondance structurelle complète a été vérifiée contre v7. Les 26 termes du glossaire d’alors sont associés entre les langues, avec 5 références au règlement par langue. Tous les liens locaux sont valides ; aucun nom d’acteur ni commentaire de source du fichier de travail n’a été repris. Le fichier v7 est resté inchangé. L’exclusion de `temp/` a été vérifiée avec `git check-ignore`. Cette vérification antérieure ne porte pas sur le code applicatif. Les vérifications applicatives effectivement exécutées et les limites restantes figurent dans la [documentation de démarrage](start.fr.md).

## Annexe A Correspondance structurelle détaillée

Les tableaux suivants contiennent exclusivement les identifiants et les références de cellules du fichier v7. Les noms, les évaluations, les remarques sur les sources et les hypothèses numériques d’effet restent dans le fichier source. Les identifiants d’indicateurs suivent l’ordre croissant des lignes sources.

### Nœuds et indicateurs

| ID du nœud | Plage du modèle | Plage d’évaluation | ID des indicateurs dans l’ordre des lignes | Pondérations des indicateurs | Plage de calcul |
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

### Nœuds cibles

| ID cible | Définition et ID | Calcul du facteur | Pondérations des scénarios |
| --- | --- | --- | --- |
| X1 | `Modell!AN21:AN22` | `Berechnung!A800:AD800` | `Modell!E5:E10` |
| X2 | `Modell!AO21:AO22` | `Berechnung!A801:AD801` | `Modell!F5:F10` |
| X3 | `Modell!AP21:AP22` | `Berechnung!A802:AD802` | `Modell!G5:G10` |
| X4 | `Modell!AQ21:AQ22` | `Berechnung!A803:AD803` | `Modell!H5:H10` |
| X5 | `Modell!AR21:AR22` | `Berechnung!A804:AD804` | `Modell!I5:I10` |

### Relations d’effet

Les 136 relations renseignées sont associées par identifiant source, identifiant cible et cellule de la feuille `Modell`. L’intensité et l’échéance sont lues dans la cellule correspondante.

| ID source | ID cible et cellule source |
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
