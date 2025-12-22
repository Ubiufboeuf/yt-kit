import type { PATTERNS } from './constants'

export type Pattern = typeof PATTERNS[keyof typeof PATTERNS]
export type PatternData = string

export function expandPattern (pattern: string, patternMap: Map<Pattern, PatternData>): string {
  let resolvedPattern = pattern

  for (const [key, value] of patternMap) {
    resolvedPattern = resolvedPattern.replaceAll(key, value)
  }

  return resolvedPattern
}
