import { PATTERNS } from './constants'
import { expandPattern, type Pattern, type PatternData } from './expandPattern'
import { sanitizeFilename } from './sanitizeFilename'

interface ResolverProps {
  filename: string
  id: string
  ytId: string
}

export function resolveFilename ({ filename, id, ytId }: ResolverProps): string {
  const map = new Map<Pattern, PatternData>([
    [PATTERNS.ID, id],
    [PATTERNS.YT_ID, ytId]
  ])
  
  const raw = expandPattern(filename, map)
  return sanitizeFilename(raw)
}
