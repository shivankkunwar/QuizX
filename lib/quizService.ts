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
        console.log('Creating quiz with Gemini API for topic:', topic);
        const quiz = await callGeminiAPI(topic, geminiKey);
        console.log('Gemini API returned quiz:', quiz);
        
        // BYOK strict-local: do NOT hit backend in BYOK mode
        const localQuiz = {
            id: nanoid(),
            topic,
            quiz,
            provider: 'gemini' as const,
            created_at: Math.floor(Date.now() / 1000),
            isLocal: true as const
        };
        console.log('Saving local quiz:', localQuiz);
        saveLocalQuiz(localQuiz);
        console.log('Returning local quiz:', localQuiz);
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `You are Socratic, an expert quiz generator. Create a 5-question quiz about "${topic}".

REQUIREMENTS:
- Create exactly 5 multiple-choice questions
- Questions should be conversational and engaging
- Each question has 4 answer options (A, B, C, D)
- Include clear explanations for correct answers
- Ensure accuracy and educational value
- Progressive difficulty (easier to harder)

RESPONSE FORMAT (valid JSON only, no markdown fences, no extra text):
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
}`
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024
        }
    } as const;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        let errMsg = `Gemini error ${response.status}`;
        try {
            const err = await response.json();
            errMsg = err?.error?.message || errMsg;
        } catch {}
        throw new Error(errMsg);
    }

    const data = await response.json();
    console.log('Raw Gemini response:', data);
    
    const parts = data?.candidates?.[0]?.content?.parts;
    console.log('Extracted parts:', parts);
    
    let text = Array.isArray(parts)
        ? parts.map((p: any) => p?.text || '').join('\n')
        : '';
    
    console.log('Raw text before processing:', text);

    text = text.trim();
    // Strip markdown fences if present (handles both ```json and ```)
    if (text.startsWith('```')) {
        const beforeStrip = text;
        text = text.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');
        console.log('Stripped fences. Before:', beforeStrip.substring(0, 50), 'After:', text.substring(0, 50));
    }
    
    console.log('Final parsing text:', text.substring(0, 200) + '...');
    
    try {
        const parsed = JSON.parse(text);
        console.log('Parsed successfully:', { title: parsed.title, questionCount: parsed.questions?.length });
        // Defensive normalize for missing fields
        if (!Array.isArray(parsed.questions)) parsed.questions = [];
        parsed.questions = parsed.questions.map((q: any, i: number) => ({
            id: q?.id ?? i + 1,
            question: String(q?.question ?? ''),
            options: q?.options ?? { A: '', B: '', C: '', D: '' },
            correct: q?.correct ?? 'A',
            explanation: String(q?.explanation ?? '')
        }));
        return parsed;
    } catch (e) {
        console.log('First parse failed:', e);
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Invalid response format from Gemini');
        console.log('Trying fallback parse...');
        const parsed = JSON.parse(jsonMatch[0]);
        if (!Array.isArray(parsed.questions)) parsed.questions = [];
        parsed.questions = parsed.questions.map((q: any, i: number) => ({
            id: q?.id ?? i + 1,
            question: String(q?.question ?? ''),
            options: q?.options ?? { A: '', B: '', C: '', D: '' },
            correct: q?.correct ?? 'A',
            explanation: String(q?.explanation ?? '')
        }));
        return parsed;
    }
}