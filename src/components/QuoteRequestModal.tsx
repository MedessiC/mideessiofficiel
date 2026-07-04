import { useEffect, useMemo, useState } from 'react';
import { X, UploadCloud, Paperclip, Send, FileText, Video } from 'lucide-react';
import { useClientAuth } from '../contexts/ClientContext';
import { supabase } from '../lib/supabase';

interface QuoteRequestModalProps {
  open: boolean;
  onClose: () => void;
  offerSlug: string;
  offerName: string;
  offerType: 'presence' | 'tech';
  onSubmitted?: () => void;
}

const statusSteps = [
  { label: 'Soumis', value: 'submitted' },
  { label: 'En étude', value: 'in_review' },
  { label: 'Devis prêt', value: 'quote_ready' },
  { label: 'Confirmé', value: 'confirmed' },
];

const QuoteRequestModal = ({ open, onClose, offerSlug, offerName, offerType, onSubmitted }: QuoteRequestModalProps) => {
  const { user } = useClientAuth();
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
    if (open) {
      setError('');
      setSuccess('');
      if (user) {
        setEmail(user.email || '');
        setNom(user.nom_marque || '');
      }
    }
  }, [open, user]);

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

    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath);

    if (publicUrlError || !publicUrlData) {
      throw publicUrlError || new Error('Erreur génération du lien public');
    }

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        offre_type: offerType,
        offre_slug: offerSlug,
        offre_nom: offerName,
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
        if (onSubmitted) {
          onSubmitted();
        }
      }
    } catch (err) {
      console.error('Quote submit error', err);
      setError('Erreur lors de l’envoi du dossier.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-w-3xl w-full rounded-3xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-midnight dark:text-white">Soumettre un dossier pour {offerName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ajoutez votre brief, documents ou vidéo pour une première étude.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:text-gold transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Votre nom</span>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Ex. Jean Dupont"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="bonjour@exemple.com"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Entreprise (facultatif)</span>
              <input
                value={entreprise}
                onChange={(e) => setEntreprise(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Nom de l'entreprise"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Téléphone (facultatif)</span>
              <input
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="+229 00 00 00 00"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Votre demande</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Décrivez vos besoins, objectifs et tout élément utile à l’étude du devis."
            />
          </label>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
              <div className="flex items-center gap-3">
                <Paperclip className="h-5 w-5 text-gold" />
                <div>
                  <p className="font-semibold">Pièce jointe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF, image, vidéo ou document</p>
                </div>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-midnight transition hover:bg-yellow-300">
                <UploadCloud className="h-4 w-4" />
                Choisir
                <input
                  type="file"
                  accept="application/pdf,image/*,video/*,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setAttachment(file);
                    setAttachmentType(file?.type || '');
                  }}
                />
              </label>
            </div>
            {attachmentPreview && <p className="text-xs text-gray-600 dark:text-gray-400">{attachmentPreview}</p>}
          </div>

          <div className="rounded-3xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
            <p className="font-semibold text-midnight dark:text-white mb-2">Processus</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {statusSteps.map((step, idx) => (
                <div key={step.value} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-white font-semibold">
                    {idx + 1}
                  </div>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-3xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-midnight px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {loading ? 'Envoi...' : 'Envoyer le dossier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteRequestModal;
