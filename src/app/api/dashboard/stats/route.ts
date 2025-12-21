/**
 * Dashboard Stats API
 * GET /api/dashboard/stats
 * Returns statistics for the dashboard
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

// Demo taller ID - in production this would come from auth session
const DEMO_TALLER_ID = async () => {
  const taller = await prisma.taller.findFirst()
  return taller?.id
}

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get dashboard statistics
 *     description: Returns dashboard statistics including pending orders, today's revenue, vehicle count, client count, and recent orders
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 *       404:
 *         description: Taller not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
  try {
    const tallerId = await DEMO_TALLER_ID()
    
    if (!tallerId) {
      return NextResponse.json({ error: 'Taller not found' }, { status: 404 })
    }

    // Get counts
    const [ordersCount, vehiclesCount, clientsCount, recentOrders] = await Promise.all([
      prisma.serviceOrder.count({
        where: { tallerId, status: { in: ['BORRADOR', 'ENVIADA', 'APROBADA'] } }
      }),
      prisma.vehicle.count({ where: { tallerId } }),
      prisma.client.count({ where: { tallerId } }),
      prisma.serviceOrder.findMany({
        where: { tallerId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          vehicle: { select: { placa: true, marca: true, modelo: true } },
          client: { select: { nombreCompleto: true } },
        }
      })
    ])

    // Calculate today's revenue (completed orders)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const todayOrders = await prisma.serviceOrder.findMany({
      where: {
        tallerId,
        status: 'COMPLETADA',
        updatedAt: { gte: todayStart }
      },
      select: { totalCentimos: true }
    })
    
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.totalCentimos || 0), 0)

    return NextResponse.json({
      stats: {
        pendingOrders: ordersCount,
        todayRevenue: todayRevenue,
        vehiclesCount,
        clientsCount,
      },
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        placa: order.vehicle.placa,
        marca: order.vehicle.marca,
        modelo: order.vehicle.modelo,
        cliente: order.client.nombreCompleto,
        total: order.totalCentimos,
        createdAt: order.createdAt,
      }))
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
