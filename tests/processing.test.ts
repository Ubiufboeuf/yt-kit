import { afterAll, beforeAll, describe, it } from 'bun:test'
// import { mkdtemp } from 'node:fs/promises'
// import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { rm } from 'node:fs/promises'
import { readdir } from 'node:fs/promises'
import { resolvePath } from '../src'
import { getTestAudio, getTestVideo } from './utils/getTestsAssets'
import { mkdir } from 'node:fs/promises'
import { mux } from '../src/tasks/processing/multiplexing'

const testAssetsPath = '~/yt-kit/tests/assets/'
const ytId = 'P-SVx5MsJJM'

describe('Multiplexing (mux)', () => {
  const assets = {
    video: '',
    audio: ''
  }
  
  beforeAll(async () => {
    let dir: string[] = []
    try {
      dir = await readdir(resolvePath(testAssetsPath))
    } catch {/* empty */}

    const mixedFile = dir.find((file) => file.includes('mixed'))
    if (mixedFile) {
      await rm(join(resolvePath(testAssetsPath), mixedFile))
    }

    if (!dir) {
      try {
        await mkdir(testAssetsPath, { recursive: true })
        dir = []
      } catch {
        throw new Error('Error creando la carpeta de assets para los tests')
      }
    }
    
    const video = dir.find((file) => file.includes('video'))
    const audio = dir.find((file) => file.includes('audio'))
    
    if (!video) {
      console.warn('No se encontró un video para las pruebas, se intentará descargar uno')
      const result = await getTestVideo(ytId, testAssetsPath)
      if (result !== 'success') {
        throw new Error('No se pudo conseguir un video para los tests. No comenzarán los test de procesamiento')
      }
    }

    if (!audio) {
      console.warn('No se encontró un audio para las pruebas, se intentará descargar uno')
      const result = await getTestAudio(ytId, testAssetsPath)
      if (result !== 'success') {
        throw new Error('No se pudo conseguir un audio para los tests. No comenzarán los test de procesamiento')
      }
    }

    try {
      dir = await readdir(resolvePath(testAssetsPath))
    } catch {/* empty */}
    
    assets.video = dir.find((file) => file.includes('video')) ?? ''
    assets.audio = dir.find((file) => file.includes('audio')) ?? ''
  }, { timeout: -1 })

  it('Debe unir un video sin audio con un audio', async () => {
    const { video, audio } = assets

    await mux({
      video: resolvePath(join(testAssetsPath, video)),
      audios: [resolvePath(join(testAssetsPath, audio))],
      container: 'webm',
      slug: 'mixed',
      outputDir: resolvePath(testAssetsPath)
    })
  })

  afterAll(async () => {
    try {
      await rm(join(resolvePath(testAssetsPath), 'mixed.webm'))
    } catch {/* empty */}
  })
})
