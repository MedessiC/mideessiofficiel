import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { LivrableCard } from '../components/features/livrables/LivrableCard';
import { Package, MessageCircle, Receipt, Bell, CalendarCheck, Sparkles, Clock3 } from 'lucide-react';
import { useClientAuth } from '../contexts/ClientContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

interface LivrableItem {
  id: string;
  titre: string;
  description: string;
  type: string;
  created_at: string;
  url?: string;
}

interface FactureItem {
  id: string;
  periode: string;
  montant: number;
  statut: string;
  emitted_at: string;
}

export default function ClientDashboard() {
  const { user } = useClientAuth();
  const [livrables, setLivrables] = useState<LivrableItem[]>([]);
  const [messagesCount, setMessagesCount] = useState(0);
  const [factures, setFactures] = useState<FactureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.client_id) return;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [livrablesRes, messagesRes, facturesRes] = await Promise.all([
          supabase
            .from('livrables')
            .select('id,titre,description,type,created_at,url')
            .eq('client_id', user.client_id)
            .order('created_at', { ascending: false })
            .limit(3),
          supabase
            .from('messages')
            .select('id')
            .eq('client_id', user.client_id)
            .eq('expediteur', 'admin')
            .eq('lu', false),
          supabase
            .from('factures')
            .select('id,periode,montant,statut,emitted_at')
            .eq('client_id', user.client_id)
            .order('emitted_at', { ascending: false })
            .limit(5),
        ]);

        if (livrablesRes.error) throw livrablesRes.error;
        if (messagesRes.error) throw messagesRes.error;
        if (facturesRes.error) throw facturesRes.error;

        setLivrables(livrablesRes.data || []);
        setMessagesCount(messagesRes.data?.length || 0);
        setFactures(facturesRes.data || []);
      } catch (err: any) {
        console.error('Dashboard load error', err);
        setError('Impossible de charger les données pour le tableau de bord.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.client_id]);

  const nextPayment = useMemo(() => {
    const dueInvoice = factures.find((fact) => fact.statut === 'En attente');
    if (!dueInvoice) {
      return '15 juillet 2026';
    }
    return new Date(dueInvoice.emitted_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [factures]);

  const statusText = user?.statut === 'suspendu' ? 'Suspendu' : 'Actif';

  const dueAmount = useMemo(() => factures.filter((fact) => fact.statut === 'En attente').reduce((sum, fact) => sum + fact.montant, 0), [factures]);
  const nextAction = messagesCount > 0 ? 'Répondre au message' : dueAmount > 0 ? 'Payer une facture' : 'Aucun élément urgent';
  const packLabel = user?.pack ? user.pack.toUpperCase() : 'PACK';
  const clientBadge = user?.pole || 'PD';
  const activityItems = useMemo(
    () => [
      { label: 'Nouveau livrable partagé', detail: livrables[0]?.titre || 'Aucun livrable récent', date: 'il y a 2 jours', color: 'bg-[var(--brand-gold)]' },
      { label: 'Message de l’équipe', detail: `${messagesCount} message${messagesCount > 1 ? 's' : ''} non lus`, date: 'il y a 1 jour', color: 'bg-[var(--brand-midnight)]' },
      { label: 'Facture générée', detail: factures[0]?.periode || 'Facture à venir', date: 'il y a 4 jours', color: 'bg-[#f59e0b]' },
    ],
    [livrables, messagesCount, factures]
  );

  return (
    <div className="pb-28">
      <SEO title="Dashboard | Client MIDEESSI" description="Suivez votre abonnement, vos livrables et votre messagerie." />
      <div className="space-y-6">
        <section className="rounded-[24px] bg-[var(--brand-midnight)] p-4 shadow-glow-gold sm:p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[var(--brand-gold)]/90">DT-002</span>
              <span className="text-[10px] uppercase tracking-[0.35em] text-white/80">Mon abonnement</span>
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-white">MIDEESSI</h1>
              <p className="mt-1 text-xs text-white/70">Un tableau de bord mobile-first et premium, pensé pour les clients MIDEESSI.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[20px] border border-white/10 bg-white/10 px-3 py-3">
                <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.3em] text-white/70">
                  <span className="min-w-0 truncate">Pack</span>
                  <span className="min-w-0 truncate text-[10px] text-white/60 whitespace-nowrap">/ mois</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate text-lg font-semibold text-[var(--brand-gold)]">{packLabel}</span>
                  <span className="min-w-0 truncate text-[10px] text-white/70 whitespace-nowrap">KPEVI</span>
                </div>
              </div>
              <div className="overflow-hidden rounded-[20px] border border-white/10 bg-white/10 px-3 py-3">
                <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.3em] text-white/70">
                  <span className="min-w-0 truncate">Statut</span>
                  <span className="min-w-0 truncate text-sm font-semibold text-white whitespace-nowrap">{statusText}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-white/70">
                  <span className="min-w-0 truncate">Prochain paiement</span>
                  <span className="min-w-0 truncate font-semibold text-white whitespace-nowrap">{nextPayment}</span>
                </div>
              </div>
            </div>
              <div className="mt-3">
                <Link to="/clients/dossiers" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-white font-semibold">Mes dossiers</Link>
              </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-[22px] border border-[var(--border)] bg-[var(--bg-card)] p-3 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-[var(--brand-gold)]/20 text-[var(--brand-gold)]">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-hint)]">Livrables</p>
                <p className="mt-2 text-xl font-semibold text-[var(--brand-midnight)]">{livrables.length}</p>
              </div>
            </div>
          </Card>
          <Card className="rounded-[22px] border border-[var(--border)] bg-[var(--bg-card)] p-3 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-[var(--brand-midnight)]/10 text-[var(--brand-midnight)]">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-hint)]">Messages</p>
                <p className="mt-2 text-xl font-semibold text-[var(--brand-midnight)]">{messagesCount}</p>
              </div>
            </div>
          </Card>
          <Card className="rounded-[22px] border border-[var(--border)] bg-[var(--bg-card)] p-3 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-[#fef3c7] text-[#92400e]">
                <Receipt className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-hint)]">Factures</p>
                <p className="mt-2 text-xl font-semibold text-[var(--brand-midnight)]">{dueAmount.toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>
          </Card>
          <Card className="rounded-[22px] border border-[var(--border)] bg-[var(--bg-card)] p-3 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-[var(--brand-gold)]/15 text-[var(--brand-gold)]">
                <CalendarCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-hint)]">Action</p>
                <p className="mt-2 text-xl font-semibold text-[var(--brand-midnight)]">{nextAction}</p>
              </div>
            </div>
          </Card>
        </div>

        {user?.statut === 'suspendu' && (
          <Card className="rounded-[24px] border border-red-200 bg-[#fff1f2] p-4 text-[#991b1b] shadow-soft">
            Votre compte est actuellement suspendu. Contactez MIDEESSI pour rétablir l'accès. La messagerie reste disponible.
          </Card>
        )}

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[var(--brand-gold)]" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--brand-gold)]/90">Livrables récents</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--brand-midnight)]">Derniers livrables</h2>
              </div>
            </div>
            <Link to="/clients/livrables" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-gold)] hover:text-[#ffe34d]">
              Voir tout
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : livrables.length === 0 ? (
            <EmptyState
              title="Aucun livrable pour l'instant"
              description="MIDEESSI publiera ici vos liens, rapports et fichiers partagés dès qu'ils seront prêts."
            />
          ) : (
            <div className="grid gap-4">
              {livrables.map((livrable) => (
                <LivrableCard
                  key={livrable.id}
                  title={livrable.titre}
                  description={livrable.description}
                  type={(livrable.type as 'link' | 'file' | 'report') || 'file'}
                  date={new Date(livrable.created_at).toLocaleDateString('fr-FR')}
                  onAction={() => window.open(livrable.url || '#', '_blank')}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--brand-gold)]" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--brand-gold)]/90">Activité récente</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--brand-midnight)]">Mises à jour</h2>
              </div>
            </div>
            <Badge label="En direct" variant="secondary" />
          </div>

          <div className="space-y-3">
            {!loading ? (
              activityItems.map((item) => (
                <div key={item.label} className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-soft sm:p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[var(--brand-midnight)]">{item.label}</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.detail}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">{item.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            )}
          </div>
        </section>
      </div>
      {error && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[min(90vw,420px)] -translate-x-1/2 rounded-[20px] border border-[#fecaca] bg-[#fef2f2] p-4 text-sm text-[#991b1b] shadow-soft">
          {error}
        </div>
      )}
    </div>
  );
}
