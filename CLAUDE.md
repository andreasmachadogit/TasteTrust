# CLAUDE.md - AI Assistant Guidelines for TasteTrust

> This document provides comprehensive guidance for AI assistants working on the TasteTrust codebase.

## Project Overview

**TasteTrust** is a social platform for sharing restaurant recommendations and favourite dishes. The core concept is trust-based recommendations: users follow people whose taste they trust, rather than relying on generic crowd-sourced rankings.

### Core Value Proposition

Users arrive in a city and instantly see personalised recommendations from people they trust, knowing exactly which restaurant to visit and what to order.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Maps**: Mapbox GL JS or Leaflet with OpenStreetMap
- **State Management**: Zustand or React Context
- **Forms**: React Hook Form with Zod validation

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google, email/password)
- **Image Storage**: Cloudinary or AWS S3
- **Search**: PostgreSQL full-text search

---

## Project Structure

```
TasteTrust/
├── CLAUDE.md                    # AI assistant guidelines (this file)
├── README.md                    # Project documentation
├── package.json                 # Dependencies and scripts
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── .env.example                 # Environment variable template
├── .env.local                   # Local environment variables (gitignored)
├── .gitignore                   # Git ignore rules
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Database migrations
│   └── seed.ts                  # Database seeding script
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # Global styles
│   │   │
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── (main)/              # Main app route group
│   │   │   ├── layout.tsx       # Main layout with nav
│   │   │   ├── explore/page.tsx # City exploration
│   │   │   ├── feed/page.tsx    # Activity feed
│   │   │   ├── saved/page.tsx   # Saved restaurants
│   │   │   │
│   │   │   ├── restaurant/
│   │   │   │   └── [id]/page.tsx
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   └── [username]/page.tsx
│   │   │   │
│   │   │   └── add/             # Add recommendation flow
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                 # API Routes
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── users/
│   │       ├── restaurants/
│   │       ├── recommendations/
│   │       ├── dishes/
│   │       ├── saved/
│   │       └── search/
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── restaurant/          # Restaurant components
│   │   │   ├── RestaurantCard.tsx
│   │   │   ├── RestaurantList.tsx
│   │   │   └── RestaurantMap.tsx
│   │   ├── recommendation/      # Recommendation components
│   │   ├── user/                # User/profile components
│   │   └── forms/               # Form components
│   │
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client instance
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── utils.ts             # Utility functions
│   │   └── validations.ts       # Zod schemas
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useUser.ts
│   │   ├── useRestaurants.ts
│   │   └── useRecommendations.ts
│   │
│   ├── stores/                  # Zustand stores
│   │   └── useAppStore.ts
│   │
│   └── types/                   # TypeScript types
│       └── index.ts
│
├── public/                      # Static assets
│   └── images/
│
└── tests/                       # Test files
    ├── unit/
    └── integration/
```

---

## Database Schema

### Core Entities

