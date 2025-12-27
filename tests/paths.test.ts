import { describe, expect, it } from 'bun:test'
import { resolvePath } from '../src'

describe('Rutas (Linux)', () => {
  it('Debe devolver \'\' si la ruta que recibe es falsy', () => {
    const path = resolvePath('')
    expect(path).toBe('')
  })
  
  it('\'~\' sin \'/\' al final, debería devolver /home/$USER y NO terminar con \'/\'', () => {
    const home = resolvePath('~')
    expect(home).toMatch(/\/home\/.+[^/]/)
  })

  it('~. debe dar error', () => {
    expect(() => resolvePath('~.')).toThrowError()
  })

  it('.// debe tratarse como ./ y no dar errores', () => {
    const path = resolvePath('./..///../mango/././')
    expect(path).toBe('/home/mango')
  })
})
