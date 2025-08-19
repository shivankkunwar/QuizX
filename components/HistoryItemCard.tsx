import { MoveUpRight } from 'lucide-react';

export default function HistoryItem({
  topic,
  score,
  totalQuestions,
  onReview,
  onPublish,
  isLocal
}: {
  topic: string;
  score?: number;
  totalQuestions?: number;
  onReview?: () => void;
  onPublish?: () => void;
  isLocal?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border bg-white/70 backdrop-blur-sm border-orange-200 shadow-sm hover:shadow-md transition-shadow">
       <div className="p-3 bg-orange-100/80 rounded-xl"> 
      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div> 

      <div className="flex-grow">
        <p className="font-medium text-sm text-stone-700">{topic}</p>
        {score !== undefined && totalQuestions !== undefined ? (
          <p className="text-sm text-stone-500">
            {score}/{totalQuestions} correct
          </p>
        ) : (
          <p className="text-sm text-stone-500">Saved quiz</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isLocal && (
          <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">Local</span>
        )}
        <button
          type="button"
          onClick={onReview}
          disabled={!onReview}
          aria-label="Review"
          className="h-9 w-9 sm:h-auto sm:w-auto p-0 sm:px-3 sm:py-1.5 text-xs font-medium rounded-full text-stone-700 border border-stone-200 hover:bg-stone-100 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors inline-flex items-center justify-center aspect-square sm:aspect-auto"
        >
          <span className="sm:hidden inline-flex">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          <span className="hidden sm:inline">Review</span>
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={!onPublish}
          aria-label="Publish"
          className="h-9 w-9 sm:h-auto sm:w-auto p-0 sm:px-3 sm:py-1.5 text-xs font-medium rounded-full text-stone-700 border border-stone-200 hover:bg-stone-100 hover:text-orange-700 hover:border-orange-300 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors inline-flex items-center justify-center aspect-square sm:aspect-auto"
        >
          <span className="sm:hidden inline-flex"><MoveUpRight className="w-4 h-4" /></span>
          <span className="hidden sm:inline">Publish</span>
        </button>
      </div>
    </div>
  );
}
