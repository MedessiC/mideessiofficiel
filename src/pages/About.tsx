import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Flag, BookOpen, Lightbulb, Users } from 'lucide-react';
import TeamMemberCard from '../components/TeamMemberCard';
import { teamMembers } from '../data/teamMembers';
import { getDynamicTeamMembers } from '../lib/contentManagement';

const About = () => {
  const [dynamicMembers, setDynamicMembers] = useState(getDynamicTeamMembers());
  const allMembers = [...teamMembers, ...dynamicMembers];

  useEffect(() => {
    document.title = 'Notre Mission — MIDEESSI';
    const handler = () => setDynamicMembers(getDynamicTeamMembers());
    window.addEventListener('mideessi-content-updated', handler);
    return () => window.removeEventListener('mideessi-content-updated', handler);
  }, []);

  const values = [
    {
      icon: <Flag className="w-5 h-5 text-[#191970]" />,
      title: 'Patriotisme',
      description: 'Chaque solution est construite par nous et pour nous, pour la souveraineté technologique du Bénin et de l’Afrique.',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-[#191970]" />,
      title: 'Apprentissage',
      description: 'L’expérience du terrain prime. Nous apprenons en écoutant, en créant et en adaptant nos solutions.',
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-[#191970]" />,
      title: 'Innovation utile',
      description: 'Concevoir des réponses technologiques adaptées aux réalités locales plutôt que de copier des modèles externes.',
    },
    {
      icon: <Users className="w-5 h-5 text-[#191970]" />,
      title: 'Solidarité',
      description: 'Bâtir un écosystème de collaboration où les compétences locales créent de la valeur collective.',
    },
  ];

  return (
    <div style={{ backgroundColor: '#FAFAFA' }}>

      {/* ── Section Hero / Intro ── */}
      <section style={{ paddingTop: 'clamp(64px, 10vh, 120px)', paddingBottom: '64px' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-[0.14em] mb-4 block" style={{ color: '#6B7280' }}>
              Mission & Philosophie
            </span>
            <div className="w-12 h-0.5 mb-8" style={{ backgroundColor: '#E5E7EB' }} />
            <h1
              className="font-bold mb-6"
              style={{
                fontSize: 'clamp(36px, 6vw, 64px)',
                lineHeight: 1.05,
                color: '#191970',
                letterSpacing: '-0.02em',
              }}
            >
              Créer nos propres solutions technologiques.
            </h1>
            <p
              className="text-base leading-relaxed mb-8 max-w-2xl"
              style={{ color: '#4B5563', fontSize: 'clamp(16px, 2vw, 19px)' }}
            >
              MIDEESSI est né d'un constat simple : trop de technologies sont importées en Afrique sans comprendre nos réalités.
              Notre mission est de bâtir l'indépendance numérique locale à travers des solutions ancrées dans le terrain.
            </p>
            <div
              className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-[#E5E7EB]"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FFD700' }} />
              <span className="text-sm font-medium" style={{ color: '#111111' }}>
                « Notre souveraineté est technologique. »
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section Méthode ── */}
      <section id="methode" style={{ backgroundColor: '#FFFFFF', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <span className="text-xs font-medium uppercase tracking-[0.14em] mb-4 block" style={{ color: '#6B7280' }}>
              Méthodologie de terrain
            </span>
            <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: '#E5E7EB' }} />
            <h2 className="font-bold mb-4" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#191970' }}>
              Observer → Comprendre → Construire
            </h2>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: '#4B5563' }}>
              Technologie doit s'adapter aux personnes. Jamais l'inverse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Observer',
                text: 'Nous allons à la rencontre des acteurs du quotidien : commerçants, étudiants, artisans, organisations. Nous identifions les problèmes réels.',
              },
              {
                step: '02',
                title: 'Comprendre',
                text: 'Nous écoutons et analysons le contexte local sans préjugé technologique ni calque venu d’ailleurs.',
              },
              {
                step: '03',
                title: 'Construire',
                text: 'Nous développons des outils numériques simples, accessibles et pérennes, spécialement pensés pour nos usages.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-[#FAFAFA] rounded-2xl p-8 border border-[#E5E7EB]"
              >
                <span className="block text-xs font-medium uppercase tracking-[0.12em] mb-4" style={{ color: '#6B7280' }}>
                  Étape {item.step}
                </span>
                <h3 className="font-bold text-xl mb-3" style={{ color: '#191970' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section Valeurs ── */}
      <section style={{ backgroundColor: '#FAFAFA', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <span className="text-xs font-medium uppercase tracking-[0.14em] mb-4 block" style={{ color: '#6B7280' }}>
              Principes directeurs
            </span>
            <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: '#E5E7EB' }} />
            <h2 className="font-bold mb-4" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#191970' }}>
              Nos valeurs cardinales
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-7 border border-[#E5E7EB]"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center mb-5">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: '#191970' }}>
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fondateur ── */}
      <section style={{ backgroundColor: '#FFFFFF', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="/medessicoovi.webp"
                  alt="Coovi Medessi"
                  className="w-full h-80 md:h-[420px] object-cover object-top rounded-2xl"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="md:col-span-7">
              <span className="text-xs font-medium uppercase tracking-[0.14em] mb-4 block" style={{ color: '#6B7280' }}>
                Le Fondateur
              </span>
              <h2 className="font-bold text-3xl mb-2" style={{ color: '#191970' }}>
                Coovi Medessi
              </h2>
              <p className="text-xs font-medium flex items-center gap-1.5 mb-6" style={{ color: '#6B7280' }}>
                <MapPin size={14} style={{ color: '#FFD700' }} /> Cotonou, Bénin
              </p>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#4B5563' }}>
                <p>
                  Passionné de technologie et convaincu du potentiel des talents béninois, Coovi Medessi a fondé MIDEESSI avec l'ambition de bâtir des alternatives technologiques autonomes et crédibles.
                </p>
                <p>
                  MIDEESSI n'est pas une simple entreprise commerciale. C'est une démarche visant à démontrer que la technologie pensée pour et par les Africains rivalise en qualité et en impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section Équipe ── */}
      <section id="team" style={{ backgroundColor: '#FAFAFA', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <span className="text-xs font-medium uppercase tracking-[0.14em] mb-4 block" style={{ color: '#6B7280' }}>
              Les personnes derrière MIDEESSI
            </span>
            <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: '#E5E7EB' }} />
            <h2 className="font-bold mb-4" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#191970' }}>
              L'Équipe
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl">
            {allMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>

          <div className="mt-12">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#191970] text-[#FAFAFA] px-6 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[#141560]"
            >
              Rejoindre l'aventure
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;