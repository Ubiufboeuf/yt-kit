import { describe, it, expect } from 'bun:test'
import { config } from '../src/config/Configuration'
import type { CacheConfig } from '../src/types/configTypes'

describe('Config Manager', () => {
  it('debería guardar y recuperar la configuración de caché', () => {
    const mockConfig: CacheConfig = {
      method: 'disk',
      cacheLocation: '~/.cache/yt-kit/formats'
    }

    config.set('cache:formats', mockConfig)
    const result = config.get('cache:formats')

    expect(result).toEqual(mockConfig)
  })
})
