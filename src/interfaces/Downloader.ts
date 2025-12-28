export interface Downloader {
  download (ytId: string, options: DownloadTasksOptions): Promise<DownloadResult>
}

export interface DownloadOptions {
  formatId: string | number
  outputDir?: string
  filename?: string
}

export interface DownloadTasksOptions {
  id: string
  type: 'video' | 'audio'
  outputDir: string
  filename: string
}

export interface DownloadResult {
  path: string
  duration: number
}
