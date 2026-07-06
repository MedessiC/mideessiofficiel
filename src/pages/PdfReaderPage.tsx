import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PdfReader from '../components/PdfReader';

export default function PdfReaderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const state = location.state as { pdfUrl?: string; bookTitle?: string } | undefined;
  const pdfUrl = state?.pdfUrl;
  const title = state?.bookTitle || 'Lecture du PDF';

  useEffect(() => {
    if (!pdfUrl) {
      navigate(`/library/${id || ''}`, { replace: true });
    }
  }, [id, navigate, pdfUrl]);

  if (!pdfUrl) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PdfReader pdfUrl={pdfUrl} title={title} modal={false} onClose={() => navigate(`/library/${id || ''}`)} />
    </div>
  );
}
