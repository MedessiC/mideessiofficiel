import { useEffect, useMemo, useState } from 'react';
import { Briefcase, FolderKanban, Users, Plus, Send, Sparkles } from 'lucide-react';
import type { Solution } from '../../data/solutions';
import type { TeamMember } from '../../data/teamMembers';
import { createDynamicProject, createDynamicTeamMember, createRecruitmentOffer, getDynamicProjects, getDynamicTeamMembers, getRecruitmentOffers, getRecruitmentApplications, syncDynamicProjects, syncDynamicTeamMembers, syncRecruitmentOffers, type RecruitmentApplication } from '../../lib/contentManagement';
import CloudinaryUploader from './CloudinaryUploader';

const initialRecruitmentForm = {
  title: '',
  role: '',
  location: '',
  type: 'Temps plein',
  description: '',
  requirements: '',
  applyLink: '',
  imageUrl: '',
  isPublished: true,
};

const initialProjectForm = {
  name: '',
  slug: '',
  category: 'autre' as Solution['category'],
  tagline: '',
  description: '',
  longDescription: '',
  image: '',
  logo: '',
  website: '',
  status: 'En cours' as Solution['status'],
  launchDate: '',
  targetAudience: '',
  features: '',
  benefits: '',
  technologies: '',
  isPublished: true,
};

