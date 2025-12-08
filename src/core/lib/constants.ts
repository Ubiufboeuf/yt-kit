export const STANDARD_RESOLUTIONS = [18, 144, 240, 360, 480, 720, 1080, 1440, 2160] as const

export const COMMANDS = {
  'yt-dlp': 'yt-dlp-linux'
} as const

const KWD = '/home/mango/Dev/yt-media-kit' as const // KWD: [K]it [W]orking [D]irectory

export const RUTAS = {
  VIDEOS_DESCARGADOS: `${KWD}/storage/videos_descargados`,
  AUDIOS_DESCARGADOS: `${KWD}/storage/audios_descargados`
} as const
