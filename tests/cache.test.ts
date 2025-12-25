import { describe, expect, it } from 'bun:test'
import { cache } from '../src/cache/CacheManager'
import { findFormatId } from '../src'
import { timeToMs } from '../src/lib/timeUtils'

describe('Cache Manager', () => {
  it('debería guardar y obtener un contenido cacheado', () => {
    const mockCache = {
      content: 'content'
    }
    cache.set('key', mockCache)
    const result = cache.get('key')
    
    expect(result).not.toBe(null)
    if (!result) return

    expect(result).toEqual({
      ...mockCache,
      timestamp: result.timestamp
    })
  })
})

describe('Process with cache', () => {
  const ytId = 'wKVJi-FLvak'

  it('debería cachear los formatos para que la segunda vez sea más rápido', async () => {
    // Conseguir un video para guardar los formatos en caché
    await findFormatId(ytId, 'best-video')

    // Comprueba los datos cacheados
    const cachedFormats = cache.get(`formats-${ytId}`)

    expect(cachedFormats).toBeDefined()
    expect(cachedFormats?.timestamp).toBeNumber()
    expect(cachedFormats?.content).toBeString()

    // Probar la caché con un audio
    const start = Date.now()
    await findFormatId(ytId, 'worst-audio')
    const end = Date.now()

    // Verificar si se usó la caché
    expect(end - start).toBeLessThan(100)
  }, timeToMs(15, 'sec'))
})
