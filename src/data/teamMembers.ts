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
    id: 'richy-anguilet-zinvo',
    name: 'Richy ANGUILET ZINVO',
    role: 'Cofondateur',
    shortDescription: 'Cofondateur de MIDEESSI, passionné d\'informatique et des technologies modernes.',
    fullBio: `Richy ANGUILET ZINVO est cofondateur de MIDEESSI et l'un des piliers de la vision qui anime la plateforme. 
    Passionné d'informatique et de technologies modernes, il s'implique activement dans la définition de la direction 
    stratégique et technique de MIDEESSI depuis les premières heures du projet. Son énergie, sa vision et sa 
    détermination sont au cœur du développement de solutions numériques innovantes pour le Bénin et l'Afrique.`,
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
