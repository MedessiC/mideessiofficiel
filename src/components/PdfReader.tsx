import { useEffect, useRef, useState, useCallback } from 'react';
import {
  X, Download, ExternalLink, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCw, BookOpen, Loader2,
  BookOpenCheck, Layers, Eye, Sun, Moon, Lock, LogIn, Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import BookQuizModal from './BookQuizModal';
import { getPdfGuestAccessState, MAX_FREE_PDF_PAGES } from '../utils/pdfAccess';
import { persistRedirectTarget } from '../utils/authRedirect';

interface PdfReaderProps {
  pdfUrl: string;
  title?: string;
  modal?: boolean;
  onClose?: () => void;
}

type ReaderMode = 'page' | 'scroll';
type ReaderTheme = 'midnight' | 'light' | 'sepia';

const getPdfCacheKey = (url: string) => `pdf-cache:${encodeURIComponent(url)}`;
const getPdfStateKey = (url: string) => `pdf-reader-state:${encodeURIComponent(url)}`;

const encodePdfBytes = (bytes: Uint8Array) => {
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += 0x8000) {
    chunks.push(String.fromCharCode(...bytes.subarray(i, i + 0x8000)));
  }
  return btoa(chunks.join(''));
};

const decodePdfBytes = (base64: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const savePdfToSessionCache = (url: string, bytes: ArrayBuffer) => {
  if (typeof window === 'undefined') return;
  try {
    const encoded = encodePdfBytes(new Uint8Array(bytes));
    window.sessionStorage.setItem(getPdfCacheKey(url), encoded);
  } catch (err) {
    console.warn('Unable to cache PDF in session storage:', err);
  }
};

const loadPdfFromSessionCache = (url: string) => {
  if (typeof window === 'undefined') return null;
  try {
    const encoded = window.sessionStorage.getItem(getPdfCacheKey(url));
    if (!encoded) return null;
    return decodePdfBytes(encoded);
  } catch (err) {
    console.warn('Unable to read cached PDF from session storage:', err);
    return null;
  }
};

export default function PdfReader({ pdfUrl, title = 'Lecture du PDF', modal = false, onClose }: PdfReaderProps) {
  const { user } = useAuth();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState('1');
  const [rendering, setRendering] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Nouvelles fonctionnalités & immersion
  const [readerMode, setReaderMode] = useState<ReaderMode>('page');
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('midnight');
  const [showToolbar, setShowToolbar] = useState(true);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showBookmarksList, setShowBookmarksList] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [quizTriggered, setQuizTriggered] = useState(false);
  const [completionConfirmed, setCompletionConfirmed] = useState(false);
  const [completionSaving, setCompletionSaving] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [applauseAnim, setApplauseAnim] = useState(false);
  const [isFirstPageView, setIsFirstPageView] = useState(true);
  const [pageFlip, setPageFlip] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isCloudinary = pdfUrl.includes('cloudinary.com');
  const effectiveUrl = isCloudinary ? `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}` : pdfUrl;
  const requiresAuth = !user;
  const guestAccess = getPdfGuestAccessState({ pageNum, isAuthenticated: !!user, maxFreePages: MAX_FREE_PDF_PAGES });
  const isGuestLocked = requiresAuth && guestAccess.isLocked;

  useEffect(() => {
    if (typeof window !== 'undefined' && location.pathname) {
      persistRedirectTarget(location.pathname + location.search);
    }
  }, [location.pathname, location.search]);

  const getBookIdentifier = useCallback(() => {
    return pdfUrl.split('/').pop()?.split('?')[0] || title;
  }, [pdfUrl, title]);

  // Sauvegarder la progression
  const saveProgress = useCallback(async (page: number, forceComplete = false) => {
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
          const payload: any = {
            book_id: bookData.id,
            user_id: user.id,
            last_page_read: page,
            progress_percent: percent,
            last_read_at: new Date().toISOString(),
          };
          if (forceComplete || completionConfirmed) {
            payload.is_completed = true;
          }
          await supabase.from('book_progress').upsert(payload, { onConflict: 'book_id,user_id' });
        }
      } catch (err) {
        console.error('Error saving PDF progress:', err);
      }
    }
  }, [user, pageCount, pdfUrl, getBookIdentifier, completionConfirmed]);

  // Record a read in the books.views counter (visible to everyone)
  const recordRead = useCallback(async (bookId: string | undefined) => {
    if (!bookId) return;
    if (typeof window === 'undefined') return;
    try {
      const key = `book_read_logged:${bookId}`;
      if (localStorage.getItem(key)) return; // already recorded in this browser
      await supabase.rpc('increment_book_views', { p_book_id: bookId });
      // Also insert a detailed read event for audit and public metrics
      const sessionKey = `s:${Math.random().toString(36).slice(2,9)}`;
      try {
        await supabase.from('book_reads').insert([{ book_id: bookId, user_id: user?.id ?? null, session_key: sessionKey }]);
      } catch (err) {
        // non-fatal
        console.warn('Could not insert into book_reads:', err);
      }
      localStorage.setItem(key, sessionKey);
    } catch (err) {
      console.error('Error recording book read:', err);
    }
  }, []);

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

  const confirmCompletion = useCallback(async () => {
    if (!currentBookId || pageCount === 0) return;
    setCompletionSaving(true);
    setCompletionError(null);

    try {
      const payload: any = {
        book_id: currentBookId,
        user_id: user?.id ?? null,
        last_page_read: pageCount,
        progress_percent: 100,
        last_read_at: new Date().toISOString(),
        is_completed: true,
      };

      if (user) {
        await supabase.from('book_progress').upsert(payload, { onConflict: 'book_id,user_id' });
        const statusKey = `reading_status_${user.id}`;
        try {
          const saved = window.localStorage.getItem(statusKey);
          const statusMap = saved ? JSON.parse(saved) : {};
          statusMap[currentBookId] = 'completed';
          window.localStorage.setItem(statusKey, JSON.stringify(statusMap));
        } catch {
          // ignore
        }
      } else {
        window.localStorage.setItem(`pdf_completed_${getBookIdentifier()}`, '1');
      }

      setCompletionConfirmed(true);
      // persist local completed flag for both logged and anonymous users
      try { window.localStorage.setItem(`pdf_completed_${getBookIdentifier()}`, '1'); } catch {}

      // Trigger confetti + applause animation once
      setShowConfetti(true);
      setApplauseAnim(true);
      playApplauseSound();
      // hide applause animation after short time
      setTimeout(() => setApplauseAnim(false), 1400);
      // stop confetti after a while
      setTimeout(() => setShowConfetti(false), 5200);

      // send analytics if available
      try {
        const meta = { book_id: currentBookId, pdf_url: pdfUrl };
        if ((window as any).gtag) {
          (window as any).gtag('event', 'book_completion', meta);
        } else if ((window as any).dataLayer) {
          (window as any).dataLayer.push({ event: 'book_completion', ...meta });
        } else if ((window as any).analytics && (window as any).analytics.track) {
          (window as any).analytics.track('Book Completed', meta);
        }
        console.info('Analytics: book_completion', meta);
      } catch (e) {
        // non-fatal
      }

      saveProgress(pageCount, true);
    } catch (err) {
      console.error('Error confirming book completion:', err);
      setCompletionError('Impossible de confirmer la fin du livre pour le moment.');
    } finally {
      setCompletionSaving(false);
    }
  }, [currentBookId, pageCount, user, getBookIdentifier, saveProgress]);

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
          // Record that this browser started reading this book (increments public views)
          recordRead(bookData.id);
          const { data: progressData } = await supabase
            .from('book_progress')
            .select('last_page_read, bookmarks, is_completed')
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
          if (progressData?.is_completed || Number(progressData?.progress_percent || 0) >= 100) {
            setCompletionConfirmed(true);
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
      const completed = localStorage.getItem(`pdf_completed_${getBookIdentifier()}`) === '1';
      if (completed) setCompletionConfirmed(true);
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
    setDownloadProgress(0);
    setError(null);

    const loadPdf = async (urlToFetch: string, isFallback: boolean = false) => {
      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
        // @ts-ignore
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.js', import.meta.url).toString();

        const cachedBytes = loadPdfFromSessionCache(urlToFetch);
        if (cachedBytes) {
          const doc = await pdfjs.getDocument({ data: cachedBytes }).promise;
          if (cancelled) return;
          setPdfDoc(doc);
          setPageCount(doc.numPages);
          setDownloadProgress(100);
          setLoading(false);
          await loadSavedProgress(doc);
          return;
        }

        const response = await fetch(urlToFetch, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`PDF download failed: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        savePdfToSessionCache(urlToFetch, arrayBuffer);

        const loadingTask: any = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        loadingTask.onProgress = (progressData: { loaded?: number; total?: number }) => {
          if (cancelled) return;
          if (progressData?.total) {
            const percent = Math.min(100, Math.round((progressData.loaded || 0) / progressData.total * 100));
            setDownloadProgress(percent);
          }
        };

        const doc = await loadingTask.promise;
        if (cancelled) return;
        setPdfDoc(doc);
        setPageCount(doc.numPages);
        setDownloadProgress(100);
        setLoading(false);

        await loadSavedProgress(doc);

        // Auto-fit
        try {
          const firstPage = await doc.getPage(1);
          const viewport = firstPage.getViewport({ scale: 1.0 });
          const container = scrollContainerRef.current;
          if (container) {
            const availWidth = container.clientWidth - (isFullscreen ? 16 : 48);
            const fitScale = Math.min(availWidth / viewport.width, 2.0);
            setScale(Math.max(0.5, Number(fitScale.toFixed(2))));
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
      }
    };

    loadPdf(effectiveUrl);

    return () => { cancelled = true; };
  }, [effectiveUrl, pdfUrl, isCloudinary, loadSavedProgress, isFullscreen, requiresAuth, user]);

  // Rendu de page(s) et prefetching en arrière-plan
  const renderSinglePage = useCallback(async (num: number, canvas: HTMLCanvasElement) => {
    if (!pdfDoc) return;
    if (isGuestLocked && num > guestAccess.effectivePage) return;
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
  }, [pdfDoc, scale, rotation, isGuestLocked, guestAccess.effectivePage]);

  // Do not clamp the page number for guests — allow them to navigate past
  // the free limit so we can display the login overlay when they do.
  // The actual rendering of pages is blocked in `renderSinglePage` when the
  // guest limit is reached.

  // Gérer le rendu et le prefetching en tâche de fond (instant-switching cache)
  useEffect(() => {
    if (!pdfDoc) return;

    if (isGuestLocked) {
      setLoading(false);
      return;
    }

    if (readerMode === 'page') {
      const canvas = canvasRefs.current[pageNum];
      if (canvas) {
        setRendering(true);
        renderSinglePage(pageNum, canvas)
          .then(() => {
            setRendering(false);
            setLoading(false);
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
          })
          .catch(() => {
            setRendering(false);
            setLoading(false);
          });
      } else {
        setRendering(false);
        setLoading(false);
      }
    } else {
      // Mode défilement (scroll) - Rendre toutes les pages en arrière-plan
      const renderAll = async () => {
        setRendering(true);
        try {
          for (let i = 1; i <= pageCount; i++) {
            const canvas = canvasRefs.current[i];
            if (canvas) {
              await renderSinglePage(i, canvas);
            }
          }
        } finally {
          setRendering(false);
          setLoading(false);
        }
      };
      renderAll();
    }
  }, [pdfDoc, pageNum, readerMode, scale, rotation, pageCount, renderSinglePage, isGuestLocked]);

  // Keyboard navigation & page flip animation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNum, pageCount]);

  // Animation trigger on page change
  useEffect(() => {
    if (pageNum > 1) {
      setIsFirstPageView(false);
      setPageFlip(true);
      const timer = setTimeout(() => setPageFlip(false), 600);
      return () => clearTimeout(timer);
    }
  }, [pageNum]);

  // Small Confetti component (inline, lightweight) and animations
  const Confetti = () => {
    const pieces = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 3 + Math.random() * 2,
      color: ['#EF4444', '#F97316', '#FACC15', '#10B981', '#3B82F6', '#8B5CF6'][Math.floor(Math.random() * 6)],
      spin: Math.random() * 360,
      size: 6 + Math.random() * 10,
    }));

    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
        <style>{`
          @keyframes confetti-fall { to { transform: translateY(120vh) rotate(360deg); opacity: 0.9; } }
          @keyframes applaud { 0% { transform: scale(1); } 30% { transform: scale(1.45) rotate(-6deg);} 60% { transform: scale(0.95) rotate(4deg);} 100% { transform: scale(1); } }
          @keyframes pulse-chevron { 0%, 100% { opacity: 0.4; transform: translateX(0); } 50% { opacity: 1; transform: translateX(8px); } }
          @keyframes pulse-chevron-left { 0%, 100% { opacity: 0.4; transform: translateX(0); } 50% { opacity: 1; transform: translateX(-8px); } }
          @keyframes page-flip { 0% { rotateY(0deg) rotateZ(0deg); opacity: 1; } 50% { rotateY(90deg); } 100% { rotateY(0deg) rotateZ(0deg); opacity: 1; } }
          @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
          .animate-pulse-chevron { animation: pulse-chevron 1.5s ease-in-out infinite; }
          .animate-pulse-chevron-left { animation: pulse-chevron-left 1.5s ease-in-out infinite; }
          .animate-page-flip { animation: page-flip 600ms ease-in-out; perspective: 1000px; }
          .animate-applaud { animation: applaud 1200ms ease; display:inline-block }
          .animate-shimmer { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%); background-size: 1000px 100%; animation: shimmer 3s infinite; }
        `}</style>
        {pieces.map(p => (
          <span
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.left}%`,
              top: '-10%',
              width: p.size,
              height: p.size * 1.4,
              backgroundColor: p.color,
              transform: `rotate(${p.spin}deg)`,
              borderRadius: 2,
              animation: `confetti-fall ${p.duration}s ${p.delay}s linear forwards`,
              opacity: 0.95,
            }}
          />
        ))}
      </div>
    );
  };

  // Play a short applause/chime using WebAudio (no external assets)
  const playApplauseSound = () => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Two quick detuned oscillators for a pleasant chime
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const g = ctx.createGain();

      o1.type = 'sine'; o2.type = 'sine';
      o1.frequency.setValueAtTime(880, now);
      o2.frequency.setValueAtTime(660, now);
      o2.detune.setValueAtTime(40, now);

      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.12, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      o1.connect(g); o2.connect(g); g.connect(ctx.destination);
      o1.start(now); o2.start(now);
      o1.stop(now + 1.2); o2.stop(now + 1.2);

      // close context after sound
      setTimeout(() => { try { ctx.close(); } catch {} }, 1400);
    } catch (e) {
      // ignore sound errors
    }
  };

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

    const scrollHeight = container.scrollHeight - container.clientHeight;
    const progressPercent = scrollHeight > 0 ? Math.min(100, Math.max(0, (container.scrollTop / scrollHeight) * 100)) : 0;
    setScrollProgress(progressPercent);

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
      // If user scrolled to the extra completion element (index > pageCount)
      if (currentPage > pageCount) {
        // mark as complete (force)
        saveProgress(pageCount, true);
      } else {
        saveProgress(currentPage);
      }
      setQuizTriggered(true); // Tentative initiale, effect ci-dessous validera si on doit vraiment afficher
    }
  }, [readerMode, pageCount, pageNum, saveProgress]);

  useEffect(() => {
    if (readerMode !== 'scroll' || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const progressPercent = scrollHeight > 0 ? Math.min(100, Math.max(0, (container.scrollTop / scrollHeight) * 100)) : 0;
    setScrollProgress(progressPercent);
  }, [readerMode, pageCount]);

  // Navigation
  const prev = useCallback(() => {
    setPageNum(p => {
      // allow navigating back from the completion page to the last PDF page
      if (pageCount > 0 && p === pageCount + 1) {
        const prevP = pageCount;
        saveProgress(prevP);
        return prevP;
      }
      const nextP = Math.max(1, p - 1);
      saveProgress(nextP);
      return nextP;
    });
  }, [saveProgress, pageCount]);

  const next = useCallback(() => {
    setPageNum(p => {
      if (!pageCount) return p + 1;
      // allow one extra page index after the last PDF page for completion
      const maxIndex = pageCount + 1;
      const nextP = Math.min(maxIndex, p + 1);
      // if moving onto the completion page, mark complete (force)
      if (p === pageCount && nextP === pageCount + 1) {
        saveProgress(pageCount, true);
      } else {
        saveProgress(nextP);
      }
      return nextP;
    });
  }, [pageCount, saveProgress]);

  const zoomIn = useCallback(() => setScale(s => Math.min(3, +(s + 0.25).toFixed(2))), []);
  const zoomOut = useCallback(() => setScale(s => Math.max(0.5, +(s - 0.25).toFixed(2))), []);
  const rotatePage = useCallback(() => setRotation(r => (r + 90) % 360), []);

  const goToPage = useCallback((value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= (pageCount ? pageCount + 1 : num)) {
      setPageNum(num);
      // If jumping to the completion extra page, force-complete
      if (pageCount && num === pageCount + 1) {
        saveProgress(pageCount, true);
      } else {
        saveProgress(num);
      }
      setQuizTriggered(true);
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

  // Télécharger le PDF (utilisateurs connectés uniquement)
  const handleDownload = async () => {
    if (!user) {
      persistRedirectTarget(location.pathname + location.search);
      window.location.href = '/login';
      return;
    }
    try {
      const response = await fetch(effectiveUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'book'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Erreur lors du téléchargement du PDF');
    }
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
  const progress = readerMode === 'scroll'
    ? scrollProgress
    : pageCount > 0
      ? (pageNum / pageCount) * 100
      : 0;

  const completionPageIndex = pageCount > 0 ? pageCount + 1 : 1;
  const shouldShowCompletionPrompt = !completionConfirmed && pageCount > 0 && pageNum === completionPageIndex;

  useEffect(() => {
    const maxPage = pageCount > 0 ? pageCount + 1 : 1;
    const safePage = Math.min(Math.max(pageNum, 1), maxPage);
    if (safePage !== pageNum) {
      setPageNum(safePage);
    }
    setPageInput(String(safePage));
  }, [pageNum, pageCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.sessionStorage.getItem(getPdfStateKey(pdfUrl));
      if (!raw) return;
      const restoredState = JSON.parse(raw) as { pageNum?: number; scale?: number; rotation?: number; readerMode?: ReaderMode };
      if (typeof restoredState.pageNum === 'number' && restoredState.pageNum > 0) {
        setPageNum(restoredState.pageNum);
        setPageInput(String(restoredState.pageNum));
      }
      if (typeof restoredState.scale === 'number' && restoredState.scale > 0) {
        setScale(restoredState.scale);
      }
      if (typeof restoredState.rotation === 'number') {
        setRotation(restoredState.rotation);
      }
      if (restoredState.readerMode === 'page' || restoredState.readerMode === 'scroll') {
        setReaderMode(restoredState.readerMode);
      }
    } catch (err) {
      console.warn('Unable to restore PDF reader state:', err);
    }
  }, [pdfUrl]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(getPdfStateKey(pdfUrl), JSON.stringify({
        pageNum,
        scale,
        rotation,
        readerMode,
      }));
    } catch (err) {
      console.warn('Unable to persist PDF reader state:', err);
    }
  }, [pageNum, scale, rotation, readerMode, pdfUrl]);

  // ── Toolbar ──
  const toolbar = (
    <div className={`flex flex-col gap-0 select-none transition-all duration-300 ${
      isFullscreen && !showToolbar ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
    } ${isFullscreen ? 'absolute top-0 left-0 right-0 z-50 shadow-2xl backdrop-blur-md' : 'relative'}`}>
      <div className={`flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 ${theme.toolbarBg} border-b`}>
        {/* Left */}
        <div className="flex items-center gap-1.5">
          {requiresAuth && (
            <div className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-300">
              <Lock className="h-3.5 w-3.5" />
              Connexion requise
            </div>
          )}
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
          {user && (
            <button
              onClick={handleDownload}
              title="Télécharger le PDF"
              className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg ${theme.btnBg} transition-all active:scale-95 hover:bg-blue-500/30 hover:text-blue-400`}
            >
              <Download size={16} />
            </button>
          )}
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
      {isGuestLocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-6">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-amber-400/30 bg-slate-900/85 px-5 py-4 text-center shadow-2xl backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-gold)]/15">
              <Lock className="h-6 w-6 text-[var(--brand-gold)]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Vous avez atteint la limite de lecture gratuite. Connectez-vous pour continuer.</p>
              <Link to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} className="inline-flex font-semibold text-[var(--brand-gold)] hover:underline">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 w-full max-w-md px-6">
          <div className="w-full rounded-full bg-slate-200 dark:bg-slate-800 h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 transition-all duration-300 ease-out"
              style={{ width: `${Math.max(5, downloadProgress)}%` }}
            />
          </div>
          <div className="flex items-center justify-between w-full text-xs font-semibold text-[var(--text-secondary)]">
            <span>{downloadProgress < 100 ? 'Téléchargement du PDF…' : 'Préparation de l’affichage…'}</span>
            <span>{downloadProgress}%</span>
          </div>
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
          <div className="flex flex-col items-center w-full h-fit">
            {readerMode === 'page' ? (
              <div className="relative my-auto flex flex-col items-center justify-center w-full">
                {/* Book Header - Indication titre et "à lire" */}
                {!isFullscreen && (
                  <div className="w-full mb-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-[var(--brand-gold)]" />
                      <span className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-widest">Livre à lire</span>
                    </div>
                    {title && (
                      <h1 className="text-xl sm:text-2xl font-black text-white dark:text-white mb-2">
                        {title}
                      </h1>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500">Cliquez ou utilisez les flèches pour continuer votre lecture</p>
                  </div>
                )}

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
                    } ${num === pageNum ? `block ${pageFlip ? 'animate-page-flip' : ''}` : 'hidden'}`}
                  />
                ))}
                {/* Completion full-page when in page mode and user moved past last page */}
                {pageNum === completionPageIndex && (
                  <div className="w-full flex justify-center py-12 relative">
                    {showConfetti && <Confetti />}
                    <div className="max-w-3xl w-full rounded-3xl p-8 bg-white dark:bg-gray-900 border border-[var(--border)] shadow-lg text-center">
                      <h2 className="text-2xl font-black text-midnight dark:text-white mb-3">Félicitations — Lecture terminée</h2>
                      <p className="text-sm text-[var(--text-secondary)] mb-6">Vous avez atteint la fin de ce livre. Cliquez sur le bouton ci-dessous pour confirmer que vous l'avez terminé et mettre à jour votre bibliothèque et votre profil.</p>
                      <div className="flex items-center justify-center gap-3">
                        {!completionConfirmed ? (
                          <button
                            onClick={() => { confirmCompletion(); }}
                            disabled={completionSaving}
                            className="inline-flex items-center justify-center rounded-full bg-[var(--brand-midnight)] text-white px-6 py-3 text-sm font-bold transition-all hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <span className={`mr-2 text-xl ${applauseAnim ? 'animate-applaud' : ''}`}>👏</span>
                            {completionSaving ? 'Confirmation...' : 'Confirmer la lecture'}
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                            <BookOpenCheck className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-bold text-green-700">Lecture confirmée</span>
                          </div>
                        )}
                        <button
                          onClick={() => { setPageNum(Math.max(1, pageCount)); setPageInput(String(Math.max(1, pageCount))); }}
                          className="inline-flex items-center justify-center rounded-full bg-white border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                        >
                          Revenir au livre
                        </button>
                      </div>
                      {completionError && <p className="mt-4 text-sm text-red-600">{completionError}</p>}
                    </div>
                  </div>
                )}
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
                {/* Completion full-page appended after all pages in scroll mode */}
                <div className={`relative flex flex-col items-center w-full ${pageCount > 0 ? '' : 'hidden'}`}>
                  <div className="w-full flex justify-center py-16 relative">
                    {showConfetti && <Confetti />}
                    <div className="max-w-3xl w-full rounded-3xl p-10 bg-white dark:bg-gray-900 border border-[var(--border)] shadow-lg text-center">
                      <h2 className="text-3xl font-black text-midnight dark:text-white mb-4">Félicitations ! Vous avez terminé ce livre</h2>
                      <p className="text-sm text-[var(--text-secondary)] mb-6">Confirmez la lecture pour que votre bibliothèque et votre profil soient mis à jour.</p>
                      <div className="flex items-center justify-center gap-3">
                        {!completionConfirmed ? (
                          <button
                            onClick={() => { confirmCompletion(); }}
                            disabled={completionSaving}
                            className="inline-flex items-center justify-center rounded-full bg-[var(--brand-midnight)] text-white px-6 py-3 text-sm font-bold transition-all hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <span className={`mr-2 text-xl ${applauseAnim ? 'animate-applaud' : ''}`}>👏</span>
                            {completionSaving ? 'Confirmation...' : 'Confirmer la lecture'}
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                            <BookOpenCheck className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-bold text-green-700">Lecture confirmée</span>
                          </div>
                        )}
                        <button
                          onClick={() => { const el = canvasRefs.current[pageCount]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                          className="inline-flex items-center justify-center rounded-full bg-white border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                        >
                          Revenir au livre
                        </button>
                      </div>
                      {completionError && <p className="mt-4 text-sm text-red-600">{completionError}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Boutons de survol latéraux pour changer de page en plein écran page-par-page */}
      {readerMode === 'page' && !loading && !error && (
        <>
          {/* Chevron gauche avec animation pulsante */}
          <button
            onClick={prev}
            disabled={pageNum <= 1}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none active:scale-95 group ${
              isFullscreen && !showToolbar ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
            title="Page précédente (← ou Flèche Haut)"
          >
            <ChevronLeft size={24} className={`${pageNum <= 1 ? '' : 'group-hover:animate-pulse-chevron-left'}`} />
          </button>

          {/* Hint for first page */}
          {isFirstPageView && pageCount > 1 && (
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-500 ${
              isFirstPageView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <div className="flex items-center justify-center gap-4 text-white">
                <ChevronLeft size={32} className="animate-pulse-chevron-left opacity-60" />
                <div className="text-center">
                  <p className="text-sm font-bold mb-1 opacity-80">Cliquez ou utilisez les flèches</p>
                  <p className="text-xs opacity-60">pour tourner les pages</p>
                </div>
                <ChevronRight size={32} className="animate-pulse-chevron opacity-60" />
              </div>
            </div>
          )}

          {/* Chevron droit avec animation pulsante */}
          <button
            onClick={next}
            disabled={pageNum >= completionPageIndex}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none active:scale-95 group ${
              isFullscreen && !showToolbar ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
            title="Page suivante (→ ou Flèche Bas)"
          >
            <ChevronRight size={24} className={`${pageNum >= completionPageIndex ? '' : 'group-hover:animate-pulse-chevron'}`} />
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
