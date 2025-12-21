# 📚 Índice de Documentación - Taller Pro CR

Este documento te guía a través de toda la documentación disponible del proyecto.

---

## 🚀 Para Empezar (Nuevos Desarrolladores)

**Lee en este orden:**

1. **[README.md](./README.md)** ⭐ **EMPIEZA AQUÍ**
   - Visión general del proyecto
   - Setup rápido con Docker
   - Comandos básicos
   - Estructura del proyecto

2. **[.kiro/steering/development-workflow.md](./.kiro/steering/development-workflow.md)**
   - Comandos de PowerShell (Windows)
   - Patrones de diseño
   - Testing strategy
   - Convenciones de código

3. **[DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md)**
   - Problemas comunes con Docker
   - Soluciones paso a paso

---

## 📖 Documentación por Tema

### 🗄️ Base de Datos

| Documento | Descripción |
|-----------|-------------|
| `prisma/schema.prisma` | Esquema completo de la base de datos |
| `prisma/migrations/` | Historial de cambios en la BD |
| `prisma/seed.ts` | Datos de prueba |

**Comandos útiles:**
```bash
# Ver esquema en navegador
docker exec taller-app npx prisma studio

# Crear migración
docker exec taller-app npx prisma migrate dev --name nombre

# Aplicar migraciones
docker exec taller-app npx prisma migrate deploy
```

---

### 🔌 API REST

| Documento | Descripción |
|-----------|-------------|
| **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** | Documentación completa de todos los endpoints |
| `http://localhost:3000/api-docs` | Swagger UI interactivo (cuando la app está corriendo) |
| `src/app/api/` | Código fuente de los endpoints |

**Endpoints principales:**
- `/api/clientes` - Gestión de clientes
- `/api/vehiculos` - Gestión de vehículos
- `/api/ordenes` - Gestión de órdenes
- `/api/dashboard/stats` - Estadísticas
- `/api/health` - Health check

---

### 🎨 Frontend

| Documento | Descripción |
|-----------|-------------|
| `src/app/dashboard/` | Páginas del dashboard |
| `src/components/` | Componentes reutilizables |
| `tailwind.config.ts` | Configuración de estilos |

**Estructura:**
```
src/app/dashboard/
├── clientes/          # Gestión de clientes
│   ├── page.tsx      # Listado
│   ├── nuevo/        # Crear
│   ├── [id]/         # Detalles
│   └── [id]/editar/  # Editar
├── vehiculos/         # Gestión de vehículos (misma estructura)
└── ordenes/           # Gestión de órdenes (misma estructura)
```

---

### 🧪 Testing

| Documento | Descripción |
|-----------|-------------|
| `jest.config.js` | Configuración de Jest |
| `src/**/__tests__/` | Tests unitarios |
| `.kiro/steering/development-workflow.md` | Testing strategy |

**Comandos:**
```bash
# Ejecutar todos los tests
docker exec taller-app npm test

# Tests en modo watch
docker exec taller-app npm run test:watch

# Tests con cobertura
docker exec taller-app npm test -- --coverage
```

---

### 🔄 CI/CD y DevOps

| Documento | Descripción |
|-----------|-------------|
| **[CI_CD_GUIDE.md](./CI_CD_GUIDE.md)** | Guía completa de CI/CD |
| **[.kiro/steering/AGENT_WORKFLOW.md](./.kiro/steering/AGENT_WORKFLOW.md)** | Workflow de commits y pipeline |
| `.github/workflows/ci-cd.yml` | Configuración de GitHub Actions |
| `.github/BRANCH_PROTECTION.md` | Reglas de protección de ramas |

**Pipeline automático:**
1. Push a `dev` → Tests automáticos
2. Tests pasan → Build de Docker image
3. Image se sube a GitHub Container Registry

**Ver estado:** https://github.com/Huevaldinho/TallerCR_Kiro/actions

---

### 🇨🇷 Formatos Costa Rica

| Formato | Descripción | Ejemplo |
|---------|-------------|---------|
| Cédula Física | `#-####-####` | `1-1234-5678` |
| Cédula Jurídica | `#-###-######` | `3-101-123456` |
| DIMEX | `############` | `123456789012` |
| NITE | `##########` | `1234567890` |
| Pasaporte | Alfanumérico | `AB123456` |
| Placa Particular | `ABC-123` | `ABC-123` |
| Placa Taxi | `TX-####` | `TX-1234` |
| Placa Moto | `A-#####` | `M-12345` |
| Teléfono | `+506 ####-####` | `+506 8888-8888` |
| CABYS | 13 dígitos | `8527101010000` |

---

### 💰 Manejo de Dinero

**Regla de oro:** Todos los montos se almacenan en **centimos** (enteros).

```typescript
// ₡15,000.00 se almacena como 1500000 centimos
const precioEnCentimos = 1500000
const precioDisplay = precioEnCentimos / 100  // 15000.00

// Cálculo de IVA (13%)
const iva = Math.round(subtotalCentimos * 0.13)

// Formato para display
function formatCurrency(centimos: number | null): string {
  if (!centimos) return '₡0'
  return `₡${(centimos / 100).toLocaleString('es-CR')}`
}
```

**¿Por qué centimos?**
- Evita errores de redondeo con decimales
- Precisión exacta en cálculos fiscales
- Compatible con PostgreSQL (INTEGER)

