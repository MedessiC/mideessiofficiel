import { Target, BookOpen, Lightbulb, Users, Flag, MapPin, Calendar, Rocket } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Flag className="w-8 h-8 text-gold" />,
      title: 'Patriotisme',
      description: 'Nous aimons profondément le Bénin et travaillons pour sa souveraineté technologique. Consommons 100% béninois.',
    },
    {
      icon: <BookOpen className="w-8 h-8 text-gold" />,
      title: 'Apprentissage',
      description: 'Nous valorisons l\'autodidaxie et l\'apprentissage par immersion terrain. Nous apprenons du peuple et avec le peuple.',
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-gold" />,
      title: 'Innovation',
      description: 'Nous créons des solutions adaptées aux réalités béninoises, nées de l\'écoute du terrain et des besoins réels.',
    },
    {
      icon: <Users className="w-8 h-8 text-gold" />,
      title: 'Solidarité',
      description: 'Nous progressons collectivement, renforçons les acteurs locaux et partageons nos réussites avec l\'écosystème.',
    },
  ];

  const processSteps = [
    { 
      step: '01', 
      title: 'Immersion terrain', 
      description: 'Nous allons à la rencontre des acteurs du secteur ciblé : agriculteurs, commerçants, transporteurs, enseignants...' 
    },
    { 
      step: '02', 
      title: 'Interrogation & Collecte', 
      description: 'Nous écoutons, interrogeons et documentons les besoins réels. Le peuple sait ce dont il a besoin.' 
    },
    { 
      step: '03', 
      title: 'Conception & Développement', 
      description: 'Nous développons des solutions véritablement adaptées, numériques ou physiques, selon les ressources locales.' 
    },
    { 
      step: '04', 
      title: 'Tests sur le terrain', 
      description: 'Nous retournons tester avec les mêmes acteurs, ajustons et perfectionnons jusqu\'à adoption réelle.' 
    },
    { 
      step: '05', 
      title: 'Distribution & Déploiement', 
      description: 'Nous déployons avec accompagnement personnalisé pour garantir l\'appropriation effective des solutions.' 
    },
  ];

  const timeline = [
    { 
      year: '2025', 
      event: 'Naissance du mouvement', 
      description: 'Fondation de MIDEESSI au Bénin avec la vision d\'un mouvement d\'indépendance technologique africaine.' 
    },
    { 
      year: '2025', 
      event: 'Modèle sectoriel Trimestriel', 
      description: 'Lancement du modèle unique : chaque trimestre, un secteur, une immersion, une solution concrète.' 
    },
    { 
      year: '2025-2035', 
      event: 'Vision décennale', 
      description: 'Devenir une manufacture d\'idées béninoises, un incubateur de talents et une référence continentale.' 
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight via-blue-900 to-midnight dark:from-black dark:via-gray-900 dark:to-black text-white py-12 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-5 md:top-20 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-gold rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-5 md:bottom-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-green-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Flag className="w-6 h-6 md:w-10 md:h-10 text-gold" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight">
                À propos de <span className="text-gold">MIDEESSI</span>
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-4xl mx-auto font-light leading-relaxed px-2">
              Un mouvement d'indépendance technologique né au Bénin, héritier de l'esprit du Dahomey.
            </p>
            <div className="mt-6 md:mt-8 flex justify-center">
              <div className="inline-block bg-gold/10 backdrop-blur-sm border-2 border-gold rounded-full px-6 md:px-8 py-2.5 md:py-3">
                <p className="text-base md:text-lg font-bold text-gold">
                  « Nous sommes indépendants »
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Essence */}
      <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-midnight dark:text-white mb-3 md:mb-4">Notre Essence</h2>
            <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="space-y-4 md:space-y-6 text-base sm:text-lg md:text-lg leading-relaxed">
            <p className="text-gray-700 dark:text-gray-300">
              MIDEESSI transcende la simple notion d'entreprise. Nous sommes un <span className="font-bold text-gold">mouvement d'indépendance technologique</span> né 
              au cœur du Bénin, héritier de l'esprit du Dahomey, édifié sur une conviction fondamentale : 
              <span className="font-semibold"> nous possédons en nous toutes les ressources nécessaires pour forger notre propre avenir.</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Le temps de la consommation passive de technologie étrangère est révolu. Nous aspirons à <span className="font-semibold">concevoir</span>, 
              <span className="font-semibold"> fabriquer</span> et <span className="font-semibold">innover</span> — en mobilisant nos idées, notre savoir-faire 
              et notre intelligence collective béninoise et africaine.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Nous sommes les dignes héritiers d'une terre qui a toujours su résister, innover et créer. Du royaume du Dahomey à la République du Bénin, 
              l'esprit d'indépendance coule dans nos veines.
            </p>
            <div className="bg-gradient-to-r from-gold/5 to-green-500/5 border-l-4 border-gold p-4 md:p-6 rounded-r-lg mt-6 md:mt-8">
              <p className="text-base md:text-lg lg:text-xl font-bold text-midnight dark:text-white italic">
                "Consommons 100% béninois. Créons 100% béninois. Innovons 100% béninois."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-midnight dark:text-white mb-3 md:mb-4">Notre Mission</h2>
            <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 md:w-8 md:h-8 text-midnight" />
              </div>
              <h3 className="text-base md:text-xl font-bold text-midnight dark:text-white mb-2">Pour le Bénin</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                Contribuer à la souveraineté technologique nationale et créer des emplois qualifiés.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flag className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-base md:text-xl font-bold text-midnight dark:text-white mb-2">Pour l'Afrique</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                Inspirer d'autres mouvements d'indépendance technologique sur le continent.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-base md:text-xl font-bold text-midnight dark:text-white mb-2">Pour le Monde</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                Prouver que l'excellence technologique peut naître de n'importe quel territoire.
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12 shadow-lg">
            <p className="text-base sm:text-lg md:text-lg leading-relaxed text-center text-gray-700 dark:text-gray-300">
              Chaque trimestre, nous sélectionnons un secteur de la vie quotidienne (santé, finance, éducation, agriculture, mobilité, commerce). 
              Notre démarche est résolument <span className="font-bold text-gold">ancrée dans la réalité du terrain</span>. 
              Nous sommes <span className="font-semibold">proches du peuple</span>, nous travaillons <span className="font-semibold">pour le peuple</span>, 
              pour le Bénin, pour l'Afrique et pour le monde.
            </p>
          </div>
        </div>
      </section>

      {/* Notre Processus Trimestriel */}
      <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-midnight dark:text-white mb-3 md:mb-4">Notre Processus Trimestriel</h2>
            <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold mx-auto rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm md:text-base lg:text-lg">
              Innovation par l'immersion : nous créons des solutions qui répondent aux vrais besoins
            </p>
          </div>
          <div className="space-y-4 md:space-y-6">
            {processSteps.map((item, index) => (
              <div key={index} className="flex gap-4 md:gap-6 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gold via-yellow-500 to-yellow-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-lg md:text-2xl font-bold text-midnight">{item.step}</span>
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-midnight dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-midnight dark:text-white mb-3 md:mb-4">Nos Valeurs Cardinales</h2>
            <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="group bg-white dark:bg-gray-900 rounded-lg md:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 md:p-8 hover:-translate-y-3 border-2 border-transparent hover:border-gold"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-lg md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-bold text-midnight dark:text-white mb-2 md:mb-3">{value.title}</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Le Fondateur */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">Le Fondateur</h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-10 md:p-12 border-2 border-gold/20">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="relative group flex-shrink-0">
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-gold/30 transition-all duration-500 group-hover:ring-gold/60 group-hover:shadow-gold/20">
                  <img 
                    src="medessicoovi.webp" 
                    alt="Coovi MEDESSI"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-midnight dark:bg-white rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <Flag className="text-gold w-10 h-10" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-midnight dark:text-white mb-2">Coovi Medessi</h3>
                <p className="text-gold font-semibold text-lg mb-2">Fondateur & Gérant</p>
                <p className="text-gray-500 dark:text-gray-400 mb-6 flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="w-4 h-4" /> Cotonou, Bénin (ex-Dahomey)
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-4">
                  Passionné de technologie et visionnaire, Coovi Medessi a fondé MIDEESSI avec la conviction profonde que le Bénin et l'Afrique 
                  possèdent tous les talents nécessaires pour créer leur propre avenir technologique.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  Guidé par les valeurs de patriotisme, apprentissage, innovation et solidarité, il incarne l'esprit d'indépendance du Dahomey 
                  et travaille chaque jour pour la souveraineté technologique béninoise et africaine.
                </p>
                <div className="mt-6 inline-block bg-gradient-to-r from-gold/10 to-green-500/10 border border-gold rounded-lg px-6 py-3">
                  <p className="text-sm font-semibold text-gold">
                    "Du Dahomey au Bénin, l'esprit d'indépendance perdure."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
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
                    <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-600 rounded-2xl flex items-center justify-center text-midnight font-bold text-lg shadow-xl transform hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-midnight dark:bg-white rounded-full px-2 py-1">
                      <span className="text-gold text-xs font-bold">{item.year}</span>
                    </div>
                  </div>
                  {index !== timeline.length - 1 && (
                    <div className="w-1 flex-1 bg-gradient-to-b from-gold to-gold/20 mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pb-8 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-gold">
                  <h3 className="text-xl font-bold text-midnight dark:text-white mb-2">{item.event}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Vision */}
      <section className="relative py-12 md:py-20 lg:py-24 bg-gradient-to-br from-midnight via-blue-900 to-midnight dark:from-black dark:via-gray-900 dark:to-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Notre Vision</h2>
            <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-gold/30 rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-12 shadow-2xl">
            <p className="text-base sm:text-lg md:text-lg lg:text-xl text-gray-200 mb-6 md:mb-8 leading-relaxed">
              Dans dix ans, MIDEESSI sera devenu une <span className="text-gold font-bold">manufacture d'idées et de solutions 100% béninoises</span>, 
              un <span className="text-gold font-bold">incubateur de talents autodidactes</span>, et une <span className="text-gold font-bold">référence continentale 
              en innovation locale</span>.
            </p>
            <p className="text-base sm:text-lg md:text-lg lg:text-xl text-gray-200 mb-6 md:mb-8 leading-relaxed">
              Nous envisageons un avenir où chaque jeune béninois pourra vivre dignement de son talent technologique, où chaque quartier de Cotonou, 
              Porto-Novo, Parakou et Abomey comptera ses propres architectes de solutions innovantes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-10">
              <div className="text-center p-4 md:p-6 bg-gold/10 rounded-lg md:rounded-xl border border-gold/30">
                <div className="text-3xl md:text-4xl font-bold text-gold mb-2">100%</div>
                <div className="text-xs md:text-sm text-gray-300">Béninois, fiers et indépendants</div>
              </div>
              <div className="text-center p-4 md:p-6 bg-gold/10 rounded-lg md:rounded-xl border border-gold/30">
                <div className="text-3xl md:text-4xl font-bold text-gold mb-2">12</div>
                <div className="text-xs md:text-sm text-gray-300">Solutions par an, une par trimestre</div>
              </div>
              <div className="text-center p-4 md:p-6 bg-gold/10 rounded-lg md:rounded-xl border border-gold/30">
                <div className="text-3xl md:text-4xl font-bold text-gold mb-2">∞</div>
                <div className="text-xs md:text-sm text-gray-300">Impact pour notre peuple</div>
              </div>
            </div>
          </div>
          <div className="text-center mt-10 md:mt-12 lg:mt-16">
            <div className="inline-block bg-gold/20 backdrop-blur-sm border-2 border-gold rounded-full px-6 md:px-10 py-4 md:py-5 shadow-2xl">
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-gold mb-2">
                Nous sommes MIDEESSI
              </p>
              <p className="text-xs md:text-sm lg:text-base text-gray-200">
                Proches du peuple • Travaillons pour le peuple • Pour le Bénin • Pour l'Afrique • Pour le monde
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;