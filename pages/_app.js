import "../styles/globals.css";
import { useEffect, useState, createContext } from "react";
import Head from "next/head";

// Context for theme toggling
export const ThemeContext = createContext();

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState("dark");

  // Load theme from localStorage on first mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // Toggle between dark and light themes
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <>
      {/* Head metadata for SEO + favicon */}
      <Head>
        <title>GlacierX </title>
        <meta
          name="description"
          content="Get Free Access to ChatGPT Latest Model!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={theme === "dark" ? "#0f172a" : "#ffffff"} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </Head>

      {/* Provide theme context to all components */}
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Component {...pageProps} />
      </ThemeContext.Provider>
    </>
  );
}
