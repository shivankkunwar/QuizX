export interface LocalQuiz {
    id: string;
    topic: string;
    quiz: any;
    provider: 'gemini';
    created_at: number;
    isLocal: true;
}

const LOCAL_QUIZ_KEY = 'quiz-local'
export function saveLocalQuiz(quiz: LocalQuiz){
    const existing = getLocalQuizzes();
    const updated = [quiz,...existing]
    localStorage.setItem(LOCAL_QUIZ_KEY, JSON.stringify(updated));
}

export function getLocalQuizzes(): LocalQuiz[]{
    try{
        const stored = localStorage.getItem(LOCAL_QUIZ_KEY);
        return stored ? JSON.parse(stored): [];
    }catch{
        return []
    }
}

export function deleteLocalQuiz(id: string){
    const existing = getLocalQuizzes();
    const filtered = existing.filter(q=>q.id!==id);
    localStorage.setItem(LOCAL_QUIZ_KEY, JSON.stringify(filtered))
}