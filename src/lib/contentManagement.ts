import type { TeamMember } from '../data/teamMembers';
import type { Solution } from '../data/solutions';
import { supabase } from './supabase';

export interface RecruitmentOffer {
  id: string;
  slug: string;
  title: string;
  role: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  applyLink: string;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
}

export interface RecruitmentApplication {
  id: string;
  offerId: string;
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  portfolioUrl: string;
  coverLetter: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
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
  applications: 'mideessi_recruitment_applications',
  projects: 'mideessi_dynamic_projects',
  team: 'mideessi_team_members',
  deletedRecruitmentOffers: 'mideessi_deleted_recruitment_offer_ids',
} as const;

const notifyContentUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('mideessi-content-updated'));
  }
};

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
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

const readDeletedRecruitmentOfferIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.deletedRecruitmentOffers);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const writeDeletedRecruitmentOfferIds = (ids: string[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.deletedRecruitmentOffers, JSON.stringify(ids));
};

const mapRecruitmentOffer = (row: Record<string, unknown>): RecruitmentOffer => ({
  id: String(row.id || `recruitment-${Date.now()}`),
  slug: String(row.slug || slugify(String(row.title || 'offre')) || ''),
  title: String(row.title || ''),
  role: String(row.role || ''),
  location: String(row.location || ''),
  type: String(row.type || 'Temps plein'),
  description: String(row.description || ''),
  requirements: Array.isArray(row.requirements) ? row.requirements.filter(Boolean).map((item) => String(item)) : [],
  applyLink: String(row.apply_link || row.applyLink || ''),
  imageUrl: String(row.image_url || row.imageUrl || ''),
  isPublished: Boolean(row.is_published ?? row.isPublished ?? true),
  createdAt: String(row.created_at || row.createdAt || new Date().toISOString()),
});

const mapRecruitmentApplication = (row: Record<string, unknown>): RecruitmentApplication => ({
  id: String(row.id || `application-${Date.now()}`),
  offerId: String(row.offer_id || row.offerId || ''),
  fullName: String(row.full_name || row.fullName || ''),
  email: String(row.email || ''),
  phone: String(row.phone || ''),
  cvUrl: String(row.cv_url || row.cvUrl || ''),
  portfolioUrl: String(row.portfolio_url || row.portfolioUrl || ''),
  coverLetter: String(row.cover_letter || row.coverLetter || ''),
  status: (row.status as RecruitmentApplication['status']) || 'pending',
  createdAt: String(row.created_at || row.createdAt || new Date().toISOString()),
});

export const getRecruitmentOffers = (): RecruitmentOffer[] => {
  const deletedIds = readDeletedRecruitmentOfferIds();
  return readStoredItems<RecruitmentOffer>(STORAGE_KEYS.recruitment).filter((item) => item.isPublished && !deletedIds.includes(item.id));
};

export const syncRecruitmentOffers = async (): Promise<RecruitmentOffer[]> => {
  try {
    const { data, error } = await supabase.from('recruitment_offers').select('*').order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const deletedIds = readDeletedRecruitmentOfferIds();
      const offers = data
        .map((row) => mapRecruitmentOffer(row as Record<string, unknown>))
        .filter((item) => item.isPublished && !deletedIds.includes(item.id));
      writeStoredItems(STORAGE_KEYS.recruitment, offers);
      return offers;
    }
  } catch (error) {
    console.error('Unable to sync recruitment offers:', error);
  }

  return getRecruitmentOffers();
};

