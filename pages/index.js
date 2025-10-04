import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! Ask me anything." },
  ]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const listRef = useRef();

  useEffect(() => {
    try {
      const savedMessages = JSON.parse(localStorage.getItem("messages"));
      if (savedMessages) setMessages(savedMessages);

      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) setTheme(savedTheme);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("messages", JSON.stringify(messages));
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const onSend = async (text) => {
    const user = { role: "user", content: text };
    const newMessages = [...messages, user];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const bot = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, bot]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (q) => {
    if (!q) return;
    const found = messages.filter((m) =>
      m.content.toLowerCase().includes(q.toLowerCase())
    );
    if (found.length)
      alert(`Found ${found.length} messages in this chat.`);
    else alert("No results");
  };

  const onToggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      {/* Floating Header */}
      <div className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 w-[95%] sm:w-[90%] md:w-[85%]">
        <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-lg border border-gray-200/20 dark:border-gray-700/30">
          <Header onSearch={onSearch} onToggleTheme={onToggleTheme} theme={theme} />
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-[90%] sm:w-[70%] md:w-[50%] transition-all duration-300">
        <div
          className={`flex items-center px-4 py-2 rounded-full shadow-lg border border-gray-300/30 dark:border-gray-700/40 backdrop-blur-md transition-all duration-300
            ${focused || query
              ? "bg-white/100 dark:bg-gray-800/100"
              : "bg-white/30 dark:bg-gray-800/30"
            }`}
        >
          <input
            type="text"
            placeholder="Search messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-2"
          />
          <button
            onClick={() => {
              onSearch(query);
              setQuery("");
            }}
            className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-transform duration-200 active:scale-90"
          >
            {/* Arrow SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Section */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col pt-36">
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
  );
}

