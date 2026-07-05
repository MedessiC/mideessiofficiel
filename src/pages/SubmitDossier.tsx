import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Send, FileText, Video, Sparkles, ShieldCheck, Clock3, BadgeCheck,
  ChevronLeft, User, Building2, Phone, Mail,
  Globe, Code, MessageCircle, Upload, X, CheckCircle2, AlertCircle,
  Target, Banknote, CalendarClock, Layers, ArrowRight
} from 'lucide-react';
import SEO from '../components/SEO';
import { useClientAuth } from '../contexts/ClientContext';
import { supabase } from '../lib/supabase';

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

const FORM_STEPS = [
  { id: 'identity', label: 'Identité',  icon: User },
  { id: 'project',  label: 'Projet',    icon: Target },
  { id: 'details',  label: 'Détails',   icon: Layers },
  { id: 'send',     label: 'Envoi',     icon: Send },
];

const SubmitDossier: React.FC = () => {
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
    const isImageOrVideo = file.type.startsWith('image/') || file.type.startsWith('video/');
    const resourceType = isImageOrVideo ? 'auto' : 'raw';
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

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-xl font-black text-[var(--text-primary)]">Dossier envoyé ! 🎉</h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Votre dossier a bien été transmis. Nous l'analysons et vous recontactons sous 24-48h.
          </p>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 text-left space-y-3">
            {statusSteps.slice(0, 2).map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-xs font-bold ${i === 0 ? 'text-emerald-400' : 'text-[var(--text-secondary)]'}`}>{step.label}</p>
                  <p className="text-[10px] text-[var(--text-hint)]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[var(--text-hint)]">Redirection automatique dans quelques secondes…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] pb-20">
      <SEO title="Soumettre un dossier | MIDEESSI" description="Soumettez votre dossier pour obtenir une analyse et un devis personnalisé." />

      {/* Header */}
      <header className="bg-[var(--bg-card)]/80 border-b border-[var(--border)] py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-3">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <span className="inline-flex items-center gap-1 bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/20 text-[var(--brand-gold)] px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-2">
              Brief Client
            </span>
            <h1 className="text-xl font-black text-white">Soumettre un dossier</h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm">
              Décrivez votre projet pour obtenir une étude gratuite et un devis personnalisé de nos experts.
            </p>
          </div>
          {initialName && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl px-4 py-3 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                {initialType === 'tech' ? <Code className="w-3.5 h-3.5 text-blue-400" /> : <Globe className="w-3.5 h-3.5 text-[var(--brand-gold)]" />}
                <span className="text-[9px] font-black uppercase text-[var(--text-secondary)]">Offre sélectionnée</span>
              </div>
              <p className="text-xs font-black text-[var(--text-primary)]">{initialName}</p>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Progress bar */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
            <span>Avancement du dossier</span>
            <span className="font-bold text-[var(--brand-gold)]">{progress}%</span>
          </div>
          <div className="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Stepper icons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {FORM_STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => i < currentStep && setCurrentStep(i)}
                  disabled={i > currentStep}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-[var(--bg-surface)] border border-[var(--border)]"
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${done ? 'bg-emerald-500 text-white' : active ? 'bg-[var(--brand-gold)] text-[var(--brand-midnight)]' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)]'}`}>
                    {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3 h-3" />}
                  </div>
                  <span className={active ? 'text-[var(--brand-gold)]' : done ? 'text-emerald-400' : 'text-[var(--text-secondary)]'}>{step.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Form container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-[var(--bg-surface)] border-b border-[var(--border)] px-5 py-4">
              <span className="text-[9px] uppercase tracking-wider text-[var(--brand-gold)] font-bold">Étape {currentStep + 1} / {FORM_STEPS.length}</span>
              <h2 className="text-sm font-black text-[var(--text-primary)] mt-0.5">
                {currentStep === 0 && 'Coordonnées de contact'}
                {currentStep === 1 && 'Description de votre projet'}
                {currentStep === 2 && 'Détails & documents'}
                {currentStep === 3 && 'Validation du brief'}
              </h2>
            </div>

            <div className="p-5">
              {error && (
                <div className="mb-4 p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 0: Identity */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Nom complet *">
                      <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Jean Dupont" className={INPUT_CLS} required />
                    </FormField>
                    <FormField label="Adresse Email *">
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jean@example.com" className={INPUT_CLS} required />
                    </FormField>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Nom de la marque / Entreprise">
                      <input value={entreprise} onChange={e => setEntreprise(e.target.value)} placeholder="Ex. MIDEESSI" className={INPUT_CLS} />
                    </FormField>
                    <FormField label="Téléphone">
                      <input value={telephone} onChange={e => setTelephone(e.target.value)} placeholder="+229 01 23 45 67" className={INPUT_CLS} />
                    </FormField>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-400">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span>Vos données de brief sont sécurisées et restent confidentielles.</span>
                  </div>
                </div>
              )}

              {/* STEP 1: Project */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <FormField label="Votre objectif principal / besoin">
                    <input value={projectGoal} onChange={e => setProjectGoal(e.target.value)} placeholder="Ex. Vendre en ligne mes produits" className={INPUT_CLS} />
                  </FormField>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Axes d'étude prioritaires</label>
                    <div className="grid grid-cols-2 gap-2">
                      {focusOptions.map(o => {
                        const active = focusAreas.includes(o.value);
                        return (
                          <button key={o.value} type="button" onClick={() => toggleFocusArea(o.value)}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                              active ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 text-[var(--text-primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border)]'
                            }`}>
                            <span>{o.icon}</span>
                            <span>{o.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <FormField label="Description complète de votre besoin *">
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={6}
                      placeholder="Décrivez précisément votre projet, objectifs, cibles, contraintes de marque..."
                      className={`${INPUT_CLS} resize-none`} required />
                  </FormField>
                </div>
              )}

              {/* STEP 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Budget estimé</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {budgetOptions.map(opt => (
                        <button key={opt.value} type="button" onClick={() => setBudget(opt.value)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                            budget === opt.value ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 text-[var(--text-primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border)]'
                          }`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Échéance souhaitée</label>
                    <div className="grid grid-cols-2 gap-2">
                      {timelineOptions.map(opt => (
                        <button key={opt.value} type="button" onClick={() => setTimeline(opt.value)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                            timeline === opt.value ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 text-[var(--text-primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border)]'
                          }`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Drag & drop file */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Ajouter un document annexe (cahier des charges, logo, mockups...)</label>
                    <label onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        dragOver ? 'border-[var(--brand-gold)] bg-[var(--bg-surface)]' : attachment ? 'border-emerald-500 bg-emerald-500/5' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border)]'
                      }`}>
                      <input type="file" className="hidden" onChange={e => setAttachment(e.target.files?.[0] || null)} />
                      {attachment ? (
                        <div className="text-center space-y-2">
                          <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
                          <p className="text-xs text-emerald-400 font-bold">{attachment.name}</p>
                          <button type="button" onClick={e => { e.preventDefault(); setAttachment(null); }} className="text-[10px] text-red-400 hover:underline">
                            Retirer le fichier
                          </button>
                        </div>
                      ) : (
                        <div className="text-center space-y-2 text-[var(--text-secondary)]">
                          <Upload className="w-6 h-6 mx-auto opacity-60" />
                          <p className="text-xs">Glissez-déposez un fichier ici</p>
                          <p className="text-[10px] opacity-60">PDF, ZIP, Images, Vidéos (Max 20 Mo)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 3: Summary */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3 border-b border-[var(--border)] pb-3">
                      {[
                        { label: 'Nom complet', value: nom },
                        { label: 'Adresse Email', value: email },
                        { label: 'Entreprise', value: entreprise || '—' },
                        { label: 'Téléphone', value: telephone || '—' },
                        { label: 'Budget estimé', value: budget || 'Non défini' },
                        { label: 'Délai', value: timeline || 'Non défini' },
                      ].map(item => (
                        <div key={item.label}>
                          <p className="text-[9px] text-[var(--text-hint)] uppercase">{item.label}</p>
                          <p className="font-bold text-[var(--text-primary)] mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    {message && (
                      <div>
                        <p className="text-[9px] text-[var(--text-hint)] uppercase">Description du brief</p>
                        <p className="text-[var(--text-secondary)] mt-1 leading-relaxed line-clamp-3">{message}</p>
                      </div>
                    )}
                    {attachment && (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Fichier joint : {attachment.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Form actions navigation */}
            <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--bg-surface)] flex items-center justify-between">
              <button type="button" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
                className="px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed">
                Précédent
              </button>
              {currentStep < FORM_STEPS.length - 1 ? (
                <button type="button" onClick={() => isStepValid && setCurrentStep(currentStep + 1)} disabled={!isStepValid}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-[var(--brand-gold)] text-[var(--brand-midnight)] rounded-xl text-xs font-black hover:opacity-90 disabled:opacity-40">
                  Suivant
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={loading}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[var(--brand-gold)] text-[var(--brand-midnight)] rounded-xl text-xs font-black hover:opacity-90 shadow-md">
                  {loading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Envoyer mon dossier
                </button>
              )}
            </div>
          </div>

          {/* Right sidebar info */}
          <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest border-b border-[var(--border)] pb-2">💡 Conseils de brief</h3>
            <div className="space-y-3.5 text-xs text-[var(--text-secondary)] leading-relaxed">
              {[
                { title: 'Soyez précis', desc: 'Décrivez précisément vos objectifs de marque et techniques.' },
                { title: 'Partagez vos assets', desc: 'Ajoutez vos logos existants ou cahiers des charges si vous en possédez.' },
                { title: 'Définissez votre budget', desc: 'Un budget réaliste nous aide à dimensionner la solution technique.' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="font-bold text-[var(--text-primary)]">{item.title}</p>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

const INPUT_CLS = "w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-hint)] focus:outline-none focus:border-[var(--brand-gold)]/50 transition-colors";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
      {children}
    </div>
  );
}

// Inline Loader helper
function Loader(props: any) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default SubmitDossier;
