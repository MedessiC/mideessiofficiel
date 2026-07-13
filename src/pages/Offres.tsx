import {
  ArrowRight, Globe, ShoppingCart, Smartphone, Code, PackageOpen,
  MessageCircle, FileText, ChevronRight, Users, TrendingUp, Star,
  Zap, Shield, Clock, CheckCircle2, ChevronDown, XCircle,
  Phone, Calendar, BadgeCheck, Layers, Sparkles, HeartHandshake
} from 'lucide-react';
import { useState, useRef } from 'react';
import SEO from '../components/SEO';
import { offres } from '../data/offres';
import { devServices } from '../data/devServices';
import PopupDisplay from '../components/PopupDisplay';

type CategoryType = 'presence' | 'tech';

const PHONE_NUMBER = '2290164409691';

const FAQ_PRESENCE = [
  {
    q: 'C\'est quoi la différence entre les 3 packs ?',
    a: 'Chaque pack s\'empile sur le précédent : Kpèvi est l\'entrée de gamme, Eya ajoute la création de contenu et les campagnes pub, Jago inclut tout ça plus une stratégie avancée et un reporting mensuel.'
  },
  {
    q: 'Est-ce que je peux changer de pack après ?',
    a: 'Oui, vous pouvez upgrader à tout moment. Vous payez simplement la différence au prorata du mois.'
  },
  {
    q: 'Y a-t-il un engagement minimum ?',
    a: 'Nos packs sont sans engagement. Vous pouvez stopper à tout moment avec un préavis de 30 jours.'
  },
  {
    q: 'Le budget publicitaire est-il inclus ?',
    a: 'Non, le budget de diffusion des publicités (Meta Ads, etc.) est à votre charge. Nous gérons la stratégie et la création, vous maîtrisez votre budget pub.'
  },
  {
    q: 'Quels réseaux sociaux gérez-vous ?',
    a: 'Nous couvrons principalement Facebook et Instagram. Sur les packs supérieurs (Eya et Jago), nous pouvons inclure TikTok, LinkedIn ou YouTube selon vos cibles.'
  },
];

const FAQ_TECH = [
  {
    q: 'Comment se déroule un projet de développement ?',
    a: 'Nous travaillons en sprints agiles : cahier des charges → maquettes → développement → tests → mise en place. Vous êtes impliqué à chaque étape.'
  },
  {
    q: 'Le prix affiché est-il fixe ?',
    a: 'Le prix indiqué est un point de départ. Le devis final dépend de la complexité de votre projet et est établi après une consultation gratuite.'
  },
  {
    q: 'Que se passe-t-il après la mise en place ?',
    a: 'Nous assurons une période de garantie de 3 mois et proposons des contrats de maintenance pour la suite.'
  },
  {
    q: 'Puis-je voir des exemples de travaux réalisés ?',
    a: 'Absolument ! Consultez notre page Projets pour découvrir notre portfolio. Lors d\'une consultation, nous pouvons aussi vous montrer des demos en live.'
  },
  {
    q: 'Travaillez-vous avec des clients hors du Bénin ?',
    a: 'Oui, nous travaillons avec des clients partout en Afrique de l\'Ouest et au-delà. Tout se passe en ligne, avec des calls réguliers et des livrables documentés.'
  },
];

const STATS = [
  { icon: Users, value: '50+', label: 'Clients accompagnés' },
  { icon: TrendingUp, value: '3x', label: 'Croissance moyenne' },
  { icon: Star, value: '4.9★', label: 'Satisfaction client' },
  { icon: Shield, value: '100%', label: 'Projets réalisés' },
];

const STEPS = [
  { step: 1, icon: MessageCircle, title: 'Consultation', desc: 'Écoute & analyse de vos besoins', color: 'bg-[var(--brand-midnight)]' },
  { step: 2, icon: FileText, title: 'Proposition', desc: 'Devis personnalisé sous 48h', color: 'bg-[var(--brand-gold)]' },
  { step: 3, icon: Zap, title: 'Exécution', desc: 'Sprints agiles & suivi régulier', color: 'bg-gray-800' },
  { step: 4, icon: TrendingUp, title: 'Suivi', desc: 'Rapport & optimisation continue', color: 'bg-[var(--brand-midnight)]' },
];


