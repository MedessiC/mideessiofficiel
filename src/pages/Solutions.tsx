import { ArrowRight, Zap, Users, TrendingUp, Award, Filter } from 'lucide-react';
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
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-5 md:top-20 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-5 md:bottom-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-center tracking-tight leading-tight">
            Nos <span className="text-gold">Solutions</span>
          </h1>
          <p className="text-base md:text-lg lg:text-2xl text-center text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
            Des solutions technologiques complètes pour transformer les secteurs clés de l'économie africaine
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-2 mb-6 md:mb-8">
              <Filter className="w-5 h-5 md:w-6 md:h-6 text-gold" />
              <h3 className="text-base md:text-lg font-bold text-midnight dark:text-white">Filtrer par catégorie</h3>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 md:px-4 py-2 md:py-2.5 rounded-full font-semibold transition-all text-sm md:text-base whitespace-nowrap ${
                  activeCategory === null
                    ? 'bg-gold text-midnight shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gold/30'
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
                    className={`px-3 md:px-4 py-2 md:py-2.5 rounded-full font-semibold transition-all flex items-center gap-1.5 md:gap-2 text-sm md:text-base whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-gold text-midnight shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gold/30'
                    }`}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
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
                <div className="mb-8 md:mb-10">
                  <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                    <CategoryIcon className="w-8 h-8 md:w-10 md:h-10 text-gold flex-shrink-0" />
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-midnight dark:text-white">
                      {item.category.name}
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {item.category.description}
                  </p>
                </div>

                {/* Solutions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
                  {item.solutions.map((solution) => (
                    <SolutionCard key={solution.id} solution={solution} />
                  ))}
                </div>

                {/* Divider */}
                {filteredCategories.length > 1 && item.category.id !== filteredCategories[filteredCategories.length - 1].category.id && (
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-8 md:my-12"></div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Aucune solution dans cette catégorie pour le moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Overview Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">
              Nos Catégories de Solutions
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const count = solutionsByCategories.find(item => item.category.id === cat.id)?.solutions.length || 0;
              if (count === 0) return null;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="group bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-left border-l-4 border-transparent hover:border-gold"
                >
                  <div className="mb-4">
                    {(() => {
                      const Icon = getIcon(cat.iconName);
                      return <Icon className="w-10 h-10 md:w-12 md:h-12 text-gold" />;
                    })()}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-midnight dark:text-white group-hover:text-gold transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-3 py-1 bg-gold/20 text-gold rounded-full text-xs md:text-sm font-semibold">
                      {count} solution{count > 1 ? 's' : ''}
                    </span>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gold group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-midnight dark:text-white mb-4">
              Pourquoi Choisir Nos Solutions ?
            </h2>
            <div className="w-16 md:w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Zap,
                title: 'Technologie de Pointe',
                description: 'Construites avec les dernières technologies cloud et mobile'
              },
              {
                icon: Users,
                title: 'Résilience Communautaire',
                description: 'Conçues pour les besoins réels des entrepreneurs africains'
              },
              {
                icon: TrendingUp,
                title: 'Impact Mesurable',
                description: 'Augmentation démontrée des revenus et de l\'efficacité'
              },
              {
                icon: Award,
                title: 'Standards Internationaux',
                description: 'Conformité aux normes mondiales de sécurité et de qualité'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gold/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/30 transition-colors">
                  <item.icon className="w-6 h-6 md:w-7 md:h-7 text-gold" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-midnight dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Prêt à Transformer Votre Secteur ?</h2>
          <div className="w-16 md:w-20 h-1 bg-gold mx-auto rounded-full mb-6 md:mb-8"></div>
          <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Rejoignez des milliers d'utilisateurs à travers l'Afrique qui utilisent nos solutions
            pour révolutionner leur façon de travailler.
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
