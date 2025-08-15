'use client'
import { useUserId } from "@/hooks/useUserId";
import { createQuiz } from "@/lib/quizService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { error } from "console";
import { StepForward } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBYOK } from "./BYOK";
const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
}

export default function QuizInput() {


    const [topic, setTopic] = useState("");

    const router = useRouter();
    const { isBYOK, byokKey, openModal } = useBYOK();



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!topic.trim()) return;

        if (isBYOK && !byokKey.trim()) {
            openModal();
            return;
        }

       const q = new URLSearchParams({
        topic: topic.trim()
       }).toString();

       router.push(`/prepare?${q}`);

    }



    return (
        <div className="flex shadow items-center mx-auto rounded-xl w-full max-w-[80vw] md:max-w-4xl p-4 border border-gray-200  bg-white">
            <textarea
                rows={1}
                placeholder="What do you want to quiz"
                className="focus:border-transparent resize-none  overflow-y-scroll  min-h-10  focus:outline-none p-2 w-full max-h-[200px] bg-transparent  md:mr-6 "
                onInput={autoResize}
                onChange={(e) => setTopic(e.target.value)}
                disabled={false}
            />
            <button onClick={handleSubmit} disabled={!topic.trim()}
                className="  py-3 px-2 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >

                {
                    <StepForward className="w-4 h-4" />
                }

            </button>

        </div>
    )
}
