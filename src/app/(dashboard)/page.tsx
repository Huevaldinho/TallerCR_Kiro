/**
 * Dashboard Home Page
 * 
 * Main dashboard page showing overview and quick actions
 */

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido al Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Gestiona tus órdenes, vehículos y clientes desde aquí
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Órdenes Pendientes */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Órdenes Pendientes
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
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
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            +2 desde ayer
          </p>
        </div>

        {/* Ingresos Hoy */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Ingresos Hoy
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ₡125,000
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            +15% vs ayer
          </p>
        </div>

        {/* Vehículos Registrados */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Vehículos
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">48</p>
            </div>
            <div className="rounded-lg bg-purple-100 p-3">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-2m-4-3l2 2m0 0l2-2m-2 2V3"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            +3 este mes
          </p>
        </div>

        {/* Clientes Activos */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Clientes Activos
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">156</p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            +12 este mes
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Órdenes Recientes */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Órdenes Recientes
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Orden #{1000 + i}
                    </p>
                    <p className="text-sm text-gray-600">
                      Placa: ABC-{100 + i}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                    Borrador
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Acciones Rápidas
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            <a
              href="/dashboard/ordenes/nueva"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-700">
                Nueva Orden
              </p>
            </a>

            <a
              href="/dashboard/vehiculos/nuevo"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-700">
                Registrar Vehículo
              </p>
            </a>

            <a
              href="/dashboard/clientes/nuevo"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-700">
                Nuevo Cliente
              </p>
            </a>

            <a
              href="/dashboard/reportes"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-700">
                Ver Reportes
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
