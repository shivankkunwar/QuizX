"use client";

import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createTypeformFromQuiz, fetchTypeformStatus, startTypeformConnectFlow } from "@/components/TypeformConnect";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLocalQuizzes } from "@/lib/localstorage";
import { normalizeQuizData } from "@/lib/quizLoader";
export const runtime = 'edge';
export default function ResultsPage() {
  const params = useSearchParams();
  const route = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const scoreStr = params.get("score") ?? "0";
  const totalStr = params.get("total") ?? "0";
  const score = Number(scoreStr);
  const total = Number(totalStr);
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
          <button
            onClick={async () => {
              const st = await fetchTypeformStatus();
              if (!st.connected) {
                const res = await startTypeformConnectFlow();
                if (!res.connected) return;
              }
              try {
                const id = String(route?.id || '');
                let normalized: any | undefined = queryClient.getQueryData(["quiz", id]) as any;
                if (!normalized) {
                  try {
                    const locals = getLocalQuizzes();
                    const found = locals.find(q => q.id === id);
                    if (found) {
                      normalized = normalizeQuizData({ id: found.id, title: found.topic, json: JSON.stringify(found.quiz), provider: found.provider, isLocal: true });
                      queryClient.setQueryData(["quiz", id], normalized);
                    }
                  } catch {}
                }
                if (!normalized) return alert('Could not load quiz to publish');
                const minimal = { title: normalized.title, description: normalized.description, questions: normalized.questions };
                const created = await createTypeformFromQuiz(minimal, { includeEmailField: true });
                if (created?.shareUrl) window.open(created.shareUrl, '_blank');
              } catch {}
            }}
            className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 text-sm font-semibold hover:bg-stone-50"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}


