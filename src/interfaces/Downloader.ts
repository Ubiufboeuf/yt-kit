export interface Downloader {
  download (url: string, options: DownloadOptions): Promise<DownloadResult>
}

export interface DownloadOptions {
  id: string
  type: 'video' | 'audio'
}

export interface DownloadResult {
  path: string
  duration: number
}
