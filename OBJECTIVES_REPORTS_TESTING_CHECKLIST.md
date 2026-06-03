# ✅ Testing Checklist - Objectives & Reports System

## 🚀 Pre-Deployment Checklist

### Database Setup
- [ ] Deploy migration `20260414_add_objectives_system.sql` to Supabase
- [ ] Verify all 4 tables created:
  - [ ] `weekly_objectives` table exists
  - [ ] `global_objectives` table exists
  - [ ] `client_reports` table exists
  - [ ] `editorial_calendar_items` table exists
- [ ] Verify all indexes created (10 total)
- [ ] Verify RLS policies enabled on all tables
- [ ] Run: `SELECT * FROM weekly_objectives LIMIT 1;` (should return empty)

### Frontend Compilation
- [ ] No TypeScript errors
- [ ] No console errors on page load
- [ ] All imports resolved correctly
- [ ] Routes load without 404 errors

---

## 👨‍💼 Admin Testing Workflow

### 1. Access Admin Client Management
- [ ] Navigate to `/admin/clients`
- [ ] See header "Gestion des Clients"
- [ ] See list of all clients (grid view)
- [ ] Can see client cards with:
  - [ ] Nom marque
  - [ ] Email
  - [ ] Pack badge (KPEVI/EYA/JAGO)
  - [ ] Statut badge (actif/inactif)

### 2. Create Weekly Objective

**Test Case 1: Happy Path**
1. [ ] Click client card
2. [ ] See back button "← Retour à la liste"
3. [ ] Client name displayed
4. [ ] Two tabs visible: "Objectifs" | "Rapports"
5. [ ] Default tab is "Objectifs"
6. Click "+Ajouter"
7. [ ] Form appears with fields:
   - [ ] Début de semaine (date input)
   - [ ] Fin de semaine (date input)
   - [ ] Titre de l'objectif (text input)
   - [ ] Description (textarea)
   - [ ] Valeur cible (number input)
   - [ ] Unité (dropdown with options)
   - [ ] Priorité (dropdown: Basse/Normale/Haute)
   - [ ] Catégorie (dropdown: Contenu/Engagement/Croissance/ROI)
8. [ ] Fill form:
   ```
   Début: 2026-04-14
   Fin: 2026-04-20
   Titre: "Augmenter publications"
   Description: "Publier 4 contenus de qualité"
   Valeur cible: 4
   Unité: "publications"
   Priorité: "Normale"
   Catégorie: "content"
   ```
9. [ ] Click "Créer"
10. [ ] Success message appears: "Objectif créé avec succès"
11. [ ] Form closes
12. [ ] Objective appears in list below
13. [ ] Card shows:
    - [ ] Priorité icon (⭐)
    - [ ] Title "Augmenter publications"
    - [ ] Description
    - [ ] Status badge "pending"
    - [ ] Date range displayed
    - [ ] Progress bar (0% initially)
14. [ ] Three action buttons visible:
    - [ ] ✏️ Edit (Edit icon)
    - [ ] ✓ Check (CheckCircle icon)
    - [ ] 🗑️ Trash (Delete icon)

**Test Case 2: Form Validation**
- [ ] Try submit without Début date → Form prevents submit
- [ ] Try submit without Titre → Form prevents submit
- [ ] Calendar shows valid date ranges

**Test Case 3: Edit Objective**
1. [ ] On objective card, click ✏️ button
2. [ ] Form appears with existing data pre-filled:
   - [ ] Début: 2026-04-14
   - [ ] Fin: 2026-04-20
   - [ ] Titre: "Augmenter publications"
   - [ ] etc.
3. [ ] Change title to "Augmenter engagement"
4. [ ] Change valeur cible to 8
5. [ ] Click "Modifier"
6. [ ] Success message: "Objectif modifié avec succès"
7. [ ] List updates with new values
8. [ ] Form closes

**Test Case 4: Validate Objective**
1. [ ] On objective card, click ✓ (CheckCircle) button
2. [ ] Status changes from "pending" → "achieved"
3. [ ] Progress bar updates to 100% (since 0/4 initially, actual_value sets to target)
4. [ ] validated_by_admin set to true in database
   - [ ] Verify in Supabase UI: columns section shows validated_by_admin = true

