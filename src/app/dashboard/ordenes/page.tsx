'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Order, OrderStatus } from '@/types'

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  BORRADOR: { label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
  ENVIADA: { label: 'Enviada', color: 'bg-blue-100 text-blue-800' },
  APROBADA: { label: 'Aprobada', color: 'bg-green-100 text-green-800' },
  FACTURADA: { label: 'Facturada', color: 'bg-purple-100 text-purple-800' },
  COMPLETADA: { label: 'Completada', color: 'bg-emerald-100 text-emerald-800' },
}

function formatCurrency(centimos: number | null): string {
  if (!centimos) return '₡0'
  return `₡${(centimos / 100).toLocaleString('es-CR')}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function OrdenesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetch('/api/ordenes')
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching orders:', err)
        setLoading(false)
      })
  }, [])

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Órdenes</h1>
          <p className="mt-2 text-gray-600">Gestiona todas tus órdenes de servicio</p>
        </div>
        <Link href="/dashboard/ordenes/nueva" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Orden
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'BORRADOR', 'ENVIADA', 'APROBADA', 'FACTURADA', 'COMPLETADA'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Todas' : statusConfig[status].label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">{order.motivoIngreso}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.vehicle.id ? (
                      <Link href={`/dashboard/vehiculos/${order.vehicle.id}`} className="hover:underline">
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800">{order.vehicle.placa}</div>
                        <div className="text-xs text-gray-500">{order.vehicle.marca} {order.vehicle.modelo}</div>
                      </Link>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-gray-900">{order.vehicle.placa}</div>
                        <div className="text-xs text-gray-500">{order.vehicle.marca} {order.vehicle.modelo}</div>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.client.id ? (
                      <Link href={`/dashboard/clientes/${order.client.id}`} className="hover:underline">
                        <div className="text-sm text-blue-600 hover:text-blue-800">{order.client.nombreCompleto}</div>
                        <div className="text-xs text-gray-500">{order.client.telefono}</div>
                      </Link>
                    ) : (
                      <>
                        <div className="text-sm text-gray-900">{order.client.nombreCompleto}</div>
                        <div className="text-xs text-gray-500">{order.client.telefono}</div>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[order.status].color}`}>
                      {statusConfig[order.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalCentimos)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/dashboard/ordenes/${order.id}`} className="text-blue-600 hover:text-blue-900">
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No hay órdenes</h3>
      <p className="mt-2 text-gray-600">Comienza creando una nueva orden de servicio</p>
    </div>
  )
}
