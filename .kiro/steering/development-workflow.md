---
inclusion: always
---

# Development Workflow - Taller Pro CR

This steering guide is automatically included in all Kiro interactions to ensure consistent development practices.

## System Environment

**CRITICAL**: This project runs on Windows with PowerShell/CMD. Always use Windows-compatible commands.

### Shell Commands Reference

| Action | PowerShell Command | DO NOT USE |
|--------|-------------------|------------|
| HTTP GET | `Invoke-RestMethod -Uri "URL" -Method GET` | `curl URL` |
| HTTP POST | `Invoke-RestMethod -Uri "URL" -Method POST -Body $json -ContentType "application/json"` | `curl -X POST` |
| List files | `Get-ChildItem` or `dir` | `ls` |
| Remove file | `Remove-Item file.txt` | `rm file.txt` |
| View file | `Get-Content file.txt` | `cat file.txt` |
| Search in files | `Select-String -Path "*.ts" -Pattern "search"` | `grep` |
| Command chain | `cmd1 ; cmd2` | `cmd1 && cmd2` |

### Testing API Endpoints

```powershell
# GET request
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET

# GET with JSON output
Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard/stats" | ConvertTo-Json -Depth 5

# POST request
$body = @{ placa = "ABC-123"; marca = "Toyota" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/vehiculos" -Method POST -Body $body -ContentType "application/json"

# Docker exec commands (these work the same)
docker exec taller-app npm test
docker exec taller-app npx prisma migrate dev
```

---

## Architecture & Design Patterns

### Project Structure (Atomic Design + Feature-Based)

```
src/
├── app/                    # Next.js App Router (pages & API routes)
│   ├── api/               # REST API endpoints
│   │   ├── ordenes/       # Orders CRUD
│   │   ├── vehiculos/     # Vehicles CRUD
│   │   ├── clientes/      # Clients CRUD
│   │   └── dashboard/     # Dashboard aggregations
│   └── dashboard/         # Dashboard pages
├── components/            # React components (Atomic Design)
│   ├── ui/               # Atoms: buttons, inputs, badges
│   ├── forms/            # Molecules: form groups, field sets
│   ├── layout/           # Organisms: header, sidebar, cards
│   └── orders/           # Feature-specific components
├── lib/                   # Business logic & utilities
│   ├── fiscal/           # Costa Rica fiscal calculations
│   ├── prisma/           # Database client
│   └── validation/       # Zod schemas & validators
├── types/                 # TypeScript type definitions
│   ├── domain/           # Business domain types
│   │   ├── orders.ts     # Order, LineItem, OrderStatus
│   │   ├── vehicles.ts   # Vehicle, VehicleInput
│   │   ├── clients.ts    # Client, TipoIdentificacion
│   │   └── services.ts   # Service catalog types
│   ├── api/              # API contract types
│   │   ├── requests.ts   # Request body types
│   │   └── responses.ts  # Response types
│   └── index.ts          # Central export
└── hooks/                 # Custom React hooks (future)
```

### Design Patterns Used

#### 1. Repository Pattern (Data Access)
- Prisma client abstracts database operations
- API routes act as controllers
- Types define contracts between layers

#### 2. Atomic Design (UI Components)
- **Atoms**: Basic UI elements (`Button`, `Input`, `Badge`)
- **Molecules**: Combinations of atoms (`FormField`, `SearchBar`)
- **Organisms**: Complex UI sections (`OrderCard`, `DashboardHeader`)
- **Templates**: Page layouts (`DashboardLayout`)
- **Pages**: Full pages with data fetching

#### 3. Domain-Driven Design (Types)
- Types organized by business domain, not technical layer
- Domain types in `src/types/domain/`
- API contracts in `src/types/api/`

#### 4. SOLID Principles
- **S**ingle Responsibility: Each file has one purpose
- **O**pen/Closed: Extend via composition, not modification
- **L**iskov Substitution: Interfaces define contracts
- **I**nterface Segregation: Small, focused types
- **D**ependency Inversion: Depend on abstractions (types)

### Type Organization Rules

**NEVER define interfaces inline in components.** Always:

1. Create types in `src/types/domain/` for business entities
2. Create types in `src/types/api/` for API contracts
3. Import from `@/types` in components and API routes
4. Export all types from `src/types/index.ts`

```typescript
// ✅ CORRECT
import { Order, Vehicle, DashboardStatsResponse } from '@/types'

// ❌ WRONG - Don't define interfaces in components
interface Order { ... } // Inside a .tsx file
```

---

## Testing Strategy

### Testing Frameworks

