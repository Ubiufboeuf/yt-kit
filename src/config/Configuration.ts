import type { ConfigKey, ConfigValue } from '../types/configTypes'
import { defaultConfig } from './DefaultConfiguration'

export class Configuration {
  private store = new Map<ConfigKey, unknown>(defaultConfig)

  get<K extends ConfigKey> (key: K) {
    const item = this.store.get(key)
    if (!item) return null

    return item as ConfigValue<K>
  }

  add<K extends ConfigKey> (key: K, value: ConfigValue<K>) {
    const prevConfig = this.store.get(key) ?? {}
    this.store.set(key, { ...prevConfig, ...value })
  }

  replace<K extends ConfigKey> (key: K, value: ConfigValue<K>) {
    this.store.set(key, value)
  }

  delete<K extends ConfigKey> (key: K) {
    this.store.delete(key)
  }
}

export const config = new Configuration()
