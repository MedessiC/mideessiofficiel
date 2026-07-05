import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Send, FileText, Video, Sparkles, ShieldCheck, Clock3, BadgeCheck,
  ChevronRight, ChevronLeft, User, Building2, Phone, Mail,
  Globe, Code, MessageCircle, Upload, X, CheckCircle2, AlertCircle,
  Target, Banknote, CalendarClock, Layers, ArrowRight
} from 'lucide-react';
import SEO from '../components/SEO';
import { useClientAuth } from '../contexts/ClientContext';
import { supabase } from '../lib/supabase';

interface Props {}

/* ── Data ───────────────────────────────────── */
const statusSteps = [
  { label: 'Soumis',    value: 'submitted',  desc: 'Nous accusons réception de votre dossier',  icon: Send },
  { label: 'En étude', value: 'in_review',   desc: 'Votre demande est analysée par notre équipe', icon: Sparkles },
  { label: 'Devis',    value: 'quote_ready', desc: 'Un devis personnalisé vous est préparé',      icon: FileText },
  { label: 'Confirmé', value: 'confirmed',   desc: 'Dossier validé, on démarre !',               icon: CheckCircle2 },
];

const focusOptions = [
  { value: 'branding',  label: 'Identité & branding',        icon: '🎨' },
  { value: 'presence',  label: 'Présence digitale',           icon: '🌐' },
  { value: 'product',   label: 'Produit / application',       icon: '📱' },
  { value: 'content',   label: 'Contenus & communication',    icon: '✍️' },
  { value: 'strategy',  label: 'Stratégie & croissance',      icon: '📈' },
  { value: 'ecommerce', label: 'E-commerce / vente en ligne', icon: '🛒' },
];

const budgetOptions = [
  { value: '< 500 000 FCFA',           label: 'Moins de 500 000 FCFA' },
  { value: '500 000 - 1 000 000 FCFA', label: '500 000 – 1 000 000 FCFA' },
  { value: '1 000 000 - 3 000 000 FCFA',label: '1 000 000 – 3 000 000 FCFA' },
  { value: '3 000 000 - 7 000 000 FCFA',label: '3 000 000 – 7 000 000 FCFA' },
  { value: '> 7 000 000 FCFA',          label: 'Plus de 7 000 000 FCFA' },
];

const timelineOptions = [
  { value: 'Cette semaine', label: 'Cette semaine 🔥' },
  { value: 'Ce mois-ci',    label: 'Ce mois-ci' },
  { value: '2 à 3 mois',    label: 'Dans 2 à 3 mois' },
  { value: 'À définir',     label: 'Pas encore défini' },
];

/* ── Stepper steps definition ─────────────── */
const FORM_STEPS = [
  { id: 'identity', label: 'Identité',  icon: User },
  { id: 'project',  label: 'Projet',    icon: Target },
  { id: 'details',  label: 'Détails',   icon: Layers },
  { id: 'send',     label: 'Envoi',     icon: Send },
];

