import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, FileText, Download, UploadCloud, CheckCircle2, AlertTriangle } from 'lucide-react';
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
  in_review: 'En étude',
  quote_ready: 'Devis prêt',
  confirmed: 'Confirmé',
  rejected: 'Rejeté',
};

const statusOptions = [
  { value: 'submitted', label: 'Soumis' },
  { value: 'in_review', label: 'En étude' },
  { value: 'quote_ready', label: 'Devis prêt' },
  { value: 'confirmed', label: 'Confirmé' },
  { value: 'rejected', label: 'Rejeté' },
];

export default function AdminQuoteRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<QuoteRequestItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quoteFile, setQuoteFile] = useState<File | null>(null);
  const [status, setStatus] = useState('submitted');
  const [adminComment, setAdminComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedId) || null,
    [requests, selectedId]
  );

  useEffect(() => {
    if (selectedRequest) {
      setStatus(selectedRequest.status);
      setAdminComment(selectedRequest.admin_comment || '');
    }
  }, [selectedRequest]);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Quote requests fetch error', error);
      setError('Impossible de charger les demandes.');
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  };

  const uploadQuotePdf = async (file: File) => {
    const filePath = `quote-requests/quotes/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError || !uploadData) {
      throw uploadError || new Error('Upload failed');
    }

    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath);

    if (publicUrlError || !publicUrlData) {
      throw publicUrlError || new Error('Could not get public URL');
    }

    return publicUrlData.publicUrl;
  };

  const handleSave = async () => {
    if (!selectedRequest) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let quotePdfUrl = selectedRequest.quote_pdf_url;

      if (quoteFile) {
        quotePdfUrl = await uploadQuotePdf(quoteFile);
      }

      const progressMap: Record<string, number> = {
        submitted: 10,
        in_review: 40,
        quote_ready: 80,
        confirmed: 100,
        rejected: 0,
      };

      const { error: updateError } = await supabase
        .from('quote_requests')
        .update({
          status,
          admin_comment: adminComment || null,
          quote_pdf_url: quotePdfUrl,
          progress: progressMap[status] ?? selectedRequest.progress,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedRequest.id);

      if (updateError) {
        throw updateError;
      }

      if ((status === 'quote_ready' || status === 'confirmed') && selectedRequest.email) {
        await fetch('/api/send-quote-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: selectedRequest.email,
            clientName: selectedRequest.nom,
            offerName: selectedRequest.offre_nom,
            status,
            quoteUrl: quotePdfUrl,
            comment: adminComment,
          }),
        });
      }

      setSuccess('Mise à jour enregistrée avec succès.');
      setQuoteFile(null);
      await fetchRequests();
    } catch (err: any) {
      console.error('Admin quote update error', err);
      setError('Impossible d’enregistrer les modifications.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-28">
      <SEO title="Gestion des devis | Admin MIDEESSI" description="Pilotez les dossiers, générez des devis et notifiez vos clients." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au dashboard
        </button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-blue-600/90">Administration</p>
            <h1 className="text-3xl font-semibold text-midnight">Demandes de devis</h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Traitez les dossiers reçus, ajoutez un devis PDF et notifiez les clients automatiquement.</p>
          </div>
          <div className="rounded-3xl bg-gray-100 p-4 text-sm text-[var(--text-secondary)] dark:bg-gray-900">
            Total dossiers : <span className="font-semibold text-midnight">{requests.length}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-3 rounded-[28px] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-soft">
            <div className="rounded-[24px] border border-gray-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">En attente</p>
              <p className="mt-2 text-3xl font-semibold text-midnight">{requests.filter((item) => item.status === 'submitted').length}</p>
            </div>
            <div className="space-y-2">
              {loading ? (
                <p className="text-sm text-[var(--text-secondary)]">Chargement des demandes…</p>
              ) : requests.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">Aucune demande pour l’instant.</p>
              ) : (
                requests.map((request) => (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => setSelectedId(request.id)}
                    className={`w-full text-left rounded-3xl border px-4 py-4 transition ${selectedId === request.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40' : 'border-gray-200 bg-white dark:bg-gray-900 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-midnight">{request.offre_nom}</p>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">{request.nom} • {request.email}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${request.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : request.status === 'quote_ready' ? 'bg-blue-100 text-blue-700' : request.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {statusLabel[request.status as keyof typeof statusLabel] || request.status}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-soft">
            {!selectedRequest ? (
              <div className="rounded-[24px] border border-dashed border-gray-200 bg-white p-8 text-center text-[var(--text-secondary)]">
                <FileText className="mx-auto mb-4 h-10 w-10 text-gray-400" />
                <p className="text-lg font-semibold text-midnight">Sélectionnez une demande</p>
                <p className="mt-2">Cliquez sur un dossier pour afficher les détails et mettre à jour son statut.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-secondary)]">Dossier</p>
                      <h2 className="mt-2 text-2xl font-semibold text-midnight">{selectedRequest.offre_nom}</h2>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${selectedRequest.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : selectedRequest.status === 'quote_ready' ? 'bg-blue-100 text-blue-700' : selectedRequest.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {statusLabel[selectedRequest.status as keyof typeof statusLabel] || selectedRequest.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">Envoyé le {new Date(selectedRequest.created_at).toLocaleDateString('fr-FR')}</p>
                </div>

                <div className="rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">Client</p>
                      <p className="mt-2 text-sm text-midnight">{selectedRequest.nom} · {selectedRequest.email}</p>
                      {selectedRequest.entreprise && <p className="mt-1 text-sm text-[var(--text-secondary)]">{selectedRequest.entreprise}</p>}
                      {selectedRequest.telephone && <p className="mt-1 text-sm text-[var(--text-secondary)]">{selectedRequest.telephone}</p>}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">Dossier</p>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">Type : {selectedRequest.offre_type === 'tech' ? 'Développement tech' : 'Présence digitale'}</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">Progression : {selectedRequest.progress}%</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">Mis à jour : {new Date(selectedRequest.updated_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">Commentaire client</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)] whitespace-pre-line">{selectedRequest.message}</p>
                </div>

                <div className="rounded-[24px] bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">Pièce jointe</p>
                  {selectedRequest.attachment_url ? (
                    <a
                      href={selectedRequest.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
                    >
                      <Download className="h-4 w-4" /> Ouvrir la pièce jointe
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-[var(--text-secondary)]">Aucune pièce jointe fournie.</p>
                  )}
                </div>

                <div className="rounded-[24px] bg-white p-5 shadow-sm">
                  <label className="block text-sm font-semibold text-[var(--text-secondary)]">Statut</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm text-midnight outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>

                  <label className="mt-5 block text-sm font-semibold text-[var(--text-secondary)]">Commentaire admin</label>
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    rows={4}
                    className="mt-3 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm text-midnight outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Ajoutez un message pour le client..."
                  />

                  <div className="mt-5 rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-midnight">
                      <UploadCloud className="h-4 w-4" /> Télécharger un PDF de devis
                    </div>
                    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-midnight transition hover:bg-yellow-300">
                      Choisir un fichier
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(event) => setQuoteFile(event.target.files?.[0] || null)}
                      />
                    </label>
                    {quoteFile && <p className="mt-3 text-sm text-[var(--text-secondary)]">{quoteFile.name}</p>}
                    {selectedRequest.quote_pdf_url && (
                      <a
                        href={selectedRequest.quote_pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                      >
                        <Download className="h-4 w-4" /> Ouvrir le devis actuel
                      </a>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="rounded-3xl bg-[#fee2e2] p-4 text-sm text-red-700">{error}</div>
                )}
                {success && (
                  <div className="rounded-3xl bg-[#d1fae5] p-4 text-sm text-emerald-700">{success}</div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-midnight px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
