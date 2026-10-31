// Små hjälpfunktioner för OpenWeatherMaps gratis-API:er.
// Nyckeln läses från miljövariabeln VITE_OPENWEATHER_API_KEY (lägg den i .env.local).

const API_KEY = (import.meta.env.VITE_OPENWEATHER_API_KEY || '').trim()

export const hasApiKey = API_KEY.length > 0

export class WeatherError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

const MESSAGES = {
  'missing-key':
    'API-nyckel saknas. Lägg in din nyckel från OpenWeatherMap i filen .env.local som VITE_OPENWEATHER_API_KEY=din-nyckel och starta sedan om utvecklingsservern.',
  'invalid-key':
    'API-nyckeln fungerar inte. Kontrollera att nyckeln i .env.local är rätt. En helt ny nyckel kan ta upp till ett par timmar innan den aktiveras hos OpenWeatherMap.',
  'rate-limit': 'För många förfrågningar just nu. Vänta en stund och försök igen.',
  network: 'Kunde inte nå OpenWeatherMap. Kontrollera din internetanslutning och försök igen.',
  other: 'Något gick fel när vädret skulle hämtas. Försök igen om en stund.',
}

export const MISSING_KEY_MESSAGE = MESSAGES['missing-key']

async function request(url, params) {
  if (!hasApiKey) throw new WeatherError('missing-key', MESSAGES['missing-key'])

  const query = new URLSearchParams({ ...params, appid: API_KEY })
  let response
  try {
    response = await fetch(`${url}?${query}`)
  } catch {
    throw new WeatherError('network', MESSAGES.network)
  }

  if (response.status === 401) throw new WeatherError('invalid-key', MESSAGES['invalid-key'])
  if (response.status === 429) throw new WeatherError('rate-limit', MESSAGES['rate-limit'])
  if (!response.ok) throw new WeatherError('other', MESSAGES.other)
  return response.json()
}

// Sök orter via Geocoding-API:et
export async function searchPlaces(text) {
  const results = await request('https://api.openweathermap.org/geo/1.0/direct', {
    q: text,
    limit: 5,
  })
  const places = results.map((place) => {
    const name = place.local_names?.sv || place.name
    return {
      id: `${place.lat.toFixed(3)},${place.lon.toFixed(3)}`,
      name,
      detail: [place.state, place.country].filter(Boolean).join(', '),
      lat: place.lat,
      lon: place.lon,
    }
  })

  // Samma ort kan komma flera gånger (svenska orter saknar län) – visa bara den första
  const seen = new Set()
  return places.filter((place) => {
    const key = `${place.name}|${place.detail}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const common = (place) => ({ lat: place.lat, lon: place.lon, units: 'metric', lang: 'sv' })

export function getCurrentWeather(place) {
  return request('https://api.openweathermap.org/data/2.5/weather', common(place))
}

export async function getFiveDayForecast(place) {
  const data = await request('https://api.openweathermap.org/data/2.5/forecast', common(place))
  return summarizeForecast(data)
}

// Datum (YYYY-MM-DD) och timme i ortens lokala tid
function localParts(unixSeconds, offsetSeconds) {
  const d = new Date((unixSeconds + offsetSeconds) * 1000)
  return { date: d.toISOString().slice(0, 10), hour: d.getUTCHours() }
}

// Prognosen kommer i 3-timmarsintervall – slå ihop dem till en rad per dag
function summarizeForecast(data) {
  const offset = data.city?.timezone ?? 0
  const days = new Map()

  for (const item of data.list) {
    const { date, hour } = localParts(item.dt, offset)
    if (!days.has(date)) days.set(date, [])
    days.get(date).push({ ...item, hour })
  }

  const today = localParts(Date.now() / 1000, offset).date
  let dates = [...days.keys()].filter((d) => d !== today)
  if (dates.length < 5 && days.has(today)) dates = [today, ...dates]

  return dates.slice(0, 5).map((date) => {
    const items = days.get(date)
    // Välj det intervall som ligger närmast mitt på dagen som representativt väder
    const midday = items.reduce((best, item) =>
      Math.abs(item.hour - 13) < Math.abs(best.hour - 13) ? item : best,
    )
    return {
      date,
      isToday: date === today,
      min: Math.min(...items.map((i) => i.main.temp_min)),
      max: Math.max(...items.map((i) => i.main.temp_max)),
      icon: midday.weather[0].icon.replace('n', 'd'),
      description: midday.weather[0].description,
      pop: Math.max(...items.map((i) => i.pop ?? 0)),
    }
  })
}

export const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`
