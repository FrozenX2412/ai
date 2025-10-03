import '../styles/globals.css'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const t = localStorage.getItem('theme') || 'dark'
    document.documentElement.classList.toggle('dark', t === 'dark')
  }, [])

  return <Component {...pageProps} />
}
