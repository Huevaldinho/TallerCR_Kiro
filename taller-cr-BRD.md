# Documento de Requerimientos de Negocio (BRD)
## Taller Pro CR - MVP1

**Versión:** 1.0  
**Fecha:** Diciembre 2024  
**Objetivo:** Sistema SaaS para talleres mecánicos en Costa Rica con cumplimiento fiscal automático

---

## 1. VISIÓN EJECUTIVA

### 1.1 Propuesta de Valor
**Taller Pro CR** es una PWA Mobile-First que permite a cualquier taller mecánico en Costa Rica:
- ✅ Generar cotizaciones profesionales con cumplimiento fiscal automático (IVA + CABYS)
- ✅ Enviar presupuestos digitales a clientes vía WhatsApp
- ✅ Recibir aprobaciones desde el celular del cliente
- ✅ **Producir JSON de factura electrónica listo para Hacienda** (ATV v4.3)

### 1.2 Problema que Resuelve
Los talleres en Costa Rica enfrentan:
1. **Fricción con clientes**: Llamadas constantes para aprobar presupuestos
2. **Riesgo fiscal**: Uso incorrecto de códigos CABYS → multas de Hacienda
3. **Falta de profesionalismo**: Cotizaciones en WhatsApp o papel sucio
4. **Barrera técnica**: Sistemas de facturación electrónica complejos y caros

### 1.3 Modelo de Negocio (Post-MVP)
- **Freemium**: 10 órdenes gratis/mes
- **Pro**: ₡15,000/mes (órdenes ilimitadas + soporte prioritario)
- **Enterprise**: ₡50,000/mes (múltiples sucursales + API Hacienda integrada)

---

## 2. ALCANCE DEL MVP1

### 2.1 Dentro del Alcance (IN SCOPE)
✅ Registro de vehículos por placa  
✅ Gestión de órdenes de servicio  
✅ Cotizador inteligente con búsqueda de servicios  
✅ Motor fiscal automático (IVA 13% + asignación CABYS)  
✅ Magic links para seguimiento del cliente  
✅ Portal público para aprobación de cotizaciones  
✅ **Generador de JSON factura electrónica (formato Hacienda ATV v4.3)**  
✅ Base de datos de 20-30 servicios comunes con CABYS pre-asignados  

### 2.2 Fuera del Alcance (OUT OF SCOPE - MVP2+)
❌ Envío real a Hacienda (requiere certificado digital del taller)  
❌ Inventario de repuestos  
❌ Control de citas/agenda  
❌ Nómina de mecánicos  
❌ Diagrama de daños SVG interactivo  
❌ Firma digital del cliente  
❌ Historial clínico completo del vehículo  
❌ Dashboard analytics avanzado  
❌ Multi-sucursal  

---

## 3. REQUERIMIENTOS DE NEGOCIO

### BR-01: Cumplimiento Fiscal Automático
**Prioridad:** 🔴 CRÍTICA  
**Descripción:** El sistema debe garantizar que todas las cotizaciones y facturas cumplan con normativa de Hacienda de Costa Rica.

**Criterios de Aceptación:**
- Todo servicio debe tener un código CABYS válido de 13 dígitos
- El IVA debe calcularse correctamente (13% sobre precio neto)
- El formato de factura electrónica debe cumplir con ATV v4.3
- Los montos deben expresarse en Colones (CRC)

**Impacto si no se cumple:** Multas de Hacienda, pérdida de confianza del taller

---

### BR-02: Adopción Sin Fricción
**Prioridad:** 🔴 CRÍTICA  
**Descripción:** Cualquier taller debe poder empezar a usar el sistema en menos de 5 minutos sin capacitación.

**Criterios de Aceptación:**
- Registro del taller con solo: Nombre, Cédula Jurídica, Teléfono
- No requiere instalación (PWA en navegador)
- Interfaz en español con terminología del sector
- Funciona en celulares gama media (Android 8+)

**Impacto si no se cumple:** Baja tasa de adopción, abandono durante onboarding

---

### BR-03: Comunicación Efectiva con Cliente
**Prioridad:** 🟡 ALTA  
**Descripción:** El cliente final debe recibir información clara y poder aprobar desde su propio celular.

**Criterios de Aceptación:**
- Generación de link único por orden (formato: `tallerprocrapp.com/orden/ABC123XYZ`)
- Link válido por 72 horas
- Vista móvil optimizada para cliente (sin menús del taller)
- Botón claro "Aprobar Cotización" con total en colones destacado
- Opción de enviar link por WhatsApp con un clic

**Impacto si no se cumple:** Clientes confundidos, aprobaciones retrasadas

---

### BR-04: Seguridad y Privacidad de Datos
**Prioridad:** 🟡 ALTA  
**Descripción:** Los datos de los clientes y talleres deben estar protegidos.

**Criterios de Aceptación:**
- Links de órdenes deben usar tokens UUID no adivinables
- Los datos del taller no son visibles entre diferentes talleres (multi-tenant)
- HTTPS obligatorio en todas las conexiones
- Cédulas/DIMEX almacenadas con hash parcial visible

