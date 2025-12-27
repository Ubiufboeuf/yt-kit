import { describe, expect, it } from 'bun:test'
import { cache } from '../src/cache/CacheManager'

describe('Cache Manager', () => {
  it('debería guardar y obtener un contenido cacheado', async () => {
    const mockCache = {
      content: 'content'
    }
    cache.set('key', mockCache)
    const result = await cache.get('key')
    
    expect(result).not.toBe(null)
    if (!result) return

    expect(result.content).toEqual(mockCache.content)
  })
})
