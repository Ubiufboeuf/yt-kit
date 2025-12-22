import type { Downloader, DownloadTasksOptions, DownloadResult } from '../interfaces/Downloader'
import { spawnAsync } from '../lib/spawnAsync'
import { resolveFilename } from '../lib/resolveFilename'

export class YtDlpDownloader implements Downloader {
  async download (url: string, ytId: string, options: DownloadTasksOptions): Promise<DownloadResult> {
    const args = this.buildYtDlpArgs(url, ytId, options)

    // const result = await spawnAsync('yt-dlp', args, true)
    await spawnAsync('yt-dlp', args, true)

    return {
      duration: -1,
      path: 'unknown'
    }
  }

  private buildYtDlpArgs (url: string, ytId: string, options: DownloadTasksOptions) {
    const { id, type } = options
    const isVideo = type === 'video'
    
    const exportRoute = options.outputPath
    const exportName = resolveFilename({ filename: options.filename, id: options.id, ytId })
    const audioFormat = 'aac'
    const audioFormatPreferences = isVideo
      ? []
      : ['-x', '--audio-format', audioFormat]

    const args = [
      '-f', id,
      ...audioFormatPreferences,
      '-o', exportName,
      '-P', exportRoute,
      url
    ]

    return args
  }
}
