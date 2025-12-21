# CI/CD Pipeline Guide - Taller Pro CR

## Overview

The Taller Pro CR project uses GitHub Actions for continuous integration and deployment. The pipeline automatically runs tests on every commit to the `dev` branch and builds Docker images on successful test runs.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Commits                         │
│                    to dev branch                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              GitHub Actions Triggered                        │
│              (ci-cd.yml workflow)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   TEST STAGE                                 │
│  ✓ Lint code (ESLint)                                       │
│  ✓ Run unit tests (Jest)                                    │
│  ✓ Run property-based tests (fast-check)                    │
│  ✓ Generate coverage reports                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────┴────┐
                    │          │
              PASS  │          │  FAIL
                    ▼          ▼
            ┌──────────────┐  ┌──────────────┐
            │ BUILD STAGE  │  │ STOP PIPELINE│
            │ (Docker)     │  │ Notify Dev   │
            └──────┬───────┘  └──────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Push to Registry     │
        │ ghcr.io/...          │
        │ Tags: dev, sha, etc  │
        └──────┬───────────────┘
               │
               ▼
        ┌──────────────────────┐
        │ DEPLOY STAGE         │
        │ (Future)             │
        │ - Staging env        │
        │ - Smoke tests        │
        │ - Notifications      │
        └──────────────────────┘
```

## Pipeline Stages

### Stage 1: Test

**Trigger:** 
- Push to `dev` branch
- Pull request to `dev` branch

**Environment:**
- Runner: `ubuntu-latest`
- Node.js: 18.x
- Package Manager: npm

**Steps:**

1. **Checkout Code**
   ```bash
   git checkout <commit>
   ```

2. **Setup Node.js**
   - Install Node 18
   - Restore npm cache

3. **Install Dependencies**
   ```bash
   npm ci  # Clean install (respects package-lock.json)
   ```

4. **Run Linter** (continues on error)
   ```bash
   npm run lint
   ```
   - Checks code style with ESLint
   - Warnings don't fail the build

5. **Run Tests**
   ```bash
   npm test -- --no-watch --coverage
   ```
   - Runs all Jest tests
   - Generates coverage reports
   - Property-based tests run with 100+ iterations

6. **Upload Coverage**
   - Sends coverage to Codecov
   - Tracks coverage trends over time

**Success Criteria:**
- All tests pass (exit code 0)
- No critical linting errors

**Failure Behavior:**
- Pipeline stops immediately
- Docker image is NOT built
- GitHub shows red X on commit
- Developers notified via email/GitHub

### Stage 2: Build

**Trigger:** 
- Test stage passes AND
- Push event (not pull request) AND
- Branch is `dev`

**Environment:**
- Runner: `ubuntu-latest`
- Docker Buildx enabled
- Registry: GitHub Container Registry (ghcr.io)

**Steps:**

1. **Setup Docker Buildx**
   - Enables advanced Docker build features
   - Supports multi-platform builds

2. **Authenticate with Registry**
   ```bash
   docker login ghcr.io -u ${{ github.actor }} -p ${{ secrets.GITHUB_TOKEN }}
   ```
   - Uses GitHub token for authentication
   - Automatic permissions management

3. **Extract Metadata**
   - Generates image tags:
     - `dev` - Latest dev branch build
     - `dev-{commit-sha}` - Specific commit
     - `latest` - Only for main branch (future)
   - Generates labels with metadata

4. **Build and Push Image**
   ```bash
   docker buildx build \
     --push \
     --tag ghcr.io/Huevaldinho/TallerCR_Kiro:dev \
     --cache-from type=gha \
     --cache-to type=gha,mode=max \
     .
   ```
   - Builds using Dockerfile
   - Pushes to GitHub Container Registry
   - Caches layers for faster future builds

**Image Registry:**
```
ghcr.io/Huevaldinho/TallerCR_Kiro
├── dev (latest dev branch)
├── dev-a1b2c3d (specific commit)
└── latest (main branch, future)
```

**Failure Behavior:**
- Build logs available in GitHub Actions
- Image not pushed to registry
- Developers notified

### Stage 3: Deploy (Future)

**Trigger:** Build stage passes

**Current Status:** Placeholder for future implementation

**Planned Steps:**
- Deploy to staging environment
- Run smoke tests
- Verify health check endpoint
- Notify team of deployment

## Health Check Endpoint

### Purpose
- Verify application is running
- Used by load balancers and monitoring systems
- Required for Kubernetes liveness/readiness probes

### Endpoint

```http
GET /api/health
```

### Response (200 OK - Healthy)

```json
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

