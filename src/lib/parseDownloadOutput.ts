import type { DownloadResult } from '../interfaces/Downloader'
import { DOWNLOAD_MARKERS } from './constants'

const { endMarker, startMarker } = DOWNLOAD_MARKERS

export function parseDownloadOutput (output: unknown, simulate: boolean): DownloadResult {
  const lines = String(output).split('\n')

  const resultLine = lines.find((l) => l.includes(startMarker))
  const jsonLine = resultLine?.split(startMarker)[1].split(endMarker)[0]

  if (!jsonLine) {
    console.error('Salida completa recibida:', output)
    throw new Error('No se encontró el JSON de resultado en la salida de la descarga')
  }

  let result
  try {
    result = JSON.parse(jsonLine)
  } catch {
    throw new Error('Error convirtiendo la salida de la descarga a JSON')
  }
  
  const alreadyDownloaded = checkIfAlreadyDownloaded(output)

  return {
    ...result,
    alreadyDownloaded: simulate
      ? 'NA (simulated)'
      : alreadyDownloaded
  }
}

export function checkIfAlreadyDownloaded (output: unknown): boolean {
  const lines = String(output).split('\n')

  return lines.some((line) => line.includes('has already been downloaded'))
}
