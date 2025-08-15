'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { NormalizedQuestion } from '@/lib/quizLoader';
import { getLayoutType } from '@/lib/contentDetector';
import MarkdownContent from './MarkdownContent';

interface OptionsGridProps {
  question: NormalizedQuestion;
  selectedOption: string | null;
  isAnswered: boolean;
  onSelect: (optionId: string) => void;
}

export default function OptionsGrid({ question, selectedOption, isAnswered, onSelect }: OptionsGridProps) {
  const layoutType = getLayoutType(question.options);
  const getOptionState = (optionId: string) => {
    if (!isAnswered) return 'default';
    if (optionId === question.correct) return 'correct';
    if (optionId === selectedOption) return 'incorrect';
    return 'disabled';
  };

  const optionVariants = {
    default: { backgroundColor: "white", borderColor: "rgb(209 213 219)", scale: 1 },
    hover: { backgroundColor: "rgb(254 247 242)", borderColor: "rgb(251 146 60)", scale: 1.02, transition: { duration: 0.2 } },
    correct: { backgroundColor: "rgb(220 252 231)", borderColor: "rgb(34 197 94)", scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    incorrect: { backgroundColor: "rgb(254 226 226)", borderColor: "rgb(239 68 68)", x: [-2, 2, -2, 2, 0], transition: { duration: 0.4 } },
    disabled: { opacity: 0.5 }
  } as const;

  const gridClass = {
    'grid-2x2': 'grid grid-cols-2 gap-3',
    'vertical-compact': 'flex flex-col gap-3',
    'vertical-cards': 'flex flex-col gap-4'
  }[layoutType];

  const optionClass = {
    'grid-2x2': 'p-3 min-h-[60px]',
    'vertical-compact': 'p-3',
    'vertical-cards': 'p-4'
  }[layoutType];

  return (
    <div className={gridClass}>
      {Object.entries(question.options).map(([optionId, text]) => {
        const state = getOptionState(optionId);
        return (
          <motion.button
            key={optionId}
            onClick={() => !isAnswered && onSelect(optionId)}
            disabled={isAnswered}
            className={`${optionClass} border-2 rounded-lg text-left w-full transition-all duration-200 cursor-pointer disabled:cursor-not-allowed relative`}
            variants={optionVariants}
            initial="default"
            animate={state as keyof typeof optionVariants}
            whileHover={!isAnswered ? "hover" : undefined}
            whileTap={!isAnswered ? { scale: 0.98 } : undefined}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-sm font-bold flex items-center justify-center mt-0.5">
                {optionId}
              </div>
              <div className="flex-1 min-w-0">
                <MarkdownContent content={text} className="text-sm text-stone-700" />
              </div>
              {isAnswered && state === 'correct' && <Check className="text-green-600 w-5 h-5 flex-shrink-0" />}
              {isAnswered && state === 'incorrect' && <X className="text-red-600 w-5 h-5 flex-shrink-0" />}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}


