/**
 * Orders API
 * GET /api/ordenes - List all orders
 * POST /api/ordenes - Create new order
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

const DEMO_TALLER_ID = async () => {
  const taller = await prisma.taller.findFirst()
  return taller?.id
}

export async function GET() {
  try {
    const tallerId = await DEMO_TALLER_ID()
    if (!tallerId) {
      return NextResponse.json({ error: 'Taller not found' }, { status: 404 })
    }

    const orders = await prisma.serviceOrder.findMany({
      where: { tallerId },
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: { select: { placa: true, marca: true, modelo: true } },
        client: { select: { nombreCompleto: true, telefono: true } },
        lineItems: true,
      }
    })

    return NextResponse.json({
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        motivoIngreso: order.motivoIngreso,
        vehicle: order.vehicle,
        client: order.client,
        subtotal: order.subtotalCentimos,
        iva: order.ivaCentimos,
        total: order.totalCentimos,
        lineItems: order.lineItems,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }))
    })
  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const tallerId = await DEMO_TALLER_ID()
    if (!tallerId) {
      return NextResponse.json({ error: 'Taller not found' }, { status: 404 })
    }

    const body = await request.json()
    const { vehicleId, clientId, motivoIngreso, lineItems } = body

    // Generate order number
    const count = await prisma.serviceOrder.count({ where: { tallerId } })
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`

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

    const order = await prisma.serviceOrder.create({
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

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Orders POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
