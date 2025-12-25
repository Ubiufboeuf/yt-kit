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
 * Recibe una cantidad `amount` y una unidad `unit`, y devuelve esa cantidad en milisegundos.
 * 
 * Si la unidad no es válida, devuelve la cantidad sin convertir.
 * 
 * ```js
 * convertTime(10, 'day') // 864000000ms
 * convertTime(4, 'lemon') // 4ms
 * ```
 * 
 * @returns Devuelve en milisegundos la cantidad de unidad especificada
 */
export function timeToMs (amount: number, unit: TimeUnit): Miliseconds {
  if (!multipliers[unit]) return amount
  const ms = amount * multipliers[unit]
  return ms
}
