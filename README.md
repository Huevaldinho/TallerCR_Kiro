# Taller Pro CR

Sistema de gestión para talleres mecánicos en Costa Rica con cumplimiento fiscal automático (IVA + CABYS).

- FELIPE DE JESUS OBANDO ARRIETA
- LUIS ALEJANDRO CASTRO RODRIGUEZ
- DIANA MURILLO CERDAS
- LUIS ORLANDO HERNANDEZ ULATE

 

## 📋 Estado del Proyecto

**Versión:** MVP en desarrollo  
**Última actualización:** Diciembre 21, 2024

### ✅ Funcionalidades Implementadas

- **Infraestructura y DevOps**
  - ✅ Docker Compose para desarrollo local
  - ✅ Base de datos PostgreSQL con persistencia de datos
  - ✅ Seed automático en primer inicio
  - ✅ CI/CD con GitHub Actions
  - ✅ Health check endpoint
  - ✅ Logging de errores en frontend

- **Gestión de Clientes**
  - ✅ Registro con tipos de identificación CR (Física, Jurídica, DIMEX, NITE, Pasaporte)
  - ✅ Listado, búsqueda, detalles y edición
  - ✅ Historial de órdenes por cliente
  - ✅ Estadísticas (total órdenes, total facturado)
  - ✅ Validación de formatos CR

- **Gestión de Vehículos**
  - ✅ Registro con placas CR (Particular, Taxi, Moto)
  - ✅ Listado, búsqueda por placa, detalles y edición
  - ✅ Historial de órdenes por vehículo
  - ✅ Estadísticas (total órdenes, total facturado)
  - ✅ Validación de formatos de placas

- **Gestión de Órdenes de Servicio**
  - ✅ Creación de órdenes con múltiples servicios
  - ✅ Cálculo automático de IVA (13%) con precisión monetaria
  - ✅ Códigos CABYS para servicios (catálogo de 25 servicios)
  - ✅ Estados: BORRADOR → ENVIADA → APROBADA → FACTURADA → COMPLETADA
  - ✅ Historial de cambios de estado
  - ✅ Tokens para aprobación de clientes
  - ⚠️ Soporte para imágenes (modelo creado, pendiente upload)

- **API REST Completa**
  - ✅ Endpoints CRUD para clientes, vehículos y órdenes
  - ✅ Documentación Swagger en `/api-docs`
  - ✅ Validaciones con Zod
  - ✅ Manejo de errores consistente
  - ✅ Respuestas tipadas con TypeScript

- **Dashboard**
  - ✅ Estadísticas generales (órdenes activas, ingresos, totales)
  - ✅ Navegación entre entidades
  - ✅ Links clickeables entre órdenes, clientes y vehículos
  - ✅ Filtros por estado de orden
  - ✅ Búsqueda de vehículos por placa

- **Testing**
  - ✅ 75+ tests unitarios con Jest
  - ✅ Property-based testing con fast-check
  - ✅ Tests de validación de formatos CR
  - ✅ Tests de cálculos fiscales

### 🚧 Pendiente de Implementar

- Upload de imágenes para órdenes
- Facturación electrónica (integración con Hacienda)
- Magic Links para aprobación de clientes (modelo listo)
- Autenticación y multi-tenant (modelo User creado)
- PWA y modo offline
- Notificaciones por email/SMS

---

## 🚀 Inicio Rápido

### Prerrequisitos

- **Docker** y **Docker Compose** (Recomendado)
- **O** Node.js 20+ y PostgreSQL 16

### Setup con Docker (Recomendado)

```bash
# 1. Clonar repositorio
git clone https://github.com/Huevaldinho/TallerCR_Kiro.git
cd TallerCR_Kiro

# 2. Cambiar a rama de desarrollo
git checkout dev

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Iniciar aplicación (primera vez toma ~2 minutos)
docker-compose up --build

# El sistema automáticamente:
# - Crea la base de datos PostgreSQL
# - Ejecuta las migraciones
# - Genera el cliente Prisma
# - Puebla la BD con datos de prueba
# - Inicia el servidor Next.js

# La aplicación estará disponible en:
# - Frontend: http://localhost:3000
# - API Docs: http://localhost:3000/api-docs
# - PostgreSQL: localhost:5433
```

### ✨ Datos de Prueba

Al iniciar por primera vez, el sistema crea automáticamente:

