# Branch Protection Rules - Taller Pro CR

This document describes the branch protection rules that should be configured in GitHub to enforce the CI/CD pipeline and maintain code quality.

## Overview

Branch protection rules ensure that:
- All tests pass before merging
- Code reviews are required
- The `dev` branch stays stable
- Only authorized users can bypass protections

## Configuration Steps

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository: https://github.com/Huevaldinho/TallerCR_Kiro
2. Click **Settings** (top right)
3. Click **Branches** (left sidebar)
4. Click **Add rule** under "Branch protection rules"

### Step 2: Configure Protection Rule for `dev` Branch

**Branch name pattern:** `dev`

### Step 3: Enable Required Protections

#### ✅ Require a pull request before merging

- **Number of required approvals:** 1
- ✅ Require review from Code Owners
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require approval of the most recent reviewable push

#### ✅ Require status checks to pass before merging

- ✅ Require branches to be up to date before merging
- **Required status checks:**
  - `test` (Run Tests)
  - `build` (Build Docker Image)

#### ✅ Require all conversations on code to be resolved before merging

#### ✅ Require signed commits (optional but recommended)

#### ✅ Restrict who can push to matching branches

- Allow specified actors to bypass required pull requests:
  - Administrators only

### Step 4: Save Rule

Click **Create** to save the branch protection rule.

## Workflow for Developers

### Creating a Feature Branch

```bash
# Update dev branch
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feat/your-feature-name
```

**Branch naming conventions:**
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance tasks

### Making Changes

```bash
# Make your changes
# Test locally
npm run lint && npm test

# Commit with meaningful message
git add .
git commit -m "feat: add new feature

- Implement feature X
- Add tests for feature X
- Update documentation"

# Push to GitHub
git push origin feat/your-feature-name
```

### Creating a Pull Request

1. Go to GitHub repository
2. Click **Compare & pull request**
3. Fill in PR details:
   - **Title:** Clear, descriptive title
   - **Description:** What changed and why
   - **Linked issues:** Reference any related issues
4. Request reviewers
5. Click **Create pull request**

### PR Template (Optional)

Create `.github/pull_request_template.md`:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added
- [ ] Property tests added
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

### Waiting for CI/CD Pipeline

The pipeline will automatically run:

```
Push to GitHub
    ↓
GitHub Actions Triggered
    ↓
┌──────────────────────────┐
│   TEST STAGE             │
│ ✓ Lint code              │
│ ✓ Run unit tests         │
│ ✓ Run property tests     │
│ ✓ Generate coverage      │
└──────────────────────────┘
    ↓
  PASS? ──NO──→ ❌ Tests Failed
    │           (Block Merge)
   YES
    ↓
┌──────────────────────────┐
│   BUILD STAGE            │
│ ✓ Build Docker image     │
│ ✓ Push to registry       │
│ ✓ Tag with commit SHA    │
└──────────────────────────┘
    ↓
  SUCCESS? ──NO──→ ❌ Build Failed
    │              (Block Merge)
   YES
    ↓
✅ All Checks Pass
    ↓
Ready for Code Review
    ↓
Reviewer Approves
    ↓
✅ Ready to Merge
```

### Merging to `dev`

Once all checks pass and code is approved:

1. Click **Squash and merge** (recommended)
   - Keeps history clean
   - One commit per feature
2. Or click **Merge** for full history
3. Delete the feature branch

## Status Checks Explained

### Test Stage (`test`)

**What it does:**
- Runs ESLint for code style
- Runs Jest unit tests
- Runs property-based tests with fast-check
- Generates coverage reports
- Uploads to Codecov

**Failure reasons:**
- Linting errors (critical)
- Test failures
- Coverage below threshold

**How to fix:**
```bash
npm run lint -- --fix
npm test -- --clearCache
npm test
```

### Build Stage (`build`)

**What it does:**
- Builds Docker image
- Pushes to GitHub Container Registry
- Tags with `dev` and commit SHA

**Failure reasons:**
- Dockerfile syntax error
- Missing dependencies
- Build timeout
- Registry authentication failed

