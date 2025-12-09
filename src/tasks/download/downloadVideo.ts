// import { spawnAsync } from 'src/core/lib/spawnAsync'
import type { DownloadOptions } from 'src/interfaces/Downloader'
import { formYoutubeUrl } from 'src/lib/ytUtils'
import { YtDlpDownloader } from 'src/yt-dlp-downloader/YtDlpDownloader'

export async function downloadVideo (ytId: string, id: string) {
  if (!ytId || !id) return

  const url = formYoutubeUrl(ytId)
  const options: DownloadOptions = { id, type: 'video' }

  return new YtDlpDownloader().download(url, options)
}
