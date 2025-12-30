/**
 * Orders API
 * GET /api/ordenes - List all orders
 * POST /api/ordenes - Create new order
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getCurrentTallerId } from '@/lib/auth/session'

export async function GET() {
  try {
    const tallerId = await getCurrentTallerId()
    if (!tallerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ✅ CORRECTO: Usar include para traer todas las relaciones
    const orders = await prisma.serviceOrder.findMany({
      where: { tallerId },
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: true,
        client: true,
        lineItems: true,
        images: true,
      }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const tallerId = await getCurrentTallerId()
    if (!tallerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { vehicleId, clientId, motivoIngreso, lineItems } = body

    // ✅ VALIDAR: Verificar que vehicle y client existen
    const [vehicle, client] = await Promise.all([
      prisma.vehicle.findUnique({ where: { id: vehicleId } }),
      prisma.client.findUnique({ where: { id: clientId } })
    ])

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Calculate totals
    let subtotalCentimos = 0
    let ivaCentimos = 0
    
    const processedLineItems = lineItems.map((item: { descripcion: string; cabysCode: string; cantidad: number; precioUnitarioCentimos: number }, index: number) => {
      const subtotal = item.cantidad * item.precioUnitarioCentimos
      const iva = Math.round(subtotal * 0.13)
      subtotalCentimos += subtotal
      ivaCentimos += iva
      
      return {
        numeroLinea: index + 1,
        descripcion: item.descripcion,
        cabysCode: item.cabysCode,
        cantidad: item.cantidad,
        precioUnitarioCentimos: item.precioUnitarioCentimos,
        subtotalCentimos: subtotal,
        ivaCentimos: iva,
        totalLineaCentimos: subtotal + iva,
      }
    })

    // ✅ TRANSACCIÓN: Crear orden con line items de forma atómica
    const order = await prisma.$transaction(async (tx: any) => {
      // Generate order number dentro de la transacción
      const count = await tx.serviceOrder.count({ where: { tallerId } })
      const orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`

      return await tx.serviceOrder.create({
        data: {
          tallerId,
          vehicleId,
          clientId,
          orderNumber,
          motivoIngreso,
          subtotalCentimos,
          ivaCentimos,
          totalCentimos: subtotalCentimos + ivaCentimos,
          lineItems: { create: processedLineItems },
          statusHistory: {
            create: { toStatus: 'BORRADOR', notes: 'Orden creada' }
          }
        },
        include: {
          vehicle: true,
          client: true,
          lineItems: true,
        }
      })
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Orders POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
