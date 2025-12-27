import { homedir } from 'node:os'
import { join, resolve, sep } from 'node:path'

export function resolvePath (input: string): string {
  if (!input) return ''
  if (input.match(/~[^/]+/))
    throw new Error('Ruta inválida. Ten más cuidado usando \'~\'')

  if (input.includes(' '))
    throw new Error('La ruta no puede tener espacios')

  if (input === '.' || input === '..')
    throw new Error(`'${input}' No es una ruta válida. Tal vez faltó agregar '/'?`)

  let p = input
  
  if (input.startsWith('~')) {
    p = join(homedir(), sep, input.slice(1))
  }

  return resolve(p)
}
