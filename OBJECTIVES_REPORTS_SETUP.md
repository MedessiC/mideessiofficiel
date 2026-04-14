# Système de Gestion des Objectifs et Rapports des Clients

## 📋 Vue d'ensemble

Ce système permet aux administrateurs MIDEESSI de définir des objectifs hebdomadaires pour chaque client et de créer des rapports détaillés avec métriques flexibles. Les clients peuvent consulter leurs objectifs, voir leur progression, et télécharger leurs rapports.

---

## 🏗️ Architecture

### Base de Données (Supabase)

#### Tables créées:
1. **weekly_objectives** - Objectifs hebdomadaires pour chaque client
   - `client_id`, `week_start`, `week_end`, `title`, `description`
   - `target_value`, `unit` (ex: publications, followers)
   - `status` (pending, in_progress, achieved, failed, cancelled)
   - `actual_value`, `progress_percentage`
   - `priority` (low, normal, high), `category` (content, engagement, growth, roi)
   - `validated_by_admin` - Marque automatiquement comme atteint quand validé

2. **global_objectives** - Objectifs globaux du service (progression générale)
   - Similar to weekly_objectives but for overall service tracking
   - Mise à jour automatique basée sur les objectifs hebdomadaires validés

3. **client_reports** - Rapports mensuels avec métriques
   - `client_id`, `period_month`, `title`, `description`
   - `metrics_data` (JSONB) - Permet les métriques flexibles
   - `is_published` - Contrôle la visibilité pour le client

### Migration

- Fichier: `supabase/migrations/20260414_add_objectives_system.sql`
- Contient: 4 tables, 10 indexes, 8 RLS policies, 1 fonction helper

---

## 🛠️ Composants Frontend

### Admin

#### **AdminWeeklyObjectives.tsx**
Chemin: `src/components/admin/AdminWeeklyObjectives.tsx`

**Fonctionnalités:**
- Créer/Modifier/Supprimer objectifs hebdomadaires
- Sélectionner semaine de début/fin
- Définir titre, description, valeur cible, unité
- Ajouter priorité et catégorie
- Valider les objectifs (marque comme "achieved")
- Affiche le statut et progression en temps réel
- Barre de progression avec couleurs dégradées

**Interface:**
```
Header: "Objectifs hebdomadaires"
Bouton: "+Ajouter"
Formulaire (hidden par défaut):
  - Dates (week_start, week_end)
  - Titre, Description
  - Valeur cible, Unité, Priorité, Catégorie
  - Boutons Créer/Annuler
Liste des objectifs:
  - Carte par objectif
  - Icône priorité (basse/normale/haute)
  - Statut badge (couleur)
  - Barre de progression
  - Actions: Modifier, Valider, Supprimer
```

#### **AdminReportsEditor.tsx**
Chemin: `src/components/admin/AdminReportsEditor.tsx`

**Fonctionnalités:**
- Créer/Modifier/Supprimer rapports
- Sélectionner mois de la période
- Entrer titre et description
- Ajouter métriques flexibles (clé/valeur)
- Publier/Dépublier (contrôle visibilité client)
- Gestion JSONB pour métrique illimitée

**Interface:**
```
Header: "Rapports de suivi"
Bouton: "+Ajouter"
Formulaire (hidden par défaut):
  - Mois (period_month)
  - Titre, Description
  - +Ajouter métrique (dynamic fields)
    - Clé: "Publications", Valeur: "150"
    - Clé: "Engagement", Valeur: "4.5%"
  - Checkbox: "Publier ce rapport"
  - Boutons Créer/Annuler
Liste des rapports:
  - Grille 2 colonnes (lg) / 1 colonne (sm)
  - Titre, date (période_month)
  - Badge "Publié" (si is_published = true)
  - Aperçu des métriques (max 3 affichées)
  - Actions: Modifier, Publier/Dépublier, Supprimer
```

### Client

#### **ClientWeeklyObjectives.tsx**
Chemin: `src/components/ClientWeeklyObjectives.tsx`

