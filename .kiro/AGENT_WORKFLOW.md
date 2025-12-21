# Kiro Agent Workflow Guide - Taller Pro CR

This document explains how the Kiro agent should handle commits, understand the CI/CD pipeline, and follow the development workflow for the Taller Pro CR project.

## Overview

The Kiro agent is responsible for:
1. Implementing features according to the spec
2. Writing tests (unit and property-based)
3. Committing changes with meaningful messages
4. Understanding CI/CD pipeline expectations
5. Handling test failures and debugging
6. Following the development workflow

## Workflow Phases

### Phase 1: Task Execution

**When executing a task from tasks.md:**

1. **Read the spec files first**
   - Always read: `requirements.md`, `design.md`, `tasks.md`
   - Understand the requirements and design before coding
   - Check which properties need to be tested

2. **Update task status**
   ```
   taskStatus: in_progress
   ```
   - Mark task as "in_progress" when starting
   - This helps track what's being worked on

3. **Implement the feature**
   - Write minimal, focused code
   - Follow the design document
   - Implement only what the task requires
   - Don't implement optional sub-tasks unless explicitly asked

4. **Write tests**
   - Unit tests for specific examples and edge cases
   - Property-based tests for universal properties
   - Tests should validate the requirements
   - Use fast-check for property-based testing

5. **Verify tests pass**
   - Run tests locally: `npm test`
   - Check coverage if applicable
   - Fix any failing tests before committing

6. **Update task status**
   ```
   taskStatus: completed
   ```
   - Mark task as "completed" when done
   - Only mark complete when tests pass

### Phase 2: Committing Changes

**When committing to the dev branch:**

1. **Use meaningful commit messages**
   ```
   feat: implement fiscal calculator with big.js
   
   - Add calculateSubtotal, calculateIVA, calculateTotal functions
   - Use big.js for arbitrary precision arithmetic
   - Store values as integer centimos to avoid floating-point errors
   - Add 29 comprehensive property-based tests
   - Property 12: Fiscal Calculation Correctness with Precision
   - Property 12a: Monetary Storage Precision
   - Verify IVA always exactly 13% with no rounding errors
   ```

2. **Commit format**
   - **Type**: feat, fix, docs, test, refactor, chore
   - **Scope**: Optional, e.g., (fiscal), (validation), (dashboard)
   - **Subject**: Clear, imperative mood, lowercase
   - **Body**: Detailed explanation of changes
   - **References**: Link to requirements/properties

3. **Commit only related changes**
   - One logical change per commit
   - Don't mix features with refactoring
   - Don't mix different features

4. **Example commits**
   ```
   feat: implement CR format validators with property-based tests
   
   - Add validators for cédulas (física, jurídica), DIMEX, NITE, pasaporte
   - Add phone number validator (+506 format)
   - Add vehicle plate validators (particular, taxi, motorcycle)
   - Add CABYS code validator (13 digits)
   - Add formatting functions for all formats
   - Implement 37 comprehensive tests including property-based tests
   - Property 2: Cédula Jurídica Format Validation
   - Property 3: Phone Number Format Validation
   - Property 6: Multi-Format Plate Acceptance
   - Property 8: Identification Number Validation by Type
   - Property 11: CABYS Code Validation
   ```

### Phase 3: CI/CD Pipeline Execution

**After committing to dev branch:**

1. **GitHub Actions Triggered Automatically**
   - Workflow: `.github/workflows/ci-cd.yml`
   - Runs on every push to `dev` branch

2. **Test Stage**
   - ✅ Linter runs (ESLint)
   - ✅ Unit tests run (Jest)
   - ✅ Property-based tests run (fast-check)
   - ✅ Coverage reports generated
   - ✅ Coverage uploaded to Codecov

   **Expected outcome:**
   - All tests pass ✅
   - No critical linting errors
   - Coverage maintained or improved

   **If tests fail:**
   - GitHub Actions shows red ❌
   - Build stage is skipped
   - Agent should review logs and fix issues

3. **Build Stage** (only if tests pass)
   - ✅ Docker image built
   - ✅ Image pushed to ghcr.io
   - ✅ Tagged with `dev` and commit SHA

   **Expected outcome:**
   - Image available at: `ghcr.io/Huevaldinho/TallerCR_Kiro:dev`
   - Image tagged with commit SHA for traceability

   **If build fails:**
   - GitHub Actions shows red ❌
   - Agent should check Dockerfile and dependencies

