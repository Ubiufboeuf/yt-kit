import type { Downloader, DownloadTasksOptions, DownloadResult } from '../interfaces/Downloader'
import { RUTAS } from '../lib/constants'
import { spawnAsync } from '../lib/spawnAsync'

export class YtDlpDownloader implements Downloader {
  async download (url: string, options: DownloadTasksOptions): Promise<DownloadResult> {
    const args = this.buildYtDlpArgs(url, options)

    // const result = await spawnAsync('yt-dlp', args, true)
    await spawnAsync('yt-dlp', args, true)

    return {
      duration: -1,
      path: 'unknown'
    }
  }

  private buildYtDlpArgs (url: string, options: DownloadTasksOptions) {
    const { id, type } = options
    const isVideo = type === 'video'
    
    const ext = isVideo
      ? 'mp4'
      : 'aac'
    
    const exportRoute = options.outputFolder
    const exportName = '%(id)s.%(ext)s'
    const audioFormat = 'aac'
    
    const args = [
      '-f', `${id}/${ext}`,
      ...(isVideo
        ? []
        : ['-x', '--audio-format', audioFormat]
      ),
      '-o', exportName,
      '-P', exportRoute,
      url
    ]

    return args
  }
}
