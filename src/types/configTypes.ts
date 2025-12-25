import type { CacheConfig } from './cacheTypes'

export type ConfigKey = keyof ConfigMap
export type ConfigValue<T extends ConfigKey> = ConfigMap[T]

export type ConfigMap = {
  'cache:formats': CacheConfig
}
