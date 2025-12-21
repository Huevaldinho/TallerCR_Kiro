/**
 * Single Order API
 * GET /api/ordenes/[id] - Get order details
 * PATCH /api/ordenes/[id] - Update order status
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { OrderStatus } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const order = await prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        vehicle: true,
        client: true,
        lineItems: { orderBy: { numeroLinea: 'asc' } },
        statusHistory: { orderBy: { changedAt: 'desc' } },
        taller: {
          select: {
            nombre: true,
            cedulaJuridica: true,
            telefono: true,
            email: true,
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Order GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, notes } = body

    const order = await prisma.serviceOrder.findUnique({
      where: { id },
      select: { status: true }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Validate status transition
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      BORRADOR: ['ENVIADA'],
      ENVIADA: ['APROBADA', 'BORRADOR'],
      APROBADA: ['FACTURADA', 'BORRADOR'],
      FACTURADA: ['COMPLETADA'],
      COMPLETADA: [],
    }

    if (!validTransitions[order.status].includes(status)) {
      return NextResponse.json({ 
        error: `No se puede cambiar de ${order.status} a ${status}` 
      }, { status: 400 })
    }

    const updated = await prisma.serviceOrder.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: {
            fromStatus: order.status,
            toStatus: status,
            notes: notes || `Estado cambiado a ${status}`,
          }
        }
      },
      include: {
        vehicle: true,
        client: true,
        lineItems: true,
      }
    })

    return NextResponse.json({ order: updated })
  } catch (error) {
    console.error('Order PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
