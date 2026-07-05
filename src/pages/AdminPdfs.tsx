import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, Plus, Edit2, Trash2, Save, X, Palette, Sparkles, Users, Loader, LogOut,
  TrendingUp, Award, Download, Clock, AlertCircle, CheckCircle, FileText, Upload,
  Image, ExternalLink, ChevronRight, ChevronLeft, HelpCircle, Zap, Eye, Search,
  BookOpenCheck, GripVertical, Gift, Flame, Star
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadFileToCloudinary } from '../lib/cloudinary';
import { isCloudinaryUrl } from '../utils/cloudinaryImage';
import QuizImportModal from '../components/QuizImportModal';
import { type QuizImportFormat } from '../utils/quizImport';

// ─── Types ───────────────────────────────────────────────────────────────────
type Book = {
  id: string | null;
  title: string;
  category: string;
  description: string;
  price: number;
  author: string;
  cover_color: string;
  cover_image: string;
  article_url: string;
  buy_url: string;
  pdf_url: string;
  week_added: string;
  is_new: boolean;
  is_bestseller: boolean;
  rating: number;
  students: number;
  pages: number;
  level: string;
  created_at?: string;
};

type QuizQuestion = {
  id?: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
};

type QuizDraft = {
  id?: string;
  title: string;
  trigger_page: number;
  questions: QuizQuestion[];
};

type Toast = { id: string; type: 'success' | 'error'; message: string };

type FormStep = 'infos' | 'fichiers' | 'apparence' | 'quiz' | 'recap';

const EMPTY_BOOK: Book = {
  id: null, title: '', category: 'mobile', description: '',
  price: 1000, author: 'MIDEESSI Team', cover_color: 'from-blue-500 to-blue-700',
  cover_image: '', article_url: '', buy_url: '', pdf_url: '',
  week_added: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }),
  is_new: true, is_bestseller: false, rating: 4.5, students: 0, pages: 50, level: 'Débutant'
};

const EMPTY_QUIZ: QuizDraft = {
  title: '', trigger_page: 10,
  questions: [{ question_text: '', options: ['', '', '', ''], correct_option_index: 0 }]
};

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'mobile', name: 'Mobile' }, { id: 'cybersec', name: 'Cybersec' },
  { id: 'webdev', name: 'Web Dev' }, { id: 'design', name: 'Design' },
  { id: 'business', name: 'Business' }, { id: 'data', name: 'Data & IA' },
];

const COVER_COLORS = [
  { id: 'from-blue-500 to-blue-700', name: 'Bleu', preview: 'bg-gradient-to-br from-blue-500 to-blue-700' },
  { id: 'from-red-500 to-red-700', name: 'Rouge', preview: 'bg-gradient-to-br from-red-500 to-red-700' },
  { id: 'from-green-500 to-green-700', name: 'Vert', preview: 'bg-gradient-to-br from-green-500 to-green-700' },
  { id: 'from-purple-500 to-purple-700', name: 'Violet', preview: 'bg-gradient-to-br from-purple-500 to-purple-700' },
  { id: 'from-yellow-500 to-yellow-700', name: 'Jaune', preview: 'bg-gradient-to-br from-yellow-500 to-yellow-700' },
  { id: 'from-indigo-500 to-indigo-700', name: 'Indigo', preview: 'bg-gradient-to-br from-indigo-500 to-indigo-700' },
  { id: 'from-pink-500 to-pink-700', name: 'Rose', preview: 'bg-gradient-to-br from-pink-500 to-pink-700' },
  { id: 'from-teal-500 to-teal-700', name: 'Turquoise', preview: 'bg-gradient-to-br from-teal-500 to-teal-700' },
  { id: 'from-[#191970] to-[#2d2daa]', name: 'Midnight', preview: 'bg-gradient-to-br from-[#191970] to-[#2d2daa]' },
];

