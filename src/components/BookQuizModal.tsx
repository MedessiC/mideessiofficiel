import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, ArrowRight, HelpCircle, X, Award, Timer } from 'lucide-react';

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
  isFinalQuiz?: boolean;
}

export default function BookQuizModal({ bookId, currentPage, onClose, isFinalQuiz = false }: BookQuizModalProps) {
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

  // Timer state (10 seconds)
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Charger le quiz disponible pour cette page ou le grand quiz final
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        let quizData = null;

        if (isFinalQuiz) {
          // Charger le grand quiz final (généralement trigger_page élevé ou flag spécifique)
          // Par défaut, on cherche le quiz avec la page de déclenchement la plus haute
          const { data } = await supabase
            .from('book_quizzes')
            .select('id, title, trigger_page')
            .eq('book_id', bookId)
            .order('trigger_page', { ascending: false })
            .limit(1)
            .maybeSingle();
          quizData = data;
        } else {
          // Charger le quiz de progression régulier
          const { data } = await supabase
            .from('book_quizzes')
            .select('id, title, trigger_page')
            .eq('book_id', bookId)
            .eq('trigger_page', currentPage)
            .maybeSingle();
          quizData = data;
        }

        if (quizData) {
          // Vérifier si déjà complété (priorité: DB si user connecté, sinon localStorage)
          if (user) {
            const { data: attempt } = await supabase
              .from('user_quiz_attempts')
              .select('id')
              .eq('user_id', user.id)
              .eq('quiz_id', quizData.id)
              .maybeSingle();

            if (attempt) {
              setLoading(false);
              return; // Ne pas redéclencher automatiquement
            }
          } else {
            try {
              const key = `book_quiz_${quizData.id}_completed`;
              if (typeof window !== 'undefined' && window.localStorage.getItem(key)) {
                setLoading(false);
                return; // Quiz déjà complété localement
              }
            } catch (e) {
              // ignore localStorage errors
            }
          }

          // Charger les questions
          const { data: questionsData } = await supabase
            .from('quiz_questions')
            .select('id, question_text, options, correct_option_index')
            .eq('quiz_id', quizData.id);

          if (questionsData && questionsData.length > 0) {
            setQuiz({
              id: quizData.id,
              title: isFinalQuiz ? `🏆 GRAND QUIZ FINAL : ${quizData.title}` : quizData.title,
              trigger_page: quizData.trigger_page,
              questions: questionsData.map((q: any) => ({
                id: q.id,
                question_text: q.question_text,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
                correct_option_index: q.correct_option_index
              }))
            });
            setTimeLeft(10); // Reset timer
          }
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [bookId, currentPage, user, isFinalQuiz]);

  // Effect pour gérer le timer de 10 secondes
  useEffect(() => {
    if (quizCompleted || loading || !quiz || isAnswerSubmitted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(10); // Réinitialiser le timer à chaque nouvelle question

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Temps écoulé : Soumettre automatiquement comme incorrect
          setIsAnswerSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, quiz, quizCompleted, loading, isAnswerSubmitted]);

  if (loading || !quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion?.correct_option_index;

  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    if (timerRef.current) clearInterval(timerRef.current);
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

  // Mark as completed locally so anonymous users won't see it again after reload
  useEffect(() => {
    if (quizCompleted && quiz) {
      try {
        const key = `book_quiz_${quiz.id}_completed`;
        if (typeof window !== 'undefined') window.localStorage.setItem(key, '1');
      } catch (e) {
        // ignore localStorage errors
      }
    }
  }, [quizCompleted, quiz]);

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-poppins text-white">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[var(--brand-gold)]" />
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--brand-gold)] block">
                {isFinalQuiz ? '🏆 Épreuve finale' : 'Quiz de progression'}
              </span>
              <h3 className="text-xs font-bold leading-tight">
                {quiz.title}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {!quizCompleted ? (
            <div className="space-y-4">
              {/* Question progress and timer */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold">Question {currentQuestionIndex + 1} / {quiz.questions.length}</span>
                
                {/* Timer indicator */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg">
                  <Timer className={`w-3.5 h-3.5 ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-[var(--brand-gold)]'}`} />
                  <span className={`font-black ${timeLeft <= 3 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--brand-gold)] to-yellow-400 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                />
              </div>

              <h4 className="text-sm sm:text-base font-black leading-snug">
                {currentQuestion.question_text}
              </h4>

              {/* Options */}
              <div className="space-y-2">
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
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all duration-200 flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && idx === currentQuestion.correct_option_index && (
                        <CheckCircle size={15} className="text-emerald-500" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && idx !== currentQuestion.correct_option_index && (
                        <XCircle size={15} className="text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswerSubmitted && timeLeft === 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-400 text-center">
                  ⏳ Temps écoulé pour cette question !
                </div>
              )}
            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-4 space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[var(--brand-gold)]/10 border-2 border-[var(--brand-gold)]/30 flex items-center justify-center text-[var(--brand-gold)] animate-bounce">
                <Award size={30} />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black">Évaluation complétée !</h4>
                <p className="text-[10px] text-slate-400 px-4">
                  Votre score a été enregistré avec succès et s'affiche sur votre profil MIDEESSI.
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Votre Score</span>
                <span className="text-3xl font-black text-[var(--brand-gold)] tabular-nums">{score}</span>
                <span className="text-[10px] text-slate-400 block mt-1">sur {quiz.questions.length} correct{score > 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/5 bg-slate-900/30 flex gap-3">
          {!quizCompleted ? (
            <>
              <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 py-2.5 text-xs font-bold transition-all">
                Passer
              </button>
              <button
                onClick={isAnswerSubmitted ? handleNext : handleSubmitAnswer}
                disabled={selectedOption === null && !isAnswerSubmitted}
                className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl bg-gold text-midnight hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-black transition-all shadow-lg"
              >
                <span>{isAnswerSubmitted ? 'Suivant' : 'Valider'}</span>
                <ArrowRight size={13} />
              </button>
            </>
          ) : (
            <button onClick={onClose} disabled={saving} className="w-full inline-flex items-center justify-center rounded-xl bg-gold text-midnight hover:bg-yellow-400 py-3 text-xs font-black transition-all shadow-lg">
              Terminer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
