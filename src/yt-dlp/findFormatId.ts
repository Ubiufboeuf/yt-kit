import type { FormatsToFind } from '../types/videoTypes'
import type { YtDlpFormat } from '../types/ytDlpFormatTypes'
import { getBetterFormat, getWorseFormat } from '../lib/compareFormats'
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
  let bestStoryboard: YtDlpFormat | undefined = undefined
  let worstStoryboard: YtDlpFormat | undefined = undefined
  let desiredFormat: YtDlpFormat | undefined = undefined

  for (const format of formats) {
    const audioOnly = format.resolution === 'audio only'
    const isStoryboard = format.format_note === 'storyboard'
    
    if (isSpecificResolution && format.format_note === formatToFind) {
      foundSpecific = true
      desiredFormat = getBetterFormat(desiredFormat, format, { compareResolution: false, type: 'video' }) ?? format
      continue
    }
    
    if (audioOnly) {
      bestAudio = getBetterFormat(bestAudio, format, { compareResolution: false, type: 'audio' }) ?? format
      worstAudio = getWorseFormat(worstAudio, format, { compareResolution: false, type: 'audio' }) ?? format
    } else if (isStoryboard) {
      bestStoryboard = getBetterFormat(bestStoryboard, format, { compareResolution: false, type: 'sb' }) ?? format
      worstStoryboard = getWorseFormat(worstStoryboard, format, { compareResolution: false, type: 'sb' }) ?? format
    } else {
      bestVideo = getBetterFormat(bestVideo, format, { compareResolution: true, type: 'video' }) ?? format
      worstVideo = getWorseFormat(worstVideo, format, { compareResolution: true, type: 'video' }) ?? format
    }
  }

  if (!isSpecificResolution) {
    const formats = {
      'best-video': bestVideo,
      'worst-video': worstVideo,
      'best-audio': bestAudio,
      'worst-audio': worstAudio,
      'best-storyboard': bestStoryboard,
      'worst-storyboard': worstStoryboard
    } as const

    desiredFormat = formats[formatToFind as keyof typeof formats]
  }
  
  return {
    foundSpecific,
    formatId: desiredFormat?.format_id
  }
}