```prisma
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  username    String   @unique
  displayName String   @map("display_name")
  avatarUrl   String?  @map("avatar_url")
  bio         String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  followers     Follow[] @relation("following")
  following     Follow[] @relation("follower")
  restaurants   Restaurant[]
  dishes        Dish[]
  recommendations Recommendation[]
  savedRestaurants SavedRestaurant[]

  @@map("users")
}

model Follow {
  followerId  String   @map("follower_id")
  followingId String   @map("following_id")
  createdAt   DateTime @default(now()) @map("created_at")

  follower  User @relation("follower", fields: [followerId], references: [id])
  following User @relation("following", fields: [followingId], references: [id])

  @@id([followerId, followingId])
  @@map("follows")
}

model Restaurant {
  id            String   @id @default(uuid())
  name          String
  address       String
  city          String
  country       String
  latitude      Float
  longitude     Float
  cuisineType   String   @map("cuisine_type")
  priceRange    Int      @map("price_range") // 1-4
  googlePlaceId String?  @map("google_place_id")
  createdById   String   @map("created_by")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  createdBy       User              @relation(fields: [createdById], references: [id])
  dishes          Dish[]
  recommendations Recommendation[]
  savedBy         SavedRestaurant[]

  @@map("restaurants")
}

model Dish {
  id           String   @id @default(uuid())
  restaurantId String   @map("restaurant_id")
  name         String
  description  String?
  photoUrl     String?  @map("photo_url")
  createdById  String   @map("created_by")
  createdAt    DateTime @default(now()) @map("created_at")

  restaurant          Restaurant           @relation(fields: [restaurantId], references: [id])
  createdBy           User                 @relation(fields: [createdById], references: [id])
  dishRecommendations DishRecommendation[]

  @@map("dishes")
}

model Recommendation {
  id           String    @id @default(uuid())
  userId       String    @map("user_id")
  restaurantId String    @map("restaurant_id")
  rating       Int       // 1-5
  reviewText   String?   @map("review_text")
  visitDate    DateTime? @map("visit_date")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  user                User                 @relation(fields: [userId], references: [id])
  restaurant          Restaurant           @relation(fields: [restaurantId], references: [id])
  dishRecommendations DishRecommendation[]

  @@map("recommendations")
}

model DishRecommendation {
  id               String  @id @default(uuid())
  recommendationId String  @map("recommendation_id")
  dishId           String  @map("dish_id")
  isMustTry        Boolean @default(false) @map("is_must_try")
  notes            String?

  recommendation Recommendation @relation(fields: [recommendationId], references: [id])
  dish           Dish           @relation(fields: [dishId], references: [id])

  @@map("dish_recommendations")
}

model SavedRestaurant {
  userId       String   @map("user_id")
  restaurantId String   @map("restaurant_id")
  notes        String?
  createdAt    DateTime @default(now()) @map("created_at")

  user       User       @relation(fields: [userId], references: [id])
  restaurant Restaurant @relation(fields: [restaurantId], references: [id])

  @@id([userId, restaurantId])
  @@map("saved_restaurants")
}
```

---

## API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/session
```

### Users
```
GET    /api/users/:username
PUT    /api/users/:username
GET    /api/users/:username/recommendations
GET    /api/users/:username/saved
GET    /api/users/:username/followers
GET    /api/users/:username/following
POST   /api/users/:username/follow
DELETE /api/users/:username/follow
```

### Restaurants
```
GET  /api/restaurants?city=&cuisine=&priceRange=
GET  /api/restaurants/:id
POST /api/restaurants
GET  /api/restaurants/:id/recommendations
GET  /api/restaurants/:id/dishes
```

### Recommendations
```
GET    /api/recommendations?city=&followingOnly=true
POST   /api/recommendations
PUT    /api/recommendations/:id
DELETE /api/recommendations/:id
```

### Dishes
```
POST /api/dishes
GET  /api/dishes/:id
```

### Saved
```
GET    /api/saved
POST   /api/saved/:restaurantId
DELETE /api/saved/:restaurantId
```

### Search
```
GET /api/search/users?q=
GET /api/search/restaurants?q=&city=
GET /api/search/cities?q=
```

---

## Development Environment

### Prerequisites

- **Node.js**: v18.x or higher (LTS recommended)
- **npm**: v9.x or higher
- **PostgreSQL**: v14 or higher
- **Git**: v2.x or higher

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd TasteTrust

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up the database
npx prisma generate
npx prisma db push  # Development
# OR
npx prisma migrate dev  # With migrations

# Seed the database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```bash
# Application
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-chars

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tastetrust

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Maps (Mapbox)
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

---

## Coding Conventions

### TypeScript

- Strict mode enabled
- Prefer interfaces over types for object shapes
- Use explicit return types on functions
- Avoid `any` - use `unknown` when type is truly unknown

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `RestaurantCard.tsx` |
| Utility files | camelCase | `formatDate.ts` |
| Variables/Functions | camelCase | `getRestaurants()` |
| Constants | UPPER_SNAKE_CASE | `MAX_RATING` |
| Types/Interfaces | PascalCase | `interface Restaurant` |
| Database tables | snake_case | `saved_restaurants` |
| API routes | kebab-case dirs | `/api/users/[username]` |
| CSS classes | kebab-case | `restaurant-card` |

### Component Structure

