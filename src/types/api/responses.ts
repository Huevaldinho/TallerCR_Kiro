/**
 * API Response Types
 * 
 * Standardized response types for all API endpoints.
 * Follows REST conventions and provides type safety for frontend consumption.
 */

import type { Order, OrderDetail, RecentOrder } from '../domain/orders'
import type { Vehicle } from '../domain/vehicles'
import type { Client } from '../domain/clients'
import type { Service } from '../domain/services'

/**
 * Base API response wrapper
 */
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

/**
 * Dashboard Stats Response
 * GET /api/dashboard/stats
 */
export interface DashboardStats {
  pendingOrders: number
  todayRevenue: number
  vehiclesCount: number
  clientsCount: number
}

export interface DashboardStatsResponse {
  stats: DashboardStats
  recentOrders: RecentOrder[]
}

/**
 * Orders API Responses
 * GET /api/ordenes
 * GET /api/ordenes/[id]
 * POST /api/ordenes
 */
export interface OrdersListResponse {
  orders: Order[]
}

export interface OrderDetailResponse {
  order: OrderDetail
}

export interface OrderCreateResponse {
  order: Order
}

/**
 * Vehicles API Responses
 * GET /api/vehiculos
 * POST /api/vehiculos
 */
export interface VehiclesListResponse {
  vehicles: Vehicle[]
}

export interface VehicleCreateResponse {
  vehicle: Vehicle
}

/**
 * Clients API Responses
 * GET /api/clientes
 * POST /api/clientes
 */
export interface ClientsListResponse {
  clients: Client[]
}

export interface ClientCreateResponse {
  client: Client
}

/**
 * Services API Responses
 * GET /api/servicios
 */
export interface ServicesListResponse {
  services: Service[]
}

/**
 * Error Response
 */
export interface ErrorResponse {
  error: string
  details?: Record<string, string[]>
}
