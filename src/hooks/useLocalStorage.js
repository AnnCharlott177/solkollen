import { useEffect, useState } from 'react'

// Som useState, men värdet sparas i webbläsarens localStorage.
// Om localStorage inte går att använda (t.ex. privat läge) fungerar appen ändå.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Inget att göra – värdet finns kvar så länge sidan är öppen
    }
  }, [key, value])

  return [value, setValue]
}
