import { cache } from '../cache/CacheManager'
import type { YtDlpFormat } from '../types/ytDlpFormatTypes'
import { findFormatId } from './findFormatId'

/**
 * Obtiene la información completa del formato de un video.
 * 
 * Aprovecha `CacheManager` para optimizar las peticiones recurrentes sobre el mismo video.
 * 
 * @param ytId ID del video
 * @param formatId ID del formato
 * @returns Una promesa que resuelve en un objeto con todos los datos del formato
 * 
 * @example
 * ```js
 * // Ejemplo A
 * const format = await getFormat(`dQw4w9WgXcQ`, '394')
 * console.log(format) // { id, resolution, ... }
 * 
 * // Ejemplo B (aprovechando findFormatId())
 * const { formatId } = await findFormatId(`dQw4w9WgXcQ`, '480p')
 * if (formatId) {
 *   const format = await getFormat(`dQw4w9WgXcQ`, formatId)
 *   console.log(format) // { id, resolution, ... }
 * }
 * ```
 */
export async function getFormat (ytId: string, formatId: string | number | undefined) {
  if (!formatId) return
  
  const cachedFormats = await cache.get(`formats:${ytId}`)
  let formatsStr = cachedFormats?.content

  if (!formatsStr) {
    await findFormatId(ytId, 'best-video')
    const cachedFormats = await cache.get(`formats:${ytId}`)
    formatsStr = cachedFormats?.content
  }

  let formats: YtDlpFormat[] | string | undefined = undefined
  try {
    formats = JSON.parse(formatsStr ?? '')
  } catch (err) {
    console.error('Error convirtiendo los formatos a JSON:', err)
  }

  if (typeof formats === 'string' || !formats) {
    throw new Error('No se pudieron conseguir los formatos correctamente')
  }

  const format = formats.find((f) => f.format_id === formatId)
  return format
}