**How to fix:**
```bash
docker build -t taller-pro-cr:dev .
docker-compose up --build
```

## Troubleshooting

### Tests Fail in CI but Pass Locally

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm ci

# Clear Jest cache
npm test -- --clearCache

# Run tests
npm test
```

### Docker Build Fails

**Check logs:**
```bash
# View GitHub Actions logs
# Go to Actions tab → Click failed workflow → Expand "Build Docker Image"

# Or build locally
docker build --no-cache -t taller-pro-cr:dev .
```

### Can't Merge PR

**Checklist:**
- [ ] All status checks are green (✅)
- [ ] Code review is approved
- [ ] Branch is up to date with `dev`
- [ ] No merge conflicts
- [ ] All conversations resolved

**To update branch:**
```bash
git fetch origin
git rebase origin/dev
git push origin feat/your-feature --force-with-lease
```

### Stale Approvals

If you push new commits after approval, the approval becomes stale and you need a new review. This is by design to ensure reviewers see all changes.

## Best Practices

### 1. Test Locally Before Pushing

```bash
npm run lint && npm test
```

**Why:** Catch issues early, avoid failed CI runs

### 2. Keep Commits Atomic

Each commit should be a single logical change:
```bash
# Good
git commit -m "feat: add fiscal calculator"
git commit -m "test: add property tests for calculator"

# Bad
git commit -m "add calculator, fix bugs, update docs"
```

### 3. Write Descriptive Commit Messages

```bash
# Good
git commit -m "feat: implement fiscal calculator with big.js

- Add calculateIVA function with 13% precision
- Add property tests for monetary precision
- Verify no floating-point errors"

# Bad
git commit -m "fix stuff"
```

### 4. Request Reviews from Team Members

- Different perspectives catch bugs
- Knowledge sharing
- Code quality improvement

### 5. Respond to Review Comments Promptly

- Address feedback
- Push new commits (don't force push)
- Re-request review

### 6. Keep PRs Focused

- One feature per PR
- Easier to review
- Easier to revert if needed
- Faster merge time

## GitHub Actions Secrets

For the CI/CD pipeline to work, ensure these are configured:

**Settings → Secrets and variables → Actions**

| Secret | Purpose | Status |
|--------|---------|--------|
| `GITHUB_TOKEN` | Authenticate with GitHub | ✅ Automatic |
| `SUPABASE_URL` | Database connection | 🔄 Future |
| `SUPABASE_KEY` | Database API key | 🔄 Future |

## Monitoring

### GitHub Actions Dashboard
- View all workflow runs: https://github.com/Huevaldinho/TallerCR_Kiro/actions
- Check specific workflow: Click on workflow name
- View logs: Expand failed step

### Container Registry
- View images: https://github.com/Huevaldinho/TallerCR_Kiro/pkgs/container/TallerCR_Kiro
- Manage versions: Delete old images, change visibility

### Branch Protection Status
- View rules: https://github.com/Huevaldinho/TallerCR_Kiro/settings/branches
- Edit rules: Click on rule name

## Code Owners (Optional)

Create `.github/CODEOWNERS` to automatically request reviews:

```
# Default owners for everything
* @Huevaldinho

# Fiscal calculations
src/lib/fiscal/ @Huevaldinho

# Validation
src/lib/validation/ @Huevaldinho

# Database
src/lib/supabase/ @Huevaldinho
```

## Future Enhancements

- [ ] Require status checks for all branches
- [ ] Automatic deployment on merge
- [ ] Slack notifications for failed builds
- [ ] Performance benchmarking
- [ ] Security scanning (SAST/DAST)
- [ ] Automatic version bumping
- [ ] Release notes generation

## Support

**Questions about branch protection?**
1. Check this guide
2. Review GitHub documentation: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
3. Ask team members

**Issues with CI/CD pipeline?**
1. Check GitHub Actions logs
2. Reproduce locally
3. Review CI_CD_GUIDE.md
4. Check GitHub Issues
