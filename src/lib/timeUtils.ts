type TimeUnit = 'day' | 'hrs' | 'min' | 'sec' | 'nano'
type Miliseconds = number

const multipliers: Record<TimeUnit, number> = {
  'day': 1000 * 3600 * 24,
  'hrs': 1000 * 3600,
  'min': 1000 * 60,
  'sec': 1000,
  'nano': 0.001
}

/**
 * Recibe una cantidad de tiempo (`amount`) en una unidad (`unit`), y devuelve ese tiempo convertido en milisegundos.
 * 
 * Si `unit` no es válido, devuelve `amount`.
 * 
 * ```js
 * convertTime(10, 'day') // 864000000ms
 * convertTime(4, 'lemon') // 4ms
 * ```
 * 
 * @returns Devuelve en milisegundos la cantidad (`amount`) de unidad (`unit`) especificada
 */
export function timeToMs (amount: number, unit: TimeUnit): Miliseconds {
  if (!multipliers[unit]) return amount
  const ms = amount * multipliers[unit]
  return ms
}

export function msToTime (ms: number, unit: TimeUnit): number {
  if (!multipliers[unit]) return ms
  const time = ms / multipliers[unit]
  return time
}
