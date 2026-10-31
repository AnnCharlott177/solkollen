import { iconUrl } from '../api/openweather.js'

function dayName(date, isToday) {
  if (isToday) return 'I dag'
  // Mitt på dagen i UTC så att veckodagen blir rätt oavsett tidszon
  const name = new Date(`${date}T12:00:00Z`).toLocaleDateString('sv-SE', {
    weekday: 'long',
    timeZone: 'UTC',
  })
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function shortDate(date) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

export default function Forecast({ days }) {
  return (
    <section className="card" aria-labelledby="forecast-title">
      <h2 id="forecast-title">Kommande fem dagar</h2>
      <ol className="forecast">
        {days.map((day) => (
          <li key={day.date} className="forecast-day">
            <div className="forecast-date">
              <strong>{dayName(day.date, day.isToday)}</strong>
              <span className="muted small">{shortDate(day.date)}</span>
            </div>
            <img src={iconUrl(day.icon)} alt={day.description} width="56" height="56" />
            <div className="forecast-temps">
              <span className="max">{Math.round(day.max)}°</span>
              <span className="min">{Math.round(day.min)}°</span>
            </div>
            <span className="pop small" title="Största risk för nederbörd under dagen">
              💧 {Math.round(day.pop * 100)} %
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
