import { useState } from 'react'

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState('')
  return (
    <form onSubmit={e => { e.preventDefault(); if(text.trim()) { onSend(text); setText('') } }} className="w-full flex gap-2">
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type your message..." className="flex-1 p-3 rounded-lg border bg-white dark:bg-gray-800 text-black dark:text-white" />
      <button type="submit" className="px-4 py-2 rounded-lg bg-green-500 text-white" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
    </form>
  )
}
