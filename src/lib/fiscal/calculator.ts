import Big from 'big.js'

/**
 * Fiscal Calculation Service
 * 
 * All monetary values are stored and calculated as integers representing centimos (CRC).
 * This ensures precision and avoids floating-point errors in fiscal calculations.
 * 
 * Example: ₡1,234.56 = 123456 centimos
 */

// Constants
const IVA_RATE = new Big('0.13') // 13% IVA for Costa Rica
const CENTIMOS_PER_COLON = 100

/**
 * Calculate subtotal from line items
 * @param lineItems Array of amounts in centimos
 * @returns Subtotal in centimos
 */
export function calculateSubtotal(lineItems: number[]): number {
  const subtotal = lineItems.reduce((sum, item) => {
    return new Big(sum).plus(new Big(item))
  }, new Big(0))

  return Math.round(subtotal.toNumber())
}

/**
 * Calculate IVA (13%) on a subtotal
 * @param subtotal Amount in centimos
 * @returns IVA amount in centimos
 */
export function calculateIVA(subtotal: number): number {
  const iva = new Big(subtotal).times(IVA_RATE)
  return Math.round(iva.toNumber())
}

/**
 * Calculate total (subtotal + IVA)
 * @param subtotal Amount in centimos
 * @returns Total in centimos
 */
export function calculateTotal(subtotal: number): number {
  const iva = calculateIVA(subtotal)
  return subtotal + iva
}

/**
 * Calculate complete invoice totals
 * @param lineItems Array of amounts in centimos
 * @returns Object with subtotal, iva, and total in centimos
 */
export function calculateInvoiceTotals(lineItems: number[]) {
  const subtotal = calculateSubtotal(lineItems)
  const iva = calculateIVA(subtotal)
  const total = subtotal + iva

  return {
    subtotal,
    iva,
    total,
  }
}

/**
 * Verify that IVA is exactly 13% of subtotal
 * Used for validation and testing
 * @param subtotal Amount in centimos
 * @param iva Amount in centimos
 * @returns true if IVA is exactly 13% of subtotal
 */
export function verifyIVAPercentage(subtotal: number, iva: number): boolean {
  const expectedIVA = calculateIVA(subtotal)
  return iva === expectedIVA
}

/**
 * Apply discount to a subtotal
 * @param subtotal Amount in centimos
 * @param discountPercent Discount percentage (0-100)
 * @returns Discounted amount in centimos
 */
export function applyDiscount(subtotal: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percentage must be between 0 and 100')
  }

  const discountRate = new Big(discountPercent).div(100)
  const discountAmount = new Big(subtotal).times(discountRate)
  const discounted = new Big(subtotal).minus(discountAmount)

  return Math.round(discounted.toNumber())
}

/**
 * Round amount to nearest centimo
 * @param amount Amount in centimos
 * @returns Rounded amount
 */
export function roundToCentimo(amount: number): number {
  return Math.round(amount)
}
