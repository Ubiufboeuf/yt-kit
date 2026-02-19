import { downloadAudio, downloadVideo, findFormatId } from '../../src'
import { readdir } from 'node:fs/promises'
import type { Result } from '../types'
import { extname, join } from 'node:path'
import { spawnAsync } from '../../src/lib/spawnAsync'
import { rm } from 'node:fs/promises'
import { cap } from '../../src/lib/capitilize'

type Type = 'audio' | 'video'

const desiredExtension: Record<Type, string> = {
  audio: '.opus',
  video: '.webm'
}

const codec: Record<Type, string[]> = {
  audio: ['-c:a', 'libopus'],
  video: ['-c:v', 'vp9_vaapi']
}

function getMediaArgs (type: Type, filePath: string, outputFilePath: string): string[] {
  const gpuAccel = type === 'video' ? [
    '-hwaccel', 'vaapi',
    '-hwaccel_device', '/dev/dri/renderD128',
    '-hwaccel_output_format', 'vaapi'
  ] : []
  
  const args = [
    '-y',
    ...gpuAccel,
    '-i', filePath,
    ...codec[type],
    outputFilePath
  ]

  return args
}

export async function getTestVideo (ytId: string, testAssetsPath: string): Promise<Result> {
  const videoFormat = await findFormatId(ytId, 'worst-video')
  if (!videoFormat.formatId) {
    console.error('No se encontró el formato del video')
    return 'error'
  }

  const downloadResult = await downloadVideo(ytId, {
    formatId: videoFormat.formatId,
    outputDir: testAssetsPath,
    filename: 'video.%(ext)s'
  })

  if (downloadResult?.status === 'success') console.log('Descargado')
  else console.log('Error en la descarga')

  const result = await convertFileForTest('video', testAssetsPath)

  return result
}

export async function getTestAudio (ytId: string, testAssetsPath: string): Promise<Result> {
  const audioFormat = await findFormatId(ytId, 'worst-audio')
  if (!audioFormat.formatId) {
    console.error('No se encontró el formato del audio:', audioFormat)
    return 'error'
  }

  const downloadResult = await downloadAudio(ytId, {
    formatId: audioFormat.formatId,
    outputDir: testAssetsPath,
    filename: 'audio.%(ext)s'
  })

  if (downloadResult?.status === 'success') console.log('Descargado')
  else console.log('Error en la descarga')

  const result = await convertFileForTest('audio', testAssetsPath)
  
  return result
}

async function convertFileForTest (type: Type, testAssetsPath: string): Promise<Result> {
  let dir: string[] = []
  try {
    dir = await readdir(testAssetsPath)
  } catch {/* empty */}
  
  const file = dir.find((file) => file.includes(type))
  if (!file) return 'error'

  if (extname(file) !== desiredExtension[type]) {
    const filePath = join(testAssetsPath, file)
    const outputFilePath = join(testAssetsPath, `${type}${desiredExtension[type]}`)

    console.log(`Preparando ${type} para los tests`)
    await spawnAsync('ffmpeg', getMediaArgs(type, filePath, outputFilePath))

    // console.log('Borrando descargado:', filePath)
    await rm(filePath)
  } else {
    console.log(`${cap(type)} preprado para los tests`)
  }

  return 'success'
}
