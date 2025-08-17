'use client';

import { AI_PLATFORMS, openWithAI } from '@/lib/promptBuilder';

interface OpenWithButtonsProps {
  prompt: string;
}

export default function OpenWithButtons({ prompt }: OpenWithButtonsProps) {
  return (
    <div className="mt-4">
      <p className="text-xs text-stone-600 mb-2">Continue learning with AI:</p>
      <div className="flex flex-wrap gap-1">
        {Object.entries(AI_PLATFORMS).map(([key, platform]) => (
          <button
            key={key}
            onClick={() => openWithAI(key as keyof typeof AI_PLATFORMS, prompt)}
            aria-label={platform.name}
            className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-stone-200 rounded-md text-[11px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <img src={platform.iconUrl} alt="" aria-hidden="true" className="w-4 h-4 rounded-[3px]" />
            <span className="hidden sm:inline">{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}



