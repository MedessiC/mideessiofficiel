import type { TeamMember } from '../data/teamMembers';
import type { Solution } from '../data/solutions';

export interface RecruitmentOffer {
  id: string;
  title: string;
  role: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  applyLink: string;
  isPublished: boolean;
  createdAt: string;
}

export interface DynamicProject {
  id: string;
  name: string;
  slug: string;
  category: Solution['category'];
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  logo: string;
  website: string;
  status: Solution['status'];
  launchDate: string;
  targetAudience: string[];
  features: Solution['features'];
  benefits: string[];
  technologies: string[];
  stats?: Solution['stats'];
  cta: Solution['cta'];
  contact: Solution['contact'];
  isPublished: boolean;
  createdAt: string;
}

const STORAGE_KEYS = {
  recruitment: 'mideessi_recruitment_offers',
  projects: 'mideessi_dynamic_projects',
  team: 'mideessi_team_members',
} as const;

const notifyContentUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('mideessi-content-updated'));
  }
};

const readStoredItems = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

const writeStoredItems = <T>(key: string, items: T[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(items));
  notifyContentUpdate();
};

export const getRecruitmentOffers = (): RecruitmentOffer[] => {
  return readStoredItems<RecruitmentOffer>(STORAGE_KEYS.recruitment).filter((item) => item.isPublished);
};

export const createRecruitmentOffer = (offer: Omit<RecruitmentOffer, 'id' | 'createdAt'>): RecruitmentOffer => {
  const newOffer: RecruitmentOffer = {
    ...offer,
    id: `recruitment-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const items = readStoredItems<RecruitmentOffer>(STORAGE_KEYS.recruitment);
  writeStoredItems(STORAGE_KEYS.recruitment, [newOffer, ...items]);
  return newOffer;
};

export const getDynamicProjects = (): DynamicProject[] => {
  return readStoredItems<DynamicProject>(STORAGE_KEYS.projects).filter((item) => item.isPublished);
};

export const createDynamicProject = (project: Omit<DynamicProject, 'id' | 'createdAt'>): DynamicProject => {
  const newProject: DynamicProject = {
    ...project,
    id: `project-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const items = readStoredItems<DynamicProject>(STORAGE_KEYS.projects);
  writeStoredItems(STORAGE_KEYS.projects, [newProject, ...items]);
  return newProject;
};

export const getDynamicTeamMembers = (): TeamMember[] => {
  return readStoredItems<TeamMember>(STORAGE_KEYS.team);
};

export const createDynamicTeamMember = (member: Omit<TeamMember, 'id'>): TeamMember => {
  const newMember: TeamMember = {
    ...member,
    id: `team-${Date.now()}`,
  };

  const items = readStoredItems<TeamMember>(STORAGE_KEYS.team);
  writeStoredItems(STORAGE_KEYS.team, [newMember, ...items]);
  return newMember;
};

export const mapDynamicProjectToSolution = (project: DynamicProject): Solution => ({
  id: project.id,
  name: project.name,
  slug: project.slug,
  category: project.category,
  tagline: project.tagline,
  description: project.description,
  longDescription: project.longDescription,
  image: project.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop',
  logo: project.logo || '/logo.png',
  website: project.website || '#',
  status: project.status,
  launchDate: project.launchDate || 'À venir',
  targetAudience: project.targetAudience,
  features: project.features,
  benefits: project.benefits,
  technologies: project.technologies,
  stats: project.stats,
  cta: project.cta || { text: 'Découvrir', url: project.website || '#' },
  contact: project.contact || { email: 'contact@mideessi.com' },
});