**Test Case 5: Delete Objective**
1. [ ] Create another objective
2. [ ] Click 🗑️ (Trash) button
3. [ ] Objective disappears from list
4. [ ] Success message: "Objectif supprimé"
5. [ ] Database no longer shows it

### 3. Create Client Report

**Test Case 1: Happy Path**
1. [ ] Click "Rapports" tab
2. [ ] See "+Ajouter" button
3. [ ] Click button
4. [ ] Form appears with fields:
   - [ ] Mois de la période (month input)
   - [ ] Titre du rapport (text input)
   - [ ] Description (textarea)
   - [ ] Section Métriques de performance:
     - [ ] "+Ajouter métrique" button
     - [ ] (empty state initially)
   - [ ] Checkbox: "Publier ce rapport"
   - [ ] "Créer" and "Annuler" buttons
5. [ ] Fill initial fields:
   ```
   Mois: avril 2026
   Titre: "Rapport Avril 2026"
   Description: "Très bonne semaine avec engagement excellent"
   ```
6. [ ] Click "+Ajouter métrique"
7. [ ] Two new inputs appear:
   - [ ] Input 1: "Nom de la métrique (ex: Publications)"
   - [ ] Input 2: "Valeur (ex: 125)"
   - [ ] Delete button (🗑️) for this metric
8. [ ] Add 3 metrics:
   ```
   Métrique 1:
     Nom: "Publications"
     Valeur: "24"
   Métrique 2:
     Nom: "Engagement Rate"
     Valeur: "4.8%"
   Métrique 3:
     Nom: "New Followers"
     Valeur: "156"
   ```
9. [ ] Check "Publier ce rapport"
10. [ ] Click "Créer"
11. [ ] Success message: "Rapport créé avec succès"
12. [ ] Form closes
13. [ ] Report appears in grid below
14. [ ] Card shows:
    - [ ] 📄 Icon with gold background
    - [ ] Title "Rapport Avril 2026"
    - [ ] Date: "avril 2026"
    - [ ] Description preview (2 lines max)
    - [ ] "Publié" badge (green, since is_published = true)
    - [ ] Metrics preview:
      - [ ] "3 métriques" text
      - [ ] Tags: "Publications", "Engagement Rate", "+1"
    - [ ] "Voir le rapport" button

**Test Case 2: Edit Report**
1. [ ] On report card in list view, click "Modifier" button (when in edit mode)
   - Note: Need to show edit button in list (currently in detail view)
2. [ ] Form appears pre-filled with data
3. [ ] Change title to "Rapport Performance Avril"
4. [ ] Remove one metric (click 🗑️ on a metric)
5. [ ] Add new metric: "Website Clicks" = "342"
6. [ ] Click "Modifier"
7. [ ] List updates with new data
8. [ ] Form closes

**Test Case 3: Publish/Unpublish**
1. [ ] In reports list, find published report card
2. [ ] Should show "Publié" badge
3. [ ] In detail view, should have "Dépublier" button
4. [ ] Click "Dépublier"
5. [ ] Report hidden from client view (is_published = false)
6. [ ] In admin view, should now show "Publier" button
7. [ ] Click "Publier" again
8. [ ] Client can see it again

**Test Case 4: Delete Report**
1. [ ] Create test report
2. [ ] Click delete (🗑️) button
3. [ ] Report removed from list
4. [ ] Success message

---

## 👥 Client Testing Workflow

### 1. Access Client Dashboard

**Precondition:** Client logged in, at `/clients/dashboard`

- [ ] See sidebar navigation with 7 items:
  1. [ ] Accueil (Home)
  2. [ ] Objectifs (NEW!) ← This is the new feature
  3. [ ] Mes infos
  4. [ ] Perfs
  5. [ ] Calendrier
  6. [ ] Rapports
  7. [ ] Messages

**On Mobile:**
- [ ] Bottom navigation appears (lg:hidden)
- [ ] Shows 6 icons (no "Mes infos")
- [ ] Active tab has gold bar on top

