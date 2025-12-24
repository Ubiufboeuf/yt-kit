import { cache, type CachedData } from './CacheManager'

export function saveInCache (key: string, value: CachedData) {
  return cache.set(key, value)
}
