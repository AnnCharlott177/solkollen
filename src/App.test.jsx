import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'
import { mockWeatherApi } from './test/fixtures.js'

function searchFor(text) {
  fireEvent.change(screen.getByLabelText('Sök ort'), { target: { value: text } })
  fireEvent.click(screen.getByRole('button', { name: 'Sök' }))
}

describe('App', () => {
  it('visar välkomsttexten när ingen ort är vald', () => {
    mockWeatherApi()
    render(<App />)
    expect(screen.getByText('Sök efter en ort för att se hur vädret blir!')).toBeInTheDocument()
  })

  it('söker, visar vädret och sparar en favorit', async () => {
    mockWeatherApi()
    render(<App />)

    searchFor('Göteborg')
    fireEvent.click(await screen.findByRole('button', { name: /Göteborg/ }))

    expect(await screen.findByRole('heading', { name: 'Göteborg' })).toBeInTheDocument()
    const current = screen.getByRole('region', { name: 'Göteborg' })
    expect(within(current).getByText('18°')).toBeInTheDocument()
    expect(within(current).getByText('Klar himmel')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Spara Göteborg som favorit' }))

    expect(screen.getByRole('navigation', { name: 'Favoritorter' })).toHaveTextContent('Göteborg')
    expect(JSON.parse(localStorage.getItem('solkollen.favoriter'))).toEqual([
      expect.objectContaining({ name: 'Göteborg' }),
    ])
  })

  it('visar ett tydligt fel när API-nyckeln inte fungerar', async () => {
    mockWeatherApi({ status: 401 })
    render(<App />)

    searchFor('Göteborg')

    expect(await screen.findByRole('alert')).toHaveTextContent('Problem med API-nyckeln')
  })
})
