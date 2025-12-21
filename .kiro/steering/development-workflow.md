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

## Before Starting Any Task

1. **Read the spec files**
   - `.kiro/specs/taller-cr-mvp/requirements.md` - What to build
   - `.kiro/specs/taller-cr-mvp/design.md` - How to build it
   - `.kiro/specs/taller-cr-mvp/tasks.md` - What task to work on

2. **Understand the requirements**
   - Read the acceptance criteria (EARS format)
   - Identify which properties to validate
   - Know what tests are needed (unit vs property)

3. **Update task status**
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
docker-compose up --build
docker exec taller-app npm test
docker exec taller-app npx prisma migrate dev
docker exec taller-app npx prisma db seed

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
