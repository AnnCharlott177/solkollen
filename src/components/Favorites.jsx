import { useState } from 'react'

export default function Favorites({ favorites, activeId, onSelect, onRemove }) {
  const [filter, setFilter] = useState('')

  if (favorites.length === 0) {
    return (
      <p className="favorites-empty">
        ☆ Tryck på stjärnan vid en ort för att spara den som favorit.
      </p>
    )
  }

  // Filtrera på ortens namn, utan att bry sig om stora eller små bokstäver
  const query = filter.trim().toLocaleLowerCase('sv')
  const shown = query
    ? favorites.filter((place) => place.name.toLocaleLowerCase('sv').includes(query))
    : favorites

  return (
    <div className="favorites-bar">
      <nav className="favorites" aria-label="Favoritorter">
        {shown.length === 0 ? (
          <p className="favorites-no-match">Ingen favorit matchar ”{filter.trim()}”.</p>
        ) : (
          <ul>
            {shown.map((place) => (
              <li key={place.id} className={place.id === activeId ? 'chip active' : 'chip'}>
                <button
                  type="button"
                  className="chip-name"
                  onClick={() => onSelect(place)}
                  aria-current={place.id === activeId ? 'true' : undefined}
                >
                  {place.name}
                </button>
                <button
                  type="button"
                  className="chip-remove"
                  onClick={() => onRemove(place)}
                  aria-label={`Ta bort ${place.name} från favoriter`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="favorites-filter">
        <label htmlFor="favorites-filter-input" className="visually-hidden">
          Filtrera favoriter
        </label>
        <input
          id="favorites-filter-input"
          type="search"
          placeholder="Filtrera favoriter…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          autoComplete="off"
        />
      </div>
    </div>
  )
}
