import type { Downloader, DownloadOptions, DownloadResult } from '@core/interfaces/Downloader'
import { RUTAS } from '@core/lib/constants'
import { spawnAsync } from '@core/lib/spawnAsync'

export class YtDlpDownloader implements Downloader {
  async download (url: string, options: DownloadOptions): Promise<DownloadResult> {
    const args = this.buildYtDlpArgs(url, options)

    // const result = await spawnAsync('yt-dlp', args, true)
    await spawnAsync('yt-dlp', args, true)

    return {
      duration: -1,
      path: 'unknown'
    }
  }

  private buildYtDlpArgs (url: string, options: DownloadOptions) {
    const { id, type } = options
    const isVideo = type === 'video'
    
    const ext = isVideo
      ? 'mp4'
      : 'aac'
    
    const exportRoute = isVideo
      ? RUTAS.VIDEOS_DESCARGADOS
      : RUTAS.AUDIOS_DESCARGADOS
    
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
