import { config } from '../config/Configuration'
import type { CacheKey } from '../types/cacheTypes'
import { resolvePath } from './resolvePath'
import { join } from 'node:path'

export function getKeyPath (key: CacheKey): string | undefined {
  const cacheLocation = config.get('cache')?.cacheLocation

  if (!cacheLocation) {
    throw new Error('Es necesario configurar cacheLocation para buscar en el almacenamiento.')
  }

  let path = resolvePath(cacheLocation)

  // Si son formatos, cachea en una sub-carpeta
  if (key.includes('formats:')) {
    const ytId = key.split(':')[1]
    if (!ytId) {
      throw new Error(`Falta especificar ytId en ${key}`)
    }
    
    path = join(resolvePath(cacheLocation), 'formats', ytId)
  }
  
  return path
}
