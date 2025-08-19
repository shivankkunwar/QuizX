const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'http://localhost:3001';
export interface QuizRequest {
  topic: string;
  geminiKey?: string;
  userId?: string;
}

export interface QuizResponse {
  id: string;
  topic: string;
  quiz: any;
  provider: 'gemini' | 'openrouter';
  created_at: number;
  isLocal?: boolean;
}
export interface HistoryItem {
  id: string;
  topic: string;
  provider: 'openrouter' | 'gemini';
  created_at: number;
  score?: number;
  totalQuestions?: number;

}

export type UsageResponse = {
  quiz: { used: number; limit: number; remaining: number };
  vagueness: { used: number; limit: number; remaining: number };
};

export async function fetchUsage(userId: string): Promise<UsageResponse> {
  if (!userId) throw new Error('userId required');
  const res = await fetch(`/api/usage`, {
    headers: { 'x-user-id': userId },
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to load usage');
  return res.json();
}
export async function createQuiz({ topic, geminiKey, userId }: QuizRequest): Promise<QuizResponse> {
  if (!geminiKey && !userId) throw new Error('userId required');

  const response = await fetch(`/api/quizzes`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-user-id': (userId as string)
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify({ topic })
  })
  if (!response.ok) {
    throw new Error("failed to create Quiz")
  }

  return response.json()
}



export async function fetchHistory(userId: string): Promise<HistoryItem[]> {
  if (!userId) throw new Error('userId required');
  const res = await fetch(`/api/quizzes`, {
    headers: { 'x-user-id': userId },
    credentials: 'include' // Include cookies
  })

  if (!res.ok) throw new Error('Failed to load History');


  const rows = await res.json();
  return rows?.results ?? rows;
}