- **1 Taller Demo**: "Taller Mecánico Demo"
- **1 Usuario**: `demo@tallerdemo.cr` / `demo123`
- **25 Servicios**: Catálogo de servicios automotrices con códigos CABYS
- **4 Vehículos**: Toyota Corolla, Honda Civic, Hyundai Tucson, Nissan Sentra
- **3 Clientes**: 2 físicos, 1 jurídico
- **3 Órdenes**: En estados BORRADOR, ENVIADA, APROBADA

### 🔄 Persistencia de Datos

Los datos se mantienen entre reinicios del contenedor gracias al volumen Docker `postgres_data`. Para limpiar y reiniciar:

```bash
# Detener y eliminar volúmenes (borra todos los datos)
docker-compose down -v

# Volver a iniciar (regenera datos de prueba)
docker-compose up --build
```

### Comandos Útiles

```bash
# Desarrollo
docker-compose up --build          # Iniciar aplicación
docker-compose down                # Detener aplicación
docker-compose down -v             # Detener y eliminar volúmenes (borra datos)
docker-compose logs -f taller-app  # Ver logs en tiempo real
docker restart taller-app          # Reiniciar solo la app

# Base de datos
docker exec taller-app npx prisma migrate dev    # Crear nueva migración
docker exec taller-app npx prisma migrate deploy # Aplicar migraciones
docker exec taller-app npx prisma db seed        # Re-ejecutar seed (limpia datos existentes)
docker exec taller-app npx prisma studio         # Abrir Prisma Studio (GUI)
docker exec taller-app npx prisma generate       # Regenerar cliente Prisma

# Tests
docker exec taller-app npm test                  # Ejecutar todos los tests
docker exec taller-app npm run test:watch       # Tests en modo watch
docker exec taller-app npm run test:property    # Solo property-based tests
docker exec taller-app npm run lint              # Linter
docker exec taller-app npm run type-check        # Verificar tipos TypeScript

# Verificar estado
docker ps                                        # Ver contenedores corriendo
docker logs taller-app                          # Ver logs completos
docker exec taller-app node check-db.js         # Verificar datos en BD
```

---

## 📁 Estructura del Proyecto

```
TallerCR_Kiro/
├── .github/                    # GitHub Actions (CI/CD)
│   └── workflows/
│       └── ci-cd.yml          # Pipeline automático
├── .kiro/                      # Configuración de Kiro AI
│   ├── specs/                 # Especificaciones de features
│   └── steering/              # Guías de desarrollo
├── prisma/                     # Base de datos
│   ├── schema.prisma          # Esquema de la BD
│   ├── migrations/            # Migraciones SQL
│   └── seed.ts                # Datos de prueba (auto-ejecutado)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API REST endpoints
│   │   │   ├── clientes/     # CRUD clientes
│   │   │   ├── vehiculos/    # CRUD vehículos
│   │   │   ├── ordenes/      # CRUD órdenes
│   │   │   ├── dashboard/    # Estadísticas
│   │   │   ├── health/       # Health check
│   │   │   └── docs/         # Swagger JSON
│   │   ├── dashboard/        # Páginas del dashboard
│   │   │   ├── clientes/     # Gestión de clientes
│   │   │   ├── vehiculos/    # Gestión de vehículos
│   │   │   └── ordenes/      # Gestión de órdenes
│   │   └── api-docs/         # Swagger UI
│   ├── components/            # Componentes React (Atomic Design)
│   │   ├── ui/               # Atoms: buttons, inputs, badges
│   │   ├── forms/            # Molecules: form groups
│   │   └── layout/           # Organisms: header, cards
│   ├── lib/                   # Utilidades y lógica de negocio
│   │   ├── prisma/           # Cliente Prisma
│   │   ├── swagger/          # Configuración Swagger
│   │   ├── fiscal/           # Cálculos fiscales (IVA, CABYS)
│   │   └── validation/       # Validadores Zod
│   └── types/                 # TypeScript types
│       ├── domain/           # Tipos de dominio (Order, Vehicle, Client)
│       ├── api/              # Tipos de API (requests, responses)
│       └── index.ts          # Exportaciones centralizadas
├── docker-compose.yml         # Docker para desarrollo
├── docker-entrypoint.sh       # Script de inicialización (seed automático)
├── Dockerfile                 # Imagen Docker multi-stage
├── check-db.js                # Script para verificar datos en BD
├── package.json               # Dependencias y scripts
├── tsconfig.json              # TypeScript config (strict mode)
├── tailwind.config.ts         # Tailwind CSS config
├── jest.config.js             # Jest testing config
└── README.md                  # Este archivo
```

