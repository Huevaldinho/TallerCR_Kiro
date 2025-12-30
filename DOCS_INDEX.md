# Documentation Index - Taller Pro CR

Quick reference guide to all project documentation.

---

## 📖 Start Here

### For New Developers

1. **[README.md](./README.md)** - Project overview, setup, and quick start
2. **[CURRENT_STATE.md](./CURRENT_STATE.md)** - What's done, what's pending, priorities
3. **[development-workflow.md](./.kiro/steering/development-workflow.md)** - Development guide

### For Continuing Development

1. **[CURRENT_STATE.md](./CURRENT_STATE.md)** - Check current status
2. **[tasks.md](./.kiro/specs/taller-cr-mvp/tasks.md)** - Pick a task
3. **[requirements.md](./.kiro/specs/taller-cr-mvp/requirements.md)** - Understand requirements
4. **[design.md](./.kiro/specs/taller-cr-mvp/design.md)** - Understand design

---

## 📚 Documentation by Category

### Getting Started

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [README.md](./README.md) | Project overview, setup instructions | First time setup |
| [CURRENT_STATE.md](./CURRENT_STATE.md) | Current implementation status | Before starting work |
| [TEST_COVERAGE_REPORT.md](./TEST_COVERAGE_REPORT.md) | Detailed test coverage analysis | Before writing tests |
| [HOT_RELOAD_GUIDE.md](./HOT_RELOAD_GUIDE.md) | Hot reload setup and troubleshooting | Daily development |
| [.env.example](./.env.example) | Environment variables template | During setup |

### Development Guides

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [development-workflow.md](./.kiro/steering/development-workflow.md) | Development practices, commands, patterns | Daily development |
| [AGENT_WORKFLOW.md](./.kiro/steering/AGENT_WORKFLOW.md) | Commit workflow, CI/CD, testing | Before committing |
| [DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md) | Docker issues and solutions | When Docker problems occur |

### Specifications

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [requirements.md](./.kiro/specs/taller-cr-mvp/requirements.md) | User stories, acceptance criteria | Before implementing features |
| [design.md](./.kiro/specs/taller-cr-mvp/design.md) | Architecture, components, data models | Before implementing features |
| [tasks.md](./.kiro/specs/taller-cr-mvp/tasks.md) | Implementation tasks, milestones | When picking next task |

### API & Technical

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | API endpoints, schemas, examples | When working with API |
| [Swagger UI](http://localhost:3000/api-docs) | Interactive API documentation | When testing API |
| [prisma/schema.prisma](./prisma/schema.prisma) | Database schema | When working with data |

### DevOps & CI/CD

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) | CI/CD pipeline, deployment | When setting up CI/CD |
| [.github/workflows/ci-cd.yml](./.github/workflows/ci-cd.yml) | GitHub Actions workflow | When modifying CI/CD |
| [Dockerfile](./Dockerfile) | Docker image configuration | When modifying Docker setup |
| [docker-compose.yml](./docker-compose.yml) | Docker services configuration | When modifying services |

---

## 🎯 Quick Links by Task

### "I want to..."

#### Setup & Installation

