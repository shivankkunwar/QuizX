'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { loadQuiz } from '@/lib/quizLoader';
import { useUserId } from '@/hooks/useUserId';
import MarkdownContent from './MarkdownContent';
import OptionsGrid from './OptionsGrid';
import ExplanationDrawer from './ExplanationDrawer';

interface QuizScreenProps {
  quizId: string;
}

export default function QuizScreen({ quizId }: QuizScreenProps) {
  const router = useRouter();
  const userId = useUserId();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => loadQuiz(quizId, userId || 'anonymous'),
    staleTime: 5 * 60 * 1000,
  });

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionId }));
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const score = Object.entries(answers).reduce((acc, [qIndex, answer]) => {
        const question = quiz.questions[parseInt(qIndex, 10)];
        return answer === question.correct ? acc + 1 : acc;
      }, 0);
      router.push(`/quiz/${quizId}/results?score=${score}&total=${quiz.questions.length}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Quiz not found</h2>
          <p className="text-stone-600 mb-6">This quiz might have been deleted or you don't have access to it.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-stone-200 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-stone-600" />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold text-stone-800 truncate">{quiz.title}</h1>
              <p className="text-sm text-stone-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
            </div>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2">
            <motion.div
              className="bg-orange-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="mb-8">
                <MarkdownContent content={currentQuestion.question} className="text-xl md:text-2xl font-semibold text-stone-800 leading-relaxed" />
              </div>

              <OptionsGrid
                question={currentQuestion}
                selectedOption={selectedOption}
                isAnswered={isAnswered}
                onSelect={handleOptionSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {currentQuestion && (
        <ExplanationDrawer
          question={currentQuestion}
          selectedOption={selectedOption}
          topic={quiz.title}
          isVisible={isAnswered}
          onNext={handleNextQuestion}
          isLastQuestion={currentQuestionIndex === quiz.questions.length - 1}
        />
      )}
    </div>
  );
}


