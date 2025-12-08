const YOUTUBE_VIDEO_URL = 'https://youtube.com/watch'

export function formYoutubeUrl (ytId: string) {
  return `${YOUTUBE_VIDEO_URL}?v=${ytId}`
}
