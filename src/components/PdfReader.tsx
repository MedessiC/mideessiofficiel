import { useEffect, useRef, useState, useCallback } from 'react';
import {
  X, Download, ExternalLink, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCw, BookOpen, Loader2
} from 'lucide-react';

interface PdfReaderProps {
  pdfUrl: string;
  title?: string;
  modal?: boolean;
  onClose?: () => void;
}

export default function PdfReader({ pdfUrl, title = 'Lecture du PDF', modal = false, onClose }: PdfReaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState('1');
  const [rendering, setRendering] = useState(false);

  const isCloudinary = pdfUrl.includes('cloudinary.com');
  const effectiveUrl = isCloudinary ? `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}` : pdfUrl;

  // Lock/unlock body scroll for modal
  useEffect(() => {
    if (modal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [modal]);

  // Load PDF document
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
        // @ts-ignore
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.js', import.meta.url).toString();

        const loadingTask = pdfjs.getDocument(effectiveUrl);
        const doc = await loadingTask.promise;
        if (cancelled) return;
        setPdfDoc(doc);
        setPageCount(doc.numPages);
        setPageNum(1);
        setPageInput('1');
        setRotation(0);

        // Auto-fit: compute scale to fit container width
        try {
          const firstPage = await doc.getPage(1);
          const viewport = firstPage.getViewport({ scale: 1.0 });
          const container = scrollContainerRef.current;
          if (container) {
            const availWidth = container.clientWidth - 48; // 24px padding each side
            const fitScale = Math.min(availWidth / viewport.width, 2.0);
            setScale(Math.max(0.5, +(fitScale).toFixed(2)));
          } else {
            setScale(1.0);
          }
        } catch {
          setScale(1.0);
        }
      } catch (err: any) {
        console.error('PDF load error', err);
        if (!cancelled) setError(err?.message || 'Erreur chargement PDF');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [effectiveUrl]);

  // Render current page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;
      setRendering(true);
      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * ratio);
        canvas.height = Math.floor(viewport.height * ratio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context!.setTransform(ratio, 0, 0, ratio, 0, 0);
        const renderContext = { canvasContext: context!, viewport };
        await page.render(renderContext).promise;
      } catch (err) {
        console.error('Render page error', err);
        setError('Erreur rendu PDF');
      } finally {
        setRendering(false);
      }
    };
    renderPage();
  }, [pdfDoc, pageNum, scale, rotation]);

  // Update page input when pageNum changes
  useEffect(() => { setPageInput(String(pageNum)); }, [pageNum]);

  // Navigation helpers
  const prev = useCallback(() => setPageNum(p => Math.max(1, p - 1)), []);
  const next = useCallback(() => setPageNum(p => Math.min(pageCount || p + 1, p + 1)), [pageCount]);
  const zoomIn = useCallback(() => setScale(s => Math.min(3, +(s + 0.25).toFixed(2))), []);
  const zoomOut = useCallback(() => setScale(s => Math.max(0.5, +(s - 0.25).toFixed(2))), []);
  const rotatePage = useCallback(() => setRotation(r => (r + 90) % 360), []);

  const goToPage = useCallback((value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= pageCount) {
      setPageNum(num);
    } else {
      setPageInput(String(pageNum));
    }
  }, [pageCount, pageNum]);

  const download = useCallback(() => {
    const a = document.createElement('a');
    const href = isCloudinary ? pdfUrl : effectiveUrl;
    a.href = href;
    a.download = `${title.replace(/\s+/g, '_')}.pdf`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [pdfUrl, effectiveUrl, isCloudinary, title]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) { onClose(); return; }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
      if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); }
      if (e.key === '-') { e.preventDefault(); zoomOut(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next, zoomIn, zoomOut]);

  const progress = pageCount > 0 ? (pageNum / pageCount) * 100 : 0;

  // ── Toolbar ────────────────────────────────────────────────────────────────
  const toolbar = (
    <div className="flex flex-col gap-0">
      {/* Main toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 bg-[var(--brand-midnight)] border-b border-white/10">
        {/* Left: Navigation */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={prev}
            disabled={pageNum <= 1}
            title="Page précédente (←)"
            className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Page input */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
            <input
              type="text"
              inputMode="numeric"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={(e) => goToPage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') goToPage(pageInput); }}
              className="w-8 sm:w-10 text-center bg-transparent text-white text-xs sm:text-sm font-bold outline-none"
              aria-label="Numéro de page"
            />
            <span className="text-white/40 text-xs font-medium">/ {pageCount || '–'}</span>
          </div>

          <button
            onClick={next}
            disabled={pageNum >= pageCount}
            title="Page suivante (→)"
            className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Center: Zoom (hidden on very small screens) */}
        <div className="hidden xs:flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={zoomOut}
            title="Zoom arrière (−)"
            className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-white/60 text-[10px] sm:text-xs font-bold min-w-[36px] text-center tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            title="Zoom avant (+)"
            className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
          >
            <ZoomIn size={16} />
          </button>

          {/* Rotate - desktop only */}
          <button
            onClick={rotatePage}
            title="Rotation"
            className="hidden md:flex min-w-[40px] min-h-[40px] items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
          >
            <RotateCw size={16} />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={download}
            title="Télécharger"
            className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg bg-[var(--brand-gold)]/15 hover:bg-[var(--brand-gold)]/25 text-[var(--brand-gold)] transition-all active:scale-95"
          >
            <Download size={16} />
          </button>
          <a
            href={effectiveUrl}
            target="_blank"
            rel="noreferrer"
            title="Ouvrir dans un nouvel onglet"
            className="hidden sm:flex min-w-[40px] min-h-[40px] items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
          >
            <ExternalLink size={16} />
          </a>
          <button
            onClick={() => setIsFullscreen(f => !f)}
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
            className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              title="Fermer (Esc)"
              className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all active:scale-95"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-white/5 w-full">
        <div
          className="h-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  // ── Mobile zoom controls (shown on small screens where toolbar zoom is hidden) ──
  const mobileZoomControls = (
    <div className="flex xs:hidden items-center justify-center gap-2 px-3 py-1.5 bg-[var(--brand-midnight)] border-t border-white/10">
      <button
        onClick={zoomOut}
        className="min-w-[34px] min-h-[34px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
      >
        <ZoomOut size={14} />
      </button>
      <span className="text-white/60 text-[10px] font-bold min-w-[32px] text-center tabular-nums">
        {Math.round(scale * 100)}%
      </span>
      <button
        onClick={zoomIn}
        className="min-w-[34px] min-h-[34px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
      >
        <ZoomIn size={14} />
      </button>
      <button
        onClick={rotatePage}
        className="min-w-[34px] min-h-[34px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
      >
        <RotateCw size={14} />
      </button>
    </div>
  );

  // ── Content area ───────────────────────────────────────────────────────────
  const content = (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-auto flex items-start justify-center p-4 sm:p-6 bg-gray-100 dark:bg-gray-900/50"
      style={{ backgroundImage: 'radial-gradient(circle at center, rgba(25,25,112,0.03) 0%, transparent 70%)' }}
    >
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-[var(--brand-gold)] border-t-transparent rounded-full animate-spin" />
            <BookOpen className="absolute inset-0 m-auto w-5 h-5 text-[var(--brand-gold)] opacity-60" />
          </div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Chargement du PDF…</p>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
            <X className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
          <p className="text-xs text-gray-400">Vérifiez votre connexion ou essayez de recharger la page.</p>
        </div>
      )}
      {!loading && !error && (
        <div className="relative">
          {rendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-10 rounded-lg">
              <Loader2 className="w-6 h-6 text-[var(--brand-gold)] animate-spin" />
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="rounded-lg shadow-2xl max-w-full h-auto"
            style={{
              boxShadow: '0 8px 40px rgba(25, 25, 112, 0.15), 0 2px 12px rgba(0,0,0,0.08)',
            }}
          />
        </div>
      )}
    </div>
  );

  // ── Modal wrapper ──────────────────────────────────────────────────────────
  if (modal) {
    return (
      <div
        className="fixed inset-0 z-[200] flex flex-col bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--brand-midnight)] border-b border-white/10">
          <BookOpen className="w-4 h-4 text-[var(--brand-gold)] flex-shrink-0" />
          <h2 className="text-sm font-bold text-white truncate flex-1">{title}</h2>
        </div>
        {toolbar}
        {mobileZoomControls}
        {content}
      </div>
    );
  }

  // ── Inline reader ──────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg bg-white dark:bg-gray-900 transition-all ${
        isFullscreen ? 'fixed inset-0 z-[200] rounded-none border-0' : ''
      }`}
      style={{
        maxHeight: isFullscreen ? '100vh' : '80vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Inline title */}
      {!isFullscreen && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-midnight)] border-b border-white/10">
          <BookOpen className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
          <span className="text-xs font-bold text-white truncate">{title}</span>
        </div>
      )}
      {toolbar}
      {mobileZoomControls}
      {content}
    </div>
  );
}
