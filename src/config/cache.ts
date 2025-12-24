export const CACHE_METHOD = {
  HYBRID: ['memory', 'disk'],
  SESSION: ['memory'],
  PERSISTENT: ['disk']
} as const

export type CacheMethod = typeof CACHE_METHOD[keyof typeof CACHE_METHOD]
