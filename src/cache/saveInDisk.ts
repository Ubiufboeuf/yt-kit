import { mkdir, writeFile } from 'node:fs/promises'
import type { CachedData, CacheKey } from '../types/cacheTypes'
import { dirname } from 'node:path'
import { getKeyPath } from '../lib/getKeyPath'

/**
 * Cachea datos en el almacenamiento.
 * 
 * Esta función está pensada sólo para caché, no para guardar datos arbitrarios en disco.
 * 
 * @param key Clave de caché. Usado para darle nombre al archivo con la caché.
 * @param value Valor para cachear.
 */
export async function saveInDisk (key: CacheKey, value: CachedData) {
const cachePath = getKeyPath(key)
  if (!cachePath) return

  const cacheDir = dirname(cachePath)

  try {
    mkdir(cacheDir, { recursive: true })
  } catch {
    console.error(`Error creando la carpeta para guardar ${key}`)
  }

  try {
    await writeFile(cachePath, JSON.stringify(value, null, 2), 'utf8')
  } catch {
    console.error(`Error cacheando "${key}" en el almacenamiento`)
  }
}