**Fields:**
- `status`: Overall application status
  - `healthy` - All critical checks pass
  - `degraded` - Some non-critical checks fail
  - `unhealthy` - Critical checks fail
- `timestamp`: ISO 8601 timestamp
- `version`: Application version from package.json
- `environment`: NODE_ENV value
- `uptime`: Seconds since application started
- `checks`: Individual component status
  - `ok` - Component working
  - `pending` - Not yet checked
  - `error` - Component failed

### Response (503 Service Unavailable - Unhealthy)

```json
{
  "status": "unhealthy",
  "timestamp": "2024-12-21T10:30:00Z",
  "version": "0.1.0",
  "environment": "development",
  "uptime": 3600,
  "checks": {
    "api": "ok",
    "database": "error",
    "cache": "error"
  }
}
```

### Liveness Probe

```http
HEAD /api/health
```

**Response:** 200 OK (no body)

Used by Kubernetes to determine if container should be restarted.

### Testing Health Endpoint

```bash
# Full health check
curl http://localhost:3000/api/health | jq

# Liveness probe
curl -I http://localhost:3000/api/health

# In Docker
docker exec kiro-app-1 curl http://localhost:3000/api/health
```

## Local Development

### Prerequisites
- Node.js 18+
- npm 9+
- Docker & Docker Compose
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/Huevaldinho/TallerCR_Kiro.git
cd TallerCR_Kiro

# Checkout dev branch
git checkout dev

# Install dependencies
npm ci

# Start development environment
docker-compose up --build
```

### Running Tests Locally

**All Tests**
```bash
npm test
```

**Watch Mode** (re-run on file changes)
```bash
npm test -- --watch
```

**Specific Test Suite**
```bash
npm test -- --testPathPattern="fiscal"
```

**With Coverage Report**
```bash
npm test -- --coverage
```

**Coverage Report Output**
```
File                    | % Stmts | % Branch | % Funcs | % Lines |
------------------------|---------|----------|---------|---------|
All files               |   85.2  |   82.1   |   88.5  |   84.9  |
 src/lib/fiscal         |   95.0  |   93.0   |   96.0  |   95.0  |
  calculator.ts         |   96.0  |   94.0   |   97.0  |   96.0  |
  currency.ts           |   94.0  |   92.0   |   95.0  |   94.0  |
```

**Clear Jest Cache**
```bash
npm test -- --clearCache
```

### Running Linter

```bash
npm run lint
```

**Fix Linting Issues Automatically**
```bash
npm run lint -- --fix
```

### Docker Commands

**Build Development Image**
```bash
docker build -t taller-pro-cr:dev .
```

**Run Container**
```bash
docker-compose up --build
```

**View Logs**
```bash
docker-compose logs -f app
```

**Stop Container**
```bash
docker-compose down
```

**Access Container Shell**
```bash
docker exec -it kiro-app-1 sh
```

### Accessing Application

- **Application:** http://localhost:3000
- **Health Check:** http://localhost:3000/api/health
- **Database:** localhost:5432 (PostgreSQL)

## Troubleshooting

### Tests Fail Locally but Pass in CI

**Solution 1: Clean Install**
```bash
rm -rf node_modules package-lock.json
npm ci
npm test
```

**Solution 2: Clear Jest Cache**
```bash
npm test -- --clearCache
npm test
```

**Solution 3: Check Node Version**
```bash
node --version  # Should be v18.x.x
npm --version   # Should be 9.x.x or higher
```

### Docker Build Fails

**Check Docker Daemon**
```bash
docker ps
```

**Clear Docker Cache**
```bash
docker system prune -a
```

**Check Disk Space**
```bash
docker system df
```

**Rebuild Without Cache**
```bash
docker build --no-cache -t taller-pro-cr:dev .
```

### Image Not Pushed to Registry

**Verify GitHub Token Permissions**
- Go to GitHub Settings → Developer settings → Personal access tokens
- Token needs `packages:write` scope

**Check Repository Settings**
- Settings → Actions → General
- Ensure "Read and write permissions" is enabled

**Verify Branch**
- Only `dev` branch triggers builds
- Check you're pushing to correct branch

**View Build Logs**
- Go to https://github.com/Huevaldinho/TallerCR_Kiro/actions
- Click on failed workflow
- Expand "Build Docker Image" step

### Application Won't Start

**Check Logs**
```bash
docker-compose logs app
```

**Common Issues:**
- Port 3000 already in use: `lsof -i :3000`
- Environment variables missing: Check `.env.example`
- Database connection failed: Verify PostgreSQL is running

## Environment Variables

### Build Time

- `NODE_ENV` - Set to 'production' for production builds
- `npm_package_version` - Automatically set from package.json

### Runtime

- `NODE_ENV` - Controls application behavior
  - `development` - Verbose logging, hot reload
  - `production` - Optimized, minimal logging
- `DATABASE_URL` - Supabase connection string (future)
- `SUPABASE_KEY` - Supabase API key (future)

### GitHub Actions Secrets

Store sensitive values in GitHub repository secrets:

1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add secrets (automatically available in workflows)

**Example:**
```yaml
- name: Deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: npm run deploy
```

## Monitoring

### GitHub Actions Dashboard

**View Workflow Runs:**
- https://github.com/Huevaldinho/TallerCR_Kiro/actions

**Check Specific Workflow:**
- Click on workflow name
- View logs for each step
- Download artifacts

### Container Registry

**View Images:**
- https://github.com/Huevaldinho/TallerCR_Kiro/pkgs/container/TallerCR_Kiro

**Manage Versions:**
- Delete old images
- Change visibility
- View image details

### Application Monitoring

**Health Check:**
```bash
curl http://localhost:3000/api/health | jq '.status'
```

**Uptime Tracking:**
```bash
watch -n 5 'curl -s http://localhost:3000/api/health | jq ".uptime"'
```

## Best Practices

### 1. Always Test Locally Before Pushing

```bash
npm run lint && npm test
```

**Why:** Catch issues early, avoid failed CI runs

### 2. Write Meaningful Commit Messages

```bash
# Good
git commit -m "feat: implement fiscal calculator with big.js

