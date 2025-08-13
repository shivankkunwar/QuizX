import { getLocalQuizzes} from "./localstorage";
import type { HistoryItem } from "./api";


export function mergeRemoteWithLocal(remote : HistoryItem[]){
    const local = getLocalQuizzes().map(l=>({
        id: l.id, topic: l.topic, provider: 'gemini' as const,
        created_at: l.created_at,score: undefined, totalQuestions: undefined,
        isLocal: true as const
    }))

    return [...remote, ...local].sort((a,b)=>b.created_at - a.created_at);
}