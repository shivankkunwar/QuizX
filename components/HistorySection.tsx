'use client';

import { useUserId } from "@/hooks/useUserId";
import { fetchHistory, HistoryItem } from "@/lib/api";
import { groupByDate } from "@/lib/date";
import { mergeRemoteWithLocal } from "@/lib/history-merge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import HistoryItemCard from "./HistoryItemCard";
import { createTypeformFromQuiz } from "./TypeformConnect";
import { useRouter } from "next/navigation";
import { getLocalQuizzes } from "@/lib/localstorage";
import { normalizeQuizData } from "@/lib/quizLoader";
import { fetchTypeformStatus, startTypeformConnectFlow } from "./TypeformConnect";
import PublishToTypeformModal from "./PublishToTypeformModal";
import { useState } from "react";
// import { MOCK_HISTORY } from "@/lib/mockHistory";

function SkeletonRow() {
  return (
    <div className="animate-pulse flex items-center gap-4 p-4 rounded-xl border bg-white/60 backdrop-blur-sm border-orange-200/60 shadow-sm">
      <div className="rounded-full w-10 h-10 bg-orange-200/60" />
      <div className="flex-grow">
        <div className="h-4 bg-orange-200/60 rounded w-40 mb-2" />
        <div className="h-3 bg-orange-200/50 rounded w-24" />
      </div>
      <div className="w-16 h-6 bg-orange-200/60 rounded-full" />
    </div>
  );
}

export default function HistorySection() {
  const userId = useUserId();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishData, setPublishData] = useState<any | null>(null);
  const [isPreparingPublish, setIsPreparingPublish] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['history', userId],
    enabled: !!userId,
    queryFn: async () => {
      try {
        if (!userId) return mergeRemoteWithLocal([] as HistoryItem[]);
        const remote = await fetchHistory(userId);
        return mergeRemoteWithLocal(remote);
      } catch (e) {
        // On network issues, gracefully fall back to just local quizzes
        return mergeRemoteWithLocal([] as HistoryItem[]);
      }
    }
  });

  return (
    <section id="history-section" className="w-full max-w-2xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-800">
          Recents
        </h2>
        {/* Optional microcopy for calm polish; remove if you want ultra-minimal */}
        <p className="text-xs text-stone-500 mt-1">Your latest quizzes at a glance</p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          <SkeletonRow /><SkeletonRow /><SkeletonRow />
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="text-center text-stone-500">Couldn’t load your recents.</p>
      )}

      {/* Empty */}
      {!isLoading && !isError && data && data.length === 0 && (
        <div className="max-w-md mx-auto text-center rounded-2xl border border-orange-200 bg-orange-50/60 p-6">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">You're all set</h3>
          <p className="text-sm text-stone-600 mb-4">Your quizzes will appear here. Start by entering a topic above.</p>
          <button
            type="button"
            onClick={() => document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-orange-50"
          >
            Create your first quiz
          </button>
        </div>
      )}

      {/* Content */}
      {!isLoading && !isError && data && data.length > 0 && (
        <div className="space-y-8">
          {Object.entries(groupByDate(data as HistoryItem[])).map(([date, items]) => (
            <div key={date}>
              {/* Date label with hairline dividers */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-orange-200/60" />
                <p className="text-[11px] uppercase tracking-wider text-stone-500">
                  {date}
                </p>
                <div className="h-px flex-1 bg-orange-200/60" />
              </div>

              <div className="space-y-3">
                {(items as HistoryItem[]).map((it) => (
                  <HistoryItemCard
                    key={it.id}
                    topic={(it as any).title || it.topic}
                    score={it.score}
                    totalQuestions={it.totalQuestions}
                    isLocal={(it as any).isLocal}
                    isPublishing={isPreparingPublish === it.id}
                    onReview={async () => {
                      try {
                        const locals = getLocalQuizzes();
                        const found = locals.find(q => q.id === it.id);
                        if (found) {
                          const normalized = normalizeQuizData({
                            id: found.id,
                            title: found.topic,
                            json: JSON.stringify(found.quiz),
                            provider: found.provider,
                            isLocal: true,
                          });
                          queryClient.setQueryData(["quiz", it.id], normalized);
                        } else if (userId) {
                          const res = await fetch(`/api/quizzes/${it.id}`, { headers: { 'x-user-id': userId } });
                          if (res.ok) {
                            const raw = await res.json();
                            const normalized = normalizeQuizData(raw);
                            queryClient.setQueryData(["quiz", it.id], normalized);
                          }
                        }
                      } catch {}
                      router.push(`/quiz/${it.id}`);
                    }}
                    onPublish={async () => {
                      setIsPreparingPublish(it.id);
                      try {
                        let st = await fetchTypeformStatus();
                        if (!st.connected) {
                          const res = await startTypeformConnectFlow();
                          if (!res.connected) { setIsPreparingPublish(null); return; }
                          st = { connected: true } as any;
                        }
                        let normalized: any | undefined;
                        try {
                          const locals = getLocalQuizzes();
                          const found = locals.find(q => q.id === it.id);
                          if (found) {
                            normalized = normalizeQuizData({
                              id: found.id,
                              title: found.topic,
                              json: JSON.stringify(found.quiz),
                              provider: found.provider,
                              isLocal: true,
                            });
                            queryClient.setQueryData(["quiz", it.id], normalized);
                          }
                        } catch {}
                        if (!normalized) {
                          if (!userId) return;
                          const res = await fetch(`/api/quizzes/${it.id}`, { headers: { 'x-user-id': userId } });
                          if (res.ok) {
                            const raw = await res.json();
                            normalized = normalizeQuizData(raw);
                          }
                        }
                        if (!normalized) return alert('Could not load quiz to publish');
                        const minimal = { title: normalized.title, description: normalized.description, questions: normalized.questions };
                        setPublishData(minimal);
                        setPublishOpen(true);
                      } catch (e) {
                        alert('Publish failed. Please connect Typeform first.');
                      } finally {
                        setIsPreparingPublish(null);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <PublishToTypeformModal open={publishOpen} initial={publishData} onClose={() => setPublishOpen(false)} />
    </section>
  );
}
