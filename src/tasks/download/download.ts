// import { spawnAsync } from 'src/core/lib/spawnAsync'
// import type { DownloadOptions } from './interfaces/Downloader'
import { DEFAULT_FILENAME } from 'src/lib/constants'
import type { DownloadOptions, DownloadTasksOptions } from '../../interfaces/Downloader'
import { formYoutubeUrl } from '../../lib/ytUtils'
import { YtDlpDownloader } from '../../yt-dlp-downloader/YtDlpDownloader'
import type { DownloadType } from 'src/types/downloaderTaskTypes'

export async function downloadVideo (ytId: string, options: DownloadOptions) {
  if (!ytId || !options.id) return

  const url = formYoutubeUrl(ytId)
  const taskOptions = formDownloadTaskOptions('video', options)

  return new YtDlpDownloader().download(url, ytId, taskOptions)
}

export async function downloadAudio (ytId: string, options: DownloadOptions) {
  if (!ytId || !options.id) return

  const url = formYoutubeUrl(ytId)
  const taskOptions = formDownloadTaskOptions('audio', options)

  return new YtDlpDownloader().download(url, ytId, taskOptions)
}

function formDownloadTaskOptions (type: DownloadType, options: DownloadOptions): DownloadTasksOptions {
  const taskOptions: DownloadTasksOptions = {
    id: options.id,
    type,
    outputPath: options.outputPath ?? '.',
    filename: options.filename ?? DEFAULT_FILENAME
  }

  return taskOptions
}
