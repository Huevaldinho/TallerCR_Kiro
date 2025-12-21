'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { OrderDetail, OrderStatus, LineItem } from '@/types'

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  BORRADOR: { label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
  ENVIADA: { label: 'Enviada', color: 'bg-blue-100 text-blue-800' },
  APROBADA: { label: 'Aprobada', color: 'bg-green-100 text-green-800' },
  FACTURADA: { label: 'Facturada', color: 'bg-purple-100 text-purple-800' },
  COMPLETADA: { label: 'Completada', color: 'bg-emerald-100 text-emerald-800' },
}

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  BORRADOR: 'ENVIADA',
  ENVIADA: 'APROBADA',
  APROBADA: 'FACTURADA',
  FACTURADA: 'COMPLETADA',
}

const nextStatusLabel: Partial<Record<OrderStatus, string>> = {
  BORRADOR: 'Enviar Cotización',
  ENVIADA: 'Marcar como Aprobada',
  APROBADA: 'Generar Factura',
  FACTURADA: 'Completar Orden',
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/ordenes/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data.order)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [params.id])

  const handleStatusChange = async () => {
    if (!order || !nextStatus[order.status]) return
    
    setUpdating(true)
    try {
      const res = await fetch(`/api/ordenes/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus[order.status] })
      })
      const data = await res.json()
      if (data.order) {
        setOrder(prev => prev ? { ...prev, status: data.order.status } : null)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
    setUpdating(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Orden no encontrada</h2>
        <Link href="/dashboard/ordenes" className="mt-4 text-blue-600 hover:underline">Volver a órdenes</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[order.status].color}`}>
              {statusConfig[order.status].label}
            </span>
          </div>
        </div>
        {nextStatus[order.status] && (
          <button onClick={handleStatusChange} disabled={updating} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {updating ? 'Procesando...' : nextStatusLabel[order.status]}
          </button>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <InfoCard title="Vehículo">
          {order.vehicle.id ? (
            <Link href={`/dashboard/vehiculos/${order.vehicle.id}`} className="text-xl font-bold text-blue-600 hover:text-blue-800 hover:underline">
              {order.vehicle.placa}
            </Link>
          ) : (
            <p className="text-xl font-bold text-gray-900">{order.vehicle.placa}</p>
          )}
          <p className="text-gray-600">{order.vehicle.marca} {order.vehicle.modelo} ({order.vehicle.año})</p>
          {order.vehicle.color && <p className="text-sm text-gray-500">Color: {order.vehicle.color}</p>}
        </InfoCard>

        <InfoCard title="Cliente">
          {order.client.id ? (
            <Link href={`/dashboard/clientes/${order.client.id}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline">
              {order.client.nombreCompleto}
            </Link>
          ) : (
            <p className="text-lg font-semibold text-gray-900">{order.client.nombreCompleto}</p>
          )}
          <p className="text-gray-600">{order.client.telefono}</p>
          {order.client.email && <p className="text-sm text-gray-500">{order.client.email}</p>}
          <p className="text-xs text-gray-400 mt-1">ID: {order.client.numeroIdentificacion}</p>
        </InfoCard>

        <InfoCard title="Motivo de Ingreso">
          <p className="text-gray-900">{order.motivoIngreso || 'No especificado'}</p>
          <p className="text-xs text-gray-400 mt-2">Creada: {new Date(order.createdAt).toLocaleDateString('es-CR')}</p>
        </InfoCard>
      </div>

      {/* Line Items */}
      <LineItemsTable lineItems={order.lineItems} />

      {/* Totals */}
      <TotalsCard subtotal={order.subtotalCentimos} iva={order.ivaCentimos} total={order.totalCentimos} />

      {/* Images Gallery */}
      {order.images && order.images.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Imágenes de la Orden</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {order.images.map((image) => (
              <div key={image.id} className="relative group">
                <img 
                  src={image.url} 
                  alt={image.caption || 'Imagen de orden'} 
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                />
                {image.caption && (
                  <p className="mt-1 text-xs text-gray-500 truncate">{image.caption}</p>
                )}
                <span className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {image.imageType}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function LineItemsTable({ lineItems }: { lineItems: LineItem[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Servicios</h3>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CABYS</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cant.</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">IVA</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lineItems.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 text-sm text-gray-500">{item.numeroLinea}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.descripcion}</td>
              <td className="px-6 py-4 text-xs text-gray-500 font-mono">{item.cabysCode}</td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.cantidad}</td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right">{formatCurrency(item.precioUnitarioCentimos)}</td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right">{formatCurrency(item.subtotalCentimos)}</td>
              <td className="px-6 py-4 text-sm text-gray-500 text-right">{formatCurrency(item.ivaCentimos)}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.totalLineaCentimos)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TotalsCard({ subtotal, iva, total }: { subtotal: number | null; iva: number | null; total: number | null }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal:</span>
            <span className="text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">IVA (13%):</span>
            <span className="text-gray-900">{formatCurrency(iva)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span className="text-gray-900">Total:</span>
            <span className="text-gray-900">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatCurrency(centimos: number | null): string {
  if (!centimos) return '₡0'
  return `₡${(centimos / 100).toLocaleString('es-CR')}`
}
