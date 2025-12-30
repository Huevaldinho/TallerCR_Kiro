import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import prisma from '@/lib/prisma/client'
import {
  isValidCedulaJuridica,
  isValidPhoneNumber,
  formatCedulaJuridica,
  formatPhoneNumber,
} from '@/lib/validation/cr-formats'

// Validation schema for registration
const registerSchema = z.object({
  // Taller information
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Format phone and cedula
    const formattedPhone = formatPhoneNumber(validatedData.telefono)
    const formattedCedula = formatCedulaJuridica(validatedData.cedulaJuridica)

    // Check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // Check if taller email already exists
    const existingTallerByEmail = await prisma.taller.findUnique({
      where: { email: validatedData.email },
    })

    if (existingTallerByEmail) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // Check if cedula juridica already exists
    const existingTallerByCedula = await prisma.taller.findUnique({
      where: { cedulaJuridica: formattedCedula },
    })

    if (existingTallerByCedula) {
      return NextResponse.json(
        { error: 'Esta cédula jurídica ya está registrada' },
        { status: 400 }
      )
    }

    // Hash password with bcrypt (salt rounds: 12 for good security)
    const passwordHash = await bcrypt.hash(validatedData.password, 12)

    // Create taller and user in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create taller
      const taller = await tx.taller.create({
        data: {
          nombre: validatedData.nombre,
          cedulaJuridica: formattedCedula,
          nombreResponsable: validatedData.nombreResponsable,
          telefono: formattedPhone,
          email: validatedData.email,
        },
      })

      // Create user linked to taller
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash,
          tallerId: taller.id,
        },
      })

      return { taller, user }
    })

    // Return success (don't include sensitive data)
    return NextResponse.json(
      {
        message: 'Registro exitoso',
        taller: {
          id: result.taller.id,
          nombre: result.taller.nombre,
          email: result.taller.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Error al registrar. Intente nuevamente.' },
      { status: 500 }
    )
  }
}