4. **Deploy Stage** (placeholder for future)
   - Currently a placeholder
   - Will deploy to staging environment
   - Will run smoke tests

## Understanding Test Failures

### When Tests Fail in CI

**Steps to debug:**

1. **Check GitHub Actions logs**
   - Go to: https://github.com/Huevaldinho/TallerCR_Kiro/actions
   - Click on failed workflow
   - Expand the failed step
   - Read the error message carefully

2. **Reproduce locally**
   ```bash
   npm ci  # Clean install
   npm test -- --clearCache  # Clear Jest cache
   npm test  # Run tests
   ```

3. **Common issues and solutions**

   **Issue: Tests pass locally but fail in CI**
   ```bash
   # Solution: Clean install and clear cache
   rm -rf node_modules package-lock.json
   npm ci
   npm test -- --clearCache
   npm test
   ```

   **Issue: Property-based test fails with counterexample**
   - Read the counterexample carefully
   - Understand what input caused the failure
   - Fix the code or adjust the test
   - Re-run to verify fix

   **Issue: Linting errors**
   ```bash
   npm run lint -- --fix
   ```

   **Issue: Docker build fails**
   ```bash
   docker build --no-cache -t taller-pro-cr:dev .
   ```

### When Property-Based Tests Fail

**Property-based tests use fast-check to generate random inputs:**

1. **Understand the counterexample**
   - The test output shows the failing input
   - Example: `Counterexample: [1, "invalid", null]`
   - This is the input that broke the property

2. **Triage the failure**
   - Is the test correct? (Check against requirements)
   - Is the code wrong? (Fix the implementation)
   - Is the specification unclear? (Ask user for clarification)

3. **Fix and re-run**
   ```bash
   npm test -- --testPathPattern="fiscal"
   ```

## Commit Workflow Summary

```
┌─────────────────────────────────────────┐
│  1. Read Spec Files                     │
│     - requirements.md                   │
│     - design.md                         │
│     - tasks.md                          │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  2. Update Task Status: in_progress     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  3. Implement Feature                   │
│     - Write minimal code                │
│     - Follow design                     │
│     - Only required functionality       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  4. Write Tests                         │
│     - Unit tests                        │
│     - Property-based tests              │
│     - Validate requirements             │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  5. Run Tests Locally                   │
│     npm test                            │
│     All tests must pass ✅              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  6. Update Task Status: completed       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  7. Commit with Meaningful Message      │
│     - Type: feat, fix, docs, test       │
│     - Reference requirements/properties │
│     - Detailed body                     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  8. Push to dev Branch                  │
│     git push origin dev                 │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  9. GitHub Actions Triggered            │
│     - Test Stage                        │
│     - Build Stage (if tests pass)       │
│     - Deploy Stage (future)             │
└────────────────┬────────────────────────┘
                 │
            ┌────┴────┐
            │          │
          PASS        FAIL
            │          │
            ▼          ▼
        ✅ Success  ❌ Review Logs
                     Fix Issues
                     Commit Again
```

## Key Files to Understand

### Specification Files
- **`.kiro/specs/taller-cr-mvp/requirements.md`**
  - What the system should do
  - User stories and acceptance criteria
  - Requirements for each feature

- **`.kiro/specs/taller-cr-mvp/design.md`**
  - How the system should work
  - Architecture and components
  - Correctness properties to validate
  - Data models and interfaces

- **`.kiro/specs/taller-cr-mvp/tasks.md`**
  - Implementation tasks
  - Milestones and checkpoints
  - Sub-tasks and dependencies
  - Testing requirements

### CI/CD Files
- **`.github/workflows/ci-cd.yml`**
  - GitHub Actions workflow
  - Test, build, and deploy stages
  - Status checks and notifications

- **`.github/BRANCH_PROTECTION.md`**
  - Branch protection rules
  - Developer workflow
  - PR requirements
  - Troubleshooting guide

- **`CI_CD_GUIDE.md`**
  - Comprehensive CI/CD documentation
  - Local testing instructions
  - Performance optimization
  - Best practices

### Configuration Files
- **`package.json`**
  - Dependencies and scripts
  - Test configuration
  - Build configuration

- **`jest.config.js`**
  - Jest test configuration
  - Test paths and patterns
  - Coverage settings

- **`tsconfig.json`**
  - TypeScript configuration
  - Strict mode enabled
  - Path aliases

- **`tailwind.config.ts`**
  - Design system colors
  - Typography settings
  - Component utilities

## Testing Strategy

### Unit Tests
- Test specific examples
- Test edge cases
- Test error conditions
- Use descriptive names

