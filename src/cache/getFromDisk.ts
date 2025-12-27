import { readFile } from 'node:fs/promises'
import type { CachedData, CacheKey } from '../types/cacheTypes'
import { getKeyPath } from '../lib/getKeyPath'

// Esta función es solo para caché
export async function getFromDisk (key: CacheKey): Promise<CachedData | undefined> {
  const cachePath = getKeyPath(key)
  if (!cachePath) return

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
