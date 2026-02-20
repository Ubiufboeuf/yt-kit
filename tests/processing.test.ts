import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { join } from 'node:path'
import { rm } from 'node:fs/promises'
import { readdir } from 'node:fs/promises'
import { resolvePath } from '../src'
import { getTestAudio, getTestVideo } from './utils/getTestsAssets'
import { mkdir } from 'node:fs/promises'
import { mux } from '../src/tasks/processing/multiplexing'

const testAssetsPath = resolvePath('~/yt-kit/tests/assets/')
const videoSlug = 'video'
const audioSlug = 'audio'
const resultSlug = 'mixed'
const ytId = 'P-SVx5MsJJM'

describe('Multiplexing (mux)', () => {
  const assets = {
    video: '',
    audio: '',
    mixed: ''
  }
  
  beforeAll(async () => {
    let assetsDir: string[] = []
    try {
      assetsDir = await readdir(testAssetsPath)
    } catch {/* empty */}

    console.log('AssetsDir inicial:', assetsDir, assets)

    const mixedFile = assetsDir.find((file) => file.includes(resultSlug))
    if (mixedFile) {
      console.log('rm mixedFile:', mixedFile)
      await rm(join(testAssetsPath, mixedFile))
    }

    if (!assetsDir) {
      try {
        await mkdir(testAssetsPath, { recursive: true })
        assetsDir = []
      } catch {
        throw new Error('Error creando la carpeta de assets para los tests')
      }
    }

    const video = assetsDir.find((file) => file.includes(videoSlug))
    const audio = assetsDir.find((file) => file.includes(audioSlug))

    console.log({ video, audio })
    
    if (!video) {
      console.warn('\nNo se encontró un video para las pruebas, se intentará descargar uno')
      const result = await getTestVideo(ytId, testAssetsPath, videoSlug)
      if (result !== 'success') {
        throw new Error('No se pudo conseguir un video para los tests. No comenzarán los test de procesamiento')
      }
    }

    if (!audio) {
      console.warn('\nNo se encontró un audio para las pruebas, se intentará descargar uno')
      const result = await getTestAudio(ytId, testAssetsPath, audioSlug)
      if (result !== 'success') {
        throw new Error('No se pudo conseguir un audio para los tests. No comenzarán los test de procesamiento')
      }
    }

    try {
      assetsDir = await readdir(testAssetsPath)
    } catch {/* empty */}
    
    assets.video = assetsDir.find((file) => file.includes(videoSlug)) ?? ''
    assets.audio = assetsDir.find((file) => file.includes(audioSlug)) ?? ''
    console.log('beforeAll', assets)
  }, { timeout: -1 })

  beforeEach(async () => {
    try {
      console.log('Borrando mixed', assets.mixed)
      await rm(join(testAssetsPath, assets.mixed))
      assets.mixed = ''
    } catch {/* empty */}
  })

  it('Debe unir un video sin audio con un audio', async () => {
    const { video, audio } = assets
    const container = 'webm'

    try {
      await mux({
        video: join(testAssetsPath, video),
        audios: [join(testAssetsPath, audio)],
        container,
        slug: resultSlug,
        outputDir: testAssetsPath
      })
    } catch {/* empty */}

    let assetsDir
    try {
      assetsDir = await readdir(testAssetsPath)
    } catch {/* empty */}

    const result = assetsDir?.find((file) => file.includes(resultSlug) && file.includes(container))
    const existResult = Boolean(result)

    assets.mixed = result ?? ''

    expect(existResult).toBe(true)
  })

  it('Debe unir un video sin audio con dos audios', async () => {
    const { video, audio } = assets
    const container = 'webm'

    try {
      await mux({
        video: join(testAssetsPath, video),
        audios: [join(testAssetsPath, audio), join(testAssetsPath, audio)],
        container,
        slug: resultSlug,
        outputDir: testAssetsPath
      })
    } catch {/* empty */}

    let assetsDir
    try {
      assetsDir = await readdir(testAssetsPath)
    } catch {/* empty */}

    const result = assetsDir?.find((file) => file.includes(resultSlug) && file.includes(container))
    const existResult = Boolean(result)

    assets.mixed = result ?? ''

    expect(existResult).toBe(true)
  })

  afterAll(async () => {
    try {
      await rm(join(testAssetsPath, assets.mixed))
    } catch {/* empty */}

    let assetsDir
    try {
      assetsDir = await readdir(testAssetsPath)
    } catch {/* empty */}

    assets.video = assetsDir?.find((file) => file.includes(videoSlug)) ?? ''
    assets.audio = assetsDir?.find((file) => file.includes(audioSlug)) ?? ''
    assets.mixed = assetsDir?.find((file) => file.includes(resultSlug)) ?? ''

    console.log('Post limpieza final:', assets)
  })
})
