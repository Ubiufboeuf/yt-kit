export interface Downloader {
  download (url: string, options: DownloadTasksOptions): Promise<DownloadResult>
}

export interface DownloadOptions {
  id: string
  outputFolder?: string
  filename?: string
}

export interface DownloadTasksOptions {
  id: string
  type: 'video' | 'audio'
  outputFolder: string
  filename: string
}

export interface DownloadResult {
  path: string
  duration: number
}
