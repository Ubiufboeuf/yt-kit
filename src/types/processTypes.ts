import type { COMMANDS } from '@core/lib/constants'

export type CommandKey = keyof typeof COMMANDS
export type Command = typeof COMMANDS[keyof typeof COMMANDS]
