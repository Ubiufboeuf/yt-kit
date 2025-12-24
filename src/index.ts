// Funcionalidades del programa
export { downloadAudio, downloadVideo } from './tasks/download/download'
export { findFormatId } from './yt-dlp/findFormatId'

// Utilidades
export { formYoutubeUrl } from './lib/ytUtils'

// Tipos
export * from './types/videoTypes'
export * from './types/childProcessTypes'

// Constantes públicas (seguras de exportar)
export { STANDARD_RESOLUTIONS } from './lib/constants'
