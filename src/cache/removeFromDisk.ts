import { rm } from 'node:fs/promises'
import { config } from '../config/Configuration'
import { resolvePath } from '../lib/resolvePath'
import type { CacheKey } from '../types/cacheTypes'

// Esta función es solo para caché
export async function removeFromDisk (key: CacheKey) {
  const cacheLocation = config.get('cache')?.cacheLocation
  if (!cacheLocation) return

  const cachePath = resolvePath(cacheLocation)

  try {
    await rm(cachePath)
  } catch (err) {
    console.error(`Error borrando la caché de ${key} en el almacenamiento:`, err)
  }
}
