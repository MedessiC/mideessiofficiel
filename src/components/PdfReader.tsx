import { useEffect, useRef, useState, useCallback } from 'react';
import {
  X, Download, ExternalLink, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCw, BookOpen, Loader2,
  BookOpenCheck, Layers, Eye, Sun, Moon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PdfReaderProps {
  pdfUrl: string;
  title?: string;
  modal?: boolean;
  onClose?: () => void;
}

type ReaderMode = 'page' | 'scroll';
type ReaderTheme = 'midnight' | 'light' | 'sepia';

export default function PdfReader({ pdfUrl, title = 'Lecture du PDF', modal = false, onClose }: PdfReaderProps) {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});

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

  // Nouvelles fonctionnalités
  const [readerMode, setReaderMode] = useState<ReaderMode>('page');
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('midnight');
  const [renderedPages, setRenderedPages] = useState<number[]>([]);

  const isCloudinary = pdfUrl.includes('cloudinary.com');
  const effectiveUrl = isCloudinary ? `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}` : pdfUrl;

  // Récupérer le ID du livre depuis son URL ou titre pour le marque-page
  const getBookIdentifier = useCallback(() => {
    return pdfUrl.split('/').pop()?.split('?')[0] || title;
  }, [pdfUrl, title]);

  // Sauvegarder la progression dans localStorage/Supabase
  const saveProgress = useCallback(async (page: number) => {
    if (!pageCount || page < 1 || page > pageCount) return;
    
    // Sauvegarde locale rapide
    localStorage.setItem(`pdf_progress_${getBookIdentifier()}`, String(page));

    // Sauvegarde Supabase si connecté
    if (user) {
      try {
        const percent = Math.round((page / pageCount) * 100);
        // Tenter de trouver le book_id correspondant
        const { data: bookData } = await supabase
          .from('books')
          .select('id')
          .eq('pdf_url', pdfUrl)
          .maybeSingle();

        if (bookData?.id) {
          await supabase.from('book_progress').upsert({
            book_id: bookData.id,
            user_id: user.id,
            last_page_read: page,
            progress_percent: percent,
            last_read_at: new Date().toISOString()
          }, { onConflict: 'book_id,user_id' });
        }
      } catch (err) {
        console.error('Error saving PDF progress to Supabase:', err);
      }
    }
  }, [user, pageCount, pdfUrl, getBookIdentifier]);

  // Charger la dernière progression
  const loadSavedProgress = useCallback(async (doc: any) => {
    let savedPage = 1;
    
    // Essayer Supabase en premier
    if (user) {
      try {
        const { data: bookData } = await supabase
          .from('books')
          .select('id')
          .eq('pdf_url', pdfUrl)
          .maybeSingle();

        if (bookData?.id) {
          const { data: progressData } = await supabase
            .from('book_progress')
            .select('last_page_read')
            .eq('book_id', bookData.id)
            .eq('user_id', user.id)
            .maybeSingle();

          if (progressData?.last_page_read) {
            savedPage = progressData.last_page_read;
          }
        }
      } catch (err) {
        console.error('Error loading PDF progress:', err);
      }
    } else {
      // Fallback localStorage
      const local = localStorage.getItem(`pdf_progress_${getBookIdentifier()}`);
      if (local) savedPage = parseInt(local, 10);
    }

    if (savedPage >= 1 && savedPage <= doc.numPages) {
      setPageNum(savedPage);
      setPageInput(String(savedPage));
    }
  }, [user, pdfUrl, getBookIdentifier]);

  // Verrouillage du scroll en mode modal
  useEffect(() => {
    if (modal) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prevOverflow; };
    }
  }, [modal]);

  // Charger le document PDF
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const loadPdf = async (urlToFetch: string, isFallback: boolean = false) => {
      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
        // @ts-ignore
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.js', import.meta.url).toString();

        const loadingTask = pdfjs.getDocument(urlToFetch);
        const doc = await loadingTask.promise;
        if (cancelled) return;
        setPdfDoc(doc);
        setPageCount(doc.numPages);
        
        await loadSavedProgress(doc);

        // Auto-fit initial
        try {
          const firstPage = await doc.getPage(1);
          const viewport = firstPage.getViewport({ scale: 1.0 });
          const container = scrollContainerRef.current;
          if (container) {
            const availWidth = container.clientWidth - 48;
            const fitScale = Math.min(availWidth / viewport.width, 2.0);
            setScale(Math.max(0.5, +(fitScale).toFixed(2)));
          } else {
            setScale(1.0);
          }
        } catch {
          setScale(1.0);
        }
      } catch (err: any) {
        console.error(`PDF load error (url: ${urlToFetch})`, err);
        if (cancelled) return;

        if (!isFallback && isCloudinary && urlToFetch !== pdfUrl) {
          loadPdf(pdfUrl, true);
        } else {
          if (err?.message?.includes('404') || err?.message?.includes('Missing PDF') || err?.message?.includes('Failed to fetch')) {
            setError('Le fichier PDF est introuvable ou inaccessible (Erreur 404/502).');
          } else {
            setError(err?.message || 'Erreur lors du chargement du PDF');
          }
          setLoading(false);
        }
      } finally {
        if (!cancelled && (urlToFetch === pdfUrl || !isCloudinary)) {
          setLoading(false);
        }
      }
    };

    loadPdf(effectiveUrl);

    return () => { cancelled = true; };
  }, [effectiveUrl, pdfUrl, isCloudinary, loadSavedProgress]);

  // Rendu de page(s)
  const renderSinglePage = useCallback(async (num: number, canvas: HTMLCanvasElement) => {
    if (!pdfDoc) return;
    try {
      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale, rotation });
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
      console.error(`Render page ${num} error`, err);
    }
  }, [pdfDoc, scale, rotation]);

  // Gérer le rendu selon le mode
  useEffect(() => {
    if (!pdfDoc) return;

    if (readerMode === 'page') {
      const canvas = canvasRefs.current[pageNum];
      if (canvas) {
        setRendering(true);
        renderSinglePage(pageNum, canvas).then(() => setRendering(false));
      }
    } else {
      // En mode défilement (scroll), on prépare l'affichage de toutes les pages
      setRenderedPages([]);
      const renderAll = async () => {
        setRendering(true);
        // Charger et rendre les pages par lot de 3 pour éviter le freeze du navigateur
        for (let i = 1; i <= pageCount; i++) {
          const canvas = canvasRefs.current[i];
          if (canvas) {
            await renderSinglePage(i, canvas);
            setRenderedPages(prev => [...prev, i]);
          }
        }
        setRendering(false);
      };
      renderAll();
    }
  }, [pdfDoc, pageNum, readerMode, scale, rotation, pageCount, renderSinglePage]);

  // Détection du scroll en mode 'scroll' pour mettre à jour le numéro de page courant
  const handleScroll = useCallback(() => {
    if (readerMode !== 'scroll' || !scrollContainerRef.current || pageCount === 0) return;
    const container = scrollContainerRef.current;
    const children = container.children[0]?.children;
    if (!children) return;

    let currentPage = 1;
    let minDistance = Infinity;

    for (let i = 0; i < children.length; i++) {
      const element = children[i] as HTMLElement;
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const distance = Math.abs(rect.top - containerRect.top);

      if (distance < minDistance) {
        minDistance = distance;
        currentPage = i + 1;
      }
    }

    if (currentPage !== pageNum) {
      setPageNum(currentPage);
      setPageInput(String(currentPage));
      saveProgress(currentPage);
    }
  }, [readerMode, pageCount, pageNum, saveProgress]);

  // Navigation page par page
  const prev = useCallback(() => {
    setPageNum(p => {
      const nextP = Math.max(1, p - 1);
      saveProgress(nextP);
      return nextP;
    });
  }, [saveProgress]);

  const next = useCallback(() => {
    setPageNum(p => {
      const nextP = Math.min(pageCount || p + 1, p + 1);
      saveProgress(nextP);
      return nextP;
    });
  }, [pageCount, saveProgress]);

  const zoomIn = useCallback(() => setScale(s => Math.min(3, +(s + 0.25).toFixed(2))), []);
  const zoomOut = useCallback(() => setScale(s => Math.max(0.5, +(s - 0.25).toFixed(2))), []);
  const rotatePage = useCallback(() => setRotation(r => (r + 90) % 360), []);

  const goToPage = useCallback((value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= pageCount) {
      setPageNum(num);
      saveProgress(num);
      if (readerMode === 'scroll') {
        const canvas = canvasRefs.current[num];
        if (canvas) {
          canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else {
      setPageInput(String(pageNum));
    }
  }, [pageCount, pageNum, readerMode, saveProgress]);

  // Raccourcis claviers
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

  // Calculer la couleur du thème du lecteur
  const getThemeClasses = () => {
    switch (readerTheme) {
      case 'light':
        return {
          bg: 'bg-white text-gray-900 border-gray-200',
          contentBg: 'bg-gray-50',
          toolbarBg: 'bg-white border-gray-200 text-gray-900',
          btnBg: 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        };
      case 'sepia':
        return {
          bg: 'bg-[#f4ecd8] text-[#5b4636] border-[#e4dcc8]',
          contentBg: 'bg-[#faf6eb]',
          toolbarBg: 'bg-[#ebdcb9] border-[#d8caa4] text-[#5b4636]',
          btnBg: 'bg-[#dfceaa] hover:bg-[#d4c19b] text-[#5b4636]'
        };
      case 'midnight':
      default:
        return {
          bg: 'bg-[var(--brand-midnight)] text-white border-white/10',
          contentBg: 'bg-gray-900/50',
          toolbarBg: 'bg-[var(--brand-midnight)] border-white/10 text-white',
          btnBg: 'bg-white/10 hover:bg-white/20 text-white'
        };
    }
  };

  const theme = getThemeClasses();
  const progress = pageCount > 0 ? (pageNum / pageCount) * 100 : 0;

  // ── Toolbar ────────────────────────────────────────────────────────────────
  const toolbar = (
    <div className="flex flex-col gap-0 select-none">
      <div className={`flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 ${theme.toolbarBg} border-b`}>
        {/* Left: Navigation & Mode Selection */}
        <div className="flex items-center gap-1.5">
          {readerMode === 'page' && (
            <>
              <button
                onClick={prev}
                disabled={pageNum <= 1}
                className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg ${theme.btnBg} disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95`}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1 bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1">
                <input
                  type="text"
                  inputMode="numeric"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={(e) => goToPage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') goToPage(pageInput); }}
                  className="w-8 sm:w-10 text-center bg-transparent text-xs sm:text-sm font-bold outline-none"
                />
                <span className="opacity-40 text-xs font-medium">/ {pageCount || '–'}</span>
              </div>

              <button
                onClick={next}
                disabled={pageNum >= pageCount}
                className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg ${theme.btnBg} disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95`}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Mode switch */}
          <button
            onClick={() => setReaderMode(m => m === 'page' ? 'scroll' : 'page')}
            title={readerMode === 'page' ? 'Passer en défilement continu' : 'Passer en page par page'}
            className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg ${theme.btnBg} transition-all active:scale-95`}
          >
            {readerMode === 'page' ? <Layers size={16} /> : <BookOpenCheck size={16} />}
          </button>
        </div>

        {/* Center: Zoom Controls */}
        <div className="hidden xs:flex items-center gap-1 sm:gap-1.5">
          <button onClick={zoomOut} className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg ${theme.btnBg} transition-all active:scale-95`}>
            <ZoomOut size={16} />
          </button>
          <span className="text-[10px] sm:text-xs font-bold min-w-[36px] text-center tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <button onClick={zoomIn} className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg ${theme.btnBg} transition-all active:scale-95`}>
            <ZoomIn size={16} />
          </button>

          <button onClick={rotatePage} className={`hidden md:flex min-w-[40px] min-h-[40px] items-center justify-center rounded-lg ${theme.btnBg} transition-all active:scale-95`}>
            <RotateCw size={16} />
          </button>
        </div>

        {/* Right: Theme Switcher & System Options */}
        <div className="flex items-center gap-1.5">
          {/* Theme selection */}
          <div className="flex items-center bg-black/10 dark:bg-white/5 rounded-lg p-0.5 border border-black/10 dark:border-white/10">
            <button
              onClick={() => setReaderTheme('midnight')}
              className={`p-1.5 rounded-md transition-all ${readerTheme === 'midnight' ? 'bg-[var(--brand-midnight)] text-white' : 'opacity-60'}`}
              title="Midnight (Sombre)"
            >
              <Moon size={14} />
            </button>
            <button
              onClick={() => setReaderTheme('light')}
              className={`p-1.5 rounded-md transition-all ${readerTheme === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'opacity-60'}`}
              title="Clair"
            >
              <Sun size={14} />
            </button>
            <button
              onClick={() => setReaderTheme('sepia')}
              className={`p-1.5 rounded-md transition-all ${readerTheme === 'sepia' ? 'bg-[#dfceaa] text-[#5b4636]' : 'opacity-60'}`}
              title="Sépia"
            >
              <Eye size={14} />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(f => !f)}
            className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg ${theme.btnBg} transition-all active:scale-95`}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-500 transition-all active:scale-95"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[3.5px] bg-black/10 dark:bg-white/5 w-full">
        <div
          className="h-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  // Swipe gesture handling for mobile touch screens
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (readerMode !== 'page') return;
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (readerMode !== 'page' || touchStartX.current === null || touchStartY.current === null) return;
    
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartX.current;
    const diffY = touch.clientY - touchStartY.current;

    // Seuil de détection (minimum 50px de glissement horizontal et plus horizontal que vertical)
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        // Swipe à gauche -> Page suivante
        next();
      } else {
        // Swipe à droite -> Page précédente
        prev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // ── Content Area (Vertical Scroll & Touch Support) ───────────────────────
  const content = (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`flex-1 overflow-auto p-4 sm:p-6 ${theme.contentBg} transition-colors duration-300 select-none`}
    >
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <Loader2 className="w-10 h-10 text-[var(--brand-gold)] animate-spin" />
          <p className="text-xs font-bold opacity-60">Chargement du document…</p>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center max-w-sm mx-auto">
          <X className="w-8 h-8 text-red-500" />
          <p className="text-sm font-semibold text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col items-center gap-6">
          {readerMode === 'page' ? (
            <div className="relative">
              {rendering && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-gray-900/40 z-10 rounded-lg backdrop-blur-xs">
                  <Loader2 className="w-6 h-6 text-[var(--brand-gold)] animate-spin" />
                </div>
              )}
              <canvas
                ref={el => { canvasRefs.current[pageNum] = el; }}
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-full items-center">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(num => (
                <div key={num} className="relative flex flex-col items-center">
                  <canvas
                    ref={el => { canvasRefs.current[num] = el; }}
                    className="rounded-lg shadow-lg max-w-full h-auto"
                  />
                  <div className="mt-2 text-[10px] font-bold opacity-40">
                    Page {num} / {pageCount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${theme.bg} ${
        modal || isFullscreen ? 'fixed inset-0 z-[200]' : 'rounded-2xl border'
      } overflow-hidden shadow-2xl transition-all duration-300`}
      style={{ height: modal || isFullscreen ? '100vh' : '80vh' }}
    >
      {/* Title Header */}
      {(modal || isFullscreen) && (
        <div className={`flex items-center gap-2 px-4 py-2.5 ${theme.toolbarBg} border-b`}>
          <BookOpen className="w-4 h-4 text-[var(--brand-gold)]" />
          <span className="text-xs font-black truncate">{title}</span>
        </div>
      )}
      {toolbar}
      {content}
    </div>
  );
}
