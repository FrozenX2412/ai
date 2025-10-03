import { useState } from 'react'
import clsx from 'clsx'

export default function Header({ onSearch, onToggleTheme, theme }) {
  const [q, setQ] = useState('')
  return (
    <header className="w-full py-4 px-4 sm:px-6 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold text-indigo-600">AI</div>
          <div className="hidden sm:block">
            <div className="text-lg font-semibold">Chat — Masterpiece UI</div>
            <div className="text-xs text-gray-500">Responsive, Dark/Light, Code blocks, Copy</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="relative">
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search chats..." className="w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 dark:bg-gray-800" />
            <button onClick={()=>{ onSearch(q); setQ('') }} className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 text-white rounded mr-1 text-sm">Search</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onToggleTheme} className="p-2 rounded bg-gray-100 dark:bg-gray-800">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
