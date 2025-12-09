import { spawn } from 'node:child_process'
import type { CommandKey } from '@core/types/processTypes'
import { COMMANDS } from '@core/lib/constants'

export function spawnAsync (command: CommandKey, args: string[], showOutput?: boolean) {
  const _command = COMMANDS[command]

  return new Promise((resolve, reject) => {
    const process = spawn(_command, args)
    let stdout = ''
    let stderr = ''

    process.stdout.on('data', (chunk) => {
      stdout += chunk
      const chunkStr = chunk.toString()
      if (showOutput) console.log(chunkStr)
    })

    process.stderr.on('data', (chunk) => {
      stderr += chunk
      const chunkStr = chunk.toString()
      if (showOutput) console.log(chunkStr)
    })

    process.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.toString())
      } else {
        reject(new Error(stderr.toString()))
      }
    })

    process.on('error', (err) => {
      reject(err)
    })
  })
}
