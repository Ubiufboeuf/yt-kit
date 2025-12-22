export interface Downloader {
  download (url: string, options: DownloadTasksOptions): Promise<DownloadResult>
}

export interface DownloadOptions {
  id: string
  outputPath?: string
  filename?: string
}

export interface DownloadTasksOptions {
  id: string
  type: 'video' | 'audio'
  outputPath: string
  filename: string
}

export interface DownloadResult {
  path: string
  duration: number
}
