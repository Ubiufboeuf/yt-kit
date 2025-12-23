export type YtDlpFormat = {
    format_id:            string
    format_note:          string
    ext:                  EXT
    protocol:             Protocol
    acodec:               Acodec
    vcodec:               string
    url:                  string
    width:                number | null
    height:               number | null
    fps:                  number | null
    rows?:                number
    columns?:             number
    fragments?:           Fragment[]
    audio_ext:            AudioEXT
    video_ext:            VideoEXT
    vbr:                  number | null
    abr:                  number | null
    tbr:                  number | null
    resolution:           string
    aspect_ratio:         number | null
    filesize_approx:      number | null
    http_headers:         HTTPHeaders
    format:               string
    asr?:                 number | null
    filesize?:            number | null
    source_preference?:   number
    audio_channels?:      number | null
    quality?:             number
    has_drm?:             boolean
    language?:            null | string
    language_preference?: number
    preference?:          null
    dynamic_range?:       DynamicRange | null
    container?:           Container
    available_at?:        number
    downloader_options?:  DownloaderOptions
}

export type Acodec = 'none' | 'mp4a.40.5' | 'opus' | 'mp4a.40.2'

export type AudioEXT = 'none' | 'm4a' | 'webm'

export type Container = 'm4a_dash' | 'webm_dash' | 'mp4_dash'

export type DownloaderOptions = {
    http_chunk_size: number
}

export type DynamicRange = 'SDR'

export type EXT = 'mhtml' | 'm4a' | 'webm' | 'mp4'

export type Fragment = {
    url:      string
    duration: number
}

export type HTTPHeaders = {
    'User-Agent':      string
    Accept:            Accept
    'Accept-Language': AcceptLanguage
    'Sec-Fetch-Mode':  SECFetchMode
}

export type Accept = 'text/html,application/xhtml+xml,application/xmlq=0.9,*/*q=0.8'

export type AcceptLanguage = 'en-us,enq=0.5'

export type SECFetchMode = 'navigate'

export type Protocol = 'mhtml' | 'https'

export type VideoEXT = 'none' | 'mp4' | 'webm'
