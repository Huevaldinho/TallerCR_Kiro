/**
 * Vehicle Domain Types
 * 
 * Types related to vehicle management.
 * Based on Prisma schema: Vehicle
 */

export interface Vehicle {
  id: string
  placa: string
  marca: string
  modelo: string
  año: number
  color: string | null
  kilometraje: number | null
  vin?: string | null
  ordersCount: number
  createdAt: string
}

export interface VehicleInput {
  placa: string
  marca: string
  modelo: string
  año: number
  color?: string
  kilometraje?: number
  vin?: string
}

export interface VehicleSelect {
  id: string
  placa: string
  marca: string
  modelo: string
}

export interface VehicleFormData {
  placa: string
  marca: string
  modelo: string
  año: number
  color: string
  kilometraje: string
}
