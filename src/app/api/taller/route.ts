/**
 * Taller API Routes
 * 
 * GET /api/taller - Get current taller information
 * PATCH /api/taller - Update taller fiscal configuration
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentTallerId } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma/client'
import { z } from 'zod'

// Validation schema for fiscal configuration
const fiscalConfigSchema = z.object({
  nombreComercial: z.string().min(1, 'Nombre comercial es requerido'),
  actividadEconomica: z.string().min(1, 'Actividad económica es requerida'),
  provincia: z.string().min(1, 'Provincia es requerida'),
  canton: z.string().min(1, 'Cantón es requerido'),
  distrito: z.string().min(1, 'Distrito es requerido'),
  barrio: z.string().optional(),
  otrasSenas: z.string().optional(),
})

/**
 * GET /api/taller
 * Get current taller information
 */
export async function GET(request: NextRequest) {
  try {
    const tallerId = await getCurrentTallerId()
    
    if (!tallerId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const taller = await prisma.taller.findUnique({
      where: { id: tallerId },
      select: {
        id: true,
        nombre: true,
        cedulaJuridica: true,
        nombreResponsable: true,
        telefono: true,
        email: true,
        nombreComercial: true,
        actividadEconomica: true,
        provincia: true,
        canton: true,
        distrito: true,
        barrio: true,
        otrasSenas: true,
      },
    })

    if (!taller) {
      return NextResponse.json(
        { error: 'Taller no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(taller)
  } catch (error) {
    console.error('Error fetching taller:', error)
    return NextResponse.json(
      { error: 'Error al obtener datos del taller' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/taller
 * Update taller fiscal configuration
 */
export async function PATCH(request: NextRequest) {
  try {
    const tallerId = await getCurrentTallerId()
    
    if (!tallerId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate fiscal configuration
    const validation = fiscalConfigSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: validation.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // Update taller fiscal configuration
    const updatedTaller = await prisma.taller.update({
      where: { id: tallerId },
      data: {
        nombreComercial: data.nombreComercial,
        actividadEconomica: data.actividadEconomica,
        provincia: data.provincia,
        canton: data.canton,
        distrito: data.distrito,
        barrio: data.barrio || null,
        otrasSenas: data.otrasSenas || null,
      },
      select: {
        id: true,
        nombre: true,
        nombreComercial: true,
        actividadEconomica: true,
        provincia: true,
        canton: true,
        distrito: true,
        barrio: true,
        otrasSenas: true,
      },
    })

    return NextResponse.json(updatedTaller)
  } catch (error) {
    console.error('Error updating taller:', error)
    return NextResponse.json(
      { error: 'Error al actualizar configuración fiscal' },
      { status: 500 }
    )
  }
}
