import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { getRoute } from '../utils/routes';

const About = () => {
  useEffect(() => {
    document.title = 'Notre Histoire & Philosophie — MIDEESSI';
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-scroll-reveal]');
    if (!revealItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const milestones = [
    {
      year: '2014',
      title: 'Le Fujitsu sans connexion',
      description:
        'À 9 ans, devant le vieux PC de bureau de son père à Cotonou. Pas d’accès à internet. Juste la curiosité brute d’explorer les menus, manipuler les fichiers et comprendre les rouages invisibles de la machine.',
    },
    {
      year: '2020',
      title: 'Le code sur écran de smartphone',
      description:
        'Sans ordinateur à soi, apprendre en téléchargeant des dizaines de cours et de PDF techniques. Taper ses premières lignes de code directement sur l’écran d’un téléphone. Découvrir Python et forger une certitude : la simplicité est l’arme des outils durables.',
    },
    {
      year: 'Aujourd’hui',
      title: 'MIDEESSI & Le standard local',
      description:
        'Coovi Medessi et Zinvo Anguilet Basthios Richy unissent leurs forces dans MIDEESSI TECH SARL. Une volonté commune : refuser le travail bâclé et offrir aux entreprises et créateurs béninois des technologies taillées au millimètre.',
    },
  ];

  const rules = [
    {
      index: '01',
      title: 'La recherche assise',
      headline: 'Le terrain dicte le code, jamais l’inverse.',
      text: 'Nous refusons l’innovation hors-sol. Avant de concevoir, nous partons des contraintes réelles du quotidien : commerçants, artisans, entrepreneurs. Nous résolvons des frictions concrètes par des outils simples.',
    },
    {
      index: '02',
      title: 'Le culte du millimètre',
      headline: 'La simplicité n’est pas le vide. C’est la précision.',
      text: 'Chaque espacement, chaque contraste, chaque interaction et chaque phrase a une raison d’exister. Nous définissons une esthétique sobre, soignée et digne, propre à notre identité.',
    },
    {
      index: '03',
      title: 'L’accessibilité sans concession',
      headline: 'Un tarif juste n’est pas un travail au rabais.',
      text: 'Permettre à un commerce béninois d’obtenir son site web avec des facilités de paiement échelonné lève la barrière financière. Mais la qualité technique et visuelle livrée rivalise avec les meilleurs standards.',
    },
  ];

  return (
    <div style={{ backgroundColor: '#FAFAFA' }} className="text-[#111111] dark:text-gray-100 min-h-screen">
      <SEO
        title="Notre Histoire & Philosophie — MIDEESSI"
        description="L'histoire de MIDEESSI : créer des solutions numériques utiles, naturelles et concrètes, 100% pensées pour les réalités du Bénin."
      />

      <style>{`
        [data-scroll-reveal] {
          opacity: 0;
          transform: translate3d(0, 18px, 0);
          transition: opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }

        [data-scroll-reveal].is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-scroll-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      {/* ── SECTION 1 : MANIFESTE HERO (MOBILE-OPTIMIZED) ── */}
      <section className="pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280] dark:text-gray-400 mb-3">
              MIDEESSI TECH SARL — Cotonou, Bénin
            </p>
            <div className="w-10 sm:w-12 h-0.5 mb-6 sm:mb-8 bg-[#E5E7EB] dark:bg-gray-700" />

            <h1
              className="font-bold tracking-tight text-[#191970] dark:text-white mb-6 sm:mb-8 text-[32px] sm:text-[44px] md:text-[56px] leading-[1.08] sm:leading-[1.06]"
              style={{ letterSpacing: '-0.03em' }}
            >
              Créer l'utile.
              <br />
              Le naturel.
              <br />
              Le concret.
            </h1>

            <div className="space-y-4 text-[15px] sm:text-base md:text-lg leading-[1.7] text-[#4B5563] dark:text-gray-300">
              <p>
                Nous ne cherchons pas à inventer une énième application prétendument révolutionnaire ni des interfaces déconnectées de nos réalités.
              </p>
              <p>
                Chez MIDEESSI, notre conviction est simple : la technologie n'a de valeur que si elle résout un vrai problème au quotidien. Nous construisons des outils numériques pensés de bout en bout pour nos réalités béninoises, avec une exigence de clarté, d'accessibilité et de solidité.
              </p>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 pt-1">
                En 2026, avoir un site web propre ou un outil de gestion fiable ne doit plus être un luxe réservé à une minorité. Rendre la technologie accessible, c'est se donner les moyens d'en être les créateurs et d'imposer nos propres standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SÉPARATEUR ÉPURÉ */}
      <div className="mx-auto h-[16px] sm:h-[20px] w-full bg-white dark:bg-gray-900" />

      {/* ── SECTION 2 : L'ORIGINE DU NOM (LA BASCULE) ── */}
      <section
        data-scroll-reveal
        style={{ backgroundColor: '#191970' }}
        className="text-white py-14 sm:py-20 lg:py-24"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-start">
            
            {/* Bloc Linguistique */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/15 pb-8 sm:pb-10 lg:pb-0 lg:pr-12">
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-5 sm:mb-6">
                Origine du nom
              </p>

              <div className="space-y-6">
                <div>
                  <p className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-white/50 mb-1">
                    En langue Fon (Singulier)
                  </p>
                  <p className="text-2xl sm:text-3xl font-light text-white">
                    Medessi
                  </p>
                  <p className="text-sm text-white/65 mt-1 font-normal">
                    « Être indépendant »
                  </p>
                </div>

                <div className="w-8 h-px bg-white/20" />

                <div>
                  <p className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-white/50 mb-1">
                    Le collectif (MIDEESSI)
                  </p>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                    MIDEESSI
                  </p>
                  <p className="text-sm sm:text-base text-white/85 mt-1.5 font-medium">
                    « Nous sommes indépendants »
                  </p>
                </div>
              </div>
            </div>

            {/* Bloc Philosophie */}
            <div className="lg:col-span-7 space-y-4 text-[15px] sm:text-base md:text-lg leading-[1.75] text-white/85">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                Une indépendance qui commence dans la mentalité.
              </h2>
              <p>
                Pour nous, l’indépendance n’est pas un slogan. Elle commence par refuser la facilité : cesser d’attendre que les réponses viennent d’ailleurs, et refuser ce réflexe qui consiste à coller un nom local et un motif de pagne sur une copie de solution occidentale sans réelle réflexion.
              </p>
              <p className="text-white/70 text-sm sm:text-base">
                L’indépendance technologique exige de s’asseoir, de faire des recherches sérieuses, de comprendre les contraintes du quotidien et d’exécuter avec un niveau de rigueur irréprochable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto h-[16px] sm:h-[20px] w-full bg-white dark:bg-gray-900" />

      {/* ── SECTION 3 : LE RÉCIT DES ORIGINES ── */}
      <section
        data-scroll-reveal
        style={{ backgroundColor: '#FAFAFA' }}
        className="py-14 sm:py-20 lg:py-24"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-12">
          <div className="max-w-3xl mb-10 sm:mb-12">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280] dark:text-gray-400 mb-3">
              Genèse & Parcours
            </p>
            <div className="w-10 sm:w-12 h-0.5 mb-5 sm:mb-6 bg-[#E5E7EB] dark:bg-gray-700" />
            <h2
              className="font-bold tracking-tight text-[#191970] dark:text-white text-[24px] sm:text-[32px] md:text-[40px] leading-[1.12]"
            >
              Né de la curiosité et de la persévérance.
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] dark:text-gray-400 mt-2">
              Comment une curiosité d’enfance à Cotonou a façonné notre méthode de travail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="rounded-2xl border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-800/80 p-6 sm:p-8 shadow-[0_4px_16px_rgba(15,23,42,0.02)] flex flex-col justify-between"
              >
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#191970] dark:text-white mb-2 sm:mb-3">
                    {m.year}
                  </p>
                  <h3 className="text-base sm:text-lg font-bold text-[#111111] dark:text-white mb-2">
                    {m.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4B5563] dark:text-gray-300">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto h-[16px] sm:h-[20px] w-full bg-white dark:bg-gray-900" />

      {/* ── SECTION 4 : LES FONDATEURS (PHOTO PARFAITEMENT CADRÉE SUR MOBILE) ── */}
      <section
        data-scroll-reveal
        style={{ backgroundColor: '#FFFFFF' }}
        className="py-14 sm:py-20 lg:py-24"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-12">
          
          <div className="max-w-3xl mb-8 sm:mb-10">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280] dark:text-gray-400 mb-3">
              Les Bâtisseurs
            </p>
            <div className="w-10 sm:w-12 h-0.5 mb-5 sm:mb-6 bg-[#E5E7EB] dark:bg-gray-700" />
            <h2
              className="font-bold tracking-tight text-[#191970] dark:text-white text-[24px] sm:text-[32px] md:text-[40px] leading-[1.12]"
            >
              Deux esprits. Une même rigueur.
            </h2>
          </div>

          <div className="rounded-2xl sm:rounded-[28px] border border-[#E5E7EB] dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-800/50 overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Photo avec ratio naturel 4:5 respecté à 100% — aucune déformation ni écrasement */}
              <div className="lg:col-span-6 bg-[#ECEEF4] dark:bg-gray-900 overflow-hidden flex items-center justify-center">
                <img
                  src="/les_fondateurs.webp"
                  alt="Coovi Medessi et Richy Anguilet Zinvo — Fondateurs de MIDEESSI"
                  width={4416}
                  height={5520}
                  className="w-full h-auto object-cover object-top block"
                  style={{ aspectRatio: '4 / 5' }}
                  loading="lazy"
                />
              </div>

              {/* Fiches de direction */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div className="space-y-6 sm:space-y-7">
                  <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[#6B7280] dark:text-gray-400 font-medium">
                    MIDEESSI TECH SARL — Cotonou, Bénin
                  </p>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#191970] dark:text-white">
                      Coovi Vivotin Medessi
                    </h3>
                    <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[#6B7280] dark:text-gray-400 mt-1 mb-2 font-medium">
                      Fondateur & CEO
                    </p>
                    <p className="text-sm leading-relaxed text-[#4B5563] dark:text-gray-300">
                      Autodidacte guidé par la recherche de la simplicité et de l'utilité. Il pilote la vision générale et produit de MIDEESSI TECH SARL, veillant à ce que chaque solution soit claire, accessible et ancrée dans le réel.
                    </p>
                  </div>

                  <div className="h-px w-full bg-[#E5E7EB] dark:bg-gray-700" />

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#191970] dark:text-white">
                      Zinvo Anguilet Basthios Richy
                    </h3>
                    <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[#6B7280] dark:text-gray-400 mt-1 mb-2 font-medium">
                      Cofondateur & Responsable MIDEESSI Learn
                    </p>
                    <p className="text-sm leading-relaxed text-[#4B5563] dark:text-gray-300">
                      Pilier technique et pédagogique. Il dirige le pôle d'apprentissage MIDEESSI Learn pour démocratiser les compétences numériques, tout en garantissant la solidité et la qualité d'exécution de nos technologies.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E5E7EB] dark:border-gray-700">
                  <p className="text-xs text-[#6B7280] dark:text-gray-400 leading-normal">
                    « Créer avec nos mains, penser avec notre tête, pour la fierté de notre écosystème. »
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <div className="mx-auto h-[16px] sm:h-[20px] w-full bg-white dark:bg-gray-900" />

      {/* ── SECTION 5 : LES 3 RÈGLES DE CONCEPTION (MOBILE COMPACT & NET) ── */}
      <section
        data-scroll-reveal
        style={{ backgroundColor: '#FAFAFA' }}
        className="py-14 sm:py-20 lg:py-24"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-12">
          <div className="max-w-3xl mb-8 sm:mb-12">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280] dark:text-gray-400 mb-3">
              Méthode & Rigueur
            </p>
            <div className="w-10 sm:w-12 h-0.5 mb-5 sm:mb-6 bg-[#E5E7EB] dark:bg-gray-700" />
            <h2
              className="font-bold tracking-tight text-[#191970] dark:text-white text-[24px] sm:text-[32px] md:text-[40px] leading-[1.12]"
            >
              Trois règles. Zéro compromis.
            </h2>
          </div>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.index}
                className="rounded-2xl border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-800/80 p-6 sm:p-8 shadow-[0_2px_8px_rgba(15,23,42,0.02)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-8">
                  <span className="text-2xl sm:text-3xl font-bold text-[#191970] dark:text-white shrink-0">
                    {rule.index}
                  </span>

                  <div className="flex-1 space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#111111] dark:text-white">
                      {rule.title}
                    </h3>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280] dark:text-gray-400">
                      {rule.headline}
                    </p>
                    <p className="text-sm leading-relaxed text-[#4B5563] dark:text-gray-300 pt-1">
                      {rule.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6 : CALL TO ACTION (BOUTONS TOUCH-FRIENDLY) ── */}
      <section
        data-scroll-reveal
        style={{ backgroundColor: '#FFFFFF' }}
        className="py-14 sm:py-20 lg:py-24 text-center"
      >
        <div className="max-w-[700px] mx-auto px-5 sm:px-6">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280] dark:text-gray-400 mb-3">
            Projets & Collaborations
          </p>

          <h2
            className="font-bold tracking-tight text-[#191970] dark:text-white mb-4 text-[24px] sm:text-[32px] md:text-[40px] leading-[1.15]"
          >
            Prêt à concrétiser votre présence en ligne ?
          </h2>

          <p className="text-sm sm:text-base text-[#4B5563] dark:text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
            Site vitrine, boutique e-commerce ou solution sur mesure : nous concevons des outils simples et adaptés à votre activité.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto sm:max-w-none">
            <Link
              to={getRoute.solutions()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#191970] px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:scale-105 active:scale-95 shadow-sm"
            >
              Découvrir nos solutions
              <ArrowRight size={15} />
            </Link>

            <Link
              to={getRoute.contact()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3.5 text-sm font-semibold text-[#111111] dark:text-white transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;