| Framework | Purpose | Config File |
|-----------|---------|-------------|
| Jest | Unit & integration tests | `jest.config.js` |
| fast-check | Property-based testing | Imported in test files |
| @testing-library/react | Component testing | `jest.setup.js` |

### Test File Organization

```
src/
├── lib/
│   └── fiscal/
│       ├── calculations.ts
│       └── __tests__/
│           ├── calculations.test.ts      # Unit tests
│           └── calculations.property.ts  # Property tests
└── components/
    └── ui/
        └── __tests__/
            └── Button.test.tsx           # Component tests
```

### Test Types & When to Use

#### Unit Tests (Jest)
- Test specific examples and edge cases
- Test error conditions
- Fast, deterministic, isolated

```typescript
// Example: Unit test
describe('calculateIVA', () => {
  it('should calculate 13% IVA correctly', () => {
    expect(calculateIVA(100000)).toBe(13000)
  })
  
  it('should handle zero amount', () => {
    expect(calculateIVA(0)).toBe(0)
  })
})
```

#### Property-Based Tests (fast-check)
- Test universal properties across random inputs
- Minimum 100 iterations per property
- Tag with requirement reference

```typescript
// Example: Property test
import * as fc from 'fast-check'

describe('Property: IVA Calculation Correctness', () => {
  /**
   * Property 12: Fiscal Calculation Correctness
   * Validates: Requirements 7.1, 7.2, 7.3
   */
  it('IVA should always be 13% of subtotal for all positive amounts', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 100000000 }), (amount) => {
        const iva = calculateIVA(amount)
        return iva === Math.round(amount * 0.13)
      }),
      { numRuns: 100 }
    )
  })
})
```

### Test Commands

```powershell
# Run all tests
npm test

# Run specific test file
npm test -- --testPathPattern="fiscal"

# Run only property tests
npm run test:property

# Run with coverage
npm test -- --coverage

# Watch mode (for development)
npm run test:watch
```

---

## Requirements & User Stories Format

### EARS Pattern for Acceptance Criteria

All acceptance criteria MUST follow EARS (Easy Approach to Requirements Syntax):

| Pattern | Format | Use Case |
|---------|--------|----------|
| Ubiquitous | THE [System] SHALL [response] | Always applies |
| Event-driven | WHEN [trigger], THE [System] SHALL [response] | Triggered by event |
| State-driven | WHILE [condition], THE [System] SHALL [response] | During state |
| Unwanted | IF [condition], THEN THE [System] SHALL [response] | Error handling |
| Optional | WHERE [option], THE [System] SHALL [response] | Configurable |

### Mapping Requirements to Tests

Each acceptance criterion should map to tests:

| Criterion Type | Test Type | Example |
|---------------|-----------|---------|
| Calculation rules | Property test | "For all amounts, IVA = 13%" |
| State transitions | Unit test | "Order can move from BORRADOR to ENVIADA" |
| Validation rules | Property test | "For all invalid inputs, reject" |
| UI behavior | Component test | "Button shows loading state" |
| Error handling | Unit test | "Returns 404 for missing order" |

---

## Technical Guidance with Context7 MCP Server

**IMPORTANT**: When you need technical advice, documentation, or best practices for any library or framework, use the Context7 MCP server.

### When to Use Context7

Use Context7 for:
- **Framework documentation**: Next.js, React, TypeScript, Prisma, NextAuth.js
- **Library usage**: big.js, Zod, fast-check, Jest, Tailwind CSS
- **Best practices**: Authentication patterns, API design, testing strategies
- **Error resolution**: Understanding error messages and debugging
- **Implementation guidance**: How to implement specific features correctly

### How to Use Context7

1. **Resolve library ID first** (if not already known):
   ```
   Use mcp_Context7_resolve_library_id with:
   - libraryName: "next.js" or "prisma" or "nextauth"
   - query: Your specific question or task
   ```

2. **Query documentation**:
   ```
   Use mcp_Context7_query_docs with:
   - libraryId: The ID from resolve step (e.g., "/vercel/next.js")
   - query: Your specific technical question
   ```

### Examples

**Example 1: NextAuth.js authentication issue**
```
Query: "How to properly configure NextAuth.js JWT callbacks with custom user fields"
Library: "/nextauthjs/next-auth"
```

**Example 2: Prisma query optimization**
```
Query: "Best practices for Prisma queries with relations and filtering"
Library: "/prisma/prisma"
```

**Example 3: Next.js API routes**
```
Query: "How to handle authentication in Next.js 14 API routes with middleware"
Library: "/vercel/next.js"
```

