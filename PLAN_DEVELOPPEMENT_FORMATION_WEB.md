# Plan de développement — parcours d’apprentissage et évaluation MIDEESSI Learn

## 1. Objectif

Créer un parcours complet de formation en développement web pour les élèves béninois, avec :

- cours pédagogiques par bloc,
- quiz de validation par bloc,
- note immédiate sur 100,
- livrables pratiques,
- progression sans blocage,
- apprentissage compatible mobile et PC.

---

## 2. Règle pédagogique centrale

Chaque bloc suit le même cycle :

1. Cours court + exemples concrets
2. Quiz d’environ 20 questions
3. Affichage immédiat de la note sur 100
4. Livrable pratique
5. Correction humaine plus tard
6. Passage au bloc suivant sans attendre

Important : chaque bloc est noté indépendamment sur 100. Il n’y a pas de note globale unique pour toute la formation.

---

## 3. Structure du parcours

### Bloc 1 — Fondamentaux du web
- Internet
- site web
- page web
- serveur
- front-end / back-end

Projet : rédaction courte d’explication d’un site web.

### Bloc 2 — HTML
- balises, structure, texte, listes, liens, images, conteneurs sémantiques, formulaires

Projet : page HTML pure sans CSS.

### Bloc 3a — CSS de base
- liaison HTML/CSS
- sélecteurs
- syntaxe
- couleurs HEX/RGB/RGBA
- typographie
- backgrounds

Projet : styliser une page HTML simple.

### Bloc 3b — CSS Layout & Responsive
- box model
- display
- position
- flexbox
- grid
- media queries

Projet : portfolio responsive stylisé.

### Bloc 4 — JavaScript de base
- variables et types
- opérateurs
- conditions
- fonctions
- DOM
- événements
- tableaux
- formulaires

Projet : menu mobile, validation du formulaire, dark mode.

### Bloc 5 — Vibecoding
- utilisation de l’IA
- méthode de travail
- validation critique du code
- amélioration progressive

Projet : mini-site développé avec une méthode imposée.

### Bloc 6 — Optimisation site web
- performance
- Lighthouse
- images
- CSS / JS
- temps de chargement

Projet : audit avant / après.

### Bloc 7 — Nom de domaine & hébergement
- nom de domaine
- hébergement
- mise en ligne
- sécurité simple

Projet : déploiement sur un vrai nom de domaine.

### Bloc 8 — Référencement SEO
- SEO on-page
- métadonnées
- mots-clés
- images alt
- Search Console

Projet : optimisation SEO + preuve de mise à jour.

---

## 4. Règle de score par bloc

- 20 questions par bloc
- 1 bonne réponse = 5 points
- score = bonnes réponses × 5
- total sur 100

Exemples :

- 20/20 = 100
- 16/20 = 80
- 12/20 = 60
- 10/20 = 50

### Barème
- 90–100 : Excellent
- 75–89 : Très bien
- 60–74 : Acceptable
- 50–59 : À renforcer
- 0–49 : Non validé

---

## 5. Système anti-triche

Le système doit limiter la fraude sans bloquer l’élève inutilement :

- détection de changement d’onglet
- détection de perte de focus
- timer visible
- signalement d’activité suspecte
- message d’avertissement si le quiz est interrompu

Le livrable est évalué plus tard par un humain, mais n’empêche pas la progression.

---

## 6. UX attendue sur la plateforme

### Page Apprendre
- hero
- recherche
- onglets Formations / Livres
- cartes de formations
- CTA “Commencer”

### Page Détail de la formation
- titre, description, niveau, prix
- modules / blocs
- parcours
- bouton “Commencer le parcours”

### Page Parcours
- liste des blocs
- état : à faire, en cours, validé
- durée estimée
- objectif du bloc
- bouton “Ouvrir le bloc”

### Page Bloc
- contenu du cours
- exemples concrets
- travaux pratiques
- bouton “Passer au quiz”
- bouton “Soumettre un livrable”

### Page Quiz
- question courante
- compteur de temps
- réponses à choix unique
- score final immédiat

### Page Résultat
- score /100
- message personnalisé
- bouton “Passer au bloc suivant”
- bouton “Soumettre le livrable”

---

## 7. Modèle de données à implémenter

### Formation
- id
- slug
- title
- description
- category
- duration
- level
- price
- modules[]

### Bloc
- id
- formationId
- slug
- title
- objective
- order
- estimatedDuration
- lessonContent
- deliverableType
- quizQuestions[]
- isPublished

### Question du quiz
- id
- blockId
- question
- options[]
- correctIndex
- explanation

### Résultat élève
- userId
- blockId
- score
- attemptCount
- status
- submittedAt

---

## 8. Plan de développement par étapes

### Étape 1 — Structurer la formation dans les données
- modifier [src/data/formationsData.ts](src/data/formationsData.ts)
- ajouter les modules / blocs du parcours
- définir les projets et livrables

### Étape 2 — Transformer la page détail
- modifier [src/pages/FormationDetail.tsx](src/pages/FormationDetail.tsx)
- ajouter le parcours des blocs
- ajouter la progression et les CTA

### Étape 3 — Créer la page bloc d’apprentissage
- une page dédiée par bloc
- contenu pédagogique court
- TP et exemples
- lien vers quiz

### Étape 4 — Créer le moteur de quiz
- logique de chargement des questions
- calcul du score
- affichage du résultat immédiat
- timer

### Étape 5 — Gérer les livrables
- ajout de texte, PDF, lien ou capture
- statut de soumission
- ne pas bloquer la progression

### Étape 6 — Ajouter la progression élèves
- bloc validé / en cours / à faire
- sauvegarde du score
- historique

### Étape 7 — Finaliser l’UX
- responsive
- messages motivants
- design cohérent avec le site actuel

---

## 9. Recommandation de priorité

Pour démarrer proprement et rapidement, on doit prioriser :

1. la structure du parcours,
2. le bloc HTML,
3. le quiz HTML,
4. le score 0–100,
5. le résultat immédiat,
6. puis le reste des blocs.

C’est la manière la plus efficace de valider le concept sur la plateforme actuelle.

---

## 10. Cible de livraison MVP

Le MVP doit contenir :

- 1 formation : Développement Web
- 3 blocs minimum : Fondamentaux, HTML, CSS
- 1 quiz 20 questions par bloc
- score immédiat sur 100
- progresion visible
- livrable pour chaque bloc
- parcours compatible mobile

C’est le bon point de départ pour démontrer le système complet.

---

## 11. Résumé court

Le bon modèle pour MIDEESSI Learn est :

- module = bloc pédagogique + quiz + livrable,
- score immédiat sur 100,
- chaque bloc évalué indépendamment,
- progression continue sans attendre la correction humaine,
- parcours simple, clair et adapté au public débutant.

---

## 12. Prochaine étape de code

La prochaine étape technique consiste à :

- créer le modèle de données du parcours,
- implémenter un composant QuizPage,
- implémenter un composant LessonBlockPage,
- relier ces pages à la formation actuelle,
- lancer le projet pour valider le démarrage.
