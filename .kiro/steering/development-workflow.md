---
inclusion: always
---

# Development Workflow - Taller Pro CR

This steering guide is automatically included in all Kiro interactions to ensure consistent development practices.

## Before Starting Any Task

1. **Read the spec files**
   - `.kiro/specs/taller-cr-mvp/requirements.md` - What to build
   - `.kiro/specs/taller-cr-mvp/design.md` - How to build it
   - `.kiro/specs/taller-cr-mvp/tasks.md` - What task to work on

2. **Understand the requirements**
   - Read the acceptance criteria
   - Understand the properties to validate
   - Know what tests are needed

3. **Update task status**
   - Mark task as `in_progress` when starting
   - This helps track what's being worked on

## During Implementation

1. **Write minimal, focused code**
   - Only implement what the task requires
   - Don't add extra features
   - Follow the design document

2. **Write comprehensive tests**
   - Unit tests for specific examples and edge cases
   - Property-based tests for universal properties
   - Tests should validate the requirements

3. **Run tests locally**
   ```bash
   npm test
   ```
   - All tests must pass before committing
   - Check coverage if applicable

## When Committing

1. **Use meaningful commit messages**
   ```
   feat: implement feature name
   
   - What was implemented
   - Why it was implemented
   - Reference requirements/properties
   ```

2. **Reference requirements and properties**
   - Example: `Property 12: Fiscal Calculation Correctness`
   - Example: `Requirements: 7.1, 7.2, 7.3`

3. **Commit only related changes**
   - One logical change per commit
   - Don't mix different features

## After Committing

1. **GitHub Actions will automatically run**
   - Test stage: Linter, unit tests, property tests
   - Build stage: Docker image build and push
   - Deploy stage: Future deployment

2. **Expected outcomes**
   - ✅ All tests pass
   - ✅ Docker image built and pushed
   - ✅ Image available at `ghcr.io/Huevaldinho/TallerCR_Kiro:dev`

3. **If tests fail**
   - Check GitHub Actions logs
   - Reproduce locally
   - Fix the issue
   - Commit the fix

## Key Commands

```bash
# Run tests
npm test

# Run specific tests
npm test -- --testPathPattern="fiscal"

# Run with coverage
npm test -- --coverage

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix

# Build Docker image
docker build -t taller-pro-cr:dev .

# Run Docker container
docker-compose up --build

# Check health endpoint
curl http://localhost:3000/api/health
```

## Important Files

- **Spec files**: `.kiro/specs/taller-cr-mvp/`
- **CI/CD workflow**: `.github/workflows/ci-cd.yml`
- **Agent workflow**: `.kiro/AGENT_WORKFLOW.md`
- **Branch protection**: `.github/BRANCH_PROTECTION.md`
- **CI/CD guide**: `CI_CD_GUIDE.md`

## Testing Strategy

### Unit Tests
- Test specific examples
- Test edge cases
- Test error conditions

### Property-Based Tests
- Test universal properties
- Generate random inputs
- Verify invariants hold

**Both types are required for comprehensive coverage.**

## Commit Types

- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Test improvements
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `chore:` - Maintenance

## When to Ask for User Input

Ask the user when:
- Requirements are ambiguous
- Design decisions need clarification
- Multiple implementation approaches exist
- Test failures indicate specification issues
- Performance trade-offs need to be made

## Task Completion Checklist

Before marking a task as completed:

- [ ] Read spec files (requirements, design, tasks)
- [ ] Implemented the feature according to spec
- [ ] Written unit tests
- [ ] Written property-based tests
- [ ] All tests pass locally
- [ ] Linter passes
- [ ] Meaningful commit message written
- [ ] Committed to dev branch
- [ ] Task status updated to `completed`

## Remember

1. **Specs are the source of truth** - Always refer to them
2. **Tests validate correctness** - Write comprehensive tests
3. **Commits tell the story** - Use meaningful messages
4. **CI/CD pipeline verifies quality** - Understand what happens after commit
5. **Properties ensure reliability** - Property-based tests catch edge cases

## Resources

- **GitHub Repository**: https://github.com/Huevaldinho/TallerCR_Kiro
- **GitHub Actions**: https://github.com/Huevaldinho/TallerCR_Kiro/actions
- **Container Registry**: https://github.com/Huevaldinho/TallerCR_Kiro/pkgs/container/TallerCR_Kiro
- **Spec Files**: `.kiro/specs/taller-cr-mvp/`
- **Agent Workflow**: `.kiro/AGENT_WORKFLOW.md`
