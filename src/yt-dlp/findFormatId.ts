import type { FormatsToFind } from '../types/videoTypes'
import type { YtDlpFormat } from '../types/ytDlpFormatTypes'
import { getBetterFormat, getWorstFormat } from '../lib/compareFormats'
import { spawnAsync } from '../lib/spawnAsync'
import { formYoutubeUrl } from '../lib/ytUtils'
import { cache } from '../cache/CacheManager'

export async function findFormatId (ytId: string, formatToFind: FormatsToFind) {
  const url = formYoutubeUrl(ytId)
  const formatsCacheKey = `formats-${ytId}`

  const isSpecificResolution = Boolean(formatToFind.match(/\d/))
  let foundSpecific = isSpecificResolution ? false : 'N/A'

  const args = ['--print', '%(formats)j', url]
  
  const cachedOutput = cache.get(formatsCacheKey)
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
    
    cache.set(formatsCacheKey, {
      content: output,
      timestamp: Date.now()
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
    throw new Error('Se esperaba un array')
  }

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
    formatId: desiredFormat?.format_id,
    desiredFormat
  }
}
