import React from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectContext';
import { useClientAuth } from '../contexts/ClientContext';
import SEO from '../components/SEO';
import { ProjectStatus } from '../types/project';

const STATUS_LABELS: Record<ProjectStatus, { label: string; progress: number }> = {
  projet_recu: { label: 'PROJET REÇU', progress: 15 },
  brief: { label: 'BRIEF & ANALYSE', progress: 30 },
  contenu: { label: 'COLLECTE DU CONTENU', progress: 45 },
  developpement: { label: 'DÉVELOPPEMENT', progress: 75 },
  revision: { label: 'RÉVISION CLIENT', progress: 90 },
  mise_en_ligne: { label: 'SITE EN LIGNE', progress: 100 },
};

export default function ClientProjects() {
  const { projects } = useProjects();
  const { user } = useClientAuth();

  const clientProjects = projects.filter(
    (p) => !user || p.client_id === user.client_id || p.user_id === user.id
  );

  const displayProjects = clientProjects.length > 0 ? clientProjects : projects;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] pb-28 pt-24 font-sans">
      <SEO title="Mes Projets Web — MIDEESSI" description="Suivez l'avancement et la production de vos sites web MIDEESSI." />

      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-[#E5E7EB] pb-6">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#191970] block mb-1">
              ESPACE CLIENT MIDEESSI
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#191970] tracking-tight">
              Projets Web en Cours
            </h1>
          </div>

          <Link
            to="/commander"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#191970] text-[#FFD700] font-black text-xs hover:bg-[#141560] transition-transform hover:scale-105 shadow-sm flex-shrink-0"
          >
            + NOUVEAU PROJET WEB
          </Link>
        </div>

        {/* Projects Grid */}
        {displayProjects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <span className="text-xs font-mono font-bold uppercase text-[#6B7280] block">[ AUCUN PROJET EN COURS ]</span>
            <h3 className="text-xl font-black text-[#191970]">Démarrer la création de votre site</h3>
            <p className="text-xs text-[#6B7280]">
              Sélectionnez la formule de votre choix et paramétrez votre besoin en quelques clics.
            </p>
            <Link
              to="/commander"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#191970] text-white font-black text-xs"
            >
              Commander un site web &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayProjects.map((prj) => {
              const statusInfo = STATUS_LABELS[prj.status] || STATUS_LABELS.projet_recu;

              return (
                <div
                  key={prj.id}
                  className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B7280]">
                        {prj.offer_name}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-md bg-[#191970] text-[#FFD700]">
                        {statusInfo.label}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#191970] tracking-tight mb-2">
                      {prj.activity} — {prj.client_name}
                    </h3>
                    <p className="text-xs text-[#4B5563] line-clamp-2 mb-6 leading-relaxed">
                      {prj.brief_description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-6 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E5E7EB]">
                      <div className="flex items-center justify-between text-xs font-mono font-bold">
                        <span className="text-[#111827]">PROGRESSION</span>
                        <span className="text-[#191970]">{statusInfo.progress}%</span>
                      </div>
                      <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#191970] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${statusInfo.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                    <div className="text-xs">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#6B7280] block">Délai estimé</span>
                      <span className="font-extrabold text-[#111827]">{prj.estimated_days}</span>
                    </div>

                    <Link
                      to={`/clients/projets/${prj.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#191970] text-white font-black text-xs hover:bg-[#141560] transition-colors"
                    >
                      Ouvrir le dossier &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
