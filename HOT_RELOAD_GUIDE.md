# Guía de Hot Reload - Taller Pro CR

**Última actualización:** Diciembre 21, 2024

---

## ✅ Estado Actual: Hot Reload ESTÁ CONFIGURADO

El hot reload **ya está funcionando** en tu proyecto. No necesitas reiniciar el contenedor para ver cambios.

### Configuración Actual

```yaml
# docker-compose.yml
volumes:
  - .:/app                    # ✅ Código sincronizado
  - /app/node_modules         # ✅ node_modules aislado
  - /app/.next                # ✅ .next aislado

environment:
  - WATCHPACK_POLLING=true    # ✅ Polling habilitado para Docker/WSL2
```

```javascript
// next.config.js
webpack: (config, { dev, isServer }) => {
  if (dev && !isServer) {
    config.watchOptions = {
      poll: 1000,              // ✅ Revisa cambios cada segundo
      aggregateTimeout: 300,   # ✅ Espera 300ms antes de recompilar
    }
  }
  return config
}
```

---

## 🚀 Cómo Usar el Hot Reload

### 1. Inicia el Contenedor (Solo Una Vez)

```powershell
# Primera vez o después de cambios en package.json/Dockerfile
docker-compose up --build

# O en modo detached (background)
docker-compose up -d
```

### 2. Haz Cambios en el Código

Edita cualquier archivo en:
- `src/app/**/*.tsx` - Páginas y API routes
- `src/components/**/*.tsx` - Componentes React
- `src/lib/**/*.ts` - Lógica de negocio
- `src/types/**/*.ts` - Tipos TypeScript

### 3. Guarda el Archivo (Ctrl+S)

Next.js detectará el cambio automáticamente y:
- ⚡ Recompilará solo el archivo modificado
- 🔄 Actualizará el navegador automáticamente (Fast Refresh)
- ⏱️ Tiempo: 1-3 segundos

### 4. Verifica en el Navegador

Abre http://localhost:3000 y verás los cambios **sin reiniciar el contenedor**.

---

## 🔍 Verificar que Hot Reload Funciona

### Test Rápido

1. **Abre un archivo:**
   ```powershell
   # Edita el dashboard principal
   code src/app/dashboard/page.tsx
   ```

2. **Haz un cambio visible:**
   ```typescript
   // Cambia el título
   <h1>Dashboard - TEST HOT RELOAD</h1>
   ```

3. **Guarda (Ctrl+S)**

4. **Verifica en el navegador:**
   - Abre http://localhost:3000/dashboard
   - Deberías ver el cambio en 1-3 segundos
   - **NO necesitas refrescar manualmente** (Fast Refresh lo hace)

### Ver Logs de Recompilación

```powershell
# Ver logs en tiempo real
docker-compose logs -f taller-app

# Deberías ver algo como:
# ⚡ Compiled /dashboard/page in 1.2s
# ✓ Compiled successfully
```

---

## ⚠️ Cuándo SÍ Necesitas Reiniciar

### Cambios que Requieren Reinicio del Contenedor

| Cambio | Requiere Reinicio | Comando |
|--------|-------------------|---------|
| Código fuente (`.tsx`, `.ts`) | ❌ NO | Solo guarda el archivo |
| Estilos (`.css`, Tailwind) | ❌ NO | Solo guarda el archivo |
| Variables de entorno (`.env`) | ✅ SÍ | `docker restart taller-app` |
| `package.json` (nuevas dependencias) | ✅ SÍ | `docker-compose up --build` |
| `Dockerfile` | ✅ SÍ | `docker-compose up --build` |
| `docker-compose.yml` | ✅ SÍ | `docker-compose up --build` |
| `next.config.js` | ✅ SÍ | `docker restart taller-app` |
| `prisma/schema.prisma` | ⚠️ PARCIAL | Ver sección Prisma |

### Reinicio Rápido (Sin Rebuild)

