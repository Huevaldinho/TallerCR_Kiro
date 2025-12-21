'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface VehicleDetail {
  id: string
  placa: string
  marca: string
  modelo: string
  año: number
  color: string | null
  kilometraje: number | null
  vin: string | null
  totalOrders: number
  totalBilledCentimos: number
  serviceOrders: Array<{
    id: string
    orderNumber: string
    status: string
    motivoIngreso: string | null
    totalCentimos: number | null
    createdAt: string
  }>
  createdAt: string
  updatedAt: string
}

const statusConfig: Record<string, { label: string; color: string }> = {
  BORRADOR: { label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
  ENVIADA: { label: 'Enviada', color: 'bg-blue-100 text-blue-800' },
  APROBADA: { label: 'Aprobada', color: 'bg-green-100 text-green-800' },
  FACTURADA: { label: 'Facturada', color: 'bg-purple-100 text-purple-800' },
  COMPLETADA: { label: 'Completada', color: 'bg-emerald-100 text-emerald-800' },
}

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/vehiculos/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setVehicle(data.vehicle)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Vehículo no encontrado</h2>
        <Link href="/dashboard/vehiculos" className="mt-4 text-blue-600 hover:underline">
          Volver a vehículos
        </Link>
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
            <h1 className="text-2xl font-bold text-gray-900">{vehicle.placa}</h1>
            <p className="text-gray-600">{vehicle.marca} {vehicle.modelo} ({vehicle.año})</p>
          </div>
        </div>
        <Link
          href={`/dashboard/vehiculos/${vehicle.id}/editar`}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </Link>
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <InfoCard title="Información del Vehículo">
          <div className="space-y-2">
            <InfoRow label="Placa" value={vehicle.placa} />
            <InfoRow label="Marca" value={vehicle.marca} />
            <InfoRow label="Modelo" value={vehicle.modelo} />
            <InfoRow label="Año" value={vehicle.año.toString()} />
            {vehicle.color && <InfoRow label="Color" value={vehicle.color} />}
            {vehicle.kilometraje && <InfoRow label="Kilometraje" value={`${vehicle.kilometraje.toLocaleString()} km`} />}
            {vehicle.vin && <InfoRow label="VIN" value={vehicle.vin} />}
          </div>
        </InfoCard>

        <InfoCard title="Estadísticas">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total de Órdenes</p>
              <p className="text-2xl font-bold text-gray-900">{vehicle.totalOrders}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Facturado</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(vehicle.totalBilledCentimos)}
              </p>
            </div>
          </div>
        </InfoCard>

        <InfoCard title="Registro">
          <div className="space-y-2">
            <InfoRow 
              label="Creado" 
              value={new Date(vehicle.createdAt).toLocaleDateString('es-CR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} 
            />
            <InfoRow 
              label="Actualizado" 
              value={new Date(vehicle.updatedAt).toLocaleDateString('es-CR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} 
            />
          </div>
        </InfoCard>
      </div>

      {/* Orders History */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Historial de Órdenes</h2>
        </div>
        {vehicle.serviceOrders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">No hay órdenes registradas para este vehículo</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicle.serviceOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{order.motivoIngreso || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalCentimos)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('es-CR')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/dashboard/ordenes/${order.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
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
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-500">{label}:</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

function formatCurrency(centimos: number | null): string {
  if (!centimos) return '₡0'
  return `₡${(centimos / 100).toLocaleString('es-CR')}`
}
