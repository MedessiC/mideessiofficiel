import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { useProjects } from '../contexts/ProjectContext';
import { useClientAuth } from '../contexts/ClientContext';
import { ActivityType, ProjectGoal, FulfillmentMode, AVAILABLE_FEATURES } from '../types/project';
import { DatePickerModal, TimePickerModal } from '../components/project/DateTimePickers';
import { persistRedirectTarget } from '../utils/authRedirect';

const OFFERS = [
  { slug: 'vitrine', name: 'Site Vitrine', basePrice: 75000, days: '3-5 jours', desc: 'Présentation claire et crédible de votre activité (5 à 7 pages).' },
  { slug: 'e-commerce', name: 'Site E-Commerce', basePrice: 150000, days: '7-10 jours', desc: 'Boutique en ligne avec intégration Mobile Money & gestion du catalogue.' },
  { slug: 'application-web', name: 'Application Web', basePrice: 250000, days: '14-21 jours', desc: 'Plateforme sur mesure avec tableaux de bord et automatisations métier.' },
];

const ACTIVITIES: ActivityType[] = [
  'Restaurant',
  'Commerce',
  'Association',
  'Cabinet',
  'Profession libérale',
  'Autre',
];

const GOALS: ProjectGoal[] = [
  'Présenter mon activité',
  'Obtenir des contacts',
  'Présenter mes services',
  'Prendre des rendez-vous',
  'Vendre mes produits en ligne',
  'Autre',
];

const COMMANDER_DRAFT_KEY = 'mideessi.commander.draft';
const DEFAULT_FEATURES = ['presentation', 'services', 'contact_form', 'whatsapp_button'];

type CommanderDraft = {
  selectedOfferSlug?: string;
  fulfillmentMode?: FulfillmentMode;
  meetingDate?: string;
  meetingTime?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  activity?: ActivityType;
  goal?: ProjectGoal;
  briefDescription?: string;
  selectedFeatures?: string[];
  paymentType?: 'full' | 'installment';
};

