// Acá voy a ir probando el core de primeras, para no tener que navegar mucho para probar el código

import { downloadVideo, downloadAudio } from './src/tasks/download/download'

const ytId = 'wKVJi-FLvak'

await downloadVideo(ytId, {
  id: '135',
  filename: 'lol.mp4'
})

await downloadAudio(ytId, {
  id: '251'
})