**Example:**
```typescript
it('should calculate IVA as exactly 13% of subtotal', () => {
  const subtotal = 10000
  const iva = calculateIVA(subtotal)
  expect(iva).toBe(1300)
})
```

### Property-Based Tests
- Test universal properties
- Generate random inputs
- Verify invariants hold
- Use fast-check

**Example:**
```typescript
it('should calculate IVA as exactly 13% of subtotal', () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 99999999 }), (subtotal) => {
      const iva = calculateIVA(subtotal)
      const expectedIVA = Math.round(subtotal * 0.13)
      expect(iva).toBe(expectedIVA)
    })
  )
})
```

## Expectations for Each Commit Type

### `feat:` - New Feature
- Implements a new feature from the spec
- Includes unit tests
- Includes property-based tests
- Updates relevant documentation
- References requirements

### `fix:` - Bug Fix
- Fixes a bug in existing code
- Includes test that catches the bug
- Explains the root cause
- Verifies fix doesn't break other tests

### `test:` - Test Improvements
- Adds new tests
- Improves test coverage
- Fixes flaky tests
- Improves test performance

### `docs:` - Documentation
- Updates README, guides, or comments
- Clarifies complex logic
- Adds examples
- Updates API documentation

### `refactor:` - Code Refactoring
- Improves code quality
- No functional changes
- All tests still pass
- Improves performance or maintainability

### `chore:` - Maintenance
- Updates dependencies
- Fixes build issues
- Updates configuration
- Maintenance tasks

## Health Check Endpoint

**After implementing features, verify the application is running:**

```bash
# Check health endpoint
curl http://localhost:3000/api/health

# Expected response (200 OK):
{
  "status": "healthy",
  "timestamp": "2024-12-21T10:30:00Z",
  "version": "0.1.0",
  "environment": "development",
  "uptime": 3600,
  "checks": {
    "api": "ok",
    "database": "pending",
    "cache": "pending"
  }
}
```

## Handling Merge Conflicts

**If dev branch has new commits:**

```bash
# Update local dev branch
git fetch origin
git rebase origin/dev

# If conflicts occur, resolve them:
# 1. Open conflicted files
# 2. Resolve conflicts manually
# 3. Mark as resolved: git add <file>
# 4. Continue rebase: git rebase --continue
# 5. Force push: git push origin <branch> --force-with-lease
```

## When to Ask for User Input

**Ask the user when:**
- Requirements are ambiguous
- Design decisions need clarification
- Multiple implementation approaches exist
- Test failures indicate specification issues
- Performance trade-offs need to be made

**Use the userInput tool with:**
- Clear question
- Specific options if applicable
- Explanation of why input is needed

## Summary

The Kiro agent should:

1. ✅ **Read specs before coding** - Understand requirements and design
2. ✅ **Write comprehensive tests** - Unit and property-based
3. ✅ **Commit with meaningful messages** - Reference requirements and properties
4. ✅ **Understand CI/CD pipeline** - Know what happens after commit
5. ✅ **Debug test failures** - Reproduce locally and fix issues
6. ✅ **Follow the workflow** - Task → Code → Test → Commit → Pipeline
7. ✅ **Update task status** - Mark tasks as in_progress and completed
8. ✅ **Ask for clarification** - When requirements are unclear

## Quick Reference

| Action | Command |
|--------|---------|
| Run all tests | `npm test` |
| Run specific tests | `npm test -- --testPathPattern="fiscal"` |
| Run with coverage | `npm test -- --coverage` |
| Clear Jest cache | `npm test -- --clearCache` |
| Run linter | `npm run lint` |
| Fix linting issues | `npm run lint -- --fix` |
| Build Docker image | `docker build -t taller-pro-cr:dev .` |
| Run Docker container | `docker-compose up --build` |
| Check health endpoint | `curl http://localhost:3000/api/health` |
| View GitHub Actions | https://github.com/Huevaldinho/TallerCR_Kiro/actions |
| View container registry | https://github.com/Huevaldinho/TallerCR_Kiro/pkgs/container/TallerCR_Kiro |

## Resources

- **Spec Files**: `.kiro/specs/taller-cr-mvp/`
- **CI/CD Guide**: `CI_CD_GUIDE.md`
- **Branch Protection**: `.github/BRANCH_PROTECTION.md`
- **GitHub Actions**: `.github/workflows/ci-cd.yml`
- **GitHub Repository**: https://github.com/Huevaldinho/TallerCR_Kiro
