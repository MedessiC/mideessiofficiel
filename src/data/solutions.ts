export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string; // nom de l'icone lucide-react
}

export type SolutionCategory = 'communication' | 'gastronomie' | 'agriculture' | 'finance' | 'education' | 'autre';

export interface Solution {
  id: string;
  name: string;
  slug: string;
  category: SolutionCategory;
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  logo: string;
  website: string;
  status: 'Disponible' | 'En cours' | 'En développement' | 'Planifié';
  launchDate: string;
  targetAudience: string[];
  features: Feature[];
  benefits: string[];
  technologies: string[];
  stats?: {
    label: string;
    value: string;
  }[];
  cta: {
    text: string;
    url: string;
  };
  contact: {
    email: string;
    whatsapp?: string;
  };
}

export interface SolutionCategoryInfo {
  id: SolutionCategory;
  name: string;
  description: string;
  iconName: string; // nom de l'icone lucide-react
  color: string;
}

export const categories: SolutionCategoryInfo[] = [
  {
    id: 'communication',
    name: 'Communication & Internet',
    description: 'Économise sur ton forfait. De la vraie connexion sans te ruiner.',
    iconName: 'Smartphone',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'gastronomie',
    name: 'Gastronomie & Loisirs',
    description: 'Goûte le meilleur de la bouffe béninoise. Des moments chill, des saveurs vraies.',
    iconName: 'UtensilsCrossed',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Agritech',
    description: 'La ferme 2.0. Tech qui aide les paysans à gagner plus et mieux.',
    iconName: 'Leaf',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'finance',
    name: 'Finance & Microfinance',
    description: 'Ton argent. Ta décision. Des solutions simple pour gérer et se développer.',
    iconName: 'Wallet',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'education',
    name: 'Éducation & Apprentissage',
    description: 'Apprends sur ton téléphone. Des skills qui servent vraiment. Accessible partout.',
    iconName: 'BookOpen',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'autre',
    name: 'Autres Solutions',
    description: 'Des trucs innovants qui changent la donne. Reste à l\'affût.',
    iconName: 'Sparkles',
    color: 'from-gray-500 to-slate-600'
  }
];

// MIKPLE Solution
export const mikpleSolution: Solution = {
  id: 'mikple',
  name: 'MIKPLÉ',
  slug: 'mikple',
  category: 'communication',
  tagline: 'Forfaits Moov Famille accessibles à tous les Béninois',
  description: 'Rejoignez des groupes familiaux Moov et économisez jusqu\'à 40% sur vos forfaits internet',
  longDescription: 'MIKPLÉ est une plateforme 100% béninoise qui vous connecte facilement aux forfaits Moov Famille sans les contraintes habituelles. Économisez jusqu\'à 40% sur vos forfaits internet en partageant avec votre famille. Une solution simple, rapide et sécurisée pour tous les Béninois.',
  image: 'https://images.unsplash.com/photo-1516534775068-bb57ce3b5d83?w=1200&h=600&fit=crop',
  logo: 'https://via.placeholder.com/200?text=MIKPL%C3%89',
  website: 'https://mikple.netlify.app',
  status: 'Disponible',
  launchDate: '2025',
  targetAudience: [
    'Familles béninoises',
    'Utilisateurs Moov',
    'Chercheurs d\'économies',
    'Groupes d\'amis',
    'PME et petits commerces',
    'Tous les Béninois'
  ],
  features: [
    {
      id: 'shared-plan',
      title: 'Forfait Partagé',
      description: 'Partagez un forfait internet avec votre famille et économisez jusqu\'à 40%',
      iconName: 'Users'
    },
    {
      id: 'simple-quick',
      title: 'Simple & Rapide',
      description: 'Inscription en quelques clics. Pas de compte à créer, pas de paperasse',
      iconName: 'Zap'
    },
    {
      id: 'guaranteed-savings',
      title: 'Économies Garanties',
      description: 'Profitez des tarifs famille sans les contraintes. Plus besoin de chercher 4 membres',
      iconName: 'TrendingDown'
    },
    {
      id: 'secure-service',
      title: 'Service Sécurisé',
      description: 'Vos données sont protégées. MIKPLÉ est un service de confiance par MIDEESSI',
      iconName: 'Lock'
    },
    {
      id: 'moov-integration',
      title: 'Intégration Moov',
      description: 'Connexion directe avec l\'opérateur Moov pour une gestion simplifiée',
      iconName: 'Link'
    },
    {
      id: 'whatsapp-support',
      title: 'Support WhatsApp',
      description: 'Assistance disponible via WhatsApp pour vos questions et demandes',
      iconName: 'MessageCircle'
    }
  ],
  benefits: [
    'Économisez jusqu\'à 40% sur vos forfaits internet Moov Famille',
    'Pas de paperasse - Inscription en quelques clics seulement',
    'Aucun engagement ou contrat long terme',
    'Contacting dans 24h pour finaliser votre inscription',
    'Support client disponible via WhatsApp',
    'Solution 100% béninoise développée par MIDEESSI'
  ],
  technologies: ['React', 'Node.js', 'Netlify', 'JavaScript'],
  stats: [
    { label: 'Béninois Utilisateurs', value: '100+' },
    { label: 'Économies Moyennes', value: '40%' },
    { label: 'Temps d\'Inscription', value: '< 5 min' },
    { label: 'Satisfaction Client', value: '100%' }
  ],
  cta: {
    text: 'S\'inscrire maintenant',
    url: 'https://mikple.netlify.app'
  },
  contact: {
    email: 'contact@mideessi.com',
    whatsapp: '+229 64 40 96 91'
  }
};

