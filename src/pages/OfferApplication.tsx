import { ArrowLeft, ArrowRight, Briefcase, CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, type FormEvent } from 'react';
import SEO from '../components/SEO';
import { createRecruitmentApplication, syncRecruitmentOffers, type RecruitmentOffer } from '../lib/contentManagement';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  cvUrl: '',
  portfolioUrl: '',
  coverLetter: '',
};

const OfferApplication = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<RecruitmentOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [applicationForm, setApplicationForm] = useState(initialForm);

  useEffect(() => {
    const loadOffer = async () => {
      const offers = await syncRecruitmentOffers();
      const selectedOffer = offers.find((item) => item.slug === offerId || item.id === offerId) || null;
      setOffer(selectedOffer);
      setIsLoading(false);
    };

    void loadOffer();
  }, [offerId]);

  const handleApplicationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!offer) return;

    setIsSubmitting(true);
    await createRecruitmentApplication({
      offerId: offer.id,
      fullName: applicationForm.fullName,
      email: applicationForm.email,
      phone: applicationForm.phone,
      cvUrl: applicationForm.cvUrl,
      portfolioUrl: applicationForm.portfolioUrl,
      coverLetter: applicationForm.coverLetter,
    });

    setFeedback(`Votre candidature pour “${offer.title}” a bien été envoyée.`);
    setApplicationForm(initialForm);
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white px-4 py-24 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Chargement de l’offre...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-white px-4 py-24 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-200 bg-red-50 p-10 text-center shadow-sm dark:border-red-800 dark:bg-red-950/40">
          <p className="text-lg font-semibold text-red-700 dark:text-red-300">Cette offre n’est plus disponible.</p>
          <Link to="/careers" className="mt-6 inline-flex items-center gap-2 rounded-full bg-midnight px-4 py-2 text-sm font-semibold text-white">
            <ArrowLeft className="h-4 w-4" /> Retour aux offres
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-20 dark:bg-gray-900">
      <SEO
        title={`Postuler à ${offer.title} | MIDEESSI`}
        description={`Postulez à l’offre ${offer.title} chez MIDEESSI.`}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:max-w-md">
          <Link to="/careers" className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
            <ArrowLeft className="h-4 w-4" /> Retour aux offres
          </Link>

          <div className="mt-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            <Briefcase className="h-4 w-4" />
            {offer.type}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-midnight dark:text-white">{offer.title}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{offer.role}</p>

          {offer.imageUrl && (
            <img src={offer.imageUrl} alt={offer.title} className="mt-5 h-40 w-full rounded-2xl object-cover" />
          )}

          <div className="mt-5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="h-4 w-4" />
            {offer.location}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{offer.description}</p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Exigences</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {offer.requirements.map((requirement) => (
                <li key={requirement} className="flex gap-2">
                  <span className="text-gold">•</span>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            <Send className="h-4 w-4" />
            Candidature
          </div>
          <h2 className="mt-3 text-2xl font-bold text-midnight dark:text-white">Formulaire de candidature</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Remplissez ce formulaire pour postuler à cette offre.</p>

          {feedback && (
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              {feedback}
            </div>
          )}

          <form onSubmit={handleApplicationSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Nom complet</label>
              <input required value={applicationForm.fullName} onChange={(e) => setApplicationForm({ ...applicationForm, fullName: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Votre nom" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Mail className="h-4 w-4" /> Email
              </label>
              <input required type="email" value={applicationForm.email} onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Phone className="h-4 w-4" /> Téléphone
              </label>
              <input value={applicationForm.phone} onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="+229 ..." />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Lien CV</label>
              <input value={applicationForm.cvUrl} onChange={(e) => setApplicationForm({ ...applicationForm, cvUrl: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="https://..." />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Portfolio / LinkedIn</label>
              <input value={applicationForm.portfolioUrl} onChange={(e) => setApplicationForm({ ...applicationForm, portfolioUrl: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Motivation</label>
              <textarea required rows={6} value={applicationForm.coverLetter} onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Expliquez pourquoi vous êtes intéressé(e) par ce poste." />
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center justify-end gap-3">
              <button type="button" onClick={() => navigate('/careers')} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                Annuler
              </button>
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-midnight px-4 py-2 text-sm font-semibold text-white">
                <Send className="h-4 w-4" /> {isSubmitting ? 'Envoi...' : 'Envoyer la candidature'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfferApplication;
