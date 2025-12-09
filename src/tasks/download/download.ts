// import { spawnAsync } from 'src/core/lib/spawnAsync'
// import type { DownloadOptions } from './interfaces/Downloader'
import { DEFAULT_FILENAME } from 'src/lib/constants'
import type { DownloadOptions, DownloadTasksOptions } from '../../interfaces/Downloader'
import { formYoutubeUrl } from '../../lib/ytUtils'
import { YtDlpDownloader } from '../../yt-dlp-downloader/YtDlpDownloader'
import type { DownloadType } from 'src/types/downloadTypes'

export async function downloadVideo (ytId: string, options: DownloadOptions) {
  if (!ytId || !options.id) return

  const url = formYoutubeUrl(ytId)
  const taskOptions = formDownloadTaskOptions('video', options)

  return new YtDlpDownloader().download(url, taskOptions)
}

function formDownloadTaskOptions (type: DownloadType, options: DownloadOptions): DownloadTasksOptions {
  const taskOptions: DownloadTasksOptions = {
    id: options.id,
    type: 'video',
    outputFolder: options.outputFolder ?? '.',
    filename: options.filename ?? DEFAULT_FILENAME
  }

  return taskOptions
}
