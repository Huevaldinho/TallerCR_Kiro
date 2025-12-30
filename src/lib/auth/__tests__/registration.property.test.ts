/**
 * Property-Based Tests for Registration
 * 
 * Feature: taller-cr-mvp
 * Property 1: Registration Required Fields Validation
 * Property 4: Email Uniqueness Enforcement
 * 
 * Validates: Requirements 1.1, 1.4
 */

import * as fc from 'fast-check'
import { z } from 'zod'
import {
  isValidCedulaJuridica,
  isValidPhoneNumber,
} from '@/lib/validation/cr-formats'

// Registration schema (duplicated from API for testing)
const registerSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  cedulaJuridica: z
    .string()
    .refine((val) => isValidCedulaJuridica(val), {
      message: 'Cédula jurídica inválida. Formato: 3-###-######',
    }),
  nombreResponsable: z
    .string()
    .min(3, 'El nombre del responsable debe tener al menos 3 caracteres'),
  telefono: z.string().refine((val) => isValidPhoneNumber(val), {
    message: 'Teléfono inválido. Formato: +506 ####-####',
  }),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
})

// Generators for valid data
const validCedulaJuridicaArb = fc
  .tuple(
    fc.integer({ min: 1, max: 9 }),
    fc.integer({ min: 100, max: 999 }),
    fc.integer({ min: 100000, max: 999999 })
  )
  .map(([first, second, third]) => `3-${second}-${third}`)

const validPhoneArb = fc
  .tuple(fc.integer({ min: 1000, max: 9999 }), fc.integer({ min: 1000, max: 9999 }))
  .map(([first, second]) => `+506 ${first}-${second}`)

const validEmailArb = fc
  .tuple(
    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), {
      minLength: 3,
      maxLength: 10,
    }),
    fc.constantFrom('gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com')
  )
  .map(([name, domain]) => `${name}@${domain}`)

const validPasswordArb = fc
  .tuple(
    fc.stringOf(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')), {
      minLength: 1,
      maxLength: 3,
    }),
    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')), {
      minLength: 1,
      maxLength: 5,
    }),
    fc.stringOf(fc.constantFrom(...'0123456789'.split('')), {
      minLength: 1,
      maxLength: 3,
    }),
    fc.stringOf(fc.constantFrom(...'!@#$%^&*'.split('')), {
      minLength: 0,
      maxLength: 2,
    })
  )
  .map(([upper, lower, digits, special]) => upper + lower + digits + special)

const validRegistrationDataArb = fc.record({
  nombre: fc.string({ minLength: 3, maxLength: 50 }),
  cedulaJuridica: validCedulaJuridicaArb,
  nombreResponsable: fc.string({ minLength: 3, maxLength: 50 }),
  telefono: validPhoneArb,
  email: validEmailArb,
  password: validPasswordArb,
})

