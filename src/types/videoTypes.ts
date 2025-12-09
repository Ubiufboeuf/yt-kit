import type { STANDARD_RESOLUTIONS } from '@core/lib/constants'

export type Height = typeof STANDARD_RESOLUTIONS[number]
export type Resolution = `${Height}p`
