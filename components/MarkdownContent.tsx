'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'highlight.js/styles/atom-one-dark.css';
import 'katex/dist/katex.min.css';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      className={className}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeHighlight, rehypeKatex]}
      components={{
        code: ({ className, children, ...props }: any) => {
          const isBlock = typeof className === 'string' && /language-/.test(className);
          if (!isBlock) {
            return (
              <code
                className="bg-orange-100 text-orange-800 px-1 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code
              className={`${className} block overflow-x-auto`}
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ children, ...props }) => {
          const codeText = (Array.isArray((children as any)?.props?.children) ? (children as any).props.children.join('') : (children as any)?.props?.children) || '';
          const handleCopy = async () => {
            try { await navigator.clipboard.writeText(codeText); } catch {}
          };
          return (
            <div className="relative group my-2">
              <pre 
                className="bg-stone-800 text-white p-4 rounded-lg overflow-x-auto border border-orange-200"
                {...props}
              >
                {children}
              </pre>
              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded bg-white/90 text-stone-800 border border-stone-200"
              >
                Copy
              </button>
            </div>
          );
        },
        strong: ({ children, ...props }) => (
          <strong className="text-orange-700 font-semibold" {...props}>
            {children}
          </strong>
        ),
        p: ({ children, ...props }) => (
          <p className="mb-2 last:mb-0" {...props}>
            {children}
          </p>
        )
      }}
    >
      {content}
    </ReactMarkdown>
  );
}


