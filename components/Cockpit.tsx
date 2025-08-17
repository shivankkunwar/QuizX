
'use client';

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analyzeVagueness } from "@/lib/vagueness";
import { useBYOK } from "./BYOK";
import { useUserId } from "@/hooks/useUserId";
import { createQuiz } from "@/lib/quizService";
import { normalizeQuizData } from "@/lib/quizLoader";
import { fetchUsage } from "@/lib/api";

type SuggestionResult = {
  isVague: boolean;
  reason?: string;
  suggestions?: string[];
  category?: string;
  error?: string;
  limit?: number;
};

export default function Cockpit({ initialTopic }: { initialTopic: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isBYOK, byokKey, openModal } = useBYOK();
  const userId = useUserId();

  const [topic, setTopic] = useState(initialTopic);
  const [selected, setSelected] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<number>(1.3);
  const topicNorm = useMemo(() => topic.trim(), [topic]);

  const { data: vagueness, isLoading } = useQuery<SuggestionResult>({
    queryKey: ["vagueness", topicNorm],
    queryFn: async () => analyzeVagueness(topicNorm, userId || "anon", isBYOK),
    enabled: !!topicNorm && !isBYOK && topicNorm.length >= 3,
    staleTime: 0,
    retry: false,
  });

  const { data: usage } = useQuery({
    queryKey: ['usage', userId],
    queryFn: () => fetchUsage(userId || 'anonymous'),
    enabled: !!userId && !isBYOK,
    staleTime: 30_000
  });

  const refinedTopic = useMemo(() => {
    if (!selected.length) return topicNorm;
    return `${topicNorm}: ${selected.join(", ")}`;
  }, [topicNorm, selected]);

  const startMutation = useMutation({
    mutationFn: createQuiz,
    onSuccess: (data) => {
      // Ensure React Query cache holds the normalized shape QuizScreen expects BEFORE navigation
      try {
        if ((data as any)?.quiz) {
          const normalized = normalizeQuizData({
            id: (data as any).id,
            title: (data as any).quiz?.title,
            json: JSON.stringify((data as any).quiz),
            provider: (data as any).provider,
            isLocal: true,
          });
          queryClient.setQueryData(["quiz", (data as any).id], normalized);
        } else {
          queryClient.setQueryData(["quiz", (data as any).id], data);
        }
      } catch {}
      router.push(`/quiz/${data.id}`);
    },
    onError: (err: any) => {
      alert(`Failed to create quiz ${err?.message || ""}`);
    }
  });

  const toggle = (s: string) => {
    setSelected((prev) => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  // Inline custom focus input (shown even if no suggestions) to reduce whitespace
  const [customFocus, setCustomFocus] = useState('');
  const addCustomFocus = () => {
    const val = customFocus.trim();
    if (!val) return;
    setSelected((prev) => Array.from(new Set([...prev, val])));
    setCustomFocus('');
  };

  const hitDailyLimit = !isBYOK && usage && usage.quiz.remaining <= 0;
  const disableNav = isLoading || startMutation.isPending || hitDailyLimit;

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-stone-800 truncate">{topicNorm || "Untitled Topic"}</h1>
          <p className="text-xs text-stone-500 mt-1">Fine‑tune your quiz for better focus.</p>
          {/* Minimal usage moved near Start button */}
        </header>

        {/* Vague strip (API mode only) */}
        {!isBYOK && !!topicNorm && (
          <div className="mb-6">
            {isLoading ? (
              <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-3 animate-pulse h-16" />
            ) : vagueness?.error === "vagueness_limit" ? (
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-600 text-sm">
                Daily refinement limit reached. You can still start your quiz.
              </div>
            ) : vagueness?.isVague && vagueness?.suggestions?.length ? (
              <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-orange-700">Refine (optional)</span>
                  {vagueness.reason && <span className="text-[11px] text-orange-700/80">{vagueness.reason}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {vagueness.suggestions.slice(0, 8).map((s) => {
                    const on = selected.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggle(s)}
                        className={[
                          "px-3 py-1 rounded-full text-xs border transition",
                          on
                            ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                            : "bg-white/70 text-stone-700 border-orange-200 hover:bg-orange-100"
                        ].join(" ")}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                {!!selected.length && (
                  <div className="mt-2 text-[11px] text-orange-800">
                    Selected focuses improve question specificity.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Difficulty */}
        <div className="mb-8 rounded-2xl border border-stone-200 bg-white/80 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-stone-700">Difficulty</span>
            <span className="text-xs text-stone-500">{difficulty.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={1.0}
            max={2.2}
            step={0.1}
            value={difficulty}
            onChange={(e) => setDifficulty(parseFloat(e.target.value))}
            className="w-full accent-orange-600"
          />
          <p className="text-[11px] text-stone-500 mt-2">Higher difficulty increases depth and trickiness.</p>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <input
                value={customFocus}
                onChange={(e) => setCustomFocus(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addCustomFocus(); }}
                placeholder="Add a custom focus (e.g., arrays, time complexity)"
                className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                type="button"
                onClick={addCustomFocus}
                className="px-3 py-2 rounded-lg border border-orange-200 bg-white text-stone-800 text-sm hover:bg-orange-50"
              >
                Add
              </button>
            </div>
            {selected.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.map(s => (
                  <span key={s} className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-800">
                    {s}
                    <button onClick={() => toggle(s)} className="text-stone-500 hover:text-stone-700">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Start CTA */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/#hero-section")}
            disabled={disableNav}
            className="text-sm text-stone-700 hover:underline disabled:opacity-40 disabled:pointer-events-none"
          >
            Back
          </button>
          <div className="flex items-center gap-2">
          {!isBYOK && usage && (
            <span className="text-[11px] text-stone-600">
              {usage.quiz.remaining}/{usage.quiz.limit} left
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              // Strict BYOK: never hit backend if BYOK is active; require key
              if (isBYOK && !byokKey.trim()) {
                openModal();
                return;
              }
              startMutation.mutate({
                topic: refinedTopic,
                difficulty,
                userId: userId ?? undefined,
                geminiKey: isBYOK ? byokKey.trim() : undefined,
              });
            }}
            disabled={!topicNorm || isLoading || startMutation.isPending || hitDailyLimit}
            className="px-5 py-2 rounded-lg border border-orange-200 bg-white text-stone-800 text-sm font-semibold hover:bg-orange-50 disabled:opacity-50 disabled:pointer-events-none"
          >
            {hitDailyLimit ? "Limit reached" : isLoading ? "Analyzing…" : startMutation.isPending ? "Starting…" : "Start Quiz"}
          </button>
          </div>
        </div>
        {!isBYOK && usage && usage.quiz.remaining <= 0 && (
          <div className="mt-3 text-xs text-stone-600 text-center">
            You’ve used today’s free quizzes. Add a key (Local Mode) to continue.
          </div>
        )}
      </div>
    </div>
  );
}