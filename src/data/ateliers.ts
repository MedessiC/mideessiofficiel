export interface Atelier {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  category: 'technologie' | 'business' | 'design' | 'marketing' | 'finance' | 'autre';
  image: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:mm
  duration: number; // en minutes
  location: string;
  capacity: number;
  registered: number;
  language: 'Français' | 'Anglais' | 'Mixte';
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  instructor: {
    name: string;
    title: string;
    image: string;
    bio: string;
  };
  objectives: string[];
  program: {
    time: string;
    title: string;
    description: string;
  }[];
  prerequisites: string[];
  materials: string[];
  price: number;
  tags: string[];
  is_online: boolean;
  meet_link?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface AtelierCategory {
  id: 'technologie' | 'business' | 'design' | 'marketing' | 'finance' | 'autre';
  name: string;
  description: string;
  iconName: string;
}

export const atelierCategories: AtelierCategory[] = [
  {
    id: 'technologie',
    name: 'Technologie',
    description: 'Apprenez les dernières technologies et outils de développement',
    iconName: 'Code'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Stratégies et conseils pour développer votre entreprise',
    iconName: 'Briefcase'
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Maîtrisez l\'UX/UI et les tendances du design moderne',
    iconName: 'Palette'
  },
  {
    id: 'marketing',
    name: 'Marketing Digital',
    description: 'Techniques et stratégies du marketing digital',
    iconName: 'TrendingUp'
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Gestion financière et investissements',
    iconName: 'DollarSign'
  },
  {
    id: 'autre',
    name: 'Autre',
    description: 'Autres domaines et disciplines',
    iconName: 'Book'
  }
];

// Les ateliers viennent maintenant de Supabase - voir Ateliers.tsx et AtelierDetail.tsx
// Cette variable n'est utilisée que pour éviter les erreurs de compilation
export const ateliers: Atelier[] = [];

export const getAtelierBySlug = (slug: string): Atelier | undefined => {
  return ateliers.find(atelier => atelier.slug === slug);
};

export const getAteliersByCategory = (category: string): Atelier[] => {
  return ateliers.filter(atelier => atelier.category === category);
};

// Calculer les jours restants avant un atelier
export const getDaysRemaining = (date: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const atelierDate = new Date(date + 'T00:00:00');
  atelierDate.setHours(0, 0, 0, 0);
  const diffTime = atelierDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Vérifier si un atelier est passé
export const isAtelierPassed = (date: string): boolean => {
  return getDaysRemaining(date) < 0;
};

// Obtenir le statut du comptage
export const getCountdownStatus = (date: string): 'passed' | 'today' | 'tomorrow' | 'soon' | 'later' => {
  const days = getDaysRemaining(date);
  if (days < 0) return 'passed';
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days <= 7) return 'soon';
  return 'later';
};
