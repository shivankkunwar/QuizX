
import QuizInput from "./OuizInput";
import LPactionButtons from "./LPactionButtons";
import HistorySection from "./HistorySection";
import BackToHero from "./BackToHero";

export default function LandingPage() {
  return (
    <main className="relative">
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
          </header>
          <div id="hero-sentinel" className="h-px w-px self-center" />
          <QuizInput />
        </div>

        <div className="flex-1" />
        <LPactionButtons />
        
      </section>
      <section id="history-section" className="py-16">
        <HistorySection />
      </section>
      <BackToHero />
    </main>

  );
}