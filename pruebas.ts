// Acá voy a ir probando el core de primeras, para no tener que navegar mucho para probar el código

import { formYoutubeUrl } from './src/lib/ytUtils'
import { YtDlpDownloader } from './src/yt-dlp-downloader/YtDlpDownloader'

const ytId = 'wKVJi-FLvak'
const url = formYoutubeUrl(ytId)

const bestVideo = new YtDlpDownloader().findFormatId(url, 'best-video')
const worstVideo = new YtDlpDownloader().findFormatId(url, 'worst-video')
const bestAudio = new YtDlpDownloader().findFormatId(url, 'best-audio')
const worstAudio = new YtDlpDownloader().findFormatId(url, 'worst-audio')

bestVideo.then(({ foundSpecific, formatId }) => console.log('bestVideo:', { formatId, foundSpecific }))
worstVideo.then(({ foundSpecific, formatId }) => console.log('worstVideo:', { formatId, foundSpecific }))
bestAudio.then(({ foundSpecific, formatId }) => console.log('bestAudio:', { formatId, foundSpecific }))
worstAudio.then(({ foundSpecific, formatId }) => console.log('worstAudio:', { formatId, foundSpecific }))

// const video = new YtDlpDownloader().findFormatId(url, '360p')
// console.log('video:', await video)
