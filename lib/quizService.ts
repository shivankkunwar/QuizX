import { nanoid } from "nanoid";
import { saveLocalQuiz } from "./localstorage";

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
    provider: 'gemini' | 'openrouter';
    created_at: number;
    isLocal?: boolean;
}

export async function createQuiz({ topic, geminiKey, userId, difficulty }: QuizRequest): Promise<QuizResponse> {
    if (geminiKey) {
        const quiz = await callGeminiAPI(topic, geminiKey);
        // BYOK strict-local: do NOT hit backend in BYOK mode
        const localQuiz = {
            id: nanoid(),
            topic,
            quiz,
            provider: 'gemini' as const,
            created_at: Math.floor(Date.now() / 1000),
            isLocal: true as const
        };
        saveLocalQuiz(localQuiz);
        return localQuiz;
    } else {
        const response = await fetch('/api/quizzes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': userId || 'anonymous'
            },
            body: JSON.stringify({ topic, difficulty })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || "Failed to create quiz");
        }
        return response.json();
    }
}

async function callGeminiAPI(topic: string, apiKey: string) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `
          You are Socratic, an expert quiz generator. Create a 5-question quiz about "${topic}".
              REQUIREMENTS:
              - Create exactly 5 multiple-choice questions
              - Questions should be conversational and engaging
              - Each question has 4 answer options (A, B, C, D)
              - Include clear explanations for correct answers
              - Ensure accuracy and educational value
              - Progressive difficulty (easier to harder)
              
              RESPONSE FORMAT (valid JSON only):
              {
              "title": "Quiz about [topic]",
              "description": "Brief engaging description",
              "questions": [
                  {
                  "id": 1,
                  "question": "Clear, conversational question text",
                  "options": {
                      "A": "First option",
                      "B": "Second option", 
                      "C": "Third option",
                      "D": "Fourth option"
                  },
                  "correct": "A",
                  "explanation": "Clear explanation of why this is correct"
                  }
              ]
              }`
                }]
            }]
        })
    });
    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format from Gemini');
    return JSON.parse(jsonMatch[0]);
}