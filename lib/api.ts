const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
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
export async function createQuiz({ topic, geminiKey, userId }: QuizRequest): Promise<QuizResponse> {

  const response = await fetch(`${API_BASE_URL}/api/quizzes`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-user-id': userId || 'anon'
    },
    body: JSON.stringify({ topic })
  })
  if (!response.ok) {
    throw new Error("failed to create Quiz")
  }

  return response.json()
}



export async function fetchHistory(userId: string): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/quizzes`, {
    headers: { 'x-user-id': userId || 'anon' }
  })

  if (!res.ok) throw new Error('Failed to load History');


  const rows = await res.json();
  return rows?.results ?? rows;
}