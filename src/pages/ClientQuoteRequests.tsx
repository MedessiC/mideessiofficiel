import { useEffect, useMemo, useState } from 'react';
import { Download, Clock3, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
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

        if (error) {
          throw error;
        }

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
    <div className="pb-28">
      <SEO title="Mes devis | Client MIDEESSI" description="Suivez l’avancement de vos dossiers et récupérez vos devis PDF." />

      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-gold)]/90">Devis & dossiers</p>
        <h1 className="text-3xl font-semibold text-[var(--brand-midnight)]">Mon espace devis</h1>
        <p className="max-w-3xl text-sm text-[var(--text-secondary)]">Consultez l’état des dossiers envoyés, accédez aux devis PDF et suivez votre progression.</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-soft">
          <div className="flex items-center gap-3 text-[var(--brand-gold)]">
            <FileText className="h-5 w-5" />
            <span className="text-xs uppercase tracking-[0.35em] text-[var(--brand-gold)]/90">Dossiers envoyés</span>
          </div>
          <p className="mt-4 text-4xl font-semibold text-[var(--brand-midnight)]">{totalRequests}</p>
        </div>

        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-soft">
          <div className="flex items-center gap-3 text-[var(--brand-midnight)]">
            <Clock3 className="h-5 w-5" />
            <span className="text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">Dernière mise à jour</span>
          </div>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">{latestRequest ? new Date(latestRequest.updated_at).toLocaleString('fr-FR') : 'Aucun dossier'}</p>
          <p className="mt-1 text-base font-semibold text-[var(--brand-midnight)]">{summary}</p>
        </div>

        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-soft">
          <div className="flex items-center gap-3 text-[var(--brand-midnight)]">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">Objectif</span>
          </div>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">Suivez la progression de chaque dossier jusqu’à la confirmation du devis.</p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {loading ? (
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--bg-card)] p-8 shadow-soft">
            <p className="text-sm text-[var(--text-secondary)]">Chargement...</p>
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-200 bg-[#fff1f2] p-6 text-red-700 shadow-soft">
            {error}
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--bg-card)] p-8 text-center text-[var(--text-secondary)]">
            <p className="text-lg font-semibold text-[var(--brand-midnight)]">Aucun dossier trouvé</p>
            <p className="mt-2">Soumettez un dossier depuis la page d’une offre pour lancer une étude et recevoir un devis.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="rounded-[28px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-soft">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-gold)]/80">{request.offre_type === 'tech' ? 'Service tech' : 'Offre présence digitale'}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-midnight)]">{request.offre_nom}</h2>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">Soumis le {new Date(request.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    <span className="text-sm font-semibold text-[var(--brand-midnight)]">Statut</span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${request.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : request.status === 'quote_ready' ? 'bg-blue-100 text-blue-700' : request.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {statusLabel[request.status as keyof typeof statusLabel] || request.status}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-3xl bg-white/80 p-4 shadow-sm dark:bg-gray-950/70">
                    <div className="flex items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
                      <span>Avancement</span>
                      <span>{request.progress}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-400" style={{ width: `${Math.min(Math.max(request.progress, 0), 100)}%` }} />
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-3xl bg-gray-50 p-4 dark:bg-gray-900">
                      <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">Pièce jointe</p>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">{request.attachment_url ? 'Envoyée' : 'Aucune'}</p>
                    </div>
                    <div className="rounded-3xl bg-gray-50 p-4 dark:bg-gray-900">
                      <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">Devis PDF</p>
                      {request.quote_pdf_url ? (
                        <a
                          href={request.quote_pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                        >
                          <Download className="h-4 w-4" /> Télécharger
                        </a>
                      ) : (
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">Pas encore disponible</p>
                      )}
                    </div>
                    <div className="rounded-3xl bg-gray-50 p-4 dark:bg-gray-900">
                      <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">Commentaire admin</p>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">{request.admin_comment || 'Aucun commentaire pour l’instant'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-gray-100 p-4 text-sm text-[var(--text-secondary)] dark:bg-gray-950">
                  <p className="font-semibold text-[var(--brand-midnight)]">Votre brief</p>
                  <p className="mt-2 leading-relaxed">{request.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