const getCommanderDraft = (): CommanderDraft => {
  if (typeof window === 'undefined') return {};
  try {
    const value = window.localStorage.getItem(COMMANDER_DRAFT_KEY);
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
};

const clearCommanderDraft = () => {
  if (typeof window !== 'undefined') window.localStorage.removeItem(COMMANDER_DRAFT_KEY);
};

export default function CommanderPage() {
  const navigate = useNavigate();
  const { offerSlug } = useParams<{ offerSlug?: string }>();
  const [searchParams] = useSearchParams();
  const initialDraft = useMemo(getCommanderDraft, []);
  const requestedOfferSlug = offerSlug || searchParams.get('offer');
  const normalizedOfferSlug = requestedOfferSlug && OFFERS.some((offer) => offer.slug === requestedOfferSlug)
    ? requestedOfferSlug
    : undefined;

  const { createProject } = useProjects();
  const { user, loading: authLoading } = useClientAuth();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isChangingStep, setIsChangingStep] = useState(false);

  // Fonction de changement d'étape avec animation
  const goToStep = (newStep: number) => {
    setIsChangingStep(true);
    setTimeout(() => {
      setStep(newStep);
      setIsChangingStep(false);
    }, 180);
  };

  React.useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const parsed = parseInt(stepParam, 10);
      if (parsed >= 1 && parsed <= 5) {
        setStep(parsed);
      }
    }
  }, [searchParams]);


  // Fulfillment Mode & Meeting State
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>(initialDraft.fulfillmentMode || 'distance');
  const [meetingDate, setMeetingDate] = useState<string>(initialDraft.meetingDate || '');
  const [meetingTime, setMeetingTime] = useState<string>(initialDraft.meetingTime || '');

  // Coordonnées nécessaires pour confirmer un rendez-vous ou lancer un projet.
  const [contactName, setContactName] = useState<string>(initialDraft.contactName || user?.nom_marque || '');
  const [contactEmail, setContactEmail] = useState<string>(initialDraft.contactEmail || user?.email || '');
  const [contactPhone, setContactPhone] = useState<string>(initialDraft.contactPhone || '');

  // Modals
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  // Form State
  const [selectedOfferSlug, setSelectedOfferSlug] = useState<string>(normalizedOfferSlug || initialDraft.selectedOfferSlug || 'vitrine');
  const [activity, setActivity] = useState<ActivityType>(initialDraft.activity || 'Restaurant');
  const [goal, setGoal] = useState<ProjectGoal>(initialDraft.goal || 'Obtenir des contacts');
  const [briefDescription, setBriefDescription] = useState(initialDraft.briefDescription || '');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialDraft.selectedFeatures || DEFAULT_FEATURES);
  const [paymentType, setPaymentType] = useState<'full' | 'installment'>(initialDraft.paymentType || 'installment');

  React.useEffect(() => {
    if (normalizedOfferSlug) setSelectedOfferSlug(normalizedOfferSlug);
  }, [normalizedOfferSlug]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(COMMANDER_DRAFT_KEY, JSON.stringify({
        selectedOfferSlug,
        fulfillmentMode,
        meetingDate,
        meetingTime,
        contactName,
        contactEmail,
        contactPhone,
        activity,
        goal,
        briefDescription,
        selectedFeatures,
        paymentType,
      } satisfies CommanderDraft));
    } catch {
      // Le parcours reste fonctionnel si le stockage local est indisponible.
    }
  }, [selectedOfferSlug, fulfillmentMode, meetingDate, meetingTime, contactName, contactEmail, contactPhone, activity, goal, briefDescription, selectedFeatures, paymentType]);

  React.useEffect(() => {
    if (!user) return;
    setContactName((value) => value || user.nom_marque);
    setContactEmail((value) => value || user.email);
  }, [user]);

  // Si l'utilisateur est connecté et se retrouve à l'étape 4 (connexion), sauter à l'étape 5
  React.useEffect(() => {
    if (!authLoading && user && fulfillmentMode === 'distance' && step === 4) {
      goToStep(5);
    }
  }, [authLoading, user, step, fulfillmentMode]);

  // Current Offer Object
  const currentOffer = useMemo(() => {
    return OFFERS.find((o) => o.slug === selectedOfferSlug) || OFFERS[0];
  }, [selectedOfferSlug]);

  React.useEffect(() => {
    const includedFeatureIds = AVAILABLE_FEATURES
      .filter((feature) => feature.includedInOffer?.includes(currentOffer.slug))
      .map((feature) => feature.id);

    setSelectedFeatures((current) => Array.from(new Set([...current, ...includedFeatureIds])));
  }, [currentOffer.slug]);

  // Price Calculation
  const totalPrice = useMemo(() => {
    let sum = currentOffer.basePrice;
    AVAILABLE_FEATURES.forEach((feat) => {
      if (selectedFeatures.includes(feat.id)) {
        if (!feat.includedInOffer?.includes(currentOffer.slug)) {
          sum += feat.price;
        }
      }
    });
    return sum;
  }, [currentOffer, selectedFeatures]);

  const installmentUpfront = Math.round(totalPrice * 0.4);
  const installmentRemaining = totalPrice - installmentUpfront;
  const monthlyAmount = Math.round(installmentRemaining / 2);

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const handleFinalValidation = async (chosenPaymentType?: 'full' | 'installment') => {
    if (isSubmitting) return;
    setSubmitError(null);

    if (fulfillmentMode === 'distance' && !user) {
      persistRedirectTarget(`/commander?offer=${encodeURIComponent(selectedOfferSlug)}&step=5`);
      navigate('/login');
      return;
    }

    if (fulfillmentMode === 'distance' && !contactPhone.trim()) {
      setSubmitError('Ajoutez un numéro WhatsApp afin que nous puissions vous contacter.');
      goToStep(2);
      return;
    }

    if (fulfillmentMode === 'rdv' && (!meetingDate || !meetingTime || !contactName.trim() || !contactEmail.trim() || !contactPhone.trim())) {
      setSubmitError('Veuillez renseigner la date, l’heure et vos coordonnées avant de valider.');
      goToStep(!meetingDate || !meetingTime ? 1 : 2);
      return;
    }

    setIsSubmitting(true);

    // Résoudre le type de paiement (passé en param ou état actuel)
    const resolvedPaymentType = chosenPaymentType ?? paymentType;

    try {
      const isAppointment = fulfillmentMode === 'rdv';
      const clientName = isAppointment ? contactName.trim() : user!.nom_marque;
      const clientPhone = contactPhone.trim();
      const clientEmail = isAppointment ? contactEmail.trim() : user!.email;
      const clientId = user?.client_id || `lead_${Date.now()}`;
      const userId = user?.id || `lead_user_${Date.now()}`;

      const upfront = resolvedPaymentType === 'installment' ? installmentUpfront : totalPrice;
      const installAmt = resolvedPaymentType === 'installment' ? monthlyAmount : 0;

      const newPrj = await createProject({
        user_id: userId,
        client_id: clientId,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        offer_slug: currentOffer.slug as any,
        offer_name: currentOffer.name,
        fulfillment_mode: fulfillmentMode,
        meeting_date: meetingDate,
        meeting_time: meetingTime,
        activity,
        goal,
        brief_description: fulfillmentMode === 'rdv'
          ? `Rendez-vous en personne le ${meetingDate} à ${meetingTime}. Contact : ${clientName} (${clientEmail}, ${clientPhone})`
          : (briefDescription || `Projet site web pour ${activity} à Cotonou.`),
        selected_features: selectedFeatures,
        price_total: totalPrice,
        payment_type: resolvedPaymentType,
        payment_schedule: {
          upfront,
          installment_amount: installAmt,
          installments_count: resolvedPaymentType === 'installment' ? 2 : 0,
          paid_installments: 0,
        },
        estimated_days: currentOffer.days,
      });

      clearCommanderDraft();
      navigate(`/clients/projets/${newPrj.id}`);
    } catch (err: any) {
      console.error('[CommanderPage] Erreur création projet:', err);
      setSubmitError(err?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] pb-28 pt-24 font-sans">
      <SEO title="Création de votre Site Web — MIDEESSI" description="Paramétrez votre projet web et choisissez votre mode d'accompagnement." />

      <div className="max-w-4xl mx-auto px-6 lg:px-12">

        {/* Editorial Header */}
        <div className="border-b border-[#E5E7EB] pb-8 mb-10 text-center sm:text-left">
          {/* Barre de progression */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-[#6B7280]">
                ÉTAPE {step} / {fulfillmentMode === 'rdv' ? '03' : '05'}
              </span>
              <span className="text-[11px] font-mono font-semibold text-[#191970]">
                {Math.round((step / (fulfillmentMode === 'rdv' ? 3 : 5)) * 100)}%
              </span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: fulfillmentMode === 'rdv' ? 3 : 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    i < step
                      ? 'bg-[#191970]'
                      : 'bg-[#E5E7EB]'
                  }`}
                />
              ))}
            </div>
          </div>
          <h1
            className="font-bold text-[#111111] tracking-[-0.04em] leading-[1.06]"
            style={{ fontSize: 'clamp(32px, 6vw, 52px)' }}
          >
            Conception &amp; <span className="text-[#191970]">Lancement Web</span>
          </h1>
        </div>

        {/* Main Section */}
        <div
          className={`bg-white rounded-[28px] border border-[#E5E7EB] shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-6 sm:p-10 transition-all duration-200 ${
            isChangingStep ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >

          {/* ════════ ÉTAPE 1 : Mode de réalisation ════════ */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-[-0.01em] leading-[1.2]">
                  Comment voulez-vous obtenir votre site web ?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                  Choisissez votre mode d’accompagnement. Vous pourrez confirmer les détails avant l’envoi de votre demande.
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">

                {/* Un Rendez-vous */}
                <button
                  type="button"
                  onClick={() => setFulfillmentMode('rdv')}
                  className={`p-4 sm:p-6 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    fulfillmentMode === 'rdv'
                      ? 'border-[#191970] bg-[#191970] text-white shadow-md'
                      : 'border-[#E5E7EB] bg-[#FAFAFA] text-[#111827] hover:border-[#191970]/40'
                  }`}
                >
                  <div>
                    <h3 className="text-base sm:text-lg font-black mb-1">Un Rendez-vous</h3>
                    <p className={`text-xs leading-relaxed ${fulfillmentMode === 'rdv' ? 'text-white/80' : 'text-[#6B7280]'}`}>
                      Choisissez un créneau et échangez avec nous en personne avant de lancer le projet.
                    </p>
                  </div>
                </button>

                {/* À distance */}
                <button
                  type="button"
                  onClick={() => {
                    setFulfillmentMode('distance');
                    goToStep(2);
                  }}
                  className={`p-4 sm:p-6 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    fulfillmentMode === 'distance'
                      ? 'border-[#191970] bg-[#191970] text-white shadow-md'
                      : 'border-[#E5E7EB] bg-[#FAFAFA] text-[#111827] hover:border-[#191970]/40'
                  }`}
                >
                  <div>
                    <h3 className="text-base sm:text-lg font-black mb-1">À distance</h3>
                    <p className={`text-xs leading-relaxed ${fulfillmentMode === 'distance' ? 'text-white/80' : 'text-[#6B7280]'}`}>
                      Envoyez votre besoin maintenant ; votre espace de suivi sera ensuite activé.
                    </p>
                  </div>
                </button>
              </div>

              {/* Si Rendez-vous sélectionné */}
              {fulfillmentMode === 'rdv' && (
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-6 sm:p-8 space-y-5 animate-fade-in">
                  <div>
                    
                    <h3 className="text-xl font-black text-[#111827]">
                      Quand souhaitez-vous nous rencontrer ?
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {/* Cadre Date */}
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(true)}
                      className="p-3.5 sm:p-5 rounded-2xl border border-[#E5E7EB] bg-white text-left hover:border-black transition-all"
                    >
                      <span className="text-xs sm:text-sm font-black text-[#111827] block truncate">
                        {meetingDate ? new Date(meetingDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' }) : 'DATE'}
                      </span>
                    </button>

                    {/* Cadre Heure */}
                    <button
                      type="button"
                      onClick={() => setIsTimePickerOpen(true)}
                      className="p-3.5 sm:p-5 rounded-2xl border border-[#E5E7EB] bg-white text-left hover:border-black transition-all"
                    >
                      <span className="text-xs sm:text-sm font-black text-[#111827] block truncate">
                        {meetingTime ? `${meetingTime}` : 'HEURE'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════ RDV ÉTAPE 2 : Nom & Numéro WhatsApp ════════ */}
          {fulfillmentMode === 'rdv' && step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold text-[#6B7280] block mb-2">
                  VOS COORDONNÉES
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-[-0.01em] leading-[1.2]">
                  Informations de contact pour le rendez-vous
                </h2>
                <p className="text-xs sm:text-sm text-[#4B5563] mt-1.5 leading-[1.6]">
                  Renseignez vos coordonnées afin que nous puissions préparer votre accueil.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#374151] mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Entrez votre nom et prénom"
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-xs font-bold text-[#111827] outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#374151] mb-1.5">
                    Numéro WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Entrez votre numéro WhatsApp (ex: +229 90 00 00 00)"
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-xs font-bold text-[#111827] outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#374151] mb-1.5">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="vous@entreprise.com"
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-xs font-bold text-[#111827] outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ════════ RDV ÉTAPE 3 : Validation & Confirmation RDV ════════ */}
          {fulfillmentMode === 'rdv' && step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold text-[#6B7280] block mb-2">
                  CONFIRMATION DU RENDEZ-VOUS
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-[-0.01em] leading-[1.2]">
                  Validation de votre demande
                </h2>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase">
                    DEMANDE DE RENDEZ-VOUS
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#111827] leading-relaxed">
                  Votre demande concerne le{' '}
                  <span className="font-black text-[#111827]">
                    {meetingDate ? new Date(meetingDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Date à confirmer'}
                  </span>{' '}
                  à{' '}
                  <span className="font-black text-[#111827]">{meetingTime || 'Heure à confirmer'}</span>.
                </p>

                <p className="text-xs text-[#4B5563] leading-relaxed border-t border-[#E5E7EB] pt-3">
                  Le créneau n’est définitif qu’après confirmation par un conseiller MIDEESSI.
                </p>
              </div>
            </div>
          )}

          {/* ════════ DISTANCE ÉTAPE 2 : Activité & Brief ════════ */}
          {fulfillmentMode === 'distance' && step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
                <div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-[-0.01em] leading-[1.2]">
                    Votre activité &amp; Vos attentes
                  </h2>
                </div>
                <div className="bg-[#F3F4F6] border border-[#E5E7EB] px-3.5 py-1.5 rounded-full flex items-center gap-2">
                  <span className="text-xs font-bold text-[#191970]">{currentOffer.name} ({currentOffer.basePrice.toLocaleString('fr-FR')} FCFA)</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-2">Secteur d'activité</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ACTIVITIES.map((act) => {
                    const isAct = activity === act;
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => setActivity(act)}
                        className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                          isAct
                            ? 'border-[#191970] bg-[#191970] text-white shadow-md'
                            : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#374151] hover:border-[#191970]/40'
                        }`}
                      >
                        {act}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#374151] mb-2">
                  Présentation succincte de votre besoin
                </label>
                <textarea
                  rows={4}
                  value={briefDescription}
                  onChange={(e) => setBriefDescription(e.target.value)}
                  placeholder="Décrivez votre activité, vos produits, horaires ou attentes particulières..."
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-xs text-[#111827] outline-none focus:border-[#191970]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#374151] mb-2">
                  Objectif principal
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {GOALS.map((projectGoal) => {
                    const isSelected = goal === projectGoal;
                    return (
                      <button
                        key={projectGoal}
                        type="button"
                        onClick={() => setGoal(projectGoal)}
                        className={`rounded-xl border p-3 text-left text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-[#191970] bg-[#191970] text-white shadow-md'
                            : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#374151] hover:border-[#191970]/40'
                        }`}
                      >
                        {projectGoal}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#374151] mb-2">
                  Numéro WhatsApp
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+229 90 00 00 00"
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-xs font-bold text-[#111827] outline-none focus:border-[#191970]"
                />
                <p className="mt-1.5 text-[11px] text-[#6B7280]">Utilisé uniquement pour vous recontacter au sujet de cette demande.</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#374151] mb-2">
                  Fonctionnalités souhaitées
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {AVAILABLE_FEATURES.map((feature) => {
                    const selected = selectedFeatures.includes(feature.id);
                    const included = feature.includedInOffer?.includes(currentOffer.slug);
                    return (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => !included && toggleFeature(feature.id)}
                        disabled={included}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          selected
                            ? 'border-[#191970] bg-[#191970]/5 ring-1 ring-[#191970]/20'
                            : 'border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#191970]/40'
                        } ${included ? 'cursor-default' : ''}`}
                      >
                        <span className="block text-xs font-bold text-[#111827]">{feature.name}</span>
                        <span className="mt-1 block text-[11px] leading-relaxed text-[#6B7280]">
                          {included ? 'Inclus dans cette formule' : `+ ${feature.price.toLocaleString('fr-FR')} FCFA`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ════════ DISTANCE ÉTAPE 3 : Synthèse ════════ */}
          {fulfillmentMode === 'distance' && step === 3 && (
            <div className="space-y-6">
              <div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-[-0.01em] leading-[1.2]">
                  Fiche Récapitulative du Projet
                </h2>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#6B7280]">Formule</span>
                    <h3 className="text-lg font-black text-[#111827]">{currentOffer.name}</h3>
                    <p className="text-[#374151] mt-0.5">{activity} — Objectif : {goal}</p>
                  </div>
                  <span className="bg-black text-white font-mono font-bold text-[10px] px-3 py-1 rounded">
                    Délai : {currentOffer.days}
                  </span>
                </div>

                <div className="border-t border-[#E5E7EB] pt-3 flex items-center justify-between font-black text-sm text-[#111827]">
                  <span>Total Estimé</span>
                  <span>{totalPrice.toLocaleString('fr-FR')} FCFA</span>
                </div>

                <p className="border-t border-[#E5E7EB] pt-3 leading-relaxed text-[#6B7280]">
                  Cette estimation sera confirmée avec vous avant tout règlement.
                </p>
              </div>
            </div>
          )}

          {/* ════════ DISTANCE ÉTAPE 4 : Connexion MIDEESSI ════════ */}
          {fulfillmentMode === 'distance' && step === 4 && (
            <div className="space-y-6">
              <div>
               
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-[-0.01em] leading-[1.2]">
                  {user ? 'Votre compte est authentifié' : 'Connexion obligatoire'}
                </h2>
              </div>

              {user ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 space-y-2 text-xs">
                  <span className="font-mono font-bold uppercase text-emerald-800">[ AUTHENTIFIÉ ]</span>
                  <h4 className="font-black text-sm text-emerald-950">{user.nom_marque}</h4>
                  <p className="text-emerald-800">{user.email}</p>
                  
                </div>
              ) : (
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-8 text-center space-y-4">
                  
                  <h3 className="text-xl font-bold text-[#111827]">Connectez-vous pour poursuivre</h3>
                  <p className="text-xs leading-relaxed text-[#6B7280]">Votre brief, vos options et votre formule sont conservés pendant la connexion.</p>
                  

                  <button
                    type="button"
                    onClick={() => {
                      persistRedirectTarget(`/commander?offer=${encodeURIComponent(selectedOfferSlug)}&step=5`);
                      navigate('/login');
                    }}
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#191970] text-white font-black text-xs hover:bg-[#141560] shadow-sm transition-all"
                  >
                    Connexion
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ════════ DISTANCE ÉTAPE 5 : Validation & Paiement ════════ */}
          {fulfillmentMode === 'distance' && step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold text-[#6B7280] block mb-2">
                  RÈGLEMENT &amp; VALIDATION
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-[-0.01em] leading-[1.2]">
                  Choisissez votre formule de règlement
                </h2>
              </div>

              {/* Message d'erreur */}
              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  ⚠️ {submitError}
                </div>
              )}

              {/* Cartes de sélection — ne valident PLUS directement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setPaymentType('installment')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    paymentType === 'installment'
                      ? 'border-[#191970] bg-[#191970] text-white shadow-md ring-2 ring-[#191970]/30'
                      : 'border-[#E5E7EB] bg-white hover:border-[#191970]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-black text-sm ${paymentType === 'installment' ? 'text-white' : 'text-[#111827]'}`}>
                      Paiement Échelonné
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      paymentType === 'installment' ? 'bg-white text-[#191970]' : 'bg-[#191970] text-white'
                    }`}>
                      RECOMMANDÉ
                    </span>
                  </div>
                  <p className={`text-xs mb-3 ${paymentType === 'installment' ? 'text-white/80' : 'text-[#6B7280]'}`}>
                    Acompte initial + 2 mensualités d'accompagnement.
                  </p>
                  <div className={`p-3 rounded-xl border space-y-1 text-xs font-mono ${
                    paymentType === 'installment'
                      ? 'bg-[#141560] border-[#222380] text-white'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827]'
                  }`}>
                    <div className="flex justify-between font-bold">
                      <span>Acompte :</span>
                      <span>{installmentUpfront.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className={`flex justify-between ${paymentType === 'installment' ? 'text-white/70' : 'text-[#6B7280]'}`}>
                      <span>Mensualités :</span>
                      <span>2 × {monthlyAmount.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setPaymentType('full')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    paymentType === 'full'
                      ? 'border-[#191970] bg-[#191970] text-white shadow-md ring-2 ring-[#191970]/30'
                      : 'border-[#E5E7EB] bg-white hover:border-[#191970]/40'
                  }`}
                >
                  <span className={`font-black text-sm block mb-2 ${paymentType === 'full' ? 'text-white' : 'text-[#111827]'}`}>
                    Paiement Intégral
                  </span>
                  <p className={`text-xs mb-3 ${paymentType === 'full' ? 'text-white/80' : 'text-[#6B7280]'}`}>
                    Règlement complet après confirmation de la demande.
                  </p>
                  <div className={`p-3 rounded-xl border text-xs font-mono flex justify-between font-bold ${
                    paymentType === 'full'
                      ? 'bg-[#141560] border-[#222380] text-white'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827]'
                  }`}>
                    <span>Montant total :</span>
                    <span>{totalPrice.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </button>
              </div>

              <p className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-xs leading-relaxed text-[#4B5563]">
                La validation enregistre votre demande de projet. Aucun montant n’est débité à cette étape : MIDEESSI vous contacte ensuite pour confirmer le règlement.
              </p>
            </div>
          )}


          {/* Navigation Controls */}
          <div className="flex flex-col gap-4 pt-8 border-t border-[#E5E7EB] mt-8">
            {/* Disclaimer on RDV Step 3 */}
            {fulfillmentMode === 'rdv' && step === 3 && (
              <p className="text-[11px] text-[#6B7280] text-center leading-relaxed">
                En validant, vous acceptez que MIDEESSI TECH SARL utilise votre numéro de téléphone afin de vous contacter ultérieurement.
              </p>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (step > 1) {
                    // Si connecté et on revient de l'étape 5, sauter l'étape 4 (connexion)
                    const prevStep = (fulfillmentMode === 'distance' && step === 5 && user) ? 3 : step - 1;
                    goToStep(prevStep);
                  } else {
                    navigate('/');
                  }
                }}
                className="px-5 py-3 rounded-xl border border-[#E5E7EB] text-xs font-mono font-bold text-[#374151] hover:bg-[#F3F4F6] transition-all"
              >
                PRÉCÉDENT
              </button>

              {/* RDV Step 1 Next Button */}
              {fulfillmentMode === 'rdv' && step === 1 && (
                <button
                  type="button"
                  disabled={!meetingDate || !meetingTime}
                  onClick={() => goToStep(2)}
                  className={`px-7 py-3.5 rounded-xl text-xs font-black transition-all shadow-sm ${
                    meetingDate && meetingTime
                      ? 'bg-[#191970] text-white hover:bg-[#141560]'
                      : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                  }`}
                >
                  SUIVANT
                </button>
              )}

              {/* RDV Step 2 Next Button */}
              {fulfillmentMode === 'rdv' && step === 2 && (
                <button
                  type="button"
                  disabled={!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()}
                  onClick={() => goToStep(3)}
                  className={`px-7 py-3.5 rounded-xl text-xs font-black transition-all shadow-sm ${
                    contactName.trim() && contactEmail.trim() && contactPhone.trim()
                      ? 'bg-[#191970] text-white hover:bg-[#141560]'
                      : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                  }`}
                >
                  SUIVANT
                </button>
              )}

              {/* RDV Step 3 Valider Button */}
              {fulfillmentMode === 'rdv' && step === 3 && (
                <button
                  type="button"
                  onClick={handleFinalValidation}
                  className="px-8 py-3.5 rounded-xl bg-[#191970] text-white text-xs font-black hover:bg-[#141560] shadow-md transition-all hover:scale-105"
                >
                  VALIDER
                </button>
              )}

              {/* Distance Mode Buttons */}
              {fulfillmentMode === 'distance' && step === 2 && (
                <button
                  type="button"
                  disabled={briefDescription.trim().length === 0 || contactPhone.trim().length === 0}
                  onClick={() => goToStep(3)}
                  className={`px-7 py-3.5 rounded-xl text-xs font-black transition-all shadow-sm ${
                    briefDescription.trim().length > 0 && contactPhone.trim().length > 0
                      ? 'bg-[#191970] text-white hover:bg-[#141560]'
                      : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                  }`}
                >
                  SUIVANT
                </button>
              )}

              {fulfillmentMode === 'distance' && step === 3 && (
                <button
                  type="button"
                  onClick={() => goToStep(user ? 5 : 4)}
                  className="px-7 py-3.5 rounded-xl bg-[#191970] text-white text-xs font-black hover:bg-[#141560] transition-all shadow-sm"
                >
                  VALIDER
                </button>
              )}

              {fulfillmentMode === 'distance' && step === 4 && user && (
                <button
                  type="button"
                  onClick={() => goToStep(5)}
                  className="px-7 py-3.5 rounded-xl bg-[#191970] text-white text-xs font-black hover:bg-[#141560] transition-all shadow-sm"
                >
                  VOIR LES FORMULES
                </button>
              )}

              {fulfillmentMode === 'distance' && step === 5 && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleFinalValidation(paymentType)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#191970] text-white text-xs font-black hover:bg-[#141560] shadow-md transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Création en cours…
                    </>
                  ) : (
                    'ENVOYER MA DEMANDE'
                  )}
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Date & Time Modals */}
      {isDatePickerOpen && (
        <DatePickerModal
          selectedDate={meetingDate}
          onSelectDate={(dateStr) => {
            setMeetingDate(dateStr);
            if (meetingTime) {
              goToStep(2);
            } else {
              setIsTimePickerOpen(true);
            }
          }}
          onClose={() => setIsDatePickerOpen(false)}
        />
      )}

      {isTimePickerOpen && (
        <TimePickerModal
          selectedTime={meetingTime}
          onSelectTime={(timeStr) => {
            setMeetingTime(timeStr);
            if (meetingDate) {
              goToStep(2);
            } else if (!meetingDate) {
              setIsDatePickerOpen(true);
            }
          }}
          onClose={() => setIsTimePickerOpen(false)}
        />
      )}

    </div>
  );
}
