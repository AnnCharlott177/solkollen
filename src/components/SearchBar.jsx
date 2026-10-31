import { useState } from 'react'
import { searchPlaces } from '../api/openweather.js'

export default function SearchBar({ onSelect, onError, disabled }) {
  const [text, setText] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const query = text.trim()
    if (!query) return

    setLoading(true)
    setResults(null)
    try {
      setResults(await searchPlaces(query))
    } catch (error) {
      onError(error)
    } finally {
      setLoading(false)
    }
  }

  function choose(place) {
    setResults(null)
    setText('')
    onSelect(place)
  }

  return (
    <div className="search">
      <form className="search-form" onSubmit={handleSubmit} role="search">
        <label htmlFor="search-input" className="visually-hidden">
          Sök ort
        </label>
        <input
          id="search-input"
          type="search"
          placeholder="Sök ort, t.ex. Göteborg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
          enterKeyHint="search"
          disabled={disabled}
        />
        <button type="submit" className="button primary" disabled={disabled || loading}>
          {loading ? 'Söker…' : 'Sök'}
        </button>
      </form>

      {results && (
        <div className="search-results">
          {results.length === 0 ? (
            <p className="search-empty">Hittade ingen ort som heter ”{text.trim()}”. Prova att stava på ett annat sätt.</p>
          ) : (
            <ul>
              {results.map((place) => (
                <li key={place.id}>
                  <button type="button" onClick={() => choose(place)}>
                    <strong>{place.name}</strong>
                    {place.detail && <span>{place.detail}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
