import { ArrowRight, Target, Users, TrendingUp, Award, Filter, Compass, CheckCircle2, ShieldCheck, Layers3 } from 'lucide-react';
import { useState } from 'react';
import SEO from '../components/SEO';
import SolutionCard from '../components/SolutionCard';
import { getSolutionsByCategories, categories, solutions } from '../data/solutions';
import { getIcon } from '../utils/iconMapper';

const Solutions = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const solutionsByCategories = getSolutionsByCategories();
  const filteredCategories = activeCategory
    ? solutionsByCategories.filter(item => item.category.id === activeCategory)
    : solutionsByCategories;
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

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: CheckCircle2, title: 'Simple', text: 'Des parcours rapides et accessibles.' },
              { icon: ShieldCheck, title: 'Fiable', text: 'Des services pensés pour durer.' },
              { icon: Layers3, title: 'Adapté', text: 'Un niveau de personnalisation utile.' }
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-sm">
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

      {/* Solutions Grid */}
      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12 rounded-3xl border border-gray-200/80 bg-gradient-to-br from-gray-50 via-white to-gray-50 p-5 shadow-sm md:mb-16 md:p-8 dark:border-gray-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
            <div className="mb-6 flex items-center gap-2 md:mb-8">
              <Filter className="h-5 w-5 text-gold md:h-6 md:w-6" />
              <h3 className="text-base font-bold text-midnight dark:text-white md:text-lg">Filtrer par catégorie</h3>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={() => setActiveCategory(null)}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition-all md:px-4 md:py-2.5 md:text-base ${
                  activeCategory === null
                    ? 'bg-gold text-midnight shadow-md'
                    : 'bg-white text-gray-700 shadow-sm hover:bg-gold/20 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Toutes les catégories
              </button>
              {categories.map((cat) => {
                const Icon = getIcon(cat.iconName);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-all md:gap-2 md:px-4 md:py-2.5 md:text-base ${
                      activeCategory === cat.id
                        ? 'bg-gold text-midnight shadow-md'
                        : 'bg-white text-gray-700 shadow-sm hover:bg-gold/20 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Solutions by Category */}
          {filteredCategories.map((item) => {
            const CategoryIcon = getIcon(item.category.iconName);
            return (
              <div key={item.category.id} className="mb-12 md:mb-16">
                {/* Category Header */}
                <div className="mb-8 rounded-3xl border border-gray-200/80 bg-gradient-to-br from-white via-gray-50 to-white p-6 shadow-sm md:mb-10 md:p-8 dark:border-gray-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
                  <div className="mb-3 flex items-center gap-3 md:gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold md:h-14 md:w-14">
                      <CategoryIcon className="h-6 w-6 md:h-7 md:w-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-midnight dark:text-white md:text-3xl lg:text-4xl">
                        {item.category.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
                        {item.category.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solutions Grid */}
                <div className="mb-12 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 md:mb-16">
                  {item.solutions.map((solution) => (
                    <SolutionCard key={solution.id} solution={solution} />
                  ))}
                </div>

                {/* Divider */}
                {filteredCategories.length > 1 && item.category.id !== filteredCategories[filteredCategories.length - 1].category.id && (
                  <div className="my-8 h-px bg-gray-200 dark:bg-gray-700 md:my-12"></div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/60">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Aucune solution dans cette catégorie pour le moment.
              </p>
            </div>
          )}
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
            {[
              {
                icon: Target,
                title: 'Vrai Impact',
                description: 'Pas juste de la théorie. Ça marche. Les chiffres parlent d\'eux-mêmes.'
              },
              {
                icon: Users,
                title: 'Fait pour Nous',
                description: 'Pensées pour les entrepreneurs béninois. On comprend les vrais défis.'
              },
              {
                icon: TrendingUp,
                title: 'Résultats Concrets',
                description: 'Les revenus augmentent. L\'efficacité aussi. C\'est mesurable, c\'est réel.'
              },
              {
                icon: Award,
                title: 'Secure et Reliable',
                description: 'Standard international, zéro compromis sur la qualité. On n\'a pas le choix.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 md:p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/20 transition-colors group-hover:bg-gold/30 md:h-14 md:w-14">
                  <item.icon className="h-6 w-6 text-gold md:h-7 md:w-7" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-midnight dark:text-white md:text-xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 md:text-base">
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
