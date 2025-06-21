import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
  Link,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getEnv, getPublicEnv } from "~/lib/environment.server";
import { LayoutClient } from "~/components/custom/layout-client";
import { AuthProvider } from "~/components/auth/auth-provider";
import { getCurrentUser } from "~/lib/auth.server";
import type { User } from "@suhaibinator/sunnah-v3-ts-proto/lib/api";
import { getThemeWithDefault, setTheme, type Theme } from "~/lib/theme.server";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Make the environment variables, user data, and theme available to the client
export async function loader({ request }: LoaderFunctionArgs) {
  // Get current user if authenticated
  const user = await getCurrentUser(request);
  
  // Get theme preference
  const theme = await getThemeWithDefault(request);
  
  // Only expose public env vars to the client
  return json({
    ENV: getPublicEnv(),
    user,
    theme,
  });
}

// Handle theme changes
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const theme = formData.get("theme");
  
  if (theme === "light" || theme === "dark") {
    return json(
      { theme },
      { 
        headers: { 
          "Set-Cookie": await setTheme(theme) 
        } 
      }
    );
  }
  
  return json({ theme: null });
}

export const meta: MetaFunction = () => {
  return [
    { title: "Sunnah.com - Sayings and Teachings of Prophet Muhammad (صلى الله عليه و سلم)" },
    { name: "description", content: "Hadith of the Prophet Muhammad (صلى الله عليه و سلم) in several languages" },
  ];
};

interface LayoutProps {
  children: React.ReactNode;
  theme?: Theme;
}

export function Layout({ children, theme = "light" }: LayoutProps) {
  // Try to get theme from loader data, but don't fail if not available (e.g., in error boundary)
  try {
    const data = useLoaderData<typeof loader>();
    theme = data?.theme || theme;
  } catch {
    // If useLoaderData fails (e.g., in error boundary), use default theme
  }
  
  return (
    <html lang="en" className={`${theme} h-full scroll-smooth antialiased`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <AuthProvider initialUser={data.user}>
      <LayoutClient theme={data.theme}>
        <Outlet />
        {/* Add environment variables to window object */}
        {data?.ENV && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
            }}
          />
        )}
      </LayoutClient>
    </AuthProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    // Special handling for 404 errors with the beautiful design from NextJS
    if (error.status === 404) {
      return (
        <Layout>
          <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
            <div className="flex flex-col items-center justify-center space-y-6">
              <h1 className="text-6xl md:text-8xl font-bold text-primary">404</h1>

              <h2 className="text-3xl md:text-4xl font-bold">Page Not Found</h2>

              <div className="w-24 h-1 bg-primary mx-auto my-4"></div>

              <p className="text-xl text-muted-foreground max-w-lg">
                The page you are looking for does not exist or has been moved.
              </p>

              <div className="bg-muted p-6 rounded-lg my-8 max-w-2xl">
                <blockquote className="italic text-lg">
                  &ldquo;Verily, with hardship comes ease.&rdquo;
                  <footer className="text-right mt-2 text-muted-foreground">
                    — Quran 94:6
                  </footer>
                </blockquote>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                  to="/"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Return to Home
                </Link>

                <Link
                  to="/collections"
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Browse Collections
                </Link>
              </div>

              <div className="mt-12 text-muted-foreground">
                <p>
                  If you believe this is an error, please check the URL or try again later.
                </p>
              </div>
            </div>
          </div>
        </Layout>
      );
    }

    // For other HTTP errors
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {error.status} {error.statusText}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              An error occurred.
            </p>
            <Link
              to="/"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            An unexpected error occurred. Please try again later.
          </p>
          <Link
            to="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
