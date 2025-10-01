# Next.js Development Guide

## Project Overview

This comprehensive guide outlines best practices, conventions, and standards for development with modern web technologies including ReactJS, NextJS, TypeScript, JavaScript, HTML, CSS, and UI frameworks. The guide emphasizes clean, maintainable, and scalable code following SOLID principles and functional programming patterns.

## Tech Stack

- **Frontend Framework**: Next.js 15+ with App Router
- **UI Library**: React 19+ with TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4, Shadcn UI, Radix UI
- **Form Handling**: React Hook Form + Zod validation
- **Data Sanitization**: DOMPurify
- **Internationalization**: next-intl
- **Testing**: Vitest, React Testing Library, Playwright
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## Development Guidelines

### Development Philosophy

- Write clean, maintainable, and scalable code
- Follow SOLID principles
- Prefer functional and declarative programming patterns over imperative
- Emphasize type safety and static analysis
- Practice component-driven development

### Code Implementation Guidelines

#### Planning Phase

- Begin with step-by-step planning
- Write detailed pseudocode before implementation
- Document component architecture and data flow
- Consider edge cases and error scenarios

#### Code Style Standards

- Use tabs for indentation (2 spaces per tab)
- Use single quotes for strings (except to avoid escaping)
- Omit semicolons (unless required for disambiguation)
- Eliminate unused variables
- Add space after keywords
- Add space before function declaration parentheses
- Always use strict equality === instead of loose equality ==
- Space infix operators
- Add space after commas
- Keep else statements on the same line as closing curly braces
- Use curly braces for multi-line if statements
- Always handle error parameters in callbacks
- Limit line length to 80 characters
- Use trailing commas in multiline object/array literals
- Absolute Imports using `@` prefix

### Naming Conventions

#### General Rules

- **PascalCase for**: Components, Type definitions, Interfaces
- **kebab-case for**: Directory names (e.g., components/auth-wizard), File names (e.g., user-profile.tsx)
- **camelCase for**: Variables, Functions, Methods, Hooks, Properties, Props
- **UPPERCASE for**: Environment variables, Constants, Global configurations

#### Specific Naming Patterns

- Prefix event handlers with 'handle': `handleClick`, `handleSubmit`
- Prefix boolean variables with verbs: `isLoading`, `hasError`, `canSubmit`
- Prefix custom hooks with 'use': `useAuth`, `useForm`
- Use complete words over abbreviations except for:
  - err (error)
  - req (request)
  - res (response)
  - props (properties)
  - ref (reference)

## Environment Setup

### Development Requirements

- Node.js >= 22.16.0
- npm >= 10.9.0
- TypeScript >= 5.9.2

### Environment Variables Configuration

```env
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Core Feature Implementation

### React Component Best Practices

#### Component Architecture

- Use functional components with TypeScript interfaces
- Define components using the function keyword
- Extract reusable logic into custom hooks
- Implement proper component composition
- Use React.memo() strategically for performance
- Implement proper cleanup in useEffect hooks

```tsx
// Example: User Profile Component
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isFetching, startFetching] = useTransition();

  useEffect(() => {

    startFetching(async () => {
      const fetchedUser = await fetchUserById(userId);
      setUser(fetchedUser);
      onUpdate?.(fetchedUser);
    });
  }, [userId]);

  if (isFetching) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

#### React Performance Optimization

- Use useCallback for memoizing callback functions
- Implement useMemo for expensive computations
- Avoid inline function definitions in JSX
- Implement code splitting using dynamic imports
- Implement proper key props in lists (avoid using index as key)
- Use useTransition for non-urgent state updates
- Use useOptimistic for optimistic UI updates

```tsx
import { memo, useMemo, useCallback } from "react";

interface UserListProps {
  users: User[];
  onUserSelect: (userId: string) => void;
}

export const UserList = memo(({ users, onUserSelect }: UserListProps) => {
  const sortedUsers = useMemo(() => {
    return users.sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  const handleUserClick = useCallback(
    (userId: string) => {
      onUserSelect(userId);
    },
    [onUserSelect]
  );

  return (
    <div className="user-list">
      {sortedUsers.map((user) => (
        <div
          key={user.id}
          onClick={() => handleUserClick(user.id)}
          className="user-item"
        >
          {user.name}
        </div>
      ))}
    </div>
  );
});
```

### Next.js Best Practices

#### Core Concepts

- Utilize App Router for routing
- Implement proper metadata management
- Use proper caching strategies
- Implement proper error boundaries

#### Components and Features

- Use Next.js built-in components:
  - Image component for optimized images
  - Link component for client-side navigation
  - Script component for external scripts
  - Head component for metadata
