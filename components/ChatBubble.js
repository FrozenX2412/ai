import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import copy from "copy-to-clipboard";

export default function ChatBubble({ m, onCopy }) {
  const isUser = m.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(m.content);
    setCopied(true);
    onCopy && onCopy();

    // Hide animation after 1.5s
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} py-3`}>
      <div
        className={`relative max-w-[90%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm transition-all ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        }`}
      >
        {/* Copy Button (only for AI messages) */}
        {!isUser && (
          <>
            <button
              onClick={handleCopy}
              aria-label="Copy response"
              className="absolute bottom-2 right-2 p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 transition-all"
            >
              {/* Copy Icon (SVG) */}
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

            {/* "Copied!" Animation */}
            {copied && (
              <div className="absolute bottom-2 right-10 flex items-center gap-1 text-green-500 text-xs font-medium animate-copied">
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

        {/* Message Content */}
        {isUser ? (
          <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
        ) : (
          <div className="prose dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {m.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
