import { Target, Users, Lightbulb, Heart } from 'lucide-react';

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
      <section className="bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">À propos de MIDEESSI</h1>
          <p className="text-xl text-center text-gray-200 max-w-3xl mx-auto">
            Une startup technologique communautaire dédiée à l'innovation et à l'indépendance.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-midnight dark:text-white mb-6 text-center">Notre Histoire</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              MIDEESSI est née d'une vision claire : créer des solutions technologiques innovantes tout en restant totalement indépendants.
              Fondée par Medessi Coovi, notre startup incarne les valeurs de liberté, d'innovation et de collaboration communautaire.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Dans un monde où la technologie est souvent contrôlée par de grandes corporations, nous avons choisi une voie différente.
              Nous croyons que l'innovation véritable vient de l'indépendance de pensée et d'action. Notre slogan, "Nous sommes indépendants",
              reflète cet engagement profond envers la liberté technologique.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Aujourd'hui, MIDEESSI développe des solutions d'automatisation et d'intelligence artificielle qui servent notre communauté.
              Chaque projet est conçu avec soin, en écoutant les besoins réels de nos utilisateurs et en maintenant nos standards élevés de qualité.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-midnight dark:text-white mb-12 text-center">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-midnight dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-midnight dark:text-white mb-6 text-center">Le Fondateur</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-midnight">MC</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-midnight dark:text-white mb-2">Medessi Coovi</h3>
                <p className="text-gold font-semibold mb-4">Fondateur & Visionnaire</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Passionné de technologie et d'innovation, Medessi Coovi a créé MIDEESSI avec la vision de développer
                  des solutions qui respectent l'indépendance et servent véritablement la communauté. Son approche unique
                  combine expertise technique et engagement envers les valeurs humaines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-midnight dark:text-white mb-12 text-center">Notre Évolution</h2>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-midnight font-bold">
                    {item.year}
                  </div>
                  {index !== timeline.length - 1 && (
                    <div className="w-1 flex-1 bg-gold/30 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-bold text-midnight dark:text-white mb-2">{item.event}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
          <p className="text-xl text-gray-200 mb-4">
            Développer des solutions technologiques innovantes qui respectent l'indépendance,
            favorisent la collaboration communautaire et créent un impact positif durable.
          </p>
          <p className="text-lg text-gold font-semibold">
            Nous sommes MIDEESSI. Nous sommes indépendants.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
