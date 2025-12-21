/**
 * API Request Types
 * 
 * Standardized request body types for all API endpoints.
 * These types define the expected shape of data sent to the API.
 */

import type { LineItemInput } from '../domain/orders'
import type { VehicleInput } from '../domain/vehicles'
import type { ClientInput } from '../domain/clients'
import type { OrderStatus } from '../domain/orders'

/**
 * Order Creation Request
 * POST /api/ordenes
 */
export interface CreateOrderRequest {
  vehicleId: string
  clientId: string
  motivoIngreso?: string
  lineItems: LineItemInput[]
}

/**
 * Order Status Update Request
 * PATCH /api/ordenes/[id]
 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus
  notes?: string
}

/**
 * Vehicle Creation Request
 * POST /api/vehiculos
 */
export type CreateVehicleRequest = VehicleInput

/**
 * Client Creation Request
 * POST /api/clientes
 */
export type CreateClientRequest = ClientInput
