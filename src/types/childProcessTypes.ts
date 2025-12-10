import type { COMMANDS } from '../lib/constants'

export type CommandKey = keyof typeof COMMANDS
export type Command = typeof COMMANDS[keyof typeof COMMANDS]
