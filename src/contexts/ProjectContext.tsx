import React, { createContext, useContext, useState, useEffect } from 'react';
import { WebProject, ProjectStatus, ContentChecklistItem, ProjectRevisionRequest, INITIAL_CHECKLIST_TEMPLATE } from '../types/project';
import { supabase } from '../lib/supabase';

interface ProjectContextType {
  projects: WebProject[];
  loading: boolean;
  activeWizardOffer: string | null;
  isWizardOpen: boolean;
  openWizard: (offerSlug?: string) => void;
  closeWizard: () => void;
  createProject: (projectData: Omit<WebProject, 'id' | 'created_at' | 'updated_at' | 'status' | 'contents_checklist' | 'revisions' | 'max_revisions'>) => Promise<WebProject>;
  getProjectById: (id: string) => WebProject | undefined;
  updateProjectStatus: (projectId: string, status: ProjectStatus, urls?: { preview_url?: string; final_url?: string }) => Promise<void>;
  updateChecklistItem: (projectId: string, itemId: string, fileUrl: string, fileName: string) => Promise<void>;
  addRevisionRequest: (projectId: string, comment: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'mideessi_web_projects_db';

const MOCK_INITIAL_PROJECTS: WebProject[] = [
  {
    id: 'prj_rest_01',
    user_id: 'usr_demo_123',
    client_id: 'cli_demo_123',
    client_name: 'Cheikh Diop',
    client_email: 'cheikh.restaurant@example.com',
    client_phone: '+229 97 00 11 22',
    offer_slug: 'vitrine',
    offer_name: 'Site Vitrine',
    activity: 'Restaurant',
    goal: 'Obtenir des contacts',
    brief_description: 'Je suis propriétaire d\'un restaurant à Cotonou et je veux un site pour présenter mes plats, mes horaires et permettre aux clients de nous contacter sur WhatsApp.',
    selected_features: ['presentation', 'services', 'galerie', 'contact_form', 'whatsapp_button', 'google_maps'],
    price_total: 85000,
    payment_type: 'installment',
    payment_schedule: {
      upfront: 30000,
      installment_amount: 27500,
      installments_count: 2,
      paid_installments: 1,
    },
    status: 'developpement',
    estimated_days: '3-5 jours',
    contents_checklist: [
      { id: 'logo', label: 'Logo de l\'entreprise', description: 'Format PNG ou vectoriel', required: true, status: 'recu', fileName: 'logo_chez_x.png', fileUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', updatedAt: '2026-08-15' },
      { id: 'photos', label: 'Photos d\'illustration', description: 'Visuels plats et restaurant', required: true, status: 'recu', fileName: 'plats_menu.zip', fileUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', updatedAt: '2026-08-16' },
      { id: 'texts', label: 'Textes de présentation', description: 'Histoire et cartes', required: true, status: 'recu', fileName: 'presentation_restaurant.docx', updatedAt: '2026-08-16' },
      { id: 'prices', label: 'Tarifs et catalogue', description: 'Menu détaillé', required: false, status: 'manquant' },
      { id: 'contact', label: 'Coordonnées officielles', description: 'Adresse Haie Vive, Cotonou', required: true, status: 'recu', fileName: 'infos_contact.txt', updatedAt: '2026-08-15' },
    ],
    preview_url: 'https://demo-restaurant-chez-x.mideessi.app',
    revisions: [],
    max_revisions: 3,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<WebProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeWizardOffer, setActiveWizardOffer] = useState<string | null>(null);

  // Charge les projets depuis localStorage, puis sync Supabase en arrière-plan
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        // 1. Chargement immédiat depuis localStorage
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          setProjects(JSON.parse(saved));
        } else {
          setProjects(MOCK_INITIAL_PROJECTS);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_INITIAL_PROJECTS));
        }
      } finally {
        setLoading(false);
      }

