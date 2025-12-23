import type { STANDARD_RESOLUTIONS } from '../lib/constants'

export type Height = typeof STANDARD_RESOLUTIONS[number]
export type Resolution = `${Height}p`

export type FormatsToFind =
  Resolution
| 'best-video'
| 'worst-video'
| 'best-audio'
| 'worst-audio'

export type MediaType = 'audio' | 'video'
