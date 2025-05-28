/**
 * Server-side environment variables
 * This pattern ensures proper server-side only access to env vars
 */
export function getEnv() {
  // In the original Next.js project, API_URL is http://localhost:8080
  // Make sure to use the same URL here
  return {
    API_URL: process.env.API_URL || "http://localhost:8080",
  };
}

// Type for environment shape to use in client code
export type ENV = ReturnType<typeof getEnv>;

// Expose validated environment variables to the client
// (only those that are meant to be public)
export function getPublicEnv() {
  const env = getEnv();
  return {
    API_URL: env.API_URL
  };
} 