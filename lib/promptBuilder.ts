import { NormalizedQuestion } from "./quizLoader";

export function buildOpenWithPrompt(
  question: NormalizedQuestion,
  topic: string,
  selectedOption?: string
): string {
  const optionsText = Object.entries(question.options)
    .map(([key, value]) => `${key}) ${value}`)
    .join('\n');

  const selectionText = selectedOption
    ? `\nI selected: ${selectedOption}) ${question.options[selectedOption as keyof typeof question.options]}`
    : '';

  return `I'm studying "${topic}". Help me understand this question in depth:

Question: ${question.question}

Options:
${optionsText}

Correct Answer: ${question.correct}) ${question.options[question.correct]}
Explanation: ${question.explanation}${selectionText}

Can you:
1. Explain this concept with additional examples
2. Show me related concepts I should know
3. Give me practice scenarios to test my understanding

Please be detailed and educational.`;
}

export const AI_PLATFORMS = {
  chatgpt: { name: 'ChatGPT', url: 'https://chatgpt.com/', icon: '🤖' },
  claude: { name: 'Claude', url: 'https://claude.ai/chat', icon: '🧠' },
  perplexity: { name: 'Perplexity', url: 'https://www.perplexity.ai/', icon: '🔍' },
  gemini: { name: 'Gemini', url: 'https://gemini.google.com/', icon: '✨' }
} as const;

export function openWithAI(platform: keyof typeof AI_PLATFORMS, prompt: string) {
  const config = AI_PLATFORMS[platform];
  const url = `${config.url}?q=${encodeURIComponent(prompt)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}



