# Implementation Plan: Taller Pro CR MVP

## Overview

This implementation plan follows a milestone-based approach, building the system incrementally from core infrastructure to complete invoice generation. Each milestone delivers working, testable functionality that builds upon previous milestones.

## Progress Summary

| Milestone | Status | Progress |
|-----------|--------|----------|
| 1. Core Infrastructure & Utilities | 🟡 In Progress | 70% |
| 2. Authentication & Taller Management | 🟡 In Progress | 30% |
| 3. Vehicle & Client Management | ⚪ Not Started | 0% |
| 4. Service Order Creation | ⚪ Not Started | 0% |
| 5. Quotation Engine | ⚪ Not Started | 0% |
| 6. Magic Links & Client Portal | ⚪ Not Started | 0% |
| 7. Invoice Generation | ⚪ Not Started | 0% |
| 8. Dashboard & Search | ⚪ Not Started | 0% |
| 9. Testing & Polish | ⚪ Not Started | 0% |

---

## Milestone 1: Core Infrastructure & Utilities

### 1.1 Project Setup and Configuration

- [x] 1.1.1 Initialize Next.js 14 project with TypeScript and App Router
  - ✅ Created project with Next.js 14
  - ✅ Configured TypeScript strict mode
  - ✅ Set up src/ directory structure
  - _Requirements: Foundation for all development_