---

### 📋 Especificaciones (Specs)

Las especificaciones del proyecto están en `.kiro/specs/taller-cr-mvp/`:

| Archivo | Descripción |
|---------|-------------|
| **requirements.md** | Requisitos del sistema en formato EARS |
| **design.md** | Diseño de arquitectura y componentes |
| **tasks.md** | Lista de tareas de implementación |

**Formato EARS (Easy Approach to Requirements Syntax):**
- `THE [System] SHALL [response]` - Requisito universal
- `WHEN [trigger], THE [System] SHALL [response]` - Requisito por evento
- `WHILE [condition], THE [System] SHALL [response]` - Requisito por estado
- `IF [condition], THEN THE [System] SHALL [response]` - Manejo de errores

---

## 🛠️ Guías de Trabajo

### Para Desarrollar una Nueva Feature

1. **Leer la spec** en `.kiro/specs/taller-cr-mvp/`
2. **Crear rama:** `git checkout -b feature/nombre-feature`
3. **Implementar** siguiendo el diseño
4. **Escribir tests** (unitarios y property-based)
5. **Ejecutar tests:** `docker exec taller-app npm test`
6. **Commit:** `git commit -m "feat: descripción"`
7. **Push y crear PR:** `git push origin feature/nombre-feature`

### Para Arreglar un Bug

1. **Reproducir el bug** localmente
2. **Crear rama:** `git checkout -b fix/nombre-bug`
3. **Escribir test** que falle (reproduce el bug)
4. **Arreglar el código** hasta que el test pase
5. **Commit:** `git commit -m "fix: descripción del bug"`
6. **Push y crear PR**

### Para Actualizar la Base de Datos

1. **Modificar** `prisma/schema.prisma`
2. **Crear migración:** `docker exec taller-app npx prisma migrate dev --name nombre`
3. **Verificar** que la migración se aplicó correctamente
4. **Actualizar tipos:** `docker exec taller-app npx prisma generate`
5. **Commit** tanto el schema como la migración

---

## 🔍 Dónde Encontrar Cosas

### "¿Dónde está el código de...?"

| Funcionalidad | Ubicación |
|---------------|-----------|
| Listado de clientes | `src/app/dashboard/clientes/page.tsx` |
| Crear cliente | `src/app/dashboard/clientes/nuevo/page.tsx` |
| Detalles de cliente | `src/app/dashboard/clientes/[id]/page.tsx` |
| Editar cliente | `src/app/dashboard/clientes/[id]/editar/page.tsx` |
| API de clientes | `src/app/api/clientes/route.ts` |
| API de cliente específico | `src/app/api/clientes/[id]/route.ts` |
| Tipos de cliente | `src/types/domain/clients.ts` |
| Esquema de BD | `prisma/schema.prisma` |

**Nota:** Vehículos y órdenes siguen la misma estructura.

### "¿Dónde están los estilos?"

- **Configuración:** `tailwind.config.ts`
- **Estilos globales:** `src/app/globals.css`
- **Componentes:** Usan Tailwind CSS inline

### "¿Dónde están los tests?"

- **Tests unitarios:** `src/**/__tests__/*.test.ts`
- **Property-based tests:** `src/**/__tests__/*.property.ts`
- **Configuración:** `jest.config.js`

---

## 🆘 Ayuda Rápida

### Comandos Más Usados

```bash
# Iniciar aplicación
docker-compose up --build

# Ver logs
docker-compose logs -f taller-app

# Ejecutar tests
docker exec taller-app npm test

# Acceder a la base de datos
docker exec taller-app npx prisma studio

# Ver documentación de API
# Abrir: http://localhost:3000/api-docs

# Limpiar todo y empezar de nuevo
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Problemas Comunes

| Problema | Solución |
|----------|----------|
| Docker no inicia | Ver [DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md) |
| Tests fallan | `docker exec taller-app npm test -- --clearCache` |
| BD no conecta | `docker-compose down -v && docker-compose up --build` |
| Cambios no se reflejan | Reiniciar contenedor: `docker-compose restart taller-app` |
| Puerto 3000 ocupado | Cambiar puerto en `docker-compose.yml` |

---

## 📞 Contacto

- **Issues:** https://github.com/Huevaldinho/TallerCR_Kiro/issues
- **Pull Requests:** https://github.com/Huevaldinho/TallerCR_Kiro/pulls

---

## ✅ Checklist para Nuevos Desarrolladores

- [ ] Leí el [README.md](./README.md)
- [ ] Instalé Docker Desktop
- [ ] Cloné el repositorio
- [ ] Ejecuté `docker-compose up --build`
- [ ] Abrí http://localhost:3000 y funciona
- [ ] Abrí http://localhost:3000/api-docs y veo Swagger
- [ ] Ejecuté `docker exec taller-app npm test` y los tests pasan
- [ ] Leí [development-workflow.md](./.kiro/steering/development-workflow.md)
- [ ] Exploré el código en `src/app/dashboard/`
- [ ] Revisé el esquema de BD en `prisma/schema.prisma`
- [ ] Entiendo cómo crear una rama y hacer un PR

**¡Listo para empezar a desarrollar!** 🚀

---

**Última actualización:** Diciembre 2024
