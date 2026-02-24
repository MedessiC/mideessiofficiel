# 🚀 MIDEESSI V3 - Feuille de Route Officielle

## Passer d'une plateforme d'apprentissage à un **Marketplace d'e-books africain**

**Version**: 3.0 (Vision 2026)  
**Statut**: En planification  
**Date**: Février 2026

---

## 📊 VISION V3

### De: Plateforme d'apprentissage centralisée
### À: Écosystème décentralisé à deux côtés (Créateurs + Apprenants)

### Tagline
> "La plus grande plateforme d'apprentissage technologique africaine, créée par et pour les Africains"

**Core**: 
- 📚 Apprenants achètent/notent des PDFs
- ✍️ Créateurs publient leurs PDFs
- 💰 MIDEESSI prend commission (30%)
- 🏆 Système de badges + leaderboards
- 📱 PWA + App mobile offline
- 🔄 Croissance virale (créateurs = evangelists)

---

## 🏗️ ARCHITECTURE V3

```
MIDEESSI V3 Ecosystem
│
├─ Front-end
│  ├─ Web (React/Vite)
│  ├─ PWA (installable)
│  └─ Mobile (React Native - ultérieur)
│
├─ Back-end
│  ├─ Supabase (DB + Auth)
│  ├─ Paiement (Paytech/Moov Money)
│  ├─ Storage (PDFs, images)
│  └─ Admin panel modération
│
├─ Utilisateurs
│  ├─ Apprenants (lecteurs)
│  ├─ Créateurs (rédacteurs validés)
│  └─ Admin MIDEESSI (modération)
│
└─ Data
   ├─ PDFs + métadonnées
   ├─ Purchases + receipts
   ├─ Reviews + ratings
   ├─ User profiles + stats
   ├─ Leaderboards
   └─ Business metrics
```

---

## 📅 PHASES DE DÉVELOPPEMENT

### **PHASE 1: MVP APPRENANTS (Semaines 1-3)**
**Objectif**: Rendre la plateforme d'apprentissage fully functional
**Effort**: ~80 heures dev

#### ✅ A1.1 - Système d'authentification complète
```
- Sign up avec email (avec validation)
- Login/Logout
- Forgot password (reset email)
- Profile utilisateur (avatar, bio, email)
- Session persistence
- Google/GitHub auth (optionnel)
```
**Files à créer/modifier**:
- `src/pages/SignUp.tsx` (NEW)
- `src/pages/Login.tsx` (NEW)
- `src/pages/Profile.tsx` (NEW)
- `src/components/AuthGuard.tsx` (NEW)
- Supabase auth setup
**Temps**: 15h
**KPI**: 0% drop-off sur signup

#### ✅ A1.2 - Système d'achat PDFs
```
- Intégrer Paytech/Moov Money
- Button "Acheter" fonctionnel
- Confirmer paiement
- Télécharger PDF après achat
- Historique achats (My Library)
```
**Files à créer**:
- `src/pages/Checkout.tsx` (NEW)
- `src/components/PaymentModal.tsx` (NEW)
- `src/pages/MyLibrary.tsx` (MODIFY)
- Intégration Paytech API
**Temps**: 20h
**KPI**: AOV (Average Order Value), conversion rate

#### ✅ A1.3 - Système de ratings & reviews
```
- ⭐ Rating (1-5 stars)
- 📝 Commentaire texte
- Date du review
- Afficher moyenne + total reviews
- Trier PDFs par rating
```
**Files à créer**:
- `src/components/RatingStars.tsx` (NEW)
- `src/components/PDFReviewSection.tsx` (NEW)
- `src/pages/PDFDetail.tsx` (MODIFY)
**Tables Supabase**:
- `reviews` (id, user_id, pdf_id, rating, comment, created_at)
- Ajouter `rating_avg`, `total_reviews` à table `books`
**Temps**: 12h
**KPI**: Avg rating, reviews per PDF

#### ✅ A1.4 - User stats & badges basiques
```
- Nombre PDFs achetés
- PDFs en favori
- Moyenne mes notes
- Progression (Lecteur Lvl 1-3)
```
**Files à créer**:
- `src/pages/UserDashboard.tsx` (NEW)
- `src/components/UserStats.tsx` (NEW)
- `src/components/BadgeDisplay.tsx` (NEW)
**Tables Supabase**:
- `user_stats` (id, user_id, total_pdfs_bought, avg_rating_given, level, created_at)
**Temps**: 10h
**KPI**: User engagement score

### **PHASE 1 TOTAL**: 57h dev | ~5-6 jours (1 dev full-time)

---

