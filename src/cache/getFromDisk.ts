import { readFile } from 'node:fs/promises'
import type { CachedData, CacheKey } from '../types/cacheTypes'
import { config } from '../config/Configuration'
import { resolvePath } from '../lib/resolvePath'

// Esta función es solo para caché
export async function getFromDisk (key: CacheKey, json = false): Promise<CachedData | undefined> {
  const cacheLocation = config.get('cache')?.cacheLocation
  if (!cacheLocation) return

  const cachePath = resolvePath(cacheLocation)

  let content
  try {
    content = await readFile(cachePath, 'utf8')
  } catch (err) {
    console.error(`Error leyendo la caché en el almacenamiento para ${key} :`, err)
  }

  if (json && content) {
    try {
      content = JSON.parse(content)
    } catch (err) {
      console.error(`Error convirtiendo la caché de ${key} a JSON:`, err)
    }
  }

  if (!content) return
  
  return {
    content: json
      ? content.content
      : content,
    timestamp: Date.now()
  }
}
