# Docker Troubleshooting - Taller Pro CR

Esta guía cubre problemas comunes con Docker y sus soluciones.

---

## Problema 1: Watchpack Errors en WSL2/Windows

### Síntomas
```
Watchpack Error (initial scan): Error: EIO: i/o error, scandir '/app/src'
Watchpack Error (initial scan): Error: ENOMEM: not enough memory
```

### Causa
Docker en Windows/WSL2 tiene limitaciones de recursos cuando monta volúmenes desde el sistema de archivos de Windows. El file watcher de Next.js (Watchpack) intenta monitorear muchos archivos y se queda sin recursos.

## Soluciones

### Solución 1: Aumentar Recursos de Docker (Recomendado)

1. **Abrir Docker Desktop**
2. **Settings → Resources**
3. **Aumentar valores**:
   - Memory: Mínimo 4GB (recomendado 6-8GB)
   - CPUs: Mínimo 2 (recomendado 4)
   - Swap: 2GB
4. **Apply & Restart**

### Solución 2: Configurar WSL2 Memory Limit

Crear/editar archivo `.wslconfig` en `C:\Users\<tu-usuario>\.wslconfig`:

```ini
[wsl2]
memory=8GB
processors=4
swap=2GB
```

Luego reiniciar WSL2:
```powershell
wsl --shutdown
```

### Solución 3: Usar Polling en lugar de File Watching

Agregar al `next.config.js`:

```javascript
const nextConfig = {
  // ... configuración existente
  
  // Para desarrollo en Docker/WSL2
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300,
      }
    }
    return config
  },
}
```

**Pros**: Funciona siempre
**Contras**: Usa más CPU, hot reload más lento

### Solución 4: Mover Proyecto a WSL2 File System

En lugar de trabajar en `/mnt/c/Users/...`, mover el proyecto a:
```bash
~/projects/TallerCR_Kiro
```

**Ventajas**:
- Mucho más rápido
- Sin errores de Watchpack
- Mejor rendimiento de Docker

**Cómo hacerlo**:
```bash
# Desde WSL2
cd ~
mkdir -p projects
cd projects
git clone https://github.com/Huevaldinho/TallerCR_Kiro.git
cd TallerCR_Kiro
git checkout dev
npm install
docker-compose up
```

### Solución 5: Ignorar los Errores (Temporal)

Los errores de Watchpack **no impiden que la aplicación funcione**. Son solo warnings del file watcher. La app sigue funcionando correctamente.

**Verificar que todo funciona**:
```bash
curl http://localhost:3000/dashboard
curl http://localhost:3000/api/health
```

Si ambos retornan 200, la app está funcionando bien a pesar de los warnings.

## Recomendación

**Para desarrollo activo**: Solución 4 (mover a WSL2 file system)
**Para demo/testing**: Solución 5 (ignorar warnings)
**Si no puedes mover**: Solución 3 (polling) + Solución 1 (más recursos)

## Verificar Estado Actual

```bash
# Ver recursos de Docker
docker stats

# Ver uso de memoria en WSL2
free -h

# Ver si la app funciona
curl http://localhost:3000/api/health
```

## Notas Importantes

1. **Los errores NO afectan la funcionalidad** - La app funciona correctamente
2. **Hot reload puede ser más lento** - Pero sigue funcionando
3. **Es un problema conocido** - Docker + Windows + file watching
4. **Producción no tiene este problema** - Solo afecta desarrollo local

---

## Problema 2: Base de Datos No Muestra Datos

### Síntomas
- Dashboard muestra "0 órdenes", "0 clientes", "0 vehículos"
- API retorna arrays vacíos `[]`
- No hay errores en consola

### Causa
La base de datos está vacía porque el seed no se ejecutó o falló.

### Solución

```bash
# 1. Verificar si hay datos
docker exec taller-app node check-db.js

# 2. Si no hay datos, ejecutar seed
docker exec taller-app npx prisma db seed

# 3. Reiniciar aplicación
docker restart taller-app

# 4. Verificar nuevamente
docker exec taller-app node check-db.js
```

### Prevención
El seed se ejecuta automáticamente en el primer inicio gracias a `docker-entrypoint.sh`. Si el contenedor se reinicia, los datos persisten en el volumen `postgres_data`.

---

## Problema 3: Prisma Client No Inicializado

### Síntomas
```
Error: @prisma/client did not initialize yet
PrismaClientInitializationError: Prisma Client could not locate the Query Engine
```

### Causa
El cliente Prisma no se generó después de cambios en el schema o después de reinstalar dependencias.

### Solución

```bash
# Regenerar cliente Prisma
docker exec taller-app npx prisma generate

# Reiniciar aplicación
docker restart taller-app
```

---

## Problema 4: Errores de Conexión a PostgreSQL

### Síntomas
```
Error: Can't reach database server at `postgres:5432`
Connection timeout
```

