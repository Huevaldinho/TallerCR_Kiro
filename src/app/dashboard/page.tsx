'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { DashboardStats, RecentOrder, ORDER_STATUS_CONFIG } from '@/types'

const statusConfig = {
  BORRADOR: { label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
  ENVIADA: { label: 'Enviada', color: 'bg-blue-100 text-blue-800' },
  APROBADA: { label: 'Aprobada', color: 'bg-green-100 text-green-800' },
  FACTURADA: { label: 'Facturada', color: 'bg-purple-100 text-purple-800' },
  COMPLETADA: { label: 'Completada', color: 'bg-emerald-100 text-emerald-800' },
} as const

function formatCurrency(centimos: number | null): string {
  if (!centimos) return '₡0'
  return `₡${(centimos / 100).toLocaleString('es-CR')}`
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats)
        setRecentOrders(data.recentOrders || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Dashboard</h1>
        <p className="mt-2 text-gray-600">Gestiona tus órdenes, vehículos y clientes desde aquí</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Órdenes Activas" value={stats?.pendingOrders || 0} icon={<OrderIcon />} color="blue" />
        <StatCard title="Ingresos Hoy" value={formatCurrency(stats?.todayRevenue || 0)} icon={<MoneyIcon />} color="green" />
        <StatCard title="Vehículos" value={stats?.vehiclesCount || 0} icon={<VehicleIcon />} color="purple" />
        <StatCard title="Clientes" value={stats?.clientsCount || 0} icon={<ClientIcon />} color="orange" />
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Órdenes Recientes</h2>
            <Link href="/dashboard/ordenes" className="text-sm text-blue-600 hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">No hay órdenes recientes</div>
            ) : (
              recentOrders.slice(0, 4).map((order) => (
                <Link key={order.id} href={`/dashboard/ordenes/${order.id}`} className="block px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.placa} - {order.marca} {order.modelo}</p>
                      <p className="text-xs text-gray-500">{order.cliente}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[order.status]?.color || ''}`}>
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                      <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            <QuickAction href="/dashboard/ordenes/nueva" label="Nueva Orden" />
            <QuickAction href="/dashboard/vehiculos/nuevo" label="Registrar Vehículo" />
            <QuickAction href="/dashboard/clientes/nuevo" label="Nuevo Cliente" />
            <QuickAction href="/dashboard/ordenes" label="Ver Órdenes" icon="list" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
  const bgColors: Record<string, string> = { blue: 'bg-blue-100', green: 'bg-green-100', purple: 'bg-purple-100', orange: 'bg-orange-100' }
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-lg ${bgColors[color]} p-3`}>{icon}</div>
      </div>
    </div>
  )
}

function QuickAction({ href, label, icon = 'plus' }: { href: string; label: string; icon?: 'plus' | 'list' }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors">
      {icon === 'plus' ? <PlusIcon /> : <ListIcon />}
      <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
    </Link>
  )
}

function OrderIcon() { return <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
function MoneyIcon() { return <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
function VehicleIcon() { return <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg> }
function ClientIcon() { return <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> }
function PlusIcon() { return <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> }
function ListIcon() { return <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> }
