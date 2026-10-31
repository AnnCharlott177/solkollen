import { iconUrl } from '../api/openweather.js'

const round = (n) => Math.round(n)

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export default function CurrentWeather({ place, weather, isFavorite, onToggleFavorite }) {
  const info = weather.weather[0]
  const updated = new Date(weather.dt * 1000).toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <section className="card current" aria-labelledby="current-title">
      <div className="current-header">
        <div>
          <h2 id="current-title">{place.name}</h2>
          {place.detail && <p className="muted">{place.detail}</p>}
        </div>
        <button
          type="button"
          className={isFavorite ? 'star on' : 'star'}
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Ta bort ${place.name} från favoriter` : `Spara ${place.name} som favorit`}
          title={isFavorite ? 'Ta bort från favoriter' : 'Spara som favorit'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="current-main">
        <img src={iconUrl(info.icon)} alt="" width="100" height="100" />
        <div>
          <p className="temp">{round(weather.main.temp)}°</p>
          <p className="description">{capitalize(info.description)}</p>
        </div>
      </div>

      <dl className="details">
        <div>
          <dt>Känns som</dt>
          <dd>{round(weather.main.feels_like)}°</dd>
        </div>
        <div>
          <dt>Vind</dt>
          <dd>{round(weather.wind.speed)} m/s</dd>
        </div>
        <div>
          <dt>Luftfuktighet</dt>
          <dd>{weather.main.humidity} %</dd>
        </div>
        <div>
          <dt>Lägst / högst</dt>
          <dd>
            {round(weather.main.temp_min)}° / {round(weather.main.temp_max)}°
          </dd>
        </div>
      </dl>
      <p className="muted small">Uppdaterat kl. {updated}</p>
    </section>
  )
}
