import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import copy from "copy-to-clipboard";
import "highlight.js/styles/github-dark.css";

export default function ChatBubble({ m, onCopy }) {
  const isUser = m.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(m.content);
    setCopied(true);
    onCopy && onCopy();
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    // Use neutral container and control alignment on the bubble itself (ml-auto / mr-auto)
    <div className="flex py-3 px-2">
      <div
        className={`relative max-w-[90%] sm:max-w-[75%] px-5 py-3 rounded-3xl shadow-[0_6px_18px_rgba(15,23,42,0.06)] border transition-all duration-300
          ${isUser
            ? "ml-auto bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white border-gray-200/60 dark:border-gray-700/60 rounded-br-none"
            : "mr-auto bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border-gray-200/40 dark:border-gray-700/40 rounded-bl-none"
          }`}
      >
        {/* Copy Button (AI Messages Only) */}
        {!isUser && (
          <>
            <button
              onClick={handleCopy}
              aria-label="Copy response"
              className="absolute bottom-3 right-3 p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-2 4h4a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-4"
                />
              </svg>
            </button>

            {copied && (
              <div className="absolute bottom-3 right-11 flex items-center gap-1 text-green-500 text-xs font-medium animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </div>
            )}
          </>
        )}

        {/* Markdown Renderer */}
        <div
          className="prose dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0
          prose-code:font-mono prose-code:text-sm prose-headings:font-semibold
          prose-table:border-collapse prose-table:border prose-table:border-gray-300 dark:prose-table:border-gray-700
          prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700
          prose-th:p-2 prose-td:p-2 prose-th:bg-gray-200/60 dark:prose-th:bg-gray-700/50 prose-td:bg-gray-100/40 dark:prose-td:bg-gray-800/30 rounded-lg overflow-x-auto"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ inline, className, children, ...props }) {
                return inline ? (
                  <code
                    className="bg-gray-900/6 dark:bg-gray-200/6 px-1 py-0.5 rounded text-[0.9em] font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-xl overflow-x-auto font-mono text-sm">
                    <code {...props}>{children}</code>
                  </pre>
                );
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-3">
                    <table className="min-w-full text-sm">{children}</table>
                  </div>
                );
              },
            }}
          >
            {m.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
