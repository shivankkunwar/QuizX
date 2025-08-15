import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function ResultsPage({ searchParams }: { searchParams: { score?: string; total?: string } }) {
  const score = Number(searchParams?.score || 0);
  const total = Number(searchParams?.total || 0);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Quiz Complete</h2>
        <p className="text-stone-600 mb-8">Great work!</p>

        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle className="text-stone-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
            <motion.circle
              className="text-orange-600"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 45}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              transform="rotate(-90 50 50)"
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - pct / 100) }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-stone-900">{score}<span className="text-2xl text-stone-500">/{total}</span></span>
            <span className="text-xs text-orange-600">CORRECT</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <a href="/" className="px-4 py-2 rounded-lg border border-orange-200 bg-white text-stone-800 text-sm font-semibold hover:bg-orange-50">Home</a>
        </div>
      </div>
    </div>
  );
}


