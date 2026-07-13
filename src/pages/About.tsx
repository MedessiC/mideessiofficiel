import { BookOpen, Lightbulb, Users, Flag, MapPin, Calendar, Rocket, Sparkles, Award, Globe, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import TeamMemberCard from '../components/TeamMemberCard';
import { teamMembers } from '../data/teamMembers';
import PopupDisplay from '../components/PopupDisplay';
import { getDynamicTeamMembers } from '../lib/contentManagement';

const About = () => {
  const [dynamicMembers, setDynamicMembers] = useState(getDynamicTeamMembers());
  const allMembers = [...teamMembers, ...dynamicMembers];

  useEffect(() => {
    const handler = () => setDynamicMembers(getDynamicTeamMembers());
    window.addEventListener('mideessi-content-updated', handler);
    return () => window.removeEventListener('mideessi-content-updated', handler);
  }, []);

  const values = [
    {
      icon: <Flag className="w-6 h-6 text-yellow-500" />,
      title: 'Patriotisme',
      description: 'On aime le Bénin et on œuvre chaque jour pour sa souveraineté technologique. Une solution construite par nous et pour nous.',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-yellow-500" />,
      title: 'Apprentissage',
      description: 'L\'expérience de terrain prime. Nous apprenons en écoutant, en créant et en adaptant continuellement nos solutions.',
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
      title: 'Innovation',
      description: 'Concevoir des réponses technologiques spécifiques aux réalités locales béninoises plutôt que des calques génériques.',
    },
    {
      icon: <Users className="w-6 h-6 text-yellow-500" />,
      title: 'Solidarité',
      description: 'Bâtir un écosystème de collaboration. Renforcer les compétences de chacun et célébrer les réussites ensemble.',
    },
  ];

  const processSteps = [
    { 
      step: '01', 
      title: 'Immersion terrain', 
      description: 'Sortir des bureaux pour rencontrer les utilisateurs réels : agriculteurs, commerçants, artisans, étudiants.' 
    },
    { 
      step: '02', 
      title: 'Écoute active', 
      description: 'Analyser les besoins concrets et identifier les goulets d\'étranglement opérationnels directement à la source.' 
    },
    { 
      step: '03', 
      title: 'Co-design', 
      description: 'Concevoir et développer des produits sur-mesure résolvant spécifiquement les problématiques documentées.' 
    },
    { 
      step: '04', 
      title: 'Validation', 
      description: 'Tester en conditions réelles avec les utilisateurs cibles et itérer selon les retours d\'expérience.' 
    },
    { 
      step: '05', 
      title: 'Accompagnement', 
      description: 'Déployer, former les utilisateurs et suivre l\'impact de la solution à long terme.' 
    },
  ];

  const timeline = [
    { 
      year: '2025', 
      event: 'Naissance de l\'élan MIDEESSI', 
      description: 'Création du mouvement à Cotonou avec la volonté de rebâtir l\'indépendance numérique locale.' 
    },
    { 
      year: '2025', 
      event: 'Le modèle par cycle trimestriel', 
      description: 'Mise en place de notre modèle d\'innovation : un nouveau secteur adressé et résolu tous les 3 mois.' 
    },
    { 
      year: '2025 - 2035', 
      event: 'Vision décennale', 
      description: 'Devenir le premier pôle d\'innovation indépendant d\'Afrique de l\'Ouest et former la nouvelle élite tech.' 
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-[#080d1a] font-poppins selection:bg-yellow-400 selection:text-midnight transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0a0f1e] to-blue-950 dark:from-[#040712] dark:to-[#080d1a] text-white py-20 md:py-32 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute top-1/4 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute -bottom-10 left-10 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '1.2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto space-y-6">

            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-none">
              À propos de <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">MIDEESSI</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
              Bâtir l'indépendance numérique du Bénin à travers un écosystème de jeunes talents créant des solutions adaptées au terrain.
            </p>

            <div className="inline-flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-8 py-3.5 shadow-2xl transition-transform hover:scale-105 duration-300">
              <span className="text-sm md:text-base font-bold text-yellow-400">« Notre souveraineté est technologique »</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Essence */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#050812] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            
            <div className="lg:col-span-5 relative">
              <div className="relative p-8 rounded-[32px] bg-gradient-to-br from-yellow-400 to-amber-500 shadow-2xl shadow-yellow-500/20 transform rotate-1 transition-transform hover:rotate-0 duration-500">
                <div className="absolute inset-0 bg-black/10 rounded-[32px]" />
                <div className="relative z-10 text-midnight text-left space-y-6">
                  <Heart className="w-12 h-12 text-midnight fill-midnight" />
                  <h3 className="text-3xl font-black leading-tight">100% conçu et développé au Bénin.</h3>
                  <p className="text-base leading-relaxed font-semibold opacity-95">
                    Nous réinventons le concept de l'innovation locale. Aucun calque, aucune importation : uniquement de la valeur utile.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-yellow-500 rounded-full" />
                <h2 className="text-3xl sm:text-4xl font-black text-midnight dark:text-white">Notre Essence</h2>
              </div>
              <div className="space-y-6 text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  MIDEESSI n’est pas une structure classique. C’est un <span className="font-bold text-yellow-500">mouvement souverain</span>. Nous pensons que le Bénin possède tous les cerveaux et toute l’énergie nécessaire pour concevoir l’avenir digital de son territoire.
                </p>
                <p>
                  En refusant la dépendance aux solutions importées ou inadaptées, nous créons des produits digitaux ancrés dans le quotidien de notre écosystème, de nos commerces et de nos administrations.
                </p>
                <div className="bg-yellow-500/5 dark:bg-yellow-500/10 border-l-4 border-yellow-500 p-6 rounded-r-2xl">
                  <p className="font-bold text-midnight dark:text-white italic text-sm sm:text-base leading-relaxed">
                    "Innover localement n'est pas une alternative, c'est le seul chemin vers le développement."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-[#080d1a] border-y border-gray-100 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-black uppercase tracking-widest text-yellow-500">Objectifs clés</span>
            <h2 className="text-4xl sm:text-5xl font-black text-midnight dark:text-white mt-2">Notre Mission</h2>
            <div className="w-16 h-1 bg-yellow-500 mx-auto rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                icon: <MapPin className="w-5 h-5 text-emerald-500" />,
                bg: 'bg-emerald-500/10 border-emerald-500/20',
                accent: 'text-emerald-500',
                title: 'Souveraineté nationale',
                desc: 'Bâtir des solutions exclusives garantissant l\'autonomie numérique et économique du Bénin.'
              },
              {
                icon: <Globe className="w-5 h-5 text-blue-500" />,
                bg: 'bg-blue-500/10 border-blue-500/20',
                accent: 'text-blue-500',
                title: 'Rayonnement régional',
                desc: 'Partager nos cadres d\'innovation et modéliser l\'indépendance tech pour d\'autres pays d\'Afrique.'
              },
              {
                icon: <Award className="w-5 h-5 text-amber-500" />,
                bg: 'bg-amber-500/10 border-amber-500/20',
                accent: 'text-amber-500',
                title: 'Excellence globale',
                desc: 'Démontrer que la tech développée localement rivalise en qualité avec n\'importe quel standard mondial.'
              }
            ].map((mission, idx) => (
              <div key={idx} className="bg-white dark:bg-[#050812] rounded-2xl md:rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Mobile: horizontal layout */}
                <div className="flex md:hidden items-start gap-4 p-5">
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${mission.bg} border`}>
                    {mission.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm ${mission.accent} mb-1`}>{mission.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{mission.desc}</p>
                  </div>
                </div>
                {/* Desktop: vertical layout */}
                <div className="hidden md:block p-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${mission.bg} border`}>
                    {mission.icon}
                  </div>
                  <h3 className="font-bold text-xl text-midnight dark:text-white mb-3">{mission.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{mission.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus Trimestriel */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#050812] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-yellow-500">Méthodologie agile</span>
            <h2 className="text-4xl sm:text-5xl font-black text-midnight dark:text-white mt-2">Le cycle d'innovation trimestriel</h2>
            <div className="w-16 h-1 bg-yellow-500 mx-auto rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6">
            {processSteps.map((item, idx) => (
              <div key={idx} className="flex flex-col bg-gray-50 dark:bg-[#080d1a] p-4 sm:p-6 rounded-2xl border border-gray-200/40 dark:border-white/5 relative group hover:shadow-lg hover:border-yellow-500/30 transition-all duration-300">
                <div className="w-8 h-8 rounded-xl bg-yellow-500 flex items-center justify-center text-midnight font-black text-xs mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="font-bold text-xs sm:text-base text-midnight dark:text-white mb-1.5">{item.title}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-grow line-clamp-4">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-[#080d1a] border-t border-gray-100 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-black uppercase tracking-widest text-yellow-500">Nos piliers</span>
            <h2 className="text-4xl sm:text-5xl font-black text-midnight dark:text-white mt-2">Nos valeurs cardinales</h2>
            <div className="w-16 h-1 bg-yellow-500 mx-auto rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, idx) => (
              <div key={idx} className="bg-white dark:bg-[#050812] p-8 rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-yellow-500/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center mb-6">
                  {v.icon}
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-midnight dark:text-white mb-3">{v.title}</h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Le Fondateur */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#050812] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#080d1a] dark:to-[#03060f] rounded-[40px] p-8 md:p-16 border border-gray-200/50 dark:border-white/5 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-16">
              
              <div className="relative flex-shrink-0 group">
                <div className="w-56 h-56 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-yellow-500/20">
                  <img 
                    src="/medessicoovi.webp" 
                    alt="Coovi MEDESSI"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-midnight dark:bg-white rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300">
                  <Flag className="text-yellow-500 w-6 h-6" />
                </div>
              </div>

              <div className="flex-grow text-center lg:text-left space-y-6">
                <span className="text-xs font-black uppercase tracking-widest text-yellow-500">Le Fondateur</span>
                <h3 className="text-3xl sm:text-4xl font-black text-midnight dark:text-white">Coovi Medessi</h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 flex items-center justify-center lg:justify-start gap-1.5">
                  <MapPin className="w-4 h-4 text-yellow-500" /> Cotonou, Bénin
                </p>
                <div className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 font-medium">
                  <p>
                    Passionné de technologie et visionnaire, Coovi Medessi a fondé MIDEESSI avec la conviction profonde que le Bénin et l'Afrique possèdent tous les talents nécessaires pour créer leur propre avenir technologique.
                  </p>
                  <p>
                    Guidé par les valeurs de patriotisme, d'apprentissage et de solidarité, il incarne l'élan d'un Bénin fier et indépendant technologiquement.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Membres de l'Équipe */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-[#080d1a] border-y border-gray-100 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-black uppercase tracking-widest text-yellow-500">L'équipe</span>
            <h2 className="text-4xl sm:text-5xl font-black text-midnight dark:text-white mt-2">Les talents MIDEESSI</h2>
            <div className="w-16 h-1 bg-yellow-500 mx-auto rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {allMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>

          <div className="mt-20 text-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-yellow-500 hover:bg-yellow-600 text-midnight text-sm font-black rounded-2xl transition-all hover:shadow-xl shadow-yellow-500/20 hover:-translate-y-1"
            >
              Rejoindre le mouvement →
            </a>
          </div>
        </div>
      </section>

      {/* Évolution / Timeline */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#050812] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-black uppercase tracking-widest text-yellow-500">Notre histoire</span>
            <h2 className="text-4xl sm:text-5xl font-black text-midnight dark:text-white mt-2">Notre Évolution</h2>
            <div className="w-16 h-1 bg-yellow-500 mx-auto rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex flex-col p-6 sm:p-8 bg-gray-50 dark:bg-[#080d1a] rounded-[32px] border border-gray-200/40 dark:border-white/5 relative hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 mb-6">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="space-y-3 flex-grow">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-lg uppercase tracking-wider">{item.year}</span>
                  </div>
                  <h3 className="font-bold text-lg md:text-xl text-midnight dark:text-white">{item.event}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Vision Finale */}
      <section className="relative py-28 bg-gradient-to-b from-[#0a0f1e] to-[#040712] text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500 rounded-full blur-[140px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-black uppercase tracking-widest text-yellow-400">Horizon 2035</span>
          <h2 className="text-4xl sm:text-5xl font-black mt-2 mb-8">Notre vision d'avenir</h2>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[40px] p-8 sm:p-14 shadow-2xl max-w-4xl mx-auto mb-16">
            <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed">
              MIDEESSI a pour vision de devenir le catalyseur de référence en Afrique pour le développement de solutions technologiques locales. Nous formons des concepteurs, créons des produits robustes à fort impact et ré-imaginons la souveraineté numérique africaine au quotidien.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
              <div>
                <div className="text-2xl sm:text-4xl md:text-5xl font-black text-yellow-400">100%</div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-2 uppercase tracking-wider font-bold">Indépendant</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl md:text-5xl font-black text-yellow-400">12+</div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-2 uppercase tracking-wider font-bold">Secteurs résolus</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl md:text-5xl font-black text-yellow-400">∞</div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-2 uppercase tracking-wider font-bold">Impact</div>
              </div>
            </div>
          </div>

          <div className="inline-flex flex-col bg-yellow-500/10 border border-yellow-500/20 rounded-2xl px-8 py-5">
            <p className="text-base font-bold text-yellow-400">Nous sommes MIDEESSI</p>
            <p className="text-xs text-gray-400 mt-1">Conçu avec fierté au Bénin, pour le continent et au-delà.</p>
          </div>
        </div>
      </section>

      <PopupDisplay currentPage="about" />
    </div>
  );
};

export default About;