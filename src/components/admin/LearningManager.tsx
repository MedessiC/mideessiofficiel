import { useEffect, useState } from 'react';
import { BookOpen, Edit3, Eye, EyeOff, GraduationCap, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import CloudinaryUploader from './CloudinaryUploader';

type Formation = {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  duration: string | null;
  price: number | string | null;
  category: string | null;
  cover: string | null;
  is_published: boolean;
  created_at: string;
};

type FormationDraft = Omit<Formation, 'id' | 'created_at'>;

const EMPTY_FORMATION: FormationDraft = {
  title: '',
  description: '',
  level: 'Débutant',
  duration: '',
  price: 0,
  category: 'Numérique',
  cover: '',
  is_published: false,
};

const formatPrice = (price: Formation['price']) => {
  const amount = Number(price || 0);
  return amount === 0 ? 'Gratuit' : `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
};

export default function LearningManager() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Formation | null>(null);
  const [draft, setDraft] = useState<FormationDraft>(EMPTY_FORMATION);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadFormations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('formations').select('*').order('created_at', { ascending: false });
    if (error) setNotice({ type: 'error', text: `Impossible de charger les formations : ${error.message}` });
    else setFormations((data as Formation[]) || []);
    setLoading(false);
  };

  useEffect(() => { void loadFormations(); }, []);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setDraft(EMPTY_FORMATION);
  };

  const openCreate = () => {
    setNotice(null);
    setEditing(null);
    setDraft(EMPTY_FORMATION);
    setFormOpen(true);
  };

  const openEdit = (formation: Formation) => {
    setNotice(null);
    setEditing(formation);
    setDraft({
      title: formation.title,
      description: formation.description || '',
      level: formation.level || 'Débutant',
      duration: formation.duration || '',
      price: formation.price ?? 0,
      category: formation.category || 'Numérique',
      cover: formation.cover || '',
      is_published: formation.is_published,
    });
    setFormOpen(true);
  };

  const saveFormation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.description?.trim()) {
      setNotice({ type: 'error', text: 'Le titre et la description sont obligatoires.' });
      return;
    }

    setSaving(true);
    setNotice(null);
    const payload = { ...draft, title: draft.title.trim(), description: draft.description.trim(), price: Number(draft.price || 0) };
    const { error } = editing
      ? await supabase.from('formations').update(payload).eq('id', editing.id)
      : await supabase.from('formations').insert(payload);

    setSaving(false);
    if (error) {
      setNotice({ type: 'error', text: `La formation n’a pas été enregistrée : ${error.message}` });
      return;
    }

    closeForm();
    setNotice({ type: 'success', text: editing ? 'Formation mise à jour.' : 'Formation créée. Publiez-la quand elle est prête.' });
    await loadFormations();
  };

  const togglePublication = async (formation: Formation) => {
    const { error } = await supabase.from('formations').update({ is_published: !formation.is_published }).eq('id', formation.id);
    if (error) {
      setNotice({ type: 'error', text: `La publication n’a pas été modifiée : ${error.message}` });
      return;
    }
    setNotice({ type: 'success', text: formation.is_published ? 'Formation retirée du catalogue public.' : 'Formation publiée sur MIDEESSI Learn.' });
    await loadFormations();
  };

  const deleteFormation = async (formation: Formation) => {
    if (!window.confirm(`Supprimer définitivement « ${formation.title} » ?`)) return;
    const { error } = await supabase.from('formations').delete().eq('id', formation.id);
    if (error) {
      setNotice({ type: 'error', text: `La formation n’a pas été supprimée : ${error.message}` });
      return;
    }
    setNotice({ type: 'success', text: 'Formation supprimée.' });
    await loadFormations();
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/8 bg-white/5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--brand-gold)]">MIDEESSI Learn</span>
            <h2 className="mt-1 text-xl font-black text-white">Formations et livres</h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-gray-400">Préparez une formation en brouillon, puis publiez-la dans le catalogue. Les livres PDF restent gérés dans leur éditeur dédié.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-gold)] px-4 py-2.5 text-xs font-black text-[var(--brand-midnight)] hover:opacity-90">
            <Plus className="h-4 w-4" /> Nouvelle formation
          </button>
        </div>
      </div>

      {notice && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
          {notice.text}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/8 p-5">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-black text-white"><GraduationCap className="h-4 w-4 text-[var(--brand-gold)]" /> Formations</h3>
              <p className="mt-1 text-xs text-gray-400">{formations.length} formation{formations.length > 1 ? 's' : ''} enregistrée{formations.length > 1 ? 's' : ''}</p>
            </div>
            <Link to="/apprendre" target="_blank" className="text-xs font-bold text-[var(--brand-gold)] hover:underline">Voir le catalogue</Link>
          </div>
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-[var(--brand-gold)]" /></div>
          ) : formations.length === 0 ? (
            <div className="p-10 text-center"><GraduationCap className="mx-auto h-10 w-10 text-gray-600" /><p className="mt-3 text-sm font-semibold text-gray-400">Aucune formation pour le moment.</p></div>
          ) : (
            <div className="divide-y divide-white/8">
              {formations.map((formation) => (
                <article key={formation.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-black ${formation.is_published ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>{formation.is_published ? 'Publié' : 'Brouillon'}</span>
                      <span className="text-[10px] text-gray-500">{formation.category || 'Sans catégorie'} · {formation.level || 'Tous niveaux'}</span>
                    </div>
                    <h4 className="truncate text-sm font-black text-white">{formation.title}</h4>
                    <p className="mt-1 line-clamp-1 text-xs text-gray-400">{formation.duration || 'Durée à préciser'} · {formatPrice(formation.price)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button onClick={() => void togglePublication(formation)} title={formation.is_published ? 'Dépublier' : 'Publier'} className="rounded-lg bg-white/8 p-2 text-gray-300 hover:bg-white/15">{formation.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                    <button onClick={() => openEdit(formation)} title="Modifier" className="rounded-lg bg-white/8 p-2 text-gray-300 hover:bg-white/15"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => void deleteFormation(formation)} title="Supprimer" className="rounded-lg bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-white/8 bg-white/5 p-5">
          <BookOpen className="h-7 w-7 text-[var(--brand-gold)]" />
          <h3 className="mt-4 text-base font-black text-white">Livres PDF</h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-400">La publication des livres, des couvertures, des fichiers PDF et des quiz est déjà disponible dans l’éditeur de bibliothèque.</p>
          <Link to="/admin/pdfs" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-xs font-black text-white hover:bg-white/15">
            <Edit3 className="h-4 w-4" /> Publier un livre
          </Link>
        </aside>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="mx-auto my-8 max-w-2xl rounded-2xl border border-white/10 bg-[#151924] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/8 p-5">
              <div><h3 className="font-black text-white">{editing ? 'Modifier la formation' : 'Nouvelle formation'}</h3><p className="mt-1 text-xs text-gray-400">Les champs marqués sont affichés dans MIDEESSI Learn.</p></div>
              <button onClick={closeForm} className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={(event) => void saveFormation(event)} className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2 text-xs font-bold text-gray-300">Titre *<input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--brand-gold)]" /></label>
                <label className="sm:col-span-2 text-xs font-bold text-gray-300">Description *<textarea required rows={4} value={draft.description || ''} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="mt-1.5 w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--brand-gold)]" /></label>
                <label className="text-xs font-bold text-gray-300">Catégorie<input value={draft.category || ''} onChange={(event) => setDraft({ ...draft, category: event.target.value })} placeholder="Ex. Développement web" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--brand-gold)]" /></label>
                <label className="text-xs font-bold text-gray-300">Niveau<select value={draft.level || 'Débutant'} onChange={(event) => setDraft({ ...draft, level: event.target.value })} className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#151924] px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--brand-gold)]"><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option></select></label>
                <label className="text-xs font-bold text-gray-300">Durée<input value={draft.duration || ''} onChange={(event) => setDraft({ ...draft, duration: event.target.value })} placeholder="Ex. 6 heures" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--brand-gold)]" /></label>
                <label className="text-xs font-bold text-gray-300">Prix (FCFA)<input min="0" type="number" value={draft.price ?? 0} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--brand-gold)]" /></label>
              </div>
              <CloudinaryUploader label="Image de couverture" value={draft.cover || ''} onChange={(cover) => setDraft({ ...draft, cover })} folder="mideessi/formations" accept="image/*" />
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white"><input type="checkbox" checked={draft.is_published} onChange={(event) => setDraft({ ...draft, is_published: event.target.checked })} className="h-4 w-4 accent-[var(--brand-gold)]" /> Publier dès l’enregistrement</label>
              <div className="flex justify-end gap-3 border-t border-white/8 pt-5"><button type="button" onClick={closeForm} className="rounded-xl px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/10">Annuler</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-gold)] px-4 py-2.5 text-xs font-black text-[var(--brand-midnight)] disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? 'Enregistrer' : 'Créer la formation'}</button></div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
