'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import {
  isValidCedulaJuridica,
  isValidPhoneNumber,
} from '@/lib/validation/cr-formats'

// Validation schema matching the API
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

type FormData = z.infer<typeof registerSchema>
type FormErrors = Partial<Record<keyof FormData, string>>

export default function RegistroPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    cedulaJuridica: '',
    nombreResponsable: '',
    telefono: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Input masks
  const handleCedulaChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '') // Remove non-digits

    // Apply mask: 3-###-######
    if (value.length > 0) {
      if (value.length <= 1) {
        value = value
      } else if (value.length <= 4) {
        value = `${value[0]}-${value.substring(1)}`
      } else {
        value = `${value[0]}-${value.substring(1, 4)}-${value.substring(4, 10)}`
      }
    }

    setFormData({ ...formData, cedulaJuridica: value })
    // Clear error when user types
    if (errors.cedulaJuridica) {
      setErrors({ ...errors, cedulaJuridica: undefined })
    }
  }

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '') // Remove non-digits

    // Apply mask: +506 ####-####
    if (value.length > 0) {
      // Remove 506 prefix if user typed it
      if (value.startsWith('506')) {
        value = value.substring(3)
      }

      if (value.length <= 4) {
        value = `+506 ${value}`
      } else {
        value = `+506 ${value.substring(0, 4)}-${value.substring(4, 8)}`
      }
    }

    setFormData({ ...formData, telefono: value })
    // Clear error when user types
    if (errors.telefono) {
      setErrors({ ...errors, telefono: undefined })
    }
  }

  const handleInputChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value })
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  // Password strength indicator
  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return { strength, label: 'Débil', color: 'bg-red-500' }
    if (strength === 3) return { strength, label: 'Media', color: 'bg-yellow-500' }
    return { strength, label: 'Fuerte', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setServerError('')

    // Validate form
    try {
      registerSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof FormData
          newErrors[field] = err.message
        })
        setErrors(newErrors)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details) {
          // Handle field-specific errors from server
          const newErrors: FormErrors = {}
          data.details.forEach((detail: { field: string; message: string }) => {
            newErrors[detail.field as keyof FormData] = detail.message
          })
          setErrors(newErrors)
        } else {
          setServerError(data.error || 'Error al registrar')
        }
        return
      }

      // Success - redirect to login with success message
      console.log('✅ Registration successful, redirecting to login...')
      window.location.href = '/login?registered=true'
    } catch (error) {
      console.error('Registration error:', error)
      setServerError('Error de conexión. Intente nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-center text-4xl font-bold text-blue-600">
            Taller Pro CR
          </h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Server error message */}
        {serverError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{serverError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Registration form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nombre del Taller */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Taller *
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                value={formData.nombre}
                onChange={handleInputChange('nombre')}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.nombre ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Taller Mecánico Los Ángeles"
                disabled={isSubmitting}
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            {/* Cédula Jurídica */}
            <div>
              <label htmlFor="cedulaJuridica" className="block text-sm font-medium text-gray-700 mb-1">
                Cédula Jurídica *
              </label>
              <input
                id="cedulaJuridica"
                name="cedulaJuridica"
                type="text"
                required
                value={formData.cedulaJuridica}
                onChange={handleCedulaChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.cedulaJuridica ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="3-101-123456"
                maxLength={12}
                disabled={isSubmitting}
              />
              {errors.cedulaJuridica && (
                <p className="mt-1 text-sm text-red-600">{errors.cedulaJuridica}</p>
              )}
            </div>

            {/* Nombre del Responsable */}
            <div>
              <label htmlFor="nombreResponsable" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Responsable *
              </label>
              <input
                id="nombreResponsable"
                name="nombreResponsable"
                type="text"
                required
                value={formData.nombreResponsable}
                onChange={handleInputChange('nombreResponsable')}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.nombreResponsable ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Juan Pérez"
                disabled={isSubmitting}
              />
              {errors.nombreResponsable && (
                <p className="mt-1 text-sm text-red-600">{errors.nombreResponsable}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                id="telefono"
                name="telefono"
                type="text"
                required
                value={formData.telefono}
                onChange={handlePhoneChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.telefono ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="+506 8765-4321"
                maxLength={15}
                disabled={isSubmitting}
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange('email')}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="correo@ejemplo.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange('password')}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Fortaleza:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength <= 2 ? 'text-red-600' :
                      passwordStrength.strength === 3 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Mínimo 8 caracteres, incluye mayúscula, minúscula y número
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creando cuenta...
                </span>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </div>
        </form>

        {/* Security notice */}
        <div className="text-center text-xs text-gray-500">
          <p>Al registrarte, aceptas nuestros términos de servicio</p>
          <p className="mt-1">Tu información está protegida con encriptación</p>
        </div>
      </div>
    </div>
  )
}