/* ── Component ──────────────────────────── */
const SubmitDossier: React.FC<Props> = () => {
  const { user } = useClientAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const params   = new URLSearchParams(location.search);
  const initialSlug = params.get('offerSlug') || '';
  const initialName = params.get('offerName') || '';
  const initialType = (params.get('offerType') as 'presence' | 'tech') || 'presence';

  /* ── Form state ── */
  const [currentStep, setCurrentStep] = useState(0);
  const [email,        setEmail]        = useState('');
  const [nom,          setNom]          = useState('');
  const [entreprise,   setEntreprise]   = useState('');
  const [telephone,    setTelephone]    = useState('');
  const [message,      setMessage]      = useState('');
  const [projectGoal,  setProjectGoal]  = useState('');
  const [budget,       setBudget]       = useState('');
  const [timeline,     setTimeline]     = useState('');
  const [focusAreas,   setFocusAreas]   = useState<string[]>([]);
  const [attachment,   setAttachment]   = useState<File | null>(null);
  const [dragOver,     setDragOver]     = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setNom(user.nom_marque || '');
    }
  }, [user]);

  /* ── Computed ── */
  const attachmentPreview = useMemo(() => {
    if (!attachment) return null;
    if (attachment.type.startsWith('video/')) return { text: attachment.name, type: 'video' };
    if (attachment.type.startsWith('image/')) return { text: attachment.name, type: 'image' };
    return { text: attachment.name, type: 'doc' };
  }, [attachment]);

  const progress = useMemo(() => {
    const filled = [nom, email, message].filter(Boolean).length;
    return Math.round((filled / 3) * 100);
  }, [nom, email, message]);

  const isStepValid = useMemo(() => {
    if (currentStep === 0) return nom.trim() !== '' && email.trim() !== '';
    if (currentStep === 1) return message.trim() !== '';
    return true;
  }, [currentStep, nom, email, message]);

  const toggleFocusArea = (value: string) =>
    setFocusAreas(c => c.includes(value) ? c.filter(i => i !== value) : [...c, value]);

  const buildCompleteMessage = () => {
    const parts = [message.trim()];
    if (projectGoal)     parts.push(`Besoin principal : ${projectGoal}`);
    if (focusAreas.length) parts.push(`Axes prioritaires : ${focusAreas.map(v => focusOptions.find(o => o.value === v)?.label || v).join(', ')}`);
    if (budget)          parts.push(`Budget : ${budget}`);
    if (timeline)        parts.push(`Échéancier : ${timeline}`);
    return parts.filter(Boolean).join('\n\n');
  };

  const uploadAttachment = async (file: File) => {
    const { uploadFileToCloudinary } = await import('../lib/cloudinary');
    // Déterminer le type de ressource pour Cloudinary (les documents non images/vidéos utilisent raw)
    const isImageOrVideo = file.type.startsWith('image/') || file.type.startsWith('video/');
    const resourceType = isImageOrVideo ? 'auto' : 'raw';
    
    // Upload vers le dossier mideessi/briefs
    const url = await uploadFileToCloudinary(file, 'mideessi/briefs', resourceType);
    return url;
  };

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !nom.trim() || !message.trim()) {
      setError('Veuillez compléter les champs obligatoires.');
      return;
    }
    if (attachment && attachment.size > 20 * 1024 * 1024) {
      setError('Le fichier dépasse 20 Mo.');
      return;
    }
    setLoading(true);
    try {
      const attachmentUrl  = attachment ? await uploadAttachment(attachment) : null;
      const attachmentMime = attachment?.type || null;

      const { error: insertError } = await supabase.from('quote_requests').insert([{
        client_id:       user?.client_id || null,
        email:           email.trim(),
        nom:             nom.trim(),
        entreprise:      entreprise.trim() || null,
        telephone:       telephone.trim() || null,
        offre_type:      initialType,
        offre_slug:      initialSlug,
        offre_nom:       initialName,
        message:         buildCompleteMessage(),
        attachment_url:  attachmentUrl,
        attachment_type: attachmentMime,
        status:          'submitted',
        progress:        10,
      }]);

      if (insertError) {
        setError('Impossible d\'envoyer le dossier. Réessayez plus tard.');
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/clients/dossiers'), 3000);
      }
    } catch {
      setError('Erreur lors de l\'envoi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setAttachment(file);
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="min-h-screen pt-16 bg-[var(--bg-page)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--brand-midnight)] mb-3">Dossier envoyé ! 🎉</h1>
          <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
            Votre dossier a bien été transmis. Nous l'analysons et vous recontactons rapidement avec une première réponse.
          </p>
          <div className="bg-white rounded-2xl border border-[var(--border)] p-4 mb-6 text-left space-y-3">
            {statusSteps.slice(0, 2).map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${i === 0 ? 'text-emerald-700' : 'text-gray-400'}`}>{step.label}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{step.desc}</p>
                </div>
                {i === 0 && <CheckCircle2 className="ml-auto w-4 h-4 text-emerald-500" />}
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--text-secondary)]">Redirection automatique dans quelques secondes…</p>
        </div>
      </div>
    );
  }

  /* ── Layout principal ── */
  return (
    <div className="min-h-screen pt-16 bg-[var(--bg-page)] text-[var(--text-primary)]">
      <SEO title="Soumettre un dossier | MIDEESSI" description="Soumettez votre dossier pour obtenir une analyse et un devis personnalisé." />

      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-midnight to-blue-900 text-white py-8 md:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" /> Retour aux offres
          </button>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-gold/20 border border-gold/30 text-gold px-3 py-1 rounded-full text-xs font-bold mb-3">
                <FileText className="w-3.5 h-3.5" /> Formulaire client
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Soumettre un dossier</h1>
              <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                Décrivez votre projet en quelques étapes. Un dossier clair = une réponse plus rapide et plus précise.
              </p>
            </div>
            {/* Offer badge */}
            {initialName && (
              <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  {initialType === 'tech'
                    ? <Code className="w-4 h-4 text-blue-300" />
                    : <Globe className="w-4 h-4 text-gold" />
                  }
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {initialType === 'tech' ? 'Service Tech' : 'Présence Digitale'}
                  </span>
                </div>
                <p className="text-sm font-bold text-white">{initialName}</p>
                {initialSlug && <p className="text-[10px] text-gray-400 mt-0.5">Réf. {initialSlug}</p>}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Complétion du dossier</span>
              <span className="font-bold text-gold">{progress}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Stepper ── */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto">
          <div className="flex items-center gap-0 min-w-max">
            {FORM_STEPS.map((step, i) => {
              const done    = i < currentStep;
              const active  = i === currentStep;
              const Icon    = step.icon;
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => i < currentStep && setCurrentStep(i)}
                    disabled={i > currentStep}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                      done   ? 'bg-emerald-500 text-white'
                      : active ? 'bg-gradient-to-br from-gold to-yellow-400 text-midnight shadow-[0_0_16px_rgba(255,215,0,0.35)]'
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                    }`}>
                      {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-[10px] font-semibold whitespace-nowrap ${
                      active ? 'text-[var(--brand-midnight)]' : done ? 'text-emerald-600' : 'text-gray-400'
                    }`}>{step.label}</span>
                  </button>
                  {i < FORM_STEPS.length - 1 && (
                    <div className={`w-12 sm:w-16 h-0.5 mx-1 rounded-full transition-all duration-500 ${i < currentStep ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── MAIN FORM ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[28px] border border-[var(--border)] shadow-soft overflow-hidden">
              {/* Step header */}
              <div className="bg-gradient-to-r from-[var(--bg-surface)] to-white border-b border-[var(--border)] px-6 py-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--brand-gold)]/80 mb-1">
                  Étape {currentStep + 1} / {FORM_STEPS.length}
                </p>
                <h2 className="text-lg font-bold text-[var(--brand-midnight)]">
                  {currentStep === 0 && 'Vos coordonnées'}
                  {currentStep === 1 && 'Décrivez votre projet'}
                  {currentStep === 2 && 'Informations complémentaires'}
                  {currentStep === 3 && 'Vérification & envoi'}
                </h2>
              </div>

              <div className="p-6">

                {/* ── STEP 0 : Identité ── */}
                {currentStep === 0 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block space-y-2">
                        <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[var(--brand-gold)]" /> Nom complet *
                        </span>
                        <input
                          value={nom}
                          onChange={e => setNom(e.target.value)}
                          placeholder="Jean Dupont"
                          className="w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/15 transition-all"
                        />
                      </label>
                      <label className="block space-y-2">
                        <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[var(--brand-gold)]" /> Email *
                        </span>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="bonjour@exemple.com"
                          className="w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/15 transition-all"
                        />
                      </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block space-y-2">
                        <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[var(--brand-gold)]" /> Entreprise
                        </span>
                        <input
                          value={entreprise}
                          onChange={e => setEntreprise(e.target.value)}
                          placeholder="Nom de l'entreprise"
                          className="w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/15 transition-all"
                        />
                      </label>
                      <label className="block space-y-2">
                        <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[var(--brand-gold)]" /> Téléphone
                        </span>
                        <input
                          value={telephone}
                          onChange={e => setTelephone(e.target.value)}
                          placeholder="+229 01 23 45 67"
                          className="w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/15 transition-all"
                        />
                      </label>
                    </div>
                    {/* Trust */}
                    <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <p className="text-xs text-emerald-700">Vos données sont confidentielles et utilisées uniquement pour traiter votre dossier.</p>
                    </div>
                  </div>
                )}

                {/* ── STEP 1 : Projet ── */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-[var(--brand-gold)]" /> Besoin principal
                      </span>
                      <input
                        value={projectGoal}
                        onChange={e => setProjectGoal(e.target.value)}
                        placeholder="Ex. Créer une boutique en ligne pour vendre mes produits"
                        className="w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/15 transition-all"
                      />
                    </label>

                    {/* Focus Areas — chip selector */}
                    <div className="space-y-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[var(--brand-gold)]" /> Axes prioritaires
                        <span className="text-[10px] font-normal text-[var(--text-secondary)] ml-1">(Plusieurs choix possibles)</span>
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {focusOptions.map(option => {
                          const active = focusAreas.includes(option.value);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => toggleFocusArea(option.value)}
                              className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border-2 text-xs font-semibold text-left transition-all duration-200 ${
                                active
                                  ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 text-[var(--brand-midnight)]'
                                  : 'border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[var(--brand-gold)]/40 hover:bg-[var(--bg-surface)]'
                              }`}
                            >
                              <span>{option.icon}</span>
                              <span>{option.label}</span>
                              {active && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-gold)] ml-auto flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        Description complète de vos besoins *
                      </span>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={6}
                        placeholder="Décrivez votre projet : contexte, objectifs, public cible, contraintes techniques, délais souhaités, éléments existants (logo, site, etc.)…"
                        className="w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/15 transition-all resize-none leading-relaxed"
                      />
                      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                        <span>Soyez précis — plus c'est clair, plus notre réponse sera pertinente</span>
                        <span className={message.length > 50 ? 'text-emerald-600 font-semibold' : ''}>{message.length} car.</span>
                      </div>
                    </label>
                  </div>
                )}

                {/* ── STEP 2 : Détails ── */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Budget */}
                    <div className="space-y-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Banknote className="w-3.5 h-3.5 text-[var(--brand-gold)]" /> Budget estimé
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {budgetOptions.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setBudget(opt.value)}
                            className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold text-left transition-all ${
                              budget === opt.value
                                ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 text-[var(--brand-midnight)]'
                                : 'border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--brand-gold)]/40'
                            }`}
                          >
                            {budget === opt.value && <span className="text-[var(--brand-gold)] mr-1">✓</span>}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                        <CalendarClock className="w-3.5 h-3.5 text-[var(--brand-gold)]" /> Quand souhaitez-vous démarrer ?
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {timelineOptions.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setTimeline(opt.value)}
                            className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold text-left transition-all ${
                              timeline === opt.value
                                ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 text-[var(--brand-midnight)]'
                                : 'border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--brand-gold)]/40'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* File upload — drag & drop */}
                    <div className="space-y-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-[var(--brand-gold)]" /> Document annexe
                        <span className="text-[10px] font-normal text-[var(--text-secondary)]">(Optionnel — max 20 Mo)</span>
                      </span>
                      <label
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center gap-3 cursor-pointer rounded-2xl border-2 border-dashed px-6 py-8 transition-all ${
                          dragOver
                            ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/5 scale-[1.01]'
                            : attachment
                            ? 'border-emerald-400 bg-emerald-50'
                            : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--brand-gold)]/50 hover:bg-[var(--bg-page)]'
                        }`}
                      >
                        {attachment ? (
                          <div className="flex flex-col items-center gap-2 text-center">
                            {attachmentPreview?.type === 'video' ? <Video className="w-8 h-8 text-emerald-500" /> : <FileText className="w-8 h-8 text-emerald-500" />}
                            <p className="text-sm font-semibold text-emerald-700">{attachmentPreview?.text}</p>
                            <button
                              type="button"
                              onClick={e => { e.preventDefault(); setAttachment(null); }}
                              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                            >
                              <X className="w-3.5 h-3.5" /> Supprimer
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-[var(--brand-gold)]/10 rounded-2xl flex items-center justify-center">
                              <Upload className="w-6 h-6 text-[var(--brand-gold)]" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-semibold text-[var(--text-primary)]">Glissez un fichier ici</p>
                              <p className="text-xs text-[var(--text-secondary)] mt-0.5">ou cliquez pour parcourir</p>
                              <p className="text-[10px] text-[var(--text-secondary)] mt-1">PDF, image, vidéo, Word…</p>
                            </div>
                          </>
                        )}
                        <input type="file" accept="application/pdf,image/*,video/*,.doc,.docx,.txt" className="hidden" onChange={e => setAttachment(e.target.files?.[0] || null)} />
                      </label>
                    </div>
                  </div>
                )}

                {/* ── STEP 3 : Récapitulatif ── */}
                {currentStep === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] p-5 space-y-4">
                      <h3 className="text-sm font-bold text-[var(--brand-midnight)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[var(--brand-gold)]" /> Récapitulatif de votre dossier
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                          { label: 'Nom', value: nom },
                          { label: 'Email', value: email },
                          { label: 'Entreprise', value: entreprise || '—' },
                          { label: 'Téléphone', value: telephone || '—' },
                          { label: 'Budget', value: budget || 'Non précisé' },
                          { label: 'Délai', value: timeline || 'À définir' },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">{label}</p>
                            <p className="font-semibold text-[var(--text-primary)] text-sm">{value}</p>
                          </div>
                        ))}
                      </div>
                      {focusAreas.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">Axes prioritaires</p>
                          <div className="flex flex-wrap gap-1.5">
                            {focusAreas.map(v => {
                              const opt = focusOptions.find(o => o.value === v);
                              return <span key={v} className="px-2.5 py-1 bg-[var(--brand-gold)]/10 text-[var(--brand-midnight)] text-xs font-semibold rounded-full">{opt?.icon} {opt?.label}</span>;
                            })}
                          </div>
                        </div>
                      )}
                      {message && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Description</p>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">{message}</p>
                        </div>
                      )}
                      {attachment && (
                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                          <FileText className="w-4 h-4" />
                          <span className="font-semibold">{attachment.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Reassurance */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { icon: Clock3, title: 'Réponse rapide', desc: 'Première réponse sous 24–48h' },
                        { icon: ShieldCheck, title: 'Confidentiel', desc: 'Vos données restent privées' },
                        { icon: BadgeCheck, title: 'Suivi clair', desc: 'Suivi sur votre espace client' },
                      ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex items-start gap-2.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] p-3.5">
                          <Icon className="w-4 h-4 text-[var(--brand-gold)] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-[var(--brand-midnight)]">{title}</p>
                            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Navigation buttons ── */}
                <div className="mt-8 flex items-center justify-between pt-5 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => currentStep > 0 ? setCurrentStep(s => s - 1) : navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--brand-gold)] hover:text-[var(--brand-midnight)] transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {currentStep === 0 ? 'Retour' : 'Précédent'}
                  </button>

                  {currentStep < FORM_STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(s => s + 1)}
                      disabled={!isStepValid}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--brand-midnight)] to-blue-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continuer <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-yellow-400 text-midnight font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-60"
                    >
                      {loading ? (
                        <><span className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" /> Envoi en cours…</>
                      ) : (
                        <><Send className="w-4 h-4" /> Envoyer le dossier</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── ASIDE ── */}
          <aside className="lg:col-span-1">
            <div className="rounded-[24px] border border-[var(--border)] bg-white shadow-soft overflow-hidden lg:sticky lg:top-28">
              {/* Offer info */}
              {initialName && (
                <div className="bg-gradient-to-br from-midnight to-blue-900 p-5 text-white">
                  <p className="text-[10px] uppercase tracking-widest text-gold/80 mb-1">Offre sélectionnée</p>
                  <p className="font-bold text-base">{initialName}</p>
                  <span className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    initialType === 'tech' ? 'bg-blue-500/20 text-blue-200' : 'bg-gold/20 text-gold'
                  }`}>
                    {initialType === 'tech' ? <Code className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    {initialType === 'tech' ? 'Développement Tech' : 'Présence Digitale'}
                  </span>
                </div>
              )}

              {/* Process tracker */}
              <div className="p-5">
                <p className="text-[10px] uppercase tracking-widest text-[var(--brand-gold)]/80 mb-3">Ce qui se passe ensuite</p>
                <div className="space-y-3">
                  {statusSteps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.value} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black ${
                          idx === 0 ? 'bg-[var(--brand-gold)] text-midnight' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border)]'
                        }`}>
                          {idx === 0 ? <Icon className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className="pt-1">
                          <p className="text-sm font-semibold text-[var(--brand-midnight)]">{step.label}</p>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-5 pb-5 border-t border-[var(--border)] pt-4">
                <p className="text-xs text-[var(--text-secondary)] mb-3">Besoin d'aide ?</p>
                <a
                  href={`https://wa.me/2290164409691?text=${encodeURIComponent('Bonjour, j\'ai une question sur la soumission de dossier.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-gold to-yellow-400 text-midnight font-bold py-2.5 rounded-xl text-sm transition-all hover:shadow-md active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SubmitDossier;
