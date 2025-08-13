'use client';

import { useUserId } from "@/hooks/useUserId";
import { fetchHistory, HistoryItem } from "@/lib/api";
import { groupByDate } from "@/lib/date";
import { mergeRemoteWithLocal } from "@/lib/history-merge";
import { useQuery } from "@tanstack/react-query";
import HistoryItemCard from "./HistoryItemCard";
import { MOCK_HISTORY } from "@/lib/mockHistory";

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['history', userId],
    queryFn: async () => {
      // demo mode — swap to fetch when ready
      if (true) {
        return mergeRemoteWithLocal(MOCK_HISTORY as unknown as HistoryItem[]);
      }
      const remote = await fetchHistory(userId || 'anon');
      return mergeRemoteWithLocal(remote);
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
        <p className="text-center text-stone-500">No quizzes yet — create your first above.</p>
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
                    onReview={() => {
                      window.location.href = `/quiz/${it.id}`;
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
