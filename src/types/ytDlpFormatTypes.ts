export interface YtDlpFormat {
  format_id: string
  format_note: string
  ext: 'mhtml' | 'm4a' | 'webm' | 'mp4'
  protocol: 'mhtml' | 'https'
  acodec: 'none' | 'mp4a.40.5' | 'opus' | 'mp4a.40.2'
  vcodec: string
  url: string
  width: number | null
  height: number | null
  fps: number | null
  rows?: number
  columns?: number
  fragments?: {
    url: string
    duration: number
  }[]
  audio_ext: 'none' | 'm4a' | 'webm'
  video_ext: 'none' | 'mp4' | 'webm'
  vbr: number | null
  abr: number | null
  tbr: number | null
  resolution: string
  aspect_ratio: number | null
  filesize_approx: number | null
  http_headers: {
    'User-Agent': string
    Accept: 'text/html,application/xhtml+xml,application/xmlq=0.9,*/*q=0.8'
    'Accept-Language': 'en-us,enq=0.5'
    'Sec-Fetch-Mode': 'navigate'
  }
  format: string
  asr?: number | null
  filesize?: number | null
  source_preference?: number
  audio_channels?: number | null
  quality?: number
  has_drm?: boolean
  language?: null | string
  language_preference?: number
  preference?: null
  dynamic_range?: 'SDR' | null
  container?: 'm4a_dash' | 'webm_dash' | 'mp4_dash'
  available_at?: number
  downloader_options?: {
    http_chunk_size: number
  }
}
