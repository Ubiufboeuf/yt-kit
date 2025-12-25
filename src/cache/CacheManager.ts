import { timeToMs } from '../lib/timeUtils'

export interface CachedData {
  content: string
  timestamp: number
}

export interface ValueToCache {
  content: string
}

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
