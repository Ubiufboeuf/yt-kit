type TimeUnit = 'day' | 'hour' | 'minute' | 'second' | 'nano'

const multipliers: Record<TimeUnit, number> = {
  'day': 1000 * 3600 * 24,
  'hour': 1000 * 3600,
  'minute': 1000 * 60,
  'second': 1000,
  'nano': 0.001
}

/**
 * Recibe una cantidad de tiempo (`amount`) en una unidad (`unit`), y devuelve ese tiempo convertido en milisegundos.
 * 
 * Si `unit` no es válido, devuelve `amount`.
 * 
 * ```js
 * timeToMs(7, 'second') // 7000 (7000ms)
 * timeToMs(4, 'lemon') // 4 (4ms)
 * ```
 * 
 * @returns Devuelve en milisegundos la cantidad (`amount`) de unidad (`unit`) especificada
 */
export function timeToMs (amount: number, unit: TimeUnit): number {
  if (!multipliers[unit]) return amount
  const ms = amount * multipliers[unit]
  return ms
}

/**
 * Recibe una cantidad de milisegundos (`ms`) y una unidad (`unit`) a la que convertir ese tiempo.
 * 
 * Si `unit` no es válido, devuelve `ms`.
 * 
 * ```js
 * msToTime(7000, 'second') // 7 (7s)
 * msToTime(4, 'lemon') // 4 (4ms)
 * ```
 * 
 * @returns Devuelve los milisegundos convertidos a la unidad indicada.
 */
export function msToTime (ms: number, unit: TimeUnit): number {
  if (!multipliers[unit]) return ms
  const time = ms / multipliers[unit]
  return time
}
