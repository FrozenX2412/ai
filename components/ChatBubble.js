import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import copy from 'copy-to-clipboard'

export default function ChatBubble({ m, onCopy }) {
  const isUser = m.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} py-2`}> 
      <div className={`${isUser ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-white dark:bg-gray-700'} max-w-[90%] sm:max-w-[70%] rounded-xl p-4 relative`}>
        {!isUser && (
          <div className="absolute top-2 right-2 text-xs opacity-60 cursor-pointer" onClick={() => { copy(m.content); onCopy && onCopy() }}>Copy</div>
        )}
        {isUser ? (
          <div className="whitespace-pre-wrap">{m.content}</div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} children={m.content} />
          </div>
        )}
      </div>
    </div>
  )
}
