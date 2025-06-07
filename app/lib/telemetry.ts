import {
  getWebInstrumentations,
  initializeFaro,
  type Faro,
  type EventAttributes,
} from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

// Environment variables for configuration
const FARO_URL = process.env.NEXT_PUBLIC_API_URL + "/api/faro/collect";
const FARO_APP_NAME =
  process.env.NEXT_PUBLIC_FARO_APP_NAME || "sunnahcom-frontend";
const FARO_ENV = process.env.NODE_ENV || "development";

// Initialize Faro only on the client side
export function initTelemetry() {
  // Skip initialization during SSR
  if (typeof window === "undefined") {
    return;
  }

  // Initialize Faro with configuration
  const faro = initializeFaro({
    url: FARO_URL,
    app: {
      name: FARO_APP_NAME,
      version: "1.0.0",
      environment: FARO_ENV,
    },
    instrumentations: [
      // Default web instrumentations (errors, web vitals, etc.)
      ...getWebInstrumentations(),
      // Add tracing instrumentation to connect with backend traces
      new TracingInstrumentation(),
    ],
  });

  return faro;
}

// Declare the global Faro instance on the window object
declare global {
  interface Window {
    __FARO__?: Faro;
  }
}

// Define type for error context
type ErrorContext = Record<string, string | number | boolean | null>;

// Export a function to manually capture errors
export function captureError(error: Error, context?: ErrorContext) {
  if (typeof window !== "undefined" && window.__FARO__) {
    window.__FARO__.api.pushError(error, context);
  }
}

// Export a function to manually capture events
export function captureEvent(name: string, attributes?: EventAttributes) {
  if (typeof window !== "undefined" && window.__FARO__) {
    window.__FARO__.api.pushEvent(name, attributes);
  }
}
