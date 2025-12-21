'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { TIPO_IDENTIFICACION_LABELS } from '@/types'

interface ClientDetail {
  id: string
  nombreCompleto: string
  tipoIdentificacion: string
  numeroIdentificacion: string
  telefono: string
  email: string | null
  direccion: string | null
  createdAt: string
  updatedAt: string
  serviceOrders: Array<{
    id: string
    orderNumber: string
    status: string
    totalCentimos: number
    createdAt: string
    vehicle: {
      placa: string
      marca: string
      modelo: string
    }
  }>
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  BORRADOR: 'Borrador',
  ENVIADA: 'Enviada',
  APROBADA: 'Aprobada',
  FACTURADA: 'Facturada',
  COMPLETADA: 'Completada',
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  BORRADOR: 'bg-gray-100 text-gray-800',
  ENVIADA: 'bg-blue-100 text-blue-800',
  APROBADA: 'bg-yellow-100 text-yellow-800',
  FACTURADA: 'bg-purple-100 text-purple-800',
  COMPLETADA: 'bg-green-100 text-green-800',
}

export default function ClienteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClient()
  }, [params.id])

  const fetchClient = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/clientes/${params.id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Cliente no encontrado')
        }
        throw new Error('Error al cargar cliente')
      }
      const data = await response.json()
      setClient(data.client)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (centimos: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
    }).format(centimos / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cliente...</p>
        </div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Cliente no encontrado'}</p>
          <Link
            href="/dashboard/clientes"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver a Clientes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/clientes"
          className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Clientes
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.nombreCompleto}</h1>
            <p className="text-gray-600 mt-1">
              {TIPO_IDENTIFICACION_LABELS[client.tipoIdentificacion as keyof typeof TIPO_IDENTIFICACION_LABELS]} - {client.numeroIdentificacion}
            </p>
          </div>
          <Link
            href={`/dashboard/clientes/${client.id}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Editar Cliente
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Contacto</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="text-gray-900 font-medium">{client.telefono}</p>
              </div>

              {client.email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900 font-medium">{client.email}</p>
                </div>
              )}

              {client.direccion && (
                <div>
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="text-gray-900">{client.direccion}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">Cliente desde</p>
                <p className="text-gray-900">{formatDate(client.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estadísticas</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Órdenes</span>
                <span className="text-2xl font-bold text-blue-600">{client.serviceOrders.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Facturado</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(
                    client.serviceOrders.reduce((sum, order) => sum + order.totalCentimos, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Historial de Órdenes</h2>
            </div>

            {client.serviceOrders.length === 0 ? (
              <div className="p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600 text-lg">No hay órdenes registradas</p>
                <p className="text-gray-500 text-sm mt-1">
                  Este cliente aún no tiene órdenes de servicio
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {client.serviceOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/dashboard/ordenes/${order.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              ORDER_STATUS_COLORS[order.status]
                            }`}
                          >
                            {ORDER_STATUS_LABELS[order.status]}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                            />
                          </svg>
                          {order.vehicle.placa} - {order.vehicle.marca} {order.vehicle.modelo}
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.totalCentimos)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
