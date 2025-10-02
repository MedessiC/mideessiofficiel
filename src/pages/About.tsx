import { Target, Users, Lightbulb, Heart } from 'lucide-react';
import SEO from '../components/SEO';

const About = () => {
  const values = [
    {
      icon: <Lightbulb className="w-8 h-8 text-gold" />,
      title: 'Innovation',
      description: 'Nous repoussons constamment les limites de la technologie pour créer des solutions qui transforment le quotidien.',
    },
    {
      icon: <Users className="w-8 h-8 text-gold" />,
      title: 'Communauté',
      description: 'Notre force réside dans notre communauté. Ensemble, nous construisons un écosystème technologique inclusif et dynamique.',
    },
    {
      icon: <Target className="w-8 h-8 text-gold" />,
      title: 'Indépendance',
      description: 'Nous prenons nos propres décisions, guidés uniquement par notre vision et les besoins de notre communauté.',
    },
    {
      icon: <Heart className="w-8 h-8 text-gold" />,
      title: 'Passion',
      description: 'Chaque projet est porté par notre passion pour la technologie et notre désir de faire la différence.',
    },
  ];

  const timeline = [
    { year: '2023', event: 'Fondation de MIDEESSI', description: 'Naissance de la vision d\'une startup technologique indépendante.' },
    { year: '2023', event: 'Premiers projets', description: 'Développement de l\'organisateur de fichiers automatique.' },
    { year: '2024', event: 'Expansion', description: 'Lancement des applications Essor et Tcha-Tcha.' },
    { year: '2024', event: 'Croissance communautaire', description: 'Une communauté grandissante de développeurs et d\'innovateurs.' },
  ];

  return (
    <div className="min-h-screen pt-16">
      <SEO
        title="À propos de MIDEESSI | Notre histoire et nos valeurs"
        description="Découvrez l'histoire de MIDEESSI, notre vision pour l'innovation technologique et les valeurs qui guident notre startup communautaire indépendante."
        keywords={['MIDEESSI', 'à propos', 'histoire', 'vision', 'valeurs', 'Medessi Coovi', 'startup africaine', 'innovation']}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center tracking-tight">
            À propos de <span className="text-gold">MIDEESSI</span>
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-200 max-w-3xl mx-auto font-light">
            Une startup technologique communautaire dédiée à l'innovation et à l'indépendance.
          </p>
        </div>
      </section>

      {/* Histoire Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">Notre Histoire</h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-gray-700 dark:text-gray-300">
              MIDEESSI est née d'une vision claire : créer des solutions technologiques innovantes tout en restant totalement indépendants.
              Fondée par Medessi Coovi, notre startup incarne les valeurs de liberté, d'innovation et de collaboration communautaire.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Dans un monde où la technologie est souvent contrôlée par de grandes corporations, nous avons choisi une voie différente.
              Nous croyons que l'innovation véritable vient de l'indépendance de pensée et d'action. Notre slogan, <span className="font-semibold text-gold">"Nous sommes indépendants"</span>,
              reflète cet engagement profond envers la liberté technologique.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Aujourd'hui, MIDEESSI développe des solutions d'automatisation et d'intelligence artificielle qui servent notre communauté.
              Chaque projet est conçu avec soin, en écoutant les besoins réels de nos utilisateurs et en maintenant nos standards élevés de qualité.
            </p>
          </div>
        </div>
      </section>

      {/* Valeurs Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">Nos Valeurs</h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="group bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-midnight dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fondateur Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">Le Fondateur</h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-lg p-10 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-36 h-36 bg-gradient-to-br from-gold via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-5xl font-bold text-midnight">MC</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-midnight dark:bg-white rounded-full flex items-center justify-center">
                  <span className="text-gold text-2xl">✦</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-midnight dark:text-white mb-2">Medessi Coovi</h3>
                <p className="text-gold font-semibold text-lg mb-6">Fondateur & Visionnaire</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  Passionné de technologie et d'innovation, Medessi Coovi a créé MIDEESSI avec la vision de développer
                  des solutions qui respectent l'indépendance et servent véritablement la communauté. Son approche unique
                  combine expertise technique et engagement envers les valeurs humaines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">Notre Évolution</h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="relative">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6 mb-12 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-600 rounded-2xl flex items-center justify-center text-midnight font-bold text-lg shadow-lg transform hover:scale-110 transition-transform duration-300">
                      {item.year}
                    </div>
                  </div>
                  {index !== timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-gold to-gold/20 mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pb-8 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-midnight dark:text-white mb-2">{item.event}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-24 bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">Notre Mission</h2>
          <div className="w-20 h-1 bg-gold mx-auto rounded-full mb-10"></div>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed font-light">
            Développer des solutions technologiques innovantes qui respectent l'indépendance,
            favorisent la collaboration communautaire et créent un impact positif durable.
          </p>
          <div className="inline-block bg-gold/10 backdrop-blur-sm border-2 border-gold rounded-full px-8 py-4">
            <p className="text-xl font-bold text-gold">
              Nous sommes MIDEESSI. Nous sommes indépendants.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;