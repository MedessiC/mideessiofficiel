import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Sparkles } from 'lucide-react';
import CloudinaryUploader from '../components/admin/CloudinaryUploader';
import { createDynamicProject, syncDynamicProjects } from '../lib/contentManagement';

const AdminSolutions = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'autre',
    tagline: '',
    description: '',
    longDescription: '',
    image: '',
    logo: '',
    website: '',
    status: 'En cours',
    targetAudience: '',
    features: '',
    benefits: '',
    technologies: '',
    isPublished: true,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    void (async () => {
      const synced = await syncDynamicProjects();
      setProjects(synced);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      setMessage('Le nom et la description courte sont requis.');
      return;
    }

    const created = await createDynamicProject({
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: form.category as any,
      tagline: form.tagline,
      description: form.description,
      longDescription: form.longDescription,
      image: form.image,
      logo: form.logo,
      website: form.website,
      status: form.status as any,
      launchDate: '',
      targetAudience: form.targetAudience.split('\n').filter(Boolean),
      features: form.features.split('\n').filter(Boolean).map((f) => ({ id: `f-${Date.now()}-${Math.random()}`, title: f, description: f, iconName: 'Sparkles' })),
      benefits: form.benefits.split('\n').filter(Boolean),
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      isPublished: form.isPublished,
      cta: { text: 'Découvrir', url: form.website || '#' },
      contact: { email: 'contact@mideessi.com' },
    });

    const synced = await syncDynamicProjects();
    setProjects(synced);
    setForm({ ...form, name: '', slug: '', description: '', longDescription: '', image: '', logo: '' });
    setMessage(created ? `Solution “${created.name}” publiée.` : 'Enregistré localement (pas de connexion Supabase).');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Publier une solution</h1>
        </div>
        <button className="rounded-full bg-slate-100 px-3 py-2 text-sm" onClick={() => navigate('/admin/dashboard')}>Retour</button>
      </div>

      {message && <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-emerald-700">{message}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-gold" />
            <h3 className="text-lg font-semibold">Nouvelle solution</h3>
          </div>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom de la solution" className="rounded-2xl border px-4 py-3" />
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug (optionnel)" className="rounded-2xl border px-4 py-3" />
          <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Tagline" className="rounded-2xl border px-4 py-3" />
          <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description courte" rows={3} className="rounded-2xl border px-4 py-3" />
          <textarea value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} placeholder="Description détaillée" rows={4} className="rounded-2xl border px-4 py-3" />
          <CloudinaryUploader label="Image principale" value={form.image} onChange={(v) => setForm({ ...form, image: v })} folder="mideessi/projects" accept="image/*" showUrlInput={false} />
          <CloudinaryUploader label="Logo" value={form.logo} onChange={(v) => setForm({ ...form, logo: v })} folder="mideessi/projects/logos" accept="image/*" showUrlInput={false} />
          <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="Site web" className="rounded-2xl border px-4 py-3" />
          <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Fonctionnalités (une par ligne)" rows={3} className="rounded-2xl border px-4 py-3" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Publier immédiatement</label>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-3 font-semibold text-midnight"><Sparkles className="h-4 w-4" /> Publier la solution</button>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Solutions publiées</h3>
          <div className="space-y-3">
            {projects.length === 0 ? <p className="text-sm text-slate-500">Aucune solution.</p> : projects.map((p) => (
              <div key={p.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-slate-500">{p.tagline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSolutions;
