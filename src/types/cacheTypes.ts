export type CacheKey =
| 'formats:${ytId}'
| (string & {})

export interface CachedData {
  content: string
  timestamp: number
}

export interface ValueToCache {
  content: string
}

export interface CacheConfig {
  method?: CacheMethod
  cacheLocation?: string
  ttlInMs?: number
}

export type CacheMethod = 'memory' | 'disk' | 'hybrid'
