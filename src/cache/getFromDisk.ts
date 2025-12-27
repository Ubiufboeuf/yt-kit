import { readFile } from 'node:fs/promises'
import type { CachedData, CacheKey } from '../types/cacheTypes'
import { config } from '../config/Configuration'
import { resolvePath } from '../lib/resolvePath'
import { join } from 'node:path'

// Esta función es solo para caché
export async function getFromDisk (key: CacheKey): Promise<CachedData | undefined> {
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

  let content
  try {
    content = await readFile(cachePath, 'utf8')
  } catch { /* empty */ }

  if (content) {
    try {
      content = JSON.parse(content)
    } catch (err) {
      console.error(`Error convirtiendo la caché de ${key} a JSON:`, err)
    }
  }

  if (!content) return
  
  return content
}
