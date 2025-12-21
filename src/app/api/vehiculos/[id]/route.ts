/**
 * Single Vehicle API
 * GET /api/vehiculos/[id] - Get vehicle details
 * PATCH /api/vehiculos/[id] - Update vehicle
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        serviceOrders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            motivoIngreso: true,
            totalCentimos: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10, // Últimas 10 órdenes
        },
        _count: {
          select: { serviceOrders: true }
        }
      }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Calcular total facturado
    const totalBilled = await prisma.serviceOrder.aggregate({
      where: {
        vehicleId: id,
        status: { in: ['FACTURADA', 'COMPLETADA'] }
      },
      _sum: { totalCentimos: true }
    })

    return NextResponse.json({
      vehicle: {
        ...vehicle,
        totalOrders: vehicle._count.serviceOrders,
        totalBilledCentimos: totalBilled._sum.totalCentimos || 0,
      }
    })
  } catch (error) {
    console.error('Vehicle GET error:', error)
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
    const { placa, marca, modelo, año, color, kilometraje, vin } = body

    // Verificar que el vehículo existe
    const existing = await prisma.vehicle.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Si se está cambiando la placa, verificar que no exista otra con la misma placa
    if (placa && placa.toUpperCase() !== existing.placa) {
      const duplicate = await prisma.vehicle.findFirst({
        where: {
          tallerId: existing.tallerId,
          placa: placa.toUpperCase(),
          id: { not: id }
        }
      })

      if (duplicate) {
        return NextResponse.json({ 
          error: 'Ya existe otro vehículo con esa placa' 
        }, { status: 400 })
      }
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        placa: placa ? placa.toUpperCase().trim() : undefined,
        marca: marca || undefined,
        modelo: modelo || undefined,
        año: año ? (typeof año === 'number' ? año : parseInt(año)) : undefined,
        color: color || undefined,
        kilometraje: kilometraje ? (typeof kilometraje === 'number' ? kilometraje : parseInt(kilometraje)) : undefined,
        vin: vin || undefined,
      }
    })

    return NextResponse.json({ vehicle: updated })
  } catch (error) {
    console.error('Vehicle PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
