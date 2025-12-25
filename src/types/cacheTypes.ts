export interface CachedData {
  content: string
  timestamp: number
}

export interface ValueToCache {
  content: string
}

export interface CacheConfig {
  method: CacheMethod
  cacheLocation?: string
}

export type CacheMethod = 'memory' | 'disk' | 'hybrid'
