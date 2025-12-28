import { config } from '../config/Configuration'
import { timeToMs } from '../lib/timeUtils'
import type { CachedData, CacheKey, ValueToCache } from '../types/cacheTypes'
import { isValidCacheKey } from '../validations/cache'
import { getFromDisk } from './getFromDisk'
import { removeFromDisk } from './removeFromDisk'
import { saveInDisk } from './saveInDisk'

export class CacheManager {
  private store = new Map<CacheKey, CachedData>()
  private ttl = config.get('cache')?.ttlInMs ?? timeToMs(10, 'day')
  
  async get (key: CacheKey) {
    if (!isValidCacheKey(key)) {
      throw new Error('CacheKey inválida', { cause: key })
    }

    const cacheMethod = config.get('cache')?.method ?? 'memory'
    let item = null

    if (cacheMethod === 'memory') item = this.store.get(key)
    if (cacheMethod === 'disk') item = await getFromDisk(key)
    if (cacheMethod === 'hybrid') {
      item = this.store.get(key)
      if (!item) item = await getFromDisk(key)
    }

    if (!item) return null

    if (Date.now() - item.timestamp > this.ttl) {
      await this.delete(key)
      return null
    }

    return item
  }

  async set (key: CacheKey, value: ValueToCache) {
    if (!isValidCacheKey(key)) {
      throw new Error('CacheKey inválida', { cause: key })
    }

    const cacheMethod = config.get('cache')?.method ?? 'memory'
    const valueToSave = {
      ...value,
      timestamp: Date.now()
    }

    if (cacheMethod === 'memory') this.store.set(key, valueToSave)
    if (cacheMethod === 'disk') await saveInDisk(key, valueToSave)
    if (cacheMethod === 'hybrid') {
      this.store.set(key, valueToSave)
      await saveInDisk(key, valueToSave)
    }
  }

  async delete (key: CacheKey) {
    const cacheMethod = config.get('cache')?.method
    if (cacheMethod === 'memory') this.store.delete(key)
    if (cacheMethod === 'disk') await removeFromDisk(key)
    if (cacheMethod === 'hybrid') {
      this.store.delete(key)
      await removeFromDisk(key)
    }
  }
}

export const cache = new CacheManager()
