/**
 * Currency Formatting Utilities
 * 
 * Handles conversion between centimos (integer storage) and colones (display format)
 * Provides locale-aware formatting for Costa Rican currency (CRC)
 */

const CENTIMOS_PER_COLON = 100

/**
 * Convert colones (decimal) to centimos (integer)
 * @param colones Amount in colones (e.g., 1234.56)
 * @returns Amount in centimos (e.g., 123456)
 */
export function toCentimos(colones: number): number {
  return Math.round(colones * CENTIMOS_PER_COLON)
}

/**
 * Convert centimos (integer) to colones (decimal)
 * @param centimos Amount in centimos (e.g., 123456)
 * @returns Amount in colones (e.g., 1234.56)
 */
export function fromCentimos(centimos: number): number {
  return centimos / CENTIMOS_PER_COLON
}

/**
 * Format amount in centimos as Costa Rican currency string
 * @param centimos Amount in centimos
 * @param options Formatting options
 * @returns Formatted string (e.g., "₡1,234.56")
 */
export function formatCRC(
  centimos: number,
  options: {
    showSymbol?: boolean
    showDecimals?: boolean
    locale?: string
  } = {}
): string {
  const {
    showSymbol = true,
    showDecimals = true,
    locale = 'es-CR',
  } = options

  const colones = fromCentimos(centimos)

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })

  const formatted = formatter.format(colones)

  // If showSymbol is false, remove the currency symbol
  if (!showSymbol) {
    return formatted.replace(/₡\s?/, '').trim()
  }

  return formatted
}

/**
 * Parse a formatted currency string to centimos
 * Handles various formats: "₡1,234.56", "₡1 234,56", "1234.56", "1,234.56"
 * @param formatted Formatted currency string
 * @returns Amount in centimos
 */
export function parseCRC(formatted: string): number {
  // Remove currency symbol
  let cleaned = formatted.replace(/₡\s?/, '').trim()

  // Detect decimal separator (comma or period)
  // If there's both comma and period, the last one is the decimal separator
  const lastCommaIndex = cleaned.lastIndexOf(',')
  const lastPeriodIndex = cleaned.lastIndexOf('.')

  let decimalSeparator = '.'
  if (lastCommaIndex > lastPeriodIndex) {
    // Comma is the decimal separator
    decimalSeparator = ','
  }

  // Remove all spaces and thousands separators
  cleaned = cleaned.replace(/\s/g, '')

  // If comma is decimal separator, replace it with period for parsing
  if (decimalSeparator === ',') {
    cleaned = cleaned.replace(',', '.')
  }

  // Remove any remaining commas (thousands separators)
  cleaned = cleaned.replace(/,/g, '')

  // Parse as float
  const colones = parseFloat(cleaned)

  if (isNaN(colones)) {
    throw new Error(`Invalid currency format: ${formatted}`)
  }

  return toCentimos(colones)
}

/**
 * Format amount for display in input fields
 * @param centimos Amount in centimos
 * @returns Formatted string without symbol (e.g., "1,234.56")
 */
export function formatCRCForInput(centimos: number): string {
  return formatCRC(centimos, {
    showSymbol: false,
    showDecimals: true,
  })
}

/**
 * Format amount for display in tables/lists
 * @param centimos Amount in centimos
 * @returns Formatted string with symbol (e.g., "₡1,234.56")
 */
export function formatCRCForDisplay(centimos: number): string {
  return formatCRC(centimos, {
    showSymbol: true,
    showDecimals: true,
  })
}

/**
 * Format amount for invoice/receipt display
 * @param centimos Amount in centimos
 * @returns Formatted string (e.g., "₡1,234.56")
 */
export function formatCRCForInvoice(centimos: number): string {
  return formatCRC(centimos, {
    showSymbol: true,
    showDecimals: true,
    locale: 'es-CR',
  })
}
