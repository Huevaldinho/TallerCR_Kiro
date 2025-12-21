/**
 * Client Detail API
 * GET /api/clientes/[id] - Get client details
 * PATCH /api/clientes/[id] - Update client
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        serviceOrders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalCentimos: true,
            createdAt: true,
            vehicle: {
              select: {
                placa: true,
                marca: true,
                modelo: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!client) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ client })
  } catch (error) {
    console.error('Client GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { nombreCompleto, tipoIdentificacion, numeroIdentificacion, telefono, email, direccion } = body

    // Check if client exists
    const existing = await prisma.client.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
    }

    // Check if new identification number conflicts with another client
    if (numeroIdentificacion && numeroIdentificacion !== existing.numeroIdentificacion) {
      const duplicate = await prisma.client.findFirst({
        where: {
          tallerId: existing.tallerId,
          numeroIdentificacion,
          id: { not: params.id },
        },
      })

      if (duplicate) {
        return NextResponse.json(
          { error: 'Ya existe un cliente con ese número de identificación' },
          { status: 400 }
        )
      }
    }

    const client = await prisma.client.update({
      where: { id: params.id },
      data: {
        nombreCompleto,
        tipoIdentificacion,
        numeroIdentificacion,
        telefono,
        email: email || null,
        direccion: direccion || null,
      },
    })

    return NextResponse.json({ client })
  } catch (error) {
    console.error('Client PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
