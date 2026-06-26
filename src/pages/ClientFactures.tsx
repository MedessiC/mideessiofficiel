import { useEffect, useMemo, useState } from 'react';
import { useClientAuth } from '../contexts/ClientContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { FactureCard } from '../components/features/factures/FactureCard';

interface FactureItem {
  id: string;
  periode: string;
  montant: number;
  statut: 'Payée' | 'En attente';
  emitted_at: string;
}

export default function ClientFactures() {
  const { user } = useClientAuth();
  const [factures, setFactures] = useState<FactureItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.client_id) return;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('factures')
        .select('id,periode,montant,statut,emitted_at')
        .eq('client_id', user.client_id)
        .order('emitted_at', { ascending: false })
        .limit(15);
      if (error) {
        console.error('Factures load error', error);
      }
      setFactures(data || []);
      setLoading(false);
    };
    load();
  }, [user?.client_id]);

  const totalPending = useMemo(
    () => factures.filter((f) => f.statut === 'En attente').reduce((sum, facture) => sum + facture.montant, 0),
    [factures]
  );

  const cardTitle = totalPending > 0 ? `${totalPending} FCFA en attente` : 'Total à jour';
  const cardClass = totalPending > 0 ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#dcfce7] text-[#166534]';

  return (
    <div className="space-y-6 pb-28">
      <SEO title="Factures | Client MIDEESSI" description="Consultez vos factures et paiements." />
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-gold)]/90">Factures</p>
        <h1 className="text-2xl font-semibold text-[var(--brand-midnight)]">Votre historique financier</h1>
        <p className="max-w-2xl text-sm text-[var(--text-secondary)]">Retrouvez vos périodes facturées, le statut de paiement et les actions disponibles.</p>
      </div>

      <div className={`rounded-[24px] border border-[var(--border)] p-5 shadow-soft ${cardClass}`}>
        <p className="text-sm uppercase tracking-[0.25em] text-[var(--brand-midnight)]/70">Résumé</p>
        <p className="mt-3 text-2xl font-semibold">{cardTitle}</p>
      </div>

      {loading ? (
        <div className="grid gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : factures.length === 0 ? (
        <EmptyState
          title="Aucune facture disponible"
          description="Dès que MIDEESSI émettra une facture, elle s’affichera dans cette liste." 
        />
      ) : (
        <div className="space-y-4">
          {factures.map((facture) => (
            <FactureCard
              key={facture.id}
              periode={facture.periode}
              montant={`${facture.montant.toLocaleString('fr-FR')} FCFA`}
              status={facture.statut}
              issuedAt={new Date(facture.emitted_at).toLocaleDateString('fr-FR')}
              onReport={() => window.alert('Nous avons bien reçu votre demande de signalement de paiement.')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
