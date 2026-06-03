import { useEffect, useState } from 'react';
import { Users, Zap, Target } from 'lucide-react';

const MIDEESSIStats = () => {
  const [stats, setStats] = useState({
    members: 0,
    solutions: 0,
    impact: 0,
  });

  useEffect(() => {
    // Essayer de récupérer les stats depuis localStorage (ou une API future)
    const savedStats = localStorage.getItem('mideessi_stats');
    
    if (savedStats) {
      const saved = JSON.parse(savedStats);
      setStats(saved);
    } else {
      // Valeurs initiales
      const initialStats = {
        members: 47,
        solutions: 12,
        impact: 50000,
      };
      setStats(initialStats);
      localStorage.setItem('mideessi_stats', JSON.stringify(initialStats));
    }
  }, []);

  const StatCard = ({ 
    icon, 
    value, 
    label, 
    suffix = '',
    color 
  }: { 
    icon: React.ReactNode;
    value: number;
    label: string;
    suffix?: string;
    color: 'gold' | 'green' | 'blue';
  }) => {
    const colorClasses = {
      gold: 'from-gold/10 to-gold/5 text-gold',
      green: 'from-green-500/10 to-green-500/5 text-green-600 dark:text-green-400',
      blue: 'from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400',
    };

    const borderClasses = {
      gold: 'border-gold/30 hover:border-gold/60',
      green: 'border-green-500/30 hover:border-green-500/60',
      blue: 'border-blue-500/30 hover:border-blue-500/60',
    };

    return (
      <div
        className={`bg-gradient-to-br ${colorClasses[color]} border ${borderClasses[color]} rounded-xl md:rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
      >
        <div className="flex justify-center mb-4">
          <div className={`p-3 md:p-4 bg-${color} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
        <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
          {value.toLocaleString('fr-FR')}
          {suffix}
        </div>
        <p className="text-sm md:text-base font-semibold opacity-90">{label}</p>
      </div>
    );
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold text-gold uppercase tracking-widest">Impact MIDEESSI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-midnight dark:text-white mb-4">
            Les Chiffres de notre Mouvement
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-gold to-gold/50 mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto text-base md:text-lg">
            Une communauté croissante de talents béninois dédiés à l'indépendance technologique et à l'innovation 100% béninoise
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <StatCard
            icon={<Users className="w-8 h-8 md:w-10 md:h-10" />}
            value={stats.members}
            label="Membres actifs"
            suffix="+"
            color="gold"
          />
          <StatCard
            icon={<Zap className="w-8 h-8 md:w-10 md:h-10" />}
            value={stats.solutions}
            label="Solutions lancées"
            color="green"
          />
          <StatCard
            icon={<Target className="w-8 h-8 md:w-10 md:h-10" />}
            value={stats.impact}
            label="Vies impactées"
            suffix="+"
            color="blue"
          />
        </div>

        {/* Additional Info */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: '2025',
              description: 'Année de fondation',
              emoji: '🇧🇯'
            },
            {
              title: '4',
              description: 'Trimestres / 4 solutions/an',
              emoji: '📅'
            },
            {
              title: '∞',
              description: 'Impact potentiel pour l\'Afrique',
              emoji: '🌍'
            }
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl mb-2">{item.emoji}</div>
              <div className="text-2xl font-bold text-midnight dark:text-white mb-1">
                {item.title}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MIDEESSIStats;
