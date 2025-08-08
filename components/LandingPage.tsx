
import QuizInput from "./OuizInput";
import LPactionButtons from "./LPactionButtons";

export default function LandingPage() {
    return (
      <div className="min-h-[100dvh] relative flex flex-col isolate overflow-hidden">
          <div className="hero-background" aria-hidden="true">
            <div className="hero-lights" />
          </div>

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
  
          <QuizInput />
        </div>
     
      <div className="flex-1" />
        <LPactionButtons />
        
      </div>
    );
  }