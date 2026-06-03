# 🎯 GUIDE PRATIQUE: Publier du Contenu pour les Clients

## Sommaire
1. [Flux Complet en Images](#flux-complet-en-images)
2. [Accès Admin: Par Où Commencer](#accès-admin-par-où-commencer)
3. [Tutoriel Pas-à-Pas](#tutoriel-pas-à-pas)
4. [Checklist Rapide](#checklist-rapide)

---

## Flux Complet en Images

```
ÉTAPE 1: Admin Crée un Client
┌─────────────────────────────────────┐
│ /admin/dashboard                    │
│  → Clients Tab                      │
│  → Create New Client Form           │
│  → Données: nom_marque, pack, etc   │
└─────────────────────────────────────┘
                ↓
ÉTAPE 2: Admin Entre dans Gestion Clients
┌─────────────────────────────────────┐
│ /admin/clients                      │
│ Liste des clients en colonne LEFT   │
│ Clique sur le client                │
└─────────────────────────────────────┘
                ↓
ÉTAPE 3: Admin Choisit la Section
┌─────────────────────────────────────┐
│ 4 Onglets en haut:                  │
│ - Objectifs 🎯                      │
│ - Rapports 📄                       │
│ - Calendrier 📅                     │
│ - Info Client ℹ️                    │
└─────────────────────────────────────┘
                ↓
ÉTAPE 4: Admin Publie le Contenu
┌─────────────────────────────────────┐
│ OBJECTIFS:                          │
│ ├─ Ajouter → Créer objectif semaine│
│ ├─ Lister → Voir tous objectifs    │
│ └─ Éditer → Changer statut (✓/❌)  │
│                                     │
│ RAPPORTS:                           │
│ ├─ Ajouter → Créer rapport         │
│ ├─ Metrics → Ajouter KPIs          │
│ └─ Publier → Toggle "Visible"      │
│                                     │
│ CALENDRIER:                         │
│ ├─ Ajouter → Créer entrée          │
│ ├─ Catégorie → Publication/Réunion  │
│ └─ Statut → Planifié/Terminé       │
└─────────────────────────────────────┘
                ↓
ÉTAPE 5: Client Voit le Contenu
┌─────────────────────────────────────┐
│ Le client va à /clients/dashboard   │
│                                     │
│ Sidebar:                            │
│ - Accueil                           │
│ - Objectifs 🆕 ← Data from admin   │
│ - Mes infos                         │
│ - Perfs (KPIs)                      │
│ - Calendrier ← Data from admin     │
│ - Rapports 📄 ← Data from admin    │
│ - Messages                          │
└─────────────────────────────────────┘
```

---

## Accès Admin: Par Où Commencer

### Option 1: Depuis AdminDashboard
```
HOME
 └─ AdminDashboard (/admin/dashboard)
     └─ Onglet "Clients"
         └─ Bouton "Gérer Clients & Contenu"
             └─ /admin/clients ← VOUS ÊTES ICI
```

### Option 2: Direct via URL
```
https://votresite.com/admin/clients
```

---

## Tutoriel Pas-à-Pas

### ✅ PARTIE 1: Ajouter un Objectif Hebdomadaire

**Où:** `/admin/clients` → Onglet "Objectifs"

**Pas 1: Sélectionner le Client**
```
1. Page charge
2. Liste des clients (gauche)
3. Cliquez sur "Marque X" → S'illumine en OR
```

**Pas 2: Ouvrir le Formulaire Objectifs**
```
1. Onglet "Objectifs" s'affiche (golden button)
2. Bouton "+ Ajouter une objectif" (OR)
3. Formulaire se déploie avec gradient gold
```

**Pas 3: Remplir les Champs**
```
Titre:           "Création de 3 posts Instagram"
Description:     "Posts de présentation, engagement, call-to-action"
Semaine:         2025-01-13 à 2025-01-19
Statut Initial:  "pending" (par défaut)

💡 Statuts disponibles:
   - pending (gris) = Pas encore commencé
   - in_progress (bleu) = En cours
   - achieved (vert) = Réussi ✓
   - failed (rouge) = Échoué ✗
   - cancelled (gris clair) = Annulé Ø
```

**Pas 4: Créer**
```
1. Cliquez "Créer"
2. Message "✅ Objectif créé avec succès"
3. Formulaire réinitalisé
4. Objectif apparaît dans la liste
```

**Pas 5: Le Client Voit Ça**
```
Client dashboard → Objectifs
┌─────────────────────────────────┐
│ SEMAINE 13-19 JAN 2025          │
│                                 │
│ Création de 3 posts Instagram   │
│ Posts de présentation...        │
│ Status: ⚪ PENDING              │
│                                 │
│ Progression: 0% (1 sur ...)    │
└─────────────────────────────────┘
```

---

### ✅ PARTIE 2: Créer & Publier un Rapport

**Où:** `/admin/clients` → Onglet "Rapports"

**Pas 1: Cliquer "+ Ajouter"**
```
Bouton orange → Formulaire se déploie
```

**Pas 2: Remplir les Infos de Base**
```
Mois:       "Janvier 2025" (date picker)
Titre:      "Rapport Janvier - Performance Social"
Description: "Bilan des performances du mois..."
```

**Pas 3: Ajouter les Métriques**
```
Click "+ Ajouter métrique"

Métrique 1:
├─ Nom: "Publications"
└─ Valeur: "25"

Métrique 2:
├─ Nom: "Engagement Rate"
└─ Valeur: "4.2%"

Métrique 3:
├─ Nom: "Followers Gain"
└─ Valeur: "+157"

(Vous pouvez en ajouter autant que vous voulez)
```

**Pas 4: IMPORTANT - Publier**
```
☑️ Cocher "Publier ce rapport"

→ Si COCHÉ: Client verra le rapport
→ Si DÉCOCHÉ: Rapport invisible (brouillon)
```

**Pas 5: Cliquer Créer**
```
1. Message "✅ Rapport créé avec succès"
2. Rapport apparaît dans la liste
3. Si publié → Badge "Publié" (vert)
```

**Pas 6: Le Client Voit Ça**
```
Client dashboard → Rapports → Card "Janvier - Performance Social"
├─ Titre & Date
├─ Brève description
├─ 3 prévisualisations de métriques
└─ Bouton "Voir le rapport"

Au clic:
┌─────────────────────────────────┐
│ Rapport Janvier - Performance   │
│ Résumé: "Bilan des perfs..."   │
│                                 │
│ MÉTRIQUES:                      │
│ ┌─────────────────────────────┐ │
│ │ Publications          Followers │
│ │     25                  +157  │
│ │ Engagement Rate               │
│ │      4.2%                     │
│ └─────────────────────────────┘ │
│                                 │
│ [Fermer] [📥 Télécharger HTML] │
└─────────────────────────────────┘
```

---

### ✅ PARTIE 3: Ajouter des Événements Calendrier

**Où:** `/admin/clients` → Onglet "Calendrier"

**Pas 1: Cliquer "+ Ajouter une entrée"**
```
Formulaire avec gradient OR se déploie
```

**Pas 2: Remplir les Champs**
```
Type d'entrée:    4 options
├─ Publication: (ex: Blog post)
├─ Livraison: (ex: Livrables)
├─ Réunion: (ex: Studio créatif)
└─ Autre: (ex: Checkpoint)

Date:             2025-02-14
Titre:            "Brainstorm - Campagne Valentine"
Description:      "Session de 2h pour définir story & visuels"
Statut:           "planifié" (par défaut)
```

**Pas 3: Créer**
```
1. Message "✅ Entrée créée"
2. Apparaît dans la liste
```

**Pas 4: Le Client Voit Ça**
```
Client dashboard → Calendrier

┌──────────────────────────────────┐
│ 14 FÉV - Brainstorm Campaign    │
│ 🎨 RÉUNION (Catégorie Badge)    │
│ ⏰ PLANIFIÉ (Statut)              │
│                                  │
│ Session de 2h pour définir...   │
│ [Éditer] [Supprimer]            │
└──────────────────────────────────┘
```

---

## Checklist Rapide

### ✅ AVANT DE COMMENCER
- [ ] Je suis connecté comme ADMIN
- [ ] J'ai créé au minimum 1 client (dans AdminDashboard)
- [ ] Je suis sur `/admin/clients`

### ✅ POUR AJOUTER UN OBJECTIF
- [ ] 1. Sélectionner le client (colonne LEFT)
- [ ] 2. Onglet "Objectifs"
- [ ] 3. "+ Ajouter une objectif"
- [ ] 4. Remplir: titre, description, semaine
- [ ] 5. Cliquer "Créer"
- [ ] 6. ✓ Client verra l'objectif dans son dashboard

### ✅ POUR PUBLIER UN RAPPORT
- [ ] 1. Sélectionner le client
- [ ] 2. Onglet "Rapports"
- [ ] 3. "+ Ajouter"
- [ ] 4. Remplir: titre, mois, description
- [ ] 5. "+ Ajouter métrique" (répéter)
- [ ] 6. ☑️ COCHER "Publier ce rapport"
- [ ] 7. Cliquer "Créer"
- [ ] 8. ✓ Client verra le rapport

### ✅ POUR AJOUTER UN ÉVÉNEMENT CALENDRIER
- [ ] 1. Sélectionner le client
- [ ] 2. Onglet "Calendrier"
- [ ] 3. "+ Ajouter une entrée"
- [ ] 4. Choisir catégorie (Publication/Réunion/etc)
- [ ] 5. Date, titre, description
- [ ] 6. Cliquer "Créer"
- [ ] 7. ✓ Client verra l'événement

---

## 🔄 Modifier/Supprimer

### Objectifs
```
Liste des objectifs → 
  [Icône Éditer] → Réouvre le formulaire (pré-rempli)
  [Icône Supprimer] → Confirmation → Supprimé
```

### Rapports
```
Liste des rapports →
  [Éditer] → Modifie le rapport
  [Publier/Dépublier] → Toggle visibilité
  [Supprimer] → Confirmation → Supprimé
```

### Calendrier
```
Liste des événements →
  [Éditer] → Modifie l'événement
  [Supprimer] → Confirmation → Supprimé
```

---

## ⚡ Tips & Tricks

1. **Le client ne voit pas les changements?**
   - Rafraîchissez la page (F5)
   - Vérifiez que le contenu est "Publié"
   - Vérifiez que `client_id` match entre admin et client

2. **Besoin de changer un objectif rapidement?**
   - Cliquez [Éditer] → Modifiez le statut
   - Cliquez "Mettre à jour"
   - Le client verra le nouveau statut immédiatement

3. **Créer des rapports en masse?**
   - Créez le 1er rapport complètement
   - Pour le suivant, continuez → moins de saisie

4. **Planifier à l'avance?**
   - Créez les calendrier entries pour le mois entier
   - Créez les objectifs semaine par semaine
   - Les clients voient tout en temps réel

5. **Besoin de supprimer un objectif?**
   - Cliquez [Supprimer]
   - Confirmer
   - ⚠️ Irréversible! (pas de corbeille)

---

## 🎓 Architecture Technique (Pour Développeurs)

### Routes
```
GET  /admin/clients              List + manage all clients
POST /api/weekly_objectives      Admin creates objective
PUT  /api/weekly_objectives/:id  Admin updates status
POST /api/client_reports         Admin creates report
PUT  /api/client_reports/:id     Admin publishes report
GET  /clients/dashboard          Client views data
```

### Database
```
Admin Actions            →    Database Write       →    Client Sees
├─ Create Objective      →   weekly_objectives   →   ClientWeeklyObjectives
├─ Create Report         →   client_reports      →   ClientReports
└─ Create Calendar       →   calendrier_editorial →  ClientEditorialCalendar
```

### Key Flag: is_published
```
Reports:
  is_published=false  → Brouillon (visible ADMIN only)
  is_published=true   → Publié (visible CLIENT)

Objectifs:
  Tous les objectifs sont visibles si client_id match

Calendrier:
  Tous les événements sont visibles si client_id match
```

---

**Besoin de plus d'aide? Consultez ADMIN_PUBLISHING_ARCHITECTURE.md**

