import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { CacheManager, config, timeToMs, type ValueToCache } from '../src'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { rm } from 'node:fs/promises'
import { readdir } from 'node:fs/promises'

describe('Cache Manager', () => {
  let tmpDir = ''
  
  beforeAll(async () => {
    if (tmpDir) return
    tmpDir = await mkdtemp(join(tmpdir(), 'cache-test-'), 'utf8')
  })

  beforeEach(async () => {
    const files = await readdir(tmpDir, {
      recursive: true
    })

    for (const file of files) {
      await rm(join(tmpDir, file), {
        force: true,
        recursive: true
      })
    }

    config.replace('cache', {
      cacheLocation: tmpDir,
      ignoreTTL: 'never',
      method: 'memory',
      ttlInMs: timeToMs(1, 'day')
    })
  })

  it('debería guardar y obtener un contenido cacheado', async () => {
    const cache = new CacheManager()
    
    const mockCache: ValueToCache = {
      content: 'content'
    }

    cache.set('key', mockCache)
    const result = await cache.get('key')
    
    expect(result).not.toBe(null)
    if (!result) return

    expect(result.content).toEqual(mockCache.content)
  })

  it('caché en disco y memoria deben ser diferentes', async () => {
    const cache = new CacheManager()
    
    config.add('cache', { method: 'memory' })
    await cache.set('a', { content: 'A' })

    config.add('cache', { method: 'disk' })
    const content = await cache.get('a')

    expect(content).toBeNull()
  })

  it('el método híbrido debe guardar en memoria y disco', async () => {
    const cache = new CacheManager()
    
    config.add('cache', {
      method: 'hybrid',
      // Guarda la caché en el archivo /tmp/[tmpDir]/check-hybrid-p
      cacheLocation: `${tmpDir}/hybrid-check-p`
    })

    // Asigna la clave "key" para la caché, aunque en disco el archivo se nombre diferente
    await cache.set('key', { content: 'A' })

    config.add('cache', { method: 'memory' })
    const fromMemory = await cache.get('key')

    config.add('cache', { method: 'disk' })
    const fromDisk = await cache.get('key')
    
    expect(fromDisk).toEqual(fromMemory)
  })

  it('el método híbrido debe buscar primero en memoria y luego en disco', async () => {
    const cache = new CacheManager()
    const toCacheInMemory = 'en memoria'

    config.add('cache', {
      method: 'hybrid',
      cacheLocation: `${tmpDir}/hybrid-check-q`
    })
    
    await cache.set('key', { content: 'content' })

    // Cambiar caché en memoria
    config.add('cache', { method: 'memory' })
    await cache.set('key', { content: toCacheInMemory })
    config.add('cache', { method: 'hybrid' })
    
    const fromMemory = await cache.get('key')
    const fromDisk = await cache.get('key')

    /* El método híbrido prioriza el uso de la memoria,
    incluso si su valor difiere del almacenamiento */
    
    expect(fromMemory?.content).toBe(toCacheInMemory)
    expect(fromDisk?.content).toBe(toCacheInMemory)
  })

  afterAll(async () => {
    await rm(tmpDir, { recursive: true })
  })
})