**Impacto si no se cumple:** Riesgo legal, pérdida de confianza

---

### BR-05: Performance en Conexiones Limitadas
**Prioridad:** 🟡 ALTA  
**Descripción:** El sistema debe funcionar en zonas con 3G/LTE intermitente.

**Criterios de Aceptación:**
- Tiempo de carga inicial < 3 segundos en 3G
- Imágenes comprimidas automáticamente antes de subir
- Indicadores claros de estado de sincronización
- Formularios guardan progreso localmente

**Impacto si no se cumple:** Frustración en talleres rurales, pérdida de datos

---

### BR-06: Base de Datos CABYS Curada
**Prioridad:** 🔴 CRÍTICA  
**Descripción:** El sistema debe incluir códigos CABYS correctos para servicios comunes.

**Criterios de Aceptación:**
- Mínimo 20 servicios pre-cargados (aceite, frenos, suspensión, etc.)
- Cada servicio con: código CABYS, descripción oficial, precio promedio de mercado
- Buscador por palabras clave (Ej: "aceite" → muestra "Cambio de aceite motor")
- Opción de agregar servicio personalizado con código manual

**Impacto si no se cumple:** Códigos incorrectos, multas, pérdida de credibilidad

---

## 4. REQUERIMIENTOS FUNCIONALES

### RF-01: Registro de Taller (Onboarding)
**Prioridad:** 🔴 P0  
**Pantalla:** `/registro`