const LEVELS = [
  { id: 'Débutant', name: 'Débutant', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { id: 'Intermédiaire', name: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { id: 'Avancé', name: 'Avancé', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
];

const STEPS: { key: FormStep; label: string; emoji: string }[] = [
  { key: 'infos', label: 'Informations', emoji: '📚' },
  { key: 'fichiers', label: 'Fichiers', emoji: '☁️' },
  { key: 'apparence', label: 'Apparence', emoji: '🎨' },
  { key: 'quiz', label: 'Quiz', emoji: '🧠' },
  { key: 'recap', label: 'Publier', emoji: '🚀' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPdfs() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Form steps
  const [currentStep, setCurrentStep] = useState<FormStep>('infos');
  const [formData, setFormData] = useState<Book>({ ...EMPTY_BOOK });

  // Upload states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<{ pdf: number; cover: number } | null>(null);

  // Quiz states (for the form)
  const [quizzes, setQuizzes] = useState<QuizDraft[]>([]);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);

  // Quiz manager modal (for existing books)
  const [quizManagerBook, setQuizManagerBook] = useState<Book | null>(null);
  const [quizManagerData, setQuizManagerData] = useState<QuizDraft[]>([]);
  const [quizManagerLoading, setQuizManagerLoading] = useState(false);
  const [showQuizImportModal, setShowQuizImportModal] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // ── Auth ───────────────────────────────────────────────────────────────────
  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { navigate('/admin/login'); return; }
      const { data: adminData } = await supabase.from('admins').select('*').eq('id', user.id).maybeSingle();
      if (!adminData) { await supabase.auth.signOut(); navigate('/admin/login'); return; }
      await fetchBooks();
    } catch { navigate('/admin/login'); }
    finally { setIsAuthenticating(false); }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const fetchBooks = async () => {
    const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false });
    if (data) setBooks(data);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/admin/login'); };

  const getLevelColor = (level: string) =>
    LEVELS.find(l => l.id === level)?.color || 'bg-gray-100 text-gray-800';

  // ── Quiz helpers ───────────────────────────────────────────────────────────
  const addQuiz = () => {
    setQuizzes(prev => [...prev, { ...EMPTY_QUIZ, title: `Quiz ${prev.length + 1}` }]);
    setActiveQuizIndex(quizzes.length);
  };

  const removeQuiz = (idx: number) => {
    setQuizzes(prev => prev.filter((_, i) => i !== idx));
    setActiveQuizIndex(Math.max(0, activeQuizIndex - 1));
  };

  const updateQuiz = (idx: number, patch: Partial<QuizDraft>) => {
    setQuizzes(prev => prev.map((q, i) => i === idx ? { ...q, ...patch } : q));
  };

  const addQuestion = (quizIdx: number) => {
    const updated = [...quizzes];
    updated[quizIdx].questions.push({ question_text: '', options: ['', '', '', ''], correct_option_index: 0 });
    setQuizzes(updated);
  };

  const removeQuestion = (quizIdx: number, qIdx: number) => {
    const updated = [...quizzes];
    updated[quizIdx].questions = updated[quizIdx].questions.filter((_, i) => i !== qIdx);
    setQuizzes(updated);
  };

  const updateQuestion = (quizIdx: number, qIdx: number, patch: Partial<QuizQuestion>) => {
    const updated = [...quizzes];
    updated[quizIdx].questions[qIdx] = { ...updated[quizIdx].questions[qIdx], ...patch };
    setQuizzes(updated);
  };

  const updateOption = (quizIdx: number, qIdx: number, optIdx: number, value: string) => {
    const updated = [...quizzes];
    updated[quizIdx].questions[qIdx].options[optIdx] = value;
    setQuizzes(updated);
  };

  // ── Save quizzes to Supabase ───────────────────────────────────────────────
  const saveQuizzesForBook = async (bookId: string, quizzesToSave: QuizDraft[]) => {
    // Delete existing quizzes for this book (cascade deletes questions + attempts)
    // But only delete ones not in the current set (by id)
    const existingIds = quizzesToSave.filter(q => q.id).map(q => q.id!);

    // Get all existing quiz IDs for this book
    const { data: existingQuizzes } = await supabase
      .from('book_quizzes').select('id').eq('book_id', bookId);

    const toDelete = (existingQuizzes || []).filter(q => !existingIds.includes(q.id)).map(q => q.id);
    if (toDelete.length > 0) {
      await supabase.from('book_quizzes').delete().in('id', toDelete);
    }

    // Upsert quizzes
    for (const quiz of quizzesToSave) {
      if (!quiz.title.trim()) continue;

      let quizId = quiz.id;
      if (quizId) {
        // Update existing
        await supabase.from('book_quizzes').update({
          title: quiz.title,
          trigger_page: quiz.trigger_page,
        }).eq('id', quizId);
        // Delete old questions and re-insert
        await supabase.from('quiz_questions').delete().eq('quiz_id', quizId);
      } else {
        // Insert new
        const { data: newQuiz } = await supabase.from('book_quizzes').insert({
          book_id: bookId,
          title: quiz.title,
          trigger_page: quiz.trigger_page,
        }).select('id').single();
        quizId = newQuiz?.id;
      }

      if (!quizId) continue;

      // Insert questions
      const validQuestions = quiz.questions.filter(q => q.question_text.trim() && q.options.some(o => o.trim()));
      if (validQuestions.length > 0) {
        await supabase.from('quiz_questions').insert(
          validQuestions.map(q => ({
            quiz_id: quizId,
            question_text: q.question_text,
            options: q.options,
            correct_option_index: q.correct_option_index,
          }))
        );
      }
    }
  };

  // ── Load quizzes for a book ───────────────────────────────────────────────
  const loadQuizzesForBook = async (bookId: string): Promise<QuizDraft[]> => {
    const { data: quizData } = await supabase
      .from('book_quizzes').select('id, title, trigger_page').eq('book_id', bookId).order('trigger_page');

    if (!quizData || quizData.length === 0) return [];

    const result: QuizDraft[] = [];
    for (const quiz of quizData) {
      const { data: questions } = await supabase
        .from('quiz_questions').select('id, question_text, options, correct_option_index').eq('quiz_id', quiz.id);

      result.push({
        id: quiz.id,
        title: quiz.title,
        trigger_page: quiz.trigger_page,
        questions: (questions || []).map(q => ({
          id: q.id,
          question_text: q.question_text,
          options: q.options as string[],
          correct_option_index: q.correct_option_index,
        })),
      });
    }
    return result;
  };

  // ── Handle imported quizzes (from JSON) ───────────────────────────────────
  const handleImportQuizzes = async (imported: QuizImportFormat[]) => {
    // Convert imported format to QuizDraft
    const converted: QuizDraft[] = imported.map(i => ({
      title: i.title,
      trigger_page: i.trigger_page,
      questions: i.questions.map(q => ({
        question_text: q.question_text,
        options: q.options,
        correct_option_index: q.correct_option_index,
      }))
    }));

    if (quizManagerBook?.id) {
      const merged = [...quizManagerData, ...converted];
      try {
        setQuizManagerLoading(true);
        await saveQuizzesForBook(quizManagerBook.id, merged);
        setQuizManagerData(merged);
        addToast('success', `Importé ${converted.length} quiz pour "${quizManagerBook.title}"`);
      } catch (err) {
        addToast('error', err instanceof Error ? err.message : 'Erreur lors de l\'import');
      } finally {
        setQuizManagerLoading(false);
        setShowQuizImportModal(false);
      }
      return;
    }

    // If editing an existing book, persist immediately
    if (editingBook && editingBook.id) {
      const merged = [...quizzes, ...converted];
      try {
        setLoading(true);
        await saveQuizzesForBook(editingBook.id, merged);
        setQuizzes(merged);
        addToast('success', `Importé ${converted.length} quiz pour "${editingBook.title}"`);
        // refresh quiz manager if open
        if (quizManagerBook && quizManagerBook.id === editingBook.id) {
          const refreshed = await loadQuizzesForBook(editingBook.id);
          setQuizManagerData(refreshed);
        }
      } catch (err) {
        addToast('error', err instanceof Error ? err.message : 'Erreur lors de l\'import');
      } finally {
        setLoading(false);
        setShowQuizImportModal(false);
      }
      return;
    }

    // If creating a new book, merge into local quizzes state for later save
    setQuizzes(prev => [...prev, ...converted]);
    setActiveQuizIndex(quizzes.length); // jump to first newly added
    addToast('success', `Importé ${converted.length} quiz localement (en attente de publication)`);
    setShowQuizImportModal(false);
  };

  // ── Upload ────────────────────────────────────────────────────────────────
  const uploadToCloudinary = async (file: File, folder: string, key: 'pdf' | 'cover', type: 'auto' | 'raw' = 'auto') => {
    setUploadProgress(prev => ({ ...(prev ?? { pdf: 0, cover: 0 }), [key]: 10 }));
    const url = await uploadFileToCloudinary(file, folder, type);
    setUploadProgress(prev => ({ ...(prev ?? { pdf: 0, cover: 0 }), [key]: 100 }));
    return url;
  };

  // ── Submit book form ──────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!formData.title || !formData.description) { addToast('error', 'Titre et description obligatoires'); return; }
    if (!editingBook && !pdfFile && !formData.pdf_url) { addToast('error', 'Un fichier PDF est requis'); return; }

    setLoading(true);
    setUploadProgress({ pdf: 0, cover: 0 });

    try {
      let pdfUrl = formData.pdf_url;
      let coverImageUrl = formData.cover_image;

      if (pdfFile) {
        addToast('success', '📤 Upload du PDF en cours...');
        pdfUrl = await uploadToCloudinary(pdfFile, 'mideessi/pdfs', 'pdf', 'raw');
      }
      if (coverFile) {
        addToast('success', '🖼️ Upload de la couverture en cours...');
        coverImageUrl = await uploadToCloudinary(coverFile, 'mideessi/covers', 'cover', 'auto');
      }

      const payload = {
        title: formData.title, category: formData.category, description: formData.description,
        price: formData.price, author: formData.author, cover_color: formData.cover_color,
        cover_image: coverImageUrl, article_url: formData.article_url, buy_url: formData.buy_url,
        pdf_url: pdfUrl, week_added: formData.week_added, is_new: formData.is_new,
        is_bestseller: formData.is_bestseller, rating: formData.rating,
        students: formData.students, pages: formData.pages, level: formData.level,
      };

      let bookId: string;

      if (editingBook) {
        await supabase.from('books').update(payload).eq('id', editingBook.id);
        bookId = editingBook.id!;
        addToast('success', '✅ Livre mis à jour avec succès');
      } else {
        const { data: newBook, error } = await supabase.from('books')
          .insert([{ ...payload, created_at: new Date().toISOString() }])
          .select('id').single();
        if (error) throw error;
        bookId = newBook.id;
        addToast('success', '🚀 Livre publié sur la bibliothèque !');
      }

      // Save quizzes
      if (quizzes.length > 0) {
        await saveQuizzesForBook(bookId, quizzes);
        addToast('success', `🧠 ${quizzes.length} quiz sauvegardé(s)`);
      }

      await fetchBooks();
      resetForm();
    } catch (err: any) {
      addToast('error', err.message || 'Erreur lors de la publication');
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  // ── Toggle free book ──────────────────────────────────────────────────────
  const handleToggleFree = async (book: Book) => {
    const newPrice = book.price === 0 ? 1000 : 0;
    try {
      const { error } = await supabase
        .from('books')
        .update({ price: newPrice })
        .eq('id', book.id);
      
      if (error) throw error;
      
      setBooks(books.map(b => b.id === book.id ? { ...b, price: newPrice } : b));
      const status = newPrice === 0 ? '✅ Livre rendu gratuit' : '💰 Livre remis à la vente';
      addToast('success', status);
    } catch (err: any) {
      addToast('error', err.message || 'Erreur lors de la mise à jour');
    }
  };

  // ── Delete book ───────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce livre ? Cette action est irréversible.')) return;
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) { addToast('error', error.message); return; }
    setBooks(books.filter(b => b.id !== id));
    addToast('success', '🗑️ Livre supprimé');
  };

  // ── Edit book ──────────────────────────────────────────────────────────────
  const handleEdit = async (book: Book) => {
    setEditingBook(book);
    setFormData(book);
    setCoverPreview(book.cover_image || '');
    setCurrentStep('infos');
    // Load existing quizzes
    if (book.id) {
      const existingQuizzes = await loadQuizzesForBook(book.id);
      setQuizzes(existingQuizzes);
    }
    setShowForm(true);
  };

  // ── Open quiz manager for existing book ───────────────────────────────────
  const openQuizManager = async (book: Book) => {
    setQuizManagerBook(book);
    setQuizManagerLoading(true);
    if (book.id) {
      const data = await loadQuizzesForBook(book.id);
      setQuizManagerData(data);
    }
    setQuizManagerLoading(false);
  };

  // ── Save quiz manager ─────────────────────────────────────────────────────
  const saveQuizManager = async () => {
    if (!quizManagerBook?.id) return;
    setQuizManagerLoading(true);
    try {
      await saveQuizzesForBook(quizManagerBook.id, quizManagerData);
      addToast('success', '🧠 Quiz mis à jour avec succès');
      setQuizManagerBook(null);
    } catch (err: any) {
      addToast('error', err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setQuizManagerLoading(false);
    }
  };

  // ── Reset form ────────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({ ...EMPTY_BOOK });
    setPdfFile(null); setCoverFile(null); setCoverPreview('');
    setUploadProgress(null); setEditingBook(null);
    setQuizzes([]); setActiveQuizIndex(0);
    setCurrentStep('infos'); setShowForm(false);
  };

  // ── Step validation ───────────────────────────────────────────────────────
  const stepValid = (step: FormStep): boolean => {
    if (step === 'infos') return !!(formData.title && formData.description);
    if (step === 'fichiers') return !!(pdfFile || formData.pdf_url || editingBook);
    return true;
  };

  const stepIndex = STEPS.findIndex(s => s.key === currentStep);

  // ── Filtered books ────────────────────────────────────────────────────────
  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ═══════════════════════════════════════════════════════════════════════════
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <Loader className="w-10 h-10 text-[var(--brand-gold)] animate-spin" />
          <p className="text-sm text-gray-400">Vérification admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white pb-20">

      {/* ── Toast ── */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold border ${
            t.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-700 text-emerald-200'
              : 'bg-red-900/90 border-red-700 text-red-200'
          } backdrop-blur-md`}>
            {t.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {t.message}
          </div>
        ))}
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#0f1117]/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 p-2 bg-[var(--brand-midnight)] rounded-xl border border-[var(--brand-gold)]/20">
              <BookOpen className="w-5 h-5 text-[var(--brand-gold)]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-black text-white">Admin · PDF Editor</h1>
              <p className="text-[10px] text-gray-400 hidden sm:block">Gestion des ebooks · Quiz interactifs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!showForm && (
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="inline-flex items-center gap-2 bg-[var(--brand-gold)] text-[var(--brand-midnight)] font-black px-4 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nouveau livre</span>
                <span className="sm:hidden">Nouveau</span>
              </button>
            )}
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all" title="Déconnexion">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════ LIBRARY LIST VIEW ════════════════ */}
      {!showForm && !quizManagerBook && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Total livres', value: books.length, icon: BookOpen, color: 'text-blue-400' },
              { label: 'Nouveaux', value: books.filter(b => b.is_new).length, icon: Sparkles, color: 'text-yellow-400' },
              { label: 'Bestsellers', value: books.filter(b => b.is_bestseller).length, icon: Award, color: 'text-red-400' },
              { label: 'Lecteurs', value: books.reduce((s, b) => s + b.students, 0), icon: Users, color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/8 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                    <p className="text-2xl font-black text-white mt-1">{s.value}</p>
                  </div>
                  <s.icon className={`w-8 h-8 ${s.color} opacity-40`} />
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher un livre..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-gold)]/50 transition-colors"
            />
          </div>

          {/* Books grid */}
          <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/8 flex items-center justify-between">
              <h2 className="font-black text-white">Bibliothèque ({filteredBooks.length})</h2>
              <span className="text-[10px] text-gray-400 bg-white/5 px-3 py-1 rounded-full">☁️ Cloudinary</span>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="p-16 text-center space-y-3">
                <BookOpen className="w-14 h-14 text-gray-600 mx-auto" />
                <p className="text-gray-400 font-semibold">Aucun livre publié</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredBooks.map(book => (
                  <div key={book.id!} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                    {/* Cover */}
                    <div className={`relative h-36 bg-gradient-to-br ${book.cover_color} overflow-hidden`}>
                      {book.cover_image
                        ? <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
                        : <BookOpen className="absolute inset-0 m-auto w-12 h-12 text-white opacity-30" />
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {book.is_new && <span className="px-2 py-0.5 bg-yellow-400 text-gray-900 text-[9px] font-black rounded-full flex items-center gap-1"><Flame className="w-3 h-3" />NEW</span>}
                        {book.is_bestseller && <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-black rounded-full">🔥 BEST</span>}
                      </div>
                      {book.pdf_url && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center gap-1">
                            <FileText className="w-2.5 h-2.5" /> PDF
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2">
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-full ${getLevelColor(book.level)}`}>{book.level}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-black text-sm text-white line-clamp-2">{book.title}</h3>
                      <p className="text-[10px] text-gray-400">{book.author} · {book.category}</p>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 pt-1">
                        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-yellow-400" />{book.rating}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3 text-blue-400" />{book.students}</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-emerald-400" />{book.pages}p</span>
                        <span className="ml-auto font-black text-[var(--brand-gold)] flex items-center gap-1">{book.price === 0 ? <><Gift className="w-4 h-4" /> Gratuit</> : `${book.price} FCFA`}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                      <Link to={`/library/${book.id}`} target="_blank"
                        className="inline-flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-colors">
                        <Eye className="w-3.5 h-3.5" /> Voir
                      </Link>
                      <button onClick={() => handleEdit(book)}
                        className="inline-flex items-center justify-center gap-1.5 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl text-xs font-semibold transition-colors">
                        <Edit2 className="w-3.5 h-3.5" /> Modifier
                      </button>
                      <button onClick={() => handleToggleFree(book)}
                        className={`inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          book.price === 0
                            ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                            : 'bg-[var(--brand-gold)]/10 hover:bg-[var(--brand-gold)]/20 text-[var(--brand-gold)]'
                        }`}>
                        {book.price === 0 ? '💰 Repayer' : <><Gift className="w-3.5 h-3.5" /> Gratuit</>}
                      </button>
                      <button onClick={() => openQuizManager(book)}
                        className="col-span-2 inline-flex items-center justify-center gap-1.5 py-2 bg-[var(--brand-gold)]/10 hover:bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] rounded-xl text-xs font-black transition-colors">
                        <HelpCircle className="w-3.5 h-3.5" /> Gérer les Quiz
                      </button>
                      <button onClick={() => handleDelete(book.id!)}
                        className="col-span-2 inline-flex items-center justify-center gap-1.5 py-1.5 text-red-500/70 hover:text-red-500 rounded-xl text-xs font-semibold transition-colors hover:bg-red-500/5">
                        <Trash2 className="w-3 h-3" /> Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════ QUIZ MANAGER MODAL ════════════════ */}
      {quizManagerBook && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <button onClick={() => setQuizManagerBook(null)} className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-2">
                <ChevronLeft className="w-3.5 h-3.5" /> Retour à la bibliothèque
              </button>
              <h2 className="text-xl font-black text-white">🧠 Quiz — {quizManagerBook.title}</h2>
              <p className="text-xs text-gray-400 mt-1">Créez et gérez les quiz interactifs pour ce livre.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setShowQuizImportModal(true)}
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-200 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
                <Upload className="w-4 h-4" /> Importer JSON
              </button>
              <button onClick={saveQuizManager} disabled={quizManagerLoading}
                className="inline-flex items-center gap-2 bg-[var(--brand-gold)] text-[var(--brand-midnight)] font-black px-5 py-2.5 rounded-xl text-sm hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg">
                {quizManagerLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Sauvegarder
              </button>
            </div>
          </div>

          <QuizEditor
            quizzes={quizManagerData}
            setQuizzes={setQuizManagerData}
            activeIndex={activeQuizIndex}
            setActiveIndex={setActiveQuizIndex}
            onAdd={() => { setQuizManagerData(prev => [...prev, { ...EMPTY_QUIZ, title: `Quiz ${prev.length + 1}` }]); setActiveQuizIndex(quizManagerData.length); }}
            onRemove={(idx) => { setQuizManagerData(prev => prev.filter((_, i) => i !== idx)); setActiveQuizIndex(Math.max(0, activeQuizIndex - 1)); }}
            pages={quizManagerBook.pages}
          />
        </div>
      )}

      {/* ════════════════ PUBLISH FORM ════════════════ */}
      {showForm && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

          {/* Form header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <button onClick={resetForm} className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-2">
                <ChevronLeft className="w-3.5 h-3.5" /> Retour
              </button>
              <h2 className="text-xl font-black text-white">
                {editingBook ? `✏️ Modifier — ${editingBook.title}` : '🚀 Publier un nouveau livre'}
              </h2>
            </div>
            <button onClick={resetForm} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Steps progress bar */}
          <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
            {STEPS.map((step, idx) => {
              const isActive = step.key === currentStep;
              const isDone = idx < stepIndex;
              return (
                <button
                  key={step.key}
                  onClick={() => setCurrentStep(step.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-[var(--brand-gold)] text-[var(--brand-midnight)]'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-gray-500 border border-white/10'
                  }`}
                >
                  <span>{step.emoji}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                  {isDone && <CheckCircle className="w-3 h-3" />}
                </button>
              );
            })}
          </div>

          {/* Live preview strip */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex items-center gap-4">
            <div className={`w-12 h-16 rounded-lg flex-shrink-0 bg-gradient-to-br ${formData.cover_color} overflow-hidden`}>
              {coverPreview
                ? <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                : <BookOpen className="w-5 h-5 m-auto mt-4 text-white/40" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-white truncate">{formData.title || '— Titre —'}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{formData.category} · {formData.level} · {formData.pages}p · {formData.price === 0 ? 'Gratuit' : `${formData.price} FCFA`}</p>
              <div className="flex items-center gap-2 mt-1">
                {(pdfFile || formData.pdf_url) && <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> PDF prêt</span>}
                {quizzes.length > 0 && <span className="text-[9px] text-[var(--brand-gold)] font-bold flex items-center gap-1"><HelpCircle className="w-3 h-3" /> {quizzes.length} quiz</span>}
              </div>
            </div>
          </div>

          {/* ── STEP: Infos ── */}
          {currentStep === 'infos' && (
            <div className="space-y-4">
              <FormSection title="📚 Informations générales">
                <FormField label="Titre du livre *">
                  <input type="text" value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className={INPUT_CLS} placeholder="Ex: Guide complet du développement mobile" required />
                </FormField>
                <FormField label="Auteur">
                  <input type="text" value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className={INPUT_CLS} placeholder="MIDEESSI Team" />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Catégorie *">
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={INPUT_CLS}>
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Niveau *">
                    <select value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} className={INPUT_CLS}>
                      {LEVELS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </FormField>
                </div>
                <FormField label="Description *">
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={4} className={INPUT_CLS} placeholder="Décrivez le contenu du livre, ce que le lecteur va apprendre..." required />
                </FormField>
              </FormSection>

              <FormSection title="📊 Statistiques & Prix">
                <FormField label="Publier gratuitement">
                  <label className="flex items-center gap-3 text-sm text-gray-200">
                    <input
                      type="checkbox"
                      checked={formData.price === 0}
                      onChange={e => setFormData({ ...formData, price: e.target.checked ? 0 : formData.price || 1000 })}
                      className="w-4 h-4 accent-[var(--brand-gold)] rounded"
                    />
                    <span>Le livre sera distribué gratuitement (0 FCFA).</span>
                  </label>
                </FormField>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Prix (FCFA)', key: 'price', type: 'number', min: 0 },
                    { label: 'Pages', key: 'pages', type: 'number', min: 1 },
                    { label: 'Note /5', key: 'rating', type: 'number', step: '0.1', min: 0, max: 5 },
                    { label: 'Lecteurs', key: 'students', type: 'number', min: 0 },
                  ].map(f => (
                    <FormField key={f.key} label={f.label}>
                      <input type={f.type} value={(formData as any)[f.key]} step={(f as any).step}
                        min={(f as any).min} max={(f as any).max}
                        onChange={e => setFormData({ ...formData, [f.key]: f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })}
                        disabled={f.key === 'price' && formData.price === 0}
                        className={INPUT_CLS} />
                    </FormField>
                  ))}
                </div>
                <FormField label="Semaine d'ajout">
                  <input type="text" value={formData.week_added}
                    onChange={e => setFormData({ ...formData, week_added: e.target.value })}
                    className={INPUT_CLS} placeholder="Ex: 4 juillet 2026" />
                </FormField>
              </FormSection>

              <FormSection title="🏷️ Badges">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'is_new', label: <><Star className="w-4 h-4 text-yellow-400" /> Nouveau</>, sub: 'Badge "NEW" sur la carte' },
                    { key: 'is_bestseller', label: '🔥 Bestseller', sub: 'Badge "BEST" + mis en avant' },
                  ].map(badge => (
                    <label key={badge.key} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${(formData as any)[badge.key] ? 'border-[var(--brand-gold)]/60 bg-[var(--brand-gold)]/5' : 'border-white/10 hover:border-white/20'}`}>
                      <input type="checkbox" checked={(formData as any)[badge.key]}
                        onChange={e => setFormData({ ...formData, [badge.key]: e.target.checked })}
                        className="w-4 h-4 accent-[var(--brand-gold)]" />
                      <div>
                        <p className="font-bold text-sm text-white">{badge.label}</p>
                        <p className="text-[10px] text-gray-400">{badge.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </FormSection>

              <FormSection title="🔗 Liens externes (optionnels)">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Article de blog associé">
                    <input type="url" value={formData.article_url}
                      onChange={e => setFormData({ ...formData, article_url: e.target.value })}
                      className={INPUT_CLS} placeholder="https://..." />
                  </FormField>
                  <FormField label="Lien d'achat">
                    <input type="url" value={formData.buy_url}
                      onChange={e => setFormData({ ...formData, buy_url: e.target.value })}
                      className={INPUT_CLS} placeholder="https://..." />
                  </FormField>
                </div>
              </FormSection>
            </div>
          )}

          {/* ── STEP: Fichiers ── */}
          {currentStep === 'fichiers' && (
            <div className="space-y-4">
              <FormSection title="☁️ Fichier PDF">
                <div
                  className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-[var(--brand-gold)]/40 transition-colors cursor-pointer"
                  onClick={() => pdfInputRef.current?.click()}
                >
                  <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden"
                    onChange={e => setPdfFile(e.target.files?.[0] || null)} />
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                  {pdfFile ? (
                    <div>
                      <p className="text-sm font-black text-emerald-400">{pdfFile.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{(pdfFile.size / 1024 / 1024).toFixed(1)} Mo · Cloudinary</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-gray-300">Cliquez pour sélectionner un PDF</p>
                      <p className="text-xs text-gray-500 mt-1">ou glissez-déposez ici</p>
                    </div>
                  )}
                </div>
                {(editingBook || formData.pdf_url) && (
                  <div className="mt-3">
                    <label className="text-[10px] text-gray-400 block mb-1">Ou lien Cloudinary existant (si pas de ré-upload)</label>
                    <input type="url" value={formData.pdf_url}
                      onChange={e => setFormData({ ...formData, pdf_url: e.target.value })}
                      className={INPUT_CLS} placeholder="https://res.cloudinary.com/..." />
                    {formData.pdf_url && !pdfFile && (
                      <a href={formData.pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-1.5 text-xs text-blue-400 hover:underline">
                        <ExternalLink className="w-3 h-3" /> Voir le PDF actuel
                      </a>
                    )}
                  </div>
                )}
                {uploadProgress && uploadProgress.pdf > 0 && (
                  <ProgressBar label="Upload PDF..." value={uploadProgress.pdf} color="bg-[var(--brand-midnight)]" />
                )}
              </FormSection>

              <FormSection title="🖼️ Image de couverture (optionnel)">
                <div className="flex gap-4 items-start">
                  <div className={`w-20 h-28 rounded-xl flex-shrink-0 overflow-hidden border-2 border-dashed border-white/20 cursor-pointer hover:border-[var(--brand-gold)]/40 transition-colors bg-gradient-to-br ${formData.cover_color} flex items-center justify-center`}
                    onClick={() => coverInputRef.current?.click()}>
                    {coverPreview ? <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" /> : <Image className="w-5 h-5 text-white/40" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0] || null; setCoverFile(f); if (f) { const r = new FileReader(); r.onload = ev => setCoverPreview(ev.target?.result as string); r.readAsDataURL(f); } }} />
                    <button type="button" onClick={() => coverInputRef.current?.click()}
                      className="w-full py-2.5 border border-white/15 rounded-xl text-xs text-gray-400 hover:border-[var(--brand-gold)]/40 hover:text-white transition-all flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5" /> {coverFile ? coverFile.name : 'Choisir une image...'}
                    </button>
                    <input type="url" value={coverFile ? '' : formData.cover_image}
                      onChange={e => { setFormData({ ...formData, cover_image: e.target.value }); setCoverPreview(e.target.value); }}
                      disabled={!!coverFile} className={`${INPUT_CLS} text-xs`} placeholder="Ou entrez une URL Cloudinary..." />
                    <p className="text-[9px] text-gray-500">JPG, PNG, WebP · Max 5 Mo · Hébergée sur Cloudinary</p>
                  </div>
                </div>
                {uploadProgress && uploadProgress.cover > 0 && (
                  <ProgressBar label="Upload couverture..." value={uploadProgress.cover} color="bg-[var(--brand-gold)]" />
                )}
              </FormSection>
            </div>
          )}

          {/* ── STEP: Apparence ── */}
          {currentStep === 'apparence' && (
            <FormSection title="🎨 Couleur de fond (si pas d'image de couverture)">
              <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                {COVER_COLORS.map(c => (
                  <button key={c.id} type="button" onClick={() => setFormData({ ...formData, cover_color: c.id })}
                    className={`h-10 rounded-xl ${c.preview} transition-all ${formData.cover_color === c.id ? 'ring-4 ring-offset-2 ring-[var(--brand-gold)] ring-offset-[#0f1117] scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
                    title={c.name} />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className={`w-20 h-28 rounded-xl flex-shrink-0 bg-gradient-to-br ${formData.cover_color} overflow-hidden flex items-center justify-center`}>
                  {coverPreview ? <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" /> : <BookOpen className="w-6 h-6 text-white/40" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{formData.title || 'Titre du livre'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formData.author}</p>
                </div>
              </div>
            </FormSection>
          )}

          {/* ── STEP: Quiz ── */}
          {currentStep === 'quiz' && (
            <div className="space-y-4">
              <div className="bg-[var(--brand-gold)]/5 border border-[var(--brand-gold)]/20 rounded-2xl p-4 flex items-start gap-3">
                <Zap className="w-5 h-5 text-[var(--brand-gold)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black text-white">Quiz interactifs après chaque chapitre</p>
                  <p className="text-xs text-gray-400 mt-0.5">Définissez à quelle page du PDF le quiz apparaîtra. Les lecteurs peuvent répondre ou passer pour plus tard. Leurs scores s'affichent sur leur profil.</p>
                </div>
              </div>

              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={() => setShowQuizImportModal(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 text-gray-200 rounded-lg hover:bg-white/10 text-sm font-bold"
                >
                  <Upload className="w-4 h-4" /> Importer JSON
                </button>
              </div>

              <QuizEditor
                quizzes={quizzes}
                setQuizzes={setQuizzes}
                activeIndex={activeQuizIndex}
                setActiveIndex={setActiveQuizIndex}
                onAdd={addQuiz}
                onRemove={removeQuiz}
                pages={formData.pages}
              />
              <QuizImportModal
                isOpen={showQuizImportModal}
                onClose={() => setShowQuizImportModal(false)}
                onImport={handleImportQuizzes}
                maxPages={formData.pages || 9999}
              />
            </div>
          )}

          {/* ── STEP: Récapitulatif & Publier ── */}
          {currentStep === 'recap' && (
            <div className="space-y-4">
              <FormSection title="📋 Récapitulatif avant publication">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className={`w-16 h-20 rounded-xl flex-shrink-0 bg-gradient-to-br ${formData.cover_color} overflow-hidden`}>
                    {coverPreview ? <img src={coverPreview} alt="" className="w-full h-full object-cover" /> : <BookOpen className="w-6 h-6 m-auto mt-6 text-white/40" />}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-black text-white">{formData.title}</p>
                    <p className="text-xs text-gray-400">{formData.author} · {formData.category} · {formData.level}</p>
                    <p className="text-xs text-[var(--brand-gold)] font-bold">{formData.price === 0 ? 'Gratuit' : `${formData.price} FCFA`}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        pdfFile ? '✅ Nouveau PDF sélectionné' : formData.pdf_url ? '✅ PDF existant' : '❌ PDF manquant',
                        coverFile || formData.cover_image ? '✅ Couverture' : '⚠️ Pas d\'image',
                        quizzes.length > 0 ? `✅ ${quizzes.length} quiz configuré(s)` : '— Aucun quiz',
                        formData.is_new ? <><Flame className="w-3 h-3" /> Nouveau</> : null,
                        formData.is_bestseller ? '🔥 Bestseller' : null,
                      ].filter(Boolean).map((item, i) => (
                        <span key={i} className="text-[10px] text-gray-300 bg-white/5 px-2 py-0.5 rounded-lg">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {quizzes.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quiz configurés</p>
                    {quizzes.map((q, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
                        <HelpCircle className="w-4 h-4 text-[var(--brand-gold)] flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white">{q.title || `Quiz ${i + 1}`}</p>
                          <p className="text-gray-400">{q.questions.filter(q2 => q2.question_text).length} questions · Déclenché page {q.trigger_page}</p>
                        </div>
                        <button onClick={() => setCurrentStep('quiz')} className="text-gray-500 hover:text-white transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={handleSubmit} disabled={loading || !formData.title || (!pdfFile && !formData.pdf_url && !editingBook)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-3 py-4 bg-[var(--brand-gold)] text-[var(--brand-midnight)] font-black text-base rounded-2xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-xl">
                  {loading
                    ? <><Loader className="w-5 h-5 animate-spin" /> Publication en cours...</>
                    : <><Zap className="w-5 h-5" />{editingBook ? 'Mettre à jour' : '🚀 Publier maintenant'}</>}
                </button>
              </FormSection>
            </div>
          )}

          {/* Step navigation buttons */}
          <div className="flex items-center justify-between gap-3 mt-6 pt-6 border-t border-white/10">
            <button onClick={() => setCurrentStep(STEPS[Math.max(0, stepIndex - 1)].key)}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>
            {stepIndex < STEPS.length - 1 && (
              <button onClick={() => setCurrentStep(STEPS[Math.min(STEPS.length - 1, stepIndex + 1)].key)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--brand-midnight)] text-[var(--brand-gold)] border border-[var(--brand-gold)]/20 rounded-xl text-sm font-black hover:opacity-90 transition-opacity shadow-sm">
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const INPUT_CLS = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-gold)]/50 transition-colors";

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
      <h3 className="text-sm font-black text-white border-b border-white/10 pb-3">{title}</h3>
      {children}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
      {children}
    </div>
  );
}

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1"><span>{label}</span><span>{value}%</span></div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// ─── Quiz Editor (reusable for form step and quiz manager) ────────────────────
function QuizEditor({
  quizzes, setQuizzes, activeIndex, setActiveIndex, onAdd, onRemove, pages
}: {
  quizzes: QuizDraft[];
  setQuizzes: React.Dispatch<React.SetStateAction<QuizDraft[]>>;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  pages: number;
}) {
  const quiz = quizzes[activeIndex];

  const updateQuiz = (patch: Partial<QuizDraft>) => {
    setQuizzes(prev => prev.map((q, i) => i === activeIndex ? { ...q, ...patch } : q));
  };

  const addQuestion = () => {
    if (!quiz) return;
    updateQuiz({ questions: [...quiz.questions, { question_text: '', options: ['', '', '', ''], correct_option_index: 0 }] });
  };

  const removeQuestion = (qIdx: number) => {
    if (!quiz) return;
    updateQuiz({ questions: quiz.questions.filter((_, i) => i !== qIdx) });
  };

  const updateQuestion = (qIdx: number, patch: Partial<QuizDraft['questions'][0]>) => {
    if (!quiz) return;
    const updated = quiz.questions.map((q, i) => i === qIdx ? { ...q, ...patch } : q);
    updateQuiz({ questions: updated });
  };

  const updateOption = (qIdx: number, optIdx: number, value: string) => {
    if (!quiz) return;
    const updated = quiz.questions.map((q, i) => {
      if (i !== qIdx) return q;
      const opts = [...q.options];
      opts[optIdx] = value;
      return { ...q, options: opts };
    });
    updateQuiz({ questions: updated });
  };

  return (
    <div className="space-y-4">
      {/* Quiz tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {quizzes.map((q, i) => (
          <button key={i} onClick={() => setActiveIndex(i)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              i === activeIndex ? 'bg-[var(--brand-gold)] text-[var(--brand-midnight)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}>
            🧠 {q.title || `Quiz ${i + 1}`}
            <button type="button" onClick={e => { e.stopPropagation(); onRemove(i); }}
              className="ml-1 opacity-60 hover:opacity-100 transition-opacity">
              <X className="w-3 h-3" />
            </button>
          </button>
        ))}
        <button type="button" onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:bg-[var(--brand-gold)]/10 hover:text-[var(--brand-gold)] border border-dashed border-white/15 transition-all">
          <Plus className="w-3 h-3" /> Ajouter un quiz
        </button>
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-2xl">
          <HelpCircle className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold">Aucun quiz créé pour ce livre</p>
          <p className="text-xs mt-1 opacity-60">Cliquez sur "Ajouter un quiz" pour commencer</p>
        </div>
      )}

      {quiz && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">
          {/* Quiz header fields */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Titre du quiz">
              <input type="text" value={quiz.title}
                onChange={e => updateQuiz({ title: e.target.value })}
                className={INPUT_CLS} placeholder="Ex: Quiz Chapitre 1" />
            </FormField>
            <FormField label={`Page de déclenchement (max ${pages})`}>
              <input type="number" value={quiz.trigger_page}
                onChange={e => updateQuiz({ trigger_page: Math.max(1, parseInt(e.target.value) || 1) })}
                className={INPUT_CLS} min={1} max={pages} />
            </FormField>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Questions ({quiz.questions.length})</p>
              <button type="button" onClick={addQuestion}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--brand-gold)] bg-[var(--brand-gold)]/10 hover:bg-[var(--brand-gold)]/20 rounded-xl transition-colors">
                <Plus className="w-3 h-3" /> Ajouter une question
              </button>
            </div>

            {quiz.questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[10px] font-black text-[var(--brand-gold)] bg-[var(--brand-gold)]/10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                      {qIdx + 1}
                    </span>
                    <textarea
                      value={q.question_text}
                      onChange={e => updateQuestion(qIdx, { question_text: e.target.value })}
                      rows={2}
                      className={`${INPUT_CLS} resize-none`}
                      placeholder="Formulez votre question ici..." />
                  </div>
                  {quiz.questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(qIdx)}
                      className="p-1.5 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2 pl-8">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <button type="button"
                        onClick={() => updateQuestion(qIdx, { correct_option_index: optIdx })}
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          q.correct_option_index === optIdx
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-white/20 hover:border-white/40'
                        }`}>
                        {q.correct_option_index === optIdx && <CheckCircle className="w-3 h-3 text-white" />}
                      </button>
                      <input type="text" value={opt}
                        onChange={e => updateOption(qIdx, optIdx, e.target.value)}
                        className={`${INPUT_CLS} flex-1`}
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`} />
                    </div>
                  ))}
                  <p className="text-[9px] text-gray-500 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    Cliquez le cercle vert pour définir la bonne réponse
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
