import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ThemeToggle from './ThemeToggle.jsx'

afterEach(() => {
  delete document.documentElement.dataset.theme
})

describe('ThemeToggle', () => {
  it('byter mellan ljust och mörkt läge och sparar valet', () => {
    localStorage.setItem('solkollen.tema', JSON.stringify('light'))
    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('light')
    fireEvent.click(screen.getByRole('button', { name: 'Byt till mörkt läge' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(JSON.parse(localStorage.getItem('solkollen.tema'))).toBe('dark')

    fireEvent.click(screen.getByRole('button', { name: 'Byt till ljust läge' }))
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('följer datorns inställning första gången', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByRole('button', { name: 'Byt till ljust läge' })).toBeInTheDocument()
  })

  it('väljer ljust läge om webbläsaren saknar matchMedia', () => {
    render(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
