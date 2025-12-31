import { spawn } from 'node:child_process'
import { streamLog } from './logger'
import { config } from '../config/Configuration'
import type { CommandKey } from '../types/commandsTypes'

export function spawnAsync (command: CommandKey, args: string[], showOutput?: boolean) {
  const configuredCommands = config.get('commands')
  const _command = configuredCommands?.[command]
  
  if (!_command) {
    throw new Error(`No se encontró un comando configurado para ${command}`)
  }

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
