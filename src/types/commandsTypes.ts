import type { COMMANDS } from '../lib/constants'

export type Commands = Record<keyof typeof COMMANDS, string>
