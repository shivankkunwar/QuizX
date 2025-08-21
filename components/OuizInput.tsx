'use client'
import { useUserId } from "@/hooks/useUserId";
import { createQuiz } from "@/lib/quizService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { error } from "console";
import { StepForward } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useBYOK } from "./BYOK";
import { useQuery } from "@tanstack/react-query";
import { fetchUsage } from "@/lib/api";
const resizeTextarea = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
}

interface QuizInputProps {
    prefill?: string;
}

export default function QuizInput({ prefill }: QuizInputProps) {


    const [topic, setTopic] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const router = useRouter();
    const { isBYOK, byokKey, openModal } = useBYOK();
    const userId = useUserId();
    const { data: usage } = useQuery({
        queryKey: ['usage', userId],
        queryFn: () => fetchUsage(userId as string),
        enabled: !!userId && !isBYOK,
        staleTime: 30_000,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });



    const proceed = () => {
        if (!topic.trim()) return;
        if (!userId) return;
        if (!isBYOK && usage && usage.quiz.remaining <= 0) return; // blocked by daily limit
        if (isBYOK && !byokKey.trim()) { openModal(); return; }
        const q = new URLSearchParams({ topic: topic.trim() }).toString();
        router.push(`/prepare?${q}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        proceed();
    }

    // Sync external prefill into local state and resize
    useEffect(() => {
        if (typeof prefill === 'string' && prefill.trim()) {
            setTopic(prefill);
            // Use setTimeout to ensure DOM update completes before resize
            setTimeout(() => resizeTextarea(textareaRef.current), 0);
        }
    }, [prefill]);



    return (
        <div className="relative flex shadow items-center mx-auto rounded-xl w-full max-w-[80vw] md:max-w-4xl p-4 border border-gray-200  bg-white">
            <textarea
                ref={textareaRef}
                rows={1}
                placeholder="What do you want to quiz"
                className="focus:border-transparent resize-none overflow-y-scroll no-scrollbar min-h-10 focus:outline-none p-2 w-full max-h-[200px] bg-transparent md:mr-6 "
                value={topic}
                onInput={(e) => resizeTextarea(e.currentTarget)}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        proceed();
                    }
                }}
                disabled={false}
            />
            <button onClick={handleSubmit} disabled={!topic.trim() || (!isBYOK && usage && usage.quiz.remaining <= 0)}
                className="  py-3 px-2 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >

                {
                    <StepForward className="w-4 h-4" />
                }

            </button>
            {!isBYOK && usage && (
                <div className="absolute -top-2 -right-2 text-[10px] px-2 py-0.5 rounded-full border border-stone-200 bg-white shadow-sm text-stone-700">
                    {usage.quiz.remaining}/{usage.quiz.limit} left
                </div>
            )}

        </div>
    )
}
