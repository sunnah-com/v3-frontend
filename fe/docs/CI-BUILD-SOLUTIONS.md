# CI Build Solutions for Next.js ISR without Backend

## Problem Summary

The Next.js frontend uses Incremental Static Regeneration (ISR) and makes API calls during the build process to pre-render pages. This creates a circular dependency:
- Frontend needs backend API during build
- Backend might not be available in CI environment
- Docker images need different API URLs for build vs runtime

## Solutions

### Solution 1: Safe ISR with Fallbacks (Implemented ✓)

**Implementation**: The `isr-data.ts` file now includes try-catch blocks that return empty data when the backend is unavailable during build.

This solution wraps all API calls with error handling that returns empty/default data when the backend is unavailable during build.

**Pros**:
- No changes to CI/CD pipeline needed
- Build succeeds without backend
- Pages still get pre-rendered (with empty data)
- Real data loads on first request after deployment

**Cons**:
- Initial page loads might be slower (no pre-cached data)
- SEO impact for initial crawl

**Current Implementation**:
```typescript
// In src/lib/isr-data.ts
export const getCollectionsWithISR = unstable_cache(
  async (language: Language): Promise<GetAllCollectionsResponse> => {
    try {
      return await businessApi.getAllCollections(language);
    } catch (error) {
      console.warn(`ISR: Failed to fetch collections, returning empty response`, error);
      return { collections: [] } as GetAllCollectionsResponse;
    }
  },
  ['collections'],
  { revalidate: REVALIDATE_TIME, tags: ['collections'] }
);
```

**Usage**:
```bash
# Build normally in CI - no changes needed
docker build -f Dockerfile -t frontend:latest .
```

### Solution 2: Skip Static Generation in CI

**Implementation**: Use `Dockerfile.ci` with `SKIP_BUILD_STATIC_GENERATION=true`

This completely skips pre-rendering during CI builds.

**Pros**:
- Fastest CI builds
- No backend dependency
- Simple to implement

**Cons**:
- All pages rendered on-demand
- Higher initial load times
- More server resources needed

**Usage**:
```bash
# Use the CI-specific Dockerfile
docker build -f Dockerfile.ci -t frontend:latest .

# Or with regular Dockerfile:
docker build \
  --build-arg SKIP_BUILD_STATIC_GENERATION=true \
  --build-arg INTERNAL_API_URL=http://dummy \
  -f Dockerfile -t frontend:latest .
```

### Solution 3: Pre-build Data Cache

**Implementation**: Use `npm run build:ci` with prebuild cache script

This fetches and caches data before the Next.js build starts.

**Pros**:
- Can work with or without backend
- Allows custom data injection
- Good for staging environments

**Cons**:
- More complex setup
- Requires maintaining cache scripts

**Usage**:
```bash
# In CI pipeline
npm run build:ci

# Or in Dockerfile
RUN npm run build:ci
```

### Solution 4: Runtime-only Data Fetching

**Implementation**: Use Route Handlers (`/api/static-data`)

Move all static data fetching to API routes that are called at runtime.

**Pros**:
- Complete separation of build and runtime
- Easy to cache at CDN level
- No build dependencies

**Cons**:
- Requires refactoring components
- Additional network requests
- More complex client-side logic

## Recommendations

For immediate CI/CD unblocking:
1. Use **Solution 1** (Safe ISR) - minimal changes, production-ready
2. Update imports in layout.tsx and page.tsx to use `isr-data-safe.ts`
3. Keep existing Dockerfile unchanged

For long-term architecture:
1. Consider **Solution 4** for better separation of concerns
2. Implement proper caching strategy at CDN level
3. Use ISR only for truly static content

## Environment Variables

Ensure these are set correctly:

**Build time** (CI):
- `NEXT_PUBLIC_API_URL`: Public API URL (e.g., https://api.sunnah.dev)
- `INTERNAL_API_URL`: Can be omitted with Solution 1, or set to dummy value

**Runtime** (Container):
- `NEXT_PUBLIC_API_URL`: Public API URL
- `INTERNAL_API_URL`: Internal service URL (e.g., http://backend:8080)

## Current Status

✅ **Solution 1 has been implemented** directly in the main `isr-data.ts` file. All ISR functions now include error handling that returns empty data when the backend is unavailable.

The CI/CD pipeline can now build the frontend without requiring backend connectivity. No additional changes are needed.

## Additional Updates

### Sidebar Navigation
A new sidebar navigation system has been implemented for the collections pages:
- **Component**: `src/components/hadith-sidebar.tsx`
- **Layout**: `src/app/collections/layout.tsx`
- Features sticky trigger button, responsive design, and collection navigation

### Import Path Fixes
All `@/` import aliases have been updated to use `fe/` prefix to match the project's TypeScript configuration.