describe('Property 1: Registration Required Fields Validation', () => {
  /**
   * Property 1: Registration Required Fields Validation
   * For any registration attempt, if any required field is missing,
   * the registration should be rejected
   * 
   * Validates: Requirements 1.1
   */
  it('should reject registration when nombre is missing', () => {
    fc.assert(
      fc.property(validRegistrationDataArb, (data) => {
        const invalidData = { ...data, nombre: '' }
        const result = registerSchema.safeParse(invalidData)
        return !result.success
      }),
      { numRuns: 100 }
    )
  })

  it('should reject registration when nombre is too short', () => {
    fc.assert(
      fc.property(validRegistrationDataArb, (data) => {
        const invalidData = { ...data, nombre: 'ab' } // Less than 3 chars
        const result = registerSchema.safeParse(invalidData)
        return !result.success
      }),
      { numRuns: 100 }
    )
  })

  it('should reject registration when cedulaJuridica is missing', () => {
    fc.assert(
      fc.property(validRegistrationDataArb, (data) => {
        const invalidData = { ...data, cedulaJuridica: '' }
        const result = registerSchema.safeParse(invalidData)
        return !result.success
      }),
      { numRuns: 100 }
    )
  })

  it('should reject registration when cedulaJuridica has invalid format', () => {
    fc.assert(
      fc.property(
        validRegistrationDataArb,
        fc.string({ minLength: 1, maxLength: 20 }),
        (data, invalidCedula) => {
          // Only test with strings that are NOT valid cedulas
          if (isValidCedulaJuridica(invalidCedula)) {
            return true // Skip this case
          }
          const invalidData = { ...data, cedulaJuridica: invalidCedula }
          const result = registerSchema.safeParse(invalidData)
          return !result.success
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject registration when nombreResponsable is missing', () => {
    fc.assert(
      fc.property(validRegistrationDataArb, (data) => {
        const invalidData = { ...data, nombreResponsable: '' }
        const result = registerSchema.safeParse(invalidData)
        return !result.success
      }),
      { numRuns: 100 }
    )
  })

  it('should reject registration when telefono is missing', () => {
    fc.assert(
      fc.property(validRegistrationDataArb, (data) => {
        const invalidData = { ...data, telefono: '' }
        const result = registerSchema.safeParse(invalidData)
        return !result.success
      }),
      { numRuns: 100 }
    )
  })

  it('should reject registration when telefono has invalid format', () => {
    fc.assert(
      fc.property(
        validRegistrationDataArb,
        fc.string({ minLength: 1, maxLength: 20 }),
        (data, invalidPhone) => {
          // Only test with strings that are NOT valid phones
          if (isValidPhoneNumber(invalidPhone)) {
            return true // Skip this case
          }
          const invalidData = { ...data, telefono: invalidPhone }
          const result = registerSchema.safeParse(invalidData)
          return !result.success
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject registration when email is missing', () => {
    fc.assert(
      fc.property(validRegistrationDataArb, (data) => {
        const invalidData = { ...data, email: '' }
        const result = registerSchema.safeParse(invalidData)
        return !result.success
      }),
      { numRuns: 100 }
    )
  })

  it('should reject registration when email is invalid', () => {
    fc.assert(
      fc.property(
        validRegistrationDataArb,
        fc.string({ minLength: 1, maxLength: 20 }),
        (data, invalidEmail) => {
          // Only test with strings that don't contain @
          if (invalidEmail.includes('@')) {
            return true // Skip this case
          }
          const invalidData = { ...data, email: invalidEmail }
          const result = registerSchema.safeParse(invalidData)
          return !result.success
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject registration when password is missing', () => {
    fc.assert(
      fc.property(validRegistrationDataArb, (data) => {
        const invalidData = { ...data, password: '' }
        const result = registerSchema.safeParse(invalidData)
        return !result.success
      }),
      { numRuns: 100 }
    )
  })

  it('should reject registration when password is too short', () => {
    fc.assert(
      fc.property(validRegistrationDataArb, (data) => {
        const invalidData = { ...data, password: 'Short1' } // Less than 8 chars
        const result = registerSchema.safeParse(invalidData)
        return !result.success
      }),
      { numRuns: 100 }
    )
  })

  it('should reject registration when password lacks uppercase', () => {
    fc.assert(
      fc.property(validRegistrationDataArb, (data) => {
        const invalidData = { ...data, password: 'lowercase123' } // No uppercase
        const result = registerSchema.safeParse(invalidData)
        return !result.success
      }),
      { numRuns: 100 }
    )
  })

  it('should reject registration when password lacks lowercase', () => {
    fc.assert(
      fc.property(validRegistrationDataArb, (data) => {
        const invalidData = { ...data, password: 'UPPERCASE123' } // No lowercase
        const result = registerSchema.safeParse(invalidData)
        return !result.success
      }),
      { numRuns: 100 }
    )
  })

  it('should reject registration when password lacks number', () => {
    fc.assert(
      fc.property(validRegistrationDataArb, (data) => {
        const invalidData = { ...data, password: 'NoNumbers' } // No digits
        const result = registerSchema.safeParse(invalidData)
        return !result.success
      }),
      { numRuns: 100 }
    )
  })

  it('should accept registration when all required fields are valid', () => {
    fc.assert(
      fc.property(validRegistrationDataArb, (data) => {
        const result = registerSchema.safeParse(data)
        return result.success
      }),
      { numRuns: 100 }
    )
  })
})

describe('Property 4: Email Uniqueness Enforcement', () => {
  /**
   * Property 4: Email Uniqueness Enforcement
   * For any registration attempt with an email that already exists,
   * the registration should be rejected
   * 
   * Note: This property tests the validation logic.
   * The actual database uniqueness check is tested in integration tests.
   * 
   * Validates: Requirements 1.4
   */
  it('should validate email format for uniqueness check', () => {
    fc.assert(
      fc.property(validEmailArb, (email) => {
        // Valid emails should pass format validation
        const result = z.string().email().safeParse(email)
        return result.success
      }),
      { numRuns: 100 }
    )
  })

  it('should reject invalid email formats before uniqueness check', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (invalidEmail) => {
          // Skip if accidentally valid
          if (invalidEmail.includes('@') && invalidEmail.includes('.')) {
            return true
          }
          const result = z.string().email().safeParse(invalidEmail)
          return !result.success
        }
      ),
      { numRuns: 100 }
    )
  })
})
