import { QuizDraft } from '../types/quiz';

export interface QuizImportFormat {
  title: string;
  trigger_page: number;
  questions: Array<{
    question_text: string;
    options: string[];
    correct_option_index: number;
  }>;
}

/**
 * Parse a JSON file and return quiz data
 */
export async function parseQuizFile(file: File): Promise<QuizImportFormat[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate the data structure
        if (!Array.isArray(data)) {
          reject(new Error('Le fichier doit contenir un tableau de quiz'));
          return;
        }
        
        const validated = data.map((quiz: any, idx: number) => {
          if (!quiz.title || !Array.isArray(quiz.questions)) {
            throw new Error(`Quiz ${idx + 1}: structure invalide (title et questions requis)`);
          }
          
          if (!Number.isInteger(quiz.trigger_page) || quiz.trigger_page < 1) {
            throw new Error(`Quiz ${idx + 1}: trigger_page doit être un nombre >= 1`);
          }
          
          const validatedQuestions = quiz.questions.map((q: any, qIdx: number) => {
            if (!q.question_text || !Array.isArray(q.options) || q.options.length < 2) {
              throw new Error(`Quiz ${idx + 1}, Question ${qIdx + 1}: doit avoir au minimum 2 options`);
            }
            
            if (!Number.isInteger(q.correct_option_index) || q.correct_option_index < 0 || q.correct_option_index >= q.options.length) {
              throw new Error(`Quiz ${idx + 1}, Question ${qIdx + 1}: correct_option_index invalide`);
            }
            
            return {
              question_text: String(q.question_text).trim(),
              options: q.options.map((o: any) => String(o).trim()),
              correct_option_index: q.correct_option_index
            };
          });
          
          return {
            title: String(quiz.title).trim(),
            trigger_page: quiz.trigger_page,
            questions: validatedQuestions
          };
        });
        
        resolve(validated);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Generate a sample JSON file for quiz import
 */
export function generateSampleQuizJson(): string {
  const sample: QuizImportFormat[] = [
    {
      title: 'Quiz Chapitre 1',
      trigger_page: 10,
      questions: [
        {
          question_text: 'Quelle est la première étape du processus?',
          options: ['Étape A', 'Étape B', 'Étape C', 'Étape D'],
          correct_option_index: 0
        },
        {
          question_text: 'Quel est le résultat attendu?',
          options: ['Résultat 1', 'Résultat 2', 'Résultat 3', 'Résultat 4'],
          correct_option_index: 2
        }
      ]
    },
    {
      title: 'Quiz Chapitre 2',
      trigger_page: 25,
      questions: [
        {
          question_text: 'Question supplémentaire?',
          options: ['Oui', 'Non', 'Peut-être', 'Autre'],
          correct_option_index: 1
        }
      ]
    }
  ];
  
  return JSON.stringify(sample, null, 2);
}

/**
 * Download a sample quiz JSON file
 */
export function downloadSampleQuizTemplate(): void {
  const content = generateSampleQuizJson();
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quiz-template.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
