import { useEffect, useState, useRef } from 'react'
import Header from '../components/Header'
import ChatBubble from '../components/ChatBubble'
import ChatInput from '../components/ChatInput'

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI. Ask me anything." }
  ])
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState('dark')
  const listRef = useRef()

  // Load from localStorage (runs only on client)
  useEffect(() => {
    try {
      const savedMessages = JSON.parse(localStorage.getItem('messages'))
      if (savedMessages) setMessages(savedMessages)

      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) setTheme(savedTheme)
    } catch {}
  }, [])

  // Save to localStorage + auto scroll
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('messages', JSON.stringify(messages))
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
    }
  }, [theme])

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
      <Header onSearch={onSearch} onToggleTheme={onToggleTheme} theme={theme} />

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col">
        <div ref={listRef} className="flex-1 overflow-y-auto mb-4">
          {messages.map((m,i)=>(
            <ChatBubble key={i} m={m} onCopy={() => alert('Copied to clipboard')} />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <ChatInput onSend={onSend} loading={loading} />
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-gray-500">
        Built with ❤️ — Made by TUSHAR
      </footer>
    </div>
  )
}