### **PHASE 2: MVP CRÉATEURS (Semaines 4-6)**
**Objectif**: Permettre aux créateurs de publier des PDFs
**Effort**: ~85 heures dev

#### ✅ C2.1 - Formule d'upload créateur
```
- Formulaire créateur (inscription)
- Vérification email creator
- Upload PDF + image cover
- Titre, description, prix, catégorie, tags
- Aperçu avant soumission
- Guidelines de modération affichées
```
**Files à créer**:
- `src/pages/CreatorOnboarding.tsx` (NEW)
- `src/pages/UploadPDF.tsx` (NEW)
- `src/components/PDFUploadForm.tsx` (NEW)
- `src/pages/CreatorTerms.tsx` (NEW)
**Tables Supabase**:
- `pdf_submissions` (id, creator_id, title, description, price, image_url, pdf_url, status[draft/pending/approved/rejected], created_at)
**Temps**: 18h
**KPI**: PDF upload attempts, completion rate

#### ✅ C2.2 - Admin moderation panel
```
- Liste PDFs pending
- Preview PDF
- Boutons: Approver / Rejeter (avec raison)
- Upload à la liste publique
- Historique moderation
```
**Files à créer**:
- `src/pages/AdminModerationPanel.tsx` (NEW)
- `src/components/PDFReviewCard.tsx` (NEW)
- `src/pages/ModerationHistory.tsx` (NEW)
**Temps**: 15h
**KPI**: Moderation speed, approval rate

#### ✅ C2.3 - Creator dashboard
```
- Voir ses PDFs (publiés, pending, rejected)
- Stats par PDF (views, sales, rating, revenue)
- Graphique revenus par mois
- Notifications (PDF approuvé, première vente, etc)
```
**Files à créer**:
- `src/pages/CreatorDashboard.tsx` (NEW)
- `src/components/CreatorStats.tsx` (NEW)
- `src/components/PDFPerformanceCard.tsx` (NEW)
**Tables Supabase**:
- `creator_stats` (id, creator_id, total_revenue, total_pdfs, avg_rating, created_at)
- `pdf_sales` (id, pdf_id, creator_id, amount_fcfa, commission_fcfa, date)
**Temps**: 22h
**KPI**: Creator retention, avg revenue per creator

#### ✅ C2.4 - Système de commission & withdrawal
```
- Calculer commission (30% MIDEESSI, 70% créateur)
- Dashboard: "My earnings"
- Bouton "Retirer fonds"
- Intégrer Paytech/Moov Money pour virements
- Historique retraits
```
**Files à créer**:
- `src/pages/CreatorWithdrawal.tsx` (NEW)
- `src/components/CommissionBreakdown.tsx` (NEW)
- Intégration API Paytech (outgoing)
**Tables Supabase**:
- `withdrawals` (id, creator_id, amount_fcfa, status[pending/completed/failed], created_at)
**Temps**: 20h
**KPI**: Withdrawal success rate, avg payout

#### ✅ C2.5 - Creator profile public
```
- Page profil créateur (URL: /creator/[id])
- Bio + avatar
- Tous ses PDFs publiés
- Rating moyen, revenus, niveau
- Bouton "Suivre" (optionnel V3.1)
```
**Files à créer**:
- `src/pages/CreatorProfile.tsx` (NEW)
**Temps**: 10h
**KPI**: Creator profile views

### **PHASE 2 TOTAL**: 85h dev | ~7-8 jours (1 dev full-time)

---

### **PHASE 3: GAMIFICATION & SOCIAL (Semaines 7-9)**
**Objectif**: Rendre la plateforme addictive via badges, leaderboards
**Effort**: ~70 heures dev

#### ✅ G3.1 - Système de niveaux (Lecteurs)
```
Basé sur PDFs achetés:
- Niveau 1: 0-2 PDFs → "Découvreur"
- Niveau 2: 3-5 PDFs → "Apprenti"
- Niveau 3: 6-10 PDFs → "Expert"
- Niveau 4: 11-20 PDFs → "Maître"
- Niveau 5: 21+ PDFs → "Influenceur"

Affichage:
- Next to user name
- Badge visible sur profil
- Progress bar (3/5 PDFs pour passer au niveau suivant)
```
**Files à créer**:
- `src/utils/levelCalculator.ts` (NEW)
- `src/components/UserLevelBadge.tsx` (NEW)
**Temps**: 12h
**KPI**: Average user level progression

