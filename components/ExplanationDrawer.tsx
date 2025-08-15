'use client';

import { motion, PanInfo } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { NormalizedQuestion } from '@/lib/quizLoader';
import { buildOpenWithPrompt } from '@/lib/promptBuilder';
import MarkdownContent from './MarkdownContent';
import OpenWithButtons from './OpenWithButtons';

interface ExplanationDrawerProps {
  question: NormalizedQuestion;
  selectedOption: string | null;
  topic: string;
  isVisible: boolean;
  onNext: () => void;
  isLastQuestion: boolean;
}

export default function ExplanationDrawer({ 
  question, selectedOption, topic, isVisible, onNext, isLastQuestion 
}: ExplanationDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBounce, setShowBounce] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowBounce(true);
      const timer = setTimeout(() => setShowBounce(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Close the floating "Explanation" button (popover) when drawer opens to avoid overlap
  useEffect(() => {
    if (isOpen) {
      setShowBounce(false);
    }
  }, [isOpen]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const shouldOpen = info.offset.y < -50 || info.velocity.y < -500;
    setIsOpen(shouldOpen);
  };

  const prompt = buildOpenWithPrompt(question, topic, selectedOption || undefined);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? 10 : 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg"
          animate={showBounce ? {
            y: [0, -8, 0, -4, 0],
            transition: { duration: 0.6, repeat: 2, ease: 'easeInOut' }
          } : {}}
        >
          <ChevronUp className="w-4 h-4" />
          <span className="text-sm font-medium">Explanation</span>
        </motion.button>
      </motion.div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-40 max-h-[80vh] md:max-h-[60vh]"
        style={{ touchAction: 'none' }}
      >
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto my-3" />
        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(80vh-60px)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-stone-800 mb-2">
              {selectedOption === question.correct ? '✅ Correct!' : '❌ Not quite right'}
            </h3>
            {selectedOption !== question.correct && (
              <p className="text-sm text-stone-600 mb-3">
                The correct answer is <strong>{question.correct}</strong>: {question.options[question.correct]}
              </p>
            )}
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-stone-700 mb-2">Explanation</h4>
            <MarkdownContent content={question.explanation} className="text-sm text-stone-600" />
          </div>

          <OpenWithButtons prompt={prompt} />

          <motion.button
            onClick={onNext}
            className="w-full mt-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </motion.button>
        </div>
      </motion.div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}


