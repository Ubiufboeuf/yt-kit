import { spawnAsync } from '../lib/spawnAsync'
import { cache } from '../cache/CacheManager'
import type { YtDlpFormat } from '../types/ytDlpFormatTypes'

/**
 * Obtiene todos los formatos de un video.
 * 
 * Aprovecha CacheManager para optimizar las peticiones recurrentes sobre el mismo video.
 * 
 * @param ytId ID del video
 * @returns Una lista con todos los formatos del video
 * 
 * @example
 * ```js
 * const formats = await getAllFormats(`dQw4w9WgXcQ`)
 * console.log(formats) // [{ id, resolution, ... }, ...]
 * ```
 */
export async function getAllFormats (ytId: string) {
  const args = ['--print', '%(formats)j', ytId]
  
  const cachedOutput = await cache.get(`formats:${ytId}`)
  let output: string = cachedOutput?.content ?? ''

  if (!output) {  
    let processOutput: unknown
    try {
      processOutput = await spawnAsync('yt-dlp', args)
    } catch (err) {
      console.error('Error consiguiendo el ID del formato')
      throw err
    }

    if (typeof processOutput !== 'string') {
      throw new Error('La salida del proceso es de tipo inválido (se esperaba string)')
    }

    output = processOutput
    
    cache.set(`formats:${ytId}`, {
      content: output
    })
  }

  let formats: YtDlpFormat[] = []
  try {
    formats = JSON.parse(output) as YtDlpFormat[]
  } catch (err) {
    console.error('Error convirtiendo la salida de yt-dlp a JSON')
    throw err
  }

  if (!Array.isArray(formats)) {
    const msg = 'Se esperaba que los formatos fuesen un array. Puede que el contenido cacheado esté corrupto o sea inválido.'
    throw new Error(msg)
  }

  return formats
}
