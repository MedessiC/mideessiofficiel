import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectContext';
import { ProjectStatus, ContentChecklistItem } from '../types/project';
import SEO from '../components/SEO';

const STAGES: { key: ProjectStatus; label: string; desc: string }[] = [
  { key: 'projet_recu', label: 'Projet reçu', desc: 'Prise en charge initiale' },
  { key: 'brief', label: 'Brief & Analyse', desc: 'Spécifications métier' },
  { key: 'contenu', label: 'Collecte de Contenu', desc: 'Visuels & Textes transmis' },
  { key: 'developpement', label: 'Développement', desc: 'Programmation & Intégration' },
  { key: 'revision', label: 'Révision Client', desc: 'Vérifications & Ajustements' },
  { key: 'mise_en_ligne', label: 'Mise en ligne', desc: 'Site publié en production' },
];

export default function ClientProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, updateChecklistItem, addRevisionRequest } = useProjects();

  const project = getProjectById(id || '');

  // File Upload State Modal
  const [selectedItemForUpload, setSelectedItemForUpload] = useState<ContentChecklistItem | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileUrl, setUploadFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Revision Form State
  const [revisionComment, setRevisionComment] = useState('');
  const [isRevisionSubmitting, setIsRevisionSubmitting] = useState(false);
  const [revisionSuccess, setRevisionSuccess] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center font-sans">
        <span className="text-xs font-mono font-bold uppercase text-[#6B7280] block mb-2">[ INTROUVABLE ]</span>
        <h2 className="text-2xl font-black text-[#191970]">Projet introuvable</h2>
        <p className="text-xs text-[#6B7280] mt-2 mb-6">Le projet demandé n'existe pas ou a été déplacé.</p>
        <Link to="/clients/projets" className="px-6 py-2.5 rounded-xl bg-[#191970] text-white font-black text-xs">
          Retour à mes projets
        </Link>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex((s) => s.key === project.status);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForUpload || !uploadFileName) return;

    setIsUploading(true);
    const mockUrl = uploadFileUrl || `https://storage.mideessi.com/files/${uploadFileName}`;

    await updateChecklistItem(project.id, selectedItemForUpload.id, mockUrl, uploadFileName);

    setIsUploading(false);
    setSelectedItemForUpload(null);
    setUploadFileName('');
    setUploadFileUrl('');
  };

  const handleRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionComment.trim()) return;

    setIsRevisionSubmitting(true);
    await addRevisionRequest(project.id, revisionComment);
    setIsRevisionSubmitting(false);
    setRevisionComment('');
    setRevisionSuccess(true);
    setTimeout(() => setRevisionSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] pb-28 pt-24 font-sans">
      <SEO title={`${project.activity} — Suivi Projet MIDEESSI`} description="Interface de suivi de production de votre site web." />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-8">

        {/* Back link & Title Header */}
        <div>
          <Link
            to="/clients/projets"
            className="inline-flex items-center text-xs font-mono font-bold text-[#6B7280] hover:text-[#191970] mb-4 transition-colors"
          >
            RETOUR À LA LISTE DES PROJETS
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#191970] text-[#FFD700] text-[10px] font-mono font-bold uppercase px-3 py-1 rounded">
                  {project.offer_name}
                </span>
                <span className="text-xs text-[#6B7280]">
                  Commandé le {new Date(project.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <h1 className="text-3xl font-black text-[#191970] tracking-tight">
                {project.activity} — {project.client_name}
              </h1>
              <p className="text-xs text-[#4B5563] mt-1 max-w-2xl leading-relaxed">{project.brief_description}</p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1.5 border-t md:border-t-0 md:border-l border-[#E5E7EB] pt-4 md:pt-0 md:pl-6">
              <span className="text-[10px] font-mono font-bold text-[#6B7280] uppercase">INVESTISSEMENT TOTAL</span>
              <span className="text-2xl font-black text-[#191970]">{project.price_total.toLocaleString('fr-FR')} FCFA</span>
              {project.payment_type === 'installment' && (
                <span className="text-[9px] font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded uppercase">
                  Paiement Échelonné ({project.payment_schedule.paid_installments} / {project.payment_schedule.installments_count + 1} réglés)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ════════ 1. VISUAL PROGRESSION STEPPER ════════ */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#191970] block">
                AVANCEMENT DE PRODUCTION
              </span>
              <h3 className="text-xl font-black text-[#111827]">Jalons du projet</h3>
            </div>
            <span className="bg-[#191970] text-[#FFD700] text-xs font-mono font-bold px-3 py-1 rounded">
              Délai : {project.estimated_days}
            </span>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {STAGES.map((stg, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={stg.key}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'border-[#191970] bg-[#191970]/5 shadow-sm font-bold'
                      : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-[#E5E7EB] bg-[#FAFAFA] opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      isCurrent
                        ? 'bg-[#191970] text-white'
                        : isCompleted
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#E5E7EB] text-[#6B7280]'
                    }`}>
                      Étape 0{idx + 1}
                    </span>
                    {isCompleted && <span className="text-[10px] font-mono font-bold text-emerald-700">[ OK ]</span>}
                    {isCurrent && <span className="text-[10px] font-mono font-bold text-[#191970]">[ EN COURS ]</span>}
                  </div>

                  <div>
                    <h4 className={`text-xs font-extrabold ${isCurrent ? 'text-[#191970]' : 'text-[#111827]'}`}>
                      {stg.label}
                    </h4>
                    <p className="text-[10px] text-[#6B7280] leading-snug mt-1">{stg.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════ 2. LIVE SITE OR PREVIEW MODULE ════════ */}
        {project.status === 'mise_en_ligne' || project.final_url ? (
          <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 tracking-widest block">PUBLICATION EFFECTUÉE</span>
              <h3 className="text-2xl font-black text-emerald-950">Votre site web est officiellement en ligne</h3>
              <p className="text-xs text-emerald-800 mt-1">Votre établissement et vos services sont désormais accessibles à tous vos clients.</p>
            </div>

            <a
              href={project.final_url || 'https://mideessi.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 text-white font-black text-xs hover:bg-emerald-800 transition-all shadow-sm flex-shrink-0"
            >
              Accéder au site publié
            </a>
          </div>
        ) : (project.status === 'developpement' || project.status === 'revision' || project.preview_url) ? (
          <div className="rounded-3xl border border-[#191970]/20 bg-[#191970]/5 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#191970] tracking-widest block">RENDU INTERACTIF</span>
              <h4 className="text-xl font-black text-[#111827]">Prévisualisation de votre maquette</h4>
              <p className="text-xs text-[#6B7280] mt-1">Consultez l'intégration actuelle de votre site et demandez des retouches si besoin.</p>
            </div>

            {project.preview_url && (
              <a
                href={project.preview_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#191970] text-white font-black text-xs hover:bg-[#141560] transition-colors flex-shrink-0"
              >
                Ouvrir la démonstration 
              </a>
            )}
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ════════ 3. CONTENT CHECKLIST (2 COLS) ════════ */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#191970] block mb-1">
                DOSSIER DE CONTENUS
              </span>
              <h3 className="text-2xl font-black text-[#111827] tracking-tight">
                Éléments requis pour la réalisation
              </h3>
              <p className="text-xs text-[#6B7280] mt-1">
                Transmettez vos fichiers (logo, photos, textes) pour alimenter la conception.
              </p>
            </div>

            <div className="space-y-3">
              {project.contents_checklist.map((item) => {
                const isRecu = item.status === 'recu';

                return (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      isRecu ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-[#111827]">{item.label}</span>
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          isRecu ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                        }`}>
                          {isRecu ? '[ REÇU ]' : '[ MANQUANT ]'}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1">{item.description}</p>
                      {isRecu && item.fileName && (
                        <div className="text-[11px] font-mono font-semibold text-emerald-900 mt-1">
                          Document : {item.fileName}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedItemForUpload(item)}
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                        isRecu
                          ? 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-[#191970] text-[#FFD700] hover:bg-[#141560]'
                      }`}
                    >
                      {isRecu ? 'Remplacer le document' : 'Transmettre le fichier'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ════════ 4. REVISIONS & MESSAGES (1 COL) ════════ */}
          <div className="space-y-6">

            {/* Revisions Box */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <h4 className="font-black text-sm text-[#191970]">Demande de retouches</h4>
                <span className="bg-[#191970]/10 text-[#191970] text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  {project.revisions.length} / {project.max_revisions} révisions
                </span>
              </div>

              <p className="text-xs text-[#6B7280] leading-relaxed">
                Formulez les ajustements souhaités sur votre maquette.
              </p>

              {revisionSuccess && (
                <div className="p-3 text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl">
                  ✓ Votre demande de retouche a bien été transmise à l'équipe.
                </div>
              )}

              <form onSubmit={handleRevisionSubmit} className="space-y-3">
                <textarea
                  rows={3}
                  value={revisionComment}
                  onChange={(e) => setRevisionComment(e.target.value)}
                  placeholder="Ajustements souhaités (textes, visuels, mise en page)..."
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-xs text-[#111827] outline-none focus:border-[#191970]"
                />
                <button
                  type="submit"
                  disabled={isRevisionSubmitting || !revisionComment.trim()}
                  className="w-full py-2.5 rounded-xl bg-[#191970] text-white text-xs font-black hover:bg-[#141560] disabled:opacity-50 transition-colors"
                >
                  Envoyer la demande de révision
                </button>
              </form>

              {/* History of revisions */}
              {project.revisions.length > 0 && (
                <div className="border-t border-[#E5E7EB] pt-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#6B7280]">Demandes enregistrées :</span>
                  {project.revisions.map((rev) => (
                    <div key={rev.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] mb-1">
                        <span>{rev.date}</span>
                        <span className="font-bold text-[#191970] uppercase">{rev.status}</span>
                      </div>
                      <p className="text-[#374151] font-medium">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assistance Box */}
            <div className="bg-[#191970] text-white p-6 rounded-3xl space-y-3 shadow-sm">
              <span className="text-[9px] font-mono font-bold uppercase text-[#FFD700] block">ASSISTANCE MIDEESSI</span>
              <h4 className="font-bold text-sm text-white">Besoin d'accompagnement ?</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Notre équipe est disponible pour vous guider dans la préparation de vos documents.
              </p>
              <Link
                to="/contact"
                className="inline-block text-xs font-mono font-bold text-[#FFD700] hover:underline pt-1"
              >
                Contacter l'équipe technique 
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* FILE UPLOAD MODAL */}
      {selectedItemForUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-sans">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-[#191970] block">TRANSMISSION DOCUMENT</span>
                <h4 className="font-black text-sm text-[#111827]">{selectedItemForUpload.label}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemForUpload(null)}
                className="text-xs font-mono font-bold text-[#6B7280] hover:text-[#111827]"
              >
                [ FERMER ]
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Nom du document
                </label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="Ex: logo_officiel.png ou visuels.zip"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-xs text-[#111827] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Lien du fichier (Drive / Dropbox) ou URL
                </label>
                <input
                  type="url"
                  value={uploadFileUrl}
                  onChange={(e) => setUploadFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-xs text-[#111827] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForUpload(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-[#6B7280] hover:bg-[#F3F4F6]"
                >
                  ANNULER
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-[#191970] text-white text-xs font-black hover:bg-[#141560]"
                >
                  {isUploading ? 'Enregistrement...' : 'Enregistrer le document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
