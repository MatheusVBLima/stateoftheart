import { PrismaClient, VoteType } from "@prisma/client";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

const prisma = new PrismaClient();

const categories = [
  {
    name: "Authentication",
    slug: "authentication",
    description:
      "Complete authentication solutions with social login, session management, and security features.",
  },
  {
    name: "Database ORM",
    slug: "database-orm",
    description:
      "Object-relational mapping tools that simplify database operations and provide type safety.",
  },
  {
    name: "State Management",
    slug: "state-management",
    description:
      "Client-side state management solutions for complex application state.",
  },
  {
    name: "UI Component Libraries",
    slug: "ui-components",
    description:
      "Comprehensive component libraries and design systems for building interfaces.",
  },
  {
    name: "API Development",
    slug: "api-development",
    description:
      "Tools and frameworks for building robust REST and GraphQL APIs.",
  },
  {
    name: "Testing",
    slug: "testing",
    description:
      "Testing frameworks and tools for unit, integration, and end-to-end testing.",
  },
  {
    name: "CSS Frameworks",
    slug: "css-frameworks",
    description:
      "Utility-first and component-based CSS frameworks for rapid UI development.",
  },
  {
    name: "Build Tools",
    slug: "build-tools",
    description:
      "Modern build tools and bundlers for optimizing development workflow.",
  },
];

