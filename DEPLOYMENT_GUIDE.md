# 🚀 Guide de Déploiement - Espace Client MIDEESSI

## Phase 1: Déploiement de la Base de Données

### Étape 1.1 - Exécuter la Migration Supabase

1. **Accédez au dashboard Supabase**:
   - Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sélectionnez votre projet MIDEESSI

2. **Ouvrez l'éditeur SQL**:
   - Cliquez sur "SQL Editor" dans la sidebar gauche
   - Cliquez sur "New Query"

3. **Copiez le contenu de la migration**:
   - Ouvrez le fichier `/supabase/migrations/20260414_create_clients_system.sql`
   - Copiez TOUT le contenu

4. **Collez et exécutez**:
   - Collez le contenu dans l'éditeur SQL de Supabase
   - Cliquez sur le bouton **RUN** en bas à droite
   - Attendez la confirmation "Success"

5. **Vérifiez les tables créées**:
   - Allez dans la section "Tables" du dashboard
   - Vérifiez que ces 6 tables existent:
     - ✅ `clients`
     - ✅ `client_infos`
     - ✅ `kpis`
     - ✅ `calendrier_editorial`
     - ✅ `rapports`
     - ✅ `messages`

### Étape 1.2 - Vérifier les Policies RLS

1. Cliquez sur chaque table
2. Allez dans l'onglet "RLS Policies"
3. Vérifiez qu'il y a des policies pour:
   - `SELECT` (lecture)
   - `INSERT` (création)
   - `UPDATE` (modification)
   - `DELETE` (suppression)

**❗ IMPORTANT**: Vérifiez que "Enable RLS" est activé pour chaque table.

---

## Phase 2: Premier Test - Créer un Client

### Étape 2.1 - Accédez au Panel Admin

1. **Lancez votre application**:
   ```bash
   npm run dev
   ```

