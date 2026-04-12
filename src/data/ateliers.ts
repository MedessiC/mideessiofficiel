export interface Atelier {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
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
  testimonials?: {
    author: string;
    role: string;
    text: string;
    rating: number;
  }[];
  isOnline: boolean;
  meetLink?: string;
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

export const ateliers: Atelier[] = [
  {
    id: 'atelier-1',
    title: 'Web Development avec React & TypeScript',
    slug: 'web-development-react-typescript',
    description: 'Maîtrisez les bases et avancées de React avec TypeScript',
    longDescription: 'Un atelier complet pour apprendre à développer des applications web modernes avec React et TypeScript. Parfait pour les débutants et les développeurs intermédiaires.',
    category: 'technologie',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    date: '2026-04-18',
    time: '14:00',
    duration: 180,
    location: 'Cotonou, Studio MIDEESSI',
    capacity: 30,
    registered: 18,
    language: 'Français',
    level: 'Intermédiaire',
    instructor: {
      name: 'Amadou Sy',
      title: 'Senior Developer @ MIDEESSI',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      bio: 'Développeur passionné avec 10 ans d\'expérience en développement web'
    },
    objectives: [
      'Comprendre les concepts fondamentaux de React',
      'Maitriser les hooks et la gestion d\'état',
      'Apprendre TypeScript pour un code type-safe',
      'Créer une application complète'
    ],
    program: [
      {
        time: '14:00 - 14:30',
        title: 'Introduction et setup',
        description: 'Installation des outils et configuration du projet'
      },
      {
        time: '14:30 - 15:30',
        title: 'React Concepts',
        description: 'Components, JSX, Props et State'
      },
      {
        time: '15:30 - 15:45',
        title: 'Pause',
        description: ''
      },
      {
        time: '15:45 - 17:00',
        title: 'Hands-on Project',
        description: 'Créez votre première application React'
      }
    ],
    prerequisites: [
      'Connaissance basique de JavaScript',
      'Familiarité avec HTML/CSS',
      'Éditeur de code installé (VS Code recommandé)'
    ],
    materials: [
      'Slide de présentation',
      'Dossier projet de démarrage',
      'Code snippets et ressources'
    ],
    price: 15000,
    tags: ['React', 'TypeScript', 'Web Development', 'JavaScript'],
    testimonials: [
      {
        author: 'Aïssatou Diallo',
        role: 'Développeuse Web',
        text: 'Un atelier très bien structuré! J\'ai appris beaucoup et l\'instructeur était très disponible et patient.',
        rating: 5
      }
    ],
    isOnline: false,
    status: 'upcoming'
  },
  {
    id: 'atelier-2',
    title: 'Marketing Digital pour PME',
    slug: 'marketing-digital-pme',
    description: 'Stratégies de marketing digital adaptées aux PME',
    longDescription: 'Découvrez comment utiliser les réseaux sociaux, l\'email marketing et l\'SEO pour développer votre PME à moindre coût.',
    category: 'marketing',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    date: '2026-04-23',
    time: '10:00',
    duration: 120,
    location: 'En ligne',
    capacity: 50,
    registered: 35,
    language: 'Français',
    level: 'Débutant',
    instructor: {
      name: 'Mariatou Diop',
      title: 'Marketing Manager @ MIDEESSI',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      bio: 'Experte en marketing digital avec 8 ans d\'expérience dans les startups africaines'
    },
    objectives: [
      'Créer une stratégie marketing efficace',
      'Maîtriser les réseaux sociaux',
      'Développer votre email marketing',
      'Optimiser votre présence en ligne'
    ],
    program: [
      {
        time: '10:00 - 10:30',
        title: 'Fondamentaux du Marketing Digital',
        description: 'Vue d\'ensemble et stratégies'
      },
      {
        time: '10:30 - 11:15',
        title: 'Réseaux Sociaux',
        description: 'Facebook, Instagram, TikTok & LinkedIn'
      },
      {
        time: '11:15 - 12:00',
        title: 'Email Marketing & Analytics',
        description: 'Mesurer vos résultats'
      }
    ],
    prerequisites: [
      'Avoir une PME ou entreprise (optionnel)',
      'Accès aux réseaux sociaux'
    ],
    materials: [
      'Template de stratégie marketing',
      'Checklist de marketing digital',
      'Ressources gratuites'
    ],
    price: 8000,
    tags: ['Marketing', 'Digital', 'PME', 'Réseaux Sociaux'],
    isOnline: true,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming'
  },
  {
    id: 'atelier-3',
    title: 'Design UX/UI pour Débutants',
    slug: 'design-uxui-debutants',
    description: 'Les principes fondamentaux du design UX/UI',
    longDescription: 'Apprenez à créer des interfaces utilisateur attractives et fonctionnelles. Aucune expérience préalable requise!',
    category: 'design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    date: '2026-04-25',
    time: '15:00',
    duration: 150,
    location: 'Cotonou, Studio MIDEESSI',
    capacity: 25,
    registered: 12,
    language: 'Français',
    level: 'Débutant',
    instructor: {
      name: 'Kofi Mensah',
      title: 'UX/UI Designer Lead @ MIDEESSI',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      bio: 'Designer talentueux avec plusieurs projets primés au niveau africain'
    },
    objectives: [
      'Comprendre les principes UX/UI',
      'Apprendre à utiliser Figma',
      'Créer des wireframes et mockups',
      'Présenter votre travail professionnellement'
    ],
    program: [
      {
        time: '15:00 - 15:30',
        title: 'Principes du Design',
        description: 'UX vs UI, Design Thinking'
      },
      {
        time: '15:30 - 16:30',
        title: 'Figma Essentials',
        description: 'Interface et fonctionnalités principales'
      },
      {
        time: '16:30 - 16:45',
        title: 'Pause',
        description: ''
      },
      {
        time: '16:45 - 17:30',
        title: 'Projet Pratique',
        description: 'Créer un design de page web'
      }
    ],
    prerequisites: [
      'Aucune expérience requise',
      'Accès ordinateur avec Figma (gratuit)'
    ],
    materials: [
      'Fichier Figma de démarrage',
      'Palette de couleurs recommandées',
      'Guide de typographie'
    ],
    price: 12000,
    tags: ['Design', 'UX/UI', 'Figma', 'Débutant'],
    isOnline: false,
    status: 'upcoming'
  },
  {
    id: 'atelier-4',
    title: 'Entrepreneuriat & Lever de Fonds',
    slug: 'entrepreneuriat-lever-fonds',
    description: 'Guide complet pour lancer votre startup et lever des fonds',
    longDescription: 'Découvrez comment structurer votre idée, créer un business plan et impressionner les investisseurs.',
    category: 'business',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    date: '2026-05-02',
    time: '11:00',
    duration: 180,
    location: 'Cotonou, Studio MIDEESSI',
    capacity: 40,
    registered: 28,
    language: 'Français',
    level: 'Intermédiaire',
    instructor: {
      name: 'Youssouf Osman',
      title: 'CEO & Founder MIDEESSI',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      bio: 'Entrepreneur à succès, mentor et investisseur en tech africaine'
    },
    objectives: [
      'Valider votre idée d\'affaires',
      'Créer un business plan solide',
      'Préparer un pitch winning',
      'Comprendre la levée de fonds'
    ],
    program: [
      {
        time: '11:00 - 11:45',
        title: 'Validation d\'Idée',
        description: 'Méthodes et outils'
      },
      {
        time: '11:45 - 12:30',
        title: 'Business Plan 101',
        description: 'Structure et éléments clés'
      },
      {
        time: '12:30 - 13:15',
        title: 'Pause Déjeuner',
        description: ''
      },
      {
        time: '13:15 - 14:00',
        title: 'Pitch et Présentation',
        description: 'Comment convaincre les investisseurs'
      },
      {
        time: '14:00 - 14:30',
        title: 'Q&A et Networking',
        description: ''
      }
    ],
    prerequisites: [
      'Avoir une idée ou un concept',
      'Volonté d\'entreprendre'
    ],
    materials: [
      'Template Business Plan',
      'Pitch deck exemple',
      'Liste d\'investisseurs africains'
    ],
    price: 20000,
    tags: ['Entrepreneuriat', 'Stratégie', 'Levée de Fonds', 'Business'],
    testimonials: [
      {
        author: 'Kembe Tagne',
        role: 'Founder TechHub',
        text: 'Cet atelier m\'ai permis de obtenir mon premier financement! Vraiment utile et inspirant.',
        rating: 5
      }
    ],
    isOnline: false,
    status: 'upcoming'
  },
  {
    id: 'atelier-5',
    title: 'Introduction à Python pour Data Science',
    slug: 'python-data-science',
    description: 'Apprenez Python et analysez des données réelles',
    longDescription: 'Un atelier pratique pour débuter en Python avec focus sur les libraries de data science (Pandas, NumPy, Matplotlib). Idéal pour les débutants qui veulent se lancer en data science.',
    category: 'technologie',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    date: '2026-04-19',
    time: '10:00',
    duration: 180,
    location: 'Cotonou, Studio MIDEESSI',
    capacity: 20,
    registered: 8,
    language: 'Français',
    level: 'Débutant',
    instructor: {
      name: 'Dr. Fatoumata Ba',
      title: 'Data Scientist @ MIDEESSI',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      bio: 'Experte en data science avec 7 ans d\'expérience dans l\'IA et le machine learning'
    },
    objectives: [
      'Maîtriser les bases de Python',
      'Utiliser Pandas pour manipuler les données',
      'Créer des visualisations avec Matplotlib',
      'Analyser des datasets réels'
    ],
    program: [
      {
        time: '10:00 - 10:30',
        title: 'Introduction Python',
        description: 'Syntaxe et structures de données'
      },
      {
        time: '10:30 - 11:30',
        title: 'Pandas et Numpy',
        description: 'Manipulation de données'
      },
      {
        time: '11:30 - 11:45',
        title: 'Pause',
        description: ''
      },
      {
        time: '11:45 - 13:00',
        title: 'Visualisation et Analyse',
        description: 'Matplotlib et exploration de données'
      }
    ],
    prerequisites: [
      'Aucune expérience requise',
      'Ordinateur avec Python installé'
    ],
    materials: [
      'Jupyter Notebook de démarrage',
      'Datasets pour pratique',
      'Guide Python PDF'
    ],
    price: 18000,
    tags: ['Python', 'Data Science', 'Pandas', 'NumPy', 'Débutant'],
    testimonials: [
      {
        author: 'Ahmed Boutaine',
        role: 'Développeur Backend',
        text: 'Excellente introduction à Python et data science. Les exercices pratiques étaient très utiles!',
        rating: 5
      }
    ],
    isOnline: false,
    status: 'upcoming'
  },
  {
    id: 'atelier-6',
    title: 'Mobile App Development avec Flutter',
    slug: 'mobile-flutter',
    description: 'Créez des apps mobiles pour iOS et Android',
    longDescription: 'Apprenez Flutter, le framework révolutionnaire de Google pour développer des applications mobiles cross-platform. Une formation pratique avec projets concrets.',
    category: 'technologie',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    date: '2026-04-26',
    time: '14:00',
    duration: 210,
    location: 'En ligne',
    capacity: 35,
    registered: 22,
    language: 'Français',
    level: 'Intermédiaire',
    instructor: {
      name: 'Ibrahim Diallo',
      title: 'Mobile Developer Lead @ MIDEESSI',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      bio: 'Développeur mobile expérimenté avec plusieurs apps publiées sur App Store et Google Play'
    },
    objectives: [
      'Comprendre les concepts Flutter',
      'Construire une interface utilisateur',
      'Implémenter la logique métier',
      'Publier une app sur les stores'
    ],
    program: [
      {
        time: '14:00 - 14:45',
        title: 'Flutter Fundamentals',
        description: 'Widgets et layouts'
      },
      {
        time: '14:45 - 15:45',
        title: 'Building a Real App',
        description: 'Construction d\'une application complète'
      },
      {
        time: '15:45 - 16:00',
        title: 'Pause',
        description: ''
      },
      {
        time: '16:00 - 17:30',
        title: 'Advanced Features & Publishing',
        description: 'State management et déploiement'
      }
    ],
    prerequisites: [
      'Connaissance de Dart ou Java',
      'Expérience en développement (Dart préféré)'
    ],
    materials: [
      'Code source complet du projet',
      'Flutter setup guide',
      'Ressources de documentation'
    ],
    price: 25000,
    tags: ['Flutter', 'Dart', 'Mobile', 'iOS', 'Android', 'Intermédiaire'],
    testimonials: [
      {
        author: 'Sabrina Toure',
        role: 'Developer',
        text: 'Formation très bien organisée. J\'ai pu créer mon app après l\'atelier!',
        rating: 5
      }
    ],
    isOnline: true,
    meetLink: 'https://meet.google.com/xyz-1234-567',
    status: 'upcoming'
  }
];

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

export const getUpcomingAteliers = (): Atelier[] => {
  const now = new Date();
  return ateliers
    .filter(atelier => {
      const atelierDate = new Date(atelier.date);
      return atelierDate > now && atelier.status === 'upcoming';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getTrendingAteliers = (): Atelier[] => {
  return ateliers
    .filter(a => a.status === 'upcoming')
    .sort((a, b) => b.registered - a.registered)
    .slice(0, 3);
};