export const createRecruitmentOffer = async (offer: Omit<RecruitmentOffer, 'id' | 'createdAt'>): Promise<RecruitmentOffer> => {
  const slug = offer.slug || slugify(offer.title || 'offre') || `offre-${Date.now()}`;
  const newOffer: RecruitmentOffer = {
    ...offer,
    slug,
    imageUrl: offer.imageUrl || '',
    id: `recruitment-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('recruitment_offers')
      .insert({
        title: offer.title,
        slug,
        role: offer.role,
        location: offer.location,
        type: offer.type,
        description: offer.description,
        requirements: offer.requirements,
        apply_link: offer.applyLink,
        image_url: offer.imageUrl,
        is_published: offer.isPublished,
      })
      .select('*')
      .maybeSingle();

    if (!error && data) {
      const savedOffer = mapRecruitmentOffer(data as Record<string, unknown>);
      const items = readStoredItems<RecruitmentOffer>(STORAGE_KEYS.recruitment);
      writeStoredItems(STORAGE_KEYS.recruitment, [savedOffer, ...items.filter((item) => item.id !== savedOffer.id)]);
      return savedOffer;
    }
  } catch (error) {
    console.error('Unable to create recruitment offer in Supabase:', error);
  }

  const items = readStoredItems<RecruitmentOffer>(STORAGE_KEYS.recruitment);
  writeStoredItems(STORAGE_KEYS.recruitment, [newOffer, ...items]);
  return newOffer;
};

export const deleteRecruitmentOffer = async (offerId: string): Promise<boolean> => {
  const items = readStoredItems<RecruitmentOffer>(STORAGE_KEYS.recruitment);
  const remaining = items.filter((item) => item.id !== offerId);
  const deletedIds = readDeletedRecruitmentOfferIds();
  const nextDeletedIds = deletedIds.includes(offerId) ? deletedIds : [...deletedIds, offerId];

  writeStoredItems(STORAGE_KEYS.recruitment, remaining);
  writeDeletedRecruitmentOfferIds(nextDeletedIds);

  try {
    const { error } = await supabase
      .from('recruitment_offers')
      .update({ is_published: false })
      .eq('id', offerId);
    return !error;
  } catch (error) {
    console.error('Unable to delete recruitment offer:', error);
    return true;
  }
};

export const getRecruitmentApplications = async (): Promise<RecruitmentApplication[]> => {
  try {
    const { data, error } = await supabase.from('recruitment_applications').select('*').order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const applications = data.map((row) => mapRecruitmentApplication(row as Record<string, unknown>));
      writeStoredItems(STORAGE_KEYS.applications, applications);
      return applications;
    }
  } catch (error) {
    console.error('Unable to load recruitment applications:', error);
  }

  return readStoredItems<RecruitmentApplication>(STORAGE_KEYS.applications);
};

export const createRecruitmentApplication = async (application: {
  offerId: string;
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  portfolioUrl: string;
  coverLetter: string;
}): Promise<RecruitmentApplication> => {
  const newApplication: RecruitmentApplication = {
    id: `application-${Date.now()}`,
    offerId: application.offerId,
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    cvUrl: application.cvUrl,
    portfolioUrl: application.portfolioUrl,
    coverLetter: application.coverLetter,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('recruitment_applications')
      .insert({
        offer_id: application.offerId,
        full_name: application.fullName,
        email: application.email,
        phone: application.phone,
        cv_url: application.cvUrl,
        portfolio_url: application.portfolioUrl,
        cover_letter: application.coverLetter,
        status: 'pending',
      })
      .select('*')
      .maybeSingle();

    if (!error && data) {
      const savedApplication = mapRecruitmentApplication(data as Record<string, unknown>);
      const items = readStoredItems<RecruitmentApplication>(STORAGE_KEYS.applications);
      writeStoredItems(STORAGE_KEYS.applications, [savedApplication, ...items.filter((item) => item.id !== savedApplication.id)]);
      return savedApplication;
    }
  } catch (error) {
    console.error('Unable to submit recruitment application in Supabase:', error);
  }

  const items = readStoredItems<RecruitmentApplication>(STORAGE_KEYS.applications);
  writeStoredItems(STORAGE_KEYS.applications, [newApplication, ...items]);
  return newApplication;
};

export const getDynamicProjects = (): DynamicProject[] => {
  return readStoredItems<DynamicProject>(STORAGE_KEYS.projects).filter((item) => item.isPublished);
};

export const syncDynamicProjects = async (): Promise<DynamicProject[]> => {
  try {
    const { data, error } = await supabase.from('dynamic_projects').select('*').order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const projects = data.map((row) => ({
        id: String(row.id || `project-${Date.now()}`),
        name: String(row.name || ''),
        slug: String(row.slug || ''),
        category: (row.category as Solution['category']) || 'autre',
        tagline: String(row.tagline || ''),
        description: String(row.description || ''),
        longDescription: String(row.long_description || ''),
        image: String(row.image_url || row.image || ''),
        logo: String(row.logo_url || row.logo || ''),
        website: String(row.website || ''),
        status: (row.status as Solution['status']) || 'En cours',
        launchDate: String(row.launch_date || ''),
        targetAudience: Array.isArray(row.target_audience) ? row.target_audience.filter(Boolean).map((item) => String(item)) : [],
        features: Array.isArray(row.features) ? row.features : [],
        benefits: Array.isArray(row.benefits) ? row.benefits.filter(Boolean).map((item) => String(item)) : [],
        technologies: Array.isArray(row.technologies) ? row.technologies.filter(Boolean).map((item) => String(item)) : [],
        cta: { text: String(row.cta_text || 'Découvrir'), url: String(row.cta_url || row.website || '#') },
        contact: { email: String(row.contact_email || 'contact@mideessi.com') },
        isPublished: Boolean(row.is_published ?? true),
        createdAt: String(row.created_at || new Date().toISOString()),
      })) as DynamicProject[];

      writeStoredItems(STORAGE_KEYS.projects, projects);
      return projects.filter((item) => item.isPublished);
    }
  } catch (error) {
    console.error('Unable to sync dynamic projects:', error);
  }

  return getDynamicProjects();
};

export const createDynamicProject = async (project: Omit<DynamicProject, 'id' | 'createdAt'>): Promise<DynamicProject> => {
  const newProject: DynamicProject = {
    ...project,
    id: `project-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('dynamic_projects')
      .insert({
        name: project.name,
        slug: project.slug,
        category: project.category,
        tagline: project.tagline,
        description: project.description,
        long_description: project.longDescription,
        image_url: project.image,
        logo_url: project.logo,
        website: project.website,
        status: project.status,
        launch_date: project.launchDate,
        target_audience: project.targetAudience,
        features: project.features,
        benefits: project.benefits,
        technologies: project.technologies,
        cta_text: project.cta?.text || 'Découvrir',
        cta_url: project.cta?.url || project.website || '#',
        contact_email: project.contact?.email || 'contact@mideessi.com',
        is_published: project.isPublished,
      })
      .select('*')
      .maybeSingle();

    if (!error && data) {
      const savedProject = {
        id: String(data.id || newProject.id),
        name: String(data.name || project.name),
        slug: String(data.slug || project.slug),
        category: (data.category as Solution['category']) || project.category,
        tagline: String(data.tagline || project.tagline),
        description: String(data.description || project.description),
        longDescription: String(data.long_description || project.longDescription),
        image: String(data.image_url || project.image),
        logo: String(data.logo_url || project.logo),
        website: String(data.website || project.website),
        status: (data.status as Solution['status']) || project.status,
        launchDate: String(data.launch_date || project.launchDate),
        targetAudience: Array.isArray(data.target_audience) ? data.target_audience.filter(Boolean).map((item) => String(item)) : project.targetAudience,
        features: Array.isArray(data.features) ? data.features : project.features,
        benefits: Array.isArray(data.benefits) ? data.benefits.filter(Boolean).map((item) => String(item)) : project.benefits,
        technologies: Array.isArray(data.technologies) ? data.technologies.filter(Boolean).map((item) => String(item)) : project.technologies,
        cta: { text: String(data.cta_text || project.cta?.text || 'Découvrir'), url: String(data.cta_url || project.cta?.url || project.website || '#') },
        contact: { email: String(data.contact_email || project.contact?.email || 'contact@mideessi.com') },
        isPublished: Boolean(data.is_published ?? project.isPublished),
        createdAt: String(data.created_at || new Date().toISOString()),
      } as DynamicProject;

      const items = readStoredItems<DynamicProject>(STORAGE_KEYS.projects);
      writeStoredItems(STORAGE_KEYS.projects, [savedProject, ...items.filter((item) => item.id !== savedProject.id)]);
      return savedProject;
    }
  } catch (error) {
    console.error('Unable to create dynamic project in Supabase:', error);
  }

  const items = readStoredItems<DynamicProject>(STORAGE_KEYS.projects);
  writeStoredItems(STORAGE_KEYS.projects, [newProject, ...items]);
  return newProject;
};

