'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Vehicle } from '@/types'

export default function VehiculosPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async (placa?: string) => {
    setLoading(true)
    const url = placa ? `/api/vehiculos?placa=${encodeURIComponent(placa)}` : '/api/vehiculos'
    try {
      const res = await fetch(url)
      const data = await res.json()
      setVehicles(data.vehicles || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVehicles(search)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
          <p className="mt-2 text-gray-600">Busca y registra vehículos</p>
        </div>
        <Link href="/dashboard/vehiculos/nuevo" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Registrar Vehículo
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por placa (ej: ABC-123)"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button type="submit" className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200">Buscar</button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); fetchVehicles(); }} className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200">Limpiar</button>
          )}
        </div>
      </form>

      {/* Vehicles List */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <EmptyState hasSearch={!!search} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  )
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link href={`/dashboard/vehiculos/${vehicle.id}`}>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600">{vehicle.placa}</h3>
            <p className="text-gray-600">{vehicle.marca} {vehicle.modelo}</p>
            <p className="text-sm text-gray-500">Año: {vehicle.año}</p>
          </div>
          <div className="rounded-lg bg-purple-100 p-2">
            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-gray-500">
            {vehicle.color && <span>Color: {vehicle.color}</span>}
            {vehicle.kilometraje && <span className="ml-2">• {vehicle.kilometraje.toLocaleString()} km</span>}
          </div>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {vehicle.ordersCount} órdenes
          </span>
        </div>
      </div>
    </Link>
  )
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        {hasSearch ? 'No se encontraron vehículos' : 'No hay vehículos'}
      </h3>
      <p className="mt-2 text-gray-600">
        {hasSearch ? 'Intenta con otra placa' : 'Comienza registrando un nuevo vehículo'}
      </p>
    </div>
  )
}
