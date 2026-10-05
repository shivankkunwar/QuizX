import { ReactNode } from 'react';

// Infinite horizontal scroller. Content is rendered twice by React (not DOM-cloned)
// so every visible copy keeps its click handlers.
export default function InfiniteScroller({ children }: { children: ReactNode }) {
  return (
    <div className="scroller mx-auto max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
      <div className="scroller__inner">
        <div className="scroller__group">{children}</div>
        <div className="scroller__group" aria-hidden="true">{children}</div>
      </div>
      <style>{`
        .scroller {
          overflow: hidden;
          -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
          mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
        }
        .scroller__inner, .scroller__group {
          display: flex;
          flex-wrap: nowrap;
          gap: 1rem;
        }
        .scroller__inner {
          width: max-content;
          padding-block: 1rem;
          animation: scroll 40s linear infinite;
        }
        .scroller__inner:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          to { transform: translate(calc(-50% - 0.5rem)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .scroller { overflow-x: auto; }
          .scroller__inner { animation: none; }
          .scroller__group[aria-hidden] { display: none; }
        }
      `}</style>
    </div>
  );
}
