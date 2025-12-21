import fc from 'fast-check'
import {
  calculateSubtotal,
  calculateIVA,
  calculateTotal,
  calculateInvoiceTotals,
  verifyIVAPercentage,
  applyDiscount,
  roundToCentimo,
} from '../calculator'

/**
 * Property 12: Fiscal Calculation Correctness with Precision
 * Property 12a: Monetary Storage Precision
 * 
 * Tests verify that:
 * 1. IVA is always exactly 13% of subtotal
 * 2. No floating-point errors occur
 * 3. All calculations maintain integer precision
 * 4. Edge cases are handled correctly
 */

describe('Fiscal Calculator - Property Tests', () => {
  // Arbitrary for generating valid centimo amounts (0 to 999,999.99 CRC)
  const centimosArbitrary = fc.integer({ min: 0, max: 99999999 })

  // Arbitrary for generating line items (1-20 items)
  const lineItemsArbitrary = fc.array(centimosArbitrary, {
    minLength: 1,
    maxLength: 20,
  })

  describe('Property 12: IVA Calculation Correctness', () => {
    it('should calculate IVA as exactly 13% of subtotal', () => {
      fc.assert(
        fc.property(centimosArbitrary, (subtotal) => {
          const iva = calculateIVA(subtotal)
          const expectedIVA = Math.round(subtotal * 0.13)

          // IVA must be exactly 13%
          expect(iva).toBe(expectedIVA)

          // Verify using verification function
          expect(verifyIVAPercentage(subtotal, iva)).toBe(true)
        })
      )
    })

    it('should maintain precision for edge cases', () => {
      const edgeCases = [
        1, // ₡0.01
        100, // ₡1.00
        1300, // ₡13.00 (exactly divisible by 13%)
        999999, // ₡9,999.99
        99999999, // ₡999,999.99
      ]

      edgeCases.forEach((subtotal) => {
        const iva = calculateIVA(subtotal)
        const total = calculateTotal(subtotal)

        // IVA must be integer
        expect(Number.isInteger(iva)).toBe(true)

        // Total must be integer
        expect(Number.isInteger(total)).toBe(true)

        // Total must equal subtotal + IVA
        expect(total).toBe(subtotal + iva)

        // IVA must be exactly 13%
        expect(verifyIVAPercentage(subtotal, iva)).toBe(true)
      })
    })

    it('should never produce floating-point errors', () => {
      fc.assert(
        fc.property(lineItemsArbitrary, (lineItems) => {
          const subtotal = calculateSubtotal(lineItems)
          const iva = calculateIVA(subtotal)
          const total = calculateTotal(subtotal)

          // All values must be integers
          expect(Number.isInteger(subtotal)).toBe(true)
          expect(Number.isInteger(iva)).toBe(true)
          expect(Number.isInteger(total)).toBe(true)

          // No NaN or Infinity
          expect(isFinite(subtotal)).toBe(true)
          expect(isFinite(iva)).toBe(true)
          expect(isFinite(total)).toBe(true)
        })
      )
    })
  })

  describe('Property 12a: Monetary Storage Precision', () => {
    it('should maintain precision when calculating totals from multiple line items', () => {
      fc.assert(
        fc.property(lineItemsArbitrary, (lineItems) => {
          const totals = calculateInvoiceTotals(lineItems)

          // All values must be integers
          expect(Number.isInteger(totals.subtotal)).toBe(true)
          expect(Number.isInteger(totals.iva)).toBe(true)
          expect(Number.isInteger(totals.total)).toBe(true)

          // Subtotal must equal sum of line items
          const expectedSubtotal = lineItems.reduce((a, b) => a + b, 0)
          expect(totals.subtotal).toBe(expectedSubtotal)

          // IVA must be exactly 13%
          expect(verifyIVAPercentage(totals.subtotal, totals.iva)).toBe(true)

          // Total must equal subtotal + IVA
          expect(totals.total).toBe(totals.subtotal + totals.iva)
        })
      )
    })

    it('should handle zero amounts correctly', () => {
      const subtotal = 0
      const iva = calculateIVA(subtotal)
      const total = calculateTotal(subtotal)

      expect(iva).toBe(0)
      expect(total).toBe(0)
    })

    it('should handle large amounts without overflow', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 9999999 }), {
            minLength: 1,
            maxLength: 100,
          }),
          (lineItems) => {
            const totals = calculateInvoiceTotals(lineItems)

            // Should not overflow or produce Infinity
            expect(isFinite(totals.subtotal)).toBe(true)
            expect(isFinite(totals.iva)).toBe(true)
            expect(isFinite(totals.total)).toBe(true)

            // All values must be non-negative
            expect(totals.subtotal).toBeGreaterThanOrEqual(0)
            expect(totals.iva).toBeGreaterThanOrEqual(0)
            expect(totals.total).toBeGreaterThanOrEqual(0)
          }
        )
      )
    })
  })

  describe('Subtotal Calculation', () => {
    it('should sum line items correctly', () => {
      fc.assert(
        fc.property(lineItemsArbitrary, (lineItems) => {
          const subtotal = calculateSubtotal(lineItems)
          const expectedSubtotal = lineItems.reduce((a, b) => a + b, 0)

          expect(subtotal).toBe(expectedSubtotal)
        })
      )
    })

    it('should return 0 for empty array', () => {
      const subtotal = calculateSubtotal([])
      expect(subtotal).toBe(0)
    })
  })

  describe('Total Calculation', () => {
    it('should equal subtotal plus IVA', () => {
      fc.assert(
        fc.property(centimosArbitrary, (subtotal) => {
          const total = calculateTotal(subtotal)
          const iva = calculateIVA(subtotal)

          expect(total).toBe(subtotal + iva)
        })
      )
    })
  })

  describe('Invoice Totals Calculation', () => {
    it('should return consistent results', () => {
      fc.assert(
        fc.property(lineItemsArbitrary, (lineItems) => {
          const totals = calculateInvoiceTotals(lineItems)

          // Verify consistency
          expect(totals.subtotal).toBe(calculateSubtotal(lineItems))
          expect(totals.iva).toBe(calculateIVA(totals.subtotal))
          expect(totals.total).toBe(calculateTotal(totals.subtotal))
        })
      )
    })
  })

  describe('Discount Application', () => {
    it('should apply discount correctly', () => {
      fc.assert(
        fc.property(
          centimosArbitrary,
          fc.integer({ min: 0, max: 100 }),
          (subtotal, discountPercent) => {
            const discounted = applyDiscount(subtotal, discountPercent)

            // Discounted amount must be less than or equal to original
            expect(discounted).toBeLessThanOrEqual(subtotal)

            // Discounted amount must be non-negative
            expect(discounted).toBeGreaterThanOrEqual(0)

            // Discounted amount must be integer
            expect(Number.isInteger(discounted)).toBe(true)

            // 0% discount should return original
            if (discountPercent === 0) {
              expect(discounted).toBe(subtotal)
            }

            // 100% discount should return 0
            if (discountPercent === 100) {
              expect(discounted).toBe(0)
            }
          }
        )
      )
    })

    it('should reject invalid discount percentages', () => {
      expect(() => applyDiscount(1000, -1)).toThrow()
      expect(() => applyDiscount(1000, 101)).toThrow()
    })
  })

  describe('Rounding', () => {
    it('should round to nearest centimo', () => {
      fc.assert(
        fc.property(fc.integer(), (amount) => {
          const rounded = roundToCentimo(amount)

          // Result must be integer
          expect(Number.isInteger(rounded)).toBe(true)

          // Result must be close to original
          expect(Math.abs(rounded - amount)).toBeLessThanOrEqual(1)
        })
      )
    })
  })
})

