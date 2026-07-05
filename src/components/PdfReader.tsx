import { useEffect, useRef, useState, useCallback } from 'react';
import {
  X, Download, ExternalLink, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCw, BookOpen, Loader2,
  BookOpenCheck, Layers, Eye, Sun, Moon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import BookQuizModal from './BookQuizModal';

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

  // Nouvelles fonctionnalités & immersion
  const [readerMode, setReaderMode] = useState<ReaderMode>('page');
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('midnight');
  const [showToolbar, setShowToolbar] = useState(true);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showBookmarksList, setShowBookmarksList] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [quizTriggered, setQuizTriggered] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isCloudinary = pdfUrl.includes('cloudinary.com');
  const effectiveUrl = isCloudinary ? `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}` : pdfUrl;

  const getBookIdentifier = useCallback(() => {
    return pdfUrl.split('/').pop()?.split('?')[0] || title;
  }, [pdfUrl, title]);

  // Sauvegarder la progression
  const saveProgress = useCallback(async (page: number) => {
    if (!pageCount || page < 1 || page > pageCount) return;
    localStorage.setItem(`pdf_progress_${getBookIdentifier()}`, String(page));
    if (user) {
      try {
        const percent = Math.round((page / pageCount) * 100);
        const { data: bookData } = await supabase
          .from('books')
          .select('id')
          .eq('pdf_url', pdfUrl)
          .maybeSingle();

        if (bookData?.id) {
          // Nous sauvegardons aussi les bookmarks courants
          await supabase.from('book_progress').upsert({
            book_id: bookData.id,
            user_id: user.id,
            last_page_read: page,
            progress_percent: percent,
            last_read_at: new Date().toISOString()
          }, { onConflict: 'book_id,user_id' });
        }
      } catch (err) {
        console.error('Error saving PDF progress:', err);
      }
    }
  }, [user, pageCount, pdfUrl, getBookIdentifier]);

  // Sauvegarder les marque-pages
  const saveBookmarksToDb = useCallback(async (newBookmarks: number[]) => {
    localStorage.setItem(`pdf_bookmarks_${getBookIdentifier()}`, JSON.stringify(newBookmarks));
    if (user) {
      try {
        const { data: bookData } = await supabase
          .from('books')
          .select('id')
          .eq('pdf_url', pdfUrl)
          .maybeSingle();

        if (bookData?.id) {
          await supabase.from('book_progress').upsert({
            book_id: bookData.id,
            user_id: user.id,
            bookmarks: JSON.stringify(newBookmarks),
            last_read_at: new Date().toISOString()
          }, { onConflict: 'book_id,user_id' });
        }
      } catch (err) {
        console.error('Error saving bookmarks to database:', err);
      }
    }
  }, [user, pdfUrl, getBookIdentifier]);

  // Ajouter / Retirer un marque-page
  const toggleBookmark = useCallback(() => {
    setBookmarks(prev => {
      const updated = prev.includes(pageNum)
        ? prev.filter(p => p !== pageNum)
        : [...prev, pageNum].sort((a, b) => a - b);
      saveBookmarksToDb(updated);
      return updated;
    });
  }, [pageNum, saveBookmarksToDb]);

  // Charger la dernière progression
  const loadSavedProgress = useCallback(async (doc: any) => {
    let savedPage = 1;
    if (user) {
      try {
        const { data: bookData } = await supabase
          .from('books')
          .select('id')
          .eq('pdf_url', pdfUrl)
          .maybeSingle();

        if (bookData?.id) {
          setCurrentBookId(bookData.id);
          const { data: progressData } = await supabase
            .from('book_progress')
            .select('last_page_read, bookmarks')
            .eq('book_id', bookData.id)
            .eq('user_id', user.id)
            .maybeSingle();

          if (progressData?.last_page_read) {
            savedPage = progressData.last_page_read;
          }
          if (progressData?.bookmarks) {
            const parsed = typeof progressData.bookmarks === 'string'
              ? JSON.parse(progressData.bookmarks)
              : progressData.bookmarks;
            if (Array.isArray(parsed)) setBookmarks(parsed);
          }
        }
      } catch (err) {
        console.error('Error loading progress:', err);
      }
    } else {
      // Pour les utilisateurs anonymes, on essaye aussi de charger le bookId en base pour les quizz
      supabase
        .from('books')
        .select('id')
        .eq('pdf_url', pdfUrl)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.id) setCurrentBookId(data.id);
        });

      const local = localStorage.getItem(`pdf_progress_${getBookIdentifier()}`);
      if (local) savedPage = parseInt(local, 10);
      const localBookmarks = localStorage.getItem(`pdf_bookmarks_${getBookIdentifier()}`);
      if (localBookmarks) {
        try { setBookmarks(JSON.parse(localBookmarks)); } catch {}
      }
    }

    if (savedPage >= 1 && savedPage <= doc.numPages) {
      setPageNum(savedPage);
      setPageInput(String(savedPage));
    }
  }, [user, pdfUrl, getBookIdentifier]);

  // Verrouillage du scroll
  useEffect(() => {
    if (modal || isFullscreen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prevOverflow; };
    }
  }, [modal, isFullscreen]);

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

        // Auto-fit
        try {
          const firstPage = await doc.getPage(1);
          const viewport = firstPage.getViewport({ scale: 1.0 });
          const container = scrollContainerRef.current;
          if (container) {
            const availWidth = container.clientWidth - (isFullscreen ? 16 : 48);
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
          setError(err?.message || 'Erreur lors du chargement du PDF');
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
  }, [effectiveUrl, pdfUrl, isCloudinary, loadSavedProgress, isFullscreen]);

  // Rendu de page(s) et prefetching en arrière-plan
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

  // Gérer le rendu et le prefetching en tâche de fond (instant-switching cache)
  useEffect(() => {
    if (!pdfDoc) return;

    if (readerMode === 'page') {
      const canvas = canvasRefs.current[pageNum];
      if (canvas) {
        setRendering(true);
        renderSinglePage(pageNum, canvas).then(() => {
          setRendering(false);
          // Prefetch / Pré-rendu en arrière-plan des pages adjacentes
          // Page suivante
          if (pageNum < pageCount) {
            const nextCanvas = canvasRefs.current[pageNum + 1];
            if (nextCanvas) renderSinglePage(pageNum + 1, nextCanvas);
          }
          // Page précédente
          if (pageNum > 1) {
            const prevCanvas = canvasRefs.current[pageNum - 1];
            if (prevCanvas) renderSinglePage(pageNum - 1, prevCanvas);
          }
        });
      }
    } else {
      // Mode défilement (scroll) - Rendre toutes les pages en arrière-plan
      const renderAll = async () => {
        setRendering(true);
        for (let i = 1; i <= pageCount; i++) {
          const canvas = canvasRefs.current[i];
          if (canvas) {
            await renderSinglePage(i, canvas);
          }
        }
        setRendering(false);
      };
      renderAll();
    }
  }, [pdfDoc, pageNum, readerMode, scale, rotation, pageCount, renderSinglePage]);

  // Gestion de l'affichage de la barre d'outils (inactivité)
  const resetHideTimeout = useCallback(() => {
    if (!isFullscreen) {
      setShowToolbar(true);
      return;
    }
    setShowToolbar(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setShowToolbar(false);
    }, 2500);
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      resetHideTimeout();
    } else {
      setShowToolbar(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    }
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isFullscreen, resetHideTimeout]);

  // Détecter les mouvements de souris pour réafficher la barre d'outils
  const handleMouseMove = () => {
    if (isFullscreen) {
      resetHideTimeout();
    }
  };

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
      setQuizTriggered(true); // Tentative initiale, effect ci-dessous validera si on doit vraiment afficher
    }
  }, [readerMode, pageCount, pageNum, saveProgress]);

  // Navigation
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
      setQuizTriggered(true); // Tentative initiale, effect ci-dessous validera si on doit vraiment afficher
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

  // For connected users, check DB to avoid re-showing quizzes they've already answered
  useEffect(() => {
    let cancelled = false;
    const decideShowQuiz = async () => {
      if (!currentBookId) return;

      try {
        // Find quiz for this book + page
        const { data: quizData } = await supabase
          .from('book_quizzes')
          .select('id')
          .eq('book_id', currentBookId)
          .eq('trigger_page', pageNum)
          .maybeSingle();

        if (!quizData) {
          if (!cancelled) setQuizTriggered(false);
          return;
        }

        // If user not logged in, keep existing behavior (allow anon quizzes)
        if (!user) {
          if (!cancelled) setQuizTriggered(prev => prev); // leave as-is
          return;
        }

        // Check if user already has an attempt
        const { data: attempt } = await supabase
          .from('user_quiz_attempts')
          .select('id')
          .eq('user_id', user.id)
          .eq('quiz_id', quizData.id)
          .maybeSingle();

        if (!cancelled) setQuizTriggered(!attempt);
      } catch (err) {
        console.error('Error checking quiz attempt for user:', err);
      }
    };

    decideShowQuiz();
    return () => { cancelled = true; };
  }, [currentBookId, pageNum, user]);

  // Raccourcis clavier
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

  // Touch/Swipe Mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    resetHideTimeout();
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

    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        next();
      } else {
        prev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Basculer l'API Plein écran du navigateur
  const toggleBrowserFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn("Fullscreen API not supported or blocked", err);
      setIsFullscreen(!isFullscreen);
    }
  };

  // Écouter le changement de plein écran système (ex: touche Échap système)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const getThemeClasses = () => {
    switch (readerTheme) {
      case 'light':
        return {
          bg: 'bg-white text-gray-900 border-gray-200',
          contentBg: 'bg-gray-100',
          toolbarBg: 'bg-white/90 border-gray-200 text-gray-900',
          btnBg: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        };
      case 'sepia':
        return {
          bg: 'bg-[#f4ecd8] text-[#5b4636] border-[#e4dcc8]',
          contentBg: 'bg-[#faf6eb]',
          toolbarBg: 'bg-[#ebdcb9]/90 border-[#d8caa4] text-[#5b4636]',
          btnBg: 'bg-[#dfceaa] hover:bg-[#d4c19b] text-[#5b4636]'
        };
      case 'midnight':
      default:
        return {
          bg: 'bg-[#0f172a] text-white border-white/5',
          contentBg: 'bg-[#0b0f19]',
          toolbarBg: 'bg-[#1e293b]/90 border-white/10 text-white',
          btnBg: 'bg-white/10 hover:bg-white/20 text-white'
        };
    }
  };

  const theme = getThemeClasses();
  const progress = pageCount > 0 ? (pageNum / pageCount) * 100 : 0;

  // ── Toolbar ──
  const toolbar = (
    <div className={`flex flex-col gap-0 select-none transition-all duration-300 ${
      isFullscreen && !showToolbar ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
    } ${isFullscreen ? 'absolute top-0 left-0 right-0 z-50 shadow-2xl backdrop-blur-md' : 'relative'}`}>
      <div className={`flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 ${theme.toolbarBg} border-b`}>
        {/* Left */}
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
          <button
            onClick={() => setReaderMode(m => m === 'page' ? 'scroll' : 'page')}
            title="Mode lecture"
            className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg ${theme.btnBg} transition-all active:scale-95`}
          >
            {readerMode === 'page' ? <Layers size={16} /> : <BookOpenCheck size={16} />}
          </button>

          {/* Bookmarks toggle & list popover */}
          <div className="relative">
            <button
              onClick={toggleBookmark}
              title={bookmarks.includes(pageNum) ? 'Retirer le marque-page' : 'Ajouter un marque-page'}
              className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg ${
                bookmarks.includes(pageNum)
                  ? 'bg-[var(--brand-gold)] text-midnight'
                  : theme.btnBg
              } transition-all active:scale-95`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={bookmarks.includes(pageNum) ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            </button>
          </div>

          {bookmarks.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowBookmarksList(s => !s)}
                title="Liste des marque-pages"
                className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg ${theme.btnBg} transition-all active:scale-95`}
              >
                <span className="text-[10px] font-black">{bookmarks.length}🔖</span>
              </button>
              {showBookmarksList && (
                <div className={`absolute top-full left-0 mt-1 z-[60] w-40 rounded-xl shadow-2xl p-2 border ${
                  readerTheme === 'light' ? 'bg-white border-gray-200 text-gray-800' : 'bg-slate-800 border-white/10 text-white'
                }`}>
                  <p className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-1 px-2">Marque-pages</p>
                  <div className="max-h-32 overflow-y-auto space-y-0.5 scrollbar-none">
                    {bookmarks.map(page => (
                      <button
                        key={page}
                        onClick={() => { goToPage(String(page)); setShowBookmarksList(false); }}
                        className="w-full text-left px-2 py-1 text-xs font-bold rounded-lg hover:bg-gold hover:text-midnight transition-colors"
                      >
                        Page {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center */}
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

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-black/10 dark:bg-white/5 rounded-lg p-0.5 border border-black/10 dark:border-white/10">
            <button onClick={() => setReaderTheme('midnight')} className={`p-1.5 rounded-md transition-all ${readerTheme === 'midnight' ? 'bg-[var(--brand-midnight)] text-white' : 'opacity-60'}`}><Moon size={14} /></button>
            <button onClick={() => setReaderTheme('light')} className={`p-1.5 rounded-md transition-all ${readerTheme === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'opacity-60'}`}><Sun size={14} /></button>
            <button onClick={() => setReaderTheme('sepia')} className={`p-1.5 rounded-md transition-all ${readerTheme === 'sepia' ? 'bg-[#dfceaa] text-[#5b4636]' : 'opacity-60'}`}><Eye size={14} /></button>
          </div>
          <button
            onClick={toggleBrowserFullscreen}
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

      <div className="h-[3.5px] bg-black/10 dark:bg-white/5 w-full">
        <div className="h-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );

  // ── Content Area ──
  const content = (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`flex-1 overflow-auto ${
        isFullscreen ? 'p-0 pt-16' : 'p-4 sm:p-6'
      } ${theme.contentBg} transition-colors duration-300 select-none relative flex justify-center`}
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
        <div className="flex flex-col items-center w-full h-fit">
          {readerMode === 'page' ? (
            <div className="relative my-auto flex flex-col items-center justify-center">
              {rendering && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-gray-900/40 z-10 rounded-lg backdrop-blur-xs">
                  <Loader2 className="w-6 h-6 text-[var(--brand-gold)] animate-spin" />
                </div>
              )}
              {/* Rendre tous les canvas dans le DOM mais masquer les inactifs pour permettre le pre-rendering */}
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(num => (
                <canvas
                  key={num}
                  ref={el => { canvasRefs.current[num] = el; }}
                  className={`rounded-lg shadow-2xl max-w-full h-auto transition-transform ${
                    isFullscreen ? 'border border-white/5' : ''
                  } ${num === pageNum ? 'block' : 'hidden'}`}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-8 w-full items-center py-4">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(num => (
                <div key={num} className="relative flex flex-col items-center w-full">
                  <canvas
                    ref={el => { canvasRefs.current[num] = el; }}
                    className="rounded-lg shadow-xl max-w-full h-auto border border-white/5"
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

      {/* Boutons de survol latéraux pour changer de page en plein écran page-par-page */}
      {readerMode === 'page' && !loading && !error && (
        <>
          <button
            onClick={prev}
            disabled={pageNum <= 1}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none active:scale-95 ${
              isFullscreen && !showToolbar ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
            title="Page précédente"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            disabled={pageNum >= pageCount}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none active:scale-95 ${
              isFullscreen && !showToolbar ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
            title="Page suivante"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`flex flex-col ${theme.bg} ${
        modal || isFullscreen ? 'fixed inset-0 z-[200]' : 'rounded-2xl border'
      } overflow-hidden shadow-2xl transition-all duration-300`}
      style={{ height: modal || isFullscreen ? '100vh' : '80vh' }}
    >
      {/* Title Header */}
      {(modal || isFullscreen) && (
        <div className={`flex items-center justify-between px-4 py-2.5 ${theme.toolbarBg} border-b z-50 transition-all duration-300 ${
          isFullscreen && !showToolbar ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--brand-gold)]" />
            <span className="text-xs font-black truncate">{title}</span>
          </div>
          {isFullscreen && (
            <span className="text-[10px] font-bold px-2 py-0.5 bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] rounded-full">
              Mode immersif actif
            </span>
          )}
        </div>
      )}
      {toolbar}
      {content}

      {/* Interactive quiz overlay trigger */}
      {currentBookId && quizTriggered && (
        <BookQuizModal
          bookId={currentBookId}
          currentPage={pageNum}
          isFinalQuiz={pageCount > 0 && pageNum === pageCount}
          onClose={() => setQuizTriggered(false)}
        />
      )}
    </div>
  );
}