```powershell
# Solo reinicia el contenedor (mantiene la imagen)
docker restart taller-app

# Tiempo: ~10 segundos
```

### Rebuild Completo (Cuando Cambias Dependencias)

```powershell
# Reconstruye la imagen y reinicia
docker-compose up --build

# Tiempo: ~2 minutos
```

---

## 🗄️ Cambios en Prisma

### Cambios en el Schema

```powershell
# 1. Edita prisma/schema.prisma
# 2. Crea la migración
docker exec taller-app npx prisma migrate dev --name nombre_cambio

# 3. El cliente Prisma se regenera automáticamente
# 4. Hot reload detecta el cambio
# 5. NO necesitas reiniciar el contenedor
```

### Cambios en el Seed

```powershell
# Re-ejecutar seed (LIMPIA datos existentes)
docker exec taller-app npx prisma db seed

# NO necesitas reiniciar el contenedor
```

---

## 🐛 Troubleshooting

### Problema 1: Los Cambios No Se Reflejan

**Síntomas:**
- Guardas un archivo
- El navegador no se actualiza
- No ves logs de recompilación

**Soluciones:**

1. **Verifica que el servidor está corriendo:**
   ```powershell
   docker exec taller-app ps aux | Select-String "next"
   
   # Deberías ver:
   # next-server (v14.2.35)
   ```

2. **Verifica los logs:**
   ```powershell
   docker-compose logs -f taller-app
   
   # Busca errores de compilación
   ```

3. **Reinicia el contenedor:**
   ```powershell
   docker restart taller-app
   ```

4. **Limpia la caché de Next.js:**
   ```powershell
   docker exec taller-app rm -rf .next
   docker restart taller-app
   ```

### Problema 2: "Error: ENOSPC" o "ENOMEM"

**Síntomas:**
- Error: "System limit for number of file watchers reached"
- El servidor se detiene

**Solución (Windows/WSL2):**

```powershell
# Aumenta el límite de watchers en WSL2
wsl -d Ubuntu -u root sysctl -w fs.inotify.max_user_watches=524288

# O edita /etc/sysctl.conf en WSL2:
wsl -d Ubuntu
sudo nano /etc/sysctl.conf

# Agrega:
fs.inotify.max_user_watches=524288

# Aplica cambios:
sudo sysctl -p
```

### Problema 3: Cambios Lentos (>10 segundos)

**Síntomas:**
- Los cambios tardan mucho en reflejarse
- El navegador se actualiza muy lento

**Soluciones:**

1. **Verifica que polling está habilitado:**
   ```powershell
   docker exec taller-app printenv | Select-String "WATCHPACK"
   
   # Debe mostrar:
   # WATCHPACK_POLLING=true
   ```

2. **Ajusta el intervalo de polling:**
   ```javascript
   // next.config.js
   webpack: (config, { dev, isServer }) => {
     if (dev && !isServer) {
       config.watchOptions = {
         poll: 500,  // Cambia de 1000 a 500 (más rápido)
         aggregateTimeout: 200,
       }
     }
     return config
   }
   ```

3. **Reinicia después del cambio:**
   ```powershell
   docker restart taller-app
   ```

### Problema 4: Fast Refresh No Funciona

**Síntomas:**
- Los cambios se compilan
- Pero el navegador no se actualiza automáticamente

**Soluciones:**

1. **Refresca manualmente (F5)** - Fast Refresh puede fallar con ciertos errores

2. **Verifica que no hay errores de sintaxis:**
   ```powershell
   docker exec taller-app npm run type-check
   ```

3. **Limpia el navegador:**
   - Abre DevTools (F12)
   - Click derecho en el botón de refrescar
   - "Empty Cache and Hard Reload"

---

## 📊 Comparación de Tiempos