const Offres = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('presence');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [comparePack, setComparePack] = useState<string | null>(null);
  const offresContentRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => price.toLocaleString('fr-FR');

  const scrollToContent = () => {
    offresContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleWhatsAppDevis = (serviceName: string) => {
    const message = `Bonjour MIDEESSI, je suis intéressé par un devis pour : ${serviceName}`;
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleWhatsAppHelp = () => {
    const message = `Bonjour MIDEESSI, je ne sais pas trop quoi choisir. Pouvez-vous m'aider ?`;
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:+${PHONE_NUMBER}`;
  };

  const handleBookCall = () => {
    const message = `Bonjour MIDEESSI, je voudrais prendre rendez-vous pour une consultation gratuite.`;
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getIcon = (iconName: string) => {
    const map: Record<string, React.ReactNode> = {
      Globe: <Globe className="w-5 h-5" />,
      ShoppingCart: <ShoppingCart className="w-5 h-5" />,
      Smartphone: <Smartphone className="w-5 h-5" />,
      Code: <Code className="w-5 h-5" />,
      PackageOpen: <PackageOpen className="w-5 h-5" />,
    };
    return map[iconName];
  };

  const faqs = activeCategory === 'presence' ? FAQ_PRESENCE : FAQ_TECH;

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 overflow-x-hidden font-poppins selection:bg-gold selection:text-midnight transition-colors duration-300">
      <SEO
        title="Nos Offres | MIDEESSI - Agence Digitale"
        description="Services digitaux : Présence Digitale et Développement Tech. Trouvez la solution adaptée à votre business."
        keywords={['offres', 'packs', 'services digitaux', 'agence digitale', 'MIDEESSI']}
      />

      {/* ════════════════════════════════════════════
          HERO — Choix catégorie
      ════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-midnight via-blue-900 to-midnight dark:from-black dark:via-gray-900 dark:to-black text-white overflow-hidden">
        {/* Decorative blobs + geometric shapes (matching Home/About/Solutions) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute -top-10 right-5 md:top-10 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-gold rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-5 md:bottom-10 md:left-10 w-48 h-48 md:w-80 md:h-80 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-midnight via-gold to-midnight" />
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-gold opacity-20 rotate-45 animate-pulse hidden sm:block pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-gold opacity-20 rounded-full animate-pulse hidden sm:block pointer-events-none" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 md:pt-16 md:pb-14">
          {/* Tagline badge */}
          <div className="flex justify-center mb-5 md:mb-7">
            <span className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 text-gold px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Choisissez votre voie
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-3 md:mb-5">
              Deux approches,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-300">
                un seul objectif
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Boostez votre présence en ligne ou développez votre solution tech. Votre succès, nos solutions.
            </p>
          </div>

          {/* ── TOGGLE CATÉGORIE — Pilule responsive ── */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto mb-8 md:mb-12">
            {/* Présence Digitale */}
            <button
              onClick={() => { setActiveCategory('presence'); scrollToContent(); }}
              className={`flex-1 group relative rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 border-2 ${
                activeCategory === 'presence'
                  ? 'bg-gold/15 border-gold shadow-[0_0_30px_rgba(255,215,0,0.15)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${activeCategory === 'presence' ? 'bg-gold/25' : 'bg-white/10'}`}>
                  <Globe className={`w-6 h-6 ${activeCategory === 'presence' ? 'text-gold' : 'text-gray-300'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`text-base sm:text-lg font-bold leading-tight ${activeCategory === 'presence' ? 'text-gold' : 'text-white'}`}>
                      Présence Digitale
                    </h3>
                    {activeCategory === 'presence' && (
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-midnight" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-400">Réseaux sociaux · Contenu · Publicités</p>
                </div>
              </div>
              <div className={`mt-3 flex items-center gap-1.5 text-[10px] font-semibold ${activeCategory === 'presence' ? 'text-gold/80' : 'text-gray-500'}`}>
                <span className="px-2 py-0.5 rounded-full bg-white/10">3 packs</span>
                <span>À partir de 99 000 FCFA/mois</span>
              </div>
            </button>

            {/* Développement Tech */}
            <button
              onClick={() => { setActiveCategory('tech'); scrollToContent(); }}
              className={`flex-1 group relative rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 border-2 ${
                activeCategory === 'tech'
                  ? 'bg-white/10 border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.08)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${activeCategory === 'tech' ? 'bg-white/15' : 'bg-white/10'}`}>
                  <Code className={`w-6 h-6 ${activeCategory === 'tech' ? 'text-white' : 'text-gray-300'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-base sm:text-lg font-bold leading-tight text-white">
                      Développement Tech
                    </h3>
                    {activeCategory === 'tech' && (
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-midnight" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-400">Sites web · Apps mobiles · Logiciels</p>
                </div>
              </div>
              <div className={`mt-3 flex items-center gap-1.5 text-[10px] font-semibold ${activeCategory === 'tech' ? 'text-white/70' : 'text-gray-500'}`}>
                <span className="px-2 py-0.5 rounded-full bg-white/10">5 services</span>
                <span>À partir de 100 000 FCFA</span>
              </div>
            </button>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-4 gap-3 md:gap-6 border-t border-white/10 pt-6 md:pt-8">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="text-base sm:text-2xl font-black text-gold">{value}</div>
                <div className="text-[9px] sm:text-xs text-gray-400 leading-tight mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anchor */}
      <div ref={offresContentRef} className="scroll-mt-20" />

      {/* ════════════════════════════════════════════
          OFFRES CONTENT
      ════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 lg:py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── PRÉSENCE DIGITALE ── */}
          {activeCategory === 'presence' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                  <Globe className="w-3.5 h-3.5" /> Présence Digitale
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-midnight dark:text-white mb-2">
                  Choisissez votre pack
                </h2>
                <div className="w-16 h-1 bg-gold mx-auto rounded-full mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                  Chaque pack est pensé pour une étape de croissance. Progressez à votre rythme.
                </p>
                {/* Pack progression pill */}
                <div className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow-sm border border-gray-200 dark:border-gray-700 mt-4 flex-wrap justify-center">
                  {[{ name: 'KPÈVI', color: 'text-gray-500 dark:text-gray-400' }, { name: 'EYA', color: 'text-midnight dark:text-white' }, { name: 'JAGO', color: 'text-gold' }].map((item, i) => (
                    <span key={i} className={`text-[10px] sm:text-xs font-bold flex items-center gap-1 ${item.color}`}>
                      {i > 0 && <ChevronRight className="w-3 h-3 text-gold" />}
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 items-stretch">
                {offres.map((offre, index) => (
                  <div key={offre.id} className="group relative flex flex-col">
                    {/* Badge populaire */}
                    {offre.badge && (
                      <div className="absolute -top-3.5 inset-x-0 flex justify-center z-10">
                        <span className="bg-gradient-to-r from-gold to-yellow-400 text-midnight px-4 py-1 rounded-full text-[11px] font-black shadow-md whitespace-nowrap">
                          ⭐ {offre.badge}
                        </span>
                      </div>
                    )}

                    <div className={`relative bg-white dark:bg-gray-800 rounded-[20px] sm:rounded-[24px] overflow-hidden flex flex-col flex-grow transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
                      offre.badge
                        ? 'ring-2 ring-gold shadow-[0_8px_40px_rgba(255,215,0,0.12)] hover:shadow-[0_16px_60px_rgba(255,215,0,0.2)] hover:-translate-y-1'
                        : 'shadow-lg hover:shadow-xl hover:border-gold/30 hover:-translate-y-1'
                    }`}>

                      {/* Image / Prix */}
                      <div className="relative h-44 sm:h-40 md:h-44 w-full overflow-hidden bg-gradient-to-br from-midnight to-blue-900 flex-shrink-0">
                        <img
                          src={offre.image}
                          alt={offre.nom}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                        {/* Pack number */}
                        <div className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                          <span className="text-xs font-black text-white">{index + 1}</span>
                        </div>

                        {/* Price */}
                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-10">
                          <div>
                            <span className="text-2xl sm:text-3xl font-black text-white leading-none drop-shadow-md">
                              {offre.id === 'livnon' ? '—' : formatPrice(offre.prix)}
                            </span>
                            {offre.id !== 'livnon' && (
                              <span className="text-[10px] font-bold text-gray-300 ml-1 align-bottom">FCFA/MOIS</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 sm:p-5 md:p-6 flex flex-col flex-grow">
                        <div className="mb-4">
                          <h3 className="text-xl sm:text-2xl font-black text-midnight dark:text-white leading-tight">
                            {offre.nom}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 italic mt-1">
                            "{offre.signification}" — {offre.tagline}
                          </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-2.5 mb-5 flex-grow">
                          {offre.features.filter(f => f.included).slice(0, 5).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                              <span className="text-[11px] sm:text-sm text-gray-700 dark:text-gray-300 leading-tight">{feature.name}</span>
                            </div>
                          ))}
                          {offre.features.filter(f => !f.included).slice(0, 2).map((feature, idx) => (
                            <div key={`x-${idx}`} className="flex items-start gap-2 opacity-50">
                              <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <span className="text-[11px] sm:text-sm text-gray-400 dark:text-gray-500 leading-tight line-through">{feature.name}</span>
                            </div>
                          ))}
                          {offre.features.filter(f => f.included).length > 5 && (
                            <div className="pt-1">
                              <a href={`/offres/${offre.slug}`} className="text-[10px] font-bold text-midnight dark:text-white hover:text-gold transition-colors underline underline-offset-2">
                                + {offre.features.filter(f => f.included).length - 5} autres avantages →
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Who it's for */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-4 border border-gray-200 dark:border-gray-600">
                          <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 leading-snug">
                            <span className="font-bold text-midnight dark:text-white">Pour qui ? </span>
                            {offre.forWho.slice(0, 90)}…
                          </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-2 mt-auto pt-4 border-t border-gray-200 dark:border-gray-600">
                          <a
                            href={`/offres/${offre.slug}`}
                            className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                              offre.badge
                                ? 'bg-gradient-to-r from-gold to-yellow-400 text-midnight shadow-md hover:shadow-lg hover:shadow-gold/30'
                                : 'bg-gradient-to-r from-midnight to-blue-900 text-white hover:from-blue-900 hover:to-midnight shadow-md hover:shadow-lg'
                            }`}
                          >
                            Voir le détail <ArrowRight className="w-4 h-4" />
                          </a>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleWhatsAppDevis(offre.nom)}
                              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-midnight dark:text-white transition-colors active:scale-[0.98]"
                            >
                              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                            </button>
                            <button
                              onClick={() => window.location.assign(`/submit-dossier?offerSlug=${offre.slug}&offerName=${encodeURIComponent(offre.nom)}&offerType=presence`)}
                              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-midnight dark:text-white transition-colors active:scale-[0.98]"
                            >
                              <FileText className="w-3.5 h-3.5 text-gold" /> Dossier
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tableau de comparaison rapide */}
              <div className="mt-10 md:mt-14 bg-white dark:bg-gray-800 rounded-[20px] border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 bg-gradient-to-r from-midnight/5 to-transparent dark:from-gold/5">
                  <Layers className="w-5 h-5 text-gold" />
                    <h3 className="font-bold text-midnight dark:text-white">Comparaison rapide des packs</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                        <th className="text-left py-3 px-4 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Fonctionnalité</th>
                        {offres.map(o => (
                          <th key={o.id} className="py-3 px-3 font-black text-midnight dark:text-white text-center text-sm">
                            {o.nom}
                            {o.badge && <span className="block text-[9px] font-bold text-gold">{o.badge}</span>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {offres[offres.length - 1].features.slice(0, 8).map((_, rowIdx) => (
                        <tr key={rowIdx} className={`border-b border-gray-200 dark:border-gray-700 ${rowIdx % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-700/30'}`}>
                          <td className="py-2.5 px-4 text-xs text-gray-600 dark:text-gray-300 font-medium">
                            {offres[offres.length - 1].features[rowIdx].name}
                          </td>
                          {offres.map(o => (
                            <td key={o.id} className="py-2.5 px-3 text-center">
                              {o.features[rowIdx]?.included
                                ? <CheckCircle2 className="w-4 h-4 text-gold mx-auto" />
                                : <XCircle className="w-4 h-4 text-gray-300 dark:text-gray-500 mx-auto" />
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="bg-gradient-to-r from-gold/5 to-transparent dark:from-gold/10">
                        <td className="py-3 px-4 text-xs font-black text-midnight dark:text-white uppercase tracking-wider">Prix mensuel</td>
                        {offres.map(o => (
                          <td key={o.id} className="py-3 px-3 text-center font-black text-sm text-midnight dark:text-white">
                            {formatPrice(o.prix)} F
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── DÉVELOPPEMENT TECH ── */}
          {activeCategory === 'tech' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center gap-2 bg-midnight/10 dark:bg-white/10 border border-midnight/20 dark:border-white/15 text-midnight dark:text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                  <Code className="w-3.5 h-3.5" /> Développement Tech
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-midnight dark:text-white mb-2">
                  Solutions sur mesure
                </h2>
                <div className="w-16 h-1 bg-gold mx-auto rounded-full mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                  Chaque projet est unique. Consultation gratuite pour un devis précis adapté à vos besoins.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 items-stretch">
                {devServices.map((service) => (
                  <div
                    key={service.id}
                    className="group relative bg-white dark:bg-gray-800 rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-gold/30 transition-all duration-300 flex flex-col hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-36 sm:h-44 overflow-hidden bg-gradient-to-br from-midnight to-blue-900">
                      <img
                        src={service.image}
                        alt={service.nom}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      {/* Icon + Price overlay */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-white/10 backdrop-blur border border-white/20 rounded-xl flex items-center justify-center text-gold">
                            {getIcon(service.icon)}
                          </div>
                          <div>
                            <div className="text-[9px] text-gray-300 font-semibold uppercase tracking-wide">À partir de</div>
                            <div className="text-lg sm:text-xl font-black text-white leading-tight">
                              {formatPrice(service.prixDebut)} F
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-white/10 backdrop-blur border border-white/20 rounded-lg px-2 py-1">
                          <Clock className="w-3 h-3 text-gold" />
                          <span className="text-[10px] font-bold text-white">{service.delai}</span>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                      <h3 className="text-lg sm:text-xl font-bold text-midnight dark:text-white mb-2 leading-tight">
                        {service.nom}
                      </h3>
                      <p className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 flex-grow">
                        {service.description}
                      </p>

                      {/* Top features */}
                      <div className="space-y-1.5 mb-4">
                        {service.features.filter(f => f.included).slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-300">
                            <BadgeCheck className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                            {f.name}
                          </div>
                        ))}
                        {service.features.filter(f => f.included).length > 3 && (
                          <a href={`/dev-services/${service.slug}`} className="text-[10px] font-bold text-midnight dark:text-white hover:text-gold transition-colors underline underline-offset-2">
                            + {service.features.filter(f => f.included).length - 3} fonctionnalités →
                          </a>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="space-y-2 mt-auto pt-4 border-t border-gray-200 dark:border-gray-600">
                        <a
                          href={`/dev-services/${service.slug}`}
                          className="w-full bg-gradient-to-r from-midnight to-blue-900 hover:from-blue-900 hover:to-midnight text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md hover:shadow-lg"
                        >
                          Voir le service <ArrowRight className="w-4 h-4 text-gold" />
                        </a>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleWhatsAppDevis(service.nom)}
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-midnight dark:text-white transition-colors active:scale-[0.98]"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Devis
                          </button>
                          <button
                            onClick={() => window.location.assign(`/submit-dossier?offerSlug=${service.slug}&offerName=${encodeURIComponent(service.nom)}&offerType=tech`)}
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-gold to-yellow-400 text-midnight transition-all active:scale-[0.98] shadow-sm hover:shadow-md"
                          >
                            <FileText className="w-3.5 h-3.5" /> Dossier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Package CTA */}
              <div className="mt-10 p-5 sm:p-8 bg-gradient-to-br from-midnight via-blue-900 to-midnight rounded-[20px] text-white text-center relative overflow-hidden border-2 border-gold/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none" />
                <div className="relative">
                  <Layers className="w-8 h-8 text-gold mx-auto mb-3" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Besoin d'un package complet ?</h3>
                  <p className="text-gray-200 text-sm mb-5 max-w-md mx-auto">
                    Combinez Présence Digitale + Développement Tech pour une offre intégrée avec remise spéciale.
                  </p>
                  <button
                    onClick={handleWhatsAppHelp}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-400 text-midnight px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:shadow-gold/30 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Discuter d'un package
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PROCESSUS
      ════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-midnight dark:text-white mb-2">Comment on travaille</h2>
            <div className="w-16 h-1 bg-gold mx-auto rounded-full mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Simple, transparent, efficace.</p>
          </div>

          {/* Desktop: horizontal steps with connecting lines */}
          <div className="hidden sm:grid grid-cols-4 gap-0 relative">
            <div className="absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-midnight via-gold to-midnight opacity-30" />
            {STEPS.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center px-4">
                <div className={`relative w-12 h-12 bg-gradient-to-br from-midnight to-blue-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <item.icon className="w-5 h-5 text-white" />
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-gold to-yellow-400 text-midnight rounded-full flex items-center justify-center text-[10px] font-black shadow">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-midnight dark:text-white mb-1">{item.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile: compact 2x2 grid */}
          <div className="sm:hidden grid grid-cols-2 gap-3">
            {STEPS.map((item) => (
              <div key={item.step} className="flex gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-9 h-9 bg-gradient-to-br from-midnight to-blue-900 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm">
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-gold uppercase tracking-widest block">{item.step}</span>
                  <h3 className="text-xs font-bold text-midnight dark:text-white leading-tight">{item.title}</h3>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          FAQ CONTEXTUELLE
      ════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-midnight dark:text-white mb-2">Questions fréquentes</h2>
            <div className="w-16 h-1 bg-gold mx-auto rounded-full mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {activeCategory === 'presence' ? 'Sur les packs Présence Digitale' : 'Sur le Développement Tech'}
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-[16px] border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-sm font-bold text-midnight dark:text-white pr-3 leading-snug">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gold flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-3">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA FINAL — Multi-canal
      ════════════════════════════════════════════ */}
      <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-midnight via-blue-900 to-midnight dark:from-black dark:via-gray-900 dark:to-black mb-16 md:mb-0 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 right-10 w-40 h-40 md:w-64 md:h-64 bg-gold rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-32 h-32 md:w-48 md:h-48 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="w-16 h-16 bg-gold/20 backdrop-blur-sm border-2 border-gold/40 rounded-full flex items-center justify-center mx-auto mb-5">
            <HeartHandshake className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">Besoin d'aide pour choisir ?</h2>
          <div className="w-16 h-1 bg-gold mx-auto rounded-full mb-4" />
          <p className="text-gray-200 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Notre équipe vous guide gratuitement. Consultation sans engagement, réponse en moins de 2 heures.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleWhatsAppHelp}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-yellow-400 text-midnight px-6 py-3.5 rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl hover:shadow-gold/30 active:scale-95 transition-all"
            >
              <MessageCircle className="w-5 h-5" /> Chatter sur WhatsApp
            </button>
            <button
              onClick={handleBookCall}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border-2 border-gold/40 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 backdrop-blur-sm"
            >
              <Calendar className="w-5 h-5 text-gold" /> Prendre rendez-vous
            </button>
            <button
              onClick={handlePhoneCall}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border-2 border-gold/40 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 backdrop-blur-sm sm:hidden"
            >
              <Phone className="w-5 h-5 text-gold" /> Appeler
            </button>
          </div>
          <p className="text-gray-300/60 text-xs mt-4">Aucun engagement · Réponse rapide · 100% gratuit</p>
        </div>
      </section>

      {/* Floating WhatsApp (mobile) */}
      <div className="fixed bottom-20 right-3 z-40 md:hidden">
        <button
          onClick={handleWhatsAppHelp}
          className="flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-400 text-midnight px-4 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_20px_rgba(255,215,0,0.4)] active:scale-95 transition-all"
        >
          <MessageCircle className="w-5 h-5" /> Aide
        </button>
      </div>

      <PopupDisplay currentPage="offres" />
    </div>
  );
};

export default Offres;
