# Requirements Document

## Introduction

Taller Pro CR es una Progressive Web Application (PWA) Mobile-First que permite a talleres mecánicos en Costa Rica generar cotizaciones profesionales con cumplimiento fiscal automático (IVA + CABYS), enviar presupuestos digitales a clientes vía WhatsApp, recibir aprobaciones desde el celular del cliente, y producir JSON de factura electrónica listo para Hacienda (ATV v4.3).

El sistema resuelve problemas críticos de los talleres: fricción con clientes en aprobaciones, riesgo fiscal por uso incorrecto de códigos CABYS, falta de profesionalismo en cotizaciones, y barreras técnicas en sistemas de facturación electrónica complejos y caros.

## Glossary

- **System**: La aplicación web Taller Pro CR
- **Taller**: Taller mecánico registrado en el sistema
- **Workshop_Operator**: Usuario del taller (mecánico, dueño, administrador)
- **Vehicle_Registry**: Módulo de registro y búsqueda de vehículos
- **Service_Order**: Orden de trabajo que contiene servicios a realizar en un vehículo
- **Quotation_Engine**: Motor de cotización que calcula precios con IVA
- **Invoice_Generator**: Generador de facturas electrónicas formato ATV v4.3
- **Magic_Link**: URL única y temporal para aprobación de órdenes por parte del cliente
- **CABYS_Code**: Código de 13 dígitos del Catálogo de Bienes y Servicios de Costa Rica
- **CRC**: Colones costarricenses (moneda oficial)
- **IVA**: Impuesto al Valor Agregado (13% en Costa Rica)
- **ATV**: Sistema de facturación electrónica de Hacienda Costa Rica versión 4.3
- **Placa**: Número de matrícula del vehículo
- **Cédula_Jurídica**: Identificación fiscal de empresas en Costa Rica (formato: 3-###-######)
- **Order_Status**: Estado de la orden (BORRADOR, ENVIADA, APROBADA, FACTURADA, COMPLETADA)
- **Token**: UUID v4 único usado para Magic Links
- **Client**: Cliente final dueño del vehículo

## Requirements

### Requirement 1: Taller Registration and Onboarding

**User Story:** As a taller owner, I want to register my workshop with minimal information in less than 5 minutes, so that I can start using the system immediately without training.

#### Acceptance Criteria

1. WHEN a new taller registers, THE System SHALL require only: nombre del taller, cédula jurídica, nombre del responsable, teléfono, email, and contraseña
2. WHEN a cédula jurídica is entered, THE System SHALL validate the format matches Costa Rican standard (3-###-######)
3. WHEN a teléfono is entered, THE System SHALL validate the format matches Costa Rican standard (+506 #### ####)
4. WHEN an email is entered, THE System SHALL verify it is unique in the system
5. WHEN registration is complete, THE System SHALL send a confirmation email
6. THE System SHALL provide the interface in Spanish with automotive industry terminology
7. THE System SHALL function on Android 8+ devices without installation

### Requirement 2: Fiscal Configuration for Invoicing

**User Story:** As a taller owner, I want to configure my fiscal information, so that I can generate valid electronic invoices.

#### Acceptance Criteria

1. THE System SHALL provide a configuration page accessible at `/configuracion`
2. WHEN configuring fiscal data, THE System SHALL require: dirección completa (provincia, cantón, distrito, señas), actividad económica, nombre comercial
3. THE System SHALL provide a dropdown with common actividad económica codes for automotive services
4. WHEN fiscal data is incomplete, THE System SHALL prevent invoice generation and display a clear message
5. WHEN fiscal data is saved, THE System SHALL display a visual confirmation

### Requirement 3: Vehicle Registration and Search

**User Story:** As a workshop operator, I want to search for vehicles by license plate and register new vehicles when they don't exist, so that I can quickly access vehicle information and create service orders.

#### Acceptance Criteria

1. WHEN a user enters a license plate in the search field, THE Vehicle_Registry SHALL query the database for matching vehicles
2. THE Vehicle_Registry SHALL perform case-insensitive search ignoring hyphens
3. WHEN a vehicle is found, THE System SHALL display: marca, modelo, año, and última visita date
4. WHEN a vehicle is found, THE System SHALL provide options to view historial and crear nueva orden
5. WHEN a vehicle is not found, THE System SHALL display a registration form with the license plate pre-filled
6. WHEN registering a new vehicle, THE System SHALL require: placa, marca, modelo, año
7. WHEN registering a new vehicle, THE System SHALL accept optional fields: color, kilometraje, VIN (17 characters)
8. THE Vehicle_Registry SHALL accept all Costa Rican plate formats: ABC-123 (particulares), TX-1234 (taxis), A-12345 (motos)

### Requirement 4: Client Registration

**User Story:** As a workshop operator, I want to register client information with automatic input formatting and validation, so that I can send quotations and generate invoices with correct identification data.

#### Acceptance Criteria

1. WHEN creating a service order, THE System SHALL provide a client registration form if the vehicle has no associated client
2. WHEN registering a client, THE System SHALL require: nombre completo, tipo de identificación, número de identificación, teléfono
3. THE System SHALL provide a dropdown for tipo de identificación with options: Cédula Física, Cédula Jurídica, DIMEX, NITE, Pasaporte
4. WHEN a Cédula Física is selected, THE System SHALL apply input mask #-####-#### and validate the number has exactly 9 digits
5. WHEN a Cédula Jurídica is selected, THE System SHALL apply input mask #-###-###### and validate the number has exactly 10 digits
6. WHEN a DIMEX is selected, THE System SHALL accept 11 or 12 numeric digits without formatting
7. WHEN a NITE is selected, THE System SHALL accept exactly 10 numeric digits without formatting
8. WHEN a Pasaporte is selected, THE System SHALL accept alphanumeric characters with length 6-20 without formatting
9. WHEN a teléfono is entered, THE System SHALL apply input mask +506 ####-#### and format it automatically
10. THE System SHALL display real-time validation errors for incorrect formats
11. THE System SHALL accept optional fields: correo electrónico, dirección

### Requirement 5: Service Order Creation

**User Story:** As a workshop operator, I want to create service orders for vehicles, so that I can track work to be performed and generate quotations.

#### Acceptance Criteria

1. WHEN creating a service order, THE System SHALL require: vehicle selection, client information, motivo de ingreso
2. WHEN a service order is created, THE System SHALL generate a unique order identifier with format ORD-YYYY-### (e.g., ORD-2024-001)
3. WHEN a service order is created, THE System SHALL set fecha de recepción to current date by default
4. WHEN a service order is created, THE System SHALL set initial status to BORRADOR
5. THE System SHALL associate the service order with the selected vehicle and client
6. THE System SHALL allow adding multiple service line items to a single service order

### Requirement 6: Intelligent Service Quotation with CABYS Catalog

**User Story:** As a workshop operator, I want an intelligent quotation system that suggests service codes with correct CABYS codes, so that I can quickly build accurate quotes that comply with fiscal regulations.

#### Acceptance Criteria

1. WHEN a user starts typing a service description, THE Quotation_Engine SHALL suggest matching services from a pre-loaded catalog of minimum 20 common services
2. WHEN a user selects a suggested service, THE System SHALL auto-fill: descripción del servicio, código CABYS (13 digits), and precio sugerido
3. THE Quotation_Engine SHALL validate that each service has a valid 13-digit CABYS code before allowing it to be added
4. WHEN a user enters a service price, THE System SHALL store it in CRC (Colones)
5. THE Quotation_Engine SHALL allow users to add custom services by manually entering: descripción, código CABYS, and precio
6. WHEN a custom service is added, THE System SHALL save it to the taller's personal service catalog for future use
7. THE System SHALL provide an option to mark custom services as "Favorito" for quick access
8. WHEN displaying service suggestions, THE System SHALL show: service description, CABYS code, and suggested price

### Requirement 7: Fiscal Calculation (IVA)

**User Story:** As a workshop operator, I want automatic IVA calculation on all services with exact precision, so that I comply with Costa Rican tax regulations and avoid fiscal penalties due to rounding errors.

#### Acceptance Criteria

1. WHEN services are added to a quotation, THE Quotation_Engine SHALL calculate the subtotal by summing all service line totals (cantidad × precio_unitario_centimos) using integer arithmetic
2. WHEN the subtotal is calculated, THE Quotation_Engine SHALL compute IVA as exactly 13% of the subtotal using arbitrary-precision arithmetic (big.js library)
3. WHEN IVA is calculated, THE Quotation_Engine SHALL round the IVA to the nearest centimo (integer)
4. WHEN IVA is calculated, THE Quotation_Engine SHALL compute the total as subtotal_centimos plus iva_centimos
5. THE Quotation_Engine SHALL store all monetary values as integers (centimos) in the database to prevent floating-point rounding errors
6. THE Quotation_Engine SHALL display monetary values by dividing centimos by 100 and formatting to 2 decimal places
7. THE Quotation_Engine SHALL ensure all calculations are performed in CRC currency
8. WHEN a service line quantity or price changes, THE Quotation_Engine SHALL recalculate subtotal, IVA, and total in real-time using the same precision rules

### Requirement 8: Electronic Invoice Generation (ATV v4.3)

**User Story:** As a taller owner, I want to generate electronic invoices compatible with Hacienda's ATV v4.3 format, so that I can comply with legal requirements and have invoices ready for submission.

#### Acceptance Criteria

1. WHEN a service order status is APROBADA, THE System SHALL provide an option to generate electronic invoice
2. WHEN generating an invoice, THE System SHALL validate that the taller has complete fiscal configuration data
3. IF fiscal data is incomplete, THE System SHALL prevent invoice generation and display message: "Complete su información fiscal en Configuración"
4. WHEN generating an invoice, THE Invoice_Generator SHALL create a JSON structure compatible with ATV v4.3 specification
5. THE Invoice_Generator SHALL include all required ATV fields: clave, emisor, receptor, detalleServicio, resumenFactura
6. WHEN generating the clave numérica, THE Invoice_Generator SHALL create a unique 50-digit identifier following Hacienda format
7. WHEN generating invoice line items, THE Invoice_Generator SHALL include for each service: numeroLinea, codigoComercial (CABYS), cantidad, unidadMedida, detalle, precioUnitario, montoTotal, subtotal, montoTotalLinea, impuesto array
8. THE Invoice_Generator SHALL include IVA calculation in impuesto array with: codigo "01", codigoTarifa "08", tarifa 13, monto calculated
9. THE Invoice_Generator SHALL include resumenFactura with: codigoTipoMoneda (CRC), totalVentaNeta, totalImpuesto, totalComprobante
10. THE Invoice_Generator SHALL format all monetary amounts in CRC with 2 decimal places
11. WHEN invoice JSON is generated, THE System SHALL save it in the invoice_json field of the service order
12. WHEN invoice is generated, THE System SHALL change order status to FACTURADA
13. WHEN invoice is generated, THE System SHALL provide options to: Descargar JSON, Copiar JSON al Portapapeles
14. THE System SHALL NOT send invoices to Hacienda automatically (requires digital certificate - out of scope for MVP)

### Requirement 9: Magic Link Generation and Management

**User Story:** As a workshop operator, I want to send unique approval links to clients, so that they can review and approve service orders remotely without friction.

#### Acceptance Criteria

1. WHEN a quotation is ready to send, THE System SHALL validate that the order has: client with teléfono, and at least 1 service line item
2. WHEN validation passes, THE System SHALL generate a unique Magic_Link using UUID v4 token
3. THE Magic_Link SHALL have format: `https://app.tallerprocrapp.com/orden/[order_id]?token=[uuid]`
4. WHEN a Magic_Link is generated, THE System SHALL store in database: order_id, token, expires_at (72 hours from creation), used (boolean)
5. WHEN a Magic_Link is generated, THE System SHALL change order status to ENVIADA
6. THE System SHALL provide options to: Enviar por WhatsApp, Copiar Link, Enviar por Email
7. WHEN "Enviar por WhatsApp" is selected, THE System SHALL generate a WhatsApp deep link with pre-formatted message including: taller name, vehicle info, total amount, Magic_Link
8. WHEN a Magic_Link is accessed, THE System SHALL validate the token exists and is not expired
9. IF token is expired, THE System SHALL display message: "Este link ya expiró. Contacte al taller."
10. IF token was already used, THE System SHALL display message: "Esta cotización ya fue aprobada el [fecha]"
11. WHEN an order in ENVIADA status is edited, THE System SHALL invalidate the previous token and change status back to BORRADOR
12. THE System SHALL record timestamp of Magic_Link generation and usage

### Requirement 10: Public Client Portal for Order Approval

**User Story:** As a client, I want to view my quotation on my mobile phone and approve it with one click, so that I don't have to call or visit the workshop physically.

#### Acceptance Criteria

1. WHEN a client accesses a valid Magic_Link, THE System SHALL display a public view without requiring login
2. THE System SHALL display: vehicle information (marca, modelo, año, placa), list of services with individual prices, subtotal, IVA (13%), total destacado, taller information (nombre, teléfono)
3. THE System SHALL render the view optimized for mobile devices with single-column layout
4. THE System SHALL display a prominent "Aprobar Cotización" button in green color
5. WHEN the "Aprobar" button is clicked, THE System SHALL display confirmation dialog: "¿Desea aprobar este presupuesto por ₡XX,XXX?"
6. WHEN approval is confirmed, THE System SHALL update order status to APROBADA
7. WHEN approval is confirmed, THE System SHALL mark the token as used (used: true)
8. WHEN approval is confirmed, THE System SHALL record timestamp of approval
9. WHEN approval is confirmed, THE System SHALL display success message: "¡Aprobado! El taller comenzará el trabajo"
10. WHEN a client revisits an approved order link, THE System SHALL display badge: "✅ APROBADO el [fecha]" and disable the approval button
11. THE System SHALL display the approval button only when token is valid and not used

### Requirement 11: Service Order State Management

**User Story:** As a workshop operator, I want clear order status tracking, so that I can manage the workflow from quotation to completion.

#### Acceptance Criteria

1. THE System SHALL support the following order states: BORRADOR, ENVIADA, APROBADA, FACTURADA, COMPLETADA
2. WHEN an order is created, THE System SHALL set initial status to BORRADOR
3. WHEN a Magic_Link is generated and sent, THE System SHALL transition status from BORRADOR to ENVIADA
4. WHEN a client approves via Magic_Link, THE System SHALL transition status from ENVIADA to APROBADA
5. WHEN an invoice JSON is generated, THE System SHALL transition status from APROBADA to FACTURADA
6. WHEN work is completed and vehicle delivered, THE System SHALL allow transition from FACTURADA to COMPLETADA
7. WHEN an order in ENVIADA status is edited, THE System SHALL transition status back to BORRADOR
8. THE System SHALL prevent editing orders in FACTURADA status
9. THE System SHALL record timestamp and user for each status transition
10. THE System SHALL display order status with distinctive colors: BORRADOR (yellow), ENVIADA (blue), APROBADA (green), FACTURADA (dark gray), COMPLETADA (light gray)

### Requirement 12: Order Dashboard and Management

**User Story:** As a workshop operator, I want to view all my orders in one place with filtering options, so that I can track pending work and order status.

#### Acceptance Criteria

1. THE System SHALL provide an order dashboard at `/ordenes` as the home page for logged-in users
2. THE System SHALL display orders in a list view with most recent first
3. WHEN displaying each order card, THE System SHALL show: order number, vehicle (marca, modelo, placa), client name, status with color, total amount, time elapsed (e.g., "Hace 2 horas")
4. THE System SHALL provide filter options: Todas, Enviadas, Aprobadas, Facturadas
5. WHEN a filter is selected, THE System SHALL display only orders matching that status
6. WHEN an order card is clicked, THE System SHALL navigate to the order detail view
7. THE System SHALL provide a floating "Nueva Orden" button for quick access
8. THE System SHALL provide a three-dot menu on each order card with options: Editar, Duplicar, Eliminar
9. THE System SHALL paginate results showing 20 orders per page

### Requirement 13: Order Search Functionality

**User Story:** As a workshop operator, I want to search for orders by plate, client, or order number, so that I can quickly find specific orders when clients call.

#### Acceptance Criteria

1. THE System SHALL provide a global search bar in the header
2. WHEN a user types in the search bar, THE System SHALL search in: order number, vehicle placa, client name, client phone
3. THE System SHALL display search results in real-time as the user types
4. THE System SHALL perform case-insensitive search
5. WHEN a search result is clicked, THE System SHALL navigate to the order detail view
6. THE System SHALL highlight the matching text in search results

### Requirement 14: Order Duplication for Recurring Services

**User Story:** As a workshop operator, I want to duplicate previous orders, so that I can quickly create new orders for recurring services without re-entering all information.

#### Acceptance Criteria

1. THE System SHALL provide a "Duplicar" option in the order menu
2. WHEN an order is duplicated, THE System SHALL create a new order with: same vehicle, same client, same service line items with prices, status BORRADOR, new auto-generated order number
3. WHEN an order is duplicated, THE System SHALL navigate to the editor view of the new order
4. THE System SHALL allow editing the duplicated order before sending to client

### Requirement 15: Vehicle Service History

**User Story:** As a workshop operator, I want to view all previous orders for a vehicle, so that I can see what work has been done before.

#### Acceptance Criteria

1. WHEN viewing vehicle details, THE System SHALL provide a "Historial" tab
2. THE System SHALL display all orders for that vehicle ordered by date (most recent first)
3. WHEN displaying each historical order, THE System SHALL show: fecha, services performed, total amount, status
4. WHEN a historical order is clicked, THE System SHALL navigate to the order detail view
5. THE System SHALL only display orders created by the current taller (multi-tenant isolation)

### Requirement 16: Mobile-First Responsive Design

**User Story:** As a workshop operator using a mobile device, I want a responsive interface optimized for mobile screens, so that I can manage the workshop efficiently from my phone.

#### Acceptance Criteria

1. THE System SHALL implement a mobile-first design approach with breakpoints for larger screens
2. WHEN displayed on mobile devices (viewport < 768px), THE System SHALL render all forms and lists in a single-column layout
3. THE System SHALL use touch-friendly UI elements with minimum 44px × 44px touch targets
4. WHEN the viewport width is less than 768px, THE System SHALL prioritize vertical scrolling over horizontal
5. THE System SHALL load and render the initial view within 3 seconds on 3G connections
6. THE System SHALL compress images automatically before upload with target size 500KB
7. THE System SHALL provide clear loading indicators and feedback for all user actions

### Requirement 17: Design System Implementation

**User Story:** As a user, I want a consistent and clean visual interface, so that the application is easy to use and professional.

#### Acceptance Criteria

1. THE System SHALL use Inter font family with 14px for body text and 24px for headings
2. THE System SHALL use #3B82F6 (blue) as the primary color for buttons and key actions
3. THE System SHALL use #10B981 (green) as the secondary color for success states and confirmations
4. THE System SHALL implement a minimalist design with ample whitespace
5. THE System SHALL use Tailwind CSS utility classes for all styling
6. THE System SHALL maintain WCAG AA contrast ratio (minimum 4.5:1) for all text
7. THE System SHALL use consistent spacing scale based on Tailwind's default spacing system

### Requirement 18: Progressive Web App (PWA) Capabilities

**User Story:** As a workshop operator, I want to install the application on my mobile device, so that I can access it like a native app without going through a browser.

#### Acceptance Criteria

1. THE System SHALL provide a web app manifest file with: app name "Taller Pro CR", short_name, icons (192x192, 512x512), theme_color (#3B82F6), background_color, display mode "standalone"
2. THE System SHALL implement a service worker for offline capability
3. WHEN installed, THE System SHALL display the app icon on the device home screen
4. WHEN offline, THE System SHALL display cached content for previously viewed pages
5. WHEN offline, THE System SHALL display a clear indicator: "Sin conexión - Mostrando datos guardados"
6. THE System SHALL cache critical assets: fonts, CSS, JavaScript, common images
7. THE System SHALL save form progress locally to prevent data loss on connection interruption

### Requirement 19: Supabase Integration and Data Security

**User Story:** As a system administrator, I want secure data storage and authentication with multi-tenant isolation, so that taller data is protected and users can log in securely.

#### Acceptance Criteria

1. THE System SHALL use Supabase for database storage of: talleres, vehicles, clients, service orders, quotations, invoices
2. THE System SHALL use Supabase Authentication for user login and session management with JWT tokens
3. WHEN storing data, THE System SHALL use Supabase client libraries for all database operations
4. THE System SHALL implement Row Level Security (RLS) policies in Supabase ensuring: talleres can only access their own data, clients can only access orders via valid tokens
5. THE System SHALL store authentication tokens securely using httpOnly cookies or secure localStorage
6. THE System SHALL enforce HTTPS for all connections
7. THE System SHALL implement rate limiting of 100 requests per minute per IP address
8. THE System SHALL sanitize all user inputs to prevent XSS and SQL injection attacks
9. THE System SHALL hash and partially mask sensitive data: cédulas show only last 4 digits in lists
10. THE System SHALL create database indexes on: placa, order_id, client_phone, taller_id for query performance

### Requirement 20: Performance and Scalability

**User Story:** As a system administrator, I want the system to perform well even with limited connectivity and scale to support multiple talleres, so that users have a smooth experience.

#### Acceptance Criteria

1. THE System SHALL respond to service search queries in less than 200 milliseconds
2. THE System SHALL generate invoice JSON in less than 1 second
3. THE System SHALL compress uploaded images to maximum 500KB automatically
4. THE System SHALL implement database pagination showing 20 items per page
5. THE System SHALL use a CDN for serving static assets (fonts, images, CSS, JavaScript)
6. THE System SHALL implement lazy loading for images and non-critical components
7. THE System SHALL maintain 99% uptime (8.76 hours downtime per year acceptable for MVP)
8. THE System SHALL perform automated daily backups of all data
