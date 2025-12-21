# Implementation Plan: Taller Pro CR MVP

## Overview

This implementation plan follows a milestone-based approach, building the system incrementally from core infrastructure to complete invoice generation. Each milestone delivers working, testable functionality that builds upon previous milestones.

## Milestones

1. **Core Infrastructure & Utilities** - Project setup, monetary precision, validation utilities
2. **Authentication & Taller Management** - User registration, login, fiscal configuration
3. **Vehicle & Client Management** - Search, registration, validation with CR formats
4. **Service Order Creation** - Order workflow, state management
5. **Quotation Engine** - CABYS catalog, fiscal calculations, line items
6. **Magic Links & Client Portal** - Token generation, public approval flow
7. **Invoice Generation** - ATV v4.3 JSON generator, clave numérica
8. **Dashboard & Search** - Order management, filtering, search
9. **Testing & Polish** - Comprehensive testing, PWA, performance

---

## Milestone 1: Core Infrastructure & Utilities

### 1.1 Project Setup and Configuration

- [ ] 1.1.1 Initialize Next.js 14 project with TypeScript and App Router
  - Create project with `npx create-next-app@latest`
  - Configure TypeScript strict mode
  - Set up src/ directory structure
  - _Requirements: Foundation for all development_

- [ ] 1.1.2 Install and configure Tailwind CSS with design system
  - Install Tailwind CSS, PostCSS, Autoprefixer
  - Configure tailwind.config.js with custom colors (#3B82F6, #10B981)
  - Set up Inter font family
  - Create globals.css with base styles
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ] 1.1.3 Install core dependencies
  - Install: big.js, react-hook-form, zod, react-input-mask, uuid, date-fns
  - Install dev dependencies: jest, @testing-library/react, fast-check
  - Configure package.json scripts
  - _Requirements: Foundation for monetary precision and validation_


- [ ] 1.1.4 Set up Docker development environment
  - Create Dockerfile for Next.js development
  - Create docker-compose.yml with Next.js service
  - Configure hot reload and volume mounting
  - Add .dockerignore file
  - Document Docker commands in README
  - _Requirements: Development environment consistency_

### 1.2 Monetary Precision Utilities

- [ ] 1.2.1 Create fiscal calculation service with big.js
  - Implement lib/fiscal/calculator.ts
  - Functions: calculateSubtotal, calculateIVA, calculateTotal
  - Use big.js for all arithmetic operations
  - Store values as integer centimos
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ] 1.2.2 Write property tests for fiscal calculations
  - **Property 12: Fiscal Calculation Correctness with Precision**
  - **Property 12a: Monetary Storage Precision**
  - Test with random line items (1-20 services)
  - Verify IVA always exactly 13%
  - Verify no floating-point errors
  - Test edge cases: ₡0.01, ₡999,999.99
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ] 1.2.3 Create currency formatting utilities
  - Implement toCentimos, fromCentimos, formatCRC functions
  - Handle display conversion and locale formatting
  - _Requirements: 7.5, 7.6_


### 1.3 Validation Utilities

- [ ] 1.3.1 Create Costa Rican format validators
  - Implement lib/validation/cr-formats.ts
  - Validators for: cédula física, jurídica, DIMEX, NITE, pasaporte
  - Phone number validator (+506 format)
  - Plate format validators (ABC-123, TX-1234, A-12345)
  - CABYS code validator (13 digits)
  - _Requirements: 1.2, 1.3, 3.8, 4.4, 4.5, 4.6, 4.7, 6.3_

- [ ] 1.3.2 Write property tests for format validators
  - **Property 2: Cédula Jurídica Format Validation**
  - **Property 3: Phone Number Format Validation**
  - **Property 6: Multi-Format Plate Acceptance**
  - **Property 8: Identification Number Validation by Type**
  - **Property 11: CABYS Code Validation**
  - Generate random valid/invalid formats
  - _Requirements: 1.2, 1.3, 3.8, 4.4-4.7, 6.3_

- [ ] 1.3.3 Create input mask configurations
  - Define masks for cédula física, jurídica, phone
  - Configure react-input-mask patterns
  - _Requirements: 4.4, 4.5, 4.9, 4.10_

### 1.4 Supabase Setup

- [ ] 1.4.1 Create Supabase project and configure client
  - Set up Supabase project
  - Create lib/supabase/client.ts with environment variables
  - Configure server and client-side clients
  - _Requirements: 19.1, 19.2, 19.3_


- [ ] 1.4.2 Create database schema migration
  - Create supabase/migrations/001_initial_schema.sql
  - Tables: talleres, vehicles, clients, service_orders, service_line_items, order_tokens, services_catalog, order_status_history
  - All monetary fields as INTEGER (centimos)
  - Indexes on: placa, order_id, client_phone, taller_id
  - _Requirements: 19.1, 19.10_

- [ ] 1.4.3 Implement Row Level Security (RLS) policies
  - Taller isolation: talleres can only access their own data
  - Public access: clients can view orders via valid tokens
  - Create policies for all tables
  - _Requirements: 19.4_

- [ ] 1.4.4 Write property tests for multi-tenant isolation
  - **Property 27: Multi-Tenant Data Isolation**
  - Create test talleres and data
  - Verify queries don't return other taller's data
  - _Requirements: 19.4_

- [ ] 1.4.5 Seed database with CABYS catalog
  - Create supabase/seed.sql with 20+ common services
  - Include: cambio aceite, frenos, suspensión, etc.
  - Each with valid 13-digit CABYS code and suggested price
  - _Requirements: 6.1, 6.2_

---

## Milestone 2: Authentication & Taller Management


### 2.1 Authentication Setup

- [ ] 2.1.1 Configure Supabase Auth
  - Set up authentication providers
  - Configure JWT tokens and session management
  - Create auth middleware for protected routes
  - _Requirements: 19.2, 19.5_

- [ ] 2.1.2 Create authentication context and hooks
  - Implement useAuth hook
  - Handle login, logout, session state
  - _Requirements: 19.2_

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

- [ ] 2.5.1 Create dashboard layout component
  - Implement app/(dashboard)/layout.tsx
  - Header with logo, search bar, user menu
  - Mobile-first navigation
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
  - Implement app/(dashboard)/vehiculos/page.tsx
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

