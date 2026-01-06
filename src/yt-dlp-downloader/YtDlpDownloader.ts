import type { Downloader, DownloadTasksOptions, DownloadResult } from '../interfaces/Downloader'
import { spawnAsync } from '../lib/spawnAsync'
import { resolveFilenamePattern } from '../lib/resolveFilenamePattern'
import { parseDownloadOutput } from '../lib/parseDownloadOutput'

export class YtDlpDownloader implements Downloader {
  async download (ytId: string, options: DownloadTasksOptions): Promise<DownloadResult> {
    const args = this.buildYtDlpArgs(ytId, options)

    const output = await spawnAsync('yt-dlp', args, true)
    const result = parseDownloadOutput(output)

    return result
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
      
    const printDetails = [
      '--newline',
      '--print',
      'after_move:{"type":"download:result","status":"success","path":"%(filepath)s","id":%(id)j,"ext":%(ext)j,"title":%(title)j,"size":%(filesize_approx)s,"already_downloaded":"%(already_downloaded)s"}'
    ]

    const args = [
      '-f', id,
      ...printDetails,
      ...audioFormatPreferences,
      '-o', exportName,
      '-P', exportRoute,
      ytId
    ]

    return args
  }
}
