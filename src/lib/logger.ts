/* eslint-disable @typescript-eslint/no-explicit-any */
import { stdout, stderr } from 'node:process'

export function streamLog (type: 'data' | 'err', data: any) {
  const stream = type === 'data'
    ? stdout
    : stderr
  
  stream.write(data)
}
