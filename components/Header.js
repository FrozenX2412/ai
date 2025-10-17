import { useContext } from "react";
import { ThemeContext } from "../pages/_app";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header
      className="fixed top-0 left-1/2 -translate-x-1/2 z-50
        w-full max-w-6xl mx-auto
        border border-gray-200/40 dark:border-gray-800/40
        bg-white/60 dark:bg-gray-900/60
        backdrop-blur-[50px] backdrop-saturate-200
        shadow-2xl rounded-2xl
        transition-all duration-500 ease-in-out"
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo + Text */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold text-indigo-600 select-none">
            🧊
          </div>
          <div className="flex flex-col select-none">
            <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              GlacierX
            </div>
            <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 leading-tight">
              Built by Tushar.
            </div>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full
            transition-all duration-300 bg-gray-200 dark:bg-gray-700
            hover:scale-110 hover:rotate-[360deg] shadow-md group"
        >
          {/* Sun Icon (light mode) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`absolute w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 transition-all duration-500 transform ${
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

          {/* Moon Icon (dark mode) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`absolute w-5 h-5 sm:w-6 sm:h-6 text-blue-400 transition-all duration-500 transform ${
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
