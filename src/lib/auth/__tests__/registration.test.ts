/**
 * Unit Tests for Registration
 * 
 * Tests specific examples and edge cases for registration functionality
 */

import { z } from 'zod'
import {
  isValidCedulaJuridica,
  isValidPhoneNumber,
  formatCedulaJuridica,
  formatPhoneNumber,
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

describe('Registration Validation - Unit Tests', () => {
  describe('Valid Registration Data', () => {
    it('should accept valid registration data', () => {
      const validData = {
        nombre: 'Taller Mecánico Central',
        cedulaJuridica: '3-101-123456',
        nombreResponsable: 'Juan Pérez',
        telefono: '+506 8765-4321',
        email: 'juan@tallermec.cr',
        password: 'SecurePass123',
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept cedula juridica with different formatting', () => {
      const testCases = [
        '3-101-123456',
        '3101123456', // Without hyphens
        '3-101-123456', // Standard format
      ]

      testCases.forEach((cedula) => {
        const data = {
          nombre: 'Taller Test',
          cedulaJuridica: cedula,
          nombreResponsable: 'Test User',
          telefono: '+506 8765-4321',
          email: 'test@test.com',
          password: 'Password123',
        }

        const result = registerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should accept phone with different formatting', () => {
      const testCases = [
        '+506 8765-4321',
        '+50687654321', // Without spaces/hyphens
        '87654321', // Without country code
      ]

      testCases.forEach((phone) => {
        const data = {
          nombre: 'Taller Test',
          cedulaJuridica: '3-101-123456',
          nombreResponsable: 'Test User',
          telefono: phone,
          email: 'test@test.com',
          password: 'Password123',
        }

        const result = registerSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Invalid Registration Data', () => {
    it('should reject empty nombre', () => {
      const data = {
        nombre: '',
        cedulaJuridica: '3-101-123456',
        nombreResponsable: 'Juan Pérez',
        telefono: '+506 8765-4321',
        email: 'juan@tallermec.cr',
        password: 'SecurePass123',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('al menos 3 caracteres')
      }
    })

    it('should reject nombre with less than 3 characters', () => {
      const data = {
        nombre: 'ab',
        cedulaJuridica: '3-101-123456',
        nombreResponsable: 'Juan Pérez',
        telefono: '+506 8765-4321',
        email: 'juan@tallermec.cr',
        password: 'SecurePass123',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject invalid cedula juridica format', () => {
      const invalidCedulas = [
        '1-234-567890', // Wrong first digit (should be 3)
        '3-12-123456', // Wrong second group length
        '3-101-12345', // Wrong third group length
        'invalid',
        '123456789',
      ]

      invalidCedulas.forEach((cedula) => {
        const data = {
          nombre: 'Taller Test',
          cedulaJuridica: cedula,
          nombreResponsable: 'Test User',
          telefono: '+506 8765-4321',
          email: 'test@test.com',
          password: 'Password123',
        }

        const result = registerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    it('should reject invalid phone format', () => {
      const invalidPhones = [
        '+507 8765-4321', // Wrong country code
        '123', // Too short
        'invalid',
        '+506 123', // Incomplete
      ]

      invalidPhones.forEach((phone) => {
        const data = {
          nombre: 'Taller Test',
          cedulaJuridica: '3-101-123456',
          nombreResponsable: 'Test User',
          telefono: phone,
          email: 'test@test.com',
          password: 'Password123',
        }

        const result = registerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    it('should reject invalid email format', () => {
      const invalidEmails = [
        'notanemail',
        '@nodomain.com',
        'missing@',
        'missing.com',
        '',
      ]

      invalidEmails.forEach((email) => {
        const data = {
          nombre: 'Taller Test',
          cedulaJuridica: '3-101-123456',
          nombreResponsable: 'Test User',
          telefono: '+506 8765-4321',
          email,
          password: 'Password123',
        }

        const result = registerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    it('should reject password without uppercase', () => {
      const data = {
        nombre: 'Taller Test',
        cedulaJuridica: '3-101-123456',
        nombreResponsable: 'Test User',
        telefono: '+506 8765-4321',
        email: 'test@test.com',
        password: 'lowercase123',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('mayúscula')
      }
    })

    it('should reject password without lowercase', () => {
      const data = {
        nombre: 'Taller Test',
        cedulaJuridica: '3-101-123456',
        nombreResponsable: 'Test User',
        telefono: '+506 8765-4321',
        email: 'test@test.com',
        password: 'UPPERCASE123',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('minúscula')
      }
    })

    it('should reject password without number', () => {
      const data = {
        nombre: 'Taller Test',
        cedulaJuridica: '3-101-123456',
        nombreResponsable: 'Test User',
        telefono: '+506 8765-4321',
        email: 'test@test.com',
        password: 'NoNumbers',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('número')
      }
    })

    it('should reject password shorter than 8 characters', () => {
      const data = {
        nombre: 'Taller Test',
        cedulaJuridica: '3-101-123456',
        nombreResponsable: 'Test User',
        telefono: '+506 8765-4321',
        email: 'test@test.com',
        password: 'Short1',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('8 caracteres')
      }
    })
  })

  describe('Format Helpers', () => {
    it('should format cedula juridica correctly', () => {
      expect(formatCedulaJuridica('3101123456')).toBe('3-101-123456')
      expect(formatCedulaJuridica('3-101-123456')).toBe('3-101-123456')
    })

    it('should format phone number correctly', () => {
      expect(formatPhoneNumber('87654321')).toBe('+506 8765-4321')
      expect(formatPhoneNumber('+50687654321')).toBe('+506 8765-4321')
      expect(formatPhoneNumber('+506 8765-4321')).toBe('+506 8765-4321')
    })

    it('should validate cedula juridica format', () => {
      expect(isValidCedulaJuridica('3-101-123456')).toBe(true)
      expect(isValidCedulaJuridica('3101123456')).toBe(true)
      expect(isValidCedulaJuridica('1-234-567890')).toBe(false)
      expect(isValidCedulaJuridica('invalid')).toBe(false)
    })

    it('should validate phone number format', () => {
      expect(isValidPhoneNumber('+506 8765-4321')).toBe(true)
      expect(isValidPhoneNumber('87654321')).toBe(true)
      expect(isValidPhoneNumber('+50687654321')).toBe(true)
      expect(isValidPhoneNumber('+507 8765-4321')).toBe(false)
      expect(isValidPhoneNumber('invalid')).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle whitespace in fields', () => {
      const data = {
        nombre: '  Taller Test  ',
        cedulaJuridica: '3-101-123456',
        nombreResponsable: '  Test User  ',
        telefono: '+506 8765-4321',
        email: 'test@test.com',
        password: 'Password123',
      }

      const result = registerSchema.safeParse(data)
      // Zod doesn't trim by default, so this should pass
      expect(result.success).toBe(true)
    })

    it('should handle special characters in nombre', () => {
      const data = {
        nombre: 'Taller Mecánico José & Hijos',
        cedulaJuridica: '3-101-123456',
        nombreResponsable: 'José María',
        telefono: '+506 8765-4321',
        email: 'test@test.com',
        password: 'Password123',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should handle maximum length password', () => {
      const data = {
        nombre: 'Taller Test',
        cedulaJuridica: '3-101-123456',
        nombreResponsable: 'Test User',
        telefono: '+506 8765-4321',
        email: 'test@test.com',
        password: 'A'.repeat(50) + 'a1', // Very long password
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})
