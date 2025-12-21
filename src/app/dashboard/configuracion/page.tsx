/**
 * Configuración Page
 * 
 * Taller fiscal configuration
 */

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-2 text-gray-600">
          Configura los datos fiscales de tu taller
        </p>
      </div>

      {/* Configuration Form */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Datos del Taller
          </h2>
        </div>

        <form className="space-y-6 p-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Taller
            </label>
            <input
              type="text"
              placeholder="Ej: Taller Mecánico Central"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Cédula Jurídica */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cédula Jurídica
            </label>
            <input
              type="text"
              placeholder="Ej: 3-101-123456"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Actividad Económica */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Actividad Económica (CABYS)
            </label>
            <select className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none">
              <option>Selecciona una actividad</option>
              <option>6201010000000 - Reparación de vehículos</option>
              <option>6202010000000 - Mantenimiento de vehículos</option>
            </select>
          </div>

          {/* Dirección */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Provincia
              </label>
              <select className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none">
                <option>San José</option>
                <option>Alajuela</option>
                <option>Cartago</option>
                <option>Heredia</option>
                <option>Guanacaste</option>
                <option>Puntarenas</option>
                <option>Limón</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cantón
              </label>
              <input
                type="text"
                placeholder="Ej: San José"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              placeholder="+506 8765-4321"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Guardar Cambios
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <svg
            className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="font-medium text-blue-900">
              Información importante
            </h3>
            <p className="mt-1 text-sm text-blue-800">
              Estos datos se utilizarán para generar facturas electrónicas
              compatibles con Hacienda. Asegúrate de que sean correctos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
