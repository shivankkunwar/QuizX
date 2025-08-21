'use client'
import QuizInput from "./OuizInput";
import LPactionButtons from "./LPactionButtons";
import HistorySection from "./HistorySection";
import BackToHero from "./BackToHero";
import { useBYOK } from "./BYOK";
import InfiniteScroller from "./Marquee";
// usage display moved into components where needed (QuizInput, Cockpit)

import { useCallback, useMemo, useState } from "react";

export default function LandingPage() {
  const { isBYOK, clearKey } = useBYOK();
  const [prefill, setPrefill] = useState<string>("");

  // One-word tags mapped to rich prompts for the textarea
  const tagToPrompt = useMemo(() => ({
    "IQ": "Quiz me to test my IQ with diverse logic, math, and pattern questions.",
    "Math": "Create a 5-question math skills quiz covering algebra, geometry, and word problems.",
    "History": "Quiz me on world history highlights across eras and civilizations.",
    "Science": "Make a general science quiz spanning physics, chemistry, and biology basics.",
    "Coding": "Generate a programming fundamentals quiz with examples and concepts.",
    "AI": "Create a beginner-friendly AI and machine learning concepts quiz.",
    "Geography": "Test me on world geography, capitals, landmarks, and regions.",
    "Vocabulary": "Build a vocabulary quiz with synonyms, antonyms, and usage.",
    "Finance": "Create a personal finance basics quiz on budgeting, saving, and investing.",
    "Health": "Generate a health and wellness quiz covering nutrition, sleep, and exercise.",
    "Sports": "Quiz me on global sports rules, records, and iconic moments.",
    "Movies": "Make a film trivia quiz about directors, actors, and classics.",
    "Music": "Create a music theory and history quiz mixing genres and icons.",
    "Startups": "Generate a startup fundamentals quiz: PMF, MVP, GTM, and metrics.",
    "Sales": "Build a sales skills quiz on discovery, objection handling, and closing.",
    "Marketing": "Create a marketing basics quiz: positioning, channels, funnels, and metrics.",
    "Design": "Make a UX/UI principles quiz: typography, layout, affordances, and heuristics.",
    "Biology": "Generate a biology quiz: cells, genetics, evolution, and systems.",
    "Physics": "Create a physics quiz covering mechanics, energy, and waves.",
    "Chemistry": "Make a chemistry quiz: atoms, bonding, reactions, and stoichiometry."
  } as const), []);

  const tags = useMemo(() => Object.keys(tagToPrompt), [tagToPrompt]);

  const onTagClick = useCallback((tag: string) => {
    const prompt = tagToPrompt[tag as keyof typeof tagToPrompt] || tag;
    setPrefill(prompt);
    // Smooth scroll focus to input
    try {
      document.querySelector('textarea')?.focus();
    } catch {}
  }, [tagToPrompt]);
  


  return (
    <main className="relative">
      {isBYOK && (
        <div className="fixed top-0 left-0 right-0 z-20">
          <div className="flex items-center justify-center gap-4 bg-orange-50/90 backdrop-blur-md border-b border-orange-200 px-3 py-2 text-orange-700">
            <span className="text-xs font-medium">Local Mode (BYOK)</span>
            <button onClick={clearKey} className="text-xs font-semibold underline underline-offset-2">
              Switch to Socratic AI
            </button>
          </div>
        </div>
      )}
      {/* Non-BYOK usage bar removed for a more minimal UX */}
       <div className="hero-background fixed inset-0 -z-10 pointer-events-none" 
     style={{ height: '150vh' }} aria-hidden="true">
       <div className="hero-lights w-full h-full" />
      </div>

      <section  id="hero-section" className="min-h-[100svh] relative flex flex-col isolate">
       
     
        <div className="flex-[0.6]" />

        <div className="text-center px-4">
          <header className="mb-8">
            <HeroTitle />
            {isBYOK && (
              <div className="mt-2 flex justify-center">
                <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                  Local
                </span>
              </div>
            )}
          </header>
          <div id="hero-sentinel" className="h-px w-px self-center" />
         
          <QuizInput prefill={prefill} />
        </div>
        <div className="mt-4 flex justify-center">
            <InfiniteScroller speed="normal" direction="left">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => onTagClick(t)}
                  className="px-3 py-1 rounded-full text-sm border border-gray-200 bg-white/80 hover:bg-white shadow-sm transition-colors"
                >
                  {t}
                </button>
              ))}
            </InfiniteScroller>
          </div>

        <div className="flex-1" />
        <LPactionButtons />
        
      </section>
      <section id="history-section" className="/">
        <HistorySection />
      </section>
      <BackToHero />
    </main>

  );
}

import RotatingText from './RotatingText'

function HeroTitle() {
  const words = [
    'Personalized',
    'Adaptive',
    'AI‑Powered',
    'Fast',
    'Job‑Ready',
    'Fun',
  ]
  return (
    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 flex flex-row items-center justify-center gap-2">
      <RotatingText
        texts={words}
        intervalMs={2000}
        className="text-gray-800"
        wordWrapperClassName="pb-0.5 md:pb-1"
      />
      <span className="block text-gray-800">
        Quiz
      </span>
    </h1>
  )
}