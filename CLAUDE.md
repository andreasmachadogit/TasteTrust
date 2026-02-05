# CLAUDE.md - AI Assistant Guidelines for TasteTrust

> This document provides comprehensive guidance for AI assistants working on the TasteTrust codebase.

## Project Overview

**TasteTrust** is a food and restaurant review platform designed to help users discover, rate, and share dining experiences. The platform aims to build trust through verified reviews and personalized recommendations.

### Repository Status

This is a **new project** currently in the initial setup phase. The repository structure and codebase will be built incrementally.

---

## Development Environment

### Prerequisites

- **Node.js**: v18.x or higher (LTS recommended)
- **npm**: v9.x or higher (or yarn/pnpm)
- **Git**: v2.x or higher
- **Database**: PostgreSQL 14+ (recommended) or SQLite for development

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd TasteTrust

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local configuration

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

---

## Project Structure (Recommended)

```
TasteTrust/
├── CLAUDE.md                 # AI assistant guidelines (this file)
├── README.md                 # Project documentation
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .env.example              # Environment variable template
├── .gitignore                # Git ignore rules
│
├── src/                      # Source code
│   ├── api/                  # API routes and controllers
│   │   ├── routes/           # Route definitions
│   │   ├── controllers/      # Request handlers
│   │   └── middleware/       # Express/API middleware
│   │
│   ├── models/               # Database models/schemas
│   │   ├── User.ts
│   │   ├── Restaurant.ts
│   │   ├── Review.ts
│   │   └── index.ts
│   │
│   ├── services/             # Business logic layer
│   │   ├── auth/             # Authentication services
│   │   ├── reviews/          # Review management
│   │   └── restaurants/      # Restaurant services
│   │
│   ├── utils/                # Utility functions
│   │   ├── validation.ts     # Input validation helpers
│   │   ├── errors.ts         # Custom error classes
│   │   └── helpers.ts        # General utilities
│   │
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── config/               # Configuration files
│   │   ├── database.ts
│   │   └── app.ts
│   │
│   └── index.ts              # Application entry point
│
├── tests/                    # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── fixtures/             # Test data/fixtures
│
├── scripts/                  # Build and utility scripts
│   ├── seed.ts               # Database seeding
│   └── migrate.ts            # Migration runner
│
├── docs/                     # Additional documentation
│   └── api.md                # API documentation
│
└── public/                   # Static assets (if applicable)
```

---

## Coding Conventions

### Language & Style

- **Language**: TypeScript (strict mode enabled)
- **Style Guide**: Follow ESLint + Prettier configuration
- **Formatting**: 2-space indentation, single quotes, no semicolons (configurable)

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files (components) | PascalCase | `ReviewCard.tsx` |
| Files (utilities) | camelCase | `formatDate.ts` |
| Variables/Functions | camelCase | `getUserReviews()` |
| Constants | UPPER_SNAKE_CASE | `MAX_RATING_VALUE` |
| Types/Interfaces | PascalCase | `interface UserProfile` |
| Database tables | snake_case | `user_reviews` |
| API endpoints | kebab-case | `/api/v1/user-reviews` |

### Code Organization

1. **Imports order**:
   - External dependencies
   - Internal modules (absolute paths)
   - Relative imports
   - Type imports (at the end)

2. **Function structure**:
   - Keep functions small and focused (< 50 lines ideal)
   - Use early returns to reduce nesting
   - Document complex logic with inline comments

3. **Error handling**:
   - Use custom error classes for domain-specific errors
   - Always handle async errors with try/catch or `.catch()`
   - Log errors appropriately before re-throwing

---

## Git Workflow

### Branch Naming

```
feature/   - New features (feature/add-review-photos)
fix/       - Bug fixes (fix/rating-calculation)
refactor/  - Code refactoring (refactor/auth-service)
docs/      - Documentation (docs/api-endpoints)
test/      - Test additions (test/review-service)
claude/    - AI-assisted work branches
```

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```
feat(reviews): add photo upload capability
fix(auth): resolve token refresh race condition
docs(api): update endpoint documentation
test(services): add review service unit tests
```