### Causa
PostgreSQL no está listo cuando la aplicación intenta conectarse.

### Solución

El `docker-entrypoint.sh` ya incluye un wait-for-postgres usando `pg_isready`. Si aún falla:

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs postgres

# Reiniciar servicios
docker-compose restart
```

---

## Problema 5: Migraciones Fallan

### Síntomas
```
Error: Migration failed to apply
Database schema is not in sync
```

### Causa
El schema de Prisma cambió pero las migraciones no se aplicaron.

### Solución

```bash
# Aplicar migraciones pendientes
docker exec taller-app npx prisma migrate deploy

# Si hay conflictos, resetear (BORRA TODOS LOS DATOS)
docker exec taller-app npx prisma migrate reset

# Regenerar cliente
docker exec taller-app npx prisma generate

# Reiniciar
docker restart taller-app
```

---

## Problema 6: Puerto 3000 Ya en Uso

### Síntomas
```
Error: listen EADDRINUSE: address already in use :::3000
```

### Causa
Otro proceso está usando el puerto 3000.

### Solución

```powershell
# Encontrar proceso usando puerto 3000
netstat -ano | findstr :3000

# Matar proceso (reemplazar PID)
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar puerto 3001 en lugar de 3000
```

---

## Problema 7: Volúmenes Corruptos

### Síntomas
- Datos inconsistentes
- Errores aleatorios de base de datos
- Aplicación no inicia correctamente

### Solución

```bash
# Detener y eliminar volúmenes (BORRA TODOS LOS DATOS)
docker-compose down -v

# Limpiar sistema Docker
docker system prune -a

# Volver a iniciar (regenera datos de prueba)
docker-compose up --build
```

---

## Problema 8: Errores de Frontend (Console Errors)

### Síntomas
- Errores en consola del navegador
- Componentes no se renderizan
- "Cannot read property of undefined"

### Causa
Errores silenciados en catch blocks sin logging.

### Solución Implementada
Todos los catch blocks ahora incluyen `console.error()`:

```typescript
.catch((error) => {
  console.error('Error fetching data:', error)
  // Handle error...
})
```

Para debugging:
1. Abrir DevTools (F12)
2. Ver pestaña Console
3. Buscar errores en rojo
4. Reportar el error completo

---

## Problema 9: Tests Fallan en CI pero Pasan Localmente

### Síntomas
- Tests pasan con `npm test` local
- Fallan en GitHub Actions

### Causa
- Diferencias de entorno
- Cache de Jest desactualizado
- Dependencias desincronizadas

### Solución

```bash
# Limpiar cache de Jest
docker exec taller-app npm test -- --clearCache

# Reinstalar dependencias
docker-compose down
rm -rf node_modules package-lock.json
docker-compose up --build

# Ejecutar tests como en CI
docker exec taller-app npm ci
docker exec taller-app npm test
```

---

## Problema 10: Hot Reload No Funciona

### Síntomas
- Cambios en código no se reflejan automáticamente
- Necesitas reiniciar manualmente el contenedor

### Causa
- Volúmenes no montados correctamente
- File watcher no detecta cambios

### Solución

Verificar `docker-compose.yml`:
```yaml
volumes:
  - .:/app
  - /app/node_modules
  - /app/.next
```

Si persiste, usar polling (ver Problema 1, Solución 3).

---

## Comandos Útiles de Debugging

```bash
# Ver logs en tiempo real
docker-compose logs -f taller-app

# Ver logs de PostgreSQL
docker-compose logs -f postgres

# Entrar al contenedor
docker exec -it taller-app sh

# Ver procesos corriendo
docker-compose ps

# Ver uso de recursos
docker stats

# Verificar estado de la aplicación
curl http://localhost:3000/api/health

# Verificar datos en BD
docker exec taller-app node check-db.js

# Abrir Prisma Studio (GUI para BD)
docker exec taller-app npx prisma studio
```

---

## Checklist de Troubleshooting

Cuando algo no funciona, seguir este orden:

1. ✅ **Verificar logs**: `docker-compose logs -f taller-app`
2. ✅ **Verificar PostgreSQL**: `docker-compose ps`
3. ✅ **Verificar datos**: `docker exec taller-app node check-db.js`
4. ✅ **Verificar health**: `curl http://localhost:3000/api/health`
5. ✅ **Regenerar Prisma**: `docker exec taller-app npx prisma generate`
6. ✅ **Reiniciar app**: `docker restart taller-app`
7. ✅ **Reiniciar todo**: `docker-compose restart`
8. ✅ **Limpiar y rebuild**: `docker-compose down -v && docker-compose up --build`

---

## Referencias

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Desktop WSL2 Backend](https://docs.docker.com/desktop/windows/wsl/)
- [Webpack Watch Options](https://webpack.js.org/configuration/watch/)
- [Prisma Troubleshooting](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
