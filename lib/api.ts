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

  export async function createQuiz({ topic, geminiKey, userId }: QuizRequest): Promise<QuizResponse> {

    const response = await fetch(`${API_BASE_URL}/api/quizzes`,{
         method: 'POST',
         headers: {
            'contentType': 'application/json',
            'x-user-id' : userId || 'anon'
         },
         body: JSON.stringify({topic})
    })
    if(!response.ok){
        throw new Error ("failed to create Quiz")
    }

    return response.json()
}