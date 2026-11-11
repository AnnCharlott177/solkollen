// Påhittade svar som liknar OpenWeatherMaps, så att testerna aldrig går ut på nätet.
import { vi } from 'vitest'

export const geocodingResults = [
  { name: 'Gothenburg', local_names: { sv: 'Göteborg' }, lat: 57.7072, lon: 11.9668, country: 'SE' },
  // Samma ort en gång till – ska bara visas en gång
  { name: 'Gothenburg', local_names: { sv: 'Göteborg' }, lat: 57.7089, lon: 11.9746, country: 'SE' },
  { name: 'Gothenburg', lat: 39.9, lon: -98.3, state: 'Nebraska', country: 'US' },
]

export const currentWeather = {
  dt: 1780308000,
  weather: [{ icon: '01d', description: 'klar himmel' }],
  main: { temp: 18.4, feels_like: 16.4, humidity: 55, temp_min: 15.2, temp_max: 20.9 },
  wind: { speed: 4.2 },
}

// Prognos i 3-timmarsintervall för sex dygn från och med startDate (UTC, tidszon 0).
// Temperaturen är dagens nummer * 10 + timmen / 3, så att min och max blir lätta att räkna ut.
export function forecastResponse(startDate = '2026-06-01') {
  const start = Date.parse(`${startDate}T00:00:00Z`) / 1000
  const list = []
  for (let day = 0; day < 6; day++) {
    for (let hour = 0; hour < 24; hour += 3) {
      const temp = day * 10 + hour / 3
      list.push({
        dt: start + day * 86400 + hour * 3600,
        main: { temp, temp_min: temp, temp_max: temp },
        weather: [{ icon: hour === 12 ? '10n' : '01d', description: hour === 12 ? 'lätt regn' : 'klart' }],
        pop: hour === 15 ? 0.8 : 0.1,
      })
    }
  }
  return { city: { timezone: 0 }, list }
}

function jsonResponse(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body }
}

// Ersätter fetch med en mock som svarar efter vilken del av API:et som anropas
export function mockWeatherApi({ status = 200 } = {}) {
  const fetchMock = vi.fn(async (url) => {
    if (status !== 200) return jsonResponse({}, status)
    if (url.includes('/geo/1.0/direct')) return jsonResponse(geocodingResults)
    if (url.includes('/data/2.5/weather')) return jsonResponse(currentWeather)
    if (url.includes('/data/2.5/forecast')) return jsonResponse(forecastResponse())
    return jsonResponse({}, 404)
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
