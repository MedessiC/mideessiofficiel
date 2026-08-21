import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, ArrowRight, ArrowLeft, Sparkles, Building2, ShoppingBag, Landmark, Briefcase, FileText, CheckCircle2, ShieldCheck, CreditCard, Smartphone } from 'lucide-react';
import { useProjects } from '../../contexts/ProjectContext';
import { useClientAuth } from '../../contexts/ClientContext';
import { ActivityType, ProjectGoal, AVAILABLE_FEATURES } from '../../types/project';

interface ProjectWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOfferSlug?: string | null;
}

const OFFERS = [
  { slug: 'vitrine', name: 'Site Vitrine', basePrice: 75000, days: '3-5 jours', desc: 'Présentez votre entreprise avec crédibilité (5 à 7 pages)' },
  { slug: 'e-commerce', name: 'Site E-Commerce', basePrice: 150000, days: '7-10 jours', desc: 'Vendez vos produits 24h/24 avec paiements Mobile Money' },
  { slug: 'application-web', name: 'Application Web', basePrice: 250000, days: '14-21 jours', desc: 'Plateforme sur mesure, gestion de clients & automatisations' },
];

const ACTIVITIES: { label: ActivityType; icon: any }[] = [
  { label: 'Restaurant', icon: Building2 },
  { label: 'Commerce', icon: ShoppingBag },
  { label: 'Association', icon: Landmark },
  { label: 'Cabinet', icon: Briefcase },
  { label: 'Profession libérale', icon: FileText },
  { label: 'Autre', icon: Sparkles },
];

const GOALS: ProjectGoal[] = [
  'Présenter mon activité',
  'Obtenir des contacts',
  'Présenter mes services',
  'Prendre des rendez-vous',
  'Vendre mes produits en ligne',
  'Autre',
];

