import type { FormatsToFind } from '../types/videoTypes'
import type { YtDlpFormat } from '../types/ytDlpFormatTypes'
import { getBetterFormat, getWorstFormat } from '../lib/compareFormats'
import { getAllFormats } from './getAllFormats'

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
