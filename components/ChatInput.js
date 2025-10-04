import { useState } from "react";

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSend = () => {
    if (!text.trim() || loading) return;
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
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[80%] md:w-[60%]
        transition-all duration-300`}
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
          className={`p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-transform duration-200 active:scale-90 ${
            loading ? "opacity-50 cursor-not-allowed" : "opacity-100"
          }`}
        >
          {/* Arrow SVG icon */}
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
  );
}
