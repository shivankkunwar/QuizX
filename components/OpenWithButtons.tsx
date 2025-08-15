'use client';

import { AI_PLATFORMS, openWithAI } from '@/lib/promptBuilder';

interface OpenWithButtonsProps {
  prompt: string;
}

export default function OpenWithButtons({ prompt }: OpenWithButtonsProps) {
  return (
    <div className="mt-4">
      <p className="text-xs text-stone-600 mb-2">Continue learning with AI:</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(AI_PLATFORMS).map(([key, platform]) => (
          <button
            key={key}
            onClick={() => openWithAI(key as keyof typeof AI_PLATFORMS, prompt)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-orange-50 hover:border-orange-300 transition-colors whitespace-nowrap"
          >
            <span>{platform.icon}</span>
            <span>{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


