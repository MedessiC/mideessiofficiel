import { ArrowRight, Compass, CheckCircle2, ShieldCheck, Layers3, Sparkles, Smartphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { categories, solutions } from '../data/solutions';
import { getIcon } from '../utils/iconMapper';
import { getDynamicProjects, mapDynamicProjectToSolution } from '../lib/contentManagement';

const Solutions = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(solutions[0]?.id ?? null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [dynamicProjects, setDynamicProjects] = useState(getDynamicProjects());
  const allSolutions = [...solutions, ...dynamicProjects.map(mapDynamicProjectToSolution)];
  const solutionsByCategories = categories
    .map((cat) => ({ category: cat, solutions: allSolutions.filter((item) => item.category === cat.id) }))
    .filter((item) => item.solutions.length > 0);
  const filteredCategories = activeCategory
    ? solutionsByCategories.filter(item => item.category.id === activeCategory)
    : solutionsByCategories;
  const visibleSolutions = filteredCategories.flatMap(item => item.solutions);
  const selectedSolution =
    visibleSolutions.find((solution) => solution.id === selectedSolutionId) ?? visibleSolutions[0] ?? null;

  useEffect(() => {
    const handler = () => {
      setDynamicProjects(getDynamicProjects());
    };
    window.addEventListener('mideessi-content-updated', handler);
    return () => window.removeEventListener('mideessi-content-updated', handler);
  }, []);

  const handleSelectSolution = (id: string) => {
    setSelectedSolutionId(id);
    setShowMobileDetail(true);
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title="Nos Solutions | MIDEESSI - MIKPLE & EKPE"
        description="Découvrez MIKPLE, plateforme de microfinance, et EKPE, plateforme agricole. Deux solutions technologiques innovantes pour l'Afrique."
        keywords={['MIKPLE', 'EKPE', 'solutions', 'microfinance', 'agriculture', 'MIDEESSI']}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-midnight via-blue-900 to-slate-900 py-16 text-white md:py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute right-5 top-10 h-40 w-40 rounded-full bg-gold blur-3xl md:right-10 md:top-20 md:h-72 md:w-72"></div>
          <div className="absolute -bottom-10 -left-5 h-48 w-48 rounded-full bg-blue-500 blur-3xl md:bottom-20 md:left-10 md:h-96 md:w-96"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-gray-100 backdrop-blur-sm">
              <Compass className="h-4 w-4 text-gold" />
              Des solutions pensées pour l’Afrique de l’Ouest
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:mb-6 md:text-5xl lg:text-6xl">
              Nos <span className="text-gold">Solutions</span>
            </h1>
            <p className="mx-auto max-w-3xl text-base font-light leading-relaxed text-gray-200 md:text-lg lg:text-2xl">
              On crée des outils concrets, utiles et durables pour répondre aux vrais besoins des entrepreneurs, des familles et des communautés.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-gray-100 backdrop-blur-sm">
                2 solutions actives
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-gray-100 backdrop-blur-sm">
                Développées localement
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-gray-100 backdrop-blur-sm">
                Orientées impact réel
              </span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-3">
            {[
              { icon: CheckCircle2, title: 'Simple', text: 'Des parcours rapides et accessibles.' },
              { icon: ShieldCheck, title: 'Fiable', text: 'Des services pensés pour durer.' },
              { icon: Layers3, title: 'Adapté', text: 'Un niveau de personnalisation utile.' }
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-white/15 bg-white/10 p-2 text-left backdrop-blur-sm sm:p-3 md:p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/20 text-gold">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Store Style Solutions */}
      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.16),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#ffffff_100%)] py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-12 overflow-hidden rounded-[2rem] border border-gray-200/80 bg-white/80 p-5 shadow-[0_25px_70px_-25px_rgba(15,23,42,0.25)] backdrop-blur md:mb-16 md:p-8 dark:border-gray-700 dark:bg-gray-900/80">
            {selectedSolution && (
              <div className="absolute inset-0">
                <img
                  src={selectedSolution.image}
                  alt={selectedSolution.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/70" />
              </div>
            )}
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-gold" />
                  Découvrez nos solutions
                </div>
                <h3 className="text-2xl font-bold text-white md:text-3xl">
                  Choisissez une solution, puis ouvrez son univers
                </h3>
                <p className="mt-2 text-sm text-gray-200 md:text-base">
                  Une navigation simple, visuelle et claire pour trouver rapidement la solution qui correspond à votre besoin.
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-nowrap md:flex-wrap">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all md:px-4 md:py-2 md:text-sm ${
                    activeCategory === null
                      ? 'bg-gold text-midnight shadow-md'
                      : 'bg-white/10 text-white shadow-sm backdrop-blur-sm hover:bg-gold/20 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Tout
                </button>
                {categories.map((cat) => {
                  const Icon = getIcon(cat.iconName);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all md:px-4 md:py-2 md:text-sm ${
                        activeCategory === cat.id
                          ? 'bg-gold text-midnight shadow-md'
                          : 'bg-white/10 text-white shadow-sm backdrop-blur-sm hover:bg-gold/20 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile: Solution detail modal overlay */}
          {showMobileDetail && selectedSolution && (
            <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileDetail(false)}>
              <div
                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl overflow-y-auto max-h-[90vh]"
                onClick={e => e.stopPropagation()}
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
                <button
                  onClick={() => setShowMobileDetail(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
                {/* Image header */}
                <div className="relative h-44 bg-gradient-to-br from-midnight to-blue-900 overflow-hidden">
                  <img src={selectedSolution.image} alt={selectedSolution.name} className="h-full w-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute left-5 bottom-5 right-5">
                    <h3 className="text-2xl font-black text-white">{selectedSolution.name}</h3>
                    <p className="text-sm text-gray-200 mt-1">{selectedSolution.tagline}</p>
                  </div>
                </div>
                {/* Content */}
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-sm font-semibold text-gold">{selectedSolution.status}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">{selectedSolution.launchDate}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">{selectedSolution.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {selectedSolution.benefits.slice(0, 4).map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-300">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pb-4">
                    <a href={selectedSolution.website} target="_blank" rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 font-semibold text-midnight transition-transform active:scale-95 text-sm">
                      Découvrir <ArrowRight className="h-4 w-4" />
                    </a>
                    <a href={`/solutions/${selectedSolution.slug}`}
                      className="flex-1 inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-3 font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm">
                      Fiche complète
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              {filteredCategories.map((item) => (
                <div key={item.category.id} className="rounded-[2rem] border border-gray-200/80 bg-white/90 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/80 md:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                      {(() => {
                        const CategoryIcon = getIcon(item.category.iconName);
                        return <CategoryIcon className="h-5 w-5" />;
                      })()}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-midnight dark:text-white">{item.category.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.category.description}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {item.solutions.map((solution) => {
                      const isActive = selectedSolution?.id === solution.id;
                      return (
                        <button
                          key={solution.id}
                          type="button"
                          onClick={() => handleSelectSolution(solution.id)}
                          className={`group rounded-3xl border p-4 text-left transition-all duration-300 ${
                            isActive
                              ? 'border-gold bg-gold/10 shadow-lg shadow-gold/10'
                              : 'border-gray-200 bg-white hover:-translate-y-1 hover:border-gold/40 hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
                          }`}
                        >
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-lg">
                              {solution.name.replace(/[^A-Z]/g, '').slice(0, 2)}
                            </div>
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                              {solution.status}
                            </span>
                          </div>
                          <h5 className="mb-1 text-lg font-bold text-midnight transition-colors group-hover:text-gold dark:text-white">
                            {solution.name}
                          </h5>
                          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{solution.tagline}</p>
                          <div className="flex items-center justify-between text-sm font-semibold text-gold">
                            <span>Voir l’app</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/60">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Aucune solution dans cette catégorie pour le moment.
                  </p>
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              {selectedSolution ? (
                <div className="overflow-hidden rounded-[2rem] border border-gray-200/80 bg-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.35)] dark:border-gray-700 dark:bg-gray-900">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-midnight md:h-56">
                    <img
                      src={selectedSolution.image}
                      alt={selectedSolution.name}
                      className="h-full w-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/95 text-lg font-black text-midnight shadow-lg">
                      {selectedSolution.name.replace(/[^A-Z]/g, '').slice(0, 2)}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
                        <Smartphone className="h-4 w-4" />
                        Application {selectedSolution.category === 'finance' ? 'financière' : 'digitale'}
                      </div>
                      <h3 className="mt-3 text-3xl font-black text-white md:text-4xl">{selectedSolution.name}</h3>
                      <p className="mt-2 max-w-xl text-sm text-gray-200 md:text-base">{selectedSolution.tagline}</p>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="mb-6 flex flex-wrap gap-2">
                      <span className="rounded-full bg-gold/15 px-3 py-1 text-sm font-semibold text-gold">
                        {selectedSolution.status}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {selectedSolution.launchDate}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {selectedSolution.category === 'finance' ? 'Finance' : 'Innovation locale'}
                      </span>
                    </div>

                    <p className="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      {selectedSolution.description}
                    </p>

                    <div className="mb-6 grid gap-3 sm:grid-cols-2">
                      {selectedSolution.benefits.slice(0, 4).map((benefit, index) => (
                        <div key={index} className="flex items-start gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-300">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mb-6 rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 dark:border-gray-700 dark:from-gray-800/80 dark:to-gray-900">
                      <div className="mb-4 flex items-center gap-2">
                        <Globe2 className="h-4 w-4 text-gold" />
                        <h4 className="text-base font-bold text-midnight dark:text-white">Pourquoi c’est utile</h4>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {selectedSolution.features.slice(0, 4).map((feature) => (
                          <div key={feature.id} className="rounded-2xl bg-white p-3 shadow-sm dark:bg-gray-800">
                            <p className="text-sm font-semibold text-midnight dark:text-white">{feature.title}</p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={selectedSolution.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-semibold text-midnight transition-transform hover:scale-[1.02]"
                      >
                        Découvrir {selectedSolution.name}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                      <a
                        href={`/solutions/${selectedSolution.slug}`}
                        className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition-colors hover:border-gold hover:text-gold dark:border-gray-700 dark:text-gray-300"
                      >
                        Voir la fiche complète
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/60">
                  <p className="text-gray-600 dark:text-gray-400">Sélectionne une solution pour voir ses détails.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Overview Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-midnight dark:text-white">
              Nos Catégories de Solutions
            </h2>
            <div className="mx-auto h-1 w-20 rounded-full bg-gold"></div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const count = solutionsByCategories.find(item => item.category.id === cat.id)?.solutions.length || 0;
              if (count === 0) return null;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="group rounded-3xl border border-gray-200/80 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 md:p-8"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold transition-all group-hover:scale-105">
                    {(() => {
                      const Icon = getIcon(cat.iconName);
                      return <Icon className="h-7 w-7 md:h-8 md:w-8" />;
                    })()}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-midnight transition-colors group-hover:text-gold dark:text-white md:text-xl">
                    {cat.name}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold md:text-sm">
                      {count} solution{count > 1 ? 's' : ''}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-12 dark:bg-gray-800 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-midnight dark:text-white md:text-4xl lg:text-5xl">
              Pourquoi Choisir Nos Solutions ?
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-gold md:w-20"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-8">
            {[
              {
                icon: Target,
                title: 'Vrai Impact',
                description: 'Pas juste de la théorie. Ça marche. Les chiffres parlent.'
              },
              {
                icon: Users,
                title: 'Fait pour Nous',
                description: 'Pensées pour les entrepreneurs béninois.\''
              },
              {
                icon: TrendingUp,
                title: 'Résultats Concrets',
                description: 'Les revenus augmentent. C\'est mesurable, c\'est réel.'
              },
              {
                icon: Award,
                title: 'Secure & Fiable',
                description: 'Standard international, zéro compromis sur la qualité.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 md:p-8 md:rounded-3xl"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 transition-colors group-hover:bg-gold/30 md:mb-4 md:h-14 md:w-14 md:rounded-2xl">
                  <item.icon className="h-5 w-5 text-gold md:h-7 md:w-7" />
                </div>
                <h3 className="mb-1.5 text-sm font-bold leading-tight text-midnight dark:text-white md:mb-2 md:text-xl">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 md:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Prêt pour la suite ?</h2>
          <div className="w-16 md:w-20 h-1 bg-gold mx-auto rounded-full mb-6 md:mb-8"></div>
          <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Des milliers de gens utilisent nos solutions pour faire bouger les choses. Rejoins le mouvement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 flex-wrap">
            {solutions.map((solution) => (
              <a
                key={solution.id}
                href={solution.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-500 text-midnight font-bold px-6 md:px-8 py-3 md:py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                Accéder à {solution.name}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Solutions;
