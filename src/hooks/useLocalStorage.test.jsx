import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLocalStorage } from './useLocalStorage.js'

describe('useLocalStorage', () => {
  it('börjar med startvärdet och sparar ändringar', () => {
    const { result } = renderHook(() => useLocalStorage('test.lista', []))
    expect(result.current[0]).toEqual([])

    act(() => result.current[1](['Lund']))

    expect(result.current[0]).toEqual(['Lund'])
    expect(JSON.parse(localStorage.getItem('test.lista'))).toEqual(['Lund'])
  })

  it('läser ett värde som redan finns sparat', () => {
    localStorage.setItem('test.lista', JSON.stringify(['Umeå']))
    const { result } = renderHook(() => useLocalStorage('test.lista', []))
    expect(result.current[0]).toEqual(['Umeå'])
  })

  it('använder startvärdet om det sparade värdet är trasigt', () => {
    localStorage.setItem('test.lista', '{inte json')
    const { result } = renderHook(() => useLocalStorage('test.lista', []))
    expect(result.current[0]).toEqual([])
  })
})
