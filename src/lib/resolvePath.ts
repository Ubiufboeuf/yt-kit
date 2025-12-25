import { homedir } from 'node:os'

export function resolvePath (path: string): string {
  return path
    .replace('~', homedir())
}