- Implement proper loading states
- Use proper data fetching methods

#### Server Components

- Default to Server Components
- Use URL query parameters for data fetching and server state management
- Use 'use client' directive only when necessary:
  - Event listeners
  - Browser APIs
  - State management
  - Client-side-only libraries

```tsx
// Example: Server Component with data fetching
interface PostsPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { page, category } = await searchParams;
  const currentPage = Number(page) || 1;
  const currentCategory = category || "all";

  const posts = await fetchPosts({ page, category });

  return (
    <div className="posts-page">
      <h1>Posts</h1>
      <PostsList posts={posts} />
      <Pagination currentPage={page} />
    </div>
  );
}
```

### Reusable Components

- The project promotes modular and scalable UI development through a clear separation of reusable component layers:

  - `src/components/ui`: Low-level, atomic UI components (e.g., buttons, inputs, modals)
  - `src/components/templates`: Higher-level layout components (e.g., headers, footers, dashboards)
  - `src/components/shared`: Shared components used across multiple features (e.g., user avatar, notifications)
  - `src/components/[feature-name]`: Feature-specific components encapsulated within their own directories
  - `src/components/[feature-name]/shared`: Shared components specific to a feature

- Reuse components across features to promote consistency and reduce duplication.
- Shared components must be pure components with clear documentation and usage examples.
- Review the documentation in `src/docs/components/` to determine whether an existing shared component fits your needs or can be adjusted before creating a new one.

#### Server Actions & API Calls
- Use server actions for form submissions, data fetching, and data mutations.
- Store actions in `src/actions/` directory.
- Api calls should be made using `src/lib/http-client.ts` to ensure consistent error handling and logging.

```tsx
// Example: Server Action for login

// src/actions/auth-action.ts
'use server'

import { Logger } from '@/lib/logger';
import { httpClient } from '@/lib/http-client';

const authLogger = Logger.create('AuthAction');

export async function updateProfile(data: FormData) {
  try {
    const headers = await getAuthHeaders();
    const response = await httpClient.put('/api/v1/auth/profile', data, { headers });

    if (response.success && response.data) {
      return { success: true, message: 'Profile updated successfully' };
    }

    return { success: false, message: 'Failed to update profile' };
  } catch (error: any) {
    authLogger.error('Error updating profile', error);
    return { success: false, message: error.message || 'Failed to update profile' };
  }
}

// src/components/profile-form.tsx
'use client';

import { updateProfile } from './actions';

export default function ProfileForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      full_name: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ProfileFormData) => {
    startTransition(async () => {
      const result = await updateProfile(data);

      if (result.success) {
        // Reset with current values to clear dirty state
        form.reset({ full_name: data.full_name });
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    ...
  )
}
```

### TypeScript Implementation

- Enable strict mode
- Define clear interfaces for component props, state
- Use type guards to handle potential undefined or null values safely
- Apply generics to functions where type flexibility is needed
- Utilize TypeScript utility types (Partial, Pick, Omit) for cleaner and reusable code
- Prefer interface over type for defining object structures, especially when extending
- Use mapped types for creating variations of existing types dynamically

```tsx
// Example: TypeScript interfaces and types
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

type UserCreateInput = Omit<User, "id" | "createdAt" | "updatedAt">;
type UserUpdateInput = Partial<Pick<User, "name" | "email" | "role">>;

// Type guard example
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "email" in obj
  );
}
```

## State Management

### Local State

- Use useState for component-level state
- Use useContext for shared state
- Implement proper state initialization

## UI and Styling

### Component Libraries

- UI is composed from Shadcn/Radix primitives in `src/components/ui`
- Apply composition patterns to create modular, reusable components
- Compose UI using existing Shadcn components; extend variants with `class-variance-authority` patterns (`src/components/ui/button.tsx`).

### Styling Guidelines

- Use Tailwind CSS for utility-first, maintainable styling
- Design with mobile-first, responsive principles for flexibility across devices
- Implement dark mode using CSS variables or Tailwind's dark mode features
- Ensure color contrast ratios meet accessibility standards for readability
- Respect Tailwind token strategy: define new tokens in `src/styles/globals.css` and document in `src/styles/DESIGN_SYSTEM.md` to support easy theming and maintainability.
- Maintain consistent spacing values to establish visual harmony
- Use the `cn` utility for conditional class names and combining Tailwind classes

```tsx
// Example: Styled component with Tailwind and dark mode
import type { VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive`,
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'>
  & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

### Layout Structure

ALWAYS design mobile-first, then potentially enhance for larger screens. Every layout decision must prioritize mobile usability.

