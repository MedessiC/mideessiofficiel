export interface TeamMember {
  id: string;
  name: string;
  role: string;
  shortDescription: string;
  fullBio: string;
  joinDate: string;
  education: string;
  skills: string[];
  specialties: string[];
  passions: string[];
  image: string;
  location: string;
  email?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  projects: Project[];
}

export interface Project {
  title: string;
  description: string;
  link?: string;
  image?: string;
  technologies?: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'coovi-medessi',
    name: 'Coovi Vivotin MEDESSI',
    role: 'Fondateur & CEO',
    shortDescription: 'Fondateur et CEO de MIDEESSI TECH SARL. Passionné par la création d\'outils numériques utiles, simples et ancrés au Bénin.',
    fullBio: `Coovi Vivotin MEDESSI est le fondateur et CEO de MIDEESSI TECH SARL. Né à Cotonou, il a appris à coder en autodidacte dès son plus jeune âge, guidé par une passion viscérale pour la simplicité, la rigueur de conception et la création de solutions numériques utiles pour le quotidien des Béninois. Convaincu que la technologie doit être accessible et digne, il conçoit chaque projet avec une obsession du détail millimétré.`,
    joinDate: '2024',
    education: 'Autodidacte & Développeur',
    skills: ['Python', 'TypeScript', 'React', 'Automatisation', 'Architecture logicielle'],
    specialties: ['Direction générale', 'Conception produit', 'Architecture système'],
    passions: ['Création', 'Python', 'Lecture & Recherche', 'Simplicité numérique'],
    image: '/medessicoovi.webp',
    location: 'Cotonou, Bénin',
    email: 'contact@mideessi.com',
    socialLinks: {
      twitter: 'https://twitter.com/coovimedessi',
      linkedin: 'https://linkedin.com/in/coovimedessi',
      github: 'https://github.com/medessic'
    },
    projects: [
      {
        title: 'Écosystème MIDEESSI',
        description: 'Conception et développement de la suite MIDEESSI et de ses solutions pour les entreprises locales.',
        technologies: ['React', 'TypeScript', 'Node.js', 'Supabase']
      }
    ]
  },
  {
    id: 'richy-anguilet-zinvo',
    name: 'Zinvo Anguilet Basthios Richy',
    role: 'Cofondateur & Responsable MIDEESSI Learn',
    shortDescription: 'Cofondateur de MIDEESSI et responsable de la section MIDEESSI Learn.',
    fullBio: `Zinvo Anguilet Basthios Richy est cofondateur de MIDEESSI et dirige la section MIDEESSI Learn. 
    Passionné d'informatique, de transmission et des technologies modernes, il s'assure de démocratiser l'apprentissage 
    numérique pour la jeunesse et les professionnels, tout en veillant à l'excellence technique et au design des projets.`,
    joinDate: 'septembre 2025',
    education: 'Étudiant en 2ème année - Informatique',
    skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML/CSS', 'Node.js'],
    specialties: ['Développement frontend', 'Responsive design', 'UX/UI'],
    passions: ['Informatique', 'Développement web', 'Design moderne', 'Innovation technologique'],
    image: 'https://i.imgur.com/T0QH4B6.jpeg',
    location: 'Bénin',
    email: 'richy@mideessi.com',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      portfolio: '#'
    },
    projects: [
      {
        title: 'Plateforme e-commerce locale',
        description: 'Développement d\'une plateforme e-commerce optimisée pour les petits commerces béninois.',
        technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB']
      },
      {
        title: 'Interface de gestion MIDEESSI',
        description: 'Création de l\'interface responsive pour la gestion des projets MIDEESSI.',
        technologies: ['React', 'Tailwind CSS', 'TypeScript']
      }
    ]
  }
];

export default teamMembers;