| Acción | Sin Hot Reload | Con Hot Reload | Ahorro |
|--------|----------------|----------------|--------|
| Cambio en código | 2 minutos (rebuild) | 1-3 segundos | 99% ⚡ |
| Cambio en estilos | 2 minutos (rebuild) | 1-2 segundos | 99% ⚡ |
| Nueva dependencia | 2 minutos (rebuild) | 2 minutos (rebuild) | 0% |
| Cambio en .env | 10 segundos (restart) | 10 segundos (restart) | 0% |
| Cambio en Prisma | 2 minutos (rebuild) | 5 segundos (migrate) | 95% ⚡ |

---

## 🎯 Workflow Recomendado

### Desarrollo Diario

```powershell
# 1. Inicia el contenedor (una vez al día)
docker-compose up -d

# 2. Verifica que está corriendo
docker ps

# 3. Abre el navegador
start http://localhost:3000

# 4. Edita código en VS Code
# 5. Guarda (Ctrl+S)
# 6. Verifica cambios en el navegador (automático)

# 7. Al final del día, detén el contenedor
docker-compose down
```

### Desarrollo con Tests

```powershell
# Terminal 1: Servidor de desarrollo
docker-compose up

# Terminal 2: Tests en watch mode
docker exec taller-app npm run test:watch

# Ambos se actualizan automáticamente al guardar archios
```

### Desarrollo con Logs

```powershell
# Terminal 1: Logs en tiempo real
docker-compose logs -f taller-app

# Terminal 2: Edita código en VS Code

# Verás la recompilación en Terminal 1 inmediatamente
```

---

## 🔧 Optimizaciones Adicionales

### 1. Excluir Archivos del Watch

Si tienes archivos grandes que no necesitan hot reload:

```javascript
// next.config.js
webpack: (config, { dev, isServer }) => {
  if (dev && !isServer) {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/coverage/**',
        '**/dist/**',
      ],
    }
  }
  return config
}
```

### 2. Aumentar Recursos de Docker

Si el hot reload es lento:

```powershell
# Docker Desktop → Settings → Resources
# - CPU: 4+ cores
# - Memory: 4+ GB
# - Swap: 2+ GB
```

### 3. Usar Turbopack (Experimental)

Next.js 14 incluye Turbopack (más rápido que Webpack):

```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbo"
  }
}
```

Luego reinicia:
```powershell
docker restart taller-app
```

---

## ✅ Checklist de Verificación

Antes de reportar problemas con hot reload, verifica:

- [ ] El contenedor está corriendo: `docker ps`
- [ ] El servidor Next.js está activo: `docker exec taller-app ps aux | Select-String "next"`
- [ ] Los volúmenes están montados: `docker inspect taller-app | Select-String "Mounts"`
- [ ] WATCHPACK_POLLING está habilitado: `docker exec taller-app printenv | Select-String "WATCHPACK"`
- [ ] No hay errores en los logs: `docker-compose logs taller-app`
- [ ] El archivo se guardó correctamente: Verifica timestamp en VS Code
- [ ] El navegador está abierto en http://localhost:3000
- [ ] No hay errores de TypeScript: `docker exec taller-app npm run type-check`

---

## 📞 Soporte

Si el hot reload no funciona después de seguir esta guía:

1. **Captura logs:**
   ```powershell
   docker-compose logs taller-app > logs.txt
   ```

2. **Verifica configuración:**
   ```powershell
   docker exec taller-app cat next.config.js
   docker exec taller-app printenv
   ```

3. **Reporta el problema** con:
   - Sistema operativo (Windows/WSL2/Linux/Mac)
   - Versión de Docker: `docker --version`
   - Logs capturados
   - Pasos para reproducir

---

## 🎓 Recursos Adicionales

- [Next.js Fast Refresh](https://nextjs.org/docs/architecture/fast-refresh)
- [Docker Volumes](https://docs.docker.com/storage/volumes/)
- [Webpack Watch Options](https://webpack.js.org/configuration/watch/)
- [WSL2 File Watching](https://learn.microsoft.com/en-us/windows/wsl/compare-versions#performance-across-os-file-systems)

---

**Última actualización:** Diciembre 21, 2024  
**Mantenido por:** Equipo de Desarrollo
