export function cap (str: string): string {
  const first = str.at(0)?.toUpperCase()
  const rest = str.slice(1, str.length)
  return `${first}${rest}`
}
