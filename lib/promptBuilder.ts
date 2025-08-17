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
  scira: { name: 'Scira AI', url: 'https://scira.ai/', iconUrl: 'https://gist.githubusercontent.com/zaidmukaddam/6d22b396bebd01e424659261a73ac321/raw/bcc321ac845a18d8af0d2241c1e7d246dd2f48a2/scira.svg' },
  chatgpt: { name: 'ChatGPT', url: 'https://chatgpt.com/', iconUrl: 'https://icons.duckduckgo.com/ip3/chatgpt.com.ico' },
  claude: { name: 'Claude', url: 'https://claude.ai/new', iconUrl: 'https://icons.duckduckgo.com/ip3/claude.ai.ico' },
  perplexity: { name: 'Perplexity', url: 'https://www.perplexity.ai/', iconUrl: 'https://icons.duckduckgo.com/ip3/perplexity.ai.ico' },
  //gemini: { name: 'Gemini', url: 'https://gemini.google.com/', iconUrl: 'https://icons.duckduckgo.com/ip3/gemini.google.com.ico' }https://gist.githubusercontent.com/zaidmukaddam/6d22b396bebd01e424659261a73ac321/raw
} as const;

export function openWithAI(platform: keyof typeof AI_PLATFORMS, prompt: string) {
  const config = AI_PLATFORMS[platform];
  let targetUrl: string;

  switch (platform) {
    case 'claude':
    
      targetUrl = `${config.url}?q=${encodeURIComponent(prompt)}`;
      break;
    case 'scira':
      targetUrl = `${config.url}?q=${encodeURIComponent(prompt)}`;
      break;
    // case 'gemini':
    //   // Gemini does not support URL-prefilled prompts; use AI Overview as best web fallback
    //   targetUrl = `https://www.google.com/search?udm=50&q=${encodeURIComponent(prompt)}`;
    //   break;
    default:
      targetUrl = `${config.url}?q=${encodeURIComponent(prompt)}`;
  }

  window.open(targetUrl, '_blank', 'noopener,noreferrer');
}



