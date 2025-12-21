/**
 * Services Catalog API
 * GET /api/servicios - List all services from catalog
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

export async function GET() {
  try {
    const services = await prisma.servicesCatalog.findMany({
      where: { isGlobal: true },
      orderBy: { descripcion: 'asc' },
    })

    return NextResponse.json({
      services: services.map(s => ({
        id: s.id,
        descripcion: s.descripcion,
        cabysCode: s.cabysCode,
        precioSugerido: s.precioSugeridoCentimos,
      }))
    })
  } catch (error) {
    console.error('Services GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