**Datos requeridos:**
- Nombre del taller
- Cédula Jurídica (formato: 3-101-######)
- Nombre del responsable
- Teléfono (formato: +506 #### ####)
- Correo electrónico
- Contraseña (min 8 caracteres)

**Validaciones:**
- Cédula jurídica formato válido Costa Rica
- Teléfono formato costarricense
- Email único en el sistema

---

### RF-02: Búsqueda y Registro de Vehículos
**Prioridad:** 🔴 P0  
**Pantalla:** `/vehiculos/nuevo`

**Flujo:**
1. Usuario ingresa número de placa (Ej: BFG-123)
2. Sistema busca en DB si ya existe
   - **Si existe:** Muestra datos + últimas órdenes
   - **Si no existe:** Pide datos mínimos

**Datos a capturar (vehículo nuevo):**
- Placa (PK - obligatorio)
- Marca (Ej: Toyota)
- Modelo (Ej: Corolla)
- Año (1990-2025)

**Datos opcionales:**
- Color
- Kilometraje actual
- VIN (17 caracteres)

---

### RF-03: Registro de Cliente
**Prioridad:** 🔴 P0  
**Pantalla:** Integrado en `/ordenes/nueva`

**Datos requeridos:**
- Nombre completo
- Tipo de identificación: Cédula Física / Jurídica / DIMEX / NITE / Pasaporte
- Número de identificación
- Teléfono (para envío de link)

**Datos opcionales:**
- Correo electrónico
- Dirección

**Validaciones:**
- Formato de cédula según tipo (9 dígitos físicas, 10 jurídicas, 12 DIMEX)
- Teléfono formato +506

---

### RF-04: Creación de Orden de Servicio
**Prioridad:** 🔴 P0  
**Pantalla:** `/ordenes/nueva`

**Componentes:**
1. **Selector de vehículo** (autocomplete por placa)
2. **Selector/creación de cliente**
3. **Motivo de ingreso** (campo de texto libre)
4. **Fecha de recepción** (default: hoy)

**Estados iniciales:**
- Estado: `BORRADOR`
- Número de orden: Auto-generado (Ej: `ORD-2024-001`)

---

### RF-05: Cotizador Inteligente
**Prioridad:** 🔴 P0  
**Pantalla:** `/ordenes/[id]/cotizar`

**Componentes:**

#### A) Buscador de Servicios
```
[🔍 Buscar servicio...        ]
Sugerencias:
- Cambio de aceite motor
- Pastillas de freno
- Alineación y balanceo
```

**Funcionalidad:**
- Autocomplete con servicios precargados
- Muestra código CABYS automáticamente
- Click en sugerencia → agrega línea a cotización

#### B) Línea de Cotización
```
┌─────────────────────────────────────────┐
│ Cambio de aceite motor + filtro         │
│ CABYS: 8527101010000                    │
│ Cant: [1] Precio: [₡15,000]            │
│ Subtotal: ₡15,000  IVA: ₡1,950          │
│                                 [Quitar]│
└─────────────────────────────────────────┘
```

**Campos por línea:**
- Descripción del servicio
- Código CABYS (auto-asignado, editable)
- Cantidad (default: 1)
- Precio unitario
- Subtotal calculado
- IVA calculado (13%)

#### C) Resumen de Cotización
```
┌─────────────────────────────────────────┐
│ RESUMEN                                 │
│ Subtotal:        ₡45,000.00            │
│ IVA (13%):       ₡5,850.00             │
│ ─────────────────────────────           │
│ TOTAL:           ₡50,850.00            │
└─────────────────────────────────────────┘

[Guardar Borrador] [Enviar a Cliente]
```

**Validaciones:**
- Al menos 1 línea de servicio
- Precio > 0
- Código CABYS debe ser 13 dígitos

---

### RF-06: Generador de Magic Link
**Prioridad:** 🔴 P0  
**Trigger:** Click en "Enviar a Cliente" en cotización

**Proceso:**
1. Sistema valida que orden tenga:
   - Cliente con teléfono
   - Al menos 1 servicio cotizado
2. Genera token UUID único
3. Guarda en DB: `order_tokens(order_id, token, expires_at, used)`
4. Crea URL: `https://app.tallerprocrapp.com/orden/ABC123?token=xyz`
5. Cambia estado de orden a: `ENVIADA`

**Opciones de envío:**
```
┌─────────────────────────────────────────┐
│ Cotización Lista                        │
│                                         │
│ [📱 Enviar por WhatsApp]               │
│ [📋 Copiar Link]                       │
│ [✉️ Enviar por Email]                  │
└─────────────────────────────────────────┘
```

**Validez del token:**
- 72 horas desde creación
- Una sola aprobación permitida
- Después de aprobar, link muestra "Ya aprobado"

---

### RF-07: Portal Público del Cliente
**Prioridad:** 🔴 P0  
**URL:** `/orden/[id]?token=xyz`  
**Vista:** Pública (sin login)

**Información mostrada:**
```
┌─────────────────────────────────────────┐
│ 🚗 Toyota Corolla 2015                  │
│    Placa: BFG-123                       │
│                                         │
│ 📋 COTIZACIÓN                           │
│                                         │
│ ✓ Cambio de aceite           ₡15,000   │
│ ✓ Pastillas de freno         ₡45,000   │
│ ✓ Alineación                 ₡12,000   │
│                                         │
│ Subtotal:                    ₡72,000   │
│ IVA (13%):                   ₡9,360    │
│ ─────────────────────────────           │
│ TOTAL A PAGAR:               ₡81,360   │
│                                         │
│ [✅ Aprobar Cotización]                │
│                                         │
│ Taller: MECANICA EXPRESS               │
│ Tel: 8888-8888                         │
└─────────────────────────────────────────┘
```

**Funcionalidad:**
- **Botón "Aprobar":**
  - Requiere confirmación ("¿Está seguro?")
  - Actualiza estado de orden a: `APROBADA`
  - Marca token como `used: true`
  - Muestra mensaje: "¡Aprobado! El taller comenzará el trabajo"
  
**Si token vencido:**
- Muestra: "Este link ya expiró. Contacte al taller."

**Si ya fue usado:**
- Muestra: "Esta cotización ya fue aprobada el [fecha]"

---

### RF-08: Gestión de Estados de Orden
**Prioridad:** 🔴 P0  
**Estados posibles:**

```
BORRADOR 
  ↓ (Enviar a Cliente)
ENVIADA
  ↓ (Cliente aprueba)
APROBADA
  ↓ (Generar Factura)
FACTURADA
  ↓ (Marcar como entregado)
COMPLETADA
```

**Transiciones permitidas:**
- `BORRADOR` → `ENVIADA`: Taller envía cotización
- `ENVIADA` → `APROBADA`: Cliente aprueba
- `ENVIADA` → `BORRADOR`: Taller edita (invalida link anterior)
- `APROBADA` → `FACTURADA`: Taller genera JSON factura
- `FACTURADA` → `COMPLETADA`: Taller marca como entregado

**Reglas:**
- No se puede editar orden en estado `FACTURADA`
- Cambio de estado se registra con timestamp y usuario

---

### RF-09: Generador de Factura Electrónica (JSON)
**Prioridad:** 🔴 P0  
**Trigger:** Click en "Generar Factura" en orden `APROBADA`

**Datos requeridos previos:**
- Taller debe tener configurado:
  - Cédula Jurídica
  - Nombre Comercial
  - Dirección
  - Email
  - Teléfono
  - Actividad económica
  
**Estructura JSON generada (ATV v4.3):**
```json
{
  "clave": "50611240112345678901234567890123456789012345678",
  "codigoActividad": "452010",
  "numeroConsecutivo": "00100001010000000001",
  "fechaEmision": "2024-12-19T14:30:00-06:00",
  "emisor": {
    "nombre": "MECANICA EXPRESS SA",
    "identificacion": {
      "tipo": "02",
      "numero": "3101234567"
    },
    "nombreComercial": "Mecanica Express",
    "ubicacion": {
      "provincia": "1",
      "canton": "01",
      "distrito": "01",
      "barrio": "01",
      "otrasSenas": "100m norte de..."
    },
    "telefono": {
      "codigoPais": "506",
      "numTelefono": "88888888"
    },
    "correoElectronico": "mecanica@express.cr"
  },
  "receptor": {
    "nombre": "JUAN PEREZ GOMEZ",
    "identificacion": {
      "tipo": "01",
      "numero": "105550555"
    },
    "telefono": {
      "codigoPais": "506",
      "numTelefono": "77777777"
    }
  },
  "condicionVenta": "01",
  "plazoCredito": "0",
  "medioPago": ["01"],
  "detalleServicio": [
    {
      "numeroLinea": 1,
      "codigoComercial": [
        {
          "tipo": "04",
          "codigo": "8527101010000"
        }
      ],
      "cantidad": 1,
      "unidadMedida": "Sp",
      "detalle": "Cambio de aceite motor + filtro",
      "precioUnitario": 15000,
      "montoTotal": 15000,
      "subtotal": 15000,
      "montoTotalLinea": 16950,
      "impuesto": [
        {
          "codigo": "01",
          "codigoTarifa": "08",
          "tarifa": 13,
          "monto": 1950
        }
      ]
    }
  ],
  "resumenFactura": {
    "codigoTipoMoneda": {
      "codigoMoneda": "CRC",
      "tipoCambio": 1
    },
    "totalVentaNeta": 72000,
    "totalImpuesto": 9360,
    "totalComprobante": 81360
  }
}
```

**Acción post-generación:**
- JSON se guarda en campo `invoice_json` de la orden
- Estado cambia a: `FACTURADA`
- Se muestra botón "Descargar JSON" en interfaz del taller
- **No se envía a Hacienda en MVP1** (eso requiere certificado digital)

---

### RF-10: Dashboard de Órdenes
**Prioridad:** 🟡 P1  
**Pantalla:** `/ordenes` (Home del taller)

**Vista de Lista:**
```
┌─────────────────────────────────────────────────┐
│ Filtros: [Todas] [Enviadas] [Aprobadas]       │
├─────────────────────────────────────────────────┤
│ ORD-2024-003  │ ENVIADA    │ ₡81,360         │
│ Toyota Corolla - BFG-123                       │
│ Juan Pérez • Hace 2 horas                     │
├─────────────────────────────────────────────────┤
│ ORD-2024-002  │ APROBADA   │ ₡150,000        │
│ Hyundai Tucson - LMN-456                      │
│ María López • Hace 1 día                      │
└─────────────────────────────────────────────────┘
```

**Acciones por orden:**
- Click → Ver detalle
- Menu 3 puntos: Editar / Duplicar / Eliminar

---

## 5. HISTORIAS DE USUARIO (USER STORIES)

### Épica 1: ONBOARDING Y CONFIGURACIÓN

#### US-001: Registro del Taller
**Como** dueño de taller mecánico  
**Quiero** registrarme en el sistema con mis datos básicos  
**Para** empezar a gestionar órdenes digitalmente

**Criterios de Aceptación:**
- [ ] Formulario pide: Nombre, Cédula Jurídica, Responsable, Tel, Email, Contraseña
- [ ] Valida formato de cédula jurídica (3-###-######)
- [ ] Valida teléfono costarricense (+506 #### ####)
- [ ] Muestra error si email ya existe
- [ ] Al completar, me lleva al dashboard vacío
- [ ] Recibo email de confirmación

**Prototipo:**
```
┌─────────────────────────────────┐
│   🔧 TALLER PRO CR             │
│                                 │
│ Nombre del Taller:              │
│ [_________________________]     │
│                                 │
│ Cédula Jurídica:                │
│ [3]-[___]-[________]           │
│                                 │
│ Responsable:                    │
│ [_________________________]     │
│                                 │
│ Teléfono:                       │
│ +506 [____]-[____]             │
│                                 │
│ Email:                          │
│ [_________________________]     │
│                                 │
│ Contraseña:                     │
│ [_________________________]     │
│                                 │
│      [Crear Mi Cuenta]         │
└─────────────────────────────────┘
```

---

#### US-002: Configurar Datos para Facturación
**Como** dueño de taller  
**Quiero** completar mis datos fiscales  
**Para** poder generar facturas electrónicas válidas

**Criterios de Aceptación:**
- [ ] Formulario accesible desde `/configuracion`
- [ ] Campos: Dirección exacta (Provincia, Cantón, Distrito, Señas)
- [ ] Actividad económica (dropdown con códigos comunes)
- [ ] Guarda cambios con confirmación visual
- [ ] Valida que todos los campos obligatorios estén llenos antes de permitir facturar

---

### Épica 2: GESTIÓN DE VEHÍCULOS Y CLIENTES

#### US-003: Búsqueda Rápida por Placa
**Como** mecánico  
**Quiero** buscar un auto por su placa  
**Para** ver si ya lo hemos atendido antes

**Criterios de Aceptación:**
- [ ] Campo de búsqueda en home: "Buscar por placa..."
- [ ] Muestra resultados mientras escribo (autocomplete)
- [ ] Si existe, muestra: Marca, Modelo, Año, Última orden
- [ ] Si no existe, botón "Registrar vehículo nuevo"
- [ ] Búsqueda no distingue mayúsculas/minúsculas ni guiones

**Prototipo:**
```
[🔍 BFG-1__]

Resultados:
┌─────────────────────────────────┐
│ BFG-123                         │
│ Toyota Corolla 2015             │
│ Última visita: 15 Oct 2024     │
│ [Ver Historial]                │
└─────────────────────────────────┘
```

---

#### US-004: Registro de Cliente Nuevo
**Como** mecánico  
**Quiero** ingresar datos del cliente al crear una orden  
**Para** poder enviarle la cotización y facturar

**Criterios de Aceptación:**
- [ ] Formulario aparece al crear orden si vehículo no tiene cliente asociado
- [ ] Pide: Nombre, Tipo ID, Número ID, Teléfono
- [ ] Teléfono con formato automático: +506 ####-####
- [ ] Dropdown de Tipo ID: Física / Jurídica / DIMEX / NITE / Pasaporte
- [ ] Valida largo de número según tipo (9 física, 10 jurídica, etc.)
- [ ] Guarda y asocia automáticamente a la orden

---

### Épica 3: COTIZACIÓN Y APROBACIÓN

#### US-005: Crear Cotización con Búsqueda de Servicios
**Como** mecánico  
**Quiero** agregar servicios buscando por palabras clave  
**Para** que el sistema me asigne el código CABYS correcto automáticamente

**Criterios de Aceptación:**
- [ ] Campo de búsqueda: "Buscar servicio..." con autocomplete
- [ ] Escribir "acei" muestra: "Cambio de aceite motor"
- [ ] Seleccionar servicio lo agrega como línea con:
  - Código CABYS pre-asignado
  - Precio sugerido (editable)
  - Cantidad default: 1
- [ ] Puedo editar descripción, precio y cantidad
- [ ] Subtotal e IVA se calculan automáticamente
- [ ] Total general se actualiza en tiempo real

**Prototipo:**
```
Nueva Orden - Toyota Corolla BFG-123

[🔍 Buscar servicio...]
  └─ Cambio de aceite motor (₡15,000)
  └─ Pastillas de freno (₡45,000)

Servicios Agregados:
┌────────────────────────────────────┐
│ Cambio de aceite + filtro          │
│ CABYS: 8527101010000               │
│ Cant: [1] @ ₡15,000                │
│ Subtotal: ₡15,000 + IVA: ₡1,950   │
│                           [Quitar] │
└────────────────────────────────────┘

TOTAL: ₡16,950
[+ Agregar Servicio] [Enviar a Cliente]
```

---

#### US-006: Enviar Cotización por WhatsApp
**Como** dueño de taller  
**Quiero** enviar un link de cotización por WhatsApp  
**Para** que el cliente lo vea profesionalmente y apruebe desde su celular

**Criterios de Aceptación:**
- [ ] Botón "Enviar a Cliente" valida que haya:
  - Cliente con teléfono
  - Al menos 1 servicio
- [ ] Genera link único: `app.tallerprocrapp.com/orden/ABC123?token=xyz`
- [ ] Abre WhatsApp con mensaje pre-llenado:
  ```
  ¡Hola [Cliente]! 🚗
  
  Su cotización para el [Marca Modelo] está lista:
  Total: ₡XX,XXX
  
  👉 Ver y aprobar: [LINK]
  
  Taller Pro CR
  ```
- [ ] Link válido por 72 horas
- [ ] Estado de orden cambia a `ENVIADA`
- [ ] Registro de envío con timestamp

---

#### US-007: Aprobar Cotización desde Celular
**Como** cliente del taller  
**Quiero** ver la cotización en mi celular y aprobarla  
**Para** no tener que llamar o ir físicamente al taller

**Criterios de Aceptación:**
- [ ] Link abre vista pública sin necesidad de login
- [ ] Muestra:
  - Datos del vehículo
  - Lista de servicios con precios
  - Subtotal, IVA y Total destacado
  - Datos del taller (nombre, teléfono)
- [ ] Botón grande "Aprobar Cotización" (verde)
- [ ] Confirmación: "¿Desea aprobar este presupuesto por ₡XX,XXX?"
- [ ] Al aprobar:
  - Mensaje de éxito: "¡Aprobado! El taller comenzará el trabajo"
  - Link queda deshabilitado
  - Estado de orden cambia a `APROBADA`
- [ ] Si link expiró o ya fue usado, muestra mensaje claro

**Prototipo (Vista Móvil):**
```
┌─────────────────────────────┐
│ 🚗 Toyota Corolla 2015      │
│    Placa: BFG-123           │
│                             │
│ SERVICIOS:                  │
│                             │
│ ✓ Cambio de aceite          │
│   ₡15,000                   │
│                             │
│ ✓ Pastillas de freno        │
│   ₡45,000                   │
│                             │
│ ─────────────────           │
│ Subtotal:    ₡60,000        │
│ IVA (13%):   ₡7,800         │
│ ─────────────────           │
│ TOTAL:       ₡67,800        │
│                             │
│ [✅ Aprobar Cotización]    │
│                             │
│ 📞 Taller: 8888-8888       │
└─────────────────────────────┘
```

---

#### US-008: Ver Estado de Mi Orden
**Como** cliente  
**Quiero** volver a entrar al link después de aprobar  
**Para** confirmar que mi aprobación fue registrada

**Criterios de Aceptación:**
- [ ] Link sigue siendo accesible después de aprobar
- [ ] Muestra badge: "✅ APROBADO el 19 Dic 2024, 2:30pm"
- [ ] Botón de aprobar está deshabilitado
- [ ] Muestra mensaje: "El taller está trabajando en su vehículo"
- [ ] Datos de contacto del taller visibles

---

### Épica 4: FACTURACIÓN ELECTRÓNICA

#### US-009: Generar JSON de Factura Electrónica
**Como** dueño de taller  
**Quiero** generar el documento JSON de factura electrónica  
**Para** tenerlo listo para enviar a Hacienda (o a mi sistema de facturación)

**Criterios de Aceptación:**
- [ ] Botón "Generar Factura" visible solo en órdenes `APROBADA`
- [ ] Valida que el taller tenga datos fiscales completos
- [ ] Si faltan datos, muestra modal: "Complete su información fiscal en Configuración"
- [ ] Genera JSON con formato ATV v4.3 de Hacienda
- [ ] Incluye:
  - Clave numérica de 50 dígitos
  - Datos del emisor (taller)
  - Datos del receptor (cliente)
  - Líneas de detalle con códigos CABYS
  - Cálculo correcto de impuestos
  - Resumen de totales
- [ ] JSON se guarda en DB
- [ ] Estado cambia a `FACTURADA`
- [ ] Muestra botón "Descargar JSON"

**Prototipo:**
```
┌─────────────────────────────────────┐
│ Orden ORD-2024-003                 │
│ Estado: APROBADA                   │
│                                     │
│ ✅ Cliente aprobó: 19 Dic, 2:30pm │
│                                     │
│ [📄 Generar Factura Electrónica]  │
└─────────────────────────────────────┘

↓ (Después de generar)

┌─────────────────────────────────────┐
│ Orden ORD-2024-003                 │
│ Estado: FACTURADA                  │
│                                     │
│ ✅ Factura generada: 19 Dic 3:00pm│
│ Clave: 506112401...                │
│                                     │
│ [⬇️ Descargar JSON]                │
│ [📧 Enviar por Email]              │
└─────────────────────────────────────┘
```

---

#### US-010: Descargar Factura JSON
**Como** dueño de taller  
**Quiero** descargar el archivo JSON de la factura  
**Para** subirlo a mi sistema de facturación o enviarlo a Hacienda

**Criterios de Aceptación:**
- [ ] Click en "Descargar JSON" genera archivo con formato:
  - Nombre: `FE-506112401[clave].json`
- [ ] Archivo se descarga al dispositivo
- [ ] JSON es válido (pasa validador online de Hacienda)
- [ ] Opción alternativa: "Copiar JSON al Portapapeles"

---

### Épica 5: GESTIÓN Y REPORTES

#### US-011: Ver Dashboard de Órdenes Activas
**Como** dueño de taller  
**Quiero** ver todas mis órdenes en un solo lugar  
**Para** saber qué carros están pendientes y su estado

**Criterios de Aceptación:**
- [ ] Vista lista con todas las órdenes del taller
- [ ] Filtros: Todas / Enviadas / Aprobadas / Facturadas
- [ ] Cada card muestra:
  - Número de orden
  - Vehículo (Marca, Modelo, Placa)
  - Cliente
  - Estado con color distintivo
  - Monto total
  - Tiempo transcurrido ("Hace 2 horas")
- [ ] Ordenadas por más reciente primero
- [ ] Click en orden → ir a detalle
- [ ] Botón "Nueva Orden" flotante

**Estados con colores:**
```
🟡 BORRADOR (amarillo)
🔵 ENVIADA (azul)
🟢 APROBADA (verde)
⚫ FACTURADA (gris oscuro)
```

---

#### US-012: Buscar Órdenes
**Como** mecánico  
**Quiero** buscar una orden por placa, cliente o número  
**Para** encontrarla rápidamente cuando el cliente llame

**Criterios de Aceptación:**
- [ ] Barra de búsqueda global en header
- [ ] Busca en:
  - Número de orden
  - Placa del vehículo
  - Nombre del cliente
  - Teléfono del cliente
- [ ] Resultados en tiempo real (mientras escribo)
- [ ] Click en resultado → ir a detalle

---

#### US-013: Editar Cotización Antes de Enviar
**Como** mecánico  
**Quiero** poder modificar servicios/precios antes de enviar  
**Para** ajustar según negociación con el cliente

**Criterios de Aceptación:**
- [ ] Solo se puede editar si estado es `BORRADOR`
- [ ] Si está en `ENVIADA`, botón "Editar" muestra confirmación:
  - "Esto invalidará el link anterior. ¿Continuar?"
- [ ] Al confirmar:
  - Estado vuelve a `BORRADOR`
  - Token anterior se marca como `invalidated`
  - Puedo modificar servicios/precios
- [ ] No se puede editar si estado es `APROBADA` o `FACTURADA`

---

#### US-014: Duplicar Orden (Trabajos Recurrentes)
**Como** mecánico  
**Quiero** duplicar una orden anterior  
**Para** reutilizar servicios comunes sin tener que agregarlos de nuevo

**Criterios de Aceptación:**
- [ ] Opción "Duplicar" en menú de orden
- [ ] Crea nueva orden con:
  - Mismo vehículo
  - Mismo cliente
  - Mismos servicios y precios
  - Estado: `BORRADOR`
  - Número de orden: nuevo auto-generado
- [ ] Me lleva al editor de la nueva orden
- [ ] Puedo modificar antes de enviar

---

### Épica 6: ADMINISTRACIÓN

#### US-015: Agregar Servicio Personalizado
**Como** dueño de taller  
**Quiero** agregar un servicio que no está en la lista  
**Para** poder cotizar trabajos especializados

**Criterios de Aceptación:**
- [ ] Opción "Agregar servicio personalizado" en cotizador
- [ ] Formulario pide:
  - Descripción del servicio
  - Código CABYS (validación: 13 dígitos)
  - Precio sugerido
- [ ] Servicio se guarda en catálogo del taller
- [ ] Aparece en futuras búsquedas solo para ese taller
- [ ] Opción de marcarlo como "Favorito" para acceso rápido

---

#### US-016: Ver Historial de Vehículo
**Como** mecánico  
**Quiero** ver todas las órdenes anteriores de un vehículo  
**Para** saber qué trabajos se le han hecho antes

**Criterios de Aceptación:**
- [ ] En detalle de vehículo, tab "Historial"
- [ ] Lista de órdenes ordenadas por fecha (más reciente primero)
- [ ] Muestra:
  - Fecha
  - Servicios realizados
  - Monto
  - Estado
- [ ] Click en orden → ver detalle completo
- [ ] Solo visible para el taller que creó las órdenes

---

## 6. REQUERIMIENTOS NO FUNCIONALES

### NFR-01: Performance
- Tiempo de carga inicial: < 3 segundos en 3G
- Búsqueda de servicios: < 200ms respuesta
- Generación de JSON factura: < 1 segundo
- Compresión automática de imágenes: target 500KB

### NFR-02: Disponibilidad
- Uptime: 99% (8.76 horas downtime/año aceptable para MVP)
- Backups diarios automáticos
- Recuperación ante desastres: < 24 horas

### NFR-03: Seguridad
- HTTPS obligatorio
- Autenticación JWT con refresh tokens
- Rate limiting: 100 req/min por IP
- Sanitización de inputs (prevención XSS/SQL injection)
- Tokens de orden: UUID v4 (128-bit)

### NFR-04: Escalabilidad
- Diseño multi-tenant (cada taller es un tenant)
- DB con índices en: plate, order_id, client_phone
- CDN para assets estáticos
- Paginación en listas (20 items por página)

### NFR-05: Usabilidad
- Mobile-first (diseño para pantallas ≥ 360px)
- Contraste WCAG AA (mínimo 4.5:1)
- Inputs grandes (min 44x44px touch targets)
- Feedback visual en todas las acciones (toasts, spinners)
- Soporte para Android 8+ e iOS 12+

### NFR-06: Mantenibilidad
- Código en TypeScript
- Documentación inline de funciones críticas
- Tests unitarios en funciones fiscales (tax-engine, cabys-matcher)
- Logs estructurados (JSON) con niveles: ERROR, WARN, INFO

---

## 7. SUPUESTOS Y DEPENDENCIAS

### Supuestos
1. El taller tiene acceso a internet (mínimo 3G)
2. Los mecánicos tienen smartphone Android/iOS
3. Los clientes finales tienen WhatsApp instalado
4. MVP1 NO incluye envío real a Hacienda (requiere certificado digital)
5. El taller conoce los precios de mercado de sus servicios

### Dependencias Externas
- **WhatsApp:** Para envío de links (gratis, no requiere API)
- **Hacienda CR:** Formato ATV v4.3 (público, no requiere autenticación)
- **Supabase/Firebase:** Backend as a Service (tier gratuito suficiente)
- **Cloudinary/S3:** Almacenamiento de fotos (tier gratuito: 25k trans/mes)

### Dependencias Internas
- Base de datos CABYS curada manualmente (20-30 códigos)
- Investigación legal sobre formato factura electrónica
- Diseño UI/UX Mobile-First (Figma)

---

## 8. RESTRICCIONES

### Restricciones Técnicas
- PWA debe funcionar en iOS Safari (limitaciones conocidas)
- No se puede usar localStorage para datos sensibles
- Tamaño máximo de foto: 5MB antes de compresión
- JSON de factura: máximo 2MB por documento

### Restricciones de Negocio
- MVP1 no incluye pasarela de pagos
- No se cobra al taller en fase piloto (3 meses gratis)
- Soporte solo en horario hábil (8am-5pm CR)
- Un taller = una sola ubicación física

### Restricciones Legales
- Cumplimiento con GDPR/CCPA en manejo de datos
- No almacenar números de tarjeta de crédito
- Disclaimer visible: "Sistema no envía facturas a Hacienda automáticamente"
- Aviso de privacidad obligatorio en registro

---

## 9. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Códigos CABYS incorrectos | Alta | Alto | Base de datos curada + revisión con contador. Disclaimer legal. |
| Clientes no usan WhatsApp | Media | Medio | Opción alternativa: Copiar link y enviar por SMS |
| Talleres no confían en sistema nuevo | Alta | Alto | Piloto gratis 3 meses + testimonios + soporte dedicado |
| Performance en 3G | Media | Alto | Compresión agresiva de imágenes + lazy loading |
| Cambios en formato Hacienda | Baja | Alto | Monitoreo de actualizaciones ATV + release notes |

---

## 10. CRITERIOS DE ÉXITO DEL MVP1

### Métricas de Adopción
- 10 talleres registrados en primer mes
- 5 talleres generan al menos 10 órdenes/mes
- 80% de cotizaciones enviadas son aprobadas por clientes

### Métricas de Calidad
- 0 errores críticos en producción
- Tiempo promedio de aprobación: < 24 horas
- 90% de JSONs generados pasan validador de Hacienda

### Señales de Product-Market Fit
- Talleres piden funcionalidades adicionales
- Clientes finales mencionan "link profesional" como diferenciador
- Al menos 2 talleres dispuestos a pagar después de piloto

---

## 11. ROADMAP POST-MVP1

### MVP2 (3-6 meses)
- Integración real con Hacienda (certificado digital)
- Upload de fotos de daños/repuestos
- Aprobación selectiva de servicios (cliente rechaza items)
- Dashboard analytics (ingresos, servicios más vendidos)

### MVP3 (6-12 meses)
- Multi-sucursal
- Control de inventario básico
- Historial clínico completo del vehículo
- App móvil nativa (iOS/Android)

### Futuro (12+ meses)
- Integración con proveedores de repuestos
- Sistema de citas online
- Programa de fidelización de clientes
- Marketplace de servicios entre talleres

---

## 12. GLOSARIO

| Término | Definición |
|---------|-----------|
| **CABYS** | Catálogo de Bienes y Servicios de Costa Rica. Código de 13 dígitos obligatorio para facturación electrónica |
| **ATV** | Formato de factura electrónica del Ministerio de Hacienda de Costa Rica (versión actual: 4.3) |
| **Magic Link** | URL única y temporal que permite al cliente ver/aprobar cotización sin login |
| **Multi-tenant** | Arquitectura donde múltiples talleres comparten la misma infraestructura pero con datos aislados |
| **PWA** | Progressive Web App - aplicación web que funciona como app nativa |
| **UUID** | Identificador único universal (128 bits) usado para tokens de seguridad |
| **IVA** | Impuesto al Valor Agregado - 13% en Costa Rica |
| **Cédula Jurídica** | Identificación fiscal de empresas en Costa Rica (formato: 3-###-######) |

---

## 13. APÉNDICES

### Apéndice A: Formato de Placa en Costa Rica
- **Vehículos particulares:** ABC-123 (3 letras, 3 números)
- **Taxis:** TX-1234 (2 letras, 4 números)
- **Motos:** A-12345 (1 letra, 5 números)
- Sistema debe aceptar todos los formatos

### Apéndice B: Códigos CABYS Más Comunes (20 servicios MVP)
```
8527101010000 - Servicios de cambio de aceite para vehículos
8527201010000 - Servicios de reparación del sistema de frenos
8527301010000 - Servicios de reparación de la suspensión
8527401010000 - Servicios de reparación del sistema de dirección
8527501010000 - Servicios de alineación y balanceo
8527601010000 - Servicios de reparación del sistema de escape
8527701010000 - Servicios de reparación del sistema de refrigeración
8527801010000 - Servicios de reparación del sistema eléctrico
8527901010000 - Servicios de cambio de llantas
8528001010000 - Servicios de diagnóstico automotriz
8528101010000 - Servicios de latonería y pintura
8528201010000 - Servicios de instalación de accesorios
8528301010000 - Servicios de cambio de batería
8528401010000 - Servicios de limpieza de inyectores
8528501010000 - Servicios de cambio de clutch/embrague
8528601010000 - Servicios de reparación de transmisión
8528701010000 - Servicios de cambio de pastillas de freno
8528801010000 - Servicios de cambio de discos de freno
8528901010000 - Servicios de sincronización de motor
8529001010000 - Servicios de overhaul de motor
```

### Apéndice C: Estructura de Clave Numérica (50 dígitos)
```
[Tipo: 2] + [Situación: 2] + [Sucursal: 3] + [Terminal: 5] + 
[Tipo Documento: 2] + [Consecutivo: 10] + [Código Seguridad: 8] + 
[Código País: 3] + [Fecha Emisión: 8] + [Cédula Emisor: 12]
```

### Apéndice D: Tipos de Identificación Costa Rica
- **01:** Cédula Física (9 dígitos)
- **02:** Cédula Jurídica (10 dígitos)
- **03:** DIMEX (11-12 dígitos)
- **04:** NITE (10 dígitos)

---

**FIN DEL DOCUMENTO**

_Este documento es un artefacto vivo. Se actualizará según feedback de usuarios piloto y descubrimientos durante desarrollo._

**Última actualización:** Diciembre 2024  
**Próxima revisión:** Post-lanzamiento de MVP1 (Febrero 2025)