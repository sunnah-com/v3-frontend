import type { ENV } from "./environment.server";

declare global {
  interface Window {
    ENV: ENV;
  }
} 