import { useEffect, useRef, useState } from 'react';
import { X, Download, ExternalLink, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

interface PdfReaderProps {
  pdfUrl: string;
  title?: string;
  modal?: boolean;
  onClose?: () => void;
}

export default function PdfReader({ pdfUrl, title = 'Lecture du PDF', modal = false, onClose }: PdfReaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isCloudinary = pdfUrl.includes('cloudinary.com');
  const effectiveUrl = isCloudinary ? `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}` : pdfUrl;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // Import the legacy build which works well with bundlers like Vite
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
        // Resolve worker path via bundler so Vite serves it correctly
        // @ts-ignore
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.js', import.meta.url).toString();

        const loadingTask = pdfjs.getDocument(effectiveUrl);
        const doc = await loadingTask.promise;
        if (cancelled) return;
        setPdfDoc(doc);
        setPageCount(doc.numPages);
        setPageNum(1);
        setScale(1.0);
        setRotation(0);
      } catch (err: any) {
        console.error('PDF load error', err);
        setError(err?.message || 'Erreur chargement PDF');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [effectiveUrl]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;
      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
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
      }
    };
    renderPage();
  }, [pdfDoc, pageNum, scale, rotation]);

  const prev = () => setPageNum(p => Math.max(1, p - 1));
  const next = () => setPageNum(p => Math.min(pageCount || p + 1, p + 1));
  const zoomIn = () => setScale(s => Math.min(3, +(s + 0.25).toFixed(2)));
  const zoomOut = () => setScale(s => Math.max(0.5, +(s - 0.25).toFixed(2)));
  const rotate = () => setRotation(r => (r + 90) % 360);
  const download = () => {
    const a = document.createElement('a');
    // Prefer original Cloudinary URL for download to avoid proxy returning HTML errors
    const href = isCloudinary ? pdfUrl : effectiveUrl;
    a.href = href;
    a.download = `${title.replace(/\s+/g, '_')}.pdf`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const toolbar = (
    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 px-3 py-2 bg-white border-b">
      <div className="flex items-center gap-2 overflow-x-auto">
        <button onClick={prev} title="Page précédente" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded bg-gray-100 p-2"><ChevronLeft /></button>
        <button onClick={next} title="Page suivante" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded bg-gray-100 p-2"><ChevronRight /></button>
        <div className="text-sm px-2">{pageNum} / {pageCount || '–'}</div>
        <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block" />
        <button onClick={zoomOut} title="Zoom out" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded bg-gray-100 p-2"><ZoomOut /></button>
        <button onClick={zoomIn} title="Zoom in" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded bg-gray-100 p-2"><ZoomIn /></button>
        <div className="text-sm px-2">{Math.round(scale * 100)}%</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={download} title="Télécharger" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded bg-gray-100 p-2"><Download /></button>
        <a href={effectiveUrl} target="_blank" rel="noreferrer" title="Ouvrir dans un nouvel onglet" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded bg-gray-100 p-2"><ExternalLink /></a>
        <button onClick={() => setIsFullscreen(f => !f)} title="Plein écran" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded bg-gray-100 p-2">{isFullscreen ? <Minimize2 /> : <Maximize2 />}</button>
        {onClose && <button onClick={onClose} title="Fermer" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded bg-red-100 p-2"><X /></button>}
      </div>
    </div>
  );

  if (modal) document.body.style.overflow = 'hidden';

  return (
    <div className={`rounded-lg border bg-white ${isFullscreen ? 'fixed inset-0 z-[200] p-4' : ''}`} style={{ maxHeight: isFullscreen ? '100vh' : '80vh', display: 'flex', flexDirection: 'column' }}>
      {toolbar}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-gray-50">
        {loading && <div className="text-sm text-gray-500">Chargement du PDF…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <canvas ref={canvasRef} style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.12)', maxWidth: '100%', height: 'auto' }} />
      </div>
    </div>
  );
}