      // 2. Sync Supabase en arrière-plan (ne bloque pas le rendu)
      supabase.from('web_projects').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          // Merge : on garde les projets locaux non présents en base (ex: créés offline)
          const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
          const localProjects: WebProject[] = localRaw ? JSON.parse(localRaw) : [];
          const remoteIds = new Set(data.map((p: any) => p.id));
          const localOnly = localProjects.filter(p => !remoteIds.has(p.id));
          const merged = [...localOnly, ...(data as WebProject[])];
          setProjects(merged);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        }
      });
    };
    loadProjects();
  }, []);

  // Save to localStorage whenever state changes
  const saveProjectsState = (newProjects: WebProject[]) => {
    setProjects(newProjects);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProjects));
  };

  const openWizard = (offerSlug?: string) => {
    setActiveWizardOffer(offerSlug || 'vitrine');
    setIsWizardOpen(true);
  };

  const closeWizard = () => {
    setIsWizardOpen(false);
    setActiveWizardOffer(null);
  };

  const createProject = async (
    projectData: Omit<WebProject, 'id' | 'created_at' | 'updated_at' | 'status' | 'contents_checklist' | 'revisions' | 'max_revisions'>
  ): Promise<WebProject> => {
    const newProject: WebProject = {
      ...projectData,
      id: `prj_${Date.now()}`,
      status: 'projet_recu',
      contents_checklist: INITIAL_CHECKLIST_TEMPLATE,
      revisions: [],
      max_revisions: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Sauvegarde immédiate en local (state + localStorage) → navigation instantanée
    const updatedList = [newProject, ...projects];
    saveProjectsState(updatedList);

    // 2. Sync Supabase en arrière-plan (fire & forget) — ne bloque PAS la navigation
    supabase.from('web_projects').insert([newProject]).then(({ error }) => {
      if (error) console.warn('[ProjectContext] Supabase sync échoué (sauvegardé localement) :', error.message);
    });

    return newProject;
  };


  const getProjectById = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  const updateProjectStatus = async (projectId: string, status: ProjectStatus, urls?: { preview_url?: string; final_url?: string }) => {
    const updatedList = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          status,
          preview_url: urls?.preview_url ?? p.preview_url,
          final_url: urls?.final_url ?? p.final_url,
          updated_at: new Date().toISOString(),
        };
      }
      return p;
    });
    saveProjectsState(updatedList);

    try {
      await supabase.from('web_projects').update({ status, ...urls, updated_at: new Date().toISOString() }).eq('id', projectId);
    } catch (e) {
      console.warn('Status updated locally:', e);
    }
  };

  const updateChecklistItem = async (projectId: string, itemId: string, fileUrl: string, fileName: string) => {
    const updatedList = projects.map((p) => {
      if (p.id === projectId) {
        const updatedChecklist = p.contents_checklist.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              status: 'recu' as const,
              fileUrl,
              fileName,
              updatedAt: new Date().toISOString().split('T')[0],
            };
          }
          return item;
        });

        // Automatically move status to 'brief' or 'contenu' if checklist is being fulfilled
        const newStatus = p.status === 'projet_recu' ? 'brief' : p.status;

        return {
          ...p,
          status: newStatus,
          contents_checklist: updatedChecklist,
          updated_at: new Date().toISOString(),
        };
      }
      return p;
    });
    saveProjectsState(updatedList);
  };

  const addRevisionRequest = async (projectId: string, comment: string) => {
    const updatedList = projects.map((p) => {
      if (p.id === projectId) {
        const newRev: ProjectRevisionRequest = {
          id: `rev_${Date.now()}`,
          date: new Date().toLocaleDateString('fr-FR'),
          comment,
          status: 'en_attente',
        };
        return {
          ...p,
          status: 'revision' as const,
          revisions: [...p.revisions, newRev],
          updated_at: new Date().toISOString(),
        };
      }
      return p;
    });
    saveProjectsState(updatedList);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        activeWizardOffer,
        isWizardOpen,
        openWizard,
        closeWizard,
        createProject,
        getProjectById,
        updateProjectStatus,
        updateChecklistItem,
        addRevisionRequest,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider');
  return ctx;
};
