'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { TipoIdentificacion, TIPO_IDENTIFICACION_LABELS } from '@/types'

interface ClientData {
  id: string
  nombreCompleto: string
  tipoIdentificacion: TipoIdentificacion
  numeroIdentificacion: string
  telefono: string
  email: string | null
  direccion: string | null
}

export default function EditarClientePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ClientData>({
    id: '',
    nombreCompleto: '',
    tipoIdentificacion: 'FISICA',
    numeroIdentificacion: '',
    telefono: '',
    email: '',
    direccion: '',
  })

  useEffect(() => {
    fetchClient()
  }, [params.id])

  const fetchClient = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/clientes/${params.id}`)
      if (!response.ok) {
        throw new Error('Error al cargar cliente')
      }
      const data = await response.json()
      setFormData({
        id: data.client.id,
        nombreCompleto: data.client.nombreCompleto,
        tipoIdentificacion: data.client.tipoIdentificacion,
        numeroIdentificacion: data.client.numeroIdentificacion,
        telefono: data.client.telefono,
        email: data.client.email || '',
        direccion: data.client.direccion || '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/clientes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          nombreCompleto: formData.nombreCompleto,
          tipoIdentificacion: formData.tipoIdentificacion,
          numeroIdentificacion: formData.numeroIdentificacion,
          telefono: formData.telefono,
          email: formData.email || null,
          direccion: formData.direccion || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al actualizar cliente')
      }

      router.push(`/dashboard/clientes/${params.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/dashboard/clientes/${params.id}`}
          className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Detalles
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Editar Cliente</h1>
        <p className="text-gray-600 mt-1">Actualiza la información del cliente</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {/* Nombre Completo */}
        <div className="mb-4">
          <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="nombreCompleto"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: María González Rodríguez"
          />
        </div>

        {/* Tipo de Identificación */}
        <div className="mb-4">
          <label htmlFor="tipoIdentificacion" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Identificación *
          </label>
          <select
            id="tipoIdentificacion"
            name="tipoIdentificacion"
            value={formData.tipoIdentificacion}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(TIPO_IDENTIFICACION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Número de Identificación */}
        <div className="mb-4">
          <label htmlFor="numeroIdentificacion" className="block text-sm font-medium text-gray-700 mb-2">
            Número de Identificación *
          </label>
          <input
            type="text"
            id="numeroIdentificacion"
            name="numeroIdentificacion"
            value={formData.numeroIdentificacion}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={
              formData.tipoIdentificacion === 'FISICA'
                ? 'Ej: 1-1234-5678'
                : formData.tipoIdentificacion === 'JURIDICA'
                ? 'Ej: 3-101-123456'
                : 'Número de identificación'
            }
          />
        </div>

        {/* Teléfono */}
        <div className="mb-4">
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: +506 8888-8888"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: cliente@email.com"
          />
        </div>

        {/* Dirección */}
        <div className="mb-6">
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <textarea
            id="direccion"
            name="direccion"
            value={formData.direccion || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Dirección completa del cliente"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <Link
            href={`/dashboard/clientes/${params.id}`}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 text-center transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
