import { rm } from 'node:fs/promises'
import type { CacheKey } from '../types/cacheTypes'
import { getKeyPath } from '../lib/getKeyPath'

// Esta función es solo para caché
export async function removeFromDisk (key: CacheKey) {
  const cachePath = getKeyPath(key)
  if (!cachePath) return

  try {
    await rm(cachePath)
  } catch (err) {
    console.error(`Error borrando la caché de ${key} en el almacenamiento:`, err)
  }
}