#### ✅ G3.2 - Badge system
```
Badges apprenants:
- 🚀 "First Purchase" (acheté le 1er PDF)
- ⭐ "Critiquer" (laissé 5 avis)
- 🎯 "Spécialiste [Catégorie]" (5 PDFs dans une catégorie)
- 💰 "Millionnaire" (dépensé 10M FCFA)
- 🏆 "Leaderboard Top 10" (chaque mois)

Badges créateurs:
- ✨ "Creator validé" (premier PDF approuvé)
- 💎 "Premium Creator" (100K+ revenus)
- 🔥 "Trending" (PDF dans top 10)
- 👑 "Best Educator" (rating 4.8+)
```
**Files à créer**:
- `src/components/BadgeCollection.tsx` (NEW)
- `src/utils/badgeChecker.ts` (NEW)
**Tables Supabase**:
- `badges` (id, name, description, icon_url)
- `user_badges` (id, user_id, badge_id, earned_at)
**Temps**: 15h
**KPI**: Badge earn rate, badge impact on retention

#### ✅ G3.3 - Leaderboards
```
LECTEURS - Mis à jour chaque mois:
1. "Top Buyers" - PDFs achetés ce mois
2. "Most Active Reviewers" - Nombre reviews ce mois
3. "Highest Rated Reviewers" - Moyenne rating de leurs reviews

CRÉATEURS - Mis à jour chaque mois:
1. "Top Earners" - Revenus ce mois
2. "Most Popular" - Nombre ventes ce mois
3. "Best Rated" - Rating moyen de leurs PDFs

Design:
- Top 10 affichés
- Ranking visible
- Award emoji (🥇🥈🥉)
- Temps réel ou cached daily?
```
**Files à créer**:
- `src/pages/Leaderboards.tsx` (NEW)
- `src/components/LeaderboardCard.tsx` (NEW)
**Tables Supabase**:
- `leaderboards_cache` (id, user_id, type[reader/creator], rank, value, month)
**Temps**: 18h
**KPI**: Leaderboard competitiveness score

#### ✅ G3.4 - Points system (optionnel)
```
Gagner points:
- Acheter PDF: +10 pts
- Laisser review: +5 pts
- Atteindre niveau: +bonus pts
- Partager PDF: +3 pts

Convertir en:
- Badge
- Discount (100 pts = 2% discount next purchase)
- Visibility boost pour créateurs
```
**Temps**: 12h
**KPI**: Points redemption rate

#### ✅ G3.5 - Notifications
```
- "Tu as atteint Niveau 3 🎉"
- "Un PDF que tu lis bien mérité 5⭐"
- "[Créateur] a publié un nouveau PDF"
- "Tu es entré au leaderboard!"
- "Retire tes gains! [montant]"

Type:
- In-app (bell icon)
- Email (digests)
- Sur mobile: push notifications
```
**Files à créer**:
- `src/components/NotificationBell.tsx` (NEW)
- `src/pages/Notifications.tsx` (NEW)
**Tables Supabase**:
- `notifications` (id, user_id, type, title, message, read, created_at)
**Temps**: 13h
**KPI**: Notification click-through rate

### **PHASE 3 TOTAL**: 70h dev | ~6-7 jours (1 dev full-time)

---

### **PHASE 4: PAIEMENT INTÉGRÉ & PWA (Semaines 10-12)**
**Objectif**: Offline support + real paiement intégré
**Effort**: ~60 heures dev

#### ✅ P4.1 - Intégration paiement complète
```
Paytech:
- Test mode ✓
- Production API
- Webhook handling (confirmer payments)
- Retry logic (si paiement échoue)

Moov Money:
- Integration API
- Test mode
- Production

Payment history:
- Invoices PDF
- Receipt email
```
**Temps**: 18h
**KPI**: Payment success rate, fraud detection

#### ✅ P4.2 - PWA (Progressive Web App)
```
- Installable sur home screen
- Offline mode (PDFs cached)
- Notification push
- Dark mode persistant
- Génération manifest.json
```
**Files à créer**:
- `public/manifest.json` (NEW)
- `src/service-worker.ts` (NEW)
- `src/utils/offlineCache.ts` (NEW)
**Temps**: 15h
**KPI**: PWA installation rate, offline usage

#### ✅ P4.3 - Email automations
```
- Transactional (receipt, password reset)
- Promotional (new PDFs, sales, leaderboard)
- Weekly digest (les plus vendus, recommandations)
- Creator alerts (nouveau review, première vente)

Template:
- Responsive
- MIDEESSI branding
- CTA clear
```
**Integration**: SendGrid ou Resend
**Temps**: 12h
**KPI**: Email open rate, link click rate

