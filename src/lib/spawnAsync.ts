import { spawn } from 'node:child_process'
import type { CommandKey } from '../types/processTypes'
import { COMMANDS } from '../lib/constants'
import { streamLog } from './logs'

export function spawnAsync (command: CommandKey, args: string[], showOutput?: boolean) {
  const _command = COMMANDS[command]

  return new Promise((resolve, reject) => {
    const spawnProcess = spawn(_command, args)
    let stdout = ''
    let stderr = ''

    spawnProcess.stdout.on('data', (chunk) => {
      stdout += chunk
      const chunkStr = chunk.toString()
      if (showOutput) streamLog('data', chunkStr)
    })

    spawnProcess.stderr.on('data', (chunk) => {
      stderr += chunk
      const chunkStr = chunk.toString()
      if (showOutput) streamLog('err', chunkStr)
    })

    spawnProcess.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.toString())
      } else {
        reject(new Error(stderr.toString()))
      }
    })

    spawnProcess.on('error', (err) => {
      reject(err)
    })
  })
}
