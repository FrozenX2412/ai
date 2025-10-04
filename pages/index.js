import { useEffect, useState, useRef } from 'react'
import Header from '../components/Header'
import ChatBubble from '../components/ChatBubble'
import ChatInput from '../components/ChatInput'

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! Ask me anything." }
  ])
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState('dark')
  const listRef = useRef()

  // Load saved messages & theme on mount
  useEffect(() => {
    try {
      const savedMessages = JSON.parse(localStorage.getItem('messages'))
      if (savedMessages) setMessages(savedMessages)

      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) setTheme(savedTheme)
    } catch {}
  }, [])

  // Save messages + auto scroll
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('messages', JSON.stringify(messages))
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  // Apply theme globally
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  // Handle send
  const onSend = async (text) => {
    const user = { role: 'user', content: text }
    const newMessages = [...messages, user]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const bot = { role: 'assistant', content: data.reply }
      setMessages(prev => [...prev, bot])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }])
    } finally {
      setLoading(false)
    }
  }

  const onSearch = (q) => {
    if (!q) return
    const found = messages.filter(m => m.content.toLowerCase().includes(q.toLowerCase()))
    if (found.length) alert(`Found ${found.length} messages in this chat.`)
    else alert('No results')
  }

  const onToggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      {/* Floating Header */}
      <div className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 w-[95%] sm:w-[90%] md:w-[85%]">
        <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-lg border border-gray-200/20 dark:border-gray-700/30">
          <Header onSearch={onSearch} onToggleTheme={onToggleTheme} theme={theme} />
        </div>
      </div>

      {/* Add padding so chat isn't hidden behind floating header */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col pt-24">
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto mb-4 space-y-3 scroll-smooth"
        >
          {messages.map((m, i) => (
            <ChatBubble
              key={i}
              m={m}
              onCopy={() => navigator.clipboard.writeText(m.content)}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200/20 dark:border-gray-700/30">
          <ChatInput onSend={onSend} loading={loading} />
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-500">
        Made by <span className="font-semibold text-indigo-500">TUSHAR</span>
      </footer>
    </div>
  )
}

