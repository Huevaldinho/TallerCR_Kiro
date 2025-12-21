/**
 * Order Domain Types
 * 
 * Types related to service orders and their lifecycle.
 * Based on Prisma schema: ServiceOrder, ServiceLineItem, OrderStatusHistory
 */

export type OrderStatus = 'BORRADOR' | 'ENVIADA' | 'APROBADA' | 'FACTURADA' | 'COMPLETADA'

export interface LineItem {
  id: string
  numeroLinea: number
  descripcion: string
  cabysCode: string
  cantidad: number
  precioUnitarioCentimos: number
  subtotalCentimos: number
  ivaCentimos: number
  totalLineaCentimos: number
}

export interface LineItemInput {
  descripcion: string
  cabysCode: string
  cantidad: number
  precioUnitarioCentimos: number
}

export interface OrderVehicle {
  placa: string
  marca: string
  modelo: string
  año?: number
  color?: string | null
}

export interface OrderClient {
  nombreCompleto: string
  telefono: string
  email?: string | null
  numeroIdentificacion?: string
}

export interface OrderTaller {
  nombre: string
  cedulaJuridica: string
  telefono: string
  email: string
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  motivoIngreso: string | null
  vehicle: OrderVehicle
  client: OrderClient
  subtotalCentimos: number | null
  ivaCentimos: number | null
  totalCentimos: number | null
  lineItems: LineItem[]
  createdAt: string
  updatedAt?: string
}

export interface OrderDetail extends Order {
  taller: OrderTaller
  statusHistory?: OrderStatusHistory[]
}

export interface OrderStatusHistory {
  id: string
  fromStatus: OrderStatus | null
  toStatus: OrderStatus
  notes: string | null
  changedAt: string
}

export interface RecentOrder {
  id: string
  orderNumber: string
  status: OrderStatus
  placa: string
  marca: string
  modelo: string
  cliente: string
  total: number | null
  createdAt: string
}

/**
 * Status display configuration
 */
export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  BORRADOR: { label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
  ENVIADA: { label: 'Enviada', color: 'bg-blue-100 text-blue-800' },
  APROBADA: { label: 'Aprobada', color: 'bg-green-100 text-green-800' },
  FACTURADA: { label: 'Facturada', color: 'bg-purple-100 text-purple-800' },
  COMPLETADA: { label: 'Completada', color: 'bg-emerald-100 text-emerald-800' },
}

/**
 * Valid status transitions
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  BORRADOR: ['ENVIADA'],
  ENVIADA: ['APROBADA', 'BORRADOR'],
  APROBADA: ['FACTURADA', 'BORRADOR'],
  FACTURADA: ['COMPLETADA'],
  COMPLETADA: [],
}

export const NEXT_STATUS_ACTION: Record<OrderStatus, string> = {
  BORRADOR: 'Enviar Cotización',
  ENVIADA: 'Marcar como Aprobada',
  APROBADA: 'Generar Factura',
  FACTURADA: 'Completar Orden',
  COMPLETADA: '',
}
