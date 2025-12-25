export type ConfigKey = keyof ConfigMap
export type ConfigValue<T extends ConfigKey> = ConfigMap[T]

export type ConfigMap = {
  'cache:formats': CacheConfig
}

export interface CacheConfig {
  method: CacheMethod
  cacheLocation?: string
}

export type CacheMethod = 'memory' | 'disk' | 'hybrid'
