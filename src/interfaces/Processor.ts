import type { VideoContainer } from '../types/mediaTypes'

export interface Processor {
  mux (options: MultiplexingOptions): Promise<unknown>
}

export interface MultiplexingOptions {
  video: string
  audios: string[]
  container?: VideoContainer | (string & {})
  slug?: string
  outputDir?: string
}