---

## 🗄️ Base de Datos

### Modelos Principales

```prisma
// Taller (workshop)
model Taller {
  id                String   @id @default(uuid())
  nombre            String
  cedulaJuridica    String   @unique
  telefono          String
  email             String   @unique
  // ... relaciones
}

// Cliente
model Client {
  id                    String              @id @default(uuid())
  nombreCompleto        String
  tipoIdentificacion    TipoIdentificacion  // FISICA, JURIDICA, DIMEX, NITE, PASAPORTE
  numeroIdentificacion  String
  telefono              String
  email                 String?
  // ... relaciones
}

// Vehículo
model Vehicle {
  id          String   @id @default(uuid())
  placa       String   // ABC-123, TX-1234, M-12345
  marca       String
  modelo      String
  año         Int
  color       String?
  kilometraje Int?
  // ... relaciones
}

// Orden de Servicio
model ServiceOrder {
  id               String       @id @default(uuid())
  orderNumber      String       @unique  // ORD-2024-001
  status           OrderStatus  @default(BORRADOR)
  motivoIngreso    String?
  subtotalCentimos Int?         // Almacenado en centimos
  ivaCentimos      Int?         // IVA 13%
  totalCentimos    Int?
  // ... relaciones
}

// Línea de Servicio
model ServiceLineItem {
  id                      String  @id @default(uuid())
  numeroLinea             Int
  descripcion             String
  cabysCode               String  // Código CABYS (13 dígitos)
  cantidad                Int
  precioUnitarioCentimos  Int
  subtotalCentimos        Int
  ivaCentimos             Int
  totalLineaCentimos      Int
}
```

### Migraciones

```bash
# Crear nueva migración
docker exec taller-app npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
docker exec taller-app npx prisma migrate deploy

# Ver estado de migraciones
docker exec taller-app npx prisma migrate status

# Resetear base de datos (desarrollo - BORRA TODOS LOS DATOS)
docker exec taller-app npx prisma migrate reset
```

### Seed de Datos

El seed se ejecuta automáticamente en el primer inicio. Para re-ejecutarlo manualmente:

```bash
# Re-ejecutar seed (LIMPIA Y RECREA todos los datos)
docker exec taller-app npx prisma db seed
```

**Datos creados por el seed:**
- 1 Taller: "Taller Mecánico Demo"
- 1 Usuario: demo@tallerdemo.cr / demo123
- 25 Servicios en catálogo con códigos CABYS
- 4 Vehículos de prueba
- 3 Clientes (2 físicos, 1 jurídico)
- 3 Órdenes de servicio en diferentes estados

---

## 🔌 API REST

### Documentación Interactiva

Accede a la documentación Swagger en: **http://localhost:3000/api-docs**

### Endpoints Principales

#### Clientes

```bash
GET    /api/clientes           # Listar clientes
POST   /api/clientes           # Crear cliente
GET    /api/clientes/[id]      # Obtener cliente
PATCH  /api/clientes/[id]      # Actualizar cliente
```

#### Vehículos

```bash
GET    /api/vehiculos          # Listar vehículos (soporta ?placa=ABC)
POST   /api/vehiculos          # Crear vehículo
GET    /api/vehiculos/[id]     # Obtener vehículo
PATCH  /api/vehiculos/[id]     # Actualizar vehículo
```

#### Órdenes

```bash
GET    /api/ordenes            # Listar órdenes
POST   /api/ordenes            # Crear orden
GET    /api/ordenes/[id]       # Obtener orden
PATCH  /api/ordenes/[id]       # Actualizar estado de orden
```

#### Dashboard

```bash
GET    /api/dashboard/stats    # Estadísticas generales
```

#### Health Check

```bash
GET    /api/health             # Estado de la aplicación
```

### Ejemplos de Uso (PowerShell)

