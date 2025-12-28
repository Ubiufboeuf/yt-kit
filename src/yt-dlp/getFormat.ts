import { cache } from '../cache/CacheManager'
import type { YtDlpFormat } from '../types/ytDlpFormatTypes'
import { findFormatId } from './findFormatId'

export async function getFormat (ytId: string, formatId: string) {
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
