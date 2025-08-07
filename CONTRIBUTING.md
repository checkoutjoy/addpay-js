# Contributing to AddPay JavaScript SDK

Thank you for considering contributing to the AddPay JavaScript SDK! This document provides guidelines and information for contributors.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/addpay-js.git
   cd addpay-js
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run tests**
   ```bash
   pnpm test
   ```

4. **Build the project**
   ```bash
   pnpm run build
   ```

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples

```
feat: add webhook validation helper

Add utility function to validate incoming webhook signatures
from AddPay API using RSA verification.

Closes #123
```

```
fix: handle network timeout errors in http client

- Add proper timeout handling for requests
- Implement exponential backoff for retries
- Update error messages to be more descriptive

Fixes #456
```

```
docs: update checkout examples in README

Add more comprehensive examples for hosted checkout
including error handling and status checking.
```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Write code following the existing patterns
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   pnpm run typecheck  # TypeScript checking
   pnpm run lint       # Linting
   pnpm test          # Run tests
   pnpm run build     # Build check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feat/your-feature-name
   ```

## Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Write comprehensive tests for new features
- Keep functions small and focused
- Use descriptive variable and function names

## Testing

- Write unit tests for new functionality
- Mock external dependencies in tests
- Aim for high test coverage
- Test both success and error scenarios
- Use descriptive test names

### Test Structure

```typescript
describe('FeatureName', () => {
  describe('methodName', () => {
    it('should handle success case correctly', async () => {
      // Test implementation
    });

    it('should handle error case gracefully', async () => {
      // Test error handling
    });
  });
});
```

## Adding New Features

### New API Endpoint

1. **Add types** in the appropriate type file
2. **Add method** to the relevant resource class
3. **Add builder** if the request is complex
4. **Write tests** for the new functionality
5. **Update documentation** with examples

### New Resource

1. **Create resource class** in `src/resources/`
2. **Define types** in `src/types/`
3. **Add to main client** in `src/client.ts`
4. **Export from index** in `src/index.ts`
5. **Write comprehensive tests**
6. **Add examples to README**

## Release Process

This project uses automated releases via [semantic-release](https://semantic-release.gitbook.io/semantic-release/).

- **Patch version**: `fix:` commits
- **Minor version**: `feat:` commits
- **Major version**: `feat:` or `fix:` commits with `BREAKING CHANGE:` in body or footer

Releases are automatically triggered when changes are merged to the `main` branch.

## Pull Request Guidelines

1. **Keep PRs focused** - One feature/fix per PR
2. **Write clear descriptions** - Explain what and why
3. **Include tests** - All new code should have tests
4. **Update docs** - Update README/docs if needed
5. **Check CI** - Ensure all checks pass

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Updated existing tests if needed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated if needed
- [ ] No breaking changes (or marked as such)
```

## Getting Help

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Documentation**: Check CLAUDE.md for technical details

## Code of Conduct

Be respectful and inclusive. This project follows standard open source community guidelines.

Thank you for contributing! 🚀