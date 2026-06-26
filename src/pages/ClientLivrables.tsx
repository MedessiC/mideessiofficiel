import { useEffect, useMemo, useState } from 'react';
import { useClientAuth } from '../contexts/ClientContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { LivrableCard } from '../components/features/livrables/LivrableCard';

interface LivrableItem {
  id: string;
  titre: string;
  description: string;
  type: 'link' | 'file' | 'report';
  created_at: string;
  url?: string;
}

const filterOptions = ['Tous', 'Liens', 'Fichiers', 'Rapports'] as const;

export default function ClientLivrables() {
  const { user } = useClientAuth();
  const [livrables, setLivrables] = useState<LivrableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<typeof filterOptions[number]>('Tous');

  useEffect(() => {
    if (!user?.client_id) return;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('livrables')
        .select('id,titre,description,type,created_at,url')
        .eq('client_id', user.client_id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) {
        console.error('Livrables load error', error);
      }
      setLivrables((data || []) as LivrableItem[]);
      setLoading(false);
    };
    load();
  }, [user?.client_id]);

  const filtered = useMemo(() => {
    if (activeFilter === 'Tous') return livrables;
    return livrables.filter((item) => {
      if (activeFilter === 'Liens') return item.type === 'link';
      if (activeFilter === 'Fichiers') return item.type === 'file';
      return item.type === 'report';
    });
  }, [activeFilter, livrables]);

  return (
    <div className="space-y-6">
      <SEO title="Livrables | Client MIDEESSI" description="Consultez vos livrables partagés par l'équipe MIDEESSI." />

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-gold)]/90">Livrables</p>
        <h1 className="text-2xl font-semibold text-[var(--brand-midnight)]">Vos fichiers, liens et rapports</h1>
        <p className="max-w-2xl text-sm text-[var(--text-secondary)]">Filtrez par type et accédez rapidement à votre dernière livraison.</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filterOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setActiveFilter(option)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeFilter === option
                ? 'border-[var(--brand-midnight)] bg-[var(--brand-midnight)]/10 text-[var(--brand-midnight)]'
                : 'border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--brand-gold)]/40'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Vos livrables apparaîtront ici"
          description="Aucun livrable n’est encore disponible. Rendez-vous bientôt pour voir vos contenus terminés."
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <LivrableCard
              key={item.id}
              title={item.titre}
              description={item.description}
              type={item.type}
              date={new Date(item.created_at).toLocaleDateString('fr-FR')}
              onAction={() => window.open(item.url || '#', '_blank')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
