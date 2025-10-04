import { useContext } from "react";
import { ThemeContext } from "../pages/_app";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="w-full py-4 px-4 sm:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo + Text */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold text-indigo-600 select-none">AI</div>
          <div className="hidden sm:block select-none">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Chat — Masterpiece UI
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Responsive, Dark/Light, Code blocks, Copy
            </div>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 bg-gray-200 dark:bg-gray-700 hover:rotate-[360deg] group"
        >
          {/* Sun Icon (visible in light mode) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`absolute w-6 h-6 text-yellow-500 transition-all duration-500 transform ${
              theme === "light"
                ? "opacity-100 scale-100 group-hover:rotate-[360deg]"
                : "opacity-0 scale-0"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m8.485-8.485h1M3.515 12.515h1M16.95 7.05l.707-.707M6.343 17.657l.707-.707M16.95 16.95l.707.707M6.343 6.343l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
            />
          </svg>

          {/* Moon Icon (visible in dark mode) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`absolute w-6 h-6 text-blue-400 transition-all duration-500 transform ${
              theme === "dark"
                ? "opacity-100 scale-100 group-hover:rotate-[360deg]"
                : "opacity-0 scale-0"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
