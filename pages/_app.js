// pages/_app.js
import "../styles/globals.css";
import { useEffect, useState, createContext, useMemo } from "react";
import Head from "next/head";
import Script from "next/script";

// Context for theme toggling
export const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState("dark");

  // Load theme from localStorage on first mount (guarded for SSR)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme") || "dark";
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      }
    } catch (err) {
      // don't break the app if localStorage is unavailable
      console.error("Failed to read theme from localStorage:", err);
    }
  }, []);

  // Toggle between dark and light themes (safe for SSR)
  const toggleTheme = () => {
    try {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
    } catch (err) {
      console.error("Failed to toggle theme:", err);
    }
  };

  // Memoize context value so consumers don't re-render unnecessarily
  const themeContextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <>
      {/* Head metadata for SEO + favicon */}
      <Head>
        <title>GlacierX</title>
        <meta name="description" content="Get Free Access to ChatGPT Latest Model!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={theme === "dark" ? "#0f172a" : "#ffffff"} />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </Head>

      {/* Google AdSense (loads after hydration) */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3349470835131260"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error("AdSense script failed to load", e);
        }}
      />

      {/* Provide theme context to all components */}
      <ThemeContext.Provider value={themeContextValue}>
        <Component {...pageProps} />
      </ThemeContext.Provider>
    </>
  );
}