#### ✅ P4.4 - Analytics & Admin dashboard
```
Metrics clés:
- Total GMV (Gross Merchandise Value)
- Total users, creators, PDFs
- Revenue MIDEESSI
- Top PDFs, creators
- User acquisition source
- Churn rate

Dashboards:
- Real-time overview
- Detailed breakdowns
- Export reports
```
**Files à créer**:
- `src/pages/AdminAnalytics.tsx` (NEW)
- `src/components/AnalyticsCharts.tsx` (NEW)
**Temps**: 15h
**KPI**: Business intelligence accuracy

### **PHASE 4 TOTAL**: 60h dev | ~5-6 jours (1 dev full-time)

---

### **PHASE 5: SCALING & OPTIMIZATION (Semaines 13-16)**
**Objectif**: Performance, security, marketing
**Effort**: ~50 heures dev

#### ✅ S5.1 - Performance optimization
```
- Image optimization (WebP, lazy load)
- Code splitting (chunks)
- Database indexes
- Caching strategy (Redis optional)
- CDN for PDFs
- Metrics: Lighthouse > 90
```
**Temps**: 15h
**KPI**: Page load time < 2s, Lighthouse 90+

#### ✅ S5.2 - Security hardening
```
- SQL injection prevention (Supabase safe)
- XSS protection
- CSRF tokens
- Rate limiting
- API security
- PDF download tracking (anti-piracy)
```
**Temps**: 12h
**KPI**: 0 security incidents

#### ✅ S5.3 - Marketing features
```
- Referral system (Partage PDF = ganhe 10%)
- Social sharing buttons
- SEO optimization (schema markup)
- Viral loop (invite friends)
- Content recommendations
```
**Files à créer**:
- `src/components/ShareButtons.tsx` (MODIFY)
- `src/pages/ReferralProgram.tsx` (NEW)
**Temps**: 15h
**KPI**: Viral coefficient, referral conversion

#### ✅ S5.4 - Bug fixes & UX polish
```
- Collect feedback
- Fix reported bugs
- Improve user flows
- Accessibility (WCAG)
- Mobile UX refinement
```
**Temps**: 8h
**KPI**: Bug backlog < 10

### **PHASE 5 TOTAL**: 50h dev | ~4-5 jours (1 dev full-time)

---

## 📊 TIMELINE TOTAL

| Phase | Durée | Dev Hours | Prio | Status |
|-------|-------|----------|------|--------|
| **1: MVP Apprenants** | 6j | 57h | 🔴 CRITICAL | Non commencé |
| **2: MVP Créateurs** | 8j | 85h | 🔴 CRITICAL | Non commencé |
| **3: Gamification** | 7j | 70h | 🟡 HIGH | Non commencé |
| **4: Paiement + PWA** | 6j | 60h | 🟡 HIGH | Non commencé |
| **5: Scaling** | 5j | 50h | 🟢 MEDIUM | Non commencé |
| **TOTAL** | **32 jours** | **322h** | | Phase 0 |

**Timeline réaliste**:
- **1 dev full-time**: 6-7 semaines (32 jours = 4.5 semaines si vraiment full-time)
- **2 devs**: 3-4 semaines (paralléliser phases)
- **Avec QA + Design review**: +2 semaines

**Recommandation**: **2 devs min** pour paralléliser phases 1 & 2, puis 1 dev pour 3-5

---

## 💻 STACK TECHNIQUE

### Frontend
- React 18.3 + TypeScript (existing ✓)
- Tailwind CSS 3.4 (existing ✓)
- React Router v6 (existing ✓)
- Supabase client (existing ✓)

**Nouvelles libs à ajouter**:
- `react-star-ratings` (ratings)
- `recharts` (analytics charts)
- `date-fns` (date formatting)
- `react-hot-toast` (notifications)

### Backend
- Supabase PostgreSQL (existing ✓)
- Supabase Auth (existing ✓)
- Supabase Storage (existing ✓)

**Intégrations externes**:
- Paytech API (paiement)
- Moov Money API (paiement)
- SendGrid ou Resend (emails)
- Optional: Stripe (future)

### DevOps
- Vercel deployment (existing ✓)
- GitHub Actions (CI/CD)
- Sentry (error tracking) - optional

---

## 🎯 MILESTONES & KPIs

### Milestone 1 (End Phase 1)
```
✓ 100+ Users sign-up
✓ 20+ PDFs sold
✓ 90%+ Checkout completion
KPI: Signup conversion > 10%, Payment successful > 95%
```

### Milestone 2 (End Phase 2)
```
✓ 10+ Creators on platform
✓ 50+ PDFs published
✓ 10+ Creator withdrawals processed
KPI: Creator retention > 70%, PDF approval rate > 80%
```

