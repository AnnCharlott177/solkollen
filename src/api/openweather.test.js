import { describe, expect, it, vi } from 'vitest'
import { getFiveDayForecast, searchPlaces, WeatherError } from './openweather.js'
import { mockWeatherApi } from '../test/fixtures.js'

const goteborg = { lat: 57.7, lon: 11.97 }

describe('searchPlaces', () => {
  it('använder svenska namn och tar bort dubbletter', async () => {
    mockWeatherApi()
    const places = await searchPlaces('Göteborg')

    expect(places).toHaveLength(2)
    expect(places[0]).toMatchObject({ name: 'Göteborg', detail: 'SE', id: '57.707,11.967' })
    expect(places[1]).toMatchObject({ name: 'Gothenburg', detail: 'Nebraska, US' })
  })

  it('skickar med API-nyckeln och söktexten', async () => {
    const fetchMock = mockWeatherApi()
    await searchPlaces('Lund')

    const url = new URL(fetchMock.mock.calls[0][0])
    expect(url.searchParams.get('q')).toBe('Lund')
    expect(url.searchParams.get('appid')).toBe('testnyckel')
  })
})

describe('felhantering', () => {
  it.each([
    [401, 'invalid-key'],
    [429, 'rate-limit'],
    [500, 'other'],
  ])('HTTP %i ger felkoden %s', async (status, code) => {
    mockWeatherApi({ status })
    await expect(searchPlaces('Lund')).rejects.toMatchObject({ code })
  })

  it('ger felkoden network när nätet inte svarar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const error = await searchPlaces('Lund').catch((e) => e)

    expect(error).toBeInstanceOf(WeatherError)
    expect(error.code).toBe('network')
  })
})

describe('getFiveDayForecast', () => {
  it('slår ihop 3-timmarsintervall till fem dagar efter i dag', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-06-01T10:00:00Z'))
    mockWeatherApi()

    const days = await getFiveDayForecast(goteborg)

    expect(days.map((d) => d.date)).toEqual([
      '2026-06-02',
      '2026-06-03',
      '2026-06-04',
      '2026-06-05',
      '2026-06-06',
    ])
    expect(days[0]).toMatchObject({
      isToday: false,
      min: 10,
      max: 17,
      pop: 0.8,
      // Vädret mitt på dagen (kl 12) används, och nattikoner byts mot dagikoner
      icon: '10d',
      description: 'lätt regn',
    })
  })
})
