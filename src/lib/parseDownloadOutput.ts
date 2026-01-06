import type { DownloadResult } from '../interfaces/Downloader'

export function parseDownloadOutput (output: unknown): DownloadResult {
  const lines = String(output).split('\n')
  const jsonLine = lines.find((l) => l.startsWith('{'))

  if (!jsonLine) {
    throw new Error('No se encontró JSON final')
  }

  let result
  try {
    result = JSON.parse(jsonLine)
  } catch (err) {
    console.error('Error convirtiendo la salida de la descarga a JSON')
    throw err
  }

  return result
}
