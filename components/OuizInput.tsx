'use client'
import { StepForward } from "lucide-react";

export default function QuizInput() {

    const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
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
