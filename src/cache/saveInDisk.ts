import { mkdir, writeFile } from 'node:fs/promises'
import type { CachedData, CacheKey } from '../types/cacheTypes'
import { dirname } from 'node:path'
import { getKeyPath } from '../lib/getKeyPath'

// Esta función es solo para caché
export async function saveInDisk (key: CacheKey, value: CachedData) {
const cachePath = getKeyPath(key)
  if (!cachePath) return

  const cacheDir = dirname(cachePath)

  try {
    mkdir(cacheDir, { recursive: true })
    await writeFile(cachePath, JSON.stringify(value), 'utf8')
  } catch (err) {
    console.error(`Error cacheando ${key} en el almacenamiento:`, err)
  }
}