- Add calculateIVA function with 13% precision
- Add property tests for monetary precision
- Verify no floating-point errors"

# Bad
git commit -m "fix stuff"
```

**Why:** Helps identify which commit broke tests

### 3. Keep Tests Fast

**Target:** < 2 seconds for unit tests

**Strategies:**
- Use property-based tests for comprehensive coverage
- Mock external dependencies
- Avoid unnecessary I/O operations

### 4. Monitor Test Coverage

**Target:** > 80% coverage

**Focus on:**
- Critical business logic
- Error handling paths
- Edge cases

**View Coverage:**
```bash
npm test -- --coverage
open coverage/lcov-report/index.html
```

### 5. Review Workflow Logs

**When Build Fails:**
1. Go to GitHub Actions
2. Click on failed workflow
3. Expand failed step
4. Read error message carefully
5. Reproduce locally

### 6. Use Descriptive Branch Names

```bash
# Good
git checkout -b feat/fiscal-calculator
git checkout -b fix/iva-precision
git checkout -b docs/ci-cd-guide

# Bad
git checkout -b feature1
git checkout -b fix
```

### 7. Keep Dependencies Updated

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update major versions (careful!)
npm install package@latest
```

## Performance Optimization

### Faster Builds

**Use npm ci instead of npm install**
```bash
npm ci  # Respects package-lock.json, faster
```

**Cache Dependencies**
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # Caches node_modules
```

**Docker Layer Caching**
```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

### Faster Tests

**Run Tests in Parallel**
```bash
npm test -- --maxWorkers=4
```

**Skip Coverage for Local Development**
```bash
npm test -- --no-coverage
```

## Security

### GitHub Token Permissions

The workflow uses `GITHUB_TOKEN` with minimal required permissions:
- `contents: read` - Read repository code
- `packages: write` - Push Docker images

### Container Registry Security

- Images stored in private registry
- Access controlled via GitHub permissions
- Automatic cleanup of old images recommended

### Secrets Management

Never commit secrets to repository:
- Use GitHub Secrets for sensitive values
- Use `.env.example` for template
- Add `.env` to `.gitignore`

## Future Enhancements

- [ ] Automated deployment to staging environment
- [ ] Performance benchmarking in CI
- [ ] Security scanning (SAST/DAST)
- [ ] Database migration testing
- [ ] End-to-end testing in CI
- [ ] Slack/Discord notifications
- [ ] Automatic version bumping (semantic-release)
- [ ] Multi-platform Docker builds (arm64, amd64)
- [ ] Dependency vulnerability scanning
- [ ] Code quality metrics (SonarQube)

## Support

**Issues with CI/CD:**
1. Check GitHub Actions logs
2. Reproduce locally
3. Review this guide
4. Check GitHub Issues
5. Ask for help in team chat

**Useful Links:**
- GitHub Actions Docs: https://docs.github.com/en/actions
- Docker Docs: https://docs.docker.com
- Jest Docs: https://jestjs.io
- Next.js Docs: https://nextjs.org/docs
