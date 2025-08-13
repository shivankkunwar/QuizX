'use client'
import QuizInput from "./OuizInput";
import LPactionButtons from "./LPactionButtons";
import HistorySection from "./HistorySection";
import BackToHero from "./BackToHero";
import { useBYOK } from "./BYOK";

export default function LandingPage() {
  const { isBYOK, clearKey } = useBYOK();


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
       <div className="hero-background fixed inset-0 -z-10 pointer-events-none" 
     style={{ height: '150vh' }} aria-hidden="true">
       <div className="hero-lights w-full h-full" />
      </div>

      <section  id="hero-section" className="min-h-[100svh] relative flex flex-col isolate">
       
     
        <div className="flex-[0.6]" />

        <div className="text-center px-4">
          <header className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
              <span className="block">Personalized</span>
              <span className="block underline decoration-blue-500 decoration-4 underline-offset-4">
                Quiz
              </span>
            </h1>
            {isBYOK && (
              <div className="mt-2 flex justify-center">
                <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                  Local
                </span>
              </div>
            )}
          </header>
          <div id="hero-sentinel" className="h-px w-px self-center" />
          <QuizInput />
        </div>

        <div className="flex-1" />
        <LPactionButtons />
        
      </section>
      <section id="history-section" className="">
        <HistorySection />
      </section>
      <BackToHero />
    </main>

  );
}