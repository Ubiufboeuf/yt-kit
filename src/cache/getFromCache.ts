import { cache } from './CacheManager'

export function getFromCache (key: string) {
  return cache.get(key)
}
