import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { LivrableCard } from '../components/features/livrables/LivrableCard';
import { Package, MessageCircle, Receipt, Bell, CalendarCheck, Sparkles, Clock3, ChevronRight, FileText } from 'lucide-react';
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

  return (
    <div className="pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEO title="Dashboard | Client MIDEESSI" description="Suivez votre abonnement, vos livrables et votre messagerie." />
      
      {/* Banner / Header */}
      <section className="rounded-2xl bg-[var(--brand-midnight)] text-white p-6 border border-[var(--brand-gold)]/20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 right-0 w-[400px] h-[400px] bg-[var(--brand-gold)]/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase tracking-[0.35em] text-[var(--brand-gold)] font-black">Espace Client MIDEESSI</span>
            <h1 className="text-2xl font-black text-white">Bonjour, {user?.nom || 'Client'}</h1>
            <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
              Suivez en direct l’avancement de vos projets, accédez à vos livrables et échangez avec l’équipe.
            </p>
          </div>

          <div className="flex gap-2.5">
            <Link to="/clients/dossiers" className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-midnight)] px-4 py-2.5 font-black text-xs hover:opacity-90 transition-opacity shadow-lg">
              Mes dossiers
            </Link>
            <Link to="/clients/devis" className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 text-white px-4 py-2.5 font-bold text-xs hover:bg-white/15 transition-all">
              Mes Devis
            </Link>
          </div>
        </div>

        {/* Subscription Info Row */}
        <div className="grid gap-3 sm:grid-cols-2 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 border border-white/8 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Abonnement</span>
              <p className="text-base font-black text-[var(--brand-gold)] mt-1">{packLabel}</p>
            </div>
            <span className="text-[10px] text-gray-400 font-bold bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">MIDEESSI</span>
          </div>

          <div className="bg-white/5 border border-white/8 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Statut / Échéance</span>
              <p className="text-xs font-bold text-white mt-1">
                {statusText} · Prochain prélèvement le {nextPayment}
              </p>
            </div>
            <span className={`w-2.5 h-2.5 rounded-full ${user?.statut === 'suspendu' ? 'bg-red-500' : 'bg-emerald-500'}`} />
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Livrables partagés', value: livrables.length, sub: 'Accès instantané', icon: Package, color: 'text-blue-400' },
          { label: 'Messages non lus', value: messagesCount, sub: 'Boîte de réception', icon: MessageCircle, color: 'text-amber-400' },
          { label: 'Total Factures', value: `${dueAmount.toLocaleString('fr-FR')} FCFA`, sub: 'Montant en attente', icon: Receipt, color: 'text-red-400' },
          { label: 'Action urgente', value: nextAction, sub: 'Priorité', icon: CalendarCheck, color: 'text-emerald-400' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block truncate">{s.label}</span>
              <p className="text-base font-black text-[var(--brand-midnight)] dark:text-white mt-1 truncate">{s.value}</p>
              <p className="text-[9px] text-gray-400 mt-0.5">{s.sub}</p>
            </div>
            <s.icon className={`w-5 h-5 ${s.color} opacity-80 flex-shrink-0 ml-2`} />
          </div>
        ))}
      </div>

      {user?.statut === 'suspendu' && (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/40 p-4 text-xs font-semibold text-red-700 dark:text-red-400">
          ⚠️ Votre compte est suspendu. Veuillez régler vos factures en attente pour rétablir l'accès complet à vos services MIDEESSI.
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Deliverables & Messages */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl shadow-sm divide-y divide-[var(--border)]">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h2 className="font-black text-[var(--brand-midnight)] dark:text-white text-sm">Livrables récents</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">Dossiers et livrables créés pour votre marque</p>
              </div>
              <Link to="/clients/livrables" className="text-xs font-bold text-[var(--brand-gold)] hover:underline flex items-center gap-0.5">
                Voir tout <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center"><Loader className="w-6 h-6 animate-spin text-[var(--brand-gold)] mx-auto" /></div>
            ) : livrables.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-400">Aucun livrable disponible</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {livrables.map((l) => (
                  <div key={l.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[var(--bg-surface)] transition-colors">
                    <div className="min-w-0">
                      <span className="text-[8px] uppercase tracking-wider text-[var(--brand-gold)] font-bold">{l.type}</span>
                      <h3 className="text-xs font-black text-[var(--brand-midnight)] dark:text-white truncate">{l.titre}</h3>
                      <p className="text-[10px] text-gray-400 truncate">{l.description}</p>
                    </div>
                    {l.url && (
                      <a href={l.url} target="_blank" rel="noreferrer" className="flex-shrink-0 inline-flex items-center gap-1 bg-[var(--brand-midnight)] text-[var(--brand-gold)] text-[10px] font-black px-3 py-1.5 rounded-lg hover:opacity-90">
                        <FileText className="w-3 h-3" /> Ouvrir
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Factures */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl shadow-sm divide-y divide-[var(--border)]">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h2 className="font-black text-[var(--brand-midnight)] dark:text-white text-sm">Facturation</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">Vos dernières factures mensuelles</p>
              </div>
              <Link to="/clients/factures" className="text-xs font-bold text-[var(--brand-gold)] hover:underline">
                Historique
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center"><Loader className="w-5 h-5 animate-spin text-[var(--brand-gold)] mx-auto" /></div>
            ) : factures.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">Aucune facture émise</div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {factures.map((f) => (
                  <div key={f.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-black text-[var(--brand-midnight)] dark:text-white">{f.periode}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">Émise le {new Date(f.emitted_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="font-black text-[var(--brand-midnight)] dark:text-white">{f.montant.toLocaleString('fr-FR')} FCFA</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${f.statut === 'Payé' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                        {f.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Inline Loader component helper
function Loader(props: any) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
