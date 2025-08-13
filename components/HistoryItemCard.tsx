export default function HistoryItem({
  topic,
  score,
  totalQuestions,
  onReview,
}: {
  topic: string;
  score?: number;
  totalQuestions?: number;
  onReview?: () => void;
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

      <button
        type="button"
        onClick={onReview}
        disabled={!onReview}
        className="px-3 py-1.5 text-xs font-semibold rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-300"
      >
        Review
      </button>
    </div>
  );
}