- **Setup the project** → [README.md - Inicio Rápido](./README.md#-inicio-rápido)
- **Fix Docker issues** → [DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md)
- **Understand the data model** → [prisma/schema.prisma](./prisma/schema.prisma)

#### Development

- **Start developing** → [development-workflow.md](./.kiro/steering/development-workflow.md)
- **Use hot reload** → [HOT_RELOAD_GUIDE.md](./HOT_RELOAD_GUIDE.md)
- **Pick a task** → [tasks.md](./.kiro/specs/taller-cr-mvp/tasks.md)
- **Understand requirements** → [requirements.md](./.kiro/specs/taller-cr-mvp/requirements.md)
- **Understand architecture** → [design.md](./.kiro/specs/taller-cr-mvp/design.md)
- **See what's done** → [CURRENT_STATE.md](./CURRENT_STATE.md)

#### Testing

- **Run tests** → [README.md - Testing](./README.md#-testing)
- **See test coverage** → [TEST_COVERAGE_REPORT.md](./TEST_COVERAGE_REPORT.md)
- **Write tests** → [development-workflow.md - Testing Strategy](./.kiro/steering/development-workflow.md#testing-strategy)
- **Understand test approach** → [design.md - Testing Strategy](./.kiro/specs/taller-cr-mvp/design.md#testing-strategy)

#### API

- **Use the API** → [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Test endpoints** → [Swagger UI](http://localhost:3000/api-docs)
- **Understand API design** → [design.md - Components and Interfaces](./.kiro/specs/taller-cr-mvp/design.md#components-and-interfaces)

#### Deployment

- **Deploy the app** → [CI_CD_GUIDE.md](./CI_CD_GUIDE.md)
- **Understand CI/CD** → [AGENT_WORKFLOW.md - CI/CD Pipeline](./.kiro/steering/AGENT_WORKFLOW.md#workflow-phases)
- **Fix CI/CD issues** → [CI_CD_GUIDE.md - Troubleshooting](./CI_CD_GUIDE.md)

#### Troubleshooting

- **Docker problems** → [DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md)
- **Database issues** → [DOCKER_TROUBLESHOOTING.md - Problema 2](./DOCKER_TROUBLESHOOTING.md#problema-2-base-de-datos-no-muestra-datos)
- **Test failures** → [AGENT_WORKFLOW.md - Understanding Test Failures](./.kiro/steering/AGENT_WORKFLOW.md#understanding-test-failures)
- **General issues** → [README.md - Troubleshooting](./README.md#-troubleshooting)

---

## 📋 Checklists

### Before Starting Development

- [ ] Read [README.md](./README.md)
- [ ] Read [CURRENT_STATE.md](./CURRENT_STATE.md)
- [ ] Setup project with Docker
- [ ] Verify app works: http://localhost:3000
- [ ] Check database has data: `docker exec taller-app node check-db.js`
- [ ] Read [development-workflow.md](./.kiro/steering/development-workflow.md)

### Before Implementing a Feature

- [ ] Read [tasks.md](./.kiro/specs/taller-cr-mvp/tasks.md) - Pick task
- [ ] Read [requirements.md](./.kiro/specs/taller-cr-mvp/requirements.md) - Understand requirements
- [ ] Read [design.md](./.kiro/specs/taller-cr-mvp/design.md) - Understand design
- [ ] Mark task as `in_progress` in tasks.md
- [ ] Create feature branch: `git checkout -b feature/my-feature`

### Before Committing

- [ ] Run tests: `docker exec taller-app npm test`
- [ ] Run linter: `docker exec taller-app npm run lint`
- [ ] Check types: `docker exec taller-app npm run type-check`
- [ ] Write meaningful commit message (see [AGENT_WORKFLOW.md](./.kiro/steering/AGENT_WORKFLOW.md))
- [ ] Reference requirements/properties in commit
- [ ] Mark task as `completed` in tasks.md

### Before Creating PR

- [ ] All tests pass
- [ ] Linter passes
- [ ] Documentation updated if needed
- [ ] Commit messages follow format
- [ ] Branch is up to date with dev

---

## 🔍 Finding Information

### By Topic

#### Costa Rica Formats

- **Cédulas, DIMEX, NITE** → [README.md - Formatos Costa Rica](./README.md#-formatos-costa-rica)
- **Validation logic** → [design.md - Validation Utilities](./.kiro/specs/taller-cr-mvp/design.md#13-validation-utilities)
- **Format patterns** → [design.md - TypeScript Type Definitions](./.kiro/specs/taller-cr-mvp/design.md#typescript-type-definitions)

#### Monetary Calculations

- **Storage in centimos** → [README.md - Precisión Monetaria](./README.md#-precisión-monetaria)
- **IVA calculation** → [design.md - Fiscal Calculation Service](./.kiro/specs/taller-cr-mvp/design.md#fiscal-calculation-service)
- **Error handling** → [design.md - Monetary Precision Best Practices](./.kiro/specs/taller-cr-mvp/design.md#error-handling)

#### Database

- **Schema** → [prisma/schema.prisma](./prisma/schema.prisma)
- **Models** → [README.md - Modelos Principales](./README.md#modelos-principales)
- **Migrations** → [README.md - Migraciones](./README.md#migraciones)
- **Seed data** → [prisma/seed.ts](./prisma/seed.ts)

#### Testing

- **Running tests** → [README.md - Testing](./README.md#-testing)
- **Writing tests** → [development-workflow.md - Testing Strategy](./.kiro/steering/development-workflow.md#testing-strategy)
- **Property-based tests** → [design.md - Property-Based Testing](./.kiro/specs/taller-cr-mvp/design.md#property-based-testing-configuration)
- **Test examples** → [development-workflow.md - Test Types](./.kiro/steering/development-workflow.md#test-types--when-to-use)

#### Architecture

- **High-level** → [design.md - Architecture](./design.md#architecture)
- **Components** → [design.md - Components and Interfaces](./.kiro/specs/taller-cr-mvp/design.md#components-and-interfaces)
- **Data models** → [design.md - Data Models](./.kiro/specs/taller-cr-mvp/design.md#data-models)
- **Project structure** → [README.md - Estructura del Proyecto](./README.md#-estructura-del-proyecto)

---

## 🚀 Common Commands

### Development

```bash
# Start application
docker-compose up --build

# View logs
docker-compose logs -f taller-app

# Run tests
docker exec taller-app npm test

# Run linter
docker exec taller-app npm run lint

# Check database
docker exec taller-app node check-db.js
```

### Database

```bash
# Run migrations
docker exec taller-app npx prisma migrate dev

# Run seed
docker exec taller-app npx prisma db seed

# Regenerate Prisma client
docker exec taller-app npx prisma generate

# Open Prisma Studio
docker exec taller-app npx prisma studio
```

### Troubleshooting

```bash
# Restart app
docker restart taller-app

# Clean restart (deletes data)
docker-compose down -v
docker-compose up --build

# View all logs
docker-compose logs

# Check health
curl http://localhost:3000/api/health
```

---

## 📞 Getting Help

### Documentation Not Clear?

1. Check [CURRENT_STATE.md](./CURRENT_STATE.md) for latest status
2. Check [DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md) for common issues
3. Search in [README.md](./README.md) for keywords
4. Check [design.md](./.kiro/specs/taller-cr-mvp/design.md) for technical details

### Still Stuck?

1. Check GitHub Issues: https://github.com/Huevaldinho/TallerCR_Kiro/issues
2. Check GitHub Actions logs: https://github.com/Huevaldinho/TallerCR_Kiro/actions
3. Review recent commits for similar work
4. Ask in team chat

---

## 📝 Document Maintenance

### When to Update Documentation

- **README.md** - When adding features, changing setup, or fixing major issues
- **CURRENT_STATE.md** - After completing milestones or major features
- **API_DOCUMENTATION.md** - When adding/modifying API endpoints
- **DOCKER_TROUBLESHOOTING.md** - When discovering new Docker issues
- **tasks.md** - When completing tasks or adding new ones
- **This file (DOCS_INDEX.md)** - When adding new documentation

### Documentation Owners

- **README.md** - Team lead
- **CURRENT_STATE.md** - Project manager
- **Specs (requirements, design, tasks)** - Product owner
- **Technical docs (API, Docker, CI/CD)** - Tech lead
- **Workflow docs** - Development team

---

**Last Updated:** December 21, 2024  
**Maintained by:** Development Team
