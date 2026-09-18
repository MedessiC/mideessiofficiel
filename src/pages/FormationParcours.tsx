import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, BookOpen, ClipboardList } from 'lucide-react';
import { getFormationBySlug } from '../data/formationsData';

const FormationParcours = () => {
  const { slug } = useParams<{ slug: string }>();
  const formation = getFormationBySlug(slug || '');
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});

  const blocks = useMemo(() => formation?.roadmap || [], [formation]);

  if (!formation) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-32 px-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#111827]">Formation introuvable</h1>
          <p className="mt-3 text-sm text-[#4B5563]">Le parcours demandé n’existe pas.</p>
          <Link to="/apprendre" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#191970] px-4 py-2 text-sm font-semibold text-white">
            <ArrowLeft size={16} /> Retour à Apprendre
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7280] sm:text-xs">Parcours</p>
            <h1 className="mt-2 text-2xl font-bold text-[#111827] sm:text-3xl md:text-4xl">{formation.title}</h1>
          </div>
          <Link to={`/apprendre/formations/${formation.slug}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-[#111827] shadow-sm sm:px-4">
            <ArrowLeft size={16} />
            <span>Retour</span>
          </Link>
        </div>

        <div className="mb-6 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:mb-10 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[#4B5563]">Progression du parcours</p>
              <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">0% complété</h2>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F3F4F6] sm:max-w-md">
              <div className="h-full w-0 rounded-full bg-[#191970]" />
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {blocks.map((block, index) => (
            <div key={block.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#191970] text-sm font-bold text-white sm:h-12 sm:w-12">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#111827] sm:text-xl">{block.title}</h3>
                    <p className="mt-1 text-sm text-[#4B5563]">{block.objective}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B7280] sm:px-3 sm:text-xs">
                    {block.duration}
                  </span>
                  <Link
                    to={index === 0 ? '/apprendre/formations/developpement-web/fondamentaux-web' : '#'}
                    className="rounded-xl bg-[#191970] px-3 py-2 text-sm font-semibold text-white sm:px-4"
                  >
                    Ouvrir
                  </Link>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl bg-[#F9FAFB] p-3 sm:p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#111827]">
                    <BookOpen size={16} className="text-[#191970]" /> Cours
                  </div>
                  <ul className="space-y-2 text-sm text-[#4B5563]">
                    {block.lessons.map((lesson) => (
                      <li key={lesson} className="flex items-start gap-2">
                        <Circle size={10} className="mt-1.5 text-[#191970]" />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-[#F9FAFB] p-3 sm:p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#111827]">
                    <ClipboardList size={16} className="text-[#191970]" /> Projet
                  </div>
                  <p className="text-sm text-[#4B5563] leading-relaxed">{block.project}</p>
                </div>

                <div className="rounded-xl bg-[#F9FAFB] p-3 sm:p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#111827]">
                    <CheckCircle2 size={16} className="text-[#191970]" /> Livrable
                  </div>
                  <p className="text-sm text-[#4B5563] leading-relaxed">{block.deliverable}</p>
                </div>
              </div>

              {block.details?.length > 0 && (
                <div className="mt-4 border-t border-[#E5E7EB] pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedBlocks((prev) => ({
                        ...prev,
                        [block.id]: !prev[block.id],
                      }))
                    }
                    className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#191970]"
                  >
                    {expandedBlocks[block.id] ? 'Lire moins' : 'Lire plus'}
                  </button>

                  {expandedBlocks[block.id] && (
                    <div className="mt-4 space-y-3">
                      {block.details.map((detail) => (
                        <div key={detail.title} className="rounded-xl bg-[#F9FAFB] p-3 sm:p-4">
                          <h4 className="text-sm font-bold text-[#111827] sm:text-base">{detail.title}</h4>
                          <p className="mt-2 text-sm leading-7 text-[#4B5563]">{detail.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormationParcours;
