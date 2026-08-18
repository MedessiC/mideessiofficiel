import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import SEO from '../components/SEO';

type ProductDefinition = {
  name: string;
  category: string;
  headline: string;
  subtitle: string;
  image: string;
  price: string;
  accessPrice: string;
  accessInstallment: string;
  cta: string;
  isDark?: boolean;
  stories: { text: string; image: string }[];
  projects?: { name: string; detail: string; image: string }[];
  otherSolutions: { name: string; description: string; href: string }[];
};

const siteVitrineProduct: ProductDefinition = {
  name: 'Site Vitrine',
  category: 'Services / Site Vitrine',
  headline: 'Le site qui vous présente au monde.',
  subtitle: 'Un site vitrine pour être trouvé facilement, n\'importe où dans le monde par n\'importe qui.',
  image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
  price: '75 000 FCFA',
  accessPrice: '26 000 FCFA',
  accessInstallment: '× 3 mois',
  cta: 'Commander',
  isDark: false,
  stories: [
    {
      text: 'Une intelligence artificielle m’a recommandé votre entreprise.',
      image: '/avis1_site_vitrine.webp',
    },
    {
      text: 'J’ai compris vos services avant même de me déplacer.',
      image: '/avis2_site_vitrine.webp',
    },
    {
      text: 'Votre site m’a donné confiance immédiatement.',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    },
  ],
  otherSolutions: [
    { name: 'Site E-Commerce', description: 'Vendez vos produits en ligne 24h/24.', href: '/siteweb/e-commerce' },
    { name: 'Application Web', description: 'Centralisez et automatisez votre gestion.', href: '/siteweb/application-web' },
    { name: 'Application Mobile', description: 'Vos services directement sur smartphone.', href: '/siteweb/application-mobile' },
  ],
};