export const getDynamicTeamMembers = (): TeamMember[] => {
  return readStoredItems<TeamMember>(STORAGE_KEYS.team);
};

export const syncDynamicTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const { data, error } = await supabase.from('dynamic_team_members').select('*').order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const members = data.map((row) => ({
        id: String(row.id || `team-${Date.now()}`),
        name: String(row.name || ''),
        role: String(row.role || ''),
        shortDescription: String(row.short_description || ''),
        fullBio: String(row.full_bio || ''),
        joinDate: String(row.join_date || ''),
        education: String(row.education || ''),
        skills: Array.isArray(row.skills) ? row.skills.filter(Boolean).map((item) => String(item)) : [],
        specialties: Array.isArray(row.specialties) ? row.specialties.filter(Boolean).map((item) => String(item)) : [],
        passions: Array.isArray(row.passions) ? row.passions.filter(Boolean).map((item) => String(item)) : [],
        image: String(row.image_url || row.image || ''),
        location: String(row.location || ''),
        email: row.email ? String(row.email) : undefined,
        socialLinks: {
          linkedin: row.social_links && typeof row.social_links === 'object' && 'linkedin' in row.social_links ? String((row.social_links as Record<string, unknown>).linkedin || '') : undefined,
          github: row.social_links && typeof row.social_links === 'object' && 'github' in row.social_links ? String((row.social_links as Record<string, unknown>).github || '') : undefined,
          twitter: row.social_links && typeof row.social_links === 'object' && 'twitter' in row.social_links ? String((row.social_links as Record<string, unknown>).twitter || '') : undefined,
          portfolio: row.social_links && typeof row.social_links === 'object' && 'portfolio' in row.social_links ? String((row.social_links as Record<string, unknown>).portfolio || '') : undefined,
        },
        projects: Array.isArray(row.projects) ? row.projects : [],
      })) as TeamMember[];

      writeStoredItems(STORAGE_KEYS.team, members);
      return members;
    }
  } catch (error) {
    console.error('Unable to sync dynamic team members:', error);
  }

  return getDynamicTeamMembers();
};

