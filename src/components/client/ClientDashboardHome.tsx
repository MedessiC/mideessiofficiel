import { useEffect, useState } from 'react';
import { useClientAuth } from '../../contexts/ClientContext';
import { supabase } from '../../lib/supabase';
import { BarChart3, User, Shield } from 'lucide-react';

interface ClientData {
  pack?: string;
  numero_contrat?: string;
  date_debut?: string;
  duree_mois?: number;
  est_periode_test?: boolean;
  statut?: string;
  contract_url?: string;
  nom_marque?: string;
}

const ClientDashboardHome = () => {
  const { user } = useClientAuth();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, [user?.client_id]);

  const fetchClientData = async () => {
    try {
      if (!user?.client_id) return;

      const { data } = await supabase
        .from('clients')
        .select('pack, numero_contrat, date_debut, duree_mois, est_periode_test, statut, contract_url, nom_marque')
        .eq('client_id', user.client_id)
        .single();

      let clientRecord = data || null;

      if (clientRecord && !clientRecord.contract_url) {
        const { data: infoData } = await supabase
          .from('client_infos')
          .select('contract_url')
          .eq('client_id', user.client_id)
          .single();

        if (infoData?.contract_url) {
          clientRecord = {
            ...clientRecord,
            contract_url: infoData.contract_url,
          };
        }
      }

      setClient(clientRecord);
    } catch (err) {
      console.error('Error fetching client data:', err);
    } finally {
      setLoading(false);
    }
  };

  const safeNumber = (value: any) => (typeof value === 'number' && Number.isFinite(value) ? value : 0);

  const parseDate = (date?: string) => (date ? new Date(date) : null);

  const calculateEndDate = () => {
    const start = parseDate(client?.date_debut);
    if (!start || !safeNumber(client?.duree_mois) || client?.duree_mois! <= 0) return '';
    const end = new Date(start);
    end.setMonth(end.getMonth() + (client?.duree_mois || 0));
    return end.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateProgress = () => {
    const start = parseDate(client?.date_debut);
    if (!start || !safeNumber(client?.duree_mois) || client?.duree_mois! <= 0) return 0;
    const end = new Date(start);
    end.setMonth(end.getMonth() + (client?.duree_mois || 0));
    const total = end.getTime() - start.getTime();
    const elapsed = Date.now() - start.getTime();
    if (!Number.isFinite(total) || total <= 0) return 0;
    return Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);
  };

  const formatStatus = (value?: string) => {
    if (!value) return 'En cours';
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-slate-200 rounded-3xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-32 bg-slate-200 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[28px] border border-slate-200/80 bg-white/95 p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex rounded-full bg-[var(--brand-gold)]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-midnight)]">
              Espace client MIDEESSI
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-[var(--brand-midnight)] sm:text-3xl">Bienvenue {client?.nom_marque || user?.nom_marque}</h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Accédez à votre accompagnement, suivez votre contrat et échangez avec votre équipe experte.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Statut</p>
              <p className="mt-3 text-sm font-semibold text-[var(--brand-midnight)]">{formatStatus(client?.statut)}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Pack</p>
              <p className="mt-3 text-sm font-semibold text-[var(--brand-midnight)]">{(client?.pack || 'kpevi').toUpperCase()}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Contrat</p>
              <p className="mt-3 text-sm font-semibold text-[var(--brand-midnight)]">{client?.numero_contrat || '—'}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Fin</p>
              <p className="mt-3 text-sm font-semibold text-[var(--brand-midnight)]">{calculateEndDate() || '—'}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <article className="space-y-6 rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Progression du service</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--brand-midnight)]">Suivi de votre accompagnement</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-gold)]/10 px-4 py-2 text-sm font-semibold text-[var(--brand-midnight)]">
              <Shield className="h-4 w-4" />
              Sécurité & transparence
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-100 p-5">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Activité réalisée</span>
                <span>{calculateProgress()}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400" style={{ width: `${calculateProgress()}%` }} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Début', value: client?.date_debut ? new Date(client.date_debut).toLocaleDateString('fr-FR') : '—' },
                { label: 'Durée', value: client?.duree_mois ? `${client.duree_mois} mois` : '—' },
                { label: 'Test', value: client?.est_periode_test ? 'Oui' : 'Non' },
                { label: 'Dernière mise à jour', value: new Date().toLocaleDateString('fr-FR') },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                  <p className="mt-3 font-semibold text-[var(--brand-midnight)]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Prochain point</p>
                <p className="mt-2 text-xl font-semibold text-[var(--brand-midnight)]">Réunion de suivi prévue</p>
              </div>
              <button onClick={() => window.location.href = '/clients/messages'} className="rounded-full bg-[var(--brand-gold)] px-5 py-3 text-sm font-semibold text-[var(--brand-midnight)] transition hover:bg-[var(--brand-gold)]/90">
                Contactez-nous
              </button>
            </div>
          </div>
        </article>

        <aside className="space-y-6 rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-soft">
          <div className="rounded-[28px] border border-[var(--brand-gold)]/20 bg-[var(--brand-gold)]/10 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--brand-midnight)]/70">Accompagnement premium</p>
            <h3 className="mt-3 text-2xl font-semibold text-[var(--brand-midnight)]">Service dédié</h3>
            <p className="mt-3 text-sm text-slate-600">Votre équipe MIDEESSI est disponible pour valider le planning, les contenus et les performances.</p>
          </div>

          <div className="space-y-4 rounded-[28px] bg-slate-100 p-6">
            <button onClick={() => window.location.href = '/clients/messages'} className="w-full rounded-2xl bg-[var(--brand-midnight)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#13135b]">
              Ouvrir la messagerie
            </button>
            <button onClick={() => window.location.href = '/clients/reports'} className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 text-sm font-semibold text-[var(--brand-midnight)] transition hover:border-[var(--brand-gold)]/70">
              Voir les rapports
            </button>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-[var(--brand-midnight)]">Support</p>
            <p className="mt-2 text-sm text-slate-600">Une question urgente ? Nous répondons sous 24h ouvrées.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ClientDashboardHome;
