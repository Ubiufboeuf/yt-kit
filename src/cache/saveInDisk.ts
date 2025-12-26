import { mkdir, writeFile } from 'node:fs/promises'
import type { CachedData, CacheKey } from '../types/cacheTypes'
import { config } from '../config/Configuration'
import { resolvePath } from '../lib/resolvePath'
import { dirname } from 'node:path'

// Esta función es solo para caché
export async function saveInDisk (key: CacheKey, value: CachedData) {
  const cacheLocation = config.get('cache')?.cacheLocation
  if (!cacheLocation) return

  const cachePath = resolvePath(cacheLocation)
  const cacheDir = dirname(cachePath)

  try {
    mkdir(cacheDir, { recursive: true })
    await writeFile(cachePath, JSON.stringify(value), 'utf8')
  } catch (err) {
    console.error(`Error cacheando ${key} en el almacenamiento:`, err)
  }
}
