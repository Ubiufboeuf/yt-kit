import type { ConfigKey, ConfigValue } from '../types/configTypes'

export class Configuration {
  private store = new Map<ConfigKey, unknown>()
  
  get<K extends ConfigKey> (key: K) {
    const item = this.store.get(key)
    if (!item) return null

    return item as ConfigValue<K>
  }

  set<K extends ConfigKey> (key: K, value: ConfigValue<K>) {
    this.store.set(key, value)
  }

  delete<K extends ConfigKey> (key: K) {
    this.store.delete(key)
  }
}

export const config = new Configuration()