```powershell
# Listar clientes
Invoke-RestMethod -Uri "http://localhost:3000/api/clientes" -Method GET

# Crear vehículo
$body = @{
  placa = "ABC-123"
  marca = "Toyota"
  modelo = "Corolla"
  año = 2020
  color = "Blanco"
  kilometraje = 45000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/vehiculos" -Method POST -Body $body -ContentType "application/json"

# Crear orden
$body = @{
  vehicleId = "uuid-del-vehiculo"
  clientId = "uuid-del-cliente"
  motivoIngreso = "Cambio de aceite"
  lineItems = @(
    @{
      descripcion = "Cambio de aceite de motor"
      cabysCode = "8527101010000"
      cantidad = 1
      precioUnitarioCentimos = 1500000  # ₡15,000.00
    }
  )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "http://localhost:3000/api/ordenes" -Method POST -Body $body -ContentType "application/json"
```

---

## 🎨 Stack Tecnológico

### Frontend
- **Next.js 14** (App Router) - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **React Hook Form** - Manejo de formularios

### Backend
- **Next.js API Routes** - API REST
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL 16** - Base de datos
- **Swagger** - Documentación de API

### DevOps
- **Docker** - Contenedorización
- **GitHub Actions** - CI/CD
- **Jest** - Testing unitario
- **fast-check** - Property-based testing

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
docker exec taller-app npm test

# Tests en modo watch
docker exec taller-app npm run test:watch

# Tests con cobertura
docker exec taller-app npm test -- --coverage

# Solo property-based tests
docker exec taller-app npm run test:property
```

### Estructura de Tests

```
src/
├── lib/
│   └── fiscal/
│       └── __tests__/
│           ├── calculations.test.ts      # Tests unitarios
│           └── calculations.property.ts  # Property-based tests
└── components/
    └── ui/
        └── __tests__/
            └── Button.test.tsx
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

El proyecto usa GitHub Actions para automatizar testing y deployment:

**Flujo:**
1. Push a `dev` → Ejecuta tests
2. Tests pasan → Construye imagen Docker
3. Imagen se sube a GitHub Container Registry

**Ver estado:** https://github.com/Huevaldinho/TallerCR_Kiro/actions

### Branch Protection

La rama `dev` requiere:
- ✅ Tests pasen
- ✅ Build exitoso
- ✅ Code review aprobado

**Documentación completa:** [CI_CD_GUIDE.md](./CI_CD_GUIDE.md)

---

## 💰 Precisión Monetaria

### Almacenamiento en Centimos

Para evitar errores de redondeo, todos los montos se almacenan como **enteros en centimos**:

```typescript
// ₡15,000.00 se almacena como 1500000 centimos
const precioEnCentimos = 1500000
const precioDisplay = precioEnCentimos / 100  // 15000.00

// Cálculo de IVA (13%)
const iva = Math.round(subtotalCentimos * 0.13)
```

### Formato de Moneda

```typescript
function formatCurrency(centimos: number | null): string {
  if (!centimos) return '₡0'
  return `₡${(centimos / 100).toLocaleString('es-CR')}`
}

// Ejemplo: formatCurrency(1500000) → "₡15,000"
```

---

## 🇨🇷 Formatos Costa Rica

### Tipos de Identificación

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Cédula Física | `#-####-####` | `1-1234-5678` |
| Cédula Jurídica | `#-###-######` | `3-101-123456` |
| DIMEX | `############` | `123456789012` |
| NITE | `##########` | `1234567890` |
| Pasaporte | Alfanumérico | `AB123456` |

### Placas de Vehículos

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Particular | `ABC-123` | `ABC-123` |
| Taxi | `TX-####` | `TX-1234` |
| Motocicleta | `A-#####` | `M-12345` |

### Teléfonos

- **Formato:** `+506 ####-####`
- **Ejemplo:** `+506 8888-8888`

### Códigos CABYS

- **Formato:** 13 dígitos
- **Ejemplo:** `8527101010000`
- **Uso:** Clasificación de bienes y servicios para facturación electrónica

---

## 📚 Documentación para el Equipo

### Guías de Desarrollo

1. **[development-workflow.md](.kiro/steering/development-workflow.md)**
   - Comandos de PowerShell para Windows
   - Estructura del proyecto
   - Patrones de diseño
   - Testing strategy

2. **[AGENT_WORKFLOW.md](.kiro/steering/AGENT_WORKFLOW.md)**
   - Workflow de commits
   - CI/CD pipeline
   - Manejo de errores
   - Best practices

3. **[CI_CD_GUIDE.md](./CI_CD_GUIDE.md)**
   - Configuración de GitHub Actions
   - Branch protection
   - Troubleshooting
   - Deployment

4. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**
   - Documentación completa de API
   - Ejemplos de uso
   - Esquemas de datos

