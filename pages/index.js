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

  // UI states for menus / renaming / deleting
  const [openMenu, setOpenMenu] = useState(null); // chat name with open menu
  const [renaming, setRenaming] = useState(null); // chat name currently being renamed (shows input)
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // chat name pending delete confirmation

  // For animated display in the sidebar (typing/erasing)
  const [displayNames, setDisplayNames] = useState({}); // { originalKey: displayString }
  const [animatingName, setAnimatingName] = useState(null); // name currently animating
  const [animatingType, setAnimatingType] = useState(null); // 'rename' | 'delete' | null

  const listRef = useRef();
  const containerRef = useRef();

  // small util
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Close menus / renaming if clicking outside sidebar area
  useEffect(() => {
    function onClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpenMenu(null);
        setRenaming(null);
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // Load chats & theme from localStorage
  useEffect(() => {
    try {
      const savedChats = JSON.parse(localStorage.getItem("chats"));
      const savedTheme = localStorage.getItem("theme");

      let initialChats = savedChats;
      if (!savedChats || Object.keys(savedChats).length === 0) {
        initialChats = {
          "New Chat": [{ role: "assistant", content: "Hello! Ask me anything." }],
        };
        localStorage.setItem("chats", JSON.stringify(initialChats));
      }

      if (initialChats) {
        setChats(initialChats);
        setCurrentChat(Object.keys(initialChats)[0]);
        // initialize displayNames from keys
        const map = {};
        Object.keys(initialChats).forEach((k) => (map[k] = k));
        setDisplayNames(map);
      }

      if (savedTheme) setTheme(savedTheme);
    } catch {}
  }, []);

  // Keep displayNames in sync with chat keys (preserve any custom display during transitions)
  useEffect(() => {
    setDisplayNames((prev) => {
      const next = {};
      Object.keys(chats).forEach((k) => {
        next[k] = prev[k] ?? k;
      });
      return next;
    });
  }, [chats]);

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
    // ensure displayNames contain the new name
    setDisplayNames((prev) => ({ ...prev, [name]: name }));
  };

  // rename helper used by both animations and prompt flow
  const performRename = (oldName, newName) => {
    if (!newName || newName === oldName) return;
    if (chats[newName]) {
      alert("A chat with this name already exists.");
      return;
    }
    const updated = { ...chats };
    updated[newName] = updated[oldName];
    delete updated[oldName];
    setChats(updated);
    setCurrentChat(newName);
    // update displayNames mapping immediately (animation also updates it)
    setDisplayNames((prev) => {
      const next = { ...prev };
      delete next[oldName];
      next[newName] = newName;
      return next;
    });
  };

  // delete helper used for confirmed deletion
  const performDelete = (name) => {
    const updated = { ...chats };
    delete updated[name];
    const first = Object.keys(updated)[0] || "New Chat";
    if (!updated[first])
      updated[first] = [{ role: "assistant", content: "Hello! Ask me anything." }];
    setChats(updated);
    setCurrentChat(first);
    // remove displayName
    setDisplayNames((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  // original rename using prompt (kept for backward compatibility)
  const renameChat = (oldName) => {
    const newName = prompt("Enter new chat name:", oldName);
    if (!newName || chats[newName]) return;
    performRename(oldName, newName);
  };

  // original delete that used confirm() (kept)
  const deleteChat = (name) => {
    if (!confirm(`Delete "${name}" chat?`)) return;
    performDelete(name);
  };

  const onToggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const onToggleSidebar = () => setSidebarOpen((prev) => !prev);

  // UI helpers
  const toggleMenu = (e, name) => {
    e.stopPropagation();
    setOpenMenu((prev) => (prev === name ? null : name));
    setRenaming(null);
  };

  const startRename = (e, name) => {
    e.stopPropagation();
    setOpenMenu(null);
    setRenaming(name);
    setRenameValue(name);
  };

  const saveRename = async (oldName) => {
    const newName = renameValue?.trim();
    if (!newName || newName === oldName) {
      cancelRename();
      return;
    }
    if (chats[newName]) {
      alert("A chat with this name already exists.");
      return;
    }

    // run erasing + typing animation in sidebar then commit rename
    setRenaming(null);
    setAnimatingName(oldName);
    setAnimatingType("rename");

    // Erase old name (remove characters one by one)
    for (let i = oldName.length; i >= 0; i--) {
      setDisplayNames((prev) => ({ ...prev, [oldName]: oldName.slice(0, i) }));
      await sleep(45);
    }
    await sleep(80);
    // Type new name
    for (let i = 1; i <= newName.length; i++) {
      setDisplayNames((prev) => ({ ...prev, [oldName]: newName.slice(0, i) }));
      await sleep(60);
    }

    // commit rename
    performRename(oldName, newName);

    // ensure animatingName resets and displayNames key is transferred in effect
    setAnimatingName(null);
    setAnimatingType(null);
  };

  const cancelRename = () => {
    setRenaming(null);
    setRenameValue("");
  };

  const confirmDelete = (e, name) => {
    e.stopPropagation();
    setOpenMenu(null);
    setDeleteTarget(name);
  };

  const cancelDelete = () => setDeleteTarget(null);

  const doDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    const name = deleteTarget;
    // animate erasing then delete
    setAnimatingName(name);
    setAnimatingType("delete");

    for (let i = name.length; i >= 0; i--) {
      setDisplayNames((prev) => ({ ...prev, [name]: name.slice(0, i) }));
      await sleep(55);
    }
    await sleep(80);
    performDelete(name);

    setDeleteTarget(null);
    setAnimatingName(null);
    setAnimatingType(null);
  };

  // UI click on row
  const onSelectChatRow = (name) => {
    if (animatingName) return; // block during animations
    if (renaming === name) return;
    setCurrentChat(name);
    setSidebarOpen(false);
    setOpenMenu(null);
  };

  // --- UI ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex" ref={containerRef}>
      {/* Sidebar */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-500 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* floating header area inside sidebar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-start gap-3">
          <div className="flex-1">
            <h2 className="font-semibold text-lg">Chats</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your conversations</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Notice Box */}
        <div className="m-3 p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
          <strong className="block text-xs font-semibold mb-1">Notice</strong>
          <div>This chat history is using your browsing data — modify this line by your own.</div>
        </div>

        {/* New Chat button moved above the list */}
        <div className="px-3">
          <button
            onClick={createChat}
            className="w-full mb-3 flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>
        </div>

        {/* Chat List */}
        <div ref={listRef} className="overflow-y-auto h-[calc(100%-10rem)] p-2 space-y-2">
          {Object.keys(chats).map((name) => {
            const isCurrent = name === currentChat;
            const displayed = displayNames[name] ?? name;
            const lastMsg =
              chats[name] && chats[name].length
                ? chats[name][chats[name].length - 1].content
                : "";
            return (
              <div
                key={name}
                className={`relative flex items-start gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                  isCurrent ? "bg-indigo-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => onSelectChatRow(name)}
              >
                {/* avatar / icon */}
                <div className={`flex-none w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium ${isCurrent ? "bg-white/20 text-white" : "bg-gray-200/60 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`}>
                  💬
                </div>

                {/* title + preview / or inline rename */}
                <div className="flex-1 min-w-0">
                  {renaming === name ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={renameValue}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename(name);
                          else if (e.key === "Escape") cancelRename();
                        }}
                        className="w-full px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveRename(name);
                        }}
                        className="text-sm text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelRename();
                        }}
                        className="text-sm text-gray-500 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          {/* animated display */}
                          <span
                            className={`block truncate text-sm font-medium transition-all duration-200 ${
                              isCurrent ? "text-white" : "text-gray-900 dark:text-gray-100"
                            } ${animatingName === name ? "opacity-90" : ""}`}
                            aria-live="polite"
                          >
                            {displayed}
                          </span>
                        </div>
                        {/* small timestamp placeholder (keeps ChatGPT-like layout) */}
                        <div className="flex-none text-xs text-gray-400 dark:text-gray-300">
                          {/* optional: show 'now' or empty */}
                        </div>
                      </div>
                      <div className="text-xs truncate text-gray-500 dark:text-gray-300 mt-1">
                        {lastMsg}
                      </div>
                    </>
                  )}
                </div>

                {/* three-dots */}
                <div className="flex-none ml-2">
                  <button
                    onClick={(e) => toggleMenu(e, name)}
                    className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition ${isCurrent ? "text-white" : "text-gray-600 dark:text-gray-300"}`}
                    title="Options"
                  >
                    ⋯
                  </button>

                  {/* Dropdown menu */}
                  {openMenu === name && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-3 top-14 z-50 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform transition duration-150 origin-top-right"
                    >
                      <button
                        onClick={(e) => startRename(e, name)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        Rename
                      </button>
                      <button
                        onClick={(e) => confirmDelete(e, name)}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">Made by <span className="font-semibold text-indigo-500">TUSHAR</span></div>
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={cancelDelete}
          />
          {/* modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-11/12 max-w-md p-6 transform transition-all duration-200 scale-100">
            <h3 className="text-lg font-semibold">Delete chat</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete "<span className="font-medium">{deleteTarget}</span>"? This action cannot be undone.
            </p>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={cancelDelete}
                className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={doDeleteConfirmed}
                className="px-3 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
