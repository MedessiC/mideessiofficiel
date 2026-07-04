import { useState, useEffect } from 'react';
import { X, Download, Maximize2, Minimize2, ExternalLink, BookOpen, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface PdfReaderProps {
  pdfUrl: string;
  title?: string;
  /** If true, renders as a full-page overlay modal */
  modal?: boolean;
  /** Called when the close button is clicked (modal mode) */
  onClose?: () => void;
}

/**
 * PdfReader — renders a PDF using a native <iframe>.
 *
 * Two modes:
 *  - modal: overlay covering the full viewport
 *  - inline: embedded block inside a page section
 */
export default function PdfReader({ pdfUrl, title = 'Lecture du PDF', modal = false, onClose }: PdfReaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [modal]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = title.replace(/\s+/g, '_') + '.pdf';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  const iframeSrc = pdfUrl.includes('cloudinary.com')
    ? pdfUrl   // Cloudinary PDFs load directly
    : `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`;

  const toolbar = (
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[var(--brand-midnight)] border-b border-white/10 flex-shrink-0">
      {/* Left: book icon + title */}
      <div className="flex items-center gap-2 min-w-0">
        <BookOpen className="w-4 h-4 text-[var(--brand-gold)] flex-shrink-0" />
        <span className="text-white font-semibold text-sm truncate">{title}</span>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Open in new tab */}
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title="Ouvrir dans un nouvel onglet"
        >
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title="Télécharger"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Fullscreen toggle (inline mode only) */}
        {!modal && (
          <button
            onClick={() => setIsFullscreen(f => !f)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title={isFullscreen ? 'Réduire' : 'Plein écran'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        )}

        {/* Close (modal mode or inline fullscreen) */}
        {(modal || isFullscreen) && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-white transition-colors ml-1"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {!modal && isFullscreen && !onClose && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-white transition-colors ml-1"
            title="Fermer le plein écran"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  const iframeSection = (
    <div className="relative flex-1 bg-gray-900 overflow-hidden">
      {/* Loading overlay */}
      {loading && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10 gap-4">
          <div className="w-12 h-12 border-4 border-[var(--brand-gold)] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Chargement du PDF...</p>
        </div>
      )}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10 gap-4 px-6 text-center">
          <p className="text-white text-sm font-semibold">Impossible de charger ce PDF.</p>
          <p className="text-sm text-white/70">Vérifiez que le lien est un PDF public ou hébergé sur Cloudinary.</p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-gold)] text-[var(--brand-midnight)] font-semibold text-xs"
          >
            Ouvrir dans un nouvel onglet
          </a>
        </div>
      )}
      <iframe
        src={iframeSrc}
        title={title}
        className="w-full h-full border-none"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setLoadError(true);
        }}
        allow="fullscreen"
      />
    </div>
  );

  // ── Modal mode ──────────────────────────────────────────────────────────────
  if (modal) {
    return (
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={`Lecteur PDF — ${title}`}
      >
        {toolbar}
        {iframeSection}
      </div>
    );
  }

  // ── Inline mode (possibly fullscreen) ──────────────────────────────────────
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        {toolbar}
        {iframeSection}
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--brand-midnight)]/20 shadow-2xl flex flex-col"
         style={{ height: 'min(80vh, 900px)' }}>
      {toolbar}
      {iframeSection}
    </div>
  );
}