- [x] 1.1.2 Install and configure Tailwind CSS with design system
  - ✅ Installed Tailwind CSS, PostCSS, Autoprefixer
  - ✅ Configured tailwind.config.ts with custom colors (#3B82F6, #10B981)
  - ✅ Set up Inter font family
  - ✅ Created globals.css with base styles
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [x] 1.1.3 Install core dependencies
  - ✅ Installed: big.js, react-hook-form, zod, uuid, date-fns
  - ✅ Installed dev dependencies: jest, @testing-library/react, fast-check
  - ✅ Configured package.json scripts
  - _Requirements: Foundation for monetary precision and validation_

- [x] 1.1.4 Set up Docker development environment
  - ✅ Created Dockerfile for Next.js development
  - ✅ Created docker-compose.yml with Next.js and PostgreSQL services
  - ✅ Configured hot reload and volume mounting
  - ✅ Added .dockerignore file
  - ✅ Documented Docker commands in README
  - _Requirements: Development environment consistency_

### 1.2 Monetary Precision Utilities

- [x] 1.2.1 Create fiscal calculation service with big.js
  - ✅ Implemented src/lib/fiscal/calculator.ts
  - ✅ Functions: calculateSubtotal, calculateIVA, calculateTotal, calculateInvoiceTotals
  - ✅ Uses big.js for all arithmetic operations
  - ✅ Stores values as integer centimos
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [x] 1.2.2 Write property tests for fiscal calculations
  - ✅ **Property 12: Fiscal Calculation Correctness with Precision**
  - ✅ **Property 12a: Monetary Storage Precision**
  - ✅ Tested with random line items (1-20 services)
  - ✅ Verified IVA always exactly 13%
  - ✅ Verified no floating-point errors
  - ✅ Tested edge cases: ₡0.01, ₡999,999.99
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [x] 1.2.3 Create currency formatting utilities
  - ✅ Implemented src/lib/fiscal/currency.ts
  - ✅ Functions: toCentimos, fromCentimos, formatCRC, parseCRC
  - ✅ Handle display conversion and locale formatting
  - _Requirements: 7.5, 7.6_

### 1.3 Validation Utilities

- [x] 1.3.1 Create Costa Rican format validators
  - ✅ Implemented src/lib/validation/cr-formats.ts
  - ✅ Validators for: cédula física, jurídica, DIMEX, NITE, pasaporte
  - ✅ Phone number validator (+506 format)
  - ✅ Plate format validators (ABC-123, TX-1234, A-12345)
  - ✅ CABYS code validator (13 digits)
  - _Requirements: 1.2, 1.3, 3.8, 4.4, 4.5, 4.6, 4.7, 6.3_

- [x] 1.3.2 Write property tests for format validators
  - ✅ **Property 2: Cédula Jurídica Format Validation**
  - ✅ **Property 3: Phone Number Format Validation**
  - ✅ **Property 6: Multi-Format Plate Acceptance**
  - ✅ **Property 8: Identification Number Validation by Type**
  - ✅ **Property 11: CABYS Code Validation**
  - ✅ Generated random valid/invalid formats
  - _Requirements: 1.2, 1.3, 3.8, 4.4-4.7, 6.3_

- [ ] 1.3.3 Create input mask configurations
  - Define masks for cédula física, jurídica, phone
  - Configure react-input-mask patterns
  - _Requirements: 4.4, 4.5, 4.9, 4.10_

### 1.4 Database Setup with Prisma

- [x] 1.4.1 Set up PostgreSQL in Docker
  - ✅ Added PostgreSQL service to docker-compose.yml
  - ✅ Configured environment variables for database connection
  - ✅ Database taller_cr created and running
  - _Requirements: 19.1_

- [ ] 1.4.2 Install and configure Prisma
  - Install @prisma/client and prisma dev dependency
  - Initialize Prisma with `npx prisma init`
  - Configure prisma/schema.prisma with PostgreSQL datasource
  - _Requirements: 19.3_

- [ ] 1.4.3 Create Prisma schema with all models
  - Define models: Taller, User, Vehicle, Client, ServiceOrder, ServiceLineItem, OrderToken, ServicesCatalog, OrderStatusHistory
  - All monetary fields as Int (centimos)
  - Add indexes on: placa, orderNumber, clientPhone, tallerId
  - _Requirements: 19.1, 19.10_

- [ ] 1.4.4 Generate Prisma client and run migrations
  - Run `npx prisma migrate dev --name init`
  - Generate Prisma client
  - Create src/lib/prisma/client.ts with singleton pattern
  - _Requirements: 19.3_

- [ ] 1.4.5 Implement multi-tenant isolation middleware
  - Create Prisma middleware for taller_id filtering
  - Ensure all queries automatically filter by current taller
  - Create utility functions for safe queries
  - _Requirements: 19.4_

- [ ] 1.4.6 Write property tests for multi-tenant isolation
  - **Property 27: Multi-Tenant Data Isolation**
  - Create test talleres and data
  - Verify queries don't return other taller's data
  - _Requirements: 19.4_

- [ ] 1.4.7 Create database seed script
  - Create prisma/seed.ts with 20+ common services
  - Include: cambio aceite, frenos, suspensión, etc.
  - Each with valid 13-digit CABYS code and suggested price
  - Run with `npx prisma db seed`
  - _Requirements: 6.1, 6.2_

---

## Milestone 2: Authentication & Taller Management

### 2.1 Authentication Setup with NextAuth.js

- [ ] 2.1.1 Install and configure NextAuth.js
  - Install next-auth and bcrypt dependencies
  - Create app/api/auth/[...nextauth]/route.ts
  - Configure JWT strategy and session handling
  - Set up environment variables (NEXTAUTH_SECRET, NEXTAUTH_URL)
  - _Requirements: 19.2, 19.5_

- [ ] 2.1.2 Create authentication context and hooks
  - Implement useAuth hook with useSession
  - Handle login, logout, session state
  - Create auth middleware for protected routes
  - _Requirements: 19.2_

- [ ] 2.1.3 Create Prisma user model and credentials provider
  - Add User model to Prisma schema
  - Link User to Taller (one-to-one relationship)
  - Implement credentials provider with bcrypt password hashing
  - _Requirements: 19.2, 19.5_

### 2.2 Taller Registration

- [ ] 2.2.1 Create taller registration form component
  - Form fields: nombre, cédula jurídica, nombre responsable, teléfono, email, contraseña
  - Apply cédula jurídica mask (3-###-######)
  - Apply phone mask (+506 ####-####)
  - Real-time validation with Zod
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2.2.2 Write property tests for registration validation
  - **Property 1: Registration Required Fields Validation**
  - **Property 4: Email Uniqueness Enforcement**
  - Test with missing fields, invalid formats
  - _Requirements: 1.1, 1.4_

- [ ] 2.2.3 Implement registration API route
  - Create app/api/auth/register/route.ts
  - Validate inputs server-side
  - Create taller record in database
  - Send confirmation email
  - _Requirements: 1.1, 1.4, 1.5_

- [ ] 2.2.4 Create registration page UI
  - Implement app/(auth)/registro/page.tsx
  - Mobile-first responsive design
  - Spanish language interface
  - Error handling and feedback
  - _Requirements: 1.6, 16.1, 16.2, 16.3_

### 2.3 Login and Session Management

- [ ] 2.3.1 Create login form component
  - Email and password fields
  - Form validation
  - Error handling
  - _Requirements: 19.2_

- [ ] 2.3.2 Create login page
  - Implement app/(auth)/login/page.tsx
  - Redirect to dashboard after login
  - _Requirements: 19.2_

### 2.4 Fiscal Configuration

- [ ] 2.4.1 Create fiscal configuration form
  - Fields: dirección (provincia, cantón, distrito, señas), actividad económica, nombre comercial
  - Dropdown for actividad económica codes
  - _Requirements: 2.2, 2.3_

- [ ] 2.4.2 Create configuration page
  - Implement app/(dashboard)/configuracion/page.tsx
  - Save fiscal data to taller record
  - Visual confirmation on save
  - _Requirements: 2.1, 2.4, 2.5_

- [ ] 2.4.3 Write property tests for fiscal validation
  - **Property 13: Invoice Generation Prerequisites**
  - Test incomplete fiscal data scenarios
  - _Requirements: 8.2_

### 2.5 Dashboard Layout

- [x] 2.5.1 Create dashboard layout component
  - ✅ Implemented src/app/dashboard/layout.tsx
  - ✅ Header with logo, search bar, user menu (DashboardHeader.tsx)
  - ✅ Sidebar with navigation (DashboardSidebar.tsx)
  - ✅ Mobile-first navigation
  - _Requirements: 16.1, 16.2, 16.3_

- [ ] 2.5.2 Create reusable UI components
  - Button, Input, Card, Badge components
  - Consistent styling with Tailwind
  - Touch-friendly sizes (44px minimum)
  - _Requirements: 16.3, 17.1-17.5_

---

## Milestone 3: Vehicle & Client Management

### 3.1 Vehicle Search and Registration

- [ ] 3.1.1 Create vehicle search component
  - Autocomplete search by placa
  - Debounced search queries
  - Display results with vehicle details
  - _Requirements: 3.1, 3.2_

- [ ] 3.1.2 Write property tests for vehicle search
  - **Property 5: Vehicle Search Case and Hyphen Insensitivity**
  - Test search with different cases and hyphen variations
  - _Requirements: 3.2_

- [ ] 3.1.3 Create vehicle registration form
  - Fields: placa (pre-filled), marca, modelo, año, color, kilometraje, VIN
  - Validate año range (1990-2025)
  - Accept all CR plate formats
  - _Requirements: 3.5, 3.6, 3.7, 3.8_

- [ ] 3.1.4 Create vehicle search page
  - Implement app/dashboard/vehiculos/page.tsx
  - Search bar with results
  - "Registrar nuevo" option when not found
  - _Requirements: 3.1, 3.3, 3.4, 3.5_

### 3.2 Client Registration

- [ ] 3.2.1 Create client registration form component
  - Fields: nombre completo, tipo identificación, número identificación, teléfono
  - Dynamic input masks based on ID type
  - Real-time format validation
  - _Requirements: 4.1, 4.2, 4.3, 4.4-4.10_

- [ ] 3.2.2 Write property tests for client validation
  - **Property 7: Client Registration Required Fields**
  - Test missing required fields
  - _Requirements: 4.2_

---

## Milestone 4: Service Order Creation

### 4.1 Order Creation Flow

- [ ] 4.1.1 Create order creation wizard component
  - Step 1: Select vehicle
  - Step 2: Select/create client
  - Step 3: Add motivo de ingreso
  - _Requirements: 5.1, 5.5_

- [ ] 4.1.2 Implement order number generation
  - Format: ORD-YYYY-### (e.g., ORD-2024-001)
  - Auto-increment per taller per year
  - _Requirements: 5.2_

- [ ] 4.1.3 Write property tests for order creation
  - **Property 9: Order Number Format Generation**
  - **Property 10: Initial Order Status**
  - _Requirements: 5.2, 5.4_

- [ ] 4.1.4 Create order detail page
  - Display order info, vehicle, client, services
  - Status badge with color
  - Action buttons based on status
  - _Requirements: 11.10, 12.6_

### 4.2 Order State Management

- [ ] 4.2.1 Implement order state machine
  - States: BORRADOR, ENVIADA, APROBADA, FACTURADA, COMPLETADA
  - Valid transitions only
  - _Requirements: 11.1-11.9_

- [ ] 4.2.2 Write property tests for state transitions
  - **Property 22: Order State Machine Transitions**
  - **Property 23: Facturada Order Edit Prevention**
  - _Requirements: 11.3-11.8_

---

## Milestone 5: Quotation Engine

### 5.1 Service Line Items

- [ ] 5.1.1 Create service line item component
  - Fields: descripción, código CABYS, cantidad, precio unitario
  - Real-time subtotal calculation
  - _Requirements: 6.4, 6.5_

- [ ] 5.1.2 Create CABYS service search
  - Autocomplete from catalog
  - Show description, code, suggested price
  - _Requirements: 6.1, 6.2, 6.8_

- [ ] 5.1.3 Implement quotation totals display
  - Subtotal, IVA (13%), Total
  - Real-time updates
  - _Requirements: 7.1-7.8_

### 5.2 Service Catalog

- [ ] 5.2.1 Create service catalog management
  - Add custom services
  - Mark as favorite
  - _Requirements: 6.5, 6.6, 6.7_

---

## Milestone 6: Magic Links & Client Portal

### 6.1 Magic Link Generation

- [ ] 6.1.1 Implement token generation
  - UUID v4 tokens
  - 72-hour expiry
  - _Requirements: 9.2, 9.3, 9.4_

- [ ] 6.1.2 Write property tests for magic links
  - **Property 16: Magic Link Generation Prerequisites**
  - **Property 17: Magic Link Token Uniqueness and Format**
  - **Property 18: Magic Link Expiry Calculation**
  - _Requirements: 9.1-9.4_

- [ ] 6.1.3 Create WhatsApp share functionality
  - Deep link with pre-formatted message
  - _Requirements: 9.6, 9.7_

### 6.2 Public Client Portal

- [ ] 6.2.1 Create public order view page
  - app/orden/[id]/page.tsx
  - No auth required
  - Mobile-optimized
  - _Requirements: 10.1-10.3_

- [ ] 6.2.2 Implement approval flow
  - Confirmation dialog
  - Status update
  - Success message
  - _Requirements: 10.4-10.11_

- [ ] 6.2.3 Write property tests for approval
  - **Property 19: Token Validation Rules**
  - **Property 20: Order Approval State Transition**
  - **Property 21: Single-Use Token Enforcement**
  - _Requirements: 9.8-9.10, 10.6-10.8_

---

## Milestone 7: Invoice Generation

### 7.1 ATV v4.3 Invoice Generator

- [ ] 7.1.1 Create invoice JSON generator
  - ATV v4.3 structure
  - All required fields
  - _Requirements: 8.4-8.10_

- [ ] 7.1.2 Implement clave numérica generation
  - 50-digit unique identifier
  - Hacienda format
  - _Requirements: 8.6_

- [ ] 7.1.3 Write property tests for invoice
  - **Property 14: Clave Numérica Format and Uniqueness**
  - **Property 15: Invoice JSON Structure Completeness**
  - _Requirements: 8.5, 8.6_

- [ ] 7.1.4 Create invoice download/copy functionality
  - Download JSON file
  - Copy to clipboard
  - _Requirements: 8.13_

---

## Milestone 8: Dashboard & Search

### 8.1 Order Dashboard

- [ ] 8.1.1 Create order list component
  - Order cards with details
  - Status badges
  - Time elapsed
  - _Requirements: 12.2, 12.3_

- [ ] 8.1.2 Implement filters
  - Todas, Enviadas, Aprobadas, Facturadas
  - _Requirements: 12.4, 12.5_

- [ ] 8.1.3 Write property tests for filtering
  - **Property 24: Order Filtering Correctness**
  - _Requirements: 12.4_

- [ ] 8.1.4 Implement pagination
  - 20 orders per page
  - _Requirements: 12.9_

### 8.2 Search Functionality

- [ ] 8.2.1 Create global search
  - Search by order number, placa, client name, phone
  - Real-time results
  - _Requirements: 13.1-13.6_

- [ ] 8.2.2 Write property tests for search
  - **Property 25: Multi-Field Search Coverage**
  - _Requirements: 13.2_

### 8.3 Order Actions

- [ ] 8.3.1 Implement order duplication
  - Copy vehicle, client, services
  - New order number
  - _Requirements: 14.1-14.4_

- [ ] 8.3.2 Write property tests for duplication
  - **Property 26: Order Duplication Correctness**
  - _Requirements: 14.2_

---

## Milestone 9: Testing & Polish

### 9.1 Comprehensive Testing

- [ ] 9.1.1 Run all property tests
  - Verify all 28 properties pass
  - _Requirements: All_

- [ ] 9.1.2 Integration tests
  - Complete user flows
  - _Requirements: All_

### 9.2 PWA Configuration

- [ ] 9.2.1 Create web app manifest
  - App name, icons, theme color
  - _Requirements: 18.1_

- [ ] 9.2.2 Implement service worker
  - Offline caching
  - _Requirements: 18.2-18.7_

### 9.3 Performance Optimization

- [ ] 9.3.1 Optimize queries
  - < 200ms response time
  - _Requirements: 20.1_

- [ ] 9.3.2 Implement lazy loading
  - Images, non-critical components
  - _Requirements: 20.6_

---

## Requirements Traceability Matrix

| Requirement | Tasks | Status |
|-------------|-------|--------|
| 1.1-1.7 (Taller Registration) | 2.2.1-2.2.4 | ⚪ Not Started |
| 2.1-2.5 (Fiscal Configuration) | 2.4.1-2.4.3 | ⚪ Not Started |
| 3.1-3.8 (Vehicle Registration) | 3.1.1-3.1.4 | ⚪ Not Started |
| 4.1-4.11 (Client Registration) | 3.2.1-3.2.2 | ⚪ Not Started |
| 5.1-5.6 (Service Order Creation) | 4.1.1-4.1.4 | ⚪ Not Started |
| 6.1-6.8 (CABYS Quotation) | 5.1.1-5.2.1 | ⚪ Not Started |
| 7.1-7.8 (Fiscal Calculation) | 1.2.1-1.2.3 | ✅ Complete |
| 8.1-8.14 (Invoice Generation) | 7.1.1-7.1.4 | ⚪ Not Started |
| 9.1-9.12 (Magic Links) | 6.1.1-6.1.3 | ⚪ Not Started |
| 10.1-10.11 (Client Portal) | 6.2.1-6.2.3 | ⚪ Not Started |
| 11.1-11.10 (Order State) | 4.2.1-4.2.2 | ⚪ Not Started |
| 12.1-12.9 (Order Dashboard) | 8.1.1-8.1.4 | ⚪ Not Started |
| 13.1-13.6 (Order Search) | 8.2.1-8.2.2 | ⚪ Not Started |
| 14.1-14.4 (Order Duplication) | 8.3.1-8.3.2 | ⚪ Not Started |
| 15.1-15.5 (Vehicle History) | 3.1.4 | ⚪ Not Started |
| 16.1-16.7 (Mobile-First Design) | 2.5.1-2.5.2 | 🟡 Partial |
| 17.1-17.7 (Design System) | 1.1.2 | ✅ Complete |
| 18.1-18.7 (PWA) | 9.2.1-9.2.2 | ⚪ Not Started |
| 19.1-19.10 (Database & Auth) | 1.4.1-1.4.7, 2.1.1-2.1.3 | 🟡 Partial |
| 20.1-20.8 (Performance) | 9.3.1-9.3.2 | ⚪ Not Started |

---

## Notes

- Tasks marked with [x] are completed
- Tasks marked with [ ] are pending
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
