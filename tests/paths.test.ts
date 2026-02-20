import { describe, expect, it } from 'bun:test'
import { resolvePath } from '../src'
import { resolve } from 'node:path'

describe('Rutas (Linux)', () => {
  it('Debe devolver \'\' si la ruta que recibe es falsy', () => {
    const path = resolvePath('')
    expect(path).toBe('')
  })
  
  it('\'~\' sin \'/\' al final, debería devolver $HOME y no terminar con \'/\'', () => {
    const home = resolvePath('~')
    expect(home).toMatch(/\/home\/.+[^/]/)
  })
  
  it('\'~\' con \'/\' al final, debería devolver $HOME y no terminar con \'/\'', () => {
    const home = resolvePath('~/')
    expect(home).toMatch(/\/home\/.+[^/]/)
  })

  it('~. debe dar error', () => {
    expect(() => resolvePath('~.')).toThrowError()
  })

  it('.// debe tratarse como ./ y no dar error', () => {
    const path = resolvePath('./..///../yt-kit-environment/')
    expect(path).toBe('/home/mango/Dev/yt-kit-environment')
  })

  it('Usar C: en Linux no debe fallar', () => {
    expect(() => resolvePath('~/.cache/C:/Users/Admin/Desktop')).not.toThrowError()
  })

  it('Ruta con espacios debe fallar', () => {
    expect(() => resolvePath('./formats/../ formats/./. /id-456')).toThrowError()
  })

  it('"." debe terminar como la ruta actual', () => {
    expect(() => resolvePath('.')).not.toThrowError()
  })

  it('Solo .. debe ir una ruta atrás', () => {
    const path = resolvePath('..')
    expect(path).toBe('/home/mango/Dev/yt-kit-ecosystem')
  })
})

