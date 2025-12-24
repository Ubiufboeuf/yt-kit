import type { CacheMethod } from '../config/cache'

export type ConfigKey = keyof ConfigMap
export type ConfigValue<T extends ConfigKey> = ConfigMap[T]

export type ConfigMap = {
  'cache:formats': CacheConfig
}

export interface CacheConfig {
  method: CacheMethod
  cacheLocation?: string
}