**Required Layout Approach:**

1. Start with mobile (320px) design first
2. Add tablet breakpoints (768px) second
3. Add desktop (1024px+) enhancements last
4. NEVER design desktop-first and scale down


**Layout Implementation Rules:**
DO: Use generous whitespace - minimum 16px (space-4) between sections
DO: Group related elements within 8px (space-2) of each other
DO: Align elements consistently (left, center, or right - pick one per section)
DO: Use consistent max-widths: `max-w-sm`, `max-w-md`, `max-w-lg`, `max-w-xl`
DON'T: Cram elements together without breathing room
DON'T: Mix left and right alignment within the same section

### Tailwind Implementation

Use these specific Tailwind patterns. Follow this hierarchy for layout decisions.

**Layout Method Priority (use in this order):**

1. Flexbox for most layouts: `flex items-center justify-between`
2. CSS Grid only for complex 2D layouts: e.g. `grid grid-cols-3 gap-4`
3. NEVER use floats or absolute positioning unless absolutely necessary


**Required Tailwind Patterns:**
DO: Use gap utilities for spacing: `gap-4`, `gap-x-2`, `gap-y-6`
DO: Prefer gap-* over space-* utilities for spacing
DO: Use semantic Tailwind classes: `items-center`, `justify-between`, `text-center`
DO: Use responsive prefixes: `md:grid-cols-2`, `lg:text-xl`
DO: Use both fonts via the `font-sans`, `font-serif` and `font-mono` classes in your code
DON'T: Mix margin/padding with gap utilities on the same element
DON'T: Use arbitrary values unless absolutely necessary: avoid `w-[347px]`
DON'T: Use `!important` or arbitrary properties

## Error Handling and Validation

### Form Validation

- Use Zod for schema validation
- Implement proper error messages
- Use proper form libraries (e.g., React Hook Form)

```tsx
// Example: Form validation with Zod and React Hook Form

// src/entities/user.ts

import z from 'zod';

export const createLoginFormSchema = (t: TFunction) => z.object({
  email: z.email(t('errors.email', { label: t('login.email') })),
  password: z.string().min(1, t('errors.required', { label: t('login.password') })),
});

export type LoginFormData = z.infer<ReturnType<typeof createLoginFormSchema>>;

// src/components/login-form.tsx
'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import type { LoginFormData } from '@/entities/user';
import { login } from '@/actions/auth-action';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createLoginFormSchema } from '@/entities/user';

export default function LoginForm() {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [hidePassword, setHidePassword] = useState(true);
  const [serverMessage, setServerMessage] = useState<{ success: boolean; message: string } | null>(
    null,
  );

  const LoginFormSchema = createLoginFormSchema(t);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerMessage(null);

    startTransition(async () => {
      const result = await login(data);
      setServerMessage(result);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('login.email')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder={t('login.email_placeholder')}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('login.password')}</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    type={hidePassword ? 'password' : 'text'}
                    placeholder={t('login.password_placeholder')}
                    disabled={isPending}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setHidePassword(!hidePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                  disabled={isPending}
                >
                  {hidePassword
                    ? (
                        <EyeOff className="h-4 w-4" />
                      )
                    : (
                        <Eye className="h-4 w-4" />
                      )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-10 font-medium" disabled={isPending}>
          {isPending
            ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('login.signing_in')}
                </>
              )
            : (
                t('login.sign_in')
              )}
        </Button>
      </form>
    </Form>
  );
}
```

### Error Handling

- Implement route-level error boundaries using `error.tsx` files for recoverable UI failures and lean on `global-error.tsx` for app-wide fallbacks; capture exceptions with Sentry instrumentation as shown in `src/app/global-error.tsx`.
- Surface 404 states with the dedicated `not-found.tsx` pattern or the `notFound()` helper, and rely on `redirect()` for control-flow changes inside Server Components or actions instead of throwing general errors.
- Wrap Server Actions and server-side utilities in `try/catch` blocks, log with `Logger.create('<Context>')`, and return typed result objects so clients can render deterministic error messaging.
- Normalize API failures through the shared `HttpClient` (`src/lib/http-client.ts`) which raises `ApiError`; always map these to user-facing messages and fallbacks rather than exposing raw error payloads.
- Pair suspenseful UI states with graceful fallbacks (loading spinners, skeletons, retry affordances) and avoid leaving transitions pending indefinitely—show toast/inline feedback when retries are available.
- Guard middleware and edge handlers against unexpected input; short-circuit with `NextResponse.next()` or redirects instead of throwing to prevent cascading failures.
- Treat logging and monitoring as part of error handling: tag Sentry events with locale/user context when available and scrub any sensitive data before sending.