```tsx
// 1. Imports (external, then internal, then types)
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Restaurant } from '@/types'

// 2. Types/Interfaces
interface RestaurantCardProps {
  restaurant: Restaurant
  onSave?: () => void
}

// 3. Component
export function RestaurantCard({ restaurant, onSave }: RestaurantCardProps) {
  // Hooks first
  const [isSaved, setIsSaved] = useState(false)

  // Handlers
  const handleSave = () => {
    setIsSaved(true)
    onSave?.()
  }

  // Render
  return (
    <div className="restaurant-card">
      {/* ... */}
    </div>
  )
}
```

### API Route Structure

```typescript
// src/app/api/restaurants/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')

    const restaurants = await prisma.restaurant.findMany({
      where: city ? { city } : undefined,
    })

    return NextResponse.json({ data: restaurants })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    // Validate with Zod, create restaurant...

    return NextResponse.json({ data: restaurant }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    )
  }
}
```

---

## UI/UX Guidelines

### Design Principles

- **Clean & Modern**: Minimalist design, generous white space
- **Mobile-First**: Design for mobile, scale up for desktop
- **Typography**: Inter font family
- **Colour Palette**:
  - Primary: Warm terracotta/coral `#E07A5F`
  - Neutral: Warm greys
  - Accent: For ratings and highlights
- **Imagery**: Focus on food photography, rounded corners

### Responsive Breakpoints

```css
/* Tailwind defaults */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large desktops */
```

### Key UI Components

- **Bottom Navigation** (mobile): Home, Explore, Add, Saved, Profile
- **Floating Action Button**: Quick add recommendation
- **Bottom Sheet**: Restaurant preview on map tap
- **Cards**: Restaurant cards with image, rating, cuisine, price

---

## Git Workflow

### Branch Naming

```
feature/   - New features (feature/add-recommendation-flow)
fix/       - Bug fixes (fix/map-marker-clustering)
refactor/  - Code refactoring
docs/      - Documentation updates
claude/    - AI-assisted development
```

### Commit Messages

Follow conventional commits:

```
feat(restaurants): add map view with clustering
fix(auth): resolve Google OAuth callback error
docs(api): document recommendation endpoints
style(ui): update restaurant card hover states
refactor(hooks): extract useRestaurants logic
test(api): add restaurant endpoint tests
chore(deps): update Next.js to 14.1
```

---

## Testing

### Commands

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### Test Structure

```typescript
describe('RestaurantService', () => {
  describe('getByCity', () => {
    it('should return restaurants for a given city', async () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

---

## Quick Reference Commands

```bash
# Development
npm run dev           # Start dev server (port 3000)
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run format        # Format with Prettier

# Database
npx prisma generate   # Generate Prisma client
npx prisma db push    # Push schema changes (dev)
npx prisma migrate dev # Create migration
npx prisma studio     # Open Prisma Studio GUI
npx prisma db seed    # Seed database

# Testing
npm test              # Run tests
npm run test:coverage # With coverage
```

---

## Implementation Phases

### Phase 1: Foundation (Current)
- [x] Project setup with Next.js + TypeScript
- [x] Tailwind CSS and shadcn/ui configuration
- [x] PostgreSQL + Prisma schema
- [x] NextAuth.js authentication
- [x] Basic layouts

### Phase 2: Core Features
- [ ] User profiles and social graph
- [ ] Restaurant CRUD
- [ ] Recommendation system
- [ ] Dish management with photos

### Phase 3: Discovery
- [ ] City-based restaurant listing
- [ ] Map integration
- [ ] Filtering and sorting
- [ ] Search functionality

### Phase 4: Polish
- [ ] Activity feed
- [ ] Saved/wishlist feature
- [ ] Performance optimization
- [ ] PWA capabilities

---

## Important Notes for AI Assistants

1. **Mobile-First**: Always design and implement mobile view first, then scale up
2. **Use shadcn/ui**: Leverage existing components, don't reinvent the wheel
3. **Prisma Best Practices**: Use includes for relations, avoid N+1 queries
4. **Server Components**: Use React Server Components by default, client components only when needed
5. **Validation**: Use Zod schemas for all form and API validation
6. **Error Handling**: Implement proper error boundaries and API error responses
7. **No Over-Engineering**: Keep solutions simple and focused

---

*Last updated: 2026-02-05*
