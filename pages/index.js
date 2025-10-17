import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";

export default function Home() {
  const [chats, setChats] = useState({});
  const [currentChat, setCurrentChat] = useState("");
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const listRef = useRef();

  // Load chats & theme from localStorage
  useEffect(() => {
    try {
      const savedChats = JSON.parse(localStorage.getItem("chats"));
      const savedTheme = localStorage.getItem("theme");
      if (savedChats) setChats(savedChats);
      if (savedTheme) setTheme(savedTheme);

      // Create default chat if none exist
      if (!savedChats || Object.keys(savedChats).length === 0) {
        const defaultChat = {
          "New Chat": [{ role: "assistant", content: "Hello! Ask me anything." }],
        };
        setChats(defaultChat);
        setCurrentChat("New Chat");
        localStorage.setItem("chats", JSON.stringify(defaultChat));
      } else {
        setCurrentChat(Object.keys(savedChats)[0]);
      }
    } catch {}
  }, []);

  // Auto-save chats + auto-scroll
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chats", JSON.stringify(chats));
      if (listRef.current) {
        listRef.current.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [chats, currentChat]);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- Chat Operations ---
  const onSend = async (text) => {
    const user = { role: "user", content: text };
    const updated = {
      ...chats,
      [currentChat]: [...(chats[currentChat] || []), user],
    };
    setChats(updated);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated[currentChat] }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const bot = { role: "assistant", content: data.reply };
      setChats((prev) => ({
        ...prev,
        [currentChat]: [...prev[currentChat], bot],
      }));
    } catch {
      setChats((prev) => ({
        ...prev,
        [currentChat]: [
          ...prev[currentChat],
          { role: "assistant", content: "Sorry, something went wrong." },
        ],
      }));
    } finally {
      setLoading(false);
    }
  };

  const createChat = () => {
    const name = `Chat ${Object.keys(chats).length + 1}`;
    const updated = {
      ...chats,
      [name]: [{ role: "assistant", content: "New chat started!" }],
    };
    setChats(updated);
    setCurrentChat(name);
  };

  const renameChat = (oldName) => {
    const newName = prompt("Enter new chat name:", oldName);
    if (!newName || chats[newName]) return;
    const updated = { ...chats };
    updated[newName] = updated[oldName];
    delete updated[oldName];
    setChats(updated);
    setCurrentChat(newName);
  };

  const deleteChat = (name) => {
    if (!confirm(`Delete "${name}" chat?`)) return;
    const updated = { ...chats };
    delete updated[name];
    const first = Object.keys(updated)[0] || "New Chat";
    if (!updated[first])
      updated[first] = [{ role: "assistant", content: "Hello! Ask me anything." }];
    setChats(updated);
    setCurrentChat(first);
  };

  const onToggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const onToggleSidebar = () => setSidebarOpen((prev) => !prev);

  // --- UI ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-500 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-lg">Chats</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto h-[calc(100%-7rem)] p-2 space-y-1">
          {Object.keys(chats).map((name) => (
            <div
              key={name}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition ${
                name === currentChat
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <button
                onClick={() => {
                  setCurrentChat(name);
                  setSidebarOpen(false);
                }}
                className="flex-1 text-left truncate"
              >
                {name}
              </button>
              <div className="flex gap-2 ml-2 text-sm">
                <button onClick={() => renameChat(name)} title="Rename">✎</button>
                <button onClick={() => deleteChat(name)} title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={createChat}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            + New Chat
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Floating Header (reacts to sidebar open) */}
        <div
          className={`fixed top-3 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
            sidebarOpen ? "w-[80%]" : "w-[95%] sm:w-[90%] md:w-[85%]"
          }`}
        >
          <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-lg border border-gray-200/20 dark:border-gray-700/30">
            <Header
              onToggleTheme={onToggleTheme}
              theme={theme}
              onToggleSidebar={onToggleSidebar}
              sidebarOpen={sidebarOpen}
            />
          </div>
        </div>

        {/* Chat Messages */}
        <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col pt-24 pb-28">
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto mb-4 space-y-3 scroll-smooth"
          >
            {chats[currentChat]?.map((m, i) => (
              <ChatBubble
                key={i}
                m={m}
                onCopy={() => navigator.clipboard.writeText(m.content)}
              />
            ))}
          </div>
        </main>

        {/* Chat Input */}
        <div className="relative z-50">
          <ChatInput onSend={onSend} loading={loading} />
        </div>

        {/* Footer */}
        <div className="h-20"></div>
        <footer className="fixed bottom-1 left-1/2 -translate-x-1/2 z-40 text-center text-xs text-gray-500 dark:text-gray-400">
          Made by <span className="font-semibold text-indigo-500">TUSHAR</span>
        </footer>
      </div>
    </div>
  );
}
