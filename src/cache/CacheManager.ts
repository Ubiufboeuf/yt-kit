import { timeToMs } from '../lib/timeUtils'
import type { CachedData, ValueToCache } from '../types/cacheTypes'

export class CacheManager {
  private store = new Map<string, CachedData>()
  private defaultTtl = timeToMs(10, 'day')
  
  get (key: string) {
    const item = this.store.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > this.defaultTtl) {
      this.delete(key)
      return null
    }

    return item
  }

  set (key: string, value: ValueToCache) {
    this.store.set(key, {
      ...value,
      timestamp: Date.now()
    })
  }

  delete (key: string) {
    this.store.delete(key)
  }
}

export const cache = new CacheManager()
