import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// CABYS codes for common automotive services
const globalServices = [
  { descripcion: 'Cambio de aceite de motor', cabysCode: '8527101010000', precio: 1500000 },
  { descripcion: 'Cambio de filtro de aceite', cabysCode: '8527101020000', precio: 500000 },
  { descripcion: 'Cambio de filtro de aire', cabysCode: '8527101030000', precio: 350000 },
  { descripcion: 'Cambio de pastillas de freno delanteras', cabysCode: '8527201010000', precio: 4500000 },
  { descripcion: 'Cambio de pastillas de freno traseras', cabysCode: '8527201020000', precio: 4000000 },
  { descripcion: 'Cambio de discos de freno', cabysCode: '8527201030000', precio: 6500000 },
  { descripcion: 'Alineación y balanceo', cabysCode: '8527301010000', precio: 2500000 },
  { descripcion: 'Rotación de llantas', cabysCode: '8527301020000', precio: 1000000 },
  { descripcion: 'Cambio de amortiguadores delanteros', cabysCode: '8527401010000', precio: 8500000 },
  { descripcion: 'Cambio de amortiguadores traseros', cabysCode: '8527401020000', precio: 7500000 },
  { descripcion: 'Cambio de bujías', cabysCode: '8527501010000', precio: 2000000 },
  { descripcion: 'Cambio de batería', cabysCode: '8527501020000', precio: 7000000 },
  { descripcion: 'Diagnóstico computarizado', cabysCode: '8527601010000', precio: 2500000 },
  { descripcion: 'Escaneo de códigos de error', cabysCode: '8527601020000', precio: 1500000 },
  { descripcion: 'Cambio de correa de distribución', cabysCode: '8527701010000', precio: 15000000 },
  { descripcion: 'Cambio de bomba de agua', cabysCode: '8527701020000', precio: 8000000 },
  { descripcion: 'Cambio de termostato', cabysCode: '8527701030000', precio: 3500000 },
  { descripcion: 'Limpieza de inyectores', cabysCode: '8527801010000', precio: 4500000 },
  { descripcion: 'Cambio de líquido de frenos', cabysCode: '8527801020000', precio: 2000000 },
  { descripcion: 'Cambio de refrigerante', cabysCode: '8527801030000', precio: 2500000 },
  { descripcion: 'Revisión general pre-RTV', cabysCode: '8527901010000', precio: 3500000 },
  { descripcion: 'Reparación de aire acondicionado', cabysCode: '8527901020000', precio: 5500000 },
  { descripcion: 'Recarga de aire acondicionado', cabysCode: '8527901030000', precio: 3000000 },
  { descripcion: 'Cambio de clutch/embrague', cabysCode: '8528101010000', precio: 25000000 },
  { descripcion: 'Reparación de caja automática', cabysCode: '8528101020000', precio: 35000000 },
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.orderStatusHistory.deleteMany()
  await prisma.orderToken.deleteMany()
  await prisma.serviceLineItem.deleteMany()
  await prisma.serviceOrder.deleteMany()
  await prisma.servicesCatalog.deleteMany()
  await prisma.client.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.user.deleteMany()
  await prisma.taller.deleteMany()

  console.log('🧹 Cleaned existing data')

  // Create global services catalog
  for (const service of globalServices) {
    await prisma.servicesCatalog.create({
      data: {
        descripcion: service.descripcion,
        cabysCode: service.cabysCode,
        precioSugeridoCentimos: service.precio,
        isGlobal: true,
        isFavorite: false,
      },
    })
  }
  console.log(`✅ Created ${globalServices.length} global services`)

  // Create demo taller
  const taller = await prisma.taller.create({
    data: {
      nombre: 'Taller Mecánico Demo',
      cedulaJuridica: '3-101-123456',
      nombreResponsable: 'Juan Pérez',
      telefono: '+506 8888-8888',
      email: 'demo@tallerdemo.cr',
      nombreComercial: 'AutoService CR',
      actividadEconomica: '452001',
      provincia: '1',
      canton: '01',
      distrito: '01',
      barrio: '01',
      otrasSenas: 'Frente al parque central, 100m norte de la iglesia',
    },
  })
  console.log('✅ Created demo taller')

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 10)
  await prisma.user.create({
    data: {
      email: 'demo@tallerdemo.cr',
      passwordHash,
      tallerId: taller.id,
    },
  })
  console.log('✅ Created demo user (email: demo@tallerdemo.cr, password: demo123)')

  // Create demo vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        tallerId: taller.id,
        placa: 'ABC-123',
        marca: 'Toyota',
        modelo: 'Corolla',
        año: 2020,
        color: 'Blanco',
        kilometraje: 45000,
      },
    }),
    prisma.vehicle.create({
      data: {
        tallerId: taller.id,
        placa: 'DEF-456',
        marca: 'Honda',
        modelo: 'Civic',
        año: 2019,
        color: 'Negro',
        kilometraje: 62000,
      },
    }),
    prisma.vehicle.create({
      data: {
        tallerId: taller.id,
        placa: 'GHI-789',
        marca: 'Hyundai',
        modelo: 'Tucson',
        año: 2021,
        color: 'Gris',
        kilometraje: 28000,
      },
    }),
    prisma.vehicle.create({
      data: {
        tallerId: taller.id,
        placa: 'TX-1234',
        marca: 'Nissan',
        modelo: 'Sentra',
        año: 2018,
        color: 'Rojo',
        kilometraje: 95000,
      },
    }),
  ])
  console.log(`✅ Created ${vehicles.length} demo vehicles`)

  // Create demo clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        tallerId: taller.id,
        nombreCompleto: 'María González Rodríguez',
        tipoIdentificacion: 'FISICA',
        numeroIdentificacion: '1-1234-5678',
        telefono: '+506 7777-7777',
        email: 'maria@email.com',
      },
    }),
    prisma.client.create({
      data: {
        tallerId: taller.id,
        nombreCompleto: 'Carlos Jiménez Mora',
        tipoIdentificacion: 'FISICA',
        numeroIdentificacion: '2-3456-7890',
        telefono: '+506 6666-6666',
        email: 'carlos@email.com',
      },
    }),
    prisma.client.create({
      data: {
        tallerId: taller.id,
        nombreCompleto: 'Empresa ABC S.A.',
        tipoIdentificacion: 'JURIDICA',
        numeroIdentificacion: '3-102-654321',
        telefono: '+506 2222-2222',
        email: 'contacto@empresaabc.cr',
      },
    }),
  ])
  console.log(`✅ Created ${clients.length} demo clients`)

  // Create demo service orders
  const orders = await Promise.all([
    // Order 1: BORRADOR
    prisma.serviceOrder.create({
      data: {
        tallerId: taller.id,
        vehicleId: vehicles[0].id,
        clientId: clients[0].id,
        orderNumber: 'ORD-2024-001',
        status: 'BORRADOR',
        motivoIngreso: 'Mantenimiento preventivo 45,000 km',
        subtotalCentimos: 4500000,
        ivaCentimos: 585000,
        totalCentimos: 5085000,
        lineItems: {
          create: [
            {
              numeroLinea: 1,
              descripcion: 'Cambio de aceite de motor',
              cabysCode: '8527101010000',
              cantidad: 1,
              precioUnitarioCentimos: 1500000,
              subtotalCentimos: 1500000,
              ivaCentimos: 195000,
              totalLineaCentimos: 1695000,
            },
            {
              numeroLinea: 2,
              descripcion: 'Cambio de filtro de aceite',
              cabysCode: '8527101020000',
              cantidad: 1,
              precioUnitarioCentimos: 500000,
              subtotalCentimos: 500000,
              ivaCentimos: 65000,
              totalLineaCentimos: 565000,
            },
            {
              numeroLinea: 3,
              descripcion: 'Alineación y balanceo',
              cabysCode: '8527301010000',
              cantidad: 1,
              precioUnitarioCentimos: 2500000,
              subtotalCentimos: 2500000,
              ivaCentimos: 325000,
              totalLineaCentimos: 2825000,
            },
          ],
        },
        statusHistory: {
          create: {
            fromStatus: null,
            toStatus: 'BORRADOR',
            notes: 'Orden creada',
          },
        },
      },
    }),
    // Order 2: ENVIADA
    prisma.serviceOrder.create({
      data: {
        tallerId: taller.id,
        vehicleId: vehicles[1].id,
        clientId: clients[1].id,
        orderNumber: 'ORD-2024-002',
        status: 'ENVIADA',
        motivoIngreso: 'Frenos hacen ruido',
        subtotalCentimos: 10500000,
        ivaCentimos: 1365000,
        totalCentimos: 11865000,
        lineItems: {
          create: [
            {
              numeroLinea: 1,
              descripcion: 'Cambio de pastillas de freno delanteras',
              cabysCode: '8527201010000',
              cantidad: 1,
              precioUnitarioCentimos: 4500000,
              subtotalCentimos: 4500000,
              ivaCentimos: 585000,
              totalLineaCentimos: 5085000,
            },
            {
              numeroLinea: 2,
              descripcion: 'Cambio de discos de freno',
              cabysCode: '8527201030000',
              cantidad: 1,
              precioUnitarioCentimos: 6000000,
              subtotalCentimos: 6000000,
              ivaCentimos: 780000,
              totalLineaCentimos: 6780000,
            },
          ],
        },
        tokens: {
          create: {
            token: 'demo-token-123456',
            expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
            used: false,
          },
        },
        statusHistory: {
          create: [
            {
              fromStatus: null,
              toStatus: 'BORRADOR',
              notes: 'Orden creada',
            },
            {
              fromStatus: 'BORRADOR',
              toStatus: 'ENVIADA',
              notes: 'Cotización enviada al cliente',
            },
          ],
        },
      },
    }),
    // Order 3: APROBADA
    prisma.serviceOrder.create({
      data: {
        tallerId: taller.id,
        vehicleId: vehicles[2].id,
        clientId: clients[2].id,
        orderNumber: 'ORD-2024-003',
        status: 'APROBADA',
        motivoIngreso: 'Revisión pre-RTV',
        subtotalCentimos: 6000000,
        ivaCentimos: 780000,
        totalCentimos: 6780000,
        lineItems: {
          create: [
            {
              numeroLinea: 1,
              descripcion: 'Revisión general pre-RTV',
              cabysCode: '8527901010000',
              cantidad: 1,
              precioUnitarioCentimos: 3500000,
              subtotalCentimos: 3500000,
              ivaCentimos: 455000,
              totalLineaCentimos: 3955000,
            },
            {
              numeroLinea: 2,
              descripcion: 'Alineación y balanceo',
              cabysCode: '8527301010000',
              cantidad: 1,
              precioUnitarioCentimos: 2500000,
              subtotalCentimos: 2500000,
              ivaCentimos: 325000,
              totalLineaCentimos: 2825000,
            },
          ],
        },
        statusHistory: {
          create: [
            {
              fromStatus: null,
              toStatus: 'BORRADOR',
              notes: 'Orden creada',
            },
            {
              fromStatus: 'BORRADOR',
              toStatus: 'ENVIADA',
              notes: 'Cotización enviada',
            },
            {
              fromStatus: 'ENVIADA',
              toStatus: 'APROBADA',
              notes: 'Cliente aprobó la cotización',
            },
          ],
        },
      },
    }),
  ])
  console.log(`✅ Created ${orders.length} demo service orders`)

  console.log('')
  console.log('🎉 Database seed completed successfully!')
  console.log('')
  console.log('Demo credentials:')
  console.log('  Email: demo@tallerdemo.cr')
  console.log('  Password: demo123')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
