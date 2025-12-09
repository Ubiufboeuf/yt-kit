export interface Downloader {
  download (url: string, options: DownloadTasksOptions): Promise<DownloadResult>
}

export interface DownloadOptions {
  id: string
  outputFolder?: string
}

export interface DownloadTasksOptions {
  id: string
  type: 'video' | 'audio'
  outputFolder: string
}

export interface DownloadResult {
  path: string
  duration: number
}
