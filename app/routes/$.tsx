import { type LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  // Handle Chrome DevTools and other browser-specific requests
  if (url.pathname.includes('.well-known') || 
      url.pathname.includes('favicon.ico') || 
      url.pathname.includes('robots.txt') ||
      url.pathname.includes('manifest.json')) {
    throw new Response(null, { status: 404 });
  }
  
  // For all other unmatched routes, return 404
  throw new Response("Page not found", { status: 404 });
}

export default function SplatRoute() {
  return null;
} 