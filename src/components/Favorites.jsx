export default function Favorites({ favorites, activeId, onSelect, onRemove }) {
  if (favorites.length === 0) {
    return (
      <p className="favorites-empty">
        ☆ Tryck på stjärnan vid en ort för att spara den som favorit.
      </p>
    )
  }

  return (
    <nav className="favorites" aria-label="Favoritorter">
      <ul>
        {favorites.map((place) => (
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
    </nav>
  )
}