const siteECommerceProduct: ProductDefinition = {
  name: 'Site E-Commerce',
  category: 'Services / Site E-Commerce',
  headline: 'Votre boutique ouverte 24h/24 et 7j/7.',
  subtitle: 'Vendez vos produits en toute simplicité, encaissez par Mobile Money (MTN, Moov, Wave) et carte bancaire sans interruption.',
  image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  price: '150 000 FCFA',
  accessPrice: '50 000 FCFA',
  accessInstallment: '× 3 mois',
  cta: 'Commander',
  isDark: true,
  stories: [
    {
      text: 'Mes clients au Bénin et dans la sous-région payent par Mobile Money même à 2h du matin.',
      image: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=900&q=80',
    },
    {
      text: 'Le catalogue produit et la gestion automatique des stocks m’ont fait gagner un temps précieux.',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    },
    {
      text: 'Mes ventes en ligne dépassent désormais les commandes physiques.',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80',
    },
  ],
  projects: [
    {
      name: 'AfriqShop',
      detail: 'Mode & Produits locaux',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Kado Express',
      detail: 'E-commerce de coffrets & livraisons',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Bénin Market',
      detail: 'Vente en ligne & Paiement Mobile Money',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  otherSolutions: [
    { name: 'Site Vitrine', description: 'Présentez votre entreprise.', href: '/siteweb/vitrine' },
    { name: 'Application Web', description: 'Centralisez votre activité.', href: '/siteweb/application-web' },
    { name: 'Application Mobile', description: 'Un service dans la poche.', href: '/siteweb/application-mobile' },
  ],
};

const applicationWebProduct: ProductDefinition = {
  name: 'Application Web',
  category: 'Services / Application Web',
  headline: 'Digitalisez et automatisez votre activité.',
  subtitle: 'Plateforme sur mesure, espace client sécurisé et outils de gestion adaptés aux besoins uniques de votre entreprise.',
  image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  price: '250 000 FCFA',
  accessPrice: 'ACCÈS',
  accessInstallment: 'Sur mesure',
  cta: 'Commander',
  isDark: false,
  stories: [
    {
      text: 'Nos équipes gèrent leurs tâches et dossiers en temps réel sans perdre de temps.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    },
    {
      text: 'L’espace client automatisé a réduit nos appels de support de 80%.',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=80',
    },
  ],
  projects: [
    {
      name: 'Sira Portal',
      detail: 'Gestion de dossiers & espace client',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'OmniFlow',
      detail: 'Automatisations & tableaux de bord',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  otherSolutions: [
    { name: 'Site Vitrine', description: 'Présentez votre entreprise.', href: '/siteweb/vitrine' },
    { name: 'Site E-Commerce', description: 'Vendez vos produits en ligne.', href: '/siteweb/e-commerce' },
    { name: 'Application Mobile', description: 'Un service dans la poche.', href: '/siteweb/application-mobile' },
  ],
};

const applicationMobileProduct: ProductDefinition = {
  name: 'Application Mobile',
  category: 'Services / Application Mobile',
  headline: 'Votre service directement dans la poche de vos clients.',
  subtitle: 'Une application fluide, rapide et installable sur iOS et Android pour offrir une expérience sans égale.',
  image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  price: 'Sur devis',
  accessPrice: 'SUR DEVIS',
  accessInstallment: 'Sur mesure',
  cta: 'Commander',
  isDark: true,
  stories: [
    {
      text: 'Nos utilisateurs accèdent à nos services d’un simple clic sur leur téléphone.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80',
    },
  ],
  projects: [
    {
      name: 'PassMobile',
      detail: 'App mobile iOS & Android',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  otherSolutions: [
    { name: 'Site Vitrine', description: 'Présentez votre entreprise.', href: '/siteweb/vitrine' },
    { name: 'Site E-Commerce', description: 'Vendez vos produits en ligne.', href: '/siteweb/e-commerce' },
    { name: 'Application Web', description: 'Centralisez votre activité.', href: '/siteweb/application-web' },
  ],
};

const automatisationIAProduct: ProductDefinition = {
  name: 'Automatisation & IA',
  category: 'Services / Automatisation & IA',
  headline: 'Éliminez le travail répétitif. Gagnez du temps.',
  subtitle: 'Workflows automatisés, intégration d’outils IA et synchronisation de données pour libérer votre temps et décupler la productivité de votre entreprise.',
  image: '/autoia.webp',
  price: '100 000 FCFA',
  accessPrice: '35 000 FCFA',
  accessInstallment: '× 3 mois',
  cta: 'Commander',
  isDark: true,
  stories: [
    {
      text: 'L’automatisation de notre facturation et de la relance WhatsApp nous fait gagner 8 heures par semaine.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    },
    {
      text: 'L’assistant IA qualifie nos prospects automatiquement avant de passer la hand à nos commerciaux.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    },
  ],
  projects: [
    {
      name: 'FlowAuto CRM',
      detail: 'Relances WhatsApp & qualification automatique',
      image: '/autoia.webp',
    },
    {
      name: 'DocAI Parser',
      detail: 'Extraction & classement automatique de factures',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  otherSolutions: [
    { name: 'Site Web & Applications', description: 'Sites vitrines et e-commerce.', href: '/siteweb' },
    { name: 'Réseaux Sociaux', description: 'Engagement et croissance digitale.', href: '/solutions/reseaux-sociaux' },
    { name: 'Couverture Événementielle', description: 'Captation et présence sur scène.', href: '/solutions/couverture-evenementielle' },
  ],
};

const reseauxSociauxProduct: ProductDefinition = {
  name: 'Réseaux Sociaux',
  category: 'Services / Réseaux Sociaux',
  headline: 'Faites briller votre marque et captivez votre audience.',
  subtitle: 'Création de visuels professionnels, vidéos courtes, stratégie de publication et animation de communauté sur Facebook, Instagram, LinkedIn et TikTok.',
  image: '/greseaux.webp',
  price: '50 000 FCFA / mois',
  accessPrice: '50 000 FCFA',
  accessInstallment: '/ mois',
  cta: 'Commander',
  isDark: false,
  stories: [
    {
      text: 'Notre communauté a triplé en 3 mois et nous recevons des demandes de devis chaque jour sur Instagram.',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=900&q=80',
    },
    {
      text: 'La qualité des visuels et des vidéos publiées a totalement transformé l’image de notre marque.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    },
  ],
  projects: [
    {
      name: 'Campagne Brand+',
      detail: 'Création de contenus & Reels pour marque locale',
      image: '/greseaux.webp',
    },
    {
      name: 'Growth Social',
      detail: 'Gestion de communauté & réponse aux abonnés',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  otherSolutions: [
    { name: 'Site Web & Applications', description: 'Sites vitrines et e-commerce.', href: '/siteweb' },
    { name: 'Automatisation & IA', description: 'Optimisez vos processus métier.', href: '/solutions/automatisation-ia' },
    { name: 'Couverture Événementielle', description: 'Captation et présence sur scène.', href: '/solutions/couverture-evenementielle' },
  ],
};

const couvertureEvenementielleProduct: ProductDefinition = {
  name: 'Couverture Événementielle',
  category: 'Services / Couverture Événementielle',
  headline: 'Immortalisez vos événements avec une qualité studio.',
  subtitle: 'Captation vidéo HD, photographie professionnelle, retransmission en direct et diffusion de vos temps forts sur scène et sur les réseaux.',
  image: '/cevent.webp',
  price: '120 000 FCFA',
  accessPrice: '120 000 FCFA',
  accessInstallment: 'par événement',
  cta: 'Commander',
  isDark: true,
  stories: [
    {
      text: 'La vidéo aftermovie de notre conférence a fait un carton sur LinkedIn et YouTube.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
    },
    {
      text: 'Une équipe réactive sur le terrain qui a couvert tout notre forum avec un professionnalisme irréprochable.',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=80',
    },
  ],
  projects: [
    {
      name: 'Forum Tech Cotonou',
      detail: 'Captation photo/vidéo & diffusion en direct',
      image: '/cevent.webp',
    },
    {
      name: 'Gala d’Entreprise',
      detail: 'Film récapitulatif Aftermovie & shooting photo',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  otherSolutions: [
    { name: 'Site Web & Applications', description: 'Sites vitrines et e-commerce.', href: '/siteweb' },
    { name: 'Automatisation & IA', description: 'Optimisez vos processus métier.', href: '/solutions/automatisation-ia' },
    { name: 'Réseaux Sociaux', description: 'Engagement et croissance digitale.', href: '/solutions/reseaux-sociaux' },
  ],
};

const productCatalog: Record<string, ProductDefinition> = {
  'site-vitrine': siteVitrineProduct,
  'site-e-commerce': siteECommerceProduct,
  'application-web': applicationWebProduct,
  'application-mobile': applicationMobileProduct,
  'automatisation-ia': automatisationIAProduct,
  'reseaux-sociaux': reseauxSociauxProduct,
  'couverture-evenementielle': couvertureEvenementielleProduct,
  vitrine: siteVitrineProduct,
  'e-commerce': siteECommerceProduct,
  automatisation: automatisationIAProduct,
  evenements: couvertureEvenementielleProduct,
};

const slugAliases: Record<string, string> = {
  vitrine: 'site-vitrine',
  'e-commerce': 'site-e-commerce',
  'application-web': 'application-web',
  'application-mobile': 'application-mobile',
  automatisation: 'automatisation-ia',
  'automatisation-ia': 'automatisation-ia',
  'reseaux-sociaux': 'reseaux-sociaux',
  'couverture-evenementielle': 'couverture-evenementielle',
  evenements: 'couverture-evenementielle',
};

const SolutionDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const resolvedSlug = slug ? slugAliases[slug] ?? slug : null;
  const product = resolvedSlug ? productCatalog[resolvedSlug] : null;

  const [activeStory, setActiveStory] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    if (slug && !productCatalog[resolvedSlug ?? slug]) {
      navigate('/siteweb');
    }
  }, [slug, resolvedSlug, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 120);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || !product || product.stories.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveStory((prev) => (prev + 1) % product.stories.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isAutoPlaying, product]);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 pt-24">
        <h1 className="text-3xl font-bold tracking-[-0.06em] text-[#191970]">Produit introuvable</h1>
      </div>
    );
  }

  const isDark = product.isDark ?? false;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0B0F17] text-white' : 'bg-[#FAFAFA] text-[#111111]'}`}>
      <SEO title={`${product.name} — MIDEESSI`} description={product.headline} />

      {/* ── Sticky Top Bar ── */}
      {showStickyBar && (
        <div
          className={`sticky top-[72px] z-40 mx-auto mt-2 w-[calc(100%-1rem)] max-w-[1200px] rounded-[20px] border px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-6 lg:px-8 transition-all ${
            isDark
              ? 'border-slate-700/80 bg-[#0F172A]/80 text-white'
              : 'border-white/20 bg-white/55 text-[#191970]'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${isDark ? 'text-white' : 'text-[#191970]'} sm:text-[13px]`}>
              {product.name}
            </div>

            <Link
              to="/contact"
              className={`inline-flex min-h-[42px] items-center justify-center rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition ${
                isDark
                  ? 'bg-[#FFD700] text-[#0F172A] hover:bg-yellow-400'
                  : 'bg-[#191970] text-white hover:bg-[#141560]'
              }`}
            >
              Commander
            </Link>
          </div>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section className="mx-auto max-w-[1200px] px-4 pb-8 pt-24 sm:px-6 lg:px-12">
        <div className={`text-[11px] font-bold uppercase tracking-[0.14em] ${isDark ? 'text-[#FFD700]' : 'text-[#8E9AB4]'}`}>
          {product.category}
        </div>

        <div className="mt-8 hidden items-center gap-8 lg:grid lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <h1 className={`max-w-[650px] text-[38px] font-black leading-[0.96] tracking-[-0.07em] ${isDark ? 'text-white' : 'text-[#111111]'} sm:text-[52px] lg:text-[64px]`}>
              {product.headline}
            </h1>

            <p className={`mt-5 max-w-[520px] text-[17px] leading-relaxed ${isDark ? 'text-[#8E9AB4]' : 'text-[#8E9AB4]'}`}>
              {product.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact"
                className={`inline-flex min-h-[48px] items-center justify-center rounded-xl px-6 py-3 text-[11px] font-bold uppercase tracking-[0.1em] transition ${
                  isDark
                    ? 'bg-[#FFD700] text-[#0F172A] hover:bg-yellow-400 shadow-md'
                    : 'bg-[#191970] text-white hover:bg-[#141560]'
                }`}
              >
                Commander maintenant
              </Link>
              <a
                href="#exemples"
                className={`inline-flex min-h-[48px] items-center justify-center rounded-xl border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] transition ${
                  isDark
                    ? 'border-white/30 bg-transparent text-white hover:bg-white/10'
                    : 'border-[#191970]/30 bg-transparent text-[#191970] hover:bg-white'
                }`}
              >
                Voir un exemple
              </a>
            </div>
          </div>

          {/* Interactive Mockup Frame */}
          <div className="relative min-h-[300px]">
            <div className={`absolute left-[-18px] top-8 h-[220px] w-[220px] rounded-[28px] ${isDark ? 'bg-indigo-900/30' : 'bg-[#eef0f8]'} blur-2xl`} />
            <div className={`absolute right-0 top-3 h-[220px] w-[220px] rounded-[28px] ${isDark ? 'bg-amber-900/20' : 'bg-[#ece9e4]'} blur-2xl`} />

            <div className={`relative mx-auto -mt-10 h-[260px] w-[68%] max-w-[510px] rounded-[28px] border-[3px] ${
              isDark ? 'border-slate-700 bg-[#0F172A] shadow-2xl' : 'border-[#191970]/20 bg-white shadow-[0_20px_40px_rgba(25,25,112,0.08)]'
            }`}>
              <div className={`absolute left-1/2 top-4 h-3 w-24 -translate-x-1/2 rounded-full ${isDark ? 'bg-white/20' : 'bg-[#191970]/10'}`} />
              <div className={`absolute inset-x-6 top-8 bottom-6 rounded-[22px] ${isDark ? 'bg-white/5' : 'bg-[#191970]/4'} p-4`}>
                <div className={`flex h-full flex-col justify-between rounded-[18px] p-4 ${
                  isDark ? 'bg-slate-900/90 text-white shadow-inner' : 'bg-white/80 shadow-[inset_0_0_0_1px_rgba(25,25,112,0.06)]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${isDark ? 'bg-slate-600' : 'bg-[#8E9AB4]/40'}`} />
                      <span className={`h-2.5 w-2.5 rounded-full ${isDark ? 'bg-slate-600' : 'bg-[#8E9AB4]/40'}`} />
                      <span className={`h-2.5 w-2.5 rounded-full ${isDark ? 'bg-slate-600' : 'bg-[#8E9AB4]/40'}`} />
                    </div>
                    <div className={`h-6 w-16 rounded-full ${isDark ? 'bg-[#FFD700]/20' : 'bg-[#191970]/10'}`} />
                  </div>

                  <div className="space-y-4 pt-3">
                    <div className={`h-5 w-28 rounded-full ${isDark ? 'bg-white/10' : 'bg-[#191970]/6'}`} />
                    <div className={`h-8 w-4/5 rounded-full ${isDark ? 'bg-[#FFD700]/30' : 'bg-[#191970]/8'}`} />
                    <div className="grid grid-cols-3 gap-3">
                      <div className={`h-20 rounded-[16px] ${isDark ? 'bg-slate-800' : 'bg-[#f3f4f6]'}`} />
                      <div className={`h-20 rounded-[16px] ${isDark ? 'bg-slate-800' : 'bg-[#f3f4f6]'}`} />
                      <div className={`h-20 rounded-[16px] ${isDark ? 'bg-slate-800' : 'bg-[#f3f4f6]'}`} />
                    </div>
                    <div className={`h-24 rounded-[18px] ${isDark ? 'bg-gradient-to-br from-slate-800 to-indigo-950' : 'bg-gradient-to-br from-[#f3f4f6] to-[#eef0f8]'}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className={`absolute -bottom-2 right-2 h-[150px] w-[118px] rounded-[24px] border-[3px] ${
              isDark ? 'border-slate-700 bg-[#0F172A]' : 'border-[#191970]/20 bg-white'
            } shadow-2xl`}>
              <div className={`absolute left-1/2 top-3 h-2 w-10 -translate-x-1/2 rounded-full ${isDark ? 'bg-white/20' : 'bg-[#191970]/10'}`} />
              <div className={`absolute inset-x-3 top-8 bottom-4 rounded-[16px] ${isDark ? 'bg-slate-900/90' : 'bg-white/80'} p-3`}>
                <div className={`h-4 w-12 rounded-full ${isDark ? 'bg-white/20' : 'bg-[#191970]/10'}`} />
                <div className={`mt-3 h-16 rounded-[12px] ${isDark ? 'bg-slate-800' : 'bg-[#f3f4f6]'}`} />
                <div className={`mt-3 h-10 rounded-[10px] ${isDark ? 'bg-[#FFD700]/30' : 'bg-[#191970]/10'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header Card */}
        <div className={`mt-6 rounded-[28px] border p-6 shadow-lg lg:hidden ${
          isDark ? 'border-slate-800 bg-[#0F172A] text-white' : 'border-[#191970]/10 bg-white text-[#111111]'
        }`}>
          <div className="text-center">
            <h1 className="text-[30px] font-black leading-[0.98] tracking-[-0.07em]">
              {product.headline}
            </h1>

            <p className={`mt-3 text-[14px] leading-relaxed ${isDark ? 'text-[#8E9AB4]' : 'text-[#8E9AB4]'}`}>
              {product.subtitle}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/contact"
              className={`inline-flex min-h-[48px] items-center justify-center rounded-xl px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] transition ${
                isDark ? 'bg-[#FFD700] text-[#0F172A] hover:bg-yellow-400' : 'bg-[#191970] text-white hover:bg-[#141560]'
              }`}
            >
              Commander maintenant
            </Link>
            <a
              href="#exemples"
              className={`inline-flex min-h-[48px] items-center justify-center rounded-xl border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] transition ${
                isDark ? 'border-white/30 text-white' : 'border-[#191970]/30 text-[#191970]'
              }`}
            >
              Voir un exemple
            </a>
          </div>
        </div>

        {/* ── ACCÈS Payment Card ── */}
        <div className={`mt-8 rounded-[28px] border px-6 py-8 shadow-xl sm:px-8 lg:px-10 ${
          isDark
            ? 'border-slate-800 bg-[#0F172A] text-white'
            : 'border-[#191970]/10 bg-white text-[#191970]'
        }`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[540px]">
              <div className={`text-[12px] font-bold uppercase tracking-[0.14em] ${isDark ? 'text-[#FFD700]' : 'text-[#8E9AB4]'}`}>
                Commencez aujourd&apos;hui.
              </div>
              <h2 className="mt-2 text-[28px] font-black leading-[1] tracking-[-0.06em] sm:text-[36px] text-[#111111]">
                Payez progressivement.
              </h2>
              <p className={`mt-3 max-w-[440px] text-[15px] leading-relaxed ${isDark ? 'text-[#8E9AB4]' : 'text-[#8E9AB4]'}`}>
                Avec l&apos;offre ACCÈS, échelonnez votre règlement en 3 tranches sans stress et lancez votre projet dès maintenant.
              </p>
            </div>

            <div className="flex items-center gap-4 lg:justify-end">
              <div className={`rounded-[22px] border px-5 py-4 text-center ${
                isDark ? 'border-slate-700 bg-slate-900 text-white' : 'border-[#191970]/10 bg-[#FAFAFA] text-[#191970]'
              }`}>
                <div className={`text-[10px] font-bold uppercase tracking-[0.18em] ${isDark ? 'text-[#FFD700]' : 'text-[#8E9AB4]'}`}>
                  TARIF
                </div>
                <div className="mt-2 text-[26px] font-black tracking-[-0.06em]">
                  {product.accessPrice}
                </div>
                <div className={`mt-1 text-[13px] ${isDark ? 'text-[#8E9AB4]' : 'text-[#8E9AB4]'}`}>
                  {product.accessInstallment}
                </div>
              </div>

              <Link
                to="/contact"
                className={`inline-flex min-h-[52px] items-center justify-center rounded-[18px] px-6 py-3 text-[14px] font-bold transition ${
                  isDark ? 'bg-[#FFD700] text-[#0F172A] hover:bg-yellow-400' : 'bg-[#191970] text-white hover:bg-[#141560]'
                }`}
              >
                Commander
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stories / Testimonials Carousel ── */}
      {product.stories.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-12">
          <div className="mb-8 text-center">
            <div className={`text-[11px] font-bold uppercase tracking-[0.16em] ${isDark ? 'text-[#8E9AB4]' : 'text-[#8E9AB4]'}`}>
              Témoignages &amp; REX
            </div>
            <h2 className={`mt-3 text-[32px] font-black tracking-[-0.06em] sm:text-[42px] ${isDark ? 'text-white' : 'text-[#111111]'}`}>
              Ce qu&apos;ils diront de vous
            </h2>
          </div>

          <div className="relative overflow-hidden bg-transparent">
            <button
              type="button"
              onClick={() => {
                setActiveStory((prev) => (prev - 1 + product.stories.length) % product.stories.length);
                setIsAutoPlaying(false);
              }}
              className={`absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-md md:left-6 ${
                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-[#191970]/15 bg-white text-[#191970]'
              }`}
              aria-label="Précédent"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveStory((prev) => (prev + 1) % product.stories.length);
                setIsAutoPlaying(false);
              }}
              className={`absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-md md:right-6 ${
                isDark ? 'border-amber-400 bg-[#FFD700] text-[#0F172A]' : 'border-[#191970]/15 bg-[#191970] text-white'
              }`}
              aria-label="Suivant"
            >
              <ArrowRight className="h-4 w-4" />
            </button>

            {product.stories.map((story, index) => (
              <div
                key={story.text}
                className={`transition-opacity duration-500 ${index === activeStory ? 'block opacity-100' : 'hidden opacity-0'}`}
              >
                <div className="flex min-h-[120px] items-start justify-center px-10 md:px-16">
                  <div className={`text-[26px] leading-none ${isDark ? 'text-[#FFD700]' : 'text-[#191970]'}`}>&ldquo;</div>
                  <p className={`ml-2 max-w-[680px] text-center text-[18px] font-medium leading-snug tracking-[-0.04em] md:text-[24px] ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                    {story.text}
                  </p>
                </div>

                <div className="mx-auto -mt-2 max-w-[680px] md:-mt-3">
                  <img
                    src={story.image}
                    alt={story.text}
                    className="w-full rounded-2xl object-contain object-center max-h-[420px] md:max-h-[480px]"
                  />
                </div>
              </div>
            ))}

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-sm ${
                  isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-[#191970]/10 bg-white text-[#191970]'
                }`}
                aria-label={isAutoPlaying ? 'Pause le diaporama' : 'Lecture du diaporama'}
              >
                {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>

              <div className="flex items-center gap-2">
                {product.stories.map((story, index) => (
                  <button
                    key={`${story.text}-dot`}
                    type="button"
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      index === activeStory
                        ? (isDark ? 'bg-[#FFD700]' : 'bg-[#191970]')
                        : (isDark ? 'bg-slate-700' : 'bg-[#8E9AB4]/40')
                    }`}
                    aria-label={`Afficher le témoignage ${index + 1}`}
                    onClick={() => {
                      setActiveStory(index);
                      setIsAutoPlaying(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Réalisations / Examples Section ── */}
      {product.projects && product.projects.length > 0 && (
        <section id="exemples" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6 lg:px-12">
          <div className="mb-8 text-center">
            <div className={`text-[11px] font-bold uppercase tracking-[0.16em] ${isDark ? 'text-[#8E9AB4]' : 'text-[#8E9AB4]'}`}>Réalisations</div>
            <h2 className={`mt-3 text-[32px] font-black tracking-[-0.06em] sm:text-[42px] ${isDark ? 'text-white' : 'text-[#111111]'}`}>
              Quelques exemples
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {product.projects.map((project) => (
              <article
                key={project.name}
                className={`overflow-hidden rounded-[28px] border transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'border-slate-800 bg-[#0F172A] text-white shadow-xl'
                    : 'border-[#191970]/10 bg-white text-[#111111] shadow-sm'
                }`}
              >
                <img src={project.image} alt={project.name} className="h-[240px] w-full object-cover" />
                <div className="p-6">
                  <h3 className="text-[22px] font-bold tracking-tight text-[#111111]">{project.name}</h3>
                  <p className={`mt-2 text-sm ${isDark ? 'text-[#8E9AB4]' : 'text-[#8E9AB4]'}`}>{project.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── Other Solutions Grid ── */}
      <section className="mx-auto max-w-[1200px] px-4 pb-20 sm:px-6 lg:px-12">
        <div className={`rounded-[32px] border p-6 sm:p-10 ${
          isDark ? 'border-slate-800 bg-[#0F172A] text-white' : 'border-[#191970]/10 bg-white text-[#111111]'
        }`}>
          <div className="mb-6 text-center sm:text-left">
            <div className={`text-[11px] font-bold uppercase tracking-[0.16em] ${isDark ? 'text-[#FFD700]' : 'text-[#8E9AB4]'}`}>
              Découvrez la gamme
            </div>
            <h2 className="mt-2 text-[30px] font-black tracking-[-0.06em] sm:text-[38px] text-[#111111]">
              Ce n&apos;est pas exactement ce qu&apos;il vous faut&nbsp;?
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {product.otherSolutions.map((service) => (
              <Link
                key={service.name}
                to={service.href}
                className={`group rounded-[24px] border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'border-slate-700/80 bg-slate-900/80 text-white hover:border-[#FFD700]'
                    : 'border-[#191970]/10 bg-[#FAFAFA] text-[#111111] hover:border-[#191970]/30'
                }`}
              >
                <div className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDark ? 'text-[#FFD700]' : 'text-[#8E9AB4]'}`}>
                  MIDEESSI
                </div>
                <h3 className="mt-3 text-[22px] font-bold tracking-tight text-[#111111]">{service.name}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-[#8E9AB4]' : 'text-[#8E9AB4]'}`}>
                  {service.description}
                </p>
                <div className={`mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] ${
                  isDark ? 'text-[#FFD700]' : 'text-[#111111]'
                }`}>
                  Voir la solution &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionDetail;
