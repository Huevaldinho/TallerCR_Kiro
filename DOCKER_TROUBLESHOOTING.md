# Docker Troubleshooting - Watchpack Errors

## Problema: Watchpack Errors en WSL2/Windows

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

## Referencias

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Desktop WSL2 Backend](https://docs.docker.com/desktop/windows/wsl/)
- [Webpack Watch Options](https://webpack.js.org/configuration/watch/)