export const ProjectWizardModal: React.FC<ProjectWizardModalProps> = ({
  isOpen,
  onClose,
  defaultOfferSlug = 'vitrine',
}) => {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const { user, loginClient, signupClient } = useClientAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form State
  const [selectedOfferSlug, setSelectedOfferSlug] = useState<string>(defaultOfferSlug || 'vitrine');
  const [activity, setActivity] = useState<ActivityType>('Restaurant');
  const [goal, setGoal] = useState<ProjectGoal>('Obtenir des contacts');
  const [briefDescription, setBriefDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'presentation',
    'services',
    'contact_form',
    'whatsapp_button',
  ]);
  const [paymentType, setPaymentType] = useState<'full' | 'installment'>('installment');

  // Auth Form State (Step 5)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  // Current Offer Object
  const currentOffer = useMemo(() => {
    return OFFERS.find((o) => o.slug === selectedOfferSlug) || OFFERS[0];
  }, [selectedOfferSlug]);

  // Price Calculation
  const totalPrice = useMemo(() => {
    let sum = currentOffer.basePrice;
    AVAILABLE_FEATURES.forEach((feat) => {
      if (selectedFeatures.includes(feat.id)) {
        // If not included in current offer, add cost
        if (!feat.includedInOffer?.includes(currentOffer.slug)) {
          sum += feat.price;
        }
      }
    });
    return sum;
  }, [currentOffer, selectedFeatures]);

  // Payment Schedule Calculation
  const installmentUpfront = Math.round(totalPrice * 0.4);
  const installmentRemaining = totalPrice - installmentUpfront;
  const monthlyAmount = Math.round(installmentRemaining / 2);

  if (!isOpen) return null;

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthSubmitting(true);

    try {
      if (authMode === 'signup') {
        if (!authName || !authEmail || !authPhone || !authPassword) {
          setAuthError('Veuillez remplir tous les champs.');
          setIsAuthSubmitting(false);
          return;
        }
        await signupClient(authName, authEmail, authPhone, authPassword);
      } else {
        if (!authEmail || !authPassword) {
          setAuthError('Veuillez renseigner votre email et mot de passe.');
          setIsAuthSubmitting(false);
          return;
        }
        await loginClient(authEmail, authPassword);
      }
      // Advance to step 6 (Payment)
      setStep(6);
    } catch (err: any) {
      setAuthError(err.message || 'Erreur lors de l\'authentification. Veuillez rééssayer.');
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleFinalValidation = async () => {
    const clientName = user?.nom || authName || 'Client MIDEESSI';
    const clientEmail = user?.email || authEmail || 'client@example.com';
    const clientPhone = user?.telephone || authPhone || '+229 90 00 00 00';
    const clientId = user?.client_id || `cli_${Date.now()}`;
    const userId = user?.id || `usr_${Date.now()}`;

    const newPrj = await createProject({
      user_id: userId,
      client_id: clientId,
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone,
      offer_slug: currentOffer.slug as any,
      offer_name: currentOffer.name,
      activity,
      goal,
      brief_description: briefDescription || `Projet site web pour ${activity} à Cotonou.`,
      selected_features: selectedFeatures,
      price_total: totalPrice,
      payment_type: paymentType,
      payment_schedule: {
        upfront: paymentType === 'installment' ? installmentUpfront : totalPrice,
        installment_amount: paymentType === 'installment' ? monthlyAmount : 0,
        installments_count: paymentType === 'installment' ? 2 : 0,
        paid_installments: 1,
      },
      estimated_days: currentOffer.days,
    });

    onClose();
    navigate(`/clients/projets/${newPrj.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white text-[#111111] shadow-2xl border border-[#E5E7EB] overflow-hidden my-auto">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB] bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#191970] text-[#FFD700] font-black text-sm">
              M
            </span>
            <div>
              <h3 className="font-extrabold text-base text-[#191970] tracking-tight">
                Configuration de votre projet Web
              </h3>
              <p className="text-xs text-[#6B7280]">Étape {step} sur 6</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full bg-[#E5E7EB] h-1.5">
          <div
            className="bg-[#191970] h-1.5 transition-all duration-500 ease-out"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">

          {/* ════════ STEP 1 : Offre & Activité ════════ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#191970] block mb-1">
                  1. Choix de l'offre & Votre domaine
                </span>
                <h4 className="text-2xl font-extrabold text-[#111111] tracking-tight">
                  Quelle est la nature de votre entreprise ?
                </h4>
              </div>

              {/* Offer Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  1.1 Type de site souhaité
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {OFFERS.map((off) => {
                    const isSel = selectedOfferSlug === off.slug;
                    return (
                      <button
                        key={off.slug}
                        type="button"
                        onClick={() => setSelectedOfferSlug(off.slug)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          isSel
                            ? 'border-[#191970] bg-[#191970]/5 shadow-md ring-2 ring-[#191970]/20'
                            : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-bold text-sm ${isSel ? 'text-[#191970]' : 'text-[#111111]'}`}>
                            {off.name}
                          </span>
                          {isSel && <CheckCircle2 className="h-4 w-4 text-[#191970]" />}
                        </div>
                        <p className="text-xs text-[#6B7280] leading-snug mb-3">{off.desc}</p>
                        <div className="text-xs font-extrabold text-[#191970]">
                          Dès {off.basePrice.toLocaleString('fr-FR')} FCFA
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activity Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  1.2 Quel est votre secteur d'activité ?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ACTIVITIES.map(({ label, icon: IconComp }) => {
                    const isAct = activity === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setActivity(label)}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                          isAct
                            ? 'border-[#191970] bg-[#191970] text-white shadow-md'
                            : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#374151] hover:bg-[#F3F4F6]'
                        }`}
                      >
                        <IconComp className={`h-5 w-5 ${isAct ? 'text-[#FFD700]' : 'text-[#191970]'}`} />
                        <span className="text-xs font-bold">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ════════ STEP 2 : Objectifs & Brief ════════ */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#191970] block mb-1">
                  2. Vos objectifs & Votre projet
                </span>
                <h4 className="text-2xl font-extrabold text-[#111111] tracking-tight">
                  Que souhaitez-vous accomplir avec ce site ?
                </h4>
              </div>

              {/* Goal Choice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOALS.map((g) => {
                  const isG = goal === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGoal(g)}
                      className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                        isG
                          ? 'border-[#191970] bg-[#191970]/5 ring-2 ring-[#191970]/20'
                          : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#111827]">{g}</span>
                      {isG && <Check className="h-4 w-4 text-[#191970]" />}
                    </button>
                  );
                })}
              </div>

              {/* Textarea brief */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#374151] mb-2">
                  Décrivez votre projet en quelques mots
                </label>
                <textarea
                  rows={4}
                  value={briefDescription}
                  onChange={(e) => setBriefDescription(e.target.value)}
                  placeholder="Exemple : Je suis propriétaire d'un restaurant à Cotonou et je veux un site pour présenter mes plats, mes horaires et permettre aux clients de nous contacter sur WhatsApp."
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-sm text-[#111827] outline-none focus:border-[#191970] focus:ring-2 focus:ring-[#191970]/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* ════════ STEP 3 : Fonctionnalités & Options ════════ */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#191970] block mb-1">
                    3. Fonctionnalités sur mesure
                  </span>
                  <h4 className="text-2xl font-extrabold text-[#111111] tracking-tight">
                    Choisissez les éléments dont vous avez besoin
                  </h4>
                </div>
                <div className="bg-[#191970] text-white px-4 py-2 rounded-xl text-right flex-shrink-0">
                  <div className="text-[10px] uppercase font-bold text-[#FFD700]">Total Estimé</div>
                  <div className="text-lg font-black">{totalPrice.toLocaleString('fr-FR')} FCFA</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_FEATURES.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat.id);
                  const isFree = feat.includedInOffer?.includes(currentOffer.slug);

                  return (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-4 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all ${
                        isChecked
                          ? 'border-[#191970] bg-[#191970]/5 shadow-sm'
                          : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#111827]">{feat.name}</span>
                          {isFree && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Inclus
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B7280] mt-1 leading-snug">{feat.description}</p>
                        {!isFree && feat.price > 0 && (
                          <div className="text-xs font-bold text-[#191970] mt-2">
                            + {feat.price.toLocaleString('fr-FR')} FCFA
                          </div>
                        )}
                      </div>

                      <div
                        className={`h-5 w-5 rounded-md border flex items-center justify-center mt-0.5 ${
                          isChecked ? 'bg-[#191970] border-[#191970] text-white' : 'border-[#D1D5DB] bg-white'
                        }`}
                      >
                        {isChecked && <Check size={13} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════ STEP 4 : Récapitulatif ════════ */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#191970] block mb-1">
                  4. Récapitulatif de votre projet
                </span>
                <h4 className="text-2xl font-extrabold text-[#111111] tracking-tight">
                  Vérifiez vos informations avant de continuer
                </h4>
              </div>

              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                  <div>
                    <span className="text-xs text-[#6B7280] uppercase font-bold tracking-wider">Offre sélectionnée</span>
                    <h5 className="text-xl font-black text-[#191970]">{currentOffer.name}</h5>
                    <p className="text-xs text-[#374151] mt-0.5">{activity} — Objectif: {goal}</p>
                  </div>
                  <span className="bg-[#FFD700] text-[#191970] font-black text-xs px-3 py-1.5 rounded-full">
                    Délai : {currentOffer.days}
                  </span>
                </div>

                {/* Selected Features list */}
                <div>
                  <span className="text-xs font-bold uppercase text-[#6B7280] block mb-2">Fonctionnalités incluses & ajoutées :</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeatures.map((fId) => {
                      const featObj = AVAILABLE_FEATURES.find((f) => f.id === fId);
                      if (!featObj) return null;
                      return (
                        <span key={fId} className="inline-flex items-center gap-1.5 bg-white border border-[#E5E7EB] text-[#111827] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs">
                          <Check className="h-3.5 w-3.5 text-[#191970]" />
                          {featObj.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {briefDescription && (
                  <div className="border-t border-[#E5E7EB] pt-4">
                    <span className="text-xs font-bold uppercase text-[#6B7280] block mb-1">Votre brief :</span>
                    <p className="text-xs text-[#374151] italic bg-white p-3 rounded-xl border border-[#E5E7EB]">{briefDescription}</p>
                  </div>
                )}

                {/* Price Total */}
                <div className="border-t border-[#E5E7EB] pt-4 flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#111827]">Total du Projet</span>
                  <span className="text-2xl font-black text-[#191970]">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <span>Besoin de modifier ? Vous pouvez retourner en arrière.</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="font-bold text-[#191970] underline hover:opacity-80"
                >
                  Modifier le projet
                </button>
              </div>
            </div>
          )}

          {/* ════════ STEP 5 : Inscription / Connexion & Activation Mode Client ════════ */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#191970] block mb-1">
                  5. Compte MIDEESSI & Mode Client
                </span>
                <h4 className="text-2xl font-extrabold text-[#111111] tracking-tight">
                  {user ? 'Votre compte est prêt !' : 'Créez votre compte MIDEESSI'}
                </h4>
                <p className="text-xs text-[#6B7280] mt-1">
                  Votre compte utilisateur MIDEESSI sera automatiquement activé en <strong className="text-[#191970]">Mode Client</strong> pour vous donner accès à l'espace de suivi de projet.
                </p>
              </div>

              {user ? (
                /* Already Logged In Card */
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-emerald-600" />
                    <div>
                      <h5 className="font-bold text-sm text-emerald-950">Connecté en tant que {user.nom}</h5>
                      <p className="text-xs text-emerald-800">{user.email} — {user.telephone}</p>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-900 bg-white/80 p-3 rounded-xl border border-emerald-200">
                    ✓ Votre compte sera passé en Mode Client dès la validation de cette commande.
                  </div>
                </div>
              ) : (
                /* Auth Form */
                <form onSubmit={handleAuthSubmit} className="space-y-4 bg-[#F8FAFC] p-6 rounded-3xl border border-[#E5E7EB]">

                  <div className="flex items-center justify-center gap-2 mb-4 bg-white p-1 rounded-2xl border border-[#E5E7EB]">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                        authMode === 'signup' ? 'bg-[#191970] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#111111]'
                      }`}
                    >
                      Nouveau compte MIDEESSI
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                        authMode === 'login' ? 'bg-[#191970] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#111111]'
                      }`}
                    >
                      J'ai déjà un compte
                    </button>
                  </div>

                  {authError && (
                    <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 rounded-xl border border-rose-200">
                      {authError}
                    </div>
                  )}

                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1">Nom complet</label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Ex: Cheikh Diop"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-xs text-[#111827] outline-none focus:border-[#191970]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1">Adresse Email</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="cheikh@example.com"
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-xs text-[#111827] outline-none focus:border-[#191970]"
                    />
                  </div>

                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1">Numéro Téléphone (WhatsApp)</label>
                      <input
                        type="tel"
                        required
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="+229 97 00 00 00"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-xs text-[#111827] outline-none focus:border-[#191970]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1">Mot de passe</label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-xs text-[#111827] outline-none focus:border-[#191970]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthSubmitting}
                    className="w-full py-3 rounded-xl bg-[#191970] text-white font-bold text-xs hover:bg-[#141560] transition-colors"
                  >
                    {isAuthSubmitting ? 'Traitement en cours...' : authMode === 'signup' ? 'Créer mon compte & Continuer' : 'Se connecter & Continuer'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ════════ STEP 6 : Choix du Paiement & Validation Final ════════ */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#191970] block mb-1">
                  6. Modalité de Paiement & Confirmation
                </span>
                <h4 className="text-2xl font-extrabold text-[#111111] tracking-tight">
                  Choisissez votre formule de règlement
                </h4>
              </div>

              {/* Payment Type Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Option Échelonné */}
                <button
                  type="button"
                  onClick={() => setPaymentType('installment')}
                  className={`p-5 rounded-3xl border text-left transition-all ${
                    paymentType === 'installment'
                      ? 'border-[#191970] bg-[#191970]/5 shadow-md ring-2 ring-[#191970]/20'
                      : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-[#191970]">Paiement Échelonné</span>
                    <span className="bg-[#FFD700] text-[#191970] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">Recommandé</span>
                  </div>
                  <p className="text-xs text-[#6B7280] mb-4">Payez un acompte aujourd'hui, puis étalez le reste en 2 mensualités.</p>

                  <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-[#111827]">
                      <span>Aujourd'hui :</span>
                      <span>{installmentUpfront.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between text-[#6B7280]">
                      <span>Puis :</span>
                      <span>2 × {monthlyAmount.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                </button>

                {/* Option Intégral */}
                <button
                  type="button"
                  onClick={() => setPaymentType('full')}
                  className={`p-5 rounded-3xl border text-left transition-all ${
                    paymentType === 'full'
                      ? 'border-[#191970] bg-[#191970]/5 shadow-md ring-2 ring-[#191970]/20'
                      : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-[#191970]">Paiement Intégral</span>
                  </div>
                  <p className="text-xs text-[#6B7280] mb-4">Réglez l'intégralité du projet en une seule fois.</p>

                  <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] space-y-1 text-xs">
                    <div className="flex justify-between font-extrabold text-[#191970]">
                      <span>Total à payer :</span>
                      <span>{totalPrice.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                </button>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 flex items-center gap-3 text-xs text-[#374151]">
                <Smartphone className="h-6 w-6 text-[#191970] flex-shrink-0" />
                <span>Paiement sécurisé via Mobile Money (MTN, Moov, Wave) et Carte bancaire.</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] bg-[#FAFAFA]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-[#374151] hover:bg-[#F3F4F6] transition-colors"
            >
              <ArrowLeft size={14} />
              Précédent
            </button>
          ) : (
            <div />
          )}

          {step < 5 && (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#191970] text-white text-xs font-bold hover:bg-[#141560] transition-colors shadow-sm"
            >
              Continuer
              <ArrowRight size={14} />
            </button>
          )}

          {step === 5 && user && (
            <button
              type="button"
              onClick={() => setStep(6)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#191970] text-white text-xs font-bold hover:bg-[#141560] transition-colors shadow-sm"
            >
              Accéder au Paiement
              <ArrowRight size={14} />
            </button>
          )}

          {step === 6 && (
            <button
              type="button"
              onClick={handleFinalValidation}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#191970] text-[#FFD700] text-xs font-extrabold hover:bg-[#141560] transition-all transform hover:scale-105 shadow-md"
            >
              Valider mon Projet & Démarrer
              <Check size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
