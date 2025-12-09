// import { spawnAsync } from 'src/core/lib/spawnAsync'
// import type { DownloadOptions } from './interfaces/Downloader'
import type { DownloadOptions, DownloadTasksOptions } from '../../interfaces/Downloader'
import { formYoutubeUrl } from '../../lib/ytUtils'
import { YtDlpDownloader } from '../../yt-dlp-downloader/YtDlpDownloader'

export async function downloadVideo (ytId: string, options: DownloadOptions) {
  if (!ytId || !options.id) return

  const url = formYoutubeUrl(ytId)
  const taskOptions: DownloadTasksOptions = {
    id: options.id,
    type: 'video',
    outputFolder: options.outputFolder ?? '.'
  }

  return new YtDlpDownloader().download(url, taskOptions)
}
