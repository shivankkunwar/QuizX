export interface QuizRequest {
  topic: string;
  geminiKey?: string;
  userId?: string;
  difficulty?: number;
}

export interface QuizResponse {
  id: string;
  topic: string;
  quiz: any;
  provider: string;
  created_at: number;
  isLocal?: boolean;
}
export interface HistoryItem {
  id: string;
  topic: string;
  provider: string;
  created_at: number;
  score?: number | null;
  totalQuestions?: number | null;
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
