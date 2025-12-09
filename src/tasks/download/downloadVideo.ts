// import { spawnAsync } from 'src/core/lib/spawnAsync'
// import type { DownloadOptions } from './interfaces/Downloader'
import type { DownloadOptions } from '../../interfaces/Downloader'
import { formYoutubeUrl } from '../../lib/ytUtils'
import { YtDlpDownloader } from '../../yt-dlp-downloader/YtDlpDownloader'

export async function downloadVideo (ytId: string, id: string) {
  if (!ytId || !id) return

  const url = formYoutubeUrl(ytId)
  const options: DownloadOptions = { id, type: 'video' }

  return new YtDlpDownloader().download(url, options)
}
