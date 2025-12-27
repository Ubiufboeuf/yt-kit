import { mkdir, writeFile } from 'node:fs/promises'
import type { CachedData, CacheKey } from '../types/cacheTypes'
import { config } from '../config/Configuration'
import { resolvePath } from '../lib/resolvePath'
import { dirname, join } from 'node:path'

// Esta función es solo para caché
export async function saveInDisk (key: CacheKey, value: CachedData) {
  const cacheLocation = config.get('cache')?.cacheLocation
  if (!cacheLocation) return

  let cachePath = resolvePath(cacheLocation)

  // Si son formatos, cachea en una sub-carpeta
  if (key.includes('formats:')) {
    const ytId = key.split(':')[1]
    if (!ytId) {
      throw new Error(`Falta especificar ytId en ${key}`)
    }
    
    cachePath = join(resolvePath(cacheLocation), 'formats', ytId)
  }

  const cacheDir = dirname(cachePath)

  try {
    mkdir(cacheDir, { recursive: true })
    await writeFile(cachePath, JSON.stringify(value), 'utf8')
  } catch (err) {
    console.error(`Error cacheando ${key} en el almacenamiento:`, err)
  }
}
