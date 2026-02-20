import { FFmpegProcessor } from '../../ffmpeg-processor/FFmpegProcessor'
import type { MultiplexingOptions } from '../../interfaces/Processor'
import { basename, extname } from 'node:path'
import { resolvePath } from '../../lib/resolvePath'

export async function mux (options: MultiplexingOptions) {
  const { video, audios } = options
  if (!video || audios.length === 0) return

  const taskOptions = formProcessTaskOptions(options)
  
  return new FFmpegProcessor().mux(taskOptions)
}

function formProcessTaskOptions (options: MultiplexingOptions): MultiplexingOptions {
  const { video, audios } = options
  const videoSlug = basename(video, extname(video))

  const taskOptions: MultiplexingOptions = {
    video,
    audios,
    container: options.container ?? 'mp4',
    slug: options?.slug ?? `av-${videoSlug}`,
    outputDir: resolvePath(options?.outputDir ?? './')
  }

  return taskOptions
}