5. **[DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md)**
   - Problemas comunes con Docker
   - Soluciones paso a paso

### Especificaciones (Specs)

Las especificaciones del proyecto están en `.kiro/specs/taller-cr-mvp/`:

- **requirements.md** - Requisitos del sistema (EARS format)
- **design.md** - Diseño de arquitectura y componentes
- **tasks.md** - Lista de tareas de implementación

---

## 📚 Documentación Completa

Este README es solo el punto de partida. Para información completa, consulta:

- **[DOCS_INDEX.md](./DOCS_INDEX.md)** - Índice de toda la documentación
- **[CURRENT_STATE.md](./CURRENT_STATE.md)** - Estado actual del proyecto (qué está hecho, qué falta)
- **[TEST_COVERAGE_REPORT.md](./TEST_COVERAGE_REPORT.md)** - Análisis detallado de cobertura de tests
- **[HOT_RELOAD_GUIDE.md](./HOT_RELOAD_GUIDE.md)** - Guía de hot reload y desarrollo rápido
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Documentación completa de API
- **[CI_CD_GUIDE.md](./CI_CD_GUIDE.md)** - Guía de CI/CD y deployment
- **[DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md)** - Solución de problemas con Docker
- **[.kiro/steering/development-workflow.md](./.kiro/steering/development-workflow.md)** - Guía de desarrollo
- **[.kiro/steering/AGENT_WORKFLOW.md](./.kiro/steering/AGENT_WORKFLOW.md)** - Workflow de commits y CI/CD
- **[.kiro/specs/taller-cr-mvp/](./kiro/specs/taller-cr-mvp/)** - Especificaciones completas (requirements, design, tasks)

---

## 🤝 Guía para Nuevos Desarrolladores

### 1. Setup Inicial (5 minutos)

```bash
# Clonar y entrar al proyecto
git clone https://github.com/Huevaldinho/TallerCR_Kiro.git
cd TallerCR_Kiro

# Cambiar a rama de desarrollo
git checkout dev

# Copiar variables de entorno
cp .env.example .env

# Iniciar con Docker
docker-compose up --build
```

### 2. Verificar que Todo Funciona

```bash
# Abrir en navegador
http://localhost:3000

# Ver documentación de API
http://localhost:3000/api-docs

# Verificar health check
curl http://localhost:3000/api/health
```

### 3. Explorar el Código

1. **Dashboard:** `src/app/dashboard/`
2. **API:** `src/app/api/`
3. **Componentes:** `src/components/`
4. **Base de datos:** `prisma/schema.prisma`

### 4. Hacer Cambios

```bash
# Crear rama para tu feature
git checkout -b feature/mi-feature

# Hacer cambios...

# Ejecutar tests
docker exec taller-app npm test

# Commit y push
git add .
git commit -m "feat: descripción del cambio"
git push origin feature/mi-feature

# Crear Pull Request en GitHub
```

### 5. Recursos Útiles

- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

---

## 🐛 Troubleshooting

### Docker no inicia

```bash
# Limpiar contenedores e imágenes
docker-compose down -v
docker system prune -a

# Reiniciar Docker Desktop
# Volver a iniciar
docker-compose up --build
```

### Base de datos no conecta

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs postgres

# Verificar datos en la base de datos
docker exec taller-app node check-db.js

# Resetear base de datos (borra todo y recrea)
docker-compose down -v
docker-compose up --build
```

### Prisma Client no inicializado

```bash
# Regenerar cliente Prisma
docker exec taller-app npx prisma generate

# Reiniciar contenedor
docker restart taller-app
```

### Tests fallan

```bash
# Limpiar cache de Jest
docker exec taller-app npm test -- --clearCache

# Reinstalar dependencias
docker-compose down
docker-compose up --build
```

### Dashboard muestra "0 items"

```bash
# Verificar que hay datos en la BD
docker exec taller-app node check-db.js

# Si no hay datos, ejecutar seed
docker exec taller-app npx prisma db seed

# Reiniciar app
docker restart taller-app
```

### Más problemas

Ver: [DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md)

---

## 📞 Contacto y Soporte

- **Issues:** https://github.com/Huevaldinho/TallerCR_Kiro/issues
- **Pull Requests:** https://github.com/Huevaldinho/TallerCR_Kiro/pulls
- **Documentación:** Este README y archivos en `/docs`

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ para talleres mecánicos de Costa Rica** 🇨🇷
