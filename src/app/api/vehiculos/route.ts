/**
 * Vehicles API
 * GET /api/vehiculos - List all vehicles
 * POST /api/vehiculos - Create new vehicle
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

const DEMO_TALLER_ID = async () => {
  const taller = await prisma.taller.findFirst()
  return taller?.id
}

export async function GET(request: NextRequest) {
  try {
    const tallerId = await DEMO_TALLER_ID()
    if (!tallerId) {
      return NextResponse.json({ error: 'Taller not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const placa = searchParams.get('placa')

    const where = placa 
      ? { tallerId, placa: { contains: placa.toUpperCase() } }
      : { tallerId }

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { serviceOrders: true } }
      }
    })

    return NextResponse.json({
      vehicles: vehicles.map(v => ({
        id: v.id,
        placa: v.placa,
        marca: v.marca,
        modelo: v.modelo,
        año: v.año,
        color: v.color,
        kilometraje: v.kilometraje,
        ordersCount: v._count.serviceOrders,
        createdAt: v.createdAt,
      }))
    })
  } catch (error) {
    console.error('Vehicles GET error:', error)
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
    const { placa, marca, modelo, año, color, kilometraje } = body

    // Validate placa format
    const placaUpper = placa.toUpperCase().trim()

    // Check if vehicle already exists
    const existing = await prisma.vehicle.findFirst({
      where: { tallerId, placa: placaUpper }
    })

    if (existing) {
      return NextResponse.json({ error: 'Vehículo ya registrado' }, { status: 400 })
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        tallerId,
        placa: placaUpper,
        marca,
        modelo,
        año: parseInt(año),
        color,
        kilometraje: kilometraje ? parseInt(kilometraje) : null,
      }
    })

    return NextResponse.json({ vehicle }, { status: 201 })
  } catch (error) {
    console.error('Vehicles POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
