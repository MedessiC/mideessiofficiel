import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, UploadCloud, Paperclip, Send } from 'lucide-react';
import SEO from '../components/SEO';
import { useClientAuth } from '../contexts/ClientContext';
import { supabase } from '../lib/supabase';

interface Props {}

const statusSteps = [
  { label: 'Soumis', value: 'submitted' },
  { label: 'En étude', value: 'in_review' },
  { label: 'Devis prêt', value: 'quote_ready' },
  { label: 'Confirmé', value: 'confirmed' },
];

const SubmitDossierNew: React.FC<Props> = () => {
  const { user } = useClientAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialSlug = params.get('offerSlug') || '';
  const initialName = params.get('offerName') || '';
  const initialType = (params.get('offerType') as 'presence' | 'tech') || 'presence';

  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [telephone, setTelephone] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentType, setAttachmentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setNom(user.nom_marque || '');
    }
  }, [user]);

  const attachmentPreview = useMemo(() => {
    if (!attachment) return null;
    if (attachment.type.startsWith('video/')) return 'Vidéo sélectionnée';
    if (attachment.type.startsWith('image/')) return 'Image sélectionnée';
    return attachment.name;
  }, [attachment]);

  const uploadAttachment = async (file: File) => {
    const filePath = `quote-requests/attachments/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError || !uploadData) {
      throw uploadError || new Error('Erreur d’upload');
    }

    const { data: publicUrlData, error: publicUrlError } = await supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath);

    if (publicUrlError || !publicUrlData) {
      throw publicUrlError || new Error('Erreur génération du lien public');
    }

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !nom.trim() || !message.trim()) {
      setError('Veuillez renseigner votre nom, email et un court message.');
      return;
    }

    setLoading(true);
    try {
      const attachmentUrl = attachment ? await uploadAttachment(attachment) : null;
      const attachmentMime = attachment?.type || null;

      const payload = {
        client_id: user?.client_id || null,
        email: email.trim(),
        nom: nom.trim(),
        entreprise: entreprise.trim() || null,
        telephone: telephone.trim() || null,
        offre_type: initialType,
        offre_slug: initialSlug,
        offre_nom: initialName,
        message: message.trim(),
        attachment_url: attachmentUrl,
        attachment_type: attachmentMime,
        status: 'submitted',
        progress: 10,
      };

      const { error: insertError } = await supabase.from('quote_requests').insert([payload]);

      if (insertError) {
        console.error('Quote insert error', insertError);
        setError('Impossible d’envoyer le dossier. Réessayez plus tard.');
      } else {
        setSuccess('Votre dossier a bien été envoyé. Nous étudions votre demande et vous recontactons rapidement.');
        setMessage('');
        setAttachment(null);
        setTimeout(() => navigate('/clients/dossiers'), 800);
      }
    } catch (err) {
      console.error('Quote submit error', err);
      setError('Erreur lors de l’envoi du dossier.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-[var(--bg-page)] text-[var(--text-primary)]">
      <SEO title="Soumettre un dossier | MIDEESSI" description="Soumettez votre dossier complet pour obtenir une étude et un devis." />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-[var(--bg-card)] p-6 shadow-soft border border-[var(--border)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-display font-bold text-[var(--brand-midnight)]">Soumettre un dossier</h1>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">Envoyez votre brief et documents pour une étude personnalisée de votre projet.</p>
                </div>
                <button onClick={() => navigate(-1)} className="rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--brand-gold)] transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">Nom</span>
                    <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex. Jean Dupont" className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20" />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="bonjour@exemple.com" className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20" />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">Entreprise (facultatif)</span>
                    <input value={entreprise} onChange={(e) => setEntreprise(e.target.value)} placeholder="Nom de l'entreprise" className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20" />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">Téléphone (facultatif)</span>
                    <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="+229 00 00 00 00" className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20" />
                  </label>
                </div>

                <label className="space-y-2 text-sm">
                  <span className="font-semibold text-[var(--text-primary)]">Votre demande</span>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Décrivez vos besoins, objectifs et éléments utiles pour l’étude" className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20" />
                </label>

                <div>
                  <label className="flex items-center justify-between gap-4 rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-5 w-5 text-[var(--brand-gold)]" />
                      <div>
                        <p className="font-semibold text-sm text-[var(--text-primary)]">Pièce jointe</p>
                        <p className="text-xs text-[var(--text-secondary)]">PDF, image, vidéo ou document</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-gold)] px-3 py-1 text-sm font-semibold text-[var(--brand-midnight)]">Choisir
                      <input type="file" accept="application/pdf,image/*,video/*,.doc,.docx,.txt" className="hidden" onChange={(event) => { const file = event.target.files?.[0] || null; setAttachment(file); setAttachmentType(file?.type || ''); }} />
                    </div>
                  </label>
                  {attachmentPreview && <p className="mt-2 text-xs text-[var(--text-secondary)]">{attachmentPreview}</p>}
                </div>

                {error && <p className="text-sm text-[var(--danger-red-strong)]">{error}</p>}
                {success && <p className="text-sm text-[var(--success)]">{success}</p>}

                <div className="flex items-center justify-end gap-3">
                  <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--text-primary)]">Annuler</button>
                  <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-gold)] px-5 py-2 text-sm font-semibold text-[var(--brand-midnight)] hover:brightness-95 disabled:opacity-60">
                    <Send className="h-4 w-4" />
                    {loading ? 'Envoi...' : 'Envoyer le dossier'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl bg-[var(--bg-card)] p-6 shadow-soft border border-[var(--border)] sticky top-28">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--brand-gold)]/90">Offre</p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--brand-midnight)] truncate">{initialName || 'Offre'}</h3>
                {initialSlug && <p className="mt-1 text-xs text-[var(--text-secondary)]">Référence : {initialSlug}</p>}
              </div>

              <div className="mt-3 space-y-3">
                {statusSteps.map((step, idx) => (
                  <div key={step.value} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-gold)] text-white font-semibold">{idx + 1}</div>
                    <div>
                      <p className="text-sm font-medium text-[var(--brand-midnight)]">{step.label}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{idx === 0 ? 'Nous accusons réception de votre dossier' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-[var(--border)] pt-4">
                <p className="text-xs text-[var(--text-secondary)]">Besoin d’aide ?</p>
                <p className="mt-2 text-sm">Contactez <strong>support@mideessi.com</strong> ou appelez le +229 00 00 00 00</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SubmitDossierNew;
