/**
 * Swagger/OpenAPI Configuration
 */

export const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Taller Pro CR API',
      version: '1.0.0',
      description: 'API documentation for Taller Pro CR - Workshop Management System for Costa Rica',
      contact: {
        name: 'Taller Pro CR',
        email: 'demo@tallerdemo.cr',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Dashboard',
        description: 'Dashboard statistics and overview',
      },
      {
        name: 'Orders',
        description: 'Service order management',
      },
      {
        name: 'Vehicles',
        description: 'Vehicle management',
      },
      {
        name: 'Clients',
        description: 'Client management',
      },
      {
        name: 'Services',
        description: 'Services catalog',
      },
    ],
    components: {
      schemas: {
        Vehicle: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            placa: { type: 'string', example: 'ABC-123' },
            marca: { type: 'string', example: 'Toyota' },
            modelo: { type: 'string', example: 'Corolla' },
            año: { type: 'integer', example: 2020 },
            color: { type: 'string', example: 'Blanco' },
            kilometraje: { type: 'integer', example: 45000 },
            ordersCount: { type: 'integer', example: 2 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        VehicleInput: {
          type: 'object',
          required: ['placa', 'marca', 'modelo', 'año'],
          properties: {
            placa: { type: 'string', example: 'ABC-123' },
            marca: { type: 'string', example: 'Toyota' },
            modelo: { type: 'string', example: 'Corolla' },
            año: { type: 'string', example: '2020' },
            color: { type: 'string', example: 'Blanco' },
            kilometraje: { type: 'string', example: '45000' },
          },
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombreCompleto: { type: 'string', example: 'María González Rodríguez' },
            tipoIdentificacion: { 
              type: 'string', 
              enum: ['FISICA', 'JURIDICA', 'DIMEX', 'NITE', 'PASAPORTE'],
              example: 'FISICA'
            },
            numeroIdentificacion: { type: 'string', example: '1-1234-5678' },
            telefono: { type: 'string', example: '+506 7777-7777' },
            email: { type: 'string', example: 'maria@email.com' },
            ordersCount: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ClientInput: {
          type: 'object',
          required: ['nombreCompleto', 'tipoIdentificacion', 'numeroIdentificacion', 'telefono'],
          properties: {
            nombreCompleto: { type: 'string', example: 'María González Rodríguez' },
            tipoIdentificacion: { 
              type: 'string', 
              enum: ['FISICA', 'JURIDICA', 'DIMEX', 'NITE', 'PASAPORTE'],
              example: 'FISICA'
            },
            numeroIdentificacion: { type: 'string', example: '1-1234-5678' },
            telefono: { type: 'string', example: '+506 7777-7777' },
            email: { type: 'string', example: 'maria@email.com' },
            direccion: { type: 'string', example: 'San José, Costa Rica' },
          },
        },
        Service: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            descripcion: { type: 'string', example: 'Cambio de aceite de motor' },
            cabysCode: { type: 'string', example: '8527101010000' },
            precioSugerido: { type: 'integer', example: 1500000, description: 'Price in centimos (₡15,000)' },
          },
        },
        LineItem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            numeroLinea: { type: 'integer', example: 1 },
            descripcion: { type: 'string', example: 'Cambio de aceite de motor' },
            cabysCode: { type: 'string', example: '8527101010000' },
            cantidad: { type: 'integer', example: 1 },
            precioUnitarioCentimos: { type: 'integer', example: 1500000 },
            subtotalCentimos: { type: 'integer', example: 1500000 },
            ivaCentimos: { type: 'integer', example: 195000 },
            totalLineaCentimos: { type: 'integer', example: 1695000 },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            orderNumber: { type: 'string', example: 'ORD-2024-001' },
            status: { 
              type: 'string', 
              enum: ['BORRADOR', 'ENVIADA', 'APROBADA', 'FACTURADA', 'COMPLETADA'],
              example: 'BORRADOR'
            },
            motivoIngreso: { type: 'string', example: 'Mantenimiento preventivo' },
            vehicle: {
              type: 'object',
              properties: {
                placa: { type: 'string', example: 'ABC-123' },
                marca: { type: 'string', example: 'Toyota' },
                modelo: { type: 'string', example: 'Corolla' },
              },
            },
            client: {
              type: 'object',
              properties: {
                nombreCompleto: { type: 'string', example: 'María González' },
                telefono: { type: 'string', example: '+506 7777-7777' },
              },
            },
            subtotal: { type: 'integer', example: 4500000, description: 'Subtotal in centimos' },
            iva: { type: 'integer', example: 585000, description: 'IVA (13%) in centimos' },
            total: { type: 'integer', example: 5085000, description: 'Total in centimos' },
            lineItems: {
              type: 'array',
              items: { $ref: '#/components/schemas/LineItem' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        OrderInput: {
          type: 'object',
          required: ['vehicleId', 'clientId', 'lineItems'],
          properties: {
            vehicleId: { type: 'string', format: 'uuid' },
            clientId: { type: 'string', format: 'uuid' },
            motivoIngreso: { type: 'string', example: 'Mantenimiento preventivo' },
            lineItems: {
              type: 'array',
              items: {
                type: 'object',
                required: ['descripcion', 'cabysCode', 'cantidad', 'precioUnitarioCentimos'],
                properties: {
                  descripcion: { type: 'string', example: 'Cambio de aceite' },
                  cabysCode: { type: 'string', example: '8527101010000' },
                  cantidad: { type: 'integer', example: 1 },
                  precioUnitarioCentimos: { type: 'integer', example: 1500000 },
                },
              },
            },
          },
        },
        UpdateOrderStatus: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { 
              type: 'string', 
              enum: ['BORRADOR', 'ENVIADA', 'APROBADA', 'FACTURADA', 'COMPLETADA'],
              example: 'ENVIADA'
            },
          },
        },
        DashboardStats: {
          type: 'object',
          properties: {
            stats: {
              type: 'object',
              properties: {
                pendingOrders: { type: 'integer', example: 2 },
                todayRevenue: { type: 'integer', example: 6780000 },
                vehiclesCount: { type: 'integer', example: 4 },
                clientsCount: { type: 'integer', example: 3 },
              },
            },
            recentOrders: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  orderNumber: { type: 'string', example: 'ORD-2024-001' },
                  status: { type: 'string', example: 'BORRADOR' },
                  placa: { type: 'string', example: 'ABC-123' },
                  marca: { type: 'string', example: 'Toyota' },
                  modelo: { type: 'string', example: 'Corolla' },
                  cliente: { type: 'string', example: 'María González' },
                  total: { type: 'integer', example: 5085000 },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' },
          },
        },
      },
    },
  },
  apis: [
    './src/app/api/**/*.ts',
    './src/app/api/dashboard/stats/route.ts',
    './src/app/api/vehiculos/route.ts',
    './src/app/api/ordenes/swagger-docs.ts',
    './src/app/api/clientes/swagger-docs.ts',
    './src/app/api/servicios/swagger-docs.ts',
  ],
}
