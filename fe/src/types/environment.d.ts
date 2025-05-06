// Define custom environment variables used in the project
declare namespace NodeJS {
  interface ProcessEnv {
    // NODE_ENV is handled by Next.js ('development', 'production', 'test')

    // Publicly exposed API URL (used client-side)
    NEXT_PUBLIC_API_URL?: string;

    // Internal API URL (used server-side during build/runtime)
    // Note: This is now determined dynamically in api-client.ts based on APP_ENV,
    // but defining it here helps with type safety if it were ever set directly.
    INTERNAL_API_URL?: string;

    // Add other environment variables used in the project here if needed
  }
}