const implementations = [
  // Authentication
  {
    name: "NextAuth.js",
    slug: "nextauth-js",
    description:
      "Complete authentication for Next.js applications with support for multiple providers, JWT, and database sessions.",
    content: `# Why NextAuth.js is State-of-the-Art

## 🔐 Complete Authentication Solution
NextAuth.js provides a **comprehensive authentication library** specifically designed for Next.js applications, handling everything from OAuth flows to session management with minimal configuration.

## 🌐 Universal Provider Support
Support for **50+ authentication providers** out of the box:

\`\`\`typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // Your custom auth logic
      }
    })
  ],
})
\`\`\`

## 🛡️ Security Best Practices
- **Secure by default**: CSRF protection, secure cookies, PKCE
- **JWT & Database sessions**: Choose your session strategy
- **Built-in CSRF protection**: Prevents cross-site request forgery
- **Secure cookie handling**: HttpOnly, SameSite, Secure flags

## 🚀 Next.js Integration
Perfect integration with Next.js features:
- **App Router support**: Works seamlessly with Next.js 13+ App Router
- **API Routes**: Built-in API endpoints for auth flows
- **Middleware support**: Protect routes with Next.js middleware
- **TypeScript first**: Full TypeScript support with type definitions

## 💎 Key Features

### Flexible Session Management
Choose between JWT tokens (stateless) or database sessions (stateful) based on your needs.

### Custom Pages & Callbacks
Complete customization of sign-in pages, error handling, and authentication callbacks.

### Database Adapters
Official adapters for all major databases: PostgreSQL, MySQL, MongoDB, and more.

### Edge Runtime Support
Optimized for Vercel Edge Functions and other edge computing platforms.

NextAuth.js eliminates the complexity of implementing secure authentication while providing the flexibility to customize every aspect of the user experience.`,
    website: "https://next-auth.js.org",
    githubUrl: "https://github.com/nextauthjs/next-auth",
    categorySlug: "authentication",
  },
  {
    name: "Clerk",
    slug: "clerk",
    description:
      "Drop-in authentication with beautiful UI components, user management, and advanced security features.",
    content: `# Why Clerk is State-of-the-Art

## 🎨 Beautiful UI Components
Clerk provides **pre-built, customizable UI components** that handle the entire authentication flow - from sign-up to user management. No need to build forms from scratch.

## 🔐 Enterprise Security
- **Multi-factor authentication** built-in
- **Session management** with automatic refresh
- **Device management** and security monitoring
- **Bot protection** and fraud detection
- **Compliance ready** (SOC 2, GDPR, CCPA)

## ⚡ Developer Experience
\`\`\`tsx
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

export default function App() {
  return (
    <ClerkProvider>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </ClerkProvider>
  )
}
\`\`\`

## 🛠️ Advanced Features
- **User management dashboard** with admin controls
- **Organizations & teams** support
- **Custom roles & permissions**
- **Webhooks** for real-time events
- **Analytics** and user insights

Clerk eliminates months of authentication development with production-ready components and enterprise security out of the box.`,
    website: "https://clerk.com",
    githubUrl: "https://github.com/clerkinc/javascript",
    categorySlug: "authentication",
  },
  {
    name: "Auth0",
    slug: "auth0",
    description:
      "Enterprise-grade authentication and authorization platform with extensive customization options.",
    content: `# Why Auth0 is State-of-the-Art

## 🏢 Enterprise-Grade Platform
Auth0 provides **enterprise-level authentication and authorization** with advanced security features, compliance certifications, and global infrastructure scaling to millions of users.

## 🔧 Universal Identity Platform
- **Single Sign-On (SSO)** across multiple applications
- **Social and enterprise identity providers**
- **Multi-factor authentication** with various methods
- **Advanced user management** and analytics
- **Custom authentication flows** with Actions and Rules

## 🛡️ Security & Compliance
- **SOC 2 Type II, ISO 27001, GDPR** compliant
- **Anomaly detection** and bot protection
- **Breached password detection**
- **Advanced threat protection**
- **Audit logs** and compliance reporting

## 🌍 Global Scale
- **99.99% uptime SLA**
- **Global CDN** for optimal performance
- **Automatic scaling** to handle traffic spikes
- **Multi-region deployment** options

Auth0 is the choice for organizations that need enterprise-grade security, compliance, and the ability to scale authentication across multiple applications and user bases.`,
    website: "https://auth0.com",
    categorySlug: "authentication",
  },

  // Database ORM
  {
    name: "Prisma",
    slug: "prisma",
    description:
      "Next-generation ORM with type safety, auto-generated client, and powerful schema management.",
    content: `# Why Prisma is State-of-the-Art

## 🎯 Type-Safe Database Access
Prisma generates a **fully type-safe client** from your database schema, eliminating runtime errors and providing excellent autocomplete in your IDE.

## 📝 Declarative Schema
\`\`\`prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String?
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
\`\`\`

## 🔄 Migration System
- **Automatic migration generation** from schema changes
- **Migration history** tracking
- **Schema introspection** from existing databases
- **Multi-database support** (PostgreSQL, MySQL, SQLite, MongoDB)

## 🚀 Developer Experience
- **Prisma Studio** - visual database browser
- **Query optimization** and performance insights
- **Real-time query logging**
- **Excellent TypeScript integration**
- **Rich ecosystem** with extensions and tools

## ⚡ Performance
- **Connection pooling** built-in
- **Query optimization** and batching
- **Efficient data loading** with select and include
- **Edge runtime support**

Prisma revolutionizes database development by bringing type safety, excellent tooling, and modern developer experience to database operations.`,
    website: "https://prisma.io",
    githubUrl: "https://github.com/prisma/prisma",
    categorySlug: "database-orm",
  },
  {
    name: "Drizzle ORM",
    slug: "drizzle-orm",
    description:
      "Lightweight TypeScript ORM with SQL-like syntax and excellent performance.",
    content: `# Why Drizzle ORM is State-of-the-Art

## 🚀 Performance First
Drizzle ORM is built for **zero runtime overhead** with a lightweight design that doesn't sacrifice developer experience. Unlike heavier ORMs, Drizzle generates minimal JavaScript bundles and executes queries with near-native SQL performance.

## 🎯 SQL-like Syntax
Write queries that feel natural to SQL developers while maintaining full TypeScript type safety:

\`\`\`typescript
const result = await db
  .select()
  .from(users)
  .where(eq(users.email, 'user@example.com'))
  .leftJoin(posts, eq(users.id, posts.authorId));
\`\`\`

## 🔧 Migration Excellence
- **Push & Pull**: Instantly sync schema changes with \`drizzle-kit push\`
- **Introspection**: Generate schema from existing databases
- **Migration Generation**: Automatic SQL migration file creation
- **Multi-database**: Support for PostgreSQL, MySQL, SQLite, and more

## 💎 Key Advantages

### Type Safety
Full TypeScript inference for queries, mutations, and schema definitions without code generation overhead.

### Developer Experience
- Intuitive API that mirrors SQL structure
- Excellent IDE support with autocomplete
- Minimal learning curve for SQL-familiar developers

### Production Ready
- Used by major companies in production
- Comprehensive testing suite
- Active development and community support

### Edge Computing Optimized
Perfect for modern deployment targets like Cloudflare Workers, Vercel Edge Functions, and other serverless environments where bundle size matters.

Drizzle represents the evolution of TypeScript ORMs - combining the familiarity of SQL with modern developer tooling and performance requirements.`,
    website: "https://orm.drizzle.team",
    githubUrl: "https://github.com/drizzle-team/drizzle-orm",
    categorySlug: "database-orm",
  },
  {
    name: "TypeORM",
    slug: "typeorm",
    description:
      "Feature-rich ORM with decorators, migrations, and support for multiple databases.",
    content: `# Why TypeORM is State-of-the-Art

## 🎨 Decorator-Based Design
TypeORM uses **TypeScript decorators** to define entities and relationships, creating clean and expressive data models:

\`\`\`typescript
@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];
}
\`\`\`

## 📊 Advanced ORM Features
- **Active Record and Data Mapper** patterns
- **Complex queries** with QueryBuilder
- **Entity relations** with lazy/eager loading
- **Database schema synchronization**
- **Advanced caching** strategies

## 💾 Multi-Database Support
- **PostgreSQL, MySQL, SQLite, MongoDB** and more
- **Database-specific features** support
- **Cross-database migrations**
- **Connection pooling** and clustering

## 🚀 Enterprise Features
- **Migration system** with version control
- **Schema validation** and synchronization
- **CLI tools** for code generation
- **Performance monitoring** and logging
- **Transaction support** with savepoints

TypeORM provides the most comprehensive feature set for complex enterprise applications requiring advanced ORM capabilities.`,
    website: "https://typeorm.io",
    githubUrl: "https://github.com/typeorm/typeorm",
    categorySlug: "database-orm",
  },

  // State Management
  {
    name: "TanStack Query",
    slug: "tanstack-query",
    description:
      "Powerful data synchronization for web applications with caching, background updates, and optimistic updates.",
    content: `# Why TanStack Query is State-of-the-Art

## 📊 Server State Management
TanStack Query is **the definitive solution for server state management**, handling caching, synchronization, and updates automatically:

\`\`\`typescript
function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (isLoading) return 'Loading...'
  if (error) return 'An error occurred'

  return (
    <div>
      {data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
\`\`\`

## ⚡ Intelligent Caching
- **Automatic background refetching**
- **Stale-while-revalidate** strategy
- **Query invalidation** and cache management
- **Offline support** with persistence
- **Optimistic updates** for instant UI

## 🔄 Advanced Features
- **Infinite queries** for pagination
- **Parallel and dependent queries**
- **Mutations** with rollback capabilities
- **Request deduplication**
- **Window focus refetching**

## 🛠️ Developer Experience
- **Devtools** for debugging and inspection
- **TypeScript first** with excellent inference
- **Framework agnostic** (React, Vue, Svelte, Solid)
- **Small bundle size** with tree-shaking

TanStack Query eliminates the complexity of managing server state, providing a declarative API that handles caching, synchronization, and error handling automatically.`,
    website: "https://tanstack.com/query",
    githubUrl: "https://github.com/TanStack/query",
    categorySlug: "state-management",
  },
  {
    name: "Zustand",
    slug: "zustand",
    description:
      "Small, fast, and scalable bearbones state management solution for React.",
    content: `# Why Zustand is State-of-the-Art

## 🧿 Minimal & Powerful
Zustand provides **powerful state management** in a tiny package (~1.2kb) without the boilerplate of larger solutions:

\`\`\`typescript
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
  removeAllBears: () => void
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  removeAllBears: () => set({ bears: 0 }),
}))

// Usage in component
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  const increase = useBearStore((state) => state.increase)
  return (
    <div>
      <h1>{bears} around here...</h1>
      <button onClick={() => increase(1)}>Add bear</button>
    </div>
  )
}
\`\`\`

## 🎨 No Boilerplate
- **No providers** or wrapper components needed
- **Direct store access** from any component
- **Automatic re-renders** with fine-grained subscriptions
- **TypeScript first** with excellent inference

## 🚀 Advanced Features
- **Middleware support** (persist, devtools, immer)
- **Async actions** with built-in error handling
- **State slicing** for large applications
- **SSR support** with hydration
- **Computed values** and selectors

## ⚡ Performance
- **Minimal re-renders** with selector optimization
- **No unnecessary updates** with shallow comparison
- **Tree-shakable** and bundle-size optimized

Zustand proves that state management doesn't need to be complex - providing all the power you need with a simple, intuitive API.`,
    website: "https://zustand-demo.pmnd.rs",
    githubUrl: "https://github.com/pmndrs/zustand",
    categorySlug: "state-management",
  },
  {
    name: "Redux Toolkit",
    slug: "redux-toolkit",
    description:
      "The official, opinionated, batteries-included toolset for efficient Redux development.",
    content: `# Why Redux Toolkit is State-of-the-Art

## 🛠️ Official Redux Evolution
Redux Toolkit is the **official, opinionated approach** to Redux development, eliminating boilerplate while maintaining Redux's predictable state management:

\`\`\`typescript
import { createSlice, configureStore } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 } as CounterState,
  reducers: {
    increment: (state) => {
      state.value += 1 // Immer makes this immutable under the hood
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
})
\`\`\`

## 💫 Modern Redux Features
- **Immer integration** for "mutable" updates
- **Built-in thunk middleware** for async logic
- **Redux DevTools** integration by default
- **Automatic action creators** and type inference
- **RTK Query** for data fetching and caching

## 🌐 Enterprise Scale
- **Time-travel debugging** with DevTools
- **Predictable state updates** with reducers
- **Middleware ecosystem** for custom logic
- **Server-side rendering** support
- **Hot reloading** and persistence

## 📦 Batteries Included
- **createAsyncThunk** for async actions
- **createEntityAdapter** for normalized state
- **createListenerMiddleware** for side effects
- **Built-in selectors** and memoization

Redux Toolkit modernizes Redux development while preserving its core principles of predictable state management at scale.`,
    website: "https://redux-toolkit.js.org",
    githubUrl: "https://github.com/reduxjs/redux-toolkit",
    categorySlug: "state-management",
  },

  // API Development
  {
    name: "Express.js",
    slug: "express-js",
    description:
      "Fast, unopinionated, minimalist web framework for Node.js with robust routing and middleware support.",
    content: `# Why Express.js is State-of-the-Art

## ⚡ Minimal & Fast
Express.js is the **most popular Node.js web framework**, providing a thin layer of fundamental web application features without obscuring Node.js features. Its minimalist approach allows developers to build exactly what they need.

## 🔌 Middleware Ecosystem
Express pioneered the middleware pattern for web frameworks, creating a rich ecosystem of reusable components:

\`\`\`javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Custom middleware
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.path}\`);
  next();
});

// Routes
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
\`\`\`

## 🛠️ Flexible Architecture
- **Unopinionated**: No forced project structure or conventions
- **Modular**: Use only what you need, extend with middleware
- **Router system**: Organize routes with Express Router
- **Template engines**: Support for all major template engines

## 🚀 Production Ready
Express powers some of the world's largest applications:
- **Netflix, Uber, WhatsApp** use Express in production
- **Battle-tested**: Over 10 years of production use
- **Performance**: Minimal overhead on top of Node.js
- **Scalability**: Handles millions of requests per day

## 💎 Key Advantages

### Rich Middleware Ecosystem
Thousands of middleware packages available for authentication, validation, logging, security, and more.

### HTTP Utility Methods
Simplified HTTP response methods, content negotiation, and request parsing.

### Robust Routing
Advanced routing with parameters, wildcards, and regular expressions:

\`\`\`javascript
// Route parameters
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
});

// Query parameters
app.get('/search', (req, res) => {
  const query = req.query.q;
});

// Route handlers
app.route('/users')
  .get(getAllUsers)
  .post(createUser)
  .put(updateUser);
\`\`\`

### Error Handling
Built-in error handling with customizable error middleware.

### Static File Serving
Simple static file serving with \`express.static()\`.

Express.js remains the foundation for modern Node.js web development, providing the perfect balance of simplicity, flexibility, and power that has made it the de facto standard for building web APIs and applications.`,
    website: "https://expressjs.com",
    githubUrl: "https://github.com/expressjs/express",
    categorySlug: "api-development",
  },

  // UI Components
  {
    name: "shadcn/ui",
    slug: "shadcn-ui",
    description:
      "Beautifully designed components built with Radix UI and Tailwind CSS. Copy and paste into your apps.",
    content: `# Why shadcn/ui is State-of-the-Art

## 🎨 Copy-Paste Philosophy
shadcn/ui revolutionizes component libraries with a **copy-paste approach** - you own the code, not the dependency:

\`\`\`bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
\`\`\`

## 📍 Built on Industry Standards
- **Radix UI primitives** for accessibility and behavior
- **Tailwind CSS** for styling and customization
- **TypeScript first** with excellent type safety
- **React Server Components** compatible

## ✨ Design Excellence
- **Beautiful default styling** that works out of the box
- **Consistent design system** across all components
- **Dark mode support** built-in
- **Responsive design** principles
- **Animation and micro-interactions**

## 🔧 Developer Control
- **Full ownership** of component code
- **Easy customization** without ejecting
- **No bundle size bloat** - only include what you use
- **Framework agnostic** styling approach

## 🎆 Modern Features
- **Form validation** with React Hook Form and Zod
- **Data tables** with sorting and filtering
- **Command palette** and search components
- **Charts and data visualization**
- **Complex layouts** and navigation

shadcn/ui represents the evolution of component libraries - giving developers beautiful, accessible components while maintaining full control and customization capabilities.`,
    website: "https://ui.shadcn.com",
    githubUrl: "https://github.com/shadcn-ui/ui",
    categorySlug: "ui-components",
  },
  {
    name: "Mantine",
    slug: "mantine",
    description:
      "Full-featured React components library with dark theme support, forms, and hooks.",
    content: `# Why Mantine is State-of-the-Art

## 📦 Complete Ecosystem
Mantine provides a **comprehensive suite of packages** covering every aspect of modern React development:

\`\`\`typescript
import { Button, TextInput, Paper, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';

function ContactForm() {
  const form = useForm({
    initialValues: { email: '', name: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <Paper p="md">
      <form onSubmit={form.onSubmit(console.log)}>
        <TextInput
          label="Name"
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Email"
          {...form.getInputProps('email')}
        />
        <Group mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Paper>
  );
}
\`\`\`

## 🎨 Design System
- **Consistent theme system** with CSS-in-JS
- **Dark/light theme** support out of the box
- **Customizable color palettes** and spacing
- **Typography system** with font management
- **Responsive breakpoints** and utilities

## 🛠️ Developer Tools
- **Rich hooks collection** for common patterns
- **Form management** with validation
- **Date picker** with internationalization
- **Data tables** with advanced features
- **Charts and visualizations**

## ♾️ Accessibility First
- **WCAG compliant** components
- **Keyboard navigation** support
- **Screen reader** optimized
- **Focus management** and ARIA attributes

Mantine offers the most complete React component ecosystem with excellent developer experience and comprehensive feature coverage.`,
    website: "https://mantine.dev",
    githubUrl: "https://github.com/mantinedev/mantine",
    categorySlug: "ui-components",
  },
  {
    name: "Chakra UI",
    slug: "chakra-ui",
    description:
      "Modular and accessible component library that gives you building blocks to build React applications.",
    content: `# Why Chakra UI is State-of-the-Art

## 🧠 Modular Architecture
Chakra UI provides **modular building blocks** that compose beautifully together:

\`\`\`tsx
import { Box, Stack, Heading, Text, Button, useColorMode } from '@chakra-ui/react'

function FeatureCard({ title, description }) {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box
      p={6}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderRadius="lg"
      shadow="md"
    >
      <Stack spacing={4}>
        <Heading size="md">{title}</Heading>
        <Text color="gray.600">{description}</Text>
        <Button colorScheme="blue" onClick={toggleColorMode}>
          Toggle Theme
        </Button>
      </Stack>
    </Box>
  )
}
\`\`\`

## ♾️ Accessibility Champion
- **ARIA compliant** by default
- **Keyboard navigation** built-in
- **Screen reader** optimized
- **Focus management** system
- **Color contrast** compliance

## 🎨 Style Props System
- **CSS-in-JS** with emotion
- **Responsive props** with array/object syntax
- **Theme-aware** styling
- **Pseudo selectors** support
- **Style composition** patterns

## 🕹️ Design Tokens
- **Consistent spacing** scale
- **Color palettes** with semantic tokens
- **Typography** system
- **Border radius** and shadow scales
- **Breakpoint** management

## 🔌 Composability
- **Compound components** pattern
- **Render props** and hooks
- **Polymorphic components** with 'as' prop
- **Theme extensions** and customization

Chakra UI excels at providing accessible, composable components with an intuitive API that makes building complex UIs straightforward.`,
    website: "https://chakra-ui.com",
    githubUrl: "https://github.com/chakra-ui/chakra-ui",
    categorySlug: "ui-components",
  },

  // Testing
  {
    name: "Vitest",
    slug: "vitest",
    description:
      "Blazing fast unit test framework powered by Vite with Jest compatibility.",
    content: `# Why Vitest is State-of-the-Art

## ⚡ Blazing Fast Performance
Vitest leverages **Vite's lightning-fast compilation** and **native ESM** support for instant test execution:

\`\`\`typescript
// sum.ts
export function sum(a: number, b: number): number {
  return a + b
}

// sum.test.ts
import { describe, it, expect } from 'vitest'
import { sum } from './sum'

describe('sum', () => {
  it('should add two numbers correctly', () => {
    expect(sum(2, 3)).toBe(5)
  })

  it('should handle negative numbers', () => {
    expect(sum(-1, 1)).toBe(0)
  })
})
\`\`\`

## 🔄 Jest Compatibility
- **Jest API compatible** - easy migration
- **Snapshot testing** with inline snapshots
- **Mocking capabilities** with vi.mock()
- **Coverage reporting** with c8/istanbul
- **Watch mode** with smart re-runs

## 📊 Modern Features
- **TypeScript first** with native support
- **ESM modules** without transformation
- **UI mode** for interactive testing
- **Browser mode** for real browser testing
- **Workspace support** for monorepos

## 🔍 Developer Experience
- **Hot module replacement** in tests
- **Source maps** for accurate stack traces
- **Parallel execution** by default
- **Rich CLI** with filtering and reporting
- **IDE integration** with excellent debugging

## 🌐 Universal Testing
- **Node.js and browser** environments
- **Component testing** with @testing-library
- **End-to-end** testing capabilities
- **Visual regression** testing support

Vitest represents the future of JavaScript testing - combining the speed of modern tooling with the familiarity of Jest's proven API.`,
    website: "https://vitest.dev",
    githubUrl: "https://github.com/vitest-dev/vitest",
    categorySlug: "testing",
  },
  {
    name: "Playwright",
    slug: "playwright",
    description:
      "Fast and reliable end-to-end testing for modern web apps across all browsers.",
    content: `# Why Playwright is State-of-the-Art

## 🎭 Cross-Browser Excellence
Playwright provides **unified API for all browsers** - Chromium, Firefox, and Safari - with native automation:

\`\`\`typescript
import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/')
  await expect(page).toHaveTitle(/Playwright/)
})

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/')
  await page.getByRole('link', { name: 'Get started' }).click()
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible()
})
\`\`\`

## ⚡ Speed & Reliability
- **Auto-wait** for elements to be ready
- **Parallel execution** across browsers
- **Fast isolation** with browser contexts
- **Network interception** and mocking
- **Smart retry** mechanisms

## 📱 Modern Web Features
- **Mobile emulation** with device profiles
- **Geolocation and permissions** testing
- **Network conditions** simulation
- **File downloads** and uploads
- **WebSocket** and service worker support

## 📊 Rich Debugging
- **Trace viewer** for test debugging
- **Video recording** of test runs
- **Screenshots** on failure
- **Live debugging** with --debug flag
- **Inspector** for step-by-step execution

## 🛠️ Developer Tools
- **Codegen** for recording interactions
- **VS Code extension** with test runner
- **CI/CD integration** with reports
- **Docker support** for consistent environments

Playwright sets the standard for modern end-to-end testing with its comprehensive browser support, reliability features, and excellent developer experience.`,
    website: "https://playwright.dev",
    githubUrl: "https://github.com/microsoft/playwright",
    categorySlug: "testing",
  },
  {
    name: "Testing Library",
    slug: "testing-library",
    description:
      "Simple and complete testing utilities that encourage good testing practices.",
    content: `# Why Testing Library is State-of-the-Art

## 🎯 User-Centric Testing
Testing Library encourages **testing from the user's perspective**, focusing on behavior rather than implementation:

\`\`\`typescript
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import LoginForm from './LoginForm'

test('allows user to log in', async () => {
  const user = userEvent.setup()
  render(<LoginForm />)

  // Find elements the way users would
  const emailInput = screen.getByLabelText(/email/i)
  const passwordInput = screen.getByLabelText(/password/i)
  const submitButton = screen.getByRole('button', { name: /log in/i })

  // Interact like a real user
  await user.type(emailInput, 'user@example.com')
  await user.type(passwordInput, 'password123')
  await user.click(submitButton)

  // Assert on user-visible changes
  expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
})
\`\`\`

## 📝 Testing Philosophy
- **Query by accessibility** roles and labels
- **Avoid implementation details** like CSS classes or IDs
- **Test behavior** not internal state
- **Accessibility-first** approach to element selection
- **Realistic user interactions**

## 🌍 Framework Agnostic
- **React Testing Library** for React
- **Vue Testing Library** for Vue.js
- **Angular Testing Library** for Angular
- **Svelte Testing Library** for Svelte
- **Native Testing Library** for React Native

## 🛠️ Rich Query API
- **getByRole** for semantic elements
- **getByLabelText** for form controls
- **getByText** for visible content
- **getByTestId** as last resort
- **Async queries** for dynamic content

## ✨ Best Practices
- **Encourages accessible** markup
- **Prevents brittle tests** tied to implementation
- **Promotes maintainable** test suites
- **Guides better** component design

Testing Library revolutionizes frontend testing by shifting focus from technical implementation to user experience and accessibility.`,
    website: "https://testing-library.com",
    githubUrl: "https://github.com/testing-library",
    categorySlug: "testing",
  },

  // CSS Frameworks
  {
    name: "Tailwind CSS",
    slug: "tailwind-css",
    description:
      "Utility-first CSS framework packed with classes to build any design directly in your markup.",
    content: `# Why Tailwind CSS is State-of-the-Art

## 🛠️ Utility-First Revolution
Tailwind CSS pioneered the **utility-first approach**, providing low-level utility classes for building custom designs:

\`\`\`html
<!-- Traditional CSS -->
<div class="card">
  <h2 class="card-title">Hello World</h2>
  <p class="card-text">This is a card component.</p>
  <button class="btn btn-primary">Click me</button>
</div>

<!-- Tailwind CSS -->
<div class="bg-white rounded-lg shadow-md p-6 max-w-sm">
  <h2 class="text-xl font-bold text-gray-900 mb-2">Hello World</h2>
  <p class="text-gray-600 mb-4">This is a card component.</p>
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Click me
  </button>
</div>
\`\`\`

## 🎨 Design System Built-In
- **Consistent spacing** scale (0.25rem increments)
- **Color palettes** with 50-950 shades
- **Typography** system with font weights and sizes
- **Responsive breakpoints** with mobile-first approach
- **Dark mode** support with class strategy

## ⚡ Performance Optimized
- **PurgeCSS integration** removes unused styles
- **Minimal runtime** - no JavaScript required
- **Tree-shaking** friendly
- **CDN friendly** with pre-built CSS
- **Small bundle size** in production

## 🔧 Developer Experience
- **IntelliSense** support in VS Code
- **JIT compilation** for instant builds
- **Arbitrary values** for one-off designs
- **Plugin ecosystem** for extending functionality
- **Excellent documentation** and examples

## 🌐 Ecosystem
- **Tailwind UI** for premium components
- **Headless UI** for unstyled components
- **Tailwind Play** for online prototyping
- **Community plugins** for specialized needs

Tailwind CSS transforms how developers think about CSS, providing a systematic approach to styling that scales from prototypes to production applications.`,
    website: "https://tailwindcss.com",
    githubUrl: "https://github.com/tailwindlabs/tailwindcss",
    categorySlug: "css-frameworks",
  },
  {
    name: "Styled Components",
    slug: "styled-components",
    description:
      "CSS-in-JS library that lets you use component-level styles with dynamic props support.",
    content: `# Why Styled Components is State-of-the-Art

## 💥 CSS-in-JS Pioneer
Styled Components introduced the concept of **CSS-in-JS** with template literals, bringing styles closer to components:

\`\`\`typescript
import styled from 'styled-components'

interface ButtonProps {
  primary?: boolean
  size?: 'small' | 'medium' | 'large'
}

const Button = styled.button<ButtonProps>\`
  background: \${props => props.primary ? '#007bff' : 'transparent'};
  color: \${props => props.primary ? 'white' : '#007bff'};
  border: 2px solid #007bff;
  border-radius: 4px;
  padding: \${props => {
    switch (props.size) {
      case 'small': return '0.25rem 0.5rem'
      case 'large': return '0.75rem 1.5rem'
      default: return '0.5rem 1rem'
    }
  }};

  &:hover {
    background: #007bff;
    color: white;
  }
\`

// Usage
<Button primary size="large">Click me</Button>
\`\`\`

## 🎨 Dynamic Styling
- **Props-based styles** for conditional styling
- **Theme provider** for consistent design systems
- **Runtime style generation**
- **Pseudo-classes and media queries**
- **Animation support** with keyframes

## 🔍 Component Composition
- **Styled system** integration
- **Component inheritance** with styled()
- **Polymorphic components** with 'as' prop
- **CSS helper functions**
- **Global styles** and CSS reset

## ⚡ Performance Features
- **Automatic vendor prefixing**
- **Dead code elimination**
- **Critical CSS** extraction
- **Server-side rendering** support
- **Concurrent React** compatibility

## 🛠️ Developer Tools
- **Babel plugin** for better debugging
- **CSS syntax highlighting** in template literals
- **TypeScript support** with proper typings
- **React DevTools** integration
- **Source maps** for debugging

Styled Components established the CSS-in-JS paradigm, providing a powerful way to create maintainable, theme-able, and dynamic component styles.`,
    website: "https://styled-components.com",
    githubUrl: "https://github.com/styled-components/styled-components",
    categorySlug: "css-frameworks",
  },

  // Build Tools
  {
    name: "Vite",
    slug: "vite",
    description:
      "Next generation frontend tooling with instant server start and lightning fast HMR.",
    content: `# Why Vite is State-of-the-Art

## ⚡ Lightning Fast Development
Vite leverages **native ES modules** and **esbuild** for instant server start and blazing fast HMR:

\`\`\`typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    sourcemap: true
  }
})
\`\`\`

## 🛠️ Modern Architecture
- **Native ESM** during development
- **No bundling** in dev mode
- **esbuild preprocessing** for speed
- **Rollup** for optimized production builds
- **Tree-shaking** and code splitting

## 🔧 Rich Plugin Ecosystem
- **Framework plugins** (React, Vue, Svelte, Solid)
- **TypeScript** support out of the box
- **CSS preprocessors** (Sass, Less, Stylus)
- **PostCSS** integration
- **Asset handling** and optimization

## 🌐 Universal Support
- **Multi-framework** compatibility
- **Library mode** for building packages
- **SSR** and static site generation
- **Web Workers** and Service Workers
- **WebAssembly** support

## ⚡ Performance Features
- **Instant server start** regardless of project size
- **Fast HMR** that stays fast as project grows
- **Optimized dependency pre-bundling**
- **Efficient caching** strategies
- **Smart asset optimization**

## 📊 Developer Experience
- **Rich error overlay** with stack traces
- **Built-in TypeScript** support
- **CSS modules** and scoped styles
- **Environment variables** handling
- **Proxy** and middleware support

Vite represents the future of frontend tooling, providing instant feedback during development while maintaining excellent production build optimization.`,
    website: "https://vitejs.dev",
    githubUrl: "https://github.com/vitejs/vite",
    categorySlug: "build-tools",
  },
  {
    name: "Turbopack",
    slug: "turbopack",
    description:
      "Incremental bundler optimized for JavaScript and TypeScript, written in Rust.",
    content: `# Why Turbopack is State-of-the-Art

## 🦀 Rust-Powered Performance
Turbopack is built in **Rust** for maximum performance, delivering **10x faster** builds than traditional bundlers:

\`\`\`json
// next.config.js
module.exports = {
  experimental: {
    turbo: {
      loaders: {
        '.svg': ['@svgr/webpack'],
      },
    },
  },
}
\`\`\`

## 🔄 Incremental Architecture
- **Function-level caching** with persistent cache
- **Incremental compilation** - only rebuild what changed
- **Parallel processing** across multiple cores
- **Memory efficient** with smart garbage collection
- **Hot reload** without full rebuilds

## 📊 Smart Optimizations
- **Tree shaking** at the function level
- **Code splitting** with automatic chunking
- **Asset optimization** and compression
- **Dead code elimination**
- **Bundle analysis** and size optimization

## 🌐 Modern Web Standards
- **ES modules** native support
- **TypeScript** compilation
- **CSS modules** and PostCSS
- **WebAssembly** integration
- **Source maps** for debugging

## 🚀 Next.js Integration
- **Built-in** with Next.js 13+
- **Zero configuration** for most use cases
- **Middleware** and API routes support
- **Static generation** optimization
- **Edge runtime** compatibility

## 🔍 Developer Experience
- **Fast startup** times
- **Rich error messages** with context
- **Progress indicators** and build stats
- **Watch mode** with intelligent rebuilds
- **Plugin system** for extensibility

Turbopack represents the next generation of bundlers, leveraging systems programming languages for unprecedented build performance while maintaining excellent developer experience.`,
    website: "https://turbo.build/pack",
    githubUrl: "https://github.com/vercel/turbo",
    categorySlug: "build-tools",
  },
];

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.implementation.deleteMany();
  await prisma.category.deleteMany();

  console.log("🧹 Cleaned existing data");

  // Create categories
  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: category,
      })
    )
  );

  console.log(`✅ Created ${createdCategories.length} categories`);

  // Create implementations
  const createdImplementations = await Promise.all(
    implementations.map(async (impl) => {
      const category = createdCategories.find(
        (cat) => cat.slug === impl.categorySlug
      );
      if (!category) {
        throw new Error(`Category not found: ${impl.categorySlug}`);
      }

      const { categorySlug: _, ...implementationData } = impl;
      return prisma.implementation.create({
        data: {
          ...implementationData,
          categoryId: category.id,
          userId: "seed_user", // Default user for seeded data
        },
      });
    })
  );

  console.log(`✅ Created ${createdImplementations.length} implementations`);

  // Create some sample votes
  const sampleUserIds = [
    "user_sample_1",
    "user_sample_2",
    "user_sample_3",
    "user_sample_4",
    "user_sample_5",
  ];

  const votes = [];
  for (const implementation of createdImplementations) {
    // Random number of votes per implementation (0-4)
    const voteCount = Math.floor(Math.random() * 5);
    const shuffledUsers = [...sampleUserIds].sort(() => Math.random() - 0.5);

    for (let i = 0; i < voteCount; i++) {
      votes.push({
        userId: shuffledUsers[i],
        implementationId: implementation.id,
        type: Math.random() > 0.2 ? VoteType.UP : VoteType.DOWN, // 80% upvotes, 20% downvotes
      });
    }
  }

  if (votes.length > 0) {
    await prisma.vote.createMany({
      data: votes,
    });
    console.log(`✅ Created ${votes.length} sample votes`);
  }

  // Create some sample comments
  const commentsData = [
    {
      content:
        "This is absolutely the best authentication solution I've used. The developer experience is incredible!",
      userId: "user_sample_1",
      implementationId: createdImplementations.find(
        (i) => i.slug === "nextauth-js"
      )?.id,
    },
    {
      content:
        "Prisma has completely changed how I think about database interactions. The type safety is amazing.",
      userId: "user_sample_2",
      implementationId: createdImplementations.find((i) => i.slug === "prisma")
        ?.id,
    },
    {
      content:
        "TanStack Query makes managing server state so much easier. The caching is brilliant.",
      userId: "user_sample_3",
      implementationId: createdImplementations.find(
        (i) => i.slug === "tanstack-query"
      )?.id,
    },
    {
      content:
        "shadcn/ui components are beautifully designed and so easy to customize. Love the copy-paste approach!",
      userId: "user_sample_4",
      implementationId: createdImplementations.find(
        (i) => i.slug === "shadcn-ui"
      )?.id,
    },
    {
      content:
        "Tailwind CSS has revolutionized my CSS workflow. Utility-first is the way to go.",
      userId: "user_sample_5",
      implementationId: createdImplementations.find(
        (i) => i.slug === "tailwind-css"
      )?.id,
    },
  ];

  const comments = commentsData.filter(
    (comment) => comment.implementationId !== undefined
  ) as Array<{
    content: string;
    userId: string;
    implementationId: string;
  }>;

  if (comments.length > 0) {
    await prisma.comment.createMany({
      data: comments,
    });
    console.log(`✅ Created ${comments.length} sample comments`);
  }

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