2. **Allez dans Admin**:
   - Ouvrez [http://localhost:5173/admin](http://localhost:5173/admin)
   - Connectez-vous avec vos identifiants admin

3. **Naviguez à Clients**:
   - Dans la navbar admin, cliquez sur l'onglet **"Gestion Clients"**
   - Vous devriez voir le formulaire "Nouveau Client"

### Étape 2.2 - Créez un Client Test

1. **Cliquez sur "Nouveau Client"**
2. **Remplissez le formulaire**:
   ```
   Nom de marque: Mon Entreprise Test
   Responsable: Jean Dupont
   Email: jean@test.fr
   Pack: Pack Premium
   N° Contrat: TEST-001
   Date Début: Aujourd'hui
   Durée (mois): 12
   Période de test: Non
   ```

3. **Cliquez sur "Créer Client"**
   - Le client_id devrait être généré automatiquement (JASI-001)
   - Un mot de passe temporaire devrait être généré
   - Une modal devrait afficher les credentials avec boutons Copier

4. **Sauvegardez les credentials**:
   - **Email**: jean@test.fr
   - **Mot de passe temporaire**: (visible dans la modal)
   - **Client ID**: JASI-001

---

## Phase 3: Test de la Connexion Client

### Étape 3.1 - Accédez à la Page Login Client

1. **Ouvrez un nouvel onglet incognito** (pour éviter la session admin)
2. **Allez sur** [http://localhost:5173/clients](http://localhost:5173/clients)
3. Vous devriez voir la page de login avec:
   - Champ Email
   - Champ Mot de passe avec toggle show/hide
   - Lien "Besoin d'aide ?"

### Étape 3.2 - Connectez le Client Test

1. **Saisissez les credentials**:
   - Email: `jean@test.fr`
   - Mot de passe: (celui généré par le système)

2. **Cliquez sur "Se connecter"**
3. ✅ Vous devriez être redirigé vers `/clients/onboarding`

### Étape 3.3 - Complétez l'Onboarding

1. **Slide 1 - Accueil**:
   - Doit afficher "Bienvenue Jean!"
   - Doit afficher "Client ID: JASI-001"
   - Doit afficher le pack souscrit
   - Cliquez "Suivant"

2. **Slide 2 - Vos Informations**:
   - Explique la nécessité de remplir le formulaire
   - Cliquez "Suivant"

3. **Slide 3 - Performances**:
   - Explique les KPIs disponibles
   - Cliquez "Suivant"

4. **Slide 4 - Calendrier**:
   - Explique le calendrier éditorial
   - Cliquez "Terminer"

5. ✅ Vous devriez être redirigé vers `/clients/dashboard`

---

## Phase 4: Test du Dashboard Client

### Étape 4.1 - Accueil (Home)

1. **Vous débouchez sur la section "Accueil"**
2. **Vérifiez les informations affichées**:
   - ✅ Bienvenue Jean!
   - ✅ Pack: Pack Premium
   - ✅ Numero Contrat: TEST-001
   - ✅ Statut: Actif
   - ✅ Dates: Aujourd'hui → Aujourd'hui + 12 mois
   - ✅ Type: Engagement ferme

### Étape 4.2 - Mes Informations

1. **Cliquez sur "Mes informations"** dans la sidebar
2. **Vous devriez voir un formulaire vide** avec:
   - Section Activité (description, produits)
   - Section Couleurs (palette hexadécimale)
   - Section Logo (upload ou URL)
   - Section Ton (checkboxes Luxe/Accessible/Familial/Professionnel)
   - Section Réseaux (Facebook/TikTok URLs + credentials chiffrés)
   - Section Supplémentaires (promotions, contact d'urgence)

3. **Remplissez le formulaire complètement**:
   ```
   Description: Ma jolie entreprise
   Produits: Vêtements, Accessoires
   Couleurs: #FF1493, #00CED1
   Ton: Luxe,Professionnel
   Facebook: https://facebook.com/...
   TikTok: https://tiktok.com/@...
   Credentials: (visible toggle)
   ```

4. **Cliquez "Envoyer"**
   - ✅ Message "Informations enregistrées"
   - Les credentials doivent être chiffrés avant envoi
   - Le formulaire passe en mode lecture seule

### Étape 4.3 - Performances (KPIs)

1. **Cliquez sur "Performances"** dans la sidebar
2. **Vous devriez voir**:
   - Sélecteur de mois (avec flèches prev/next)
   - 4 cartes KPI: Publications/Engagement/Followers/Messages
   - Section Budget: Alloué vs Dépensé

3. **Note**: Les KPIs afficheront 0 tant que l'admin n'a pas rempli de données

### Étape 4.4 - Calendrier Éditorial

1. **Cliquez sur "Calendrier"** dans la sidebar
2. **Vous devriez voir**:
   - Sélecteur de mois
   - Tableau vide (admin remplit les données)

### Étape 4.5 - Rapports

1. **Cliquez sur "Rapports"** dans la sidebar
2. **Vous devriez voir un message vide**: "Aucun rapport"

### Étape 4.6 - Messages

1. **Cliquez sur "Messages"** dans la sidebar
2. **Vous devriez voir**:
   - Zone de conversation vide
   - Champ de saisie en bas
   - Bouton "Envoyer"

3. **Saisissez un test**: "Coucou, c'est mon premier message!"
4. **Cliquez "Envoyer"**
   - ✅ Le message devrait apparaître à droite
   - ✅ La timestamp devrait s'afficher
   - ✅ L'entrée devrait se vider

---

## Phase 5: Test Admin - Gestion des KPIs

### Étape 5.1 - Accédez à l'Admin

1. **Ouvrez une nouvelle session admin** (revenez au tab admin)
2. **Allez dans l'onglet "Gestion Clients"**

### Étape 5.2 - Gérez les KPIs du Client

**FUTURE** - Cette fonctionnalité est en développement.
Pour maintenant, utilisez directement Supabase:

1. **Allez dans le dashboard Supabase**
2. **Table "kpis"**
3. **Insérez des données de test**:
   ```sql
   INSERT INTO kpis (client_id, month, publications, publications_target, engagement_rate, new_followers, generated_messages, budget_allocated, budget_spent)
   VALUES ('JASI-001', '2025-01', 14, 16, 3.5, 50, 120, 500, 350);
   ```

4. **Rafraîchissez le dashboard client**
   - ✅ Les KPIs devraient s'afficher

---

## Phase 6: Checklist de Validation

- [ ] Migration Supabase exécutée avec succès
- [ ] 6 tables créées dans Supabase
- [ ] RLS activé sur les 6 tables
- [ ] Admin peut créer un client
- [ ] Client ID auto-généré (JASI-001)
- [ ] Mot de passe auto-généré
- [ ] Client peut se connecter
- [ ] Onboarding affiche correctement
- [ ] Dashboard affiche les 6 sections
- [ ] Formulaire infos peut être rempli
- [ ] Credentials sont chiffrés
- [ ] Client peut envoyer un message
- [ ] KPIs s'affichent avec données

---

## 🔧 Dépannage

### Problème: "Table 'clients' doesn't exist"
- ✅ La migration n'a pas été exécutée
- **Solution**: Allez à l'Étape 1.1 et exécutez la migration

### Problème: Login échoue (Invalid login credentials)
- Vérifiez que:
  - L'email est exactement celui du client
  - Le mot de passe est celui généré par le système
  - RLS est activé sur la table `clients`

### Problème: Credentials ne sont pas chiffrés
- Vérifiez que `encryptionUtils.ts` est importé dans `ClientInfoForm.tsx`
- Regardez la console pour les erreurs

### Problème: Les messages n'apparaissent pas en temps réel
- Vérifiez que Supabase Realtime est activé
- Dans Supabase Dashboard → Settings → Realtime
- Vérifiez que la table `messages` est activée pour Realtime

### Problème: RLS bloque les opérations
- Allez vérifier les policies dans Supabase
- Tests utiles:
  ```sql
  -- Voir qui peut lire quoi
  SELECT * FROM messages WHERE client_id = 'JASI-001';
  ```

---

## 📞 Support

Si vous rencontrez des problèmes:

1. **Regardez les logs du navigateur** (F12 → Console)
2. **Regardez les logs Supabase** (Dashboard → Logs)
3. **Consultez la documentation** dans `CLIENTS_SYSTEM_DOCUMENTATION.md`

---

## ✅ Phase Suivante

Une fois tous les tests passés:

1. **Mettez en place l'envoi d'emails** (SendGrid/Mailgun)
   - Les clients reçoivent leur email login
   - Notification quand admin envoie un message

2. **Améliorez la sécurité**:
   - Intégrer libsodium.js au lieu de XOR
   - Ajouter 2FA
   - Ajouter password reset

3. **Publiez en production**:
   - Testez sur le vrai domaine mideessi.com
   - Vérifiez HTTPS
   - Testez depuis différents appareils

---

**Documents associés**:
- [CLIENTS_SYSTEM_DOCUMENTATION.md](CLIENTS_SYSTEM_DOCUMENTATION.md) - Documentation complète
- [supabase/migrations/20260414_create_clients_system.sql](/supabase/migrations/20260414_create_clients_system.sql) - Schéma DB

