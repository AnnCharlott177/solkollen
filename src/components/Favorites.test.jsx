import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Favorites from './Favorites.jsx'

const favorites = [
  { id: 'a', name: 'Göteborg' },
  { id: 'b', name: 'Stockholm' },
  { id: 'c', name: 'Östersund' },
]

function renderFavorites() {
  render(<Favorites favorites={favorites} activeId={null} onSelect={vi.fn()} onRemove={vi.fn()} />)
}

function filterBy(text) {
  fireEvent.change(screen.getByLabelText('Filtrera favoriter'), { target: { value: text } })
}

function shownNames() {
  return screen.queryAllByRole('listitem').map((li) => li.querySelector('.chip-name').textContent)
}

describe('Favorites', () => {
  it('visar alla favoriter när filtret är tomt', () => {
    renderFavorites()
    expect(shownNames()).toEqual(['Göteborg', 'Stockholm', 'Östersund'])
  })

  it('filtrerar listan utan att bry sig om stora eller små bokstäver', () => {
    renderFavorites()
    filterBy('ÖST')
    expect(shownNames()).toEqual(['Östersund'])

    filterBy('o')
    expect(shownNames()).toEqual(['Göteborg', 'Stockholm'])
  })

  it('visar ett meddelande när ingen favorit matchar', () => {
    renderFavorites()
    filterBy('Malmö')
    expect(shownNames()).toEqual([])
    expect(screen.getByText('Ingen favorit matchar ”Malmö”.')).toBeInTheDocument()
  })

  it('visar ingen filterruta när det inte finns några favoriter', () => {
    render(<Favorites favorites={[]} activeId={null} onSelect={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.queryByLabelText('Filtrera favoriter')).not.toBeInTheDocument()
  })
})