export const createDynamicTeamMember = async (member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
  const newMember: TeamMember = {
    ...member,
    id: `team-${Date.now()}`,
  };

  try {
    const { data, error } = await supabase
      .from('dynamic_team_members')
      .insert({
        name: member.name,
        role: member.role,
        short_description: member.shortDescription,
        full_bio: member.fullBio,
        join_date: member.joinDate,
        education: member.education,
        skills: member.skills,
        specialties: member.specialties,
        passions: member.passions,
        image_url: member.image,
        location: member.location,
        email: member.email,
        social_links: member.socialLinks,
        projects: member.projects,
      })
      .select('*')
      .maybeSingle();

    if (!error && data) {
      const savedMember = {
        id: String(data.id || newMember.id),
        name: String(data.name || member.name),
        role: String(data.role || member.role),
        shortDescription: String(data.short_description || member.shortDescription),
        fullBio: String(data.full_bio || member.fullBio),
        joinDate: String(data.join_date || member.joinDate),
        education: String(data.education || member.education),
        skills: Array.isArray(data.skills) ? data.skills.filter(Boolean).map((item) => String(item)) : member.skills,
        specialties: Array.isArray(data.specialties) ? data.specialties.filter(Boolean).map((item) => String(item)) : member.specialties,
        passions: Array.isArray(data.passions) ? data.passions.filter(Boolean).map((item) => String(item)) : member.passions,
        image: String(data.image_url || member.image),
        location: String(data.location || member.location),
        email: data.email ? String(data.email) : undefined,
        socialLinks: {
          linkedin: data.social_links && typeof data.social_links === 'object' && 'linkedin' in data.social_links ? String((data.social_links as Record<string, unknown>).linkedin || '') : member.socialLinks.linkedin,
          github: data.social_links && typeof data.social_links === 'object' && 'github' in data.social_links ? String((data.social_links as Record<string, unknown>).github || '') : member.socialLinks.github,
          twitter: data.social_links && typeof data.social_links === 'object' && 'twitter' in data.social_links ? String((data.social_links as Record<string, unknown>).twitter || '') : member.socialLinks.twitter,
          portfolio: data.social_links && typeof data.social_links === 'object' && 'portfolio' in data.social_links ? String((data.social_links as Record<string, unknown>).portfolio || '') : member.socialLinks.portfolio,
        },
        projects: Array.isArray(data.projects) ? data.projects : member.projects,
      } as TeamMember;

      const items = readStoredItems<TeamMember>(STORAGE_KEYS.team);
      writeStoredItems(STORAGE_KEYS.team, [savedMember, ...items.filter((item) => item.id !== savedMember.id)]);
      return savedMember;
    }
  } catch (error) {
    console.error('Unable to create dynamic team member in Supabase:', error);
  }

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
