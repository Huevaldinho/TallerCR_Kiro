# Taller Pro CR

[![CI/CD Pipeline](https://github.com/Huevaldinho/TallerCR_Kiro/actions/workflows/ci-cd.yml/badge.svg?branch=dev)](https://github.com/Huevaldinho/TallerCR_Kiro/actions/workflows/ci-cd.yml)
[![codecov](https://codecov.io/gh/Huevaldinho/TallerCR_Kiro/branch/dev/graph/badge.svg)](https://codecov.io/gh/Huevaldinho/TallerCR_Kiro)

Sistema de gestión para talleres mecánicos en Costa Rica con cumplimiento fiscal automático (IVA + CABYS) y generación de facturas electrónicas ATV v4.3.

## 🚀 Características Principales

- ✅ **Cotizaciones Profesionales** con cálculo automático de IVA (13%)
- ✅ **Códigos CABYS** pre-cargados y validados
- ✅ **Magic Links** para aprobación de clientes vía WhatsApp
- ✅ **Facturación Electrónica** compatible con Hacienda (ATV v4.3)
- ✅ **PWA Mobile-First** optimizada para talleres
- ✅ **Multi-tenant** con aislamiento de datos por taller

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Precisión Monetaria**: big.js (evita errores de redondeo)
- **Validación**: Zod + React Hook Form
- **Testing**: Jest + fast-check (property-based testing)
- **PWA**: next-pwa + Workbox

## 🏗️ Desarrollo

### Prerrequisitos

- **Docker** y **Docker Compose** (Recomendado - evita problemas de dependencias)
- **O** Node.js 18+ y npm (para desarrollo local)
- Git

### 🐳 Setup con Docker (Recomendado)

**Para nuevos desarrolladores - Setup automático:**

```bash
# Clonar repositorio
git clone https://github.com/Huevaldinho/TallerCR_Kiro.git
cd TallerCR_Kiro

# Cambiar a rama de desarrollo
git checkout dev

# Setup automático (Linux/Mac)
chmod +x scripts/setup.sh
./scripts/setup.sh

# Setup automático (Windows)
scripts\setup.bat
```

**Setup manual:**

```bash
# 1. Copiar variables de entorno
cp .env.example .env.local

# 2. Editar .env.local con tus credenciales de Supabase
# NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
# NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima

# 3. Iniciar desarrollo con Docker
make dev
# O alternativamente:
docker-compose up --build
```

**Comandos Docker disponibles:**

```bash
make dev              # Iniciar desarrollo
make test             # Ejecutar tests
make logs             # Ver logs de la aplicación
make shell            # Acceder al contenedor
make supabase         # Iniciar Supabase local (opcional)
make clean            # Limpiar contenedores e imágenes
make help             # Ver todos los comandos
```

### 💻 Desarrollo Local (Sin Docker)

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en modo desarrollo
npm run dev
```

### Scripts Disponibles

```bash
# Desarrollo
make dev             # Servidor de desarrollo (Docker)
npm run dev          # Servidor de desarrollo (local)
make test            # Tests (Docker)
npm run test         # Tests (local)

# Utilidades
make lint            # Linter
make format          # Formatear código
make clean           # Limpiar Docker
make setup           # Setup inicial

# Base de datos
make supabase        # Supabase local
make supabase-stop   # Detener Supabase

# Producción
make build           # Build de producción
make prod            # Ejecutar producción
```

## 🐳 ¿Por qué Docker?

### Ventajas para el Equipo

- **✅ Consistencia**: Mismo entorno en todos los equipos
- **✅ Sin problemas de dependencias**: No más "funciona en mi máquina"
- **✅ Setup rápido**: Nuevos desarrolladores productivos en minutos
- **✅ Aislamiento**: No interfiere con otras versiones de Node.js
- **✅ Fácil limpieza**: `make clean` elimina todo sin rastros

### Comparación

| Aspecto | Docker | Local |
|---------|--------|-------|
| Setup inicial | 5 minutos | 15-30 minutos |
| Problemas de versiones | ❌ Ninguno | ⚠️ Frecuentes |
| Consistencia del equipo | ✅ 100% | ⚠️ Variable |
| Limpieza del sistema | ✅ Completa | ⚠️ Parcial |
| Requisitos | Solo Docker | Node.js + dependencias |

## 🚀 Despliegue

### Con Docker (Recomendado)

```bash
# Build imagen de producción
docker-compose -f docker-compose.prod.yml build

# Ejecutar en producción
docker-compose -f docker-compose.prod.yml up -d
```

### Colores

- **Primario**: `#3B82F6` (Azul) - Botones principales y acciones clave
- **Secundario**: `#10B981` (Verde) - Estados de éxito y confirmaciones
- **Estados de Órdenes**:
  - BORRADOR: Amarillo (`#eab308`)
  - ENVIADA: Azul (`#3b82f6`)
  - APROBADA: Verde (`#10b981`)
  - FACTURADA: Gris oscuro (`#6b7280`)
  - COMPLETADA: Gris claro (`#9ca3af`)

### Tipografía

- **Fuente**: Inter
- **Texto del cuerpo**: 14px
- **Encabezados**: 24px

### Componentes

Todos los componentes siguen el principio mobile-first con tamaños mínimos de toque de 44px.

## 🏛️ Arquitectura

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Dashboard del taller
│   ├── orden/             # Portal público del cliente
│   └── api/               # API routes
├── components/
│   ├── ui/                # Componentes reutilizables
│   ├── forms/             # Componentes de formularios
│   ├── orders/            # Componentes específicos de órdenes
│   └── layout/            # Componentes de layout
├── lib/
│   ├── supabase/          # Cliente y utilidades de Supabase
│   ├── fiscal/            # Motor de cálculos fiscales
│   ├── invoice/           # Generador de facturas ATV
│   └── validation/        # Validadores de formatos CR
├── types/                 # Definiciones de tipos TypeScript
└── hooks/                 # Custom React hooks
```

## 💰 Precisión Monetaria

Para evitar errores de redondeo en cálculos fiscales:

- Todos los montos se almacenan como **enteros (centimos)** en la base de datos
- Cálculos usando **big.js** para precisión arbitraria
- IVA calculado como: `Math.round(subtotal_centimos * 0.13)`
- Conversión para display: `centimos / 100`

```typescript
// Ejemplo: ₡150.00 se almacena como 15000 centimos
const precioEnCentimos = 15000;
const precioDisplay = precioEnCentimos / 100; // 150.00
```

## 🇨🇷 Formatos Costa Rica

### Identificaciones

- **Cédula Física**: `#-####-####` (9 dígitos)
- **Cédula Jurídica**: `#-###-######` (10 dígitos)
- **DIMEX**: `############` (11-12 dígitos)
- **NITE**: `##########` (10 dígitos)
- **Pasaporte**: Alfanumérico 6-20 caracteres

### Placas de Vehículos

- **Particulares**: `ABC-123`
- **Taxis**: `TX-1234`
- **Motocicletas**: `A-12345`

### Teléfonos

- **Formato**: `+506 ####-####`

## 🧪 Testing

### Tests Unitarios

```bash
npm run test
```

### Tests Basados en Propiedades

```bash
npm run test:property
```

Utilizamos **fast-check** para generar casos de prueba aleatorios y verificar propiedades universales:

- Cálculos fiscales siempre exactos
- Validación de formatos costarricenses
- Aislamiento multi-tenant
- Máquina de estados de órdenes

### Cobertura de Tests

```bash
npm run test -- --coverage
```

Objetivo: > 80% de cobertura en código crítico

## 🔄 CI/CD Pipeline

El proyecto utiliza **GitHub Actions** para automatizar testing y despliegue:

### Flujo Automático

1. **Push a rama `dev`** → Ejecuta tests automáticamente
2. **Tests pasan** → Construye imagen Docker
3. **Tests fallan** → Pipeline se detiene, notifica al desarrollador
4. **Imagen construida** → Se sube a GitHub Container Registry

### Branch Protection

La rama `dev` está protegida y requiere:
- ✅ Todos los tests pasen
- ✅ Docker image se construya exitosamente
- ✅ Aprobación de código (code review)
- ✅ Rama actualizada con main

**Ver:** [.github/BRANCH_PROTECTION.md](.github/BRANCH_PROTECTION.md) para configuración detallada

### Verificar Estado

- **GitHub Actions**: https://github.com/Huevaldinho/TallerCR_Kiro/actions
- **Container Registry**: https://github.com/Huevaldinho/TallerCR_Kiro/pkgs/container/TallerCR_Kiro

### Health Check Endpoint

Verifica que la aplicación está funcionando correctamente:

```bash
# Full health check
curl http://localhost:3000/api/health | jq

# Respuesta (200 OK):
{
  "status": "healthy",
  "timestamp": "2024-12-21T10:30:00Z",
  "version": "0.1.0",
  "environment": "development",
  "uptime": 3600,
  "checks": {
    "api": "ok",
    "database": "pending",
    "cache": "pending"
  }
}

# Liveness probe (para Kubernetes)
curl -I http://localhost:3000/api/health
```

### Documentación Completa

Ver **[CI_CD_GUIDE.md](./CI_CD_GUIDE.md)** para:
- Detalles del pipeline
- Troubleshooting
- Best practices
- Monitoreo
- Despliegue

## 📱 PWA

La aplicación es una Progressive Web App que puede instalarse en dispositivos móviles:

- **Offline-first**: Funciona sin conexión
- **Instalable**: Se puede agregar a la pantalla de inicio
- **Responsive**: Optimizada para móviles
- **Service Worker**: Cache inteligente de recursos

## 🔐 Seguridad

- **Multi-tenant**: Aislamiento completo de datos por taller
- **RLS**: Row Level Security en Supabase
- **Tokens UUID v4**: Para Magic Links no adivinables
- **Validación**: Cliente y servidor con Zod
- **HTTPS**: Obligatorio en producción

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Conectar con Vercel
npx vercel

# Configurar variables de entorno en Vercel dashboard
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
```

### Docker

```bash
# Build imagen de producción
docker build -t taller-pro-cr .

# Ejecutar contenedor
docker run -p 3000:3000 taller-pro-cr
```

## 📋 Roadmap

### MVP1 (Actual)
- ✅ Registro de talleres y vehículos
- ✅ Cotizaciones con CABYS
- ✅ Magic Links para aprobación
- ✅ Generación de JSON ATV v4.3

### MVP2 (Próximo)
- 🔄 Integración real con Hacienda
- 🔄 Upload de fotos de daños
- 🔄 Dashboard analytics
- 🔄 Multi-sucursal

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, crear un issue en GitHub.

---

**Desarrollado con ❤️ para talleres mecánicos de Costa Rica** 🇨🇷