**Fonctionnalités:**
- Affiche objectifs validés par admin uniquement
- Sélecteur de semaine (semaine en cours + 12 après)
- Cards objectifs avec:
  - Titre et description
  - Statut badge (couleur codée)
  - Métrique (actual_value / target_value)
  - Barre progression
  - Priorité indicator (emojis 📍⭐🔥)
- Resume stats:
  - Total des objectifs
  - Objectifs atteints
  - Progression % globale
  - Taux de réussite %
- Barre progression globale

**Couleurs statut:**
- pending: gris
- in_progress: bleu
- achieved: vert ✓
- failed: rouge
- cancelled: gris foncé

#### **ClientReports.tsx**
Chemin: `src/components/client/ClientReports.tsx`

**Fonctionnalités:**
- Affiche rapports publiés uniquement
- Grille rapports avec:
  - Titre, date (period_month formatée)
  - Description (aperçu 2 lignes max)
  - Nombre de métriques
  - Tags des 3 premières métriques
  - Bouton "Voir le rapport"
- Vue détaillée (click sur rapport):
  - Full description
  - Grid métriques (2 colonnes sm → 4 colonnes lg)
  - Chaque métrique: label + valeur (gold font)
  - Boutons: Fermer, Télécharger
- Téléchargement HTML:
  - Génère HTML styled (gold/midnight colors)
  - Format print-friendly
  - Inclut toutes les métriques
  - Timestamp du document
  - Branding MIDEESSI

---

## 📱 Navigation

### Client Dashboard

**Menu items (updated):**
1. Accueil (Home)
2. **Objectifs** (NEW) ← ClientWeeklyObjectives
3. Mes infos (ClientInfoForm)
4. Perfs (ClientKPIs)
5. Calendrier (ClientEditorialCalendar)
6. Rapports (ClientReports)
7. Messages (ClientMessages)

**Navigation Bottom Mobile:**
- Composant: `BottomNavigation.tsx`
- Affiche 6 items (sans "Mes infos" sur mobile)
- Icons + labels courts
- Highlight bar sur item actif
- Visible seulement sur mobile (lg:hidden)

**Navigation Sidebar:**
- Affiche tous les items
- Sidebar fixe sur desktop (lg:)
- Sidebar mobile overlay (hamburger)
- Active state: gold border + gold text

---

## 🔗 Routes Admin

### Nouvelle page dédiée:
- **Route:** `/admin/clients`
- **Composant:** `AdminClientManagement.tsx`
- **Fonctionnalités:**
  - Liste tous les clients (grid cards)
  - Sélection d'un client → affiche tabs
  - **Tab 1: Objectifs** → AdminWeeklyObjectives
  - **Tab 2: Rapports** → AdminReportsEditor

### Accès:
1. Admin Dashboard (`/admin/dashboard`)
2. Onglet "Gestion Clients" (existant)
3. Chercher lien vers `/admin/clients` (optional)

---

## 💾 Utilisation

### Pour un Admin

#### Créer un objectif hebdomadaire:
1. Aller à `/admin/clients`
2. Sélectionner un client
3. Cliquer onglet "Objectifs"
4. Cliquer "+Ajouter"
5. Remplir formulaire:
   - Début: 2026-04-14
   - Fin: 2026-04-20
   - Titre: "Augmenter engagement"
   - Cible: 1000 (followers)
   - Catégorie: "growth"
   - Priorité: "high"
6. Cliquer "Créer"

#### Valider (marquer comme atteint):
1. Dans liste objectifs
2. Cliquer ✓ (CheckCircle) sur la carte
3. Auto-calcule progress_percentage
4. Auto-met à jour global_objectives

#### Créer un rapport:
1. Onglet "Rapports"
2. Cliquer "+Ajouter"
3. Remplir:
   - Mois: 2026-04
   - Titre: "Rapport April 2026"
   - Description: "[long text]"
   - Ajouter métriques:
     * Publications: 25
     * Engagement rate: 4.8%
     * New followers: 156
4. Cocher "Publier ce rapport"
5. Cliquer "Créer"

### Pour un Client