// EKPE Solution
export const ekpeSolution: Solution = {
  id: 'ekpe',
  name: 'EKPE',
  slug: 'ekpe',
  category: 'gastronomie',
  tagline: 'Trouvez le restaurant parfait en entrant votre budget et le nombre de personnes',
  description: 'Entrez votre budget et le nombre de personnes pour découvrir les menus adaptés à Cotonou',
  longDescription: 'EKPE est une plateforme intelligente qui recommande les menus et plats parfaits selon votre budget total et votre nombre de personnes. Entrez simplement votre budget et le nombre de convives, et EKPE vous propose instantanément les restaurants et plats adaptés dans votre quartier. Une solution 100% béninoise créée par MIDEESSI pour dénicher les meilleures adresses culinaires de Cotonou.',
  image: 'https://images.unsplash.com/photo-1504674900769-8f8aa25a0e65?w=1200&h=600&fit=crop',
  logo: 'https://via.placeholder.com/200?text=EKPE',
  website: 'https://ekpe.mideessi.com',
  status: 'Disponible',
  launchDate: '2025',
  targetAudience: [
    'Habitants de Cotonou',
    'Touristes et visiteurs',
    'Familles cherchant des restaurants',
    'Groupes d\'amis',
    'Hommes d\'affaires',
    'Tous les Béninois'
  ],
  features: [
    {
      id: 'budget-calculator',
      title: 'Calculateur de Budget Intelligent',
      description: 'Entrez votre budget total et le nombre de personnes pour des recommandations précises',
      iconName: 'Calculator'
    },
    {
      id: 'personalized-menus',
      title: 'Menus Adaptés',
      description: 'Découvrez les plats et menus qui correspondent exactement à votre budget par personne',
      iconName: 'UtensilsCrossed'
    },
    {
      id: 'neighborhood-search',
      title: 'Recherche par Quartier',
      description: 'Propositions adaptées selon le quartier de Cotonou où vous êtes',
      iconName: 'MapPin'
    },
    {
      id: 'restaurant-ratings',
      title: 'Évaluations & Avis',
      description: 'Consultez les notes et avis des clients pour choisir en confiance',
      iconName: 'Star'
    },
    {
      id: 'local-cuisine',
      title: 'Cuisine Locale 100%',
      description: 'Découvrez l\'authenticité culinaire béninoise avec des plats traditionnels',
      iconName: 'Leaf'
    },
    {
      id: 'instant-recommendations',
      title: 'Recommandations Instantanées',
      description: 'Obtenez les meilleures propositions en quelques secondes',
      iconName: 'Zap'
    }
  ],
  benefits: [
    'Entrez budget + nombre de personnes = propositions de plats adaptés instantanément',
    'Découvrez 50+ restaurants vérifiés dans 9 quartiers de Cotonou',
    'Menus détaillés avec prix pour tous les budgets',
    'Évaluations moyennes de 4.5 étoiles - restaurants de qualité',
    '100% local - soutien à l\'entrepreneuriat béninois',
    'Solution créée par MIDEESSI, le mouvement d\'indépendance technologique béninoise'
  ],
  technologies: ['React', 'Node.js', 'Netlify', 'JavaScript'],
  stats: [
    { label: 'Restaurants Listés', value: '50+' },
    { label: 'Quartiers Couverts', value: '9' },
    { label: 'Note Moyenne', value: '4.5/5' },
    { label: 'Restaurants Locaux', value: '100%' }
  ],
  cta: {
    text: 'Découvrir les restaurants',
    url: 'https://ekpe.mideessi.com'
  },
  contact: {
    email: 'contact@mideessi.com',
    whatsapp: '+229 01 64 40 96 91'
  }
};

export const solutions: Solution[] = [mikpleSolution, ekpeSolution];

export const getSolutionBySlug = (slug: string): Solution | undefined => {
  return solutions.find(s => s.slug === slug);
};

export const getSolutionsByCategory = (category: SolutionCategory): Solution[] => {
  return solutions.filter(s => s.category === category);
};

export const getSolutionsByCategories = (): { category: SolutionCategoryInfo; solutions: Solution[] }[] => {
  return categories
    .map(cat => ({
      category: cat,
      solutions: getSolutionsByCategory(cat.id)
    }))
    .filter(item => item.solutions.length > 0);
};

export const getCategoryInfo = (id: SolutionCategory): SolutionCategoryInfo | undefined => {
  return categories.find(c => c.id === id);
};