const initialTeamForm = {
  name: '',
  role: '',
  shortDescription: '',
  fullBio: '',
  joinDate: '',
  education: '',
  skills: '',
  specialties: '',
  passions: '',
  image: '',
  location: '',
  email: '',
  linkedin: '',
  github: '',
  portfolio: '',
};

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState<'recruitment' | 'projects' | 'team'>('recruitment');
  const [recruitmentOffers, setRecruitmentOffers] = useState(getRecruitmentOffers());
  const [recruitmentApplications, setRecruitmentApplications] = useState<RecruitmentApplication[]>([]);
  const [projects, setProjects] = useState(getDynamicProjects());
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getDynamicTeamMembers());
  const [recruitmentForm, setRecruitmentForm] = useState(initialRecruitmentForm);
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [teamForm, setTeamForm] = useState(initialTeamForm);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      const [offers, applications, syncedProjects, syncedTeamMembers] = await Promise.all([
        syncRecruitmentOffers(),
        getRecruitmentApplications(),
        syncDynamicProjects(),
        syncDynamicTeamMembers(),
      ]);
      setRecruitmentOffers(offers);
      setRecruitmentApplications(applications);
      setProjects(syncedProjects);
      setTeamMembers(syncedTeamMembers);
    };

    void loadContent();

    const handler = async () => {
      const [offers, applications, syncedProjects, syncedTeamMembers] = await Promise.all([
        syncRecruitmentOffers(),
        getRecruitmentApplications(),
        syncDynamicProjects(),
        syncDynamicTeamMembers(),
      ]);
      setRecruitmentOffers(offers);
      setRecruitmentApplications(applications);
      setProjects(syncedProjects);
      setTeamMembers(syncedTeamMembers);
    };

    window.addEventListener('mideessi-content-updated', handler);
    return () => window.removeEventListener('mideessi-content-updated', handler);
  }, []);

  const submitRecruitment = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRecruitmentOffer({
      title: recruitmentForm.title,
      role: recruitmentForm.role,
      location: recruitmentForm.location,
      type: recruitmentForm.type,
      description: recruitmentForm.description,
      requirements: recruitmentForm.requirements.split('\n').filter(Boolean),
      applyLink: recruitmentForm.applyLink,
      imageUrl: recruitmentForm.imageUrl,
      isPublished: recruitmentForm.isPublished,
    });
    const [offers, applications] = await Promise.all([syncRecruitmentOffers(), getRecruitmentApplications()]);
    setRecruitmentOffers(offers);
    setRecruitmentApplications(applications);
    setRecruitmentForm(initialRecruitmentForm);
    setMessage('Offre de recrutement publiée avec succès.');
  };

  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDynamicProject({
      name: projectForm.name,
      slug: projectForm.slug || projectForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: projectForm.category,
      tagline: projectForm.tagline,
      description: projectForm.description,
      longDescription: projectForm.longDescription,
      image: projectForm.image,
      logo: projectForm.logo,
      website: projectForm.website,
      status: projectForm.status,
      launchDate: projectForm.launchDate,
      targetAudience: projectForm.targetAudience.split('\n').filter(Boolean),
      features: projectForm.features.split('\n').filter(Boolean).map((item) => ({ id: `feature-${Date.now()}-${Math.random()}`, title: item, description: item, iconName: 'Sparkles' })),
      benefits: projectForm.benefits.split('\n').filter(Boolean),
      technologies: projectForm.technologies.split(',').map((item) => item.trim()).filter(Boolean),
      isPublished: projectForm.isPublished,
      cta: { text: 'Découvrir', url: projectForm.website || '#' },
      contact: { email: 'contact@mideessi.com' },
    });
    setProjects(await syncDynamicProjects());
    setProjectForm(initialProjectForm);
    setMessage('Projet ajouté et publié sur la page Solutions.');
  };

  const submitTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDynamicTeamMember({
      name: teamForm.name,
      role: teamForm.role,
      shortDescription: teamForm.shortDescription,
      fullBio: teamForm.fullBio,
      joinDate: teamForm.joinDate,
      education: teamForm.education,
      skills: teamForm.skills.split(',').map((item) => item.trim()).filter(Boolean),
      specialties: teamForm.specialties.split(',').map((item) => item.trim()).filter(Boolean),
      passions: teamForm.passions.split(',').map((item) => item.trim()).filter(Boolean),
      image: teamForm.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop',
      location: teamForm.location,
      email: teamForm.email || undefined,
      socialLinks: {
        linkedin: teamForm.linkedin || undefined,
        github: teamForm.github || undefined,
        portfolio: teamForm.portfolio || undefined,
      },
      projects: [],
    });
    setTeamMembers(await syncDynamicTeamMembers());
    setTeamForm(initialTeamForm);
    setMessage('Nouveau membre ajouté à la page À propos.');
  };

  const tabs = useMemo(() => [
    { id: 'recruitment', label: 'Recrutement', icon: Briefcase },
    { id: 'projects', label: 'Projets', icon: FolderKanban },
    { id: 'team', label: 'Équipe', icon: Users },
  ], []);

  return (
    <div className="space-y-6">
      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'recruitment' && (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={submitRecruitment} className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-semibold text-slate-900">Publier une offre de recrutement</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input required value={recruitmentForm.title} onChange={(e) => setRecruitmentForm({ ...recruitmentForm, title: e.target.value })} placeholder="Titre de l’offre" className="rounded-2xl border border-slate-200 px-4 py-3" />
              <input required value={recruitmentForm.role} onChange={(e) => setRecruitmentForm({ ...recruitmentForm, role: e.target.value })} placeholder="Rôle / Poste" className="rounded-2xl border border-slate-200 px-4 py-3" />
              <input value={recruitmentForm.location} onChange={(e) => setRecruitmentForm({ ...recruitmentForm, location: e.target.value })} placeholder="Lieu" className="rounded-2xl border border-slate-200 px-4 py-3" />
              <input value={recruitmentForm.type} onChange={(e) => setRecruitmentForm({ ...recruitmentForm, type: e.target.value })} placeholder="Type (Temps plein, Stage...)" className="rounded-2xl border border-slate-200 px-4 py-3" />
            </div>
            <textarea required value={recruitmentForm.description} onChange={(e) => setRecruitmentForm({ ...recruitmentForm, description: e.target.value })} placeholder="Description" rows={5} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <textarea value={recruitmentForm.requirements} onChange={(e) => setRecruitmentForm({ ...recruitmentForm, requirements: e.target.value })} placeholder="Exigences (une par ligne)" rows={4} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={recruitmentForm.applyLink} onChange={(e) => setRecruitmentForm({ ...recruitmentForm, applyLink: e.target.value })} placeholder="Lien de candidature" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={recruitmentForm.imageUrl} onChange={(e) => setRecruitmentForm({ ...recruitmentForm, imageUrl: e.target.value })} placeholder="URL de l’image de l’offre (Cloudinary ou autre)" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={recruitmentForm.isPublished} onChange={(e) => setRecruitmentForm({ ...recruitmentForm, isPublished: e.target.checked })} />
              Publier immédiatement
            </label>
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-3 font-semibold text-midnight">
              <Send className="h-4 w-4" /> Publier l’offre
            </button>
          </form>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Offres publiées</h3>
            <div className="space-y-3">
              {recruitmentOffers.length === 0 ? <p className="text-sm text-slate-500">Aucune offre publiée.</p> : recruitmentOffers.map((offer) => {
                const applications = recruitmentApplications.filter((application) => application.offerId === offer.id);

                return (
                  <div key={offer.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{offer.title}</p>
                        <p className="text-sm text-slate-500">{offer.role} • {offer.location}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Publié</span>
                    </div>
                    {offer.imageUrl && (
                      <img src={offer.imageUrl} alt={offer.title} className="mt-3 h-28 w-full rounded-xl object-cover" />
                    )}
                    <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                      <p className="font-semibold text-slate-700">{applications.length} candidature{applications.length > 1 ? 's' : ''}</p>
                      {applications.slice(0, 3).map((application) => (
                        <p key={application.id} className="mt-1">• {application.fullName} — {application.email}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={submitProject} className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-semibold text-slate-900">Ajouter un projet / solution</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input required value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} placeholder="Nom du projet" className="rounded-2xl border border-slate-200 px-4 py-3" />
              <input value={projectForm.slug} onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })} placeholder="Slug (optionnel)" className="rounded-2xl border border-slate-200 px-4 py-3" />
              <select value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as Solution['category'] })} className="rounded-2xl border border-slate-200 px-4 py-3">
                <option value="communication">Communication & Internet</option>
                <option value="gastronomie">Gastronomie & Loisirs</option>
                <option value="agriculture">Agriculture</option>
                <option value="finance">Finance</option>
                <option value="education">Éducation</option>
                <option value="autre">Autre</option>
              </select>
              <input value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as Solution['status'] })} placeholder="Statut" className="rounded-2xl border border-slate-200 px-4 py-3" />
            </div>
            <input value={projectForm.tagline} onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })} placeholder="Slogan / tagline" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <textarea required value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Description courte" rows={3} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <textarea value={projectForm.longDescription} onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })} placeholder="Description détaillée" rows={4} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <CloudinaryUploader label="Image du projet" value={projectForm.image} onChange={(value) => setProjectForm({ ...projectForm, image: value })} folder="mideessi/projects" accept="image/*" />
            <CloudinaryUploader label="Logo du projet" value={projectForm.logo} onChange={(value) => setProjectForm({ ...projectForm, logo: value })} folder="mideessi/projects/logos" accept="image/*" />
            <input value={projectForm.website} onChange={(e) => setProjectForm({ ...projectForm, website: e.target.value })} placeholder="Site web" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <textarea value={projectForm.targetAudience} onChange={(e) => setProjectForm({ ...projectForm, targetAudience: e.target.value })} placeholder="Public cible (une ligne par élément)" rows={3} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <textarea value={projectForm.features} onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })} placeholder="Fonctionnalités (une par ligne)" rows={3} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <textarea value={projectForm.benefits} onChange={(e) => setProjectForm({ ...projectForm, benefits: e.target.value })} placeholder="Bénéfices (une ligne par élément)" rows={3} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={projectForm.technologies} onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })} placeholder="Technologies (séparées par des virgules)" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={projectForm.isPublished} onChange={(e) => setProjectForm({ ...projectForm, isPublished: e.target.checked })} />
              Publier immédiatement
            </label>
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-3 font-semibold text-midnight">
              <Sparkles className="h-4 w-4" /> Ajouter le projet
            </button>
          </form>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Projets publiés</h3>
            <div className="space-y-3">
              {projects.length === 0 ? <p className="text-sm text-slate-500">Aucun projet publié.</p> : projects.map((project) => (
                <div key={project.id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">{project.name}</p>
                  <p className="text-sm text-slate-500">{project.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={submitTeam} className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-semibold text-slate-900">Ajouter un membre d’équipe</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input required value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="Nom complet" className="rounded-2xl border border-slate-200 px-4 py-3" />
              <input required value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} placeholder="Rôle" className="rounded-2xl border border-slate-200 px-4 py-3" />
              <input value={teamForm.location} onChange={(e) => setTeamForm({ ...teamForm, location: e.target.value })} placeholder="Ville / Pays" className="rounded-2xl border border-slate-200 px-4 py-3" />
              <input value={teamForm.joinDate} onChange={(e) => setTeamForm({ ...teamForm, joinDate: e.target.value })} placeholder="Depuis (ex: septembre 2025)" className="rounded-2xl border border-slate-200 px-4 py-3" />
            </div>
            <CloudinaryUploader label="Photo du membre" value={teamForm.image} onChange={(value) => setTeamForm({ ...teamForm, image: value })} folder="mideessi/team" accept="image/*" />
            <textarea required value={teamForm.shortDescription} onChange={(e) => setTeamForm({ ...teamForm, shortDescription: e.target.value })} placeholder="Description courte" rows={3} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <textarea required value={teamForm.fullBio} onChange={(e) => setTeamForm({ ...teamForm, fullBio: e.target.value })} placeholder="Biographie complète" rows={4} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={teamForm.education} onChange={(e) => setTeamForm({ ...teamForm, education: e.target.value })} placeholder="Formation" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={teamForm.skills} onChange={(e) => setTeamForm({ ...teamForm, skills: e.target.value })} placeholder="Compétences (séparées par des virgules)" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={teamForm.specialties} onChange={(e) => setTeamForm({ ...teamForm, specialties: e.target.value })} placeholder="Spécialités (séparées par des virgules)" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={teamForm.passions} onChange={(e) => setTeamForm({ ...teamForm, passions: e.target.value })} placeholder="Passions (séparées par des virgules)" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={teamForm.email} onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })} placeholder="Email" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <div className="grid gap-4 md:grid-cols-3">
              <input value={teamForm.linkedin} onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })} placeholder="LinkedIn" className="rounded-2xl border border-slate-200 px-4 py-3" />
              <input value={teamForm.github} onChange={(e) => setTeamForm({ ...teamForm, github: e.target.value })} placeholder="GitHub" className="rounded-2xl border border-slate-200 px-4 py-3" />
              <input value={teamForm.portfolio} onChange={(e) => setTeamForm({ ...teamForm, portfolio: e.target.value })} placeholder="Portfolio" className="rounded-2xl border border-slate-200 px-4 py-3" />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-3 font-semibold text-midnight">
              <Plus className="h-4 w-4" /> Ajouter le membre
            </button>
          </form>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Membres ajoutés</h3>
            <div className="space-y-3">
              {teamMembers.length === 0 ? <p className="text-sm text-slate-500">Aucun membre ajouté.</p> : teamMembers.map((member) => (
                <div key={member.id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
