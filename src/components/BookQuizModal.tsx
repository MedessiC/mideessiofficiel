import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, ArrowRight, HelpCircle, X, Award } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
}

interface Quiz {
  id: string;
  title: string;
  trigger_page: number;
  questions: Question[];
}

interface BookQuizModalProps {
  bookId: string;
  currentPage: number;
  onClose: () => void;
}

export default function BookQuizModal({ bookId, currentPage, onClose }: BookQuizModalProps) {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  // Quiz active states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Charger le quiz disponible pour cette page spécifique
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        // 1. Récupérer le quiz associé au livre et à la page courante
        const { data: quizData, error: quizError } = await supabase
          .from('book_quizzes')
          .select('id, title, trigger_page')
          .eq('book_id', bookId)
          .eq('trigger_page', currentPage)
          .maybeSingle();

        if (quizError) throw quizError;

        if (quizData) {
          // Vérifier si l'utilisateur connecté a déjà complété ce quiz
          if (user) {
            const { data: attempt } = await supabase
              .from('user_quiz_attempts')
              .select('id')
              .eq('user_id', user.id)
              .eq('quiz_id', quizData.id)
              .maybeSingle();
            
            // Si déjà fait, on ne le redéclenche pas automatiquement
            if (attempt) {
              setLoading(false);
              return;
            }
          }

          // 2. Charger les questions du quiz
          const { data: questionsData, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('id, question_text, options, correct_option_index')
            .eq('quiz_id', quizData.id);

          if (questionsError) throw questionsError;

          if (questionsData && questionsData.length > 0) {
            setQuiz({
              id: quizData.id,
              title: quizData.title,
              trigger_page: quizData.trigger_page,
              questions: questionsData.map((q: any) => ({
                id: q.id,
                question_text: q.question_text,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
                correct_option_index: q.correct_option_index
              }))
            });
          }
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [bookId, currentPage, user]);

  if (loading || !quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion?.correct_option_index;

  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Fin du quiz
      setQuizCompleted(true);
      if (user) {
        setSaving(true);
        try {
          await supabase.from('user_quiz_attempts').upsert({
            user_id: user.id,
            quiz_id: quiz.id,
            score: score + (isCorrect ? 1 : 0),
            total_questions: quiz.questions.length
          }, { onConflict: 'user_id,quiz_id' });
        } catch (err) {
          console.error('Error saving quiz score:', err);
        } finally {
          setSaving(false);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-poppins">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Decorative Top Background */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[var(--brand-gold)] animate-pulse" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-gold)]">
                Quizz de Progression
              </span>
              <h3 className="text-sm font-bold text-white leading-tight">
                {quiz.title}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            title="Passer pour l'instant"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {!quizCompleted ? (
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-semibold">Question {currentQuestionIndex + 1} sur {quiz.questions.length}</span>
                  <span className="font-bold text-[var(--brand-gold)]">{Math.round(((currentQuestionIndex) / quiz.questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                {currentQuestion.question_text}
              </h4>

              {/* Options Grid */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  let optionStyle = "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10";
                  if (selectedOption === idx) {
                    optionStyle = "border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 text-white font-semibold";
                  }
                  if (isAnswerSubmitted) {
                    if (idx === currentQuestion.correct_option_index) {
                      optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold";
                    } else if (selectedOption === idx) {
                      optionStyle = "border-red-500 bg-red-500/10 text-red-400";
                    } else {
                      optionStyle = "opacity-40 border-white/5 text-slate-400";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all duration-200 flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && idx === currentQuestion.correct_option_index && (
                        <CheckCircle size={16} className="text-emerald-500" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && idx !== currentQuestion.correct_option_index && (
                        <XCircle size={16} className="text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-6 space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[var(--brand-gold)]/10 border-2 border-[var(--brand-gold)]/30 flex items-center justify-center text-[var(--brand-gold)] animate-bounce">
                <Award size={36} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white">Quizz Terminé !</h4>
                <p className="text-xs text-slate-400 px-4">
                  Votre score a été enregistré. Vos points se rajoutent à votre progression générale sur MIDEESSI.
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Votre Score</span>
                <span className="text-4xl font-black text-[var(--brand-gold)] tabular-nums">{score}</span>
                <span className="text-xs text-slate-400 block mt-1">sur {quiz.questions.length} correct</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 bg-slate-900/30 flex gap-3">
          {!quizCompleted ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 text-white py-3 text-xs font-bold transition-all"
              >
                Passer le quizz
              </button>
              <button
                onClick={isAnswerSubmitted ? handleNext : handleSubmitAnswer}
                disabled={selectedOption === null}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold text-midnight hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed py-3 text-xs font-black transition-all shadow-lg active:scale-95"
              >
                <span>{isAnswerSubmitted ? 'Suivant' : 'Valider'}</span>
                <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              disabled={saving}
              className="w-full inline-flex items-center justify-center rounded-xl bg-gold text-midnight hover:bg-yellow-400 py-3 text-xs font-black transition-all shadow-lg active:scale-95"
            >
              Retour au livre
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
