import { nanoid } from "nanoid";
import { saveLocalQuiz } from "./localstorage";
import { normalizeQuizData } from "./quizLoader";
import type { QuizRequest, QuizResponse } from "./api";

export async function createQuiz({ topic, geminiKey, userId, difficulty }: QuizRequest): Promise<QuizResponse> {
    if (geminiKey) {
        // BYOK strict-local: do NOT hit backend in BYOK mode
        const localQuiz = {
            id: nanoid(),
            topic,
            quiz: await callGeminiAPI(topic, geminiKey, difficulty),
            provider: 'gemini' as const,
            created_at: Math.floor(Date.now() / 1000),
            isLocal: true as const
        };
        saveLocalQuiz(localQuiz);
        return localQuiz;
    }
    if (!userId) throw new Error('userId required');
    const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ topic, difficulty })
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to create quiz");
    }
    return response.json();
}

async function callGeminiAPI(topic: string, apiKey: string, difficulty?: number) {
    const difficultyTier = typeof difficulty === 'number'
        ? (difficulty < 1.3 ? 'beginner' : difficulty < 1.7 ? 'intermediate' : 'advanced')
        : 'intermediate';
    const prompt = `You are Socratic, an expert quiz generator. Create a 5-question quiz about "${topic}".

REQUIREMENTS:
- Create exactly 5 multiple-choice questions
- Questions should be conversational and engaging
- Each question has 4 answer options (A, B, C, D)
- Include clear explanations for correct answers
- Ensure accuracy and educational value
- Progressive difficulty (easier to harder)
- Overall difficulty target: ${difficulty?.toFixed(1) ?? '1.4'}x (${difficultyTier}). Adjust depth, distractor subtlety, and required reasoning accordingly.

RESPONSE FORMAT (valid JSON only):
{
  "title": "Quiz about [topic]",
  "description": "Brief engaging description",
  "questions": [
    {
      "id": 1,
      "question": "Clear, conversational question text",
      "options": {"A": "First option", "B": "Second option", "C": "Third option", "D": "Fourth option"},
      "correct": "A",
      "explanation": "Clear explanation of why this is correct"
    }
  ]
}`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 4096, responseMimeType: 'application/json' }
        })
    });
    if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error?.message || `Gemini error ${response.status}`);
    }
    const data = await response.json();
    const text = (data?.candidates?.[0]?.content?.parts ?? []).map((p: any) => p?.text || '').join('');
    const { title, description, questions } = normalizeQuizData({ json: text });
    return { title, description, questions };
}
