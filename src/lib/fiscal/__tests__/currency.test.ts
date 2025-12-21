import {
  toCentimos,
  fromCentimos,
  formatCRC,
  parseCRC,
  formatCRCForInput,
  formatCRCForDisplay,
  formatCRCForInvoice,
} from '../currency'

describe('Currency Utilities', () => {
  describe('toCentimos', () => {
    it('should convert colones to centimos', () => {
      expect(toCentimos(1)).toBe(100)
      expect(toCentimos(10)).toBe(1000)
      expect(toCentimos(100)).toBe(10000)
      expect(toCentimos(1234.56)).toBe(123456)
    })

    it('should handle zero', () => {
      expect(toCentimos(0)).toBe(0)
    })

    it('should round to nearest centimo', () => {
      expect(toCentimos(1.234)).toBe(123)
      expect(toCentimos(1.235)).toBe(124)
      expect(toCentimos(1.999)).toBe(200)
    })

    it('should handle large amounts', () => {
      expect(toCentimos(999999.99)).toBe(99999999)
    })
  })

  describe('fromCentimos', () => {
    it('should convert centimos to colones', () => {
      expect(fromCentimos(100)).toBe(1)
      expect(fromCentimos(1000)).toBe(10)
      expect(fromCentimos(10000)).toBe(100)
      expect(fromCentimos(123456)).toBe(1234.56)
    })

    it('should handle zero', () => {
      expect(fromCentimos(0)).toBe(0)
    })

    it('should handle large amounts', () => {
      expect(fromCentimos(99999999)).toBe(999999.99)
    })
  })

  describe('formatCRC', () => {
    it('should format with symbol by default', () => {
      const formatted = formatCRC(123456)
      expect(formatted).toContain('₡')
      // Costa Rican locale uses space as thousands separator and comma as decimal
      expect(formatted).toMatch(/1\s*234[.,]56/)
    })

    it('should format without symbol when requested', () => {
      const formatted = formatCRC(123456, { showSymbol: false })
      expect(formatted).not.toContain('₡')
      expect(formatted).toMatch(/1\s*234[.,]56/)
    })

    it('should format without decimals when requested', () => {
      const formatted = formatCRC(123456, { showDecimals: false })
      expect(formatted).toContain('₡')
      // Should be rounded to 1,235
      expect(formatted).toMatch(/1\s*235/)
    })

    it('should handle zero', () => {
      const formatted = formatCRC(0)
      expect(formatted).toContain('₡')
      expect(formatted).toMatch(/0[.,]?0?0?/)
    })

    it('should handle large amounts', () => {
      const formatted = formatCRC(99999999)
      expect(formatted).toContain('₡')
      expect(formatted).toMatch(/999\s*999[.,]99/)
    })

    it('should handle small amounts', () => {
      const formatted = formatCRC(1)
      expect(formatted).toContain('₡')
      expect(formatted).toMatch(/0[.,]01/)
    })
  })

  describe('parseCRC', () => {
    it('should parse formatted currency strings', () => {
      expect(parseCRC('₡1,234.56')).toBe(123456)
      expect(parseCRC('1,234.56')).toBe(123456)
      expect(parseCRC('1234.56')).toBe(123456)
    })

    it('should handle zero', () => {
      expect(parseCRC('₡0.00')).toBe(0)
      expect(parseCRC('0')).toBe(0)
    })

    it('should handle large amounts', () => {
      expect(parseCRC('₡999,999.99')).toBe(99999999)
    })

    it('should throw on invalid format', () => {
      expect(() => parseCRC('invalid')).toThrow()
      expect(() => parseCRC('abc.def')).toThrow()
    })
  })

  describe('formatCRCForInput', () => {
    it('should format without symbol', () => {
      const formatted = formatCRCForInput(123456)
      expect(formatted).not.toContain('₡')
      expect(formatted).toMatch(/1\s*234[.,]56/)
    })
  })

  describe('formatCRCForDisplay', () => {
    it('should format with symbol', () => {
      const formatted = formatCRCForDisplay(123456)
      expect(formatted).toContain('₡')
      expect(formatted).toMatch(/1\s*234[.,]56/)
    })
  })

  describe('formatCRCForInvoice', () => {
    it('should format for invoice display', () => {
      const formatted = formatCRCForInvoice(123456)
      expect(formatted).toContain('₡')
      expect(formatted).toMatch(/1\s*234[.,]56/)
    })
  })

  describe('Round-trip conversion', () => {
    it('should maintain precision in round-trip conversion', () => {
      const original = 123456
      const colones = fromCentimos(original)
      const converted = toCentimos(colones)

      expect(converted).toBe(original)
    })

    it('should maintain precision through format and parse', () => {
      const original = 123456
      const formatted = formatCRC(original, { showSymbol: false })
      const parsed = parseCRC(formatted)

      expect(parsed).toBe(original)
    })
  })
})
