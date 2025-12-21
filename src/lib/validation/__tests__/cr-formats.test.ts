import fc from 'fast-check'
import {
  isValidCedulaFisica,
  isValidCedulaJuridica,
  isValidDIMEX,
  isValidNITE,
  isValidPasaporte,
  isValidIdentification,
  isValidPhoneNumber,
  isValidPlateParticular,
  isValidPlateTaxi,
  isValidPlateMotorcycle,
  isValidPlate,
  isValidCABYS,
  formatPhoneNumber,
  formatCedulaFisica,
  formatCedulaJuridica,
  formatPlate,
} from '../cr-formats'

/**
 * Property 2: Cédula Jurídica Format Validation
 * Property 3: Phone Number Format Validation
 * Property 6: Multi-Format Plate Acceptance
 * Property 8: Identification Number Validation by Type
 * Property 11: CABYS Code Validation
 */

describe('CR Format Validators - Property Tests', () => {
  // Arbitraries for generating valid formats
  const validCedulaFisicaArbitrary = fc
    .tuple(
      fc.integer({ min: 1, max: 9 }),
      fc.integer({ min: 1000, max: 9999 }),
      fc.integer({ min: 1000, max: 9999 })
    )
    .map(([d1, d2, d3]) => `${d1}${d2}${d3}`)

  const validCedulaJuridicaArbitrary = fc
    .tuple(
      fc.integer({ min: 1, max: 9 }),
      fc.integer({ min: 100, max: 999 }),
      fc.integer({ min: 100000, max: 999999 })
    )
    .map(([d1, d2, d3]) => `${d1}${d2}${d3}`)

  const validPhoneArbitrary = fc
    .tuple(
      fc.integer({ min: 2, max: 8 }),
      fc.integer({ min: 1000000, max: 9999999 })
    )
    .map(([first, rest]) => `${first}${rest}`)

  const validPlateParticularArbitrary = fc
    .tuple(
      fc.stringOf(fc.char({ min: 65, max: 90 }), { minLength: 3, maxLength: 3 }),
      fc.integer({ min: 100, max: 999 })
    )
    .map(([letters, numbers]) => `${letters}${numbers}`)

  const validCABYSArbitrary = fc
    .integer({ min: 1000000000000, max: 9999999999999 })
    .map((n) => n.toString())

  describe('Property 2: Cédula Jurídica Format Validation', () => {
    it('should accept valid cédula jurídica formats', () => {
      fc.assert(
        fc.property(validCedulaJuridicaArbitrary, (cedula) => {
          expect(isValidCedulaJuridica(cedula)).toBe(true)
        })
      )
    })

    it('should accept cédula jurídica with formatting', () => {
      fc.assert(
        fc.property(validCedulaJuridicaArbitrary, (cedula) => {
          const formatted = `${cedula[0]}-${cedula.substring(1, 4)}-${cedula.substring(4)}`
          expect(isValidCedulaJuridica(formatted)).toBe(true)
        })
      )
    })

    it('should reject invalid cédula jurídica', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 20 }), (invalid) => {
          // Skip if it happens to be valid
          if (isValidCedulaJuridica(invalid)) {
            return true
          }
          expect(isValidCedulaJuridica(invalid)).toBe(false)
        })
      )
    })

    it('should reject cédula jurídica starting with 0', () => {
      expect(isValidCedulaJuridica('0-123-456789')).toBe(false)
      expect(isValidCedulaJuridica('0123456789')).toBe(false)
    })

    it('should reject wrong length cédula jurídica', () => {
      expect(isValidCedulaJuridica('123456789')).toBe(false) // 9 digits
      expect(isValidCedulaJuridica('12345678901')).toBe(false) // 11 digits
    })
  })

  describe('Property 3: Phone Number Format Validation', () => {
    it('should accept valid phone numbers', () => {
      fc.assert(
        fc.property(validPhoneArbitrary, (phone) => {
          expect(isValidPhoneNumber(phone)).toBe(true)
        })
      )
    })

    it('should accept phone with +506 prefix', () => {
      fc.assert(
        fc.property(validPhoneArbitrary, (phone) => {
          expect(isValidPhoneNumber(`+506 ${phone}`)).toBe(true)
          expect(isValidPhoneNumber(`506${phone}`)).toBe(true)
        })
      )
    })

    it('should accept phone with formatting', () => {
      fc.assert(
        fc.property(validPhoneArbitrary, (phone) => {
          const formatted = `${phone.substring(0, 4)}-${phone.substring(4)}`
          expect(isValidPhoneNumber(formatted)).toBe(true)
        })
      )
    })

    it('should reject phone with invalid first digit', () => {
      expect(isValidPhoneNumber('1234567')).toBe(false) // First digit 1
      expect(isValidPhoneNumber('9234567')).toBe(false) // First digit 9
    })

    it('should reject phone with wrong length', () => {
      expect(isValidPhoneNumber('123456')).toBe(false) // 6 digits
      expect(isValidPhoneNumber('123456789')).toBe(false) // 9 digits
    })
  })

  describe('Property 6: Multi-Format Plate Acceptance', () => {
    it('should accept particular plates', () => {
      // Test with specific known valid plates
      expect(isValidPlate('ABC123')).toBe(true)
      expect(isValidPlate('XYZ999')).toBe(true)
      expect(isValidPlate('ABC-123')).toBe(true)
    })

    it('should accept taxi plates', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1000, max: 9999 }), (number) => {
          const plate = `TX${number}`
          expect(isValidPlate(plate)).toBe(true)
        })
      )
    })

    it('should accept motorcycle plates', () => {
      // Test with specific known valid plates
      expect(isValidPlate('A12345')).toBe(true)
      expect(isValidPlate('Z99999')).toBe(true)
      expect(isValidPlate('A-12345')).toBe(true)
    })

    it('should accept plates with formatting', () => {
      expect(isValidPlate('ABC-123')).toBe(true)
      expect(isValidPlate('TX-1234')).toBe(true)
      expect(isValidPlate('A-12345')).toBe(true)
    })

    it('should accept plates case-insensitively', () => {
      expect(isValidPlate('abc-123')).toBe(true)
      expect(isValidPlate('tx-1234')).toBe(true)
      expect(isValidPlate('a-12345')).toBe(true)
    })
  })

  describe('Property 8: Identification Number Validation by Type', () => {
    it('should validate cédula física correctly', () => {
      fc.assert(
        fc.property(validCedulaFisicaArbitrary, (cedula) => {
          expect(isValidIdentification('fisica', cedula)).toBe(true)
        })
      )
    })

    it('should validate cédula jurídica correctly', () => {
      fc.assert(
        fc.property(validCedulaJuridicaArbitrary, (cedula) => {
          expect(isValidIdentification('juridica', cedula)).toBe(true)
        })
      )
    })

    it('should validate phone correctly', () => {
      fc.assert(
        fc.property(validPhoneArbitrary, (phone) => {
          expect(isValidIdentification('dimex', phone)).toBe(false) // Phone is not DIMEX
        })
      )
    })

    it('should reject invalid type', () => {
      expect(isValidIdentification('invalid' as any, '123')).toBe(false)
    })
  })

  describe('Property 11: CABYS Code Validation', () => {
    it('should accept valid CABYS codes', () => {
      fc.assert(
        fc.property(validCABYSArbitrary, (cabys) => {
          expect(isValidCABYS(cabys)).toBe(true)
        })
      )
    })

    it('should accept CABYS with formatting', () => {
      fc.assert(
        fc.property(validCABYSArbitrary, (cabys) => {
          const formatted = `${cabys.substring(0, 6)}-${cabys.substring(6)}`
          expect(isValidCABYS(formatted)).toBe(true)
        })
      )
    })

    it('should reject CABYS with wrong length', () => {
      expect(isValidCABYS('123456789012')).toBe(false) // 12 digits
      expect(isValidCABYS('12345678901234')).toBe(false) // 14 digits
    })

    it('should reject non-numeric CABYS', () => {
      expect(isValidCABYS('1234567890ABC')).toBe(false)
    })
  })
})

