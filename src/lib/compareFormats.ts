import type { MediaType } from '../types/videoTypes'
import type { YtDlpFormat } from '../types/ytDlpFormatTypes'

interface CompareParams {
  a: YtDlpFormat
  b: YtDlpFormat
  type: MediaType
  compareResolution: boolean
}

interface CompareOptions {
  type: MediaType,
  compareResolution: boolean
}

function compareFormats ({ a, b, compareResolution, type }: CompareParams) {
  const canCompareQuality = (type === 'video') && compareResolution && (a.quality !== null) && (b.quality !== null)
  const canCompareResolution = (type !== 'audio') && compareResolution && (a.height !== null) && (b.height !== null)
  const canCompareFps = (type === 'video') && (a.fps !== null) && (b.fps !== null)
  const canCompareAsr = (type === 'audio') && (a.asr !== null) && (b.asr !== null)
  const canCompareTbr = (a.tbr !== null) && (b.tbr !== null)
  
  let aScore = 0
  let bScore = 0

  if (canCompareQuality) {
    if ((a.quality ?? 0) > (b.quality ?? 0)) aScore += 3
    else if ((a.quality ?? 0) < (b.quality ?? 0)) bScore += 3
  }

  if (canCompareResolution) {
    if ((a.height ?? 0) > (b.height ?? 0)) aScore += 3
    else if ((a.height ?? 0) < (b.height ?? 0)) bScore += 3
  }

  if (canCompareFps) {
    if ((a.fps ?? 0) > (b.fps ?? 0)) aScore += 2
    else if ((a.fps ?? 0) < (b.fps ?? 0)) bScore += 2
  }

  if (canCompareAsr) {
    if ((a.asr ?? 0) > (b.asr ?? 0)) aScore += 2
    else if ((a.asr ?? 0) < (b.asr ?? 0)) bScore += 2
  }

  if (canCompareTbr) {
    if ((a.tbr ?? 0) > (b.tbr ?? 0)) aScore += 1
    else if ((a.tbr ?? 0) < (b.tbr ?? 0)) bScore += 1
  }

  return { aScore, bScore }
}

/**
 * Compara dos formatos y devuelve el mejor.
 * 
 * Soporta un objeto para opciones, con `type` y `compareResolution`.
 * 
 * @param a Formato A
 * @param b Formato B
 * @param object
 * * `type`: Tipo de multimedia: `video` / `audio` / `sb` (storyboard).
 * * `compareResolution`: Si debe comparar la resolución del video. No sirve con audios.
 * 
 * @returns `a|b` El mejor formato entre A y B
 */
export function getBetterFormat (a: YtDlpFormat | undefined, b: YtDlpFormat | undefined, { type, compareResolution }: CompareOptions) {
  if (!a || !b) return

  const { aScore, bScore } = compareFormats({ a, b, type, compareResolution })

  return aScore > bScore ? a : b
}

/**
 * Compara dos formatos y devuelve el peor.
 * 
 * Soporta un objeto para opciones, con `type` y `compareResolution`.
 * 
 * @param a Formato A
 * @param b Formato B
 * @param object
 * * `type`: Tipo de multimedia: `video` / `audio` / `sb` (storyboard).
 * * `compareResolution`: Si debe comparar la resolución del video. No sirve con audios.
 * 
 * @returns `a|b` El peor formato entre A y B
 */
export function getWorstFormat (a: YtDlpFormat | undefined, b: YtDlpFormat | undefined, { type, compareResolution }: CompareOptions) {
  if (!a || !b) return

  const { aScore, bScore } = compareFormats({ a, b, type, compareResolution })

  return aScore > bScore ? b : a
}
