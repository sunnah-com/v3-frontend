# Build stage
FROM node:23.11-alpine3.20 AS builder

# Set working directory
WORKDIR /app

# Accept build arguments
ARG NODE_ENV=production
ARG INTERNAL_API_URL # Build-time internal URL (e.g., http://192.168.2.11:9976)
ARG NEXT_PUBLIC_API_URL # Public API URL

# Set environment variables for build time
# These are used by `npm run build` and api-client.ts during build
ENV NODE_ENV=${NODE_ENV}
ENV INTERNAL_API_URL=${INTERNAL_API_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
# The environment variables will be loaded from the appropriate .env file based on NODE_ENV
RUN npm run build

# Production stage
FROM node:23.11-alpine3.20 AS runner

# Set working directory
WORKDIR /app

# Set runtime environment variables for the final container
# NODE_ENV is always 'production' for the running container to ensure optimizations
ENV NODE_ENV=production
# NEXT_PUBLIC_API_URL is used for client-side requests from the browser
ENV NEXT_PUBLIC_API_URL=https://api.sunnah.dev
# INTERNAL_API_URL for server-side requests within the running container (e.g., API routes, dynamic rendering)
# Should point to the internal service name or address reachable from the container
ENV INTERNAL_API_URL=http://sunnahcomnew-be:8080

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.env.production ./
COPY --from=builder /app/scripts-dist ./scripts-dist

# Set proper ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

# Set the command to run the application
CMD ["sh", "-c", "node scripts-dist/preload-static-data.js && node server.js"]
