import { homedir } from 'node:os'
import { join, resolve, sep } from 'node:path'

export function resolvePath (input: string): string {
  if (!input) return ''
  if (input.match(/~[^/]+/)) {
    throw new Error('Ruta inválida. Ten más cuidado usando \'~\'')
  }

  let p = input
  
  if (input.startsWith('~')) {
    p = join(homedir(), sep, input.slice(1))
  }

  return resolve(p)
}
