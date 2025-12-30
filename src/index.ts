// Modelos
export { CacheManager } from './cache/CacheManager'
export { Configuration } from './config/Configuration'

// Instancias
export { config } from './config/Configuration'
export { cache } from './cache/CacheManager'

// Funcionalidades del programa
export { downloadAudio, downloadVideo } from './tasks/download/download'
export { findFormatId } from './yt-dlp/findFormatId'
export { getFromDisk } from './cache/getFromDisk'
export { saveInDisk } from './cache/saveInDisk'

// Helpers y utilidades
export { formYoutubeUrl } from './lib/ytUtils' // Se mantiene para no crear un breaking change todavía
export { getBetterFormat, getWorstFormat } from './lib/compareFormats'
export { resolveFilenamePattern } from './lib/resolveFilenamePattern'
export { expandPattern } from './lib/expandPattern'
export { resolvePath } from './lib/resolvePath'

// Tipos
export type * from './types/videoTypes'
export type * from './types/childProcessTypes'
export type * from './types/configTypes'
export type * from './types/cacheTypes'
export type * from './types/commandsTypes'
export type { Pattern, PatternData } from './lib/expandPattern'

// Constantes públicas (seguras de exportar)
export { STANDARD_RESOLUTIONS } from './lib/constants'
