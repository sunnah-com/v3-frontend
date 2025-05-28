# Sunnah.com - Remix Frontend

A modern, performant frontend for Sunnah.com built with Remix, featuring server-side rendering, authentication, and a clean user interface.

- 📖 [Remix docs](https://remix.run/docs)
- 🔐 [Authentication Migration Guide](./AUTH-MIGRATION.md)

## Features

- **Server-side rendering** with Remix
- **Authentication system** with secure session management
- **Progressive enhancement** - works without JavaScript
- **Type-safe** throughout with TypeScript
- **Modern UI** with Tailwind CSS and Radix UI components
- **Protobuf integration** for efficient API communication

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Session secret for encrypting cookies (required for auth)
# Generate a secure random string for production
SESSION_SECRET=your-super-secret-session-key-change-in-production

# API Configuration
NEXT_PUBLIC_API_URL=https://api.sunnah.dev
INTERNAL_API_URL=http://backend:8080

# Optional: For development
NODE_ENV=development
```

## Development

Install dependencies:

```shellscript
npm install
```

Run the dev server:

```shellscript
npm run dev
```

## Authentication

The app includes a complete authentication system with:

- **Server-side sessions** using HTTP-only cookies
- **Login/logout** functionality
- **Protected routes** and components
- **User context** available throughout the app

### Usage Examples

```tsx
// Using auth in components
import { useAuth } from '~/components/auth/auth-provider';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user?.email}!</div>;
}

// Protecting routes
import { requireAuth } from '~/lib/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const authSession = await requireAuth(request);
  // User is authenticated, proceed with loading data
  return json({ user: authSession.user });
}
```

See [AUTH-MIGRATION.md](./AUTH-MIGRATION.md) for complete documentation.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

### Build with Data Preloading

For better performance, you can preload critical data during build:

```sh
npm run build:with-cache
```

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