#### Voir ses objectifs:
1. Dashboard → "Objectifs" (nouveau tab)
2. Voir semaine en cours (par défaut)
3. Choisir autre semaine dans selector top
4. Cards objectifs avec statut + progression

#### Télécharger un rapport:
1. Dashboard → "Rapports"
2. Cliquer sur rapport dans grille
3. Voir détails + toutes métriques
4. Cliquer "Télécharger"
5. HTML s'ouvre/télécharge (format professionnel)

---

## 🔐 Sécurité (RLS Policies)

Toutes les tables ont RLS enabled:

**Admin:** Full CRUD access
**Client:** Read-only own data
- weekly_objectives: Vue uniquement validés (validated_by_admin = true)
- client_reports: Vue uniquement publiés (is_published = true)
- global_objectives: Vue uniquement (calculé auto par système)

---

## 📊 Progression Auto-Calcul

### Logique (à implémenter côté trigger):

```
Quand admin valide objectif hebdo:
  ✓ weekly_objectives.status = 'achieved'
  ✓ weekly_objectives.validated_by_admin = true
  ✓ Trigger calcule global_objectives.progress_percentage
    → SUM(achieved_weekly_objectives) / COUNT(all_weekly_objectives) * 100

Résultat:
  ✓ Client voit progression montante dans ClientDashboardHome
  ✓ ClientWeeklyObjectives affiche nouveau %
```

---

## 🎨 Design/Colors

**Palette:**
- Primary: #d4af37 (gold)
- Dark: #1a1a3e (midnight)
- Statut achieved: #10b981 (green)
- Statut failed: #ef4444 (red)
- Statut in_progress: #0ea5e9 (blue)
- Backgrounds: white/gray-50 (light), gray-800/900 (dark)

**Typography:**
- Headers: font-bold, size 2xl/lg
- Body: text-sm/base, gray-600 (light)
- Labels: text-xs, uppercase, gray-600

**Spacing:**
- Cards: p-6, rounded-xl
- Gaps: gap-4 (default), sm:gap-3, lg:gap-6
- Buttons: px-4 py-2 (sm), px-6 py-3 (lg)

---

## 📝 Fichiers Créés/Modifiés

### Créés:
- ✅ `AdminWeeklyObjectives.tsx`
- ✅ `AdminReportsEditor.tsx`
- ✅ `ClientWeeklyObjectives.tsx`
- ✅ `ClientReports.tsx` (remplacé old version)
- ✅ `AdminClientManagement.tsx` (page dédiée)
- ✅ `BottomNavigation.tsx` (mobile nav)
- ✅ `20260414_add_objectives_system.sql` (migration)

### Modifiés:
- ✅ `ClientDashboard.tsx` (ajout onglet objectifs + bottom nav)
- ✅ `App.tsx` (ajout route `/admin/clients`)

---

## ⚠️ À Faire Après

1. **Fonction Trigger PostgreSQL** - Auto-calcul progress_percentage
   ```sql
   CREATE OR REPLACE FUNCTION update_global_progress()
   RETURNS TRIGGER AS $$
   BEGIN
     -- Logique calcul ici
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;
   ```

2. **PDF Library** - Pour vrai PDFs (jsPDF, pdfkit)
   - Actuellement: HTML download

3. **Email Notifications** - Quand objectif validé
   - Optional feature

4. **Calendar Integration** - Sync avec calendrier éditorial
   - Link weekly_objectives ↔ calendrier_editorial

5. **Analytics Dashboard** - Vue admin du progrès global
   - Chart progression par client
   - Tendances

---

## 🚀 Prochaines Étapes Recommandées

1. Tester dans Supabase l'insertion données via AdminWeeklyObjectives
2. Vérifier RLS policies marchent correctement
3. Implémenter trigger auto-calcul
4. Tester téléchargement rapport HTML
5. Ajouter notification client quand rapport publié
6. Migration vers vrai PDF lib si besoin

---

**Version:** 1.0  
**Date:** 2026-04-14  
**Statut:** Core features completed, ready for testing
