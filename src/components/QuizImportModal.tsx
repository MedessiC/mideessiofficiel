import { useState, useRef } from 'react';
import { Upload, Download, AlertCircle, CheckCircle2, Loader2, X, FileJson } from 'lucide-react';
import { parseQuizFile, downloadSampleQuizTemplate, type QuizImportFormat } from '../utils/quizImport';

interface QuizImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (quizzes: QuizImportFormat[]) => void;
  maxPages: number;
}

export default function QuizImportModal({ isOpen, onClose, onImport, maxPages }: QuizImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [parsedData, setParsedData] = useState<QuizImportFormat[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.json')) {
      setError('Veuillez sélectionner un fichier JSON');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Le fichier est trop volumineux (max 5 Mo)');
      return;
    }

    setFile(selectedFile);
    setError('');
    setParsedData(null);
    setSuccess(false);

    // Try to parse immediately
    setLoading(true);
    try {
      const data = await parseQuizFile(selectedFile);
      
      // Validate page numbers
      const invalidPages = data.filter(q => q.trigger_page > maxPages);
      if (invalidPages.length > 0) {
        throw new Error(`Certains quiz ont une page >= ${maxPages}. Max: ${maxPages} pages`);
      }

      setParsedData(data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du parsing du fichier');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (!parsedData) return;
    onImport(parsedData);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setError('');
    setSuccess(false);
    setParsedData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">
              Importer des quiz
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Importez plusieurs quiz à partir d{"'"}un fichier JSON
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Help section */}
        {!file && (
          <div className="bg-blue-950/30 border border-blue-800/50 rounded-xl p-4">
            <p className="text-sm text-blue-200 mb-3">
              📋 <strong>Format JSON requis:</strong> Un tableau contenant vos quiz avec questions et réponses
            </p>
            <button
              onClick={downloadSampleQuizTemplate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition"
            >
              <Download className="w-4 h-4" />
              Télécharger un modèle JSON
            </button>
          </div>
        )}

        {/* File upload */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-600 hover:border-[#ffd700]/40 rounded-2xl p-8 text-center cursor-pointer transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileSelect}
            disabled={loading}
          />
          
          {loading ? (
            <div className="space-y-3">
              <Loader2 className="w-8 h-8 text-[#ffd700] mx-auto animate-spin" />
              <p className="text-sm font-bold text-gray-300">Parsing du fichier...</p>
            </div>
          ) : file ? (
            <div className="space-y-2">
              <FileJson className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-emerald-400">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} Ko</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-2 text-xs text-gray-400 hover:text-white transition"
              >
                Changer de fichier
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-gray-500 mx-auto" />
              <p className="text-sm font-bold text-gray-300">Cliquez pour sélectionner un fichier JSON</p>
              <p className="text-xs text-gray-500">ou glissez-déposez</p>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-200">{error}</div>
          </div>
        )}

        {/* Success preview */}
        {success && parsedData && (
          <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-300">
                  ✓ Fichier valide: {parsedData.length} quiz à importer
                </p>
                <p className="text-xs text-emerald-200 mt-0.5">
                  {parsedData.reduce((acc, q) => acc + q.questions.length, 0)} questions au total
                </p>
              </div>
            </div>

            {/* Quiz preview */}
            <div className="space-y-2">
              {parsedData.map((quiz, idx) => (
                <div key={idx} className="bg-slate-700/50 rounded-lg p-3 text-xs">
                  <p className="font-bold text-white">
                    📖 {quiz.title} <span className="text-gray-400 font-normal">(page {quiz.trigger_page})</span>
                  </p>
                  <p className="text-gray-300 mt-1">
                    {quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-700">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition"
          >
            Annuler
          </button>
          <button
            onClick={handleImport}
            disabled={!success || loading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] to-yellow-400 text-slate-900 font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            ✓ Importer {parsedData?.length || 0} quiz
          </button>
        </div>
      </div>
    </div>
  );
}