## Performance Optimization

### Frontend Optimization

- Code splitting with dynamic imports
- Lazy loading for non-critical components
- Caching strategies for API responses
- Image optimization with Next.js Image component

## Security Considerations

### Data Security

- Implement input sanitization to prevent XSS attacks
- Use DOMPurify for sanitizing HTML content
- Use proper authentication methods
- Validate all user inputs

```tsx
// Example: Input sanitization with DOMPurify
import DOMPurify from "dompurify";

interface SafeHtmlProps {
  html: string;
  className?: string;
}

export function SafeHtml({ html, className }: SafeHtmlProps) {
  const sanitizedHtml = DOMPurify.sanitize(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
```

### Authentication & Authorization

- Implement proper user authentication flow
- Use JWT tokens securely
- Implement role-based access control
- Secure API endpoints

## Accessibility (a11y)

### Core Requirements

- Use semantic HTML for meaningful structure
- Apply accurate ARIA attributes where needed
- Ensure full keyboard navigation support
- Manage focus order and visibility effectively
- Maintain accessible color contrast ratios
- Follow a logical heading hierarchy
- Make all interactive elements accessible
- Provide clear and accessible error feedback

## Internationalization (i18n)

### Implementation with next-intl

- Use next-intl for translations
- Implement proper locale detection
- Use proper number and date formatting
- Implement proper RTL support
- Use proper currency formatting
- Localization resources live under `public/locales/<locale>/`; keep namespace parity across languages.

```tsx
// Example: Using translations
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'common',
  });

  return {
    title: t('title'),
  };
}

export default function Index() {
  const t = useTranslations('common');

  return (
    <h1 className="text-3xl font-bold">{t('app_name')}</h1>
  );
}
```

### Localized Routing

- Use a top-level `[locale]` segment in the App Router to scope pages; export `generateStaticParams` and call `setRequestLocale` inside layout files so Next.js pre-builds locale variants.
- Source locale metadata with `next-intl` helpers (`getTranslations`, `useTranslations`) and keep namespace keys aligned with files in `public/locales/<lang>/`.
- Generate localized links with helpers such as `getI18nPath` (`src/lib/utils.ts`) or `createNavigation` exports; avoid hard-coding locale prefixes in components.
- Keep default-locale URLs clean by configuring `localePrefix: 'as-needed'` in `src/config/app-config.ts` and routing definitions.
- Place locale-sensitive metadata (titles, descriptions) in `generateMetadata` and use the resolved locale from `props.params` rather than relying on global state.
- Update middleware route matchers when adding protected or public sections so both `/[locale]/path` and default paths share the same auth and locale behavior.
- Co-locate i18n-aware server actions and loaders with their routes; return translated strings from the server when sending error or success messages to client components.

## Deployment Guide

### Build Process

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables for Production

```env
# Production environment variables
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Monitoring and Logging

### Application Monitoring

- Performance metrics tracking
- Error tracking with Sentry
- User behavior analytics
- Core Web Vitals monitoring

### Log Management

- Structured logging with appropriate log levels
- Use Logger utility from `src/lib/logger.ts` for consistent logging

```ts
import { Logger } from '@/lib/logger';
const logger = Logger.create('MyComponent');
logger.info('Informational message');
logger.warn('Warning message');
logger.error('Error message', errorObject);
```

## Common Issues

### Issue 1: Hydration Mismatch Errors

**Solution**:

- Ensure server and client render the same content
- Use `useEffect` for client-only code
- Use `dynamic` imports with `ssr: false` for client-only components
- Check for differences in date/time formatting between server and client

### Issue 2: Performance Issues with Large Lists

**Solution**:

- Implement virtualization for large datasets
- Use pagination or infinite scrolling
- Optimize re-renders with `React.memo` and `useMemo`
- Consider server-side filtering and sorting

### Issue 3: TypeScript Type Errors in Production Build

**Solution**:

- Enable strict mode in TypeScript configuration
- Fix all type errors before deployment
- Use proper type definitions for third-party libraries
- Implement proper error boundaries for runtime type issues

### Issue 4: SEO and Meta Tags Not Working

**Solution**:

- Use Next.js `Metadata` API in App Router
- Implement proper Open Graph tags
- Ensure meta tags are rendered server-side
- Test with social media debuggers

## Reference Resources

- [Next.js Official Documentation](https://nextjs.org/docs)
- [React Official Documentation](https://react.dev/)
- [TypeScript Official Documentation](https://www.typescriptlang.org/)
- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
