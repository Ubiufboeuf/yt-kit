import type { Downloader, DownloadTasksOptions, DownloadResult } from '../interfaces/Downloader'
import { spawnAsync } from '../lib/spawnAsync'
import { resolveFilenamePattern } from '../lib/resolveFilenamePattern'
import { parseDownloadOutput } from '../lib/parseDownloadOutput'
import { DOWNLOAD_MARKERS } from '../lib/constants'

const { endMarker, startMarker } = DOWNLOAD_MARKERS

export class YtDlpDownloader implements Downloader {
  async download (ytId: string, options: DownloadTasksOptions): Promise<DownloadResult> {
    const args = this.buildYtDlpArgs(ytId, options)
    
    const output = await spawnAsync('yt-dlp', args, true)
    const result = parseDownloadOutput(output, options.simulate)

    return result
  }

  private buildYtDlpArgs (ytId: string, options: DownloadTasksOptions) {
    const { id, type, simulate } = options
    const isVideo = type === 'video'
    
    const hook = simulate ? 'video' : 'after_move'
    const mustSimulate = options.simulate
      ? '--simulate'
      : '--no-simulate'

    const exportRoute = options.outputDir
    const exportName = resolveFilenamePattern({ filename: options.filename, id: options.id, ytId })
    const audioFormat = 'aac'
    const audioFormatPreferences = isVideo
      ? []
      : ['-x', '--audio-format', audioFormat]
      
    const printDetails = [
      '--newline',
      '--progress',
      '--no-quiet',
      '--print',
      `${hook}:${startMarker}{"type":"download:result","status":"success","path":"%(filepath)s","id":%(id)j,"ext":%(ext)j,"title":%(title)j,"size":%(filesize_approx)s}${endMarker}`
    ]

    const args = [
      '-f', id,
      mustSimulate,
      ...printDetails,
      ...audioFormatPreferences,
      '-o', exportName,
      '-P', exportRoute,
      ytId
    ]

    return args
  }
}
