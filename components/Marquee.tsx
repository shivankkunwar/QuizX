import React, { useEffect, useRef, ReactNode } from 'react';

interface InfiniteScrollerProps {
  children: ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'left' | 'right';
}

const InfiniteScroller: React.FC<InfiniteScrollerProps> = ({ 
  children, 
  speed = 'normal', 
  direction = 'left' 
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const inner = innerRef.current;

    if (!scroller || !inner) return;

    // Map speed to duration
    let animationDuration = '40s';
    if (speed === 'fast') animationDuration = '20s';
    if (speed === 'slow') animationDuration = '60s';

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      // Add animated attribute (for CSS)
      scroller.setAttribute('data-animated', 'true');

      // Duplicate children
      const content = Array.from(inner.children);
      content.forEach((item) => {
        const duplicated = item.cloneNode(true) as Element;
        duplicated.setAttribute('aria-hidden', 'true');
        inner.appendChild(duplicated);
      });
    }

    // Set CSS variables (for duration and direction)
    scroller.style.setProperty('--_animation-duration', animationDuration);
    scroller.style.setProperty('--_animation-direction', direction === 'right' ? 'reverse' : 'forwards');

    // Show marquee after setup is complete
    setTimeout(() => setIsVisible(true), 100);
  }, [speed, direction]); // Re-run if props change

  return (
    <div
      ref={scrollerRef}
      className="scroller mx-auto max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl"
      data-direction={direction}
      data-speed={speed}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
      <div ref={innerRef} className="scroller__inner" style={{
        paddingBlock: '1rem',
        display: 'flex',
        flexWrap: 'nowrap',
        gap: '1rem',
      }}>
        {children}
      </div>

    
      <style>{`
        .scroller {
          overflow: hidden;
        }

        .scroller[data-animated="true"] {
          -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
          mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
        }

        .scroller .scroller__inner {
          width: max-content;
          flex-wrap: nowrap;
        }

        .scroller[data-animated="true"] .scroller__inner {
          animation: scroll var(--_animation-duration, 40s) var(--_animation-direction, forwards) linear infinite;
        }

        .scroller[data-animated="true"] .scroller__inner:hover {
          animation-play-state: paused;
        }

        /* Make duplicated (aria-hidden) items non-interactive so clicks don't double-fire */
        .scroller [aria-hidden="true"] {
          pointer-events: none;
        }

        @keyframes scroll {
          to {
            transform: translate(calc(-50% - 0.5rem));
          }
        }

        
      `}</style>
    </div>
  );
};

export default InfiniteScroller;