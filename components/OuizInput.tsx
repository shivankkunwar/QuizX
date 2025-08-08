'use client'
import { useUserId } from "@/hooks/useUserId";
import { createQuiz } from "@/lib/quizService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { error } from "console";
import { StepForward } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
}

export default function QuizInput() {


    const [topic, setTopic] = useState("");
    const [geminiKey, setGeminiKey] = useState('');
    const [useGemini, setUseGemini] = useState(false);


    const router = useRouter();
    const queryClient = useQueryClient();
    const userId = useUserId();


    const createQuizMutation = useMutation({
        mutationFn: createQuiz,
        onSuccess: (data) => {
            router.push(`/quiz/${data.id}`);
            queryClient.setQueryData(['quiz', data.id], data);
        },
        onError: (error)=>{
            console.error(`Quiz creation failed `, error);
            alert(`Failed to create quiz  ${error.message}`);
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(!topic.trim())return;

        if(useGemini && !geminiKey.trim()){
            alert("Add a gemini API Key");
            return;
        }

        createQuizMutation.mutate({
            topic: topic.trim(),
            geminiKey: useGemini ? geminiKey.trim() : undefined,
            userId: userId ?? undefined
        })
    }




    return (
        <div className="flex shadow items-center mx-auto rounded-xl w-full max-w-[80vw] md:max-w-4xl p-4 border border-gray-200  bg-white">
            <textarea
                rows={1}
                placeholder="What do you want to quiz"
                className="focus:border-transparent resize-none  overflow-y-scroll  min-h-10  focus:outline-none p-2 w-full max-h-[200px] bg-transparent mr-6"
                onInput={autoResize}

            />
            <StepForward className="w-4 h-4" />
        </div>
    )
}
