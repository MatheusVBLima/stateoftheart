# State Of The Art

A community platform for developers to discover, vote on, and track state-of-the-art technologies across different programming areas.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

1. **Clone the repository**

```bash
git clone <repo-url>
cd stateofart
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment setup**

```bash
cp .env.example .env.local
# Edit .env.local with your Clerk keys
```

4. **Database setup**

```bash
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

5. **Start development server**

```bash
npm run dev
```

Visit http://localhost:3000

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Lint code
npm run format       # Format code

# Database
npx prisma studio    # Database GUI
npm run db:seed      # Seed database
```

## Tech Stack

- **Next.js 15** - App Router with Turbopack
- **Prisma** - Database ORM
- **Clerk** - Authentication
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
