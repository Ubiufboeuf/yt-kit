import type { CacheKey } from '../types/cacheTypes'

export function isValidCacheKey (key: CacheKey): boolean {
  if (typeof key !== 'string') return false

  return true
}