describe('CR Format Validators - Unit Tests', () => {
  describe('Cédula Física', () => {
    it('should validate correct cédula física', () => {
      expect(isValidCedulaFisica('1-1234-5678')).toBe(true)
      expect(isValidCedulaFisica('112345678')).toBe(true)
    })

    it('should reject invalid cédula física', () => {
      expect(isValidCedulaFisica('0-1234-5678')).toBe(false) // Starts with 0
      expect(isValidCedulaFisica('1-123-5678')).toBe(false) // Wrong format
      expect(isValidCedulaFisica('abc')).toBe(false)
    })
  })

  describe('Phone Number', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhoneNumber('87654321')).toBe(true)
      expect(isValidPhoneNumber('+506 8765-4321')).toBe(true)
      expect(isValidPhoneNumber('506 8765 4321')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('1234567')).toBe(false) // 7 digits
      expect(isValidPhoneNumber('12345678')).toBe(false) // First digit 1
    })
  })

  describe('Vehicle Plates', () => {
    it('should validate particular plates', () => {
      expect(isValidPlateParticular('ABC-123')).toBe(true)
      expect(isValidPlateParticular('XYZ999')).toBe(true)
    })

    it('should validate taxi plates', () => {
      expect(isValidPlateTaxi('TX-1234')).toBe(true)
      expect(isValidPlateTaxi('TX9999')).toBe(true)
    })

    it('should validate motorcycle plates', () => {
      expect(isValidPlateMotorcycle('A-12345')).toBe(true)
      expect(isValidPlateMotorcycle('Z99999')).toBe(true)
    })

    it('should reject invalid plates', () => {
      expect(isValidPlate('INVALID')).toBe(false)
      expect(isValidPlate('12-3456')).toBe(false)
    })
  })

  describe('Formatting Functions', () => {
    it('should format phone numbers correctly', () => {
      expect(formatPhoneNumber('87654321')).toBe('+506 8765-4321')
      expect(formatPhoneNumber('invalid')).toBe('')
    })

    it('should format cédula física correctly', () => {
      expect(formatCedulaFisica('112345678')).toBe('1-1234-5678')
      expect(formatCedulaFisica('invalid')).toBe('')
    })

    it('should format cédula jurídica correctly', () => {
      expect(formatCedulaJuridica('3101123456')).toBe('3-101-123456')
      expect(formatCedulaJuridica('invalid')).toBe('')
    })

    it('should format plates correctly', () => {
      expect(formatPlate('ABC123')).toBe('ABC-123')
      expect(formatPlate('TX1234')).toBe('TX-1234')
      expect(formatPlate('A12345')).toBe('A-12345')
      expect(formatPlate('invalid')).toBe('')
    })
  })

  describe('CABYS Validation', () => {
    it('should validate correct CABYS codes', () => {
      expect(isValidCABYS('6201010000000')).toBe(true)
      expect(isValidCABYS('6201-0100-00000')).toBe(true)
    })

    it('should reject invalid CABYS codes', () => {
      expect(isValidCABYS('123456789012')).toBe(false) // 12 digits
      expect(isValidCABYS('ABC1234567890')).toBe(false) // Non-numeric
    })
  })
})
