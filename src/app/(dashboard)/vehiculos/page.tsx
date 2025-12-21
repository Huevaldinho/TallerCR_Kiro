/**
 * Vehículos Page
 * 
 * Search and manage vehicles
 */

export default function VehiculosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
          <p className="mt-2 text-gray-600">
            Busca y registra vehículos
          </p>
        </div>
        <a
          href="/dashboard/vehiculos/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <svg
            className="h-5 w-5"
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
          Registrar Vehículo
        </a>
      </div>

      {/* Search Bar */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <input
          type="text"
          placeholder="Buscar por placa (ej: ABC-123)"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Placeholder */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No hay vehículos
        </h3>
        <p className="mt-2 text-gray-600">
          Comienza registrando un nuevo vehículo
        </p>
      </div>
    </div>
  )
}
