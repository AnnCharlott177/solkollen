import { useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

// Första gången används datorns inställning för ljust eller mörkt läge
function systemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('solkollen.tema', systemTheme())
  const isDark = theme === 'dark'

  // Temat sätts på <html> så att färgerna i index.css byts överallt
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
      title={isDark ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}
