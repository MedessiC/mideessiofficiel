import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useClientAuth } from '../../contexts/ClientContext';
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';

interface ClientReport {
  id: string;
  client_id: string;
  period_month: string;
  title: string;
  description: string;
  metrics_data: Record<string, string | number>;
  is_published: boolean;
  created_at: string;
}

const ClientReports = () => {
  const { user } = useClientAuth();
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ClientReport | null>(null);

  useEffect(() => {
    if (user?.client_id) {
      fetchReports();
    }
  }, [user?.client_id]);

  const fetchReports = async () => {
    try {
      if (!user?.client_id) return;

      const { data } = await supabase
        .from('client_reports')
        .select('*')
        .eq('client_id', user.client_id)
        .eq('is_published', true)
        .order('period_month', { ascending: false });

      if (data) {
        setReports(data as ClientReport[]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (value: string) =>
    new Date(value).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });

  const downloadPDF = (report: ClientReport) => {
    const htmlContent = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Rapport - ${report.title}</title><style>body{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;color:#111;background:#fff;margin:0;padding:32px;}h1{margin:0 0 16px;color:#111;font-size:32px;}p{margin:0 0 12px;line-height:1.7;color:#444;} .section{margin-bottom:28px;} .section h2{font-size:18px;margin-bottom:12px;color:#111;} .metric{display:flex;justify-content:space-between;background:#f8f4ec;border:1px solid #e3d8b4;border-radius:16px;padding:18px 20px;margin-bottom:12px;} .metric-label{color:#666;text-transform:uppercase;font-size:12px;letter-spacing:.12em;} .metric-value{color:#b5851d;font-size:24px;font-weight:700;} .footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;color:#777;font-size:13px;}</style></head><body><h1>${report.title}</h1><p>${formatMonth(report.period_month)}</p>${report.description ? `<div class="section"><h2>Résumé</h2><p>${report.description.replace(/\n/g, '<br/>')}</p></div>` : ''}${report.metrics_data && Object.keys(report.metrics_data).length > 0 ? `<div class="section"><h2>Métriques</h2>${Object.entries(report.metrics_data).map(([key, value]) => `<div class="metric"><span class="metric-label">${key}</span><span class="metric-value">${value}</span></div>`).join('')}</div>` : ''}<div class="footer"><p>Document généré le ${new Date().toLocaleDateString('fr-FR')}.</p><p>© MIDEESSI</p></div></body></html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Rapport_${report.title.replace(/\s+/g, '_')}_${report.period_month}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/95 p-8 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--brand-gold)]/80">Rapports</p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--brand-midnight)]">Suivi premium de vos performances</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Retrouvez ici tous vos documents structurés et téléchargez les rapports MIDEESSI en un clic.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Rapports publiés</p>
            <p className="mt-3 text-3xl font-semibold text-[var(--brand-midnight)]">{reports.length}</p>
          </div>
        </div>
      </section>

      {selectedReport ? (
        <section className="rounded-[32px] border border-slate-200/80 bg-white/95 p-8 shadow-soft">
          <button
            type="button"
            onClick={() => setSelectedReport(null)}
            className="text-sm font-semibold text-[var(--brand-midnight)] hover:text-[var(--brand-gold)]"
          >
            ← Retour aux rapports
          </button>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Détail</p>
              <h2 className="text-3xl font-semibold text-[var(--brand-midnight)]">{selectedReport.title}</h2>
              <p className="text-sm text-slate-600">{formatMonth(selectedReport.period_month)}</p>
            </div>

            {selectedReport.description && (
              <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-[var(--brand-midnight)] mb-3">Résumé</h3>
                <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{selectedReport.description}</p>
              </div>
            )}

            {selectedReport.metrics_data && Object.keys(selectedReport.metrics_data).length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Object.entries(selectedReport.metrics_data).map(([key, value]) => (
                  <div key={key} className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{key}</p>
                    <p className="mt-3 text-3xl font-semibold text-[var(--brand-gold)]">{value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-full border border-slate-300 bg-transparent px-6 py-3 text-sm font-semibold text-[var(--brand-midnight)] hover:border-[var(--brand-gold)]"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => downloadPDF(selectedReport)}
                className="rounded-full bg-[var(--brand-gold)] px-6 py-3 text-sm font-semibold text-[var(--brand-midnight)] hover:bg-[var(--brand-gold)]/90"
              >
                <Download className="mr-2 inline-block h-4 w-4" /> Télécharger
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reports.map((report) => (
              <article
                key={report.id}
                className="group rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{formatMonth(report.period_month)}</p>
                    <h3 className="mt-3 text-xl font-semibold text-[var(--brand-midnight)]">{report.title}</h3>
                  </div>
                  <div className="rounded-3xl bg-[var(--brand-gold)]/15 p-3 text-[var(--brand-midnight)]">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>

                {report.description && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-3">{report.description}</p>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  {Object.keys(report.metrics_data)
                    .slice(0, 3)
                    .map((metric) => (
                      <span key={metric} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {metric}
                      </span>
                    ))}
                  {Object.keys(report.metrics_data).length > 3 && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      +{Object.keys(report.metrics_data).length - 3}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReport(report)}
                  className="mt-6 w-full rounded-full bg-[var(--brand-gold)] px-5 py-3 text-sm font-semibold text-[var(--brand-midnight)] hover:bg-[var(--brand-gold)]/90"
                >
                  Voir le rapport
                </button>
              </article>
            ))}
          </div>

          {reports.length === 0 && (
            <div className="rounded-[32px] border border-dashed border-slate-200/80 bg-slate-50 p-16 text-center">
              <FileText className="mx-auto h-14 w-14 text-slate-400" />
              <h2 className="mt-6 text-2xl font-semibold text-[var(--brand-midnight)]">Aucun rapport disponible</h2>
              <p className="mt-3 text-sm text-slate-600">
                Votre équipe MIDEESSI travaille déjà sur votre prochain document.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ClientReports;
