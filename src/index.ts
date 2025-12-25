// Modelos
export { CacheManager } from './cache/CacheManager'
export { Configuration } from './config/Configuration'

// Funcionalidades del programa
export { downloadAudio, downloadVideo } from './tasks/download/download'
export { findFormatId } from './yt-dlp/findFormatId'

// Utilidades
export { formYoutubeUrl } from './lib/ytUtils'

// Tipos
export type * from './types/videoTypes'
export type * from './types/childProcessTypes'
export type * from './types/configTypes'

// Constantes públicas (seguras de exportar)
export { STANDARD_RESOLUTIONS } from './lib/constants'

