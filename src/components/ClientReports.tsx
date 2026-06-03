import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';

interface ClientReport {
  id: string;
  client_id: string;
  period_month: string;
  title: string;
  description: string;
  metrics_data: {
    [key: string]: any;
  };
  is_published: boolean;
  created_at: string;
}

interface ClientReportsProps {
  clientId: string;
}

const ClientReports = ({ clientId }: ClientReportsProps) => {
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ClientReport | null>(null);

  useEffect(() => {
    fetchReports();
  }, [clientId]);

  const fetchReports = async () => {
    try {
      const { data } = await supabase
        .from('client_reports')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_published', true)
        .order('period_month', { ascending: false });

      if (data) {
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (report: ClientReport) => {
    // Pour une vraie implémentation, vous auriez besoin d'une bibliothèque comme jsPDF
    // Pour maintenant, on génère un simple HTML à télécharger
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rapport - ${report.title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #d4af37;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #1a1a3e;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #666;
            margin: 5px 0 0 0;
          }
          .period {
            font-size: 14px;
            color: #999;
            margin-top: 10px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #1a1a3e;
            border-left: 4px solid #d4af37;
            padding-left: 10px;
            font-size: 18px;
            margin-top: 0;
          }
          .description {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            line-height: 1.6;
          }
          .metrics {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .metric-card {
            background: #faf8f3;
            border: 2px solid #e8dcc4;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
          }
          .metric-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }
          .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #d4af37;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${report.title}</h1>
          <p>Rapport de suivi MIDEESSI</p>
          <div class="period">
            ${new Date(report.period_month).toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>

        ${
          report.description
            ? `
          <div class="section">
            <h2>Résumé</h2>
            <div class="description">
              ${report.description.split('\n').join('<br>')}
            </div>
          </div>
        `
            : ''
        }

        ${
          report.metrics_data && Object.keys(report.metrics_data).length > 0
            ? `
          <div class="section">
            <h2>Métriques de Performance</h2>
            <div class="metrics">
              ${Object.entries(report.metrics_data)
                .map(
                  ([key, value]) => `
                <div class="metric-card">
                  <div class="metric-label">${key}</div>
                  <div class="metric-value">${value}</div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        <div class="footer">
          <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          <p>© MIDEESSI - Tous droits réservés</p>
        </div>
      </body>
      </html>
    `;

    // Créer un blob et télécharger
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Rapport_${report.title.replace(/\s+/g, '_')}_${report.period_month}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-midnight dark:text-white flex items-center gap-2 mb-2">
          <FileText className="w-6 h-6" />
          Rapports de suivi
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Consultez les rapports mensuels de votre service
        </p>
      </div>

      {!selectedReport ? (
        <>
          {/* Reports Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="mb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-3 rounded-lg bg-gold/20">
                      <FileText className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-midnight dark:text-white text-lg">
                        {report.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(report.period_month).toLocaleDateString('fr-FR', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  {report.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-2">
                      {report.description}
                    </p>
                  )}
                </div>

                {/* Metrics Preview */}
                {report.metrics_data && Object.keys(report.metrics_data).length > 0 && (
                  <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      {Object.keys(report.metrics_data).length} métriques
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(report.metrics_data)
                        .slice(0, 3)
                        .map((key) => (
                          <span
                            key={key}
                            className="text-xs px-2 py-1 bg-gold/20 text-gold rounded"
                          >
                            {key}
                          </span>
                        ))}
                      {Object.keys(report.metrics_data).length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                          +{Object.keys(report.metrics_data).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button className="w-full px-4 py-2 rounded-lg bg-gold hover:bg-gold/90 text-midnight font-bold text-sm transition-colors">
                  Voir le rapport
                </button>
              </div>
            ))}
          </div>

          {reports.length === 0 && (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucun rapport disponible
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Vos rapports mensuels seront disponibles ici une fois créés par votre équipe
              </p>
            </div>
          )}
        </>
      ) : (
        // Detailed Report View
        <div className="space-y-6">
          <button
            onClick={() => setSelectedReport(null)}
            className="text-gold hover:text-gold/80 font-semibold text-sm"
          >
            ← Retour aux rapports
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl font-bold text-midnight dark:text-white mb-2">
                {selectedReport.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(selectedReport.period_month).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>

            {/* Description */}
            {selectedReport.description && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-midnight dark:text-white mb-3">Résumé</h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedReport.description}
                  </p>
                </div>
              </div>
            )}

            {/* Metrics */}
            {selectedReport.metrics_data &&
              Object.keys(selectedReport.metrics_data).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-midnight dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Métriques de Performance
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(selectedReport.metrics_data).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-gradient-to-br from-gold/10 to-yellow-50/10 dark:from-yellow-900/20 dark:to-yellow-800/10 rounded-lg p-4 border border-gold/30 dark:border-yellow-700/30 text-center"
                      >
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                          {key}
                        </p>
                        <p className="text-2xl font-bold text-gold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex gap-3 md:justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedReport(null)}
                className="flex-1 md:flex-none px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-midnight dark:text-white font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => downloadPDF(selectedReport)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gold hover:bg-gold/90 text-midnight font-bold transition-colors"
              >
                <Download className="w-5 h-5" />
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientReports;