### Context7 Workflow

```
1. Identify technical question or problem
   ↓
2. Resolve library ID (if needed)
   ↓
3. Query Context7 with specific question
   ↓
4. Apply guidance from documentation
   ↓
5. Implement solution following best practices
```

**Note**: Context7 provides up-to-date documentation and examples. Always prefer Context7 guidance over assumptions when working with external libraries.

---

## Before Starting Any Task

1. **Read the spec files**
   - `.kiro/specs/taller-cr-mvp/requirements.md` - What to build
   - `.kiro/specs/taller-cr-mvp/design.md` - How to build it
   - `.kiro/specs/taller-cr-mvp/tasks.md` - What task to work on

2. **Understand the requirements**
   - Read the acceptance criteria (EARS format)
   - Identify which properties to validate
   - Know what tests are needed (unit vs property)

3. **Consult Context7 for technical guidance** (if needed)
   - Query relevant library documentation
   - Understand best practices for the technology
   - Review examples and patterns

4. **Update task status**
   - Mark task as `in_progress` when starting

---

## During Implementation

1. **Write minimal, focused code**
   - Only implement what the task requires
   - Follow the design document
   - Use types from `@/types`

2. **Write comprehensive tests**
   - Unit tests for specific examples and edge cases
   - Property-based tests for universal properties
   - Reference requirements in test comments

3. **Run tests locally**
   ```powershell
   npm test
   ```

---

## When Committing

1. **Use meaningful commit messages**
   ```
   feat: implement feature name
   
   - What was implemented
   - Reference requirements/properties
   ```

2. **Reference requirements and properties**
   - Example: `Property 12: Fiscal Calculation Correctness`
   - Example: `Requirements: 7.1, 7.2, 7.3`

---

## Data Persistence & Seeding

### Automatic Seeding on First Startup

The project uses `docker-entrypoint.sh` to automatically:
1. Wait for PostgreSQL to be ready
2. Generate Prisma Client
3. Run migrations
4. Execute seed script (creates demo data)
5. Start Next.js server

**Seed Data Created:**
- 1 Taller: "Taller Mecánico Demo"
- 1 User: demo@tallerdemo.cr / demo123
- 25 Services with CABYS codes
- 4 Vehicles (Toyota, Honda, Hyundai, Nissan)
- 3 Clients (2 physical, 1 legal entity)
- 3 Orders in different states

### Data Persistence

Data persists between container restarts in the `postgres_data` Docker volume.

```powershell
# Check if data exists
docker exec taller-app node check-db.js

# Re-run seed (CLEARS existing data)
docker exec taller-app npx prisma db seed

# Clean start (removes volume, forces fresh seed)
docker-compose down -v
docker-compose up --build
```

---

## Error Logging in Frontend

All dashboard pages now include error logging in catch blocks:

```typescript
.catch((error) => {
  console.error('Error fetching data:', error)
  // Handle error appropriately
})
```

This helps debug issues when data doesn't load. Check browser DevTools Console (F12) for errors.

---

## Key Commands (Windows/PowerShell)

```powershell
# Run tests
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix

# Type check
npm run type-check

# Docker commands
docker-compose up --build                    # Start application
docker-compose down                          # Stop application
docker-compose down -v                       # Stop and remove volumes (deletes data)
docker restart taller-app                    # Restart only the app
docker exec taller-app npm test              # Run tests
docker exec taller-app npx prisma migrate dev # Create migration
docker exec taller-app npx prisma db seed    # Re-run seed
docker exec taller-app npx prisma generate   # Regenerate Prisma client
docker exec taller-app node check-db.js      # Verify database data

# Test API endpoints
Invoke-RestMethod -Uri "http://localhost:3000/api/health"
Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard/stats" | ConvertTo-Json -Depth 5
```

---

## Important Files

- **Spec files**: `.kiro/specs/taller-cr-mvp/`
- **Types**: `src/types/` (domain & API types)
- **CI/CD workflow**: `.github/workflows/ci-cd.yml`
- **Jest config**: `jest.config.js`
- **Prisma schema**: `prisma/schema.prisma`

---

## Commit Types

- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Test improvements
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `chore:` - Maintenance

---

## Task Completion Checklist

- [ ] Read spec files (requirements, design, tasks)
- [ ] Implemented according to spec
- [ ] Types defined in `src/types/` (not inline)
- [ ] Written unit tests
- [ ] Written property-based tests (where applicable)
- [ ] All tests pass locally
- [ ] Linter passes
- [ ] Committed with meaningful message
- [ ] Task status updated to `completed`
