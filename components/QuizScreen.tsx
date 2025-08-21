'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { loadQuiz, normalizeQuizData } from '@/lib/quizLoader';
import { getLocalQuizzes } from '@/lib/localstorage';
import { useUserId } from '@/hooks/useUserId';
import MarkdownContent from './MarkdownContent';
import OptionsGrid from './OptionsGrid';
import ExplanationDrawer from './ExplanationDrawer';
import TypeformConnect, { createTypeformFromQuiz, fetchTypeformStatus, startTypeformConnectFlow } from './TypeformConnect';
import PublishToTypeformModal from './PublishToTypeformModal';

interface QuizScreenProps {
  quizId: string;
}

export default function QuizScreen({ quizId }: QuizScreenProps) {
  const router = useRouter();
  const userId = useUserId();
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishData, setPublishData] = useState<any | null>(null);

  const initialFromCache = queryClient.getQueryData<any>(['quiz', quizId]);
  const initialFromLocal = (() => {
    try {
      const list = getLocalQuizzes();
      const found = list.find(q => q.id === quizId);
      if (found) {
        return normalizeQuizData({
          id: found.id,
          title: found.topic,
          json: JSON.stringify(found.quiz),
          provider: found.provider,
          isLocal: true
        });
      }
    } catch {}
    return undefined;
  })();

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => loadQuiz(quizId, userId as string),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    initialData: (initialFromCache as any) ?? (initialFromLocal as any),
  });

  if (!userId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const safeQuestions = Array.isArray(quiz?.questions) ? quiz!.questions : [];
  const currentQuestion = safeQuestions[currentQuestionIndex];
  const progress = safeQuestions.length > 0 ? ((currentQuestionIndex + 1) / safeQuestions.length) * 100 : 0;

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionId }));
  };

  const handleNextQuestion = () => {
    if (!safeQuestions.length) return;
    if (currentQuestionIndex < safeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const score = Object.entries(answers).reduce((acc, [qIndex, answer]) => {
        const question = safeQuestions[parseInt(qIndex, 10)];
        return answer === question.correct ? acc + 1 : acc;
      }, 0);
      // Try saving last score for backend quizzes; ignore errors
      if (!userId) return;
      fetch(`/api/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ score })
      }).catch(() => {});
      router.push(`/quiz/${quizId}/results?score=${score}&total=${safeQuestions.length}`);
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

  if (error || !quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Quiz not ready</h2>
          <p className="text-stone-600 mb-6">We couldn't load questions yet. Please go back and try again.</p>
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-stone-200 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 pr-20 md:pr-4">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-stone-600" />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold text-stone-800 truncate">{quiz.title}</h1>
              <p className="text-sm text-stone-500">Question {currentQuestionIndex + 1} of {safeQuestions.length}</p>
            </div>
            {/* Single button: if connected → Publish; else → Connect */}
            <button
              onClick={async () => {
                let st = await fetchTypeformStatus();
                if (!st.connected) {
                  const res = await startTypeformConnectFlow();
                  if (!res.connected) return;
                  st = { connected: true } as any;
                }
                try {
                  if (!quiz) return;
                  const minimal = { title: quiz.title, description: quiz.description, questions: quiz.questions };
                  setPublishData(minimal);
                  setPublishOpen(true);
                } catch {}
              }}
              aria-label="Publish"
              className=" hidden h-9 w-9 sm:h-auto sm:w-auto p-0 sm:px-3 sm:py-1.5 text-sm rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 sm:inline-flex items-center justify-center shrink-0 sm:shrink"
            >
              <span className="sm:hidden inline-flex">
                <Send className="w-4 h-4" />
              </span>
              <span className="hidden sm:inline">Publish</span>
            </button>
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

      {/* Floating Publish Button on mobile to avoid being hidden by title */}
      <div className="sm:hidden fixed bottom-4 right-4 z-30">
        <button
          aria-label="Publish"
          onClick={async () => {
            let st = await fetchTypeformStatus();
            if (!st.connected) {
              const res = await startTypeformConnectFlow();
              if (!res.connected) return;
              st = { connected: true } as any;
            }
            try {
              if (!quiz) return;
              const minimal = { title: quiz.title, description: quiz.description, questions: quiz.questions };
              setPublishData(minimal);
              setPublishOpen(true);
            } catch {}
          }}
          className=" bg-white/90 py-1 px-2  rounded-2xl backdrop-blur border border-stone-200 shadow-lg flex items-center justify-center text-stone-700 hover:bg-white"
        >
          Publish
        </button>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full"
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
          isLastQuestion={currentQuestionIndex === safeQuestions.length - 1}
        />
      )}
      <PublishToTypeformModal open={publishOpen} initial={publishData} onClose={() => setPublishOpen(false)} />
    </div>
  );
}


