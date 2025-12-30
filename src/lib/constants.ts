export const STANDARD_RESOLUTIONS = [18, 144, 240, 360, 480, 720, 1080, 1440, 2160] as const

export const DEFAULT_FILENAME = '%(ytId)s.%(ext)s'
export const PATTERNS = {
  ID: '%(id)s',
  YT_ID: '%(ytId)s'
} as const
