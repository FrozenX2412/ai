import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../pages/_app";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  // Scroll detection for floating header
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 60) {
        setHidden(true); // Hide on scroll down
      } else {
        setHidden(false); // Show on scroll up
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <header
      className={`w-full fixed top-3 left-1/2 -translate-x-1/2 z-50
        border border-gray-200/40 dark:border-gray-800/40
        bg-white/30 dark:bg-gray-900/30
        backdrop-blur-2xl backdrop-saturate-150
        shadow-xl rounded-2xl
        max-w-6xl mx-auto
        transition-all duration-500 ease-in-out
        ${
          hidden
            ? "-translate-y-16 opacity-0 scale-95"
            : "translate-y-0 opacity-100 scale-100"
        }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo + Text */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold text-indigo-600 select-none">
            🧊
          </div>
          <div className="hidden sm:block select-none">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              GlacierX
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Crafted for elegance and power.
            </div>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="relative w-10 h-10 flex items-center justify-center rounded-full
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

          {/* Moon Icon (dark mode) */}
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
