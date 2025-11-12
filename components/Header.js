import { useContext } from "react";
import { ThemeContext } from "../pages/_app";

export default function Header({ onToggleTheme, theme, onToggleSidebar, sidebarOpen }) {
  const ctx = useContext(ThemeContext ?? {});
  const currentTheme = theme ?? ctx?.theme ?? "dark";
  const toggleTheme = onToggleTheme ?? ctx?.toggleTheme ?? (() => {});

  return (
    <header
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-[70]
        max-w-6xl w-full mx-auto
        border border-gray-200/40 dark:border-gray-800/40
        bg-white/60 dark:bg-gray-900/60
        backdrop-blur-[50px] backdrop-saturate-200
        shadow-2xl rounded-2xl
        transition-all duration-500 ease-in-out`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left Section: Menu + Title */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Icon (always 3 lines, not tick mark) */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={!!sidebarOpen}
            className="relative flex flex-col justify-center items-center w-8 h-8 gap-[5px]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded
              transition-all duration-300 z-[80]" // higher z so visible above sidebar
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <span className="block h-[2px] w-6 bg-gray-800 dark:bg-gray-200 rounded transition-all duration-300" />
            <span className="block h-[2px] w-6 bg-gray-800 dark:bg-gray-200 rounded transition-all duration-300" />
            <span className="block h-[2px] w-6 bg-gray-800 dark:bg-gray-200 rounded transition-all duration-300" />
          </button>

          {/* Brand Name */}
          <div className="flex flex-col select-none">
            <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              GlacierX
            </div>
            <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 leading-tight">
              Built by Tushar.
            </div>
          </div>
        </div>

        {/* Right controls (theme toggle only) */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            aria-pressed={currentTheme === "dark"}
            className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full
              transition-all duration-300 bg-gray-200 dark:bg-gray-700
              hover:scale-105 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            title="Toggle theme"
          >
            {/* Sun Icon (light mode) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`absolute w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 transition-all duration-500 transform ${
                currentTheme === "light" ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
              aria-hidden={currentTheme !== "light"}
              focusable="false"
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
                currentTheme === "dark" ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
              aria-hidden={currentTheme !== "dark"}
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