### Pull Request Guidelines

1. Keep PRs focused and reasonably sized
2. Include description of changes and testing done
3. Reference related issues when applicable
4. Ensure all tests pass before requesting review

---

## Testing Guidelines

### Test Structure

```typescript
describe('ReviewService', () => {
  describe('createReview', () => {
    it('should create a review with valid data', async () => {
      // Arrange
      // Act
      // Assert
    })

    it('should throw error for invalid rating', async () => {
      // ...
    })
  })
})
```

### Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.spec.ts
```

### Coverage Requirements

- Minimum 80% code coverage for new code
- Critical paths (auth, payments) require 90%+ coverage

---

## API Design Guidelines

### RESTful Conventions

```
GET    /api/v1/restaurants          # List restaurants
GET    /api/v1/restaurants/:id      # Get single restaurant
POST   /api/v1/restaurants          # Create restaurant
PUT    /api/v1/restaurants/:id      # Update restaurant
DELETE /api/v1/restaurants/:id      # Delete restaurant

GET    /api/v1/restaurants/:id/reviews    # Nested resource
```

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "rating", "message": "Rating must be between 1 and 5" }
    ]
  }
}
```

---

## Database Guidelines

### Migration Practices

- Always create migrations for schema changes
- Never modify existing migrations after deployment
- Use descriptive migration names: `20240101_add_photo_url_to_reviews.ts`

### Query Optimization

- Use indexes for frequently queried columns
- Avoid N+1 queries - use eager loading when appropriate
- Use pagination for list endpoints

### Data Models (Core Entities)

**User**
- id, email, password_hash, display_name, avatar_url
- created_at, updated_at

**Restaurant**
- id, name, description, address, cuisine_type
- latitude, longitude, phone, website
- average_rating, review_count
- created_at, updated_at

**Review**
- id, user_id, restaurant_id
- rating (1-5), title, content
- photos (array), helpful_count
- created_at, updated_at

---

## Security Guidelines

### Authentication

- Use JWT tokens with appropriate expiration
- Implement refresh token rotation
- Hash passwords with bcrypt (cost factor 12+)

### Input Validation

- Validate all user input on server side
- Sanitize data before database operations
- Use parameterized queries to prevent SQL injection

### Sensitive Data

- Never commit secrets or API keys
- Use environment variables for configuration
- Implement rate limiting on public endpoints

---

## Environment Variables

Required environment variables:

```bash
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/tastetrust

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# External Services (as needed)
# CLOUDINARY_URL=...
# SENDGRID_API_KEY=...
```

---

## Common Tasks for AI Assistants

### When Adding a New Feature

1. Understand the existing codebase structure
2. Create necessary model/schema changes
3. Implement service layer logic
4. Add API routes/controllers
5. Write tests (unit and integration)
6. Update documentation if needed

### When Fixing a Bug

1. Reproduce the issue locally
2. Write a failing test that captures the bug
3. Implement the fix
4. Verify the test passes
5. Check for regression in related areas

### When Refactoring

1. Ensure comprehensive test coverage exists
2. Make incremental changes
3. Run tests after each change
4. Maintain backwards compatibility unless explicitly breaking

---

## Important Notes

1. **No Over-Engineering**: Keep solutions simple. Don't add abstractions until needed.

2. **Security First**: Always consider security implications of changes.

3. **Test Coverage**: Maintain high test coverage, especially for critical paths.

4. **Documentation**: Update relevant docs when making significant changes.

5. **Performance**: Consider query performance and API response times.

6. **Accessibility**: Follow accessibility best practices for any UI work.

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run linter
npm run format           # Format code

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:reset         # Reset database

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

---

## Contact & Resources

- **Repository**: TasteTrust on GitHub
- **Issue Tracker**: GitHub Issues
- **Documentation**: `/docs` directory

---

*Last updated: 2026-02-05*
