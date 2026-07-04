import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Eye, Save, Sparkles, CalendarDays, MapPin, Globe, MonitorPlay, Laptop2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type AtelierFormat = 'en_ligne' | 'presentiel' | 'hybride';
type AtelierVisibility = 'draft' | 'published' | 'announced';
type AtelierStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

interface AtelierRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  category: string;
  image: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  capacity: number;
  registered: number;
  language: string;
  level: string;
  format: AtelierFormat;
  visibility: AtelierVisibility;
  status: AtelierStatus;
  price: number;
  tags: string[];
  objectives: string[];
  prerequisites: string[];
  materials: string[];
  meet_link?: string;
  created_at?: string;
}

interface AtelierFormState {
  id?: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  category: string;
  image: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  capacity: string;
  language: string;
  level: string;
  format: AtelierFormat;
  visibility: AtelierVisibility;
  status: AtelierStatus;
  price: string;
  tags: string;
  objectives: string;
  prerequisites: string;
  materials: string;
  meet_link: string;
}

const emptyForm = (): AtelierFormState => ({
  title: '',
  slug: '',
  description: '',
  long_description: '',
  category: 'technologie',
  image: '',
  date: '',
  time: '09:00',
  duration: '90',
  location: '',
  capacity: '20',
  language: 'Français',
  level: 'Débutant',
  format: 'presentiel',
  visibility: 'draft',
  status: 'upcoming',
  price: '0',
  tags: '',
  objectives: '',
  prerequisites: '',
  materials: '',
  meet_link: '',
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const AtelierManager = () => {
  const [ateliers, setAteliers] = useState<AtelierRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AtelierFormState>(emptyForm());
  const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchAteliers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('ateliers').select('*').order('date', { ascending: true });
    if (!error) {
      setAteliers((data || []) as AtelierRecord[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAteliers();
  }, []);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const handleEdit = (atelier: AtelierRecord) => {
    setEditingId(atelier.id);
    setForm({
      id: atelier.id,
      title: atelier.title,
      slug: atelier.slug,
      description: atelier.description,
      long_description: atelier.long_description,
      category: atelier.category,
      image: atelier.image,
      date: atelier.date,
      time: atelier.time,
      duration: String(atelier.duration),
      location: atelier.location,
      capacity: String(atelier.capacity),
      language: atelier.language,
      level: atelier.level,
      format: atelier.format || (atelier.status === 'upcoming' ? 'presentiel' : 'presentiel'),
      visibility: atelier.visibility || 'draft',
      status: atelier.status,
      price: String(atelier.price),
      tags: (atelier.tags || []).join(', '),
      objectives: (atelier.objectives || []).join('\n'),
      prerequisites: (atelier.prerequisites || []).join('\n'),
      materials: (atelier.materials || []).join('\n'),
      meet_link: atelier.meet_link || '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cet atelier ?')) return;
    const { error } = await supabase.from('ateliers').delete().eq('id', id);
    if (!error) {
      setMessage('Atelier supprimé.');
      fetchAteliers();
    } else {
      setMessage('Erreur lors de la suppression.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      long_description: form.long_description || form.description,
      category: form.category,
      image: form.image || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
      date: form.date,
      time: form.time,
      duration: Number(form.duration || 60),
      location: form.location || (form.format === 'en_ligne' ? 'En ligne' : 'Présentiel'),
      capacity: Number(form.capacity || 20),
      registered: 0,
      language: form.language,
      level: form.level,
      format: form.format,
      visibility: form.visibility,
      status: form.status,
      price: Number(form.price || 0),
      is_online: form.format !== 'presentiel',
      meet_link: form.meet_link || null,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      objectives: form.objectives.split('\n').map(item => item.trim()).filter(Boolean),
      prerequisites: form.prerequisites.split('\n').map(item => item.trim()).filter(Boolean),
      materials: form.materials.split('\n').map(item => item.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    };

    const { error } = editingId
      ? await supabase.from('ateliers').update(payload).eq('id', editingId)
      : await supabase.from('ateliers').insert(payload);

    setSaving(false);

    if (!error) {
      setMessage(editingId ? 'Atelier mis à jour.' : 'Atelier publié/annoncé avec succès.');
      resetForm();
      fetchAteliers();
    } else {
      setMessage(error.message || 'Erreur lors de la sauvegarde.');
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Gestion des ateliers</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Publiez, annoncez ou modifiez des ateliers en ligne, présentiel ou hybride.</p>
          </div>
          <button
            onClick={resetForm}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Nouvel atelier
          </button>
        </div>

        {message && (
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Titre
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: e.target.value ? slugify(e.target.value) : form.slug })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
              </label>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Slug
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
              </label>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Catégorie
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <option value="technologie">Technologie</option>
                  <option value="business">Business</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="finance">Finance</option>
                  <option value="autre">Autre</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Image URL
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
              </label>
            </div>
          </div>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 lg:col-span-2">
            Résumé court
            <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 lg:col-span-2">
            Description détaillée
            <textarea rows={5} value={form.long_description} onChange={e => setForm({ ...form, long_description: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Date
            <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Heure
            <input required type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Durée (min)
            <input required type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Capacité
            <input required type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Format
            <select value={form.format} onChange={e => setForm({ ...form, format: e.target.value as AtelierFormat })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="presentiel">Présentiel</option>
              <option value="en_ligne">En ligne</option>
              <option value="hybride">Hybride</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Visibilité
            <select value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value as AtelierVisibility })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="announced">Annonce</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Statut
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as AtelierStatus })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="upcoming">À venir</option>
              <option value="ongoing">En cours</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Tarif (FCFA)
            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Lieu / lien
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Lien de réunion
            <input value={form.meet_link} onChange={e => setForm({ ...form, meet_link: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Langue
            <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="Français">Français</option>
              <option value="Anglais">Anglais</option>
              <option value="Mixte">Mixte</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Niveau
            <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 lg:col-span-2">
            Tags (séparés par des virgules)
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 lg:col-span-2">
            Objectifs (un par ligne)
            <textarea rows={3} value={form.objectives} onChange={e => setForm({ ...form, objectives: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 lg:col-span-2">
            Prérequis (un par ligne)
            <textarea rows={3} value={form.prerequisites} onChange={e => setForm({ ...form, prerequisites: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 lg:col-span-2">
            Matériel (un par ligne)
            <textarea rows={3} value={form.materials} onChange={e => setForm({ ...form, materials: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          </label>

          <div className="lg:col-span-2 flex justify-end">
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-midnight transition hover:bg-yellow-400 disabled:opacity-60">
              <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-gold" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ateliers existants</h3>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : ateliers.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun atelier pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {ateliers.map(atelier => (
              <div key={atelier.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{atelier.title}</h4>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">{atelier.format === 'en_ligne' ? 'En ligne' : atelier.format === 'hybride' ? 'Hybride' : 'Présentiel'}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${atelier.visibility === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200' : atelier.visibility === 'announced' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {atelier.visibility === 'published' ? 'Publié' : atelier.visibility === 'announced' ? 'Annonce' : 'Brouillon'}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1"><CalendarDays className="w-4 h-4" /> {atelier.date}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> {atelier.location || 'À définir'}</span>
                    {atelier.format === 'en_ligne' ? <span className="inline-flex items-center gap-1"><Globe className="w-4 h-4" /> En ligne</span> : atelier.format === 'hybride' ? <span className="inline-flex items-center gap-1"><Laptop2 className="w-4 h-4" /> Hybride</span> : <span className="inline-flex items-center gap-1"><MonitorPlay className="w-4 h-4" /> Présentiel</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleEdit(atelier)} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    <Edit3 className="w-4 h-4" /> Modifier
                  </button>
                  <button onClick={() => handleDelete(atelier.id)} className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-700/40 dark:text-red-300 dark:hover:bg-red-900/30">
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AtelierManager;
