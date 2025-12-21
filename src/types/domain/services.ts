/**
 * Service Catalog Domain Types
 * 
 * Types related to the services catalog.
 * Based on Prisma schema: ServicesCatalog
 */

export interface Service {
  id: string
  descripcion: string
  cabysCode: string
  precioSugerido: number | null
  isFavorite?: boolean
  isGlobal?: boolean
}

export interface ServiceSelect {
  id: string
  descripcion: string
  cabysCode: string
  precioSugerido: number | null
}

export interface ServiceCatalogItem {
  id: string
  descripcion: string
  cabysCode: string
  precioSugeridoCentimos: number | null
  isFavorite: boolean
  isGlobal: boolean
}
