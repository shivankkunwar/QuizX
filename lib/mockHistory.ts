// quix/lib/mockHistory.ts
const now = Math.floor(Date.now() / 1000);
const day = 24 * 60 * 60;

export const MOCK_HISTORY = [
  {
    id: 'q_1',
    topic: 'Quantum Physics',
    title: 'Quantum Physics',
    provider: 'openrouter',
    created_at: now - 60 * 30, // Today
    score: 8,
    totalQuestions: 10,
  },
  {
    id: 'q_2',
    topic: 'React Best Practices',
    title: 'React Best Practices',
    provider: 'gemini',
    created_at: now - 60 * 60 * 2, // Today
    score: 10,
    totalQuestions: 10,
  },
  {
    id: 'q_3',
    topic: 'Ancient Rome',
    title: 'Ancient Rome',
    provider: 'openrouter',
    created_at: now - day - 60 * 10, // Yesterday
    score: 6,
    totalQuestions: 10,
  },
  {
    id: 'q_4',
    topic: 'JavaScript Closures',
    title: 'JavaScript Closures',
    provider: 'gemini',
    created_at: now - day - 60 * 50, // Yesterday
    score: 9,
    totalQuestions: 10,
  },
  {
    id: 'q_5',
    topic: 'World War II',
    title: 'World War II',
    provider: 'openrouter',
    created_at: now - 2 * day, // Older
    score: 7,
    totalQuestions: 10,
  },
  {
    id: 'q_local_1',
    topic: 'Machine Learning Basics',
    title: 'Machine Learning Basics',
    provider: 'gemini',
    created_at: now - 3 * day,
    // optional flag if you need it in UI:
    isLocal: true,
  },
];