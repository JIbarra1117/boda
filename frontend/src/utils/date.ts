/**
 * Parsea una fecha en formato YYYY-MM-DD o ISO sin problemas de zona horaria.
 * Se asigna la hora 12:00 del día local para evitar que la conversión UTC
 * muestre el día anterior en zonas horarias negativas.
 */
export function parseWeddingDate(dateString: string | undefined): Date | null {
  if (!dateString) return null
  const datePart = dateString.split('T')[0]
  return new Date(`${datePart}T12:00:00`)
}

export function formatWeddingDate(
  dateString: string | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = parseWeddingDate(dateString)
  if (!date) return ''

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }

  return date.toLocaleDateString('es-ES', options || defaultOptions)
}