### 2. View Weekly Objectives

**Test Case 1: Navigate to Objectifs**
1. [ ] Click "Objectifs" in sidebar (or bottom nav on mobile)
2. [ ] See header: "Mes Objectifs Hebdomadaires"
3. [ ] Subtitle: "Suivi des objectifs définis chaque semaine..."
4. [ ] Week selector appears with buttons:
   - [ ] Each button shows: "14 avr - 20 avr" (example)
   - [ ] Previous weeks before current
   - [ ] Current week (highlighted with gold bg)
   - [ ] Future weeks
5. [ ] Scroll-able on mobile (horizontal scroll)
6. [ ] Click different week:
   - [ ] Objectives list updates
   - [ ] Date references update

**Test Case 2: View Objectives for Current Week**
1. [ ] Default to current week (week with today's date)
2. [ ] If admin created objectives for this week:
   - [ ] Show 4 summary cards:
     - [ ] "Total": number of objectives
     - [ ] "Atteints": count of achieved
     - [ ] "Progression": overall % progress
     - [ ] "Taux": success rate %
3. [ ] Overall progress bar below (gold gradient)
4. [ ] Grid of objective cards (2 columns on sm, responsive)
5. [ ] Each card shows:
   - [ ] Gradient background (color varies by status)
   - [ ] 2-column layout:
     - [ ] Left: Title, Category, Description
     - [ ] Right: Status icon (color-coded)
   - [ ] Metrics section:
     ```
     Objectif: 4 publications
     Atteint: [actual_value] / [target_value]
     ```
   - [ ] Progress bar with % displayed
   - [ ] Status badge at bottom:
     - [ ] Achieved: green with ✓
     - [ ] In Progress: blue
     - [ ] Failed: red
     - [ ] Pending: gray
   - [ ] Priorité indicator if high (🔥 emoji)

**Test Case 3: No Objectives**
1. [ ] If admin hasn't published any objectives for selected week:
2. [ ] Show empty state:
   - [ ] 📍 Large icon (Target)
   - [ ] "Aucun objectif pour cette semaine"
   - [ ] "Les objectifs seront ajoutés par votre équipe MIDEESSI"

**Test Case 4: Mobile Responsiveness**
- [ ] On mobile (< 640px):
  - [ ] Week selector is scrollable
  - [ ] Objective cards fill width (1 column)
  - [ ] Touch-friendly button sizes
  - [ ] Progress bars visible
  - [ ] Bottom nav allows navigation
- [ ] On tablet (640px - 1024px):
  - [ ] 2-column grid
  - [ ] Full sidebar hidden, hamburger visible
- [ ] On desktop (> 1024px):
  - [ ] Sidebar always visible
  - [ ] Bottom nav hidden
  - [ ] Full 2-column objective grid

### 3. View Client Reports

**Test Case 1: Navigate to Rapports**
1. [ ] Click "Rapports" in sidebar/bottom-nav
2. [ ] See header: "Rapports de suivi"
3. [ ] Subtitle: "Consultez les rapports mensuels..."
4. [ ] Only published reports show (is_published = true)

**Test Case 2: View Reports List**
1. [ ] If reports exist:
2. [ ] Grid of report cards (2 columns sm, responsive):
   - [ ] Report icon (📄 in gold background)
   - [ ] Title
   - [ ] Date (formatted: "avril 2026")
   - [ ] Description preview (2 lines max)
   - [ ] Metrics section:
     - [ ] "X métriques" text with icon
     - [ ] First 3 metric tags visible
     - [ ] "+X" for remaining metrics if > 3
   - [ ] "Voir le rapport" button
3. [ ] Click card or button:
   - [ ] Detail view opens
   - [ ] Replaces grid with full report

**Test Case 3: View Report Detail**
1. [ ] Back button: "← Retour aux rapports"
2. [ ] Header section:
   - [ ] H1 title
   - [ ] Date with calendar icon
   - [ ] Border bottom
3. [ ] If description exists:
   - [ ] "Résumé" section
   - [ ] Full description in gray box
4. [ ] Metrics section:
   - [ ] H2 "Métriques de Performance"
   - [ ] Grid layout (2 cols sm → 4 cols lg)
   - [ ] Each metric card shows:
     - [ ] Label (uppercase)
     - [ ] Value (gold font, large)
     - [ ] Gold border
5. [ ] Action buttons (bottom):
   - [ ] "Fermer" button (gray)
   - [ ] "Télécharger" button (gold)
6. [ ] Click "Fermer":
   - [ ] Back to reports grid
7. [ ] Click "Télécharger":
   - [ ] HTML file downloads
   - [ ] Filename: `Rapport_[title]_[period_month].html`
   - [ ] File is readable when opened

**Test Case 4: Downloaded HTML Quality**
1. [ ] Open downloaded HTML in browser
2. [ ] Verify formatting:
   - [ ] Professional header (gold border)
   - [ ] Title centered
   - [ ] Report date displayed
   - [ ] Summary section with description
   - [ ] All metrics displayed in grid
   - [ ] Footer with generation timestamp
   - [ ] MIDEESSI copyright
3. [ ] Print preview (Ctrl+P):
   - [ ] Looks good on paper
   - [ ] No broken formatting
   - [ ] Colors print OK (or black if B&W)

**Test Case 5: No Reports**
1. [ ] If no published reports:
2. [ ] Empty state shows:
   - [ ] 📄 Large icon
   - [ ] "Aucun rapport disponible"
   - [ ] "Vos rapports mensuels seront disponibles..."

**Test Case 6: Report Visibility (Admin Control)**
1. [ ] Admin creates report but DOES NOT publish (is_published = false)
2. [ ] Client views "Rapports" page
3. [ ] Report SHOULD NOT appear
4. [ ] Admin publishes report (is_published = true)
5. [ ] Client refreshes page
6. [ ] Report NOW appears

---

## 🔐 Database Verification

### RLS Policies Check
```sql
-- Verify RLS is enabled on all tables
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('weekly_objectives', 'global_objectives', 'client_reports');

-- Should return 3 rows with rowsecurity = true
```

### Data Integrity Check
```sql
-- Verify data structure
SELECT * FROM weekly_objectives LIMIT 1;
-- Should show all columns: id, client_id, week_start, week_end, title, etc.

SELECT * FROM client_reports LIMIT 1;
-- Should show JSONB metrics_data column
```

---

## 🐛 Edge Cases / Error Handling

- [ ] Admin creates objective with future dates → Works
- [ ] Admin creates objective with past dates → Works
- [ ] Client switches weeks rapidly → No console errors
- [ ] Client downloads report immediately after creation → Works
- [ ] Metrics with special characters (quotes, accents) → Stored correctly
- [ ] Very long description in report → Text wraps properly
- [ ] Client without any objectives → Empty state appears
- [ ] Network timeout during create → Appropriate error message
- [ ] Double-click create button → Only one objective created
- [ ] Edit then cancel → Original data restored

---

## 📊 Performance Checks

- [ ] Loading objectives list < 1 second (with 50+ objectives)
- [ ] Creating objective < 2 seconds
- [ ] Switching weeks < 500ms
- [ ] Downloading report < 1 second
- [ ] No memory leaks (DevTools heap snapshots)
- [ ] No unnecessary re-renders (React DevTools profiler)

---

## 🎨 Visual/UX Checks

- [ ] Colors match design (gold #d4af37, midnight #1a1a3e)
- [ ] Dark mode works correctly
- [ ] Status badges are clearly color-coded
- [ ] Progress bars are smooth and accurate
- [ ] Icons are consistent (from lucide-react)
- [ ] Spacing/padding is consistent (Tailwind)
- [ ] Font sizes are legible on mobile
- [ ] Buttons are touch-friendly (min 44px)
- [ ] Forms are validated before submit
- [ ] Success/error messages are clear
- [ ] Loading states shown (spinners, skeleton screens)

---

## ✅ Sign-Off

When all tests pass:

- [ ] Feature ready for production
- [ ] Code reviewed
- [ ] Documentation complete
- [ ] Client communication ready
- [ ] Deployment scheduled