/**
 * Unit Tests for specific scenarios
 */
describe('Fiscal Calculator - Unit Tests', () => {
  describe('Real-world scenarios', () => {
    it('should calculate invoice for typical service order', () => {
      // Typical service order: cambio aceite (₡15,000) + frenos (₡25,000)
      const lineItems = [1500000, 2500000] // in centimos
      const totals = calculateInvoiceTotals(lineItems)

      expect(totals.subtotal).toBe(4000000) // ₡40,000
      expect(totals.iva).toBe(520000) // ₡5,200 (13% of ₡40,000)
      expect(totals.total).toBe(4520000) // ₡45,200
    })

    it('should handle small amounts', () => {
      const lineItems = [1, 2, 3] // ₡0.01, ₡0.02, ₡0.03
      const totals = calculateInvoiceTotals(lineItems)

      expect(totals.subtotal).toBe(6)
      expect(totals.iva).toBe(1) // Math.round(6 * 0.13) = 1
      expect(totals.total).toBe(7)
    })

    it('should handle mixed amounts', () => {
      const lineItems = [
        500000, // ₡5,000
        1250000, // ₡12,500
        750000, // ₡7,500
      ]
      const totals = calculateInvoiceTotals(lineItems)

      expect(totals.subtotal).toBe(2500000) // ₡25,000
      expect(totals.iva).toBe(325000) // ₡3,250
      expect(totals.total).toBe(2825000) // ₡28,250
    })
  })
})
