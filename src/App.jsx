import { useCallback, useEffect, useState } from 'react'
import {
  getCurrentWeather,
  getFiveDayForecast,
  hasApiKey,
  MISSING_KEY_MESSAGE,
  WeatherError,
} from './api/openweather.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import SearchBar from './components/SearchBar.jsx'
import Favorites from './components/Favorites.jsx'
import CurrentWeather from './components/CurrentWeather.jsx'
import Forecast from './components/Forecast.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

export default function App() {
  const [favorites, setFavorites] = useLocalStorage('solkollen.favoriter', [])
  const [lastPlace, setLastPlace] = useLocalStorage('solkollen.senasteOrt', null)
  const [place, setPlace] = useState(null)
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(hasApiKey ? null : { code: 'missing-key', message: MISSING_KEY_MESSAGE })

  const showError = useCallback((err) => {
    setError(
      err instanceof WeatherError
        ? { code: err.code, message: err.message }
        : { code: 'other', message: 'Något gick fel. Försök igen om en stund.' },
    )
  }, [])

  const loadPlace = useCallback(
    async (newPlace) => {
      setPlace(newPlace)
      setLastPlace(newPlace)
      setLoading(true)
      setError(null)
      try {
        const [current, days] = await Promise.all([
          getCurrentWeather(newPlace),
          getFiveDayForecast(newPlace),
        ])
        setWeather(current)
        setForecast(days)
      } catch (err) {
        setWeather(null)
        setForecast(null)
        showError(err)
      } finally {
        setLoading(false)
      }
    },
    [setLastPlace, showError],
  )

  // Visa senast valda ort (eller första favoriten) direkt när appen öppnas
  useEffect(() => {
    const start = lastPlace || favorites[0]
    if (hasApiKey && start) loadPlace(start)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isFavorite = place ? favorites.some((f) => f.id === place.id) : false

  function toggleFavorite() {
    if (!place) return
    setFavorites((list) =>
      list.some((f) => f.id === place.id)
        ? list.filter((f) => f.id !== place.id)
        : [...list, { id: place.id, name: place.name, detail: place.detail, lat: place.lat, lon: place.lon }],
    )
  }

  function removeFavorite(target) {
    setFavorites((list) => list.filter((f) => f.id !== target.id))
  }

  const keyProblem = error && (error.code === 'missing-key' || error.code === 'invalid-key')

  return (
    <div className="app">
      <header className="app-header">
        <ThemeToggle />
        <h1>
          <img src="./favicon.svg" alt="" width="40" height="40" />
          Solkollen
        </h1>
        <p className="tagline">Vädret just nu och fem dagar framåt</p>
      </header>

      <main>
        <SearchBar onSelect={loadPlace} onError={showError} disabled={!hasApiKey} />
        <Favorites
          favorites={favorites}
          activeId={place?.id}
          onSelect={loadPlace}
          onRemove={removeFavorite}
        />

        {error && (
          <div className={keyProblem ? 'message key' : 'message'} role="alert">
            <span className="message-icon" aria-hidden="true">
              {keyProblem ? '🔑' : '⚠️'}
            </span>
            <div>
              <strong>{keyProblem ? 'Problem med API-nyckeln' : 'Hoppsan!'}</strong>
              <p>{error.message}</p>
              {!keyProblem && place && (
                <button type="button" className="button" onClick={() => loadPlace(place)}>
                  Försök igen
                </button>
              )}
            </div>
          </div>
        )}

        {loading && (
          <p className="loading" role="status">
            <span className="spinner" aria-hidden="true" /> Hämtar väder för {place?.name}…
          </p>
        )}

        {!loading && weather && forecast && (
          <div className="weather">
            <CurrentWeather
              place={place}
              weather={weather}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
            <Forecast days={forecast} />
          </div>
        )}

        {!loading && !place && !error && (
          <div className="welcome">
            <p className="welcome-sun" aria-hidden="true">☀️</p>
            <p>Sök efter en ort för att se hur vädret blir!</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        Väderdata från <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">OpenWeatherMap</a>
      </footer>
    </div>
  )
}
