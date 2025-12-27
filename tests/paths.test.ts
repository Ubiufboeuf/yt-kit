import { describe, expect, it } from 'bun:test'
import { resolvePath } from '../src'

describe('Rutas (Linux)', () => {
  it('Debe devolver \'\' si la ruta que recibe es falsy', () => {
    const path = resolvePath('')
    expect(path).toBe('')
  })
  
  it('\'~\' sin \'/\' al final, debería devolver $HOME y NO terminar con \'/\'', () => {
    const home = resolvePath('~')
    expect(home).toMatch(/\/home\/.+[^/]/)
  })

  it('~. debe dar error', () => {
    expect(() => resolvePath('~.')).toThrowError()
  })

  it('.// debe tratarse como ./ y no dar error', () => {
    const path = resolvePath('./..///../mango/././')
    expect(path).toBe('/home/mango')
  })

  it('Usar C: en Linux no debe fallar', () => {
    expect(() => resolvePath('~/.cache/C:/Users/Admin/Desktop')).not.toThrowError()
  })

  it('Ruta con espacios debe fallar', () => {
    expect(() => resolvePath('./formats/../ formats/./. /id-456')).toThrowError()
  })

  it('Solo . debe fallar por no tener \'/\'', () => {
    expect(() => resolvePath('.')).toThrowError()
  })

  it('Solo .. debe fallar por no tener /', () => {
    expect(() => resolvePath('..')).toThrowError()
  })
})