### Milestone 3 (End Phase 3)
```
✓ 50%+ Users earned badge
✓ Top 10 leaderboard competitive
✓ 30%+ Increase in weekly active users
KPI: Engagement time +40%, Return rate > 60%
```

### Milestone 4 (End Phase 4)
```
✓ 5000+ PWA installs
✓ $5000+ Monthly revenue
✓ 100+ Automated emails sent daily
KPI: PWA install rate > 20%, Revenue on target
```

### Milestone 5 (End Phase 5)
```
✓ Lighthouse score 90+
✓ <1% Churn rate
✓ Viral loop established (referrals > 30% new users)
KPI: Sustainable growth, scalable infrastructure
```

---

## 🤔 QUESTIONS CRITIQUES À RÉSOUDRE

### Paiement
- [ ] Quelle provider en priorité? (Paytech + Moov ou autre?)
- [ ] Test account disponible?
- [ ] Frais bancaires? (Affecte commission 30/70?)
- [ ] Retrait minimum?

### Moderation
- [ ] Qui modère les PDFs? (Oscar + Richy full-time?)
- [ ] SLA moderation? (24h, 48h?)
- [ ] Critères d'acceptation? (Qualité min, pas de spam, etc)
- [ ] Système de drapeau (users reportent PDFs mauvais?)

### Pricing
- [ ] Prix de base 1000 FCFA pour tous?
- [ ] Créateurs peuvent varier le prix?
- [ ] Pas de discounts au launch?

### Community
- [ ] Modération des reviews? (anti-spam, anti-abuse?)
- [ ] Système de signaler un review toxique?
- [ ] Comments anonymes ou avec nom?

### Growth
- [ ] Budget marketing launch?
- [ ] Influencers béninois approchés?
- [ ] Stratégie content (blog, TikTok, YouTube)?
- [ ] Partnerships écoles/universités?

---

## ✅ CHECKLIST PRÉ-LAUNCH

```
FRONTEND
├─ [ ] Toutes pages testées sur mobile + desktop
├─ [ ] Darkmode fonctionne partout
├─ [ ] Images optimisées
├─ [ ] Pas de console errors
├─ [ ] Accessibility checked (WCAG AA min)
└─ [ ] Performance Lighthouse 80+

BACKEND / DATA
├─ [ ] Toutes tables Supabase créées + indexes
├─ [ ] RLS (Row Level Security) configurée
├─ [ ] Backups Supabase automatiques
├─ [ ] API key SECURE (env variables)
└─ [ ] Test data populated

PAYMENT
├─ [ ] Paytech intégration testée (test mode)
├─ [ ] Webhooks working
├─ [ ] Error handling pour failed payments
├─ [ ] Invoice generation testé
└─ [ ] Payout flow testé end-to-end

MODÉRATION
├─ [ ] Admin panel responsive
├─ [ ] Moderation workflow documented
├─ [ ] Guidelines pour créateurs finalisées
└─ [ ] Auto-rejection rules (spam, etc)

MONITORING
├─ [ ] Sentry configuré (error tracking)
├─ [ ] Google Analytics setup
├─ [ ] Admin dashboard showing live metrics
├─ [ ] Alertes si down/errors
└─ [ ] Daily health check process

LAUNCH PREP
├─ [ ] Communications ready (email, social)
├─ [ ] First creators identified + onboarded
├─ [ ] Terms of Service finalized
├─ [ ] Privacy Policy updated
├─ [ ] Status page live (status.mideessi.io)
└─ [ ] Team trained on support
```

---

## 📈 SUCCESS METRICS (3 MOIS)

| Métrique | Target |
|----------|--------|
| Total Users | 1000+ |
| Creators | 50+ |
| Total PDFs | 200+ |
| Monthly Revenue | $1000+ (600K FCFA+) |
| User Retention (30d) | >40% |
| Creator Retention (90d) | >60% |
| Avg Order Value | 1500 FCFA |
| Net Promoter Score | >50 |
| Leaderboard participation | >60% |

---

## 🔄 NEXT STEPS

1. **Valider questions critiques** (paiement, moderation, pricing)
2. **Setup Supabase tables** (DBA task)
3. **Kick off Phase 1 dev** (assign to dev)
4. **Identify first 10 creators** (marketing task)
5. **Daily standups** (async + sync weekly)

---

## 📞 CONTACT & DECISIONS MAKER

- **Lead Dev**: ?
- **Product Owner**: Vous
- **Design**: ?
- **Moderation Lead**: Oscar? Richy?
- **Marketing**: ?

---

**Version**: 1.0  
**Last updated**: Feb 18, 2026  
**Next review**: After Phase 1 completion
