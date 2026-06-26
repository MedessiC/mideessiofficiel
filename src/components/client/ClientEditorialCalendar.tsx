import { useEffect, useState } from 'react';
import { useClientAuth } from '../../contexts/ClientContext';
import { supabase } from '../../lib/supabase';
import { Calendar, Facebook, Music } from 'lucide-react';

interface EditorialItem {
  id: string;
  date_publication: string;
  plateforme: 'facebook' | 'tiktok';
  theme: string;
  statut: 'planifie' | 'publie' | 'en_attente_validation';
}

const ClientEditorialCalendar = () => {
  const { user } = useClientAuth();
  const [items, setItems] = useState<EditorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (user?.client_id) fetchEditorialCalendar();
  }, [user?.client_id, currentMonth]);

  const fetchEditorialCalendar = async () => {
    try {
      if (!user?.client_id) return;

      const { data } = await supabase
        .from('calendrier_editorial')
        .select('*')
        .eq('client_id', user.client_id)
        .order('date_publication', { ascending: true });

      if (data) {
        const filtered = (data as EditorialItem[]).filter((item) => {
          const itemDate = new Date(item.date_publication);
          return (
            itemDate.getMonth() === currentMonth.getMonth() &&
            itemDate.getFullYear() === currentMonth.getFullYear()
          );
        });
        setItems(filtered);
      }
    } catch (error) {
      console.error('Error fetching editorial calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const platformBadges = {
    facebook: 'bg-[var(--brand-gold)]/15 text-[var(--brand-midnight)]',
    tiktok: 'bg-[var(--brand-midnight)]/10 text-[var(--brand-gold)]',
  };
  const statusBadges = {
    planifie: 'bg-yellow-100 text-yellow-800',
    publie: 'bg-green-100 text-green-800',
    en_attente_validation: 'bg-orange-100 text-orange-800',
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-24 rounded-3xl bg-slate-200"></div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-48 rounded-3xl bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--brand-gold)]/80">Calendrier éditorial</p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--brand-midnight)]">Contenus planifiés</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Suivez vos publications sociales et vos statuts de validation chaque mois.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Mois</p>
            <p className="mt-3 text-xl font-semibold text-[var(--brand-midnight)]">{monthName}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-[var(--brand-midnight)] transition hover:border-[var(--brand-gold)]/70 hover:bg-[var(--brand-gold)]/10 sm:px-4 sm:py-2 sm:text-sm"
            >
              ← Précédent
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1) > new Date()}
              className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-[var(--brand-midnight)] transition hover:border-[var(--brand-gold)]/70 hover:bg-[var(--brand-gold)]/10 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
            >
              Suivant →
            </button>
          </div>
          <div className="text-sm text-slate-500">
            Mise à jour en temps réel pour votre contenu du mois.
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="rounded-[32px] border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-slate-400" />
          <h2 className="mt-4 text-2xl font-semibold text-[var(--brand-midnight)]">Aucun contenu planifié</h2>
          <p className="mt-3 text-sm text-slate-600">Votre équipe prépare déjà la prochaine sélection de publications.</p>
        </section>
      ) : (
        <section className="space-y-6">
          {items.map((item) => (
            <article key={item.id} className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{new Date(item.date_publication).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--brand-midnight)]">{item.theme}</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${platformBadges[item.plateforme]}`}>
                    {item.plateforme === 'facebook' ? <Facebook className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                    {item.plateforme.charAt(0).toUpperCase() + item.plateforme.slice(1)}
                  </span>
                  <span className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold ${statusBadges[item.statut]}`}>
                    {item.statut === 'planifie' && 'Planifié'}
                    {item.statut === 'publie' && 'Publié'}
                    {item.statut === 'en_attente_validation' && 'En attente'}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default ClientEditorialCalendar;
