'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface VehicleFormData {
  placa: string
  marca: string
  modelo: string
  año: string
  color: string
  kilometraje: string
  vin: string
}

export default function EditVehiclePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<VehicleFormData>({
    placa: '',
    marca: '',
    modelo: '',
    año: '',
    color: '',
    kilometraje: '',
    vin: '',
  })

  useEffect(() => {
    if (params.id) {
      fetch(`/api/vehiculos/${params.id}`)
        .then(res => res.json())
        .then(data => {
          const vehicle = data.vehicle
          setFormData({
            placa: vehicle.placa || '',
            marca: vehicle.marca || '',
            modelo: vehicle.modelo || '',
            año: vehicle.año?.toString() || '',
            color: vehicle.color || '',
            kilometraje: vehicle.kilometraje?.toString() || '',
            vin: vehicle.vin || '',
          })
          setLoading(false)
        })
        .catch(() => {
          setError('Error al cargar el vehículo')
          setLoading(false)
        })
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch(`/api/vehiculos/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placa: formData.placa.trim(),
          marca: formData.marca.trim(),
          modelo: formData.modelo.trim(),
          año: parseInt(formData.año),
          color: formData.color.trim() || null,
          kilometraje: formData.kilometraje ? parseInt(formData.kilometraje) : null,
          vin: formData.vin.trim() || null,
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al actualizar el vehículo')
        setSubmitting(false)
        return
      }

      router.push(`/dashboard/vehiculos/${params.id}`)
    } catch (err) {
      setError('Error al actualizar el vehículo')
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/vehiculos/${params.id}`} className="text-gray-500 hover:text-gray-700">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Vehículo</h1>
          <p className="text-gray-600">Actualiza la información del vehículo</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Placa */}
        <div>
          <label htmlFor="placa" className="block text-sm font-medium text-gray-700 mb-1">
            Placa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="placa"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            required
            placeholder="ABC-123"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none uppercase"
          />
          <p className="mt-1 text-xs text-gray-500">Formato: ABC-123 (particular), TX-1234 (taxi), M-12345 (moto)</p>
        </div>

        {/* Marca y Modelo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">
              Marca <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              required
              placeholder="Toyota"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-1">
              Modelo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              required
              placeholder="Corolla"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Año y Color */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="año" className="block text-sm font-medium text-gray-700 mb-1">
              Año <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="año"
              name="año"
              value={formData.año}
              onChange={handleChange}
              required
              min="1900"
              max={new Date().getFullYear() + 1}
              placeholder="2020"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Blanco"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Kilometraje */}
        <div>
          <label htmlFor="kilometraje" className="block text-sm font-medium text-gray-700 mb-1">
            Kilometraje (km)
          </label>
          <input
            type="number"
            id="kilometraje"
            name="kilometraje"
            value={formData.kilometraje}
            onChange={handleChange}
            min="0"
            placeholder="45000"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* VIN */}
        <div>
          <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-1">
            VIN (Número de Identificación del Vehículo)
          </label>
          <input
            type="text"
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            maxLength={17}
            placeholder="1HGBH41JXMN109186"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none uppercase"
          />
          <p className="mt-1 text-xs text-gray-500">17 caracteres alfanuméricos</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <Link
            href={`/dashboard/vehiculos/${params.id}`}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 text-center"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
