import type { Processor, MultiplexingOptions } from '../interfaces/Processor'
import { parseJson } from '../lib/parseJson'
import { resolvePath } from '../lib/resolvePath'
import { spawnAsync, type SpawnOptions } from '../lib/spawnAsync'

interface FFmpegVideoEntryCheck {
  streams: {
    codec_type: 'video' | 'audio' | (string & {})
  }[]
}

export class FFmpegProcessor implements Processor {
  async mux (options: MultiplexingOptions) {
    const { video, audios } = options
    
    const videoCheck = await spawnAsync('ffprobe', this.buildCheckEntriesArgs(video))
    const [videoOutput] = parseJson(videoCheck)
    const hasVideoEntry = (videoOutput as FFmpegVideoEntryCheck).streams.some((s) => s.codec_type === 'video')

    if (!hasVideoEntry) {
      throw new Error(`No se encontró ninguna entrada de video en el archivo de ruta: ${video}`)
    }

    if (!Array.isArray(audios)) {
      throw new Error('La lista de audios debe ser un array')
    }

    if (!audios.length) {
      throw new Error('No hay audios para mezclar')
    }

    const validAudios: string[] = []
    
    for (const audio of audios) {
      const audioPath = resolvePath(audio)

      const audioCheck = await spawnAsync('ffprobe', this.buildCheckEntriesArgs(audioPath))
      const [audioOutput] = parseJson(audioCheck)
      const hasAudioEntry = (audioOutput as FFmpegVideoEntryCheck).streams.some((s) => s.codec_type === 'audio')

      if (!hasAudioEntry) continue

      validAudios.push(audio)
    }

    const args = this.buildMuxArgs(video, validAudios, options)
    const spawnOptions: SpawnOptions = {
      showOutput: false
    }

    await spawnAsync('ffmpeg', args, spawnOptions)
  }

  buildCheckEntriesArgs (filePath: string) {
    const args = [
      '-v', 'error',
      '-show_entries', 'stream=codec_type',
      '-of', 'json',
      resolvePath(filePath)
    ]

    return args
  }

  buildMuxArgs (videoPath: string, validAudios: string[], options: Partial<MultiplexingOptions>): string[] {
    const { slug, outputDir, container } = options

    let input = 0
    
    const args = [
      '-y',
      '-i', `${videoPath}`,
      ...validAudios.flatMap((path) => ['-i', `${path}`]),
      '-map', '0:v',
      ...validAudios.flatMap(() => ['-map', `${++input}:a`]),
      '-c', 'copy',
      '-shortest',
      resolvePath(`${outputDir}/${slug}.${container}`)
    ]

    return args
  }
}
