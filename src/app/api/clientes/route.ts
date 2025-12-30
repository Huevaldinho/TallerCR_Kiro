/**
 * Clients API
 * GET /api/clientes - List all clients
 * POST /api/clientes - Create new client
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

    const clients = await prisma.client.findMany({
      where: { tallerId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { serviceOrders: true } }
      }
    })

    return NextResponse.json({
      clients: clients.map(c => ({
        id: c.id,
        nombreCompleto: c.nombreCompleto,
        tipoIdentificacion: c.tipoIdentificacion,
        numeroIdentificacion: c.numeroIdentificacion,
        telefono: c.telefono,
        email: c.email,
        ordersCount: c._count.serviceOrders,
        createdAt: c.createdAt,
      }))
    })
  } catch (error) {
    console.error('Clients GET error:', error)
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
    const { nombreCompleto, tipoIdentificacion, numeroIdentificacion, telefono, email } = body

    // Check if client already exists
    const existing = await prisma.client.findFirst({
      where: { tallerId, numeroIdentificacion }
    })

    if (existing) {
      return NextResponse.json({ error: 'Cliente ya registrado' }, { status: 400 })
    }

    const client = await prisma.client.create({
      data: {
        tallerId,
        nombreCompleto,
        tipoIdentificacion,
        numeroIdentificacion,
        telefono,
        email,
      }
    })

    return NextResponse.json({ client }, { status: 201 })
  } catch (error) {
    console.error('Clients POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
