import { getLocalQuizzes } from "./localstorage";

export interface NormalizedQuestion {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface NormalizedQuiz {
  id: string;
  title: string;
  description?: string;
  questions: NormalizedQuestion[];
  provider: 'gemini' | 'openrouter';
  isLocal?: boolean;
}

export async function loadQuiz(id: string, userId: string): Promise<NormalizedQuiz | null> {
  try {
    const res = await fetch(`/api/quizzes/${id}`, {
      headers: { 'x-user-id': userId || 'anonymous' }
    });
    if (res.ok) {
      const data = await res.json();
      return normalizeQuizData(data);
    }
  } catch (e) {
    console.warn('Failed to load from backend:', e);
  }

  const localQuizzes = getLocalQuizzes();
  const localQuiz = localQuizzes.find(q => q.id === id);
  if (localQuiz) {
    return normalizeQuizData({
      id: localQuiz.id,
      title: localQuiz.topic,
      json: JSON.stringify(localQuiz.quiz),
      provider: localQuiz.provider,
      isLocal: true
    });
  }
  return null;
}

function normalizeQuizData(raw: any): NormalizedQuiz {
  const quizData = typeof raw.json === 'string' ? JSON.parse(raw.json) : raw.json;
  return {
    id: raw.id,
    title: quizData?.title || raw.title || 'Untitled Quiz',
    description: quizData?.description,
    questions: (quizData?.questions || []).map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation || 'No explanation provided.'
    })),
    provider: raw.provider || 'openrouter',
    isLocal: raw.isLocal || false
  };
}


