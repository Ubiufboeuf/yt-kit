import type { FormatsToFind } from '../types/videoTypes'
import type { YtDlpFormat } from '../types/ytDlpFormatTypes'
import { getBetterFormat, getWorstFormat } from '../lib/compareFormats'
import { getAllFormats } from './getAllFormats'

/**
 * Devuelve el ID del formato deseado del video especificado.
 * 
 * Aprovecha `CacheManager` para optimizar las peticiones recurrentes sobre el mismo video.
 * 
 * @param ytId ID del video
 * @param formatToFind Formato para buscar (360p, 1080p, best-video)
 * @returns Una promesa que resuelve en un objeto con `foundSpecific` y `formatId`
 * 
 * @example
 * ```js
 * const format = await findFormatId('dQw4w9WgXcQ', 'best-audio')
 * console.log(format) // { foundSpecific: boolean, formatId: string | undefined }
 * ```
 */
export async function findFormatId (ytId: string, formatToFind: FormatsToFind) {
  const isSpecificResolution = Boolean(formatToFind.match(/\d/))
  let foundSpecific = isSpecificResolution ? false : 'N/A'

  const formats = await getAllFormats(ytId)

  let bestVideo: YtDlpFormat | undefined = undefined
  let worstVideo: YtDlpFormat | undefined = undefined
  let bestAudio: YtDlpFormat | undefined = undefined
  let worstAudio: YtDlpFormat | undefined = undefined
  let desiredFormat: YtDlpFormat | undefined = undefined

  for (const format of formats) {
    const audioOnly = format.resolution === 'audio only'
    
    if (isSpecificResolution && format.format_note === formatToFind) {
      foundSpecific = true
      desiredFormat = getBetterFormat(desiredFormat, format, { compareResolution: false, type: 'video' }) ?? format
      continue
    }
    
    if (audioOnly) {
      bestAudio = getBetterFormat(bestAudio, format, { compareResolution: false, type: 'audio' }) ?? format
      worstAudio = getWorstFormat(worstAudio, format, { compareResolution: false, type: 'audio' }) ?? format
    } else {
      bestVideo = getBetterFormat(bestVideo, format, { compareResolution: true, type: 'video' }) ?? format
      worstVideo = getWorstFormat(worstVideo, format, { compareResolution: true, type: 'video' }) ?? format
    }
  }

  if (!isSpecificResolution) {
    const formats = {
      'best-video': bestVideo,
      'worst-video': worstVideo,
      'best-audio': bestAudio,
      'worst-audio': worstAudio
    } as const

    desiredFormat = formats[formatToFind as keyof typeof formats]
  }
  
  return {
    foundSpecific,
    formatId: desiredFormat?.format_id
  }
}
