import { useEffect, useMemo, useState } from 'react';
import { Download, Clock3, CheckCircle2, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useClientAuth } from '../contexts/ClientContext';
import SEO from '../components/SEO';

interface QuoteRequestItem {
  id: string;
  client_id: string | null;
  email: string;
  nom: string;
  entreprise: string | null;
  telephone: string | null;
  offre_type: string;
  offre_slug: string | null;
  offre_nom: string;
  message: string;
  attachment_url: string | null;
  quote_pdf_url: string | null;
  admin_comment: string | null;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

const statusLabel = {
  submitted: 'Soumis',
  in_review: 'En cours d’étude',
  quote_ready: 'Devis prêt',
  confirmed: 'Confirmé',
  rejected: 'Rejeté',
};

export default function ClientQuoteRequests() {
  const { user } = useClientAuth();
  const [requests, setRequests] = useState<QuoteRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.client_id) return;

    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error } = await supabase
          .from('quote_requests')
          .select('*')
          .eq('client_id', user.client_id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRequests(data || []);
      } catch (err: any) {
        console.error('Quote requests load error', err);
        setError('Impossible de charger vos demandes de devis.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    const subscription = supabase
      .channel(`client_quote_requests_live:${user.client_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests',
          filter: `client_id=eq.${user.client_id}`,
        },
        fetchRequests
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [user?.client_id]);

  const totalRequests = requests.length;
  const latestRequest = requests[0];

  const summary = useMemo(() => {
    if (!latestRequest) return 'Aucune demande de devis enregistrée.';
    return `Dernier dossier : ${statusLabel[latestRequest.status as keyof typeof statusLabel] || latestRequest.status}`;
  }, [latestRequest]);

  return (
    <div className="pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEO title="Mes devis | Client MIDEESSI" description="Suivez l’avancement de vos dossiers et récupérez vos devis PDF." />

      {/* Header Banner */}
      <section className="rounded-2xl bg-[var(--brand-midnight)] text-white p-6 border border-[var(--brand-gold)]/20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 right-0 w-[400px] h-[400px] bg-[var(--brand-gold)]/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative space-y-2">
          <span className="text-[9px] uppercase tracking-[0.35em] text-[var(--brand-gold)] font-black">Suivi des dossiers</span>
          <h1 className="text-2xl font-black text-white">Mon Espace Devis</h1>
          <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
            Consultez en temps réel l'avancement de vos études, vos propositions budgétaires et téléchargez vos devis validés.
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Dossiers soumis', value: totalRequests, icon: FileText, color: 'text-blue-400' },
          { label: 'Dernière mise à jour', value: latestRequest ? new Date(latestRequest.updated_at).toLocaleDateString('fr-FR') : 'Aucun', icon: Clock3, color: 'text-amber-400' },
          { label: 'Statut du projet', value: latestRequest ? statusLabel[latestRequest.status as keyof typeof statusLabel] || latestRequest.status : 'Aucun dossier', icon: CheckCircle2, color: 'text-emerald-400' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{s.label}</span>
              <p className="text-base font-black text-[var(--brand-midnight)] dark:text-white mt-1">{s.value}</p>
            </div>
            <s.icon className={`w-5 h-5 ${s.color} opacity-80`} />
          </div>
        ))}
      </div>

      {/* Devis List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-8 text-center">
            <Loader className="w-6 h-6 animate-spin text-[var(--brand-gold)] mx-auto" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-4 text-xs font-semibold text-red-700 dark:text-red-400">
            {error}
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-10 text-center space-y-2">
            <FileText className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="font-bold text-[var(--brand-midnight)] dark:text-white text-sm">Aucun dossier soumis</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
              Pour initier un nouveau projet ou obtenir un devis, veuillez soumettre votre dossier depuis la page d'une de nos offres de présence digitale ou tech.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--border)] pb-3">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-[var(--brand-gold)] font-bold">
                      {request.offre_type === 'tech' ? 'Ingénierie & Tech' : 'Présence digitale'}
                    </span>
                    <h2 className="text-sm font-black text-[var(--brand-midnight)] dark:text-white mt-0.5">{request.offre_nom}</h2>
                    <p className="text-[9px] text-gray-400">Soumis le {new Date(request.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className={`inline-flex rounded-lg px-2.5 py-0.5 text-[10px] font-black border ${
                      request.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : request.status === 'quote_ready'
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        : request.status === 'rejected'
                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {statusLabel[request.status as keyof typeof statusLabel] || request.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border)]">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1.5">
                    <span>Avancement de l'étude</span>
                    <span className="font-bold">{request.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 rounded-full transition-all duration-500" style={{ width: `${request.progress}%` }} />
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid gap-3 sm:grid-cols-3 text-xs">
                  <div className="bg-[var(--bg-surface)] p-3.5 rounded-xl border border-[var(--border)]">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Brief client</span>
                    <p className="text-[11px] text-[var(--brand-midnight)] dark:text-white leading-relaxed line-clamp-3" title={request.message}>
                      {request.message}
                    </p>
                  </div>

                  <div className="bg-[var(--bg-surface)] p-3.5 rounded-xl border border-[var(--border)] flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Devis PDF</span>
                      {request.quote_pdf_url ? (
                        <a href={request.quote_pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-[var(--brand-midnight)] text-[var(--brand-gold)] text-[10px] font-black px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                          <Download className="w-3 h-3" /> Télécharger devis
                        </a>
                      ) : (
                        <p className="text-[10px] text-gray-400 leading-normal">L'étude est en cours. Le devis sera téléchargeable dès sa validation.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-[var(--bg-surface)] p-3.5 rounded-xl border border-[var(--border)]">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Commentaire expert</span>
                    <p className="text-[10px] text-gray-400 leading-normal">
                      {request.admin_comment || "En attente d'évaluation de nos experts."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
