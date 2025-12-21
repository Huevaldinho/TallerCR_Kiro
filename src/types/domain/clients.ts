/**
 * Client Domain Types
 * 
 * Types related to client management.
 * Based on Prisma schema: Client, TipoIdentificacion
 */

export type TipoIdentificacion = 'FISICA' | 'JURIDICA' | 'DIMEX' | 'NITE' | 'PASAPORTE'

export interface Client {
  id: string
  nombreCompleto: string
  tipoIdentificacion: TipoIdentificacion
  numeroIdentificacion: string
  telefono: string
  email: string | null
  direccion?: string | null
  ordersCount: number
  createdAt: string
}

export interface ClientInput {
  nombreCompleto: string
  tipoIdentificacion: TipoIdentificacion
  numeroIdentificacion: string
  telefono: string
  email?: string
  direccion?: string
}

export interface ClientSelect {
  id: string
  nombreCompleto: string
  telefono: string
}

/**
 * Identification type labels for Costa Rica
 */
export const TIPO_IDENTIFICACION_LABELS: Record<TipoIdentificacion, string> = {
  FISICA: 'Cédula Física',
  JURIDICA: 'Cédula Jurídica',
  DIMEX: 'DIMEX',
  NITE: 'NITE',
  PASAPORTE: 'Pasaporte',
}
