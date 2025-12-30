import { timeToMs } from '../lib/timeUtils'
import type { CacheConfig } from '../types/cacheTypes'
import type { Commands } from '../types/commandsTypes'
import type { ConfigKey } from '../types/configTypes'

const defaultCacheConfig: CacheConfig = {
  cacheLocation: undefined,
  ignoreTTL: undefined,
  method: 'memory',
  ttlInMs: timeToMs(10, 'day')
}

const defaultCommandsConfig: Commands = {
  'yt-dlp': 'yt-dlp'
}

export const defaultConfig = new Map<ConfigKey, unknown>([
  ['cache', defaultCacheConfig],
  ['commands', defaultCommandsConfig]
])
