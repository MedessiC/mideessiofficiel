import React, { useState } from 'react';
import { useProjects } from '../contexts/ProjectContext';
import { ProjectStatus } from '../types/project';
import SEO from '../components/SEO';
import { Layers, Globe, Eye, CheckCircle2, ArrowRight, Save, Clock, ExternalLink } from 'lucide-react';

const STAGE_OPTIONS: { key: ProjectStatus; label: string }[] = [
  { key: 'projet_recu', label: '1. Projet reçu' },
  { key: 'brief', label: '2. Brief & Analyse' },
  { key: 'contenu', label: '3. Collecte de contenu' },
  { key: 'developpement', label: '4. Développement' },
  { key: 'revision', label: '5. Révision Client' },
  { key: 'mise_en_ligne', label: '6. Site en Ligne' },
];

export default function AdminProjectsManagement() {
  const { projects, updateProjectStatus } = useProjects();

  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [finalUrls, setFinalUrls] = useState<Record<string, string>>({});

  const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
    const prevUrl = previewUrls[projectId];
    const finUrl = finalUrls[projectId];
    await updateProjectStatus(projectId, newStatus, { preview_url: prevUrl, final_url: finUrl });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111111] pb-28 pt-24">
      <SEO title="Gestion Projets Web — Admin MIDEESSI" description="Administration et production des projets sites web clients." />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#191970] block mb-1">
              Back-office Production
            </span>
            <h1 className="text-3xl font-extrabold text-[#191970] tracking-tight">
              Gestion des Projets Web Clients
            </h1>
            <p className="text-xs text-[#6B7280] mt-1">
              Faites évoluer le statut des projets, ajoutez les liens de démonstration et validez la mise en ligne.
            </p>
          </div>
          <div className="bg-[#191970] text-white px-5 py-3 rounded-2xl text-right">
            <span className="text-[10px] uppercase font-bold text-[#FFD700] block">Total Projets</span>
            <span className="text-2xl font-black">{projects.length}</span>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-[#E5E7EB]">
            <Layers className="h-10 w-10 text-[#9CA3AF] mx-auto mb-3" />
            <h3 className="font-bold text-[#191970]">Aucun projet client pour l'instant</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((prj) => {
              return (
                <div key={prj.id} className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 space-y-6 shadow-sm">
                  {/* Top Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="bg-[#191970]/10 text-[#191970] text-xs font-black uppercase px-3 py-1 rounded-full">
                          {prj.offer_name}
                        </span>
                        <span className="text-xs text-[#6B7280]">
                          Client : <strong className="text-[#111827]">{prj.client_name}</strong> ({prj.client_email} — {prj.client_phone})
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-[#191970]">
                        {prj.activity} — {prj.goal}
                      </h3>
                      <p className="text-xs text-[#4B5563] mt-1">{prj.brief_description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#6B7280]">Statut Actuel :</span>
                      <select
                        value={prj.status}
                        onChange={(e) => handleStatusChange(prj.id, e.target.value as ProjectStatus)}
                        className="bg-[#191970] text-[#FFD700] font-extrabold text-xs px-4 py-2.5 rounded-xl border-none outline-none cursor-pointer"
                      >
                        {STAGE_OPTIONS.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Checklist & Links controls */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Files checklist summary */}
                    <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E5E7EB] space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#191970] block">
                        Fichiers déposés par le client :
                      </span>
                      <div className="space-y-2">
                        {prj.contents_checklist.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs p-2 bg-white rounded-xl border border-[#E5E7EB]">
                            <span>{item.label}</span>
                            {item.status === 'recu' ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                ✓ {item.fileName || 'Reçu'}
                              </span>
                            ) : (
                              <span className="text-amber-600 font-bold">⚠️ Manquant</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* URLs inputs */}
                    <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E5E7EB] space-y-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#191970] block">
                        Liens de démonstration & Site en ligne :
                      </span>

                      <div>
                        <label className="block text-[11px] font-bold text-[#374151] mb-1">
                          Lien de Prévisualisation (Demo)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://demo-site.mideessi.app"
                            value={previewUrls[prj.id] ?? prj.preview_url ?? ''}
                            onChange={(e) => setPreviewUrls({ ...previewUrls, [prj.id]: e.target.value })}
                            className="flex-1 rounded-xl border border-[#E5E7EB] bg-white p-2.5 text-xs text-[#111827] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleStatusChange(prj.id, prj.status)}
                            className="px-4 py-2 bg-[#191970] text-white rounded-xl text-xs font-bold"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#374151] mb-1">
                          Lien du Site Final (Production)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://monentreprise.com"
                            value={finalUrls[prj.id] ?? prj.final_url ?? ''}
                            onChange={(e) => setFinalUrls({ ...finalUrls, [prj.id]: e.target.value })}
                            className="flex-1 rounded-xl border border-[#E5E7EB] bg-white p-2.5 text-xs text-[#111827] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleStatusChange(prj.id, 'mise_en_ligne')}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                          >
                            Mettre en ligne
                          </button>
                        </div>
                      </div>
                    </div>

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
