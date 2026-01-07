export interface Downloader {
  download (ytId: string, options: DownloadTasksOptions): Promise<DownloadResult>
}

export interface DownloadOptions {
  formatId: string | number
  outputDir?: string
  filename?: string
  simulate?: boolean
}

export interface DownloadTasksOptions {
  id: string
  type: 'video' | 'audio'
  outputDir: string
  filename: string
  simulate: boolean
}

export interface DownloadResult {
  type: string
  status: string
  path: string
  id: string
  ext: string
  title: string
  size: number
  alreadyDownloaded: boolean | string
}
