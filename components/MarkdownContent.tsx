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
        code: ({ node, inline, className, children, ...props }) => {
          if (inline) {
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
        pre: ({ children, ...props }) => (
          <pre 
            className="bg-stone-800 text-white p-4 rounded-lg overflow-x-auto border border-orange-200 my-2"
            {...props}
          >
            {children}
          </pre>
        ),
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


