'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { VehicleSelect, ClientSelect, ServiceSelect, LineItemInput } from '@/types'

export default function NuevaOrdenPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [vehicles, setVehicles] = useState<VehicleSelect[]>([])
  const [clients, setClients] = useState<ClientSelect[]>([])
  const [services, setServices] = useState<ServiceSelect[]>([])
  
  const [vehicleId, setVehicleId] = useState('')
  const [clientId, setClientId] = useState('')
  const [motivoIngreso, setMotivoIngreso] = useState('')
  const [lineItems, setLineItems] = useState<LineItemInput[]>([])
  const [selectedService, setSelectedService] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/vehiculos').then(r => r.json()),
      fetch('/api/clientes').then(r => r.json()),
      fetch('/api/servicios').then(r => r.json()),
    ]).then(([vData, cData, sData]) => {
      setVehicles(vData.vehicles || [])
      setClients(cData.clients || [])
      setServices(sData.services || [])
    })
  }, [])

  const addService = () => {
    const service = services.find(s => s.id === selectedService)
    if (!service) return
    setLineItems([...lineItems, {
      descripcion: service.descripcion,
      cabysCode: service.cabysCode,
      cantidad: 1,
      precioUnitarioCentimos: service.precioSugerido || 0,
    }])
    setSelectedService('')
  }

  const removeLineItem = (index: number) => setLineItems(lineItems.filter((_, i) => i !== index))

  const updateLineItem = (index: number, field: keyof LineItemInput, value: number) => {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    setLineItems(updated)
  }

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.cantidad * item.precioUnitarioCentimos), 0)
    const iva = Math.round(subtotal * 0.13)
    return { subtotal, iva, total: subtotal + iva }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicleId || !clientId || lineItems.length === 0) {
      setError('Selecciona vehículo, cliente y al menos un servicio')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId, clientId, motivoIngreso, lineItems }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al crear orden'); setLoading(false); return }
      router.push(`/dashboard/ordenes/${data.order.id}`)
    } catch { setError('Error de conexión'); setLoading(false) }
  }

  const totals = calculateTotals()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Header />
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>}
        <GeneralInfoSection vehicles={vehicles} clients={clients} vehicleId={vehicleId} clientId={clientId} motivoIngreso={motivoIngreso} setVehicleId={setVehicleId} setClientId={setClientId} setMotivoIngreso={setMotivoIngreso} />
        <ServicesSection services={services} selectedService={selectedService} setSelectedService={setSelectedService} addService={addService} lineItems={lineItems} updateLineItem={updateLineItem} removeLineItem={removeLineItem} />
        {lineItems.length > 0 && <TotalsSection totals={totals} />}
        <ActionsSection loading={loading} hasItems={lineItems.length > 0} />
      </form>
    </div>
  )
}

function Header() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard/ordenes" className="text-gray-500 hover:text-gray-700">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">Nueva Orden de Servicio</h1>
    </div>
  )
}

function GeneralInfoSection({ vehicles, clients, vehicleId, clientId, motivoIngreso, setVehicleId, setClientId, setMotivoIngreso }: {
  vehicles: VehicleSelect[]; clients: ClientSelect[]; vehicleId: string; clientId: string; motivoIngreso: string;
  setVehicleId: (v: string) => void; setClientId: (v: string) => void; setMotivoIngreso: (v: string) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Información General</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo <span className="text-red-500">*</span></label>
          <select required value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none">
            <option value="">Seleccionar vehículo...</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.placa} - {v.marca} {v.modelo}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente <span className="text-red-500">*</span></label>
          <select required value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none">
            <option value="">Seleccionar cliente...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.nombreCompleto} - {c.telefono}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Ingreso</label>
          <textarea value={motivoIngreso} onChange={(e) => setMotivoIngreso(e.target.value)} rows={2} placeholder="Describe el motivo del servicio..." className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
        </div>
      </div>
    </div>
  )
}

function ServicesSection({ services, selectedService, setSelectedService, addService, lineItems, updateLineItem, removeLineItem }: {
  services: ServiceSelect[]; selectedService: string; setSelectedService: (v: string) => void; addService: () => void;
  lineItems: LineItemInput[]; updateLineItem: (i: number, f: keyof LineItemInput, v: number) => void; removeLineItem: (i: number) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Servicios</h2>
      <div className="flex gap-2 mb-4">
        <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none">
          <option value="">Seleccionar servicio...</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.descripcion} - {s.precioSugerido ? formatCurrency(s.precioSugerido) : 'Sin precio'}</option>)}
        </select>
        <button type="button" onClick={addService} disabled={!selectedService} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">Agregar</button>
      </div>
      {lineItems.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase w-24">Cant.</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase w-32">Precio</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase w-32">Subtotal</th>
              <th className="px-4 py-2 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {lineItems.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2"><div className="text-sm text-gray-900">{item.descripcion}</div><div className="text-xs text-gray-500 font-mono">{item.cabysCode}</div></td>
                <td className="px-4 py-2"><input type="number" min="1" value={item.cantidad} onChange={(e) => updateLineItem(index, 'cantidad', parseInt(e.target.value) || 1)} className="w-full rounded border border-gray-300 px-2 py-1 text-right text-sm" /></td>
                <td className="px-4 py-2"><input type="number" min="0" value={item.precioUnitarioCentimos} onChange={(e) => updateLineItem(index, 'precioUnitarioCentimos', parseInt(e.target.value) || 0)} className="w-full rounded border border-gray-300 px-2 py-1 text-right text-sm" /></td>
                <td className="px-4 py-2 text-right text-sm font-medium">{formatCurrency(item.cantidad * item.precioUnitarioCentimos)}</td>
                <td className="px-4 py-2"><button type="button" onClick={() => removeLineItem(index)} className="text-red-500 hover:text-red-700"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-8 text-gray-500">Agrega servicios a la orden</div>
      )}
    </div>
  )
}

function formatCurrency(centimos: number): string { return `₡${(centimos / 100).toLocaleString('es-CR')}` }

function TotalsSection({ totals }: { totals: { subtotal: number; iva: number; total: number } }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal:</span><span className="text-gray-900">{formatCurrency(totals.subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">IVA (13%):</span><span className="text-gray-900">{formatCurrency(totals.iva)}</span></div>
          <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total:</span><span>{formatCurrency(totals.total)}</span></div>
        </div>
      </div>
    </div>
  )
}

function ActionsSection({ loading, hasItems }: { loading: boolean; hasItems: boolean }) {
  return (
    <div className="flex justify-end gap-4">
      <Link href="/dashboard/ordenes" className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">Cancelar</Link>
      <button type="submit" disabled={loading || !hasItems} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Creando...' : 'Crear Orden'}</button>
    </div>
  )
}
