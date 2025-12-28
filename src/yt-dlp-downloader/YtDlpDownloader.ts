import type { Downloader, DownloadTasksOptions, DownloadResult } from '../interfaces/Downloader'
import { spawnAsync } from '../lib/spawnAsync'
import { resolveFilenamePattern } from '../lib/resolveFilenamePattern'

export class YtDlpDownloader implements Downloader {
  async download (ytId: string, options: DownloadTasksOptions): Promise<DownloadResult> {
    const args = this.buildYtDlpArgs(ytId, options)

    // const result = await spawnAsync('yt-dlp', args, true)
    await spawnAsync('yt-dlp', args, true)

    return {
      duration: -1,
      path: 'unknown'
    }
  }

  private buildYtDlpArgs (ytId: string, options: DownloadTasksOptions) {
    const { id, type } = options
    const isVideo = type === 'video'
    
    const exportRoute = options.outputDir
    const exportName = resolveFilenamePattern({ filename: options.filename, id: options.id, ytId })
    const audioFormat = 'aac'
    const audioFormatPreferences = isVideo
      ? []
      : ['-x', '--audio-format', audioFormat]

    const args = [
      '-f', id,
      ...audioFormatPreferences,
      '-o', exportName,
      '-P', exportRoute,
      ytId
    ]

    return args
  }
}
