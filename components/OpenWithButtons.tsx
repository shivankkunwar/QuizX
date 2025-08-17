'use client';

import { AI_PLATFORMS, openWithAI } from '@/lib/promptBuilder';

interface OpenWithButtonsProps {
  prompt: string;
}

export default function OpenWithButtons({ prompt }: OpenWithButtonsProps) {
  return (
    <div className="mt-4">
      <p className="text-xs text-stone-600 mb-2">Continue learning with AI:</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Object.entries(AI_PLATFORMS).map(([key, platform]) => (
          <button
            key={key}
            onClick={() => openWithAI(key as keyof typeof AI_PLATFORMS, prompt)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-orange-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-orange-50 hover:border-orange-300 transition-colors whitespace-nowrap flex-shrink-0"
          >
            <span className="w-4 h-4 inline-block">{platform.icon}</span>
            <span>{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}



