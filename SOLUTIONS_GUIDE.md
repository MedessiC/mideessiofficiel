# Guide de Gestion des Solutions - MIKPLE et EKPE

## 📋 Vue d'ensemble

Ce guide explique comment mettre à jour les informations sur les deux solutions principales : **MIKPLE** et **EKPE**.

## 📁 Structure des fichiers

```
src/
├── pages/
│   ├── Solutions.tsx          # Page d'accueil des solutions
│   ├── SolutionDetail.tsx     # Page de détail pour chaque solution
│   └── Projects.tsx           # Page des projets (anciennes solutions)
├── components/
│   └── SolutionCard.tsx       # Composant réutilisable pour afficher une solution
└── data/
    └── solutions.ts           # 📌 Données principales (À MODIFIER)
```

## 🔧 Mettre à jour les données des solutions

### Fichier à éditer : `src/data/solutions.ts`

Ce fichier contient toutes les informations sur MIKPLE et EKPE. Voici comment le mettre à jour :

### 1. **MIKPLE** - Plateforme de Microfinance

```typescript
export const mikpleSolution: Solution = {
  id: 'mikple',
  name: 'MIKPLE',
  slug: 'mikple',
  tagline: 'Plateforme de gestion intelligente des microcrédits',
  description: 'Description courte affichée sur les cartes',
  longDescription: 'Description longue affichée sur la page de détail',
  image: 'https://lien-vers-image.jpg',
  logo: 'https://lien-vers-logo.jpg',
  website: 'https://mikple.com',  // Lien vers le site officiel
  status: 'Disponible', // Disponible | En cours | En développement | Planifié
  launchDate: '2024',
  targetAudience: [
    'Institutions de microfinance',
    'Coopératives d\'épargne-crédit',
    // ...
  ],
  features: [
    {
      id: 'feature-id',
      title: 'Titre de la feature',
      description: 'Description détaillée',
      icon: '💰' // Emoji
    },
    // ...
  ],
  benefits: [
    'Avantage 1',
    'Avantage 2',
    // ...
  ],
  technologies: ['Node.js', 'React', 'PostgreSQL', // ...],
  stats: [
    { label: 'Métrique 1', value: '50+' },
    { label: 'Métrique 2', value: '100K+' },
    // ...
  ],
  contact: {
    email: 'contact@mikple.com',
    whatsapp: '+229 XXX XXX XXX'
  }
};
```

### 2. **EKPE** - Plateforme Agricole

Même structure que MIKPLE, avec des informations spécifiques à EKPE.

## 🌐 Récupérer les vraies données

### Option 1 : À partir de mikple.com
1. Visitez https://mikple.com
2. Collectez :
   - La description du service
   - Les features/fonctionnalités
   - Les avantages clés
   - Les statistiques
   - Les images (hébergez-les ou utilisez les URLs directes)

### Option 2 : À partir de ekpe.mideessi.com
1. Visitez https://ekpe.mideessi.com
2. Collectez les mêmes informations

## 📝 Champs à remplir

| Champ | Type | Description |
|-------|------|-------------|
| `name` | string | Nom de la solution (ex: "MIKPLE") |
| `slug` | string | Identifiant URL (ex: "mikple") |
| `tagline` | string | Phrase courte décrivant la solution |
| `description` | string | Description courte (100 caractères) |
| `longDescription` | string | Description longue (500+ caractères) |
| `image` | string (URL) | Image de couverture 1200x600px |
| `website` | string (URL) | URL du site officiel |
| `status` | enum | État de la solution |
| `targetAudience` | string[] | Liste des utilisateurs cibles |
| `features` | Feature[] | Fonctionnalités clés avec icons |
| `benefits` | string[] | Avantages mesurables |
| `technologies` | string[] | Stack technologique |
| `stats` | { label, value }[] | Statistiques clés |

## 🎨 Icônes pour les features

Utilisez des emojis pour les icons des features :

```
💰 Finance/Argent
📊 Données/Statistiques
📱 Mobile
🔒 Sécurité
📈 Croissance
👥 Communauté
🌤️ Météo
📍 Localisation
📚 Formation/Education
🏪 Marché/Commerce
🔗 Intégration
⚙️ Configuration
```

## 🔗 URLs des images

Pour les images, vous pouvez :
1. **Utiliser des images hébergées** : Placez les images sur un CDN ou Supabase Storage
2. **Générer des placeholders** : https://via.placeholder.com/1200x600?text=MIKPLE
3. **Utiliser Unsplash** : https://images.unsplash.com/photo-...

Exemple :
```typescript
image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=600&fit=crop'
```

## 🔄 Comment utiliser les données

### Dans la page Solutions
Les solutions s'affichent automatiquement avec les cartes :
```typescript
import { solutions } from '../data/solutions';

solutions.map(solution => <SolutionCard solution={solution} />)
```

### Dans la page de détail
```typescript
import { getSolutionBySlug } from '../data/solutions';

const solution = getSolutionBySlug('mikple');
```

## ✅ Checklist de mise à jour

- [ ] Récupérer toutes les informations de mikple.com
- [ ] Récupérer toutes les informations de ekpe.mideessi.com
- [ ] Mettre à jour `src/data/solutions.ts`
- [ ] Vérifier les URLs des images
- [ ] Ajouter les statistiques actualisées
- [ ] Ajouter les vraies coordonnées de contact
- [ ] Tester les pages :
  - [ ] `/solutions` (page d'accueil)
  - [ ] `/solutions/mikple` (détail MIKPLE)
  - [ ] `/solutions/ekpe` (détail EKPE)

## 🚀 Déployer les changements

Après les modifications :

1. Sauvegardez `src/data/solutions.ts`
2. Testez localement : `npm run dev`
3. Déployez sur Netlify

Les changements s'afficheront automatiquement sur :
- https://mideessi.com/solutions (page d'accueil)
- https://mideessi.com/solutions/mikple (détail MIKPLE)
- https://mideessi.com/solutions/ekpe (détail EKPE)

## 📞 Support

Si vous avez des questions ou besoin de modifications plus complexes, consultez :
- `src/pages/SolutionDetail.tsx` pour la mise en page
- `src/components/SolutionCard.tsx` pour la carte
- `src/pages/Solutions.tsx` pour la page d'accueil

---

**Dernière mise à jour :** Février 2026
