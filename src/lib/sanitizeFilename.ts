// Por ahora esto está enfocado solo para Linux,
// pero en un futuro sería ideal que soporte más sistemas operativos
export function sanitizeFilename (raw: string) {
  return raw
    .replaceAll('/', '⁄')
}
