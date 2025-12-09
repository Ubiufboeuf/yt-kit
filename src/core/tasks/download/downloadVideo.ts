// import { spawnAsync } from 'src/core/lib/spawnAsync'
import type { DownloadOptions } from 'src/core/interfaces/Downloader'
import { formYoutubeUrl } from 'src/core/lib/ytUtils'
import { YtDlpDownloader } from 'src/core/yt-dlp-downloader/YtDlpDownloader'

export async function downloadVideo (ytId: string, id: string) {
  if (!ytId || !id) return

  const url = formYoutubeUrl(ytId)
  const options: DownloadOptions = { id, type: 'video' }

  return new YtDlpDownloader().download(url, options)
}
