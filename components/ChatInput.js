import { useState } from "react";

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleSend = () => {
    if (!text.trim() || loading) return;
    setClicked(true); // trigger arrow animation
    setTimeout(() => setClicked(false), 300); // reset animation
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[80%] md:w-[60%]
      transition-all duration-300"
    >
      <div
        className={`flex items-center px-4 py-3 rounded-full shadow-xl border border-gray-300/30 dark:border-gray-700/40 backdrop-blur-md transition-all duration-300
          ${
            focused || text
              ? "bg-white/100 dark:bg-gray-800/100"
              : "bg-white/30 dark:bg-gray-800/30"
          }`}
      >
        <textarea
          rows="1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={loading ? "Thinking..." : "Message GlacierX..."}
          disabled={loading}
          className="flex-1 resize-none bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-2"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className={`p-3 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 transform
            ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110 active:scale-95 opacity-100"
            }`}
        >
          {/* Telegram-style Send Arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className={`w-5 h-5 text-white transform transition-transform duration-300 ${
              clicked ? "translate-x-2 -translate-y-1" : "translate-x-0"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2 21l21-9L2 3v7l15 2-15 2v7z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
