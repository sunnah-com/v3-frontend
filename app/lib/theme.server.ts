import { createCookie } from "@remix-run/node";

export type Theme = "light" | "dark";

// Create a cookie for storing theme preference
export const themeCookie = createCookie("theme", {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: false, // Allow client-side reading for progressive enhancement
});

/**
 * Get the theme from the request cookies
 */
export async function getTheme(request: Request): Promise<Theme | null> {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await themeCookie.parse(cookieHeader);
  
  if (cookie === "light" || cookie === "dark") {
    return cookie;
  }
  
  return null;
}

/**
 * Create a cookie header for setting the theme
 */
export async function setTheme(theme: Theme): Promise<string> {
  return themeCookie.serialize(theme);
}

/**
 * Get the theme or return a default
 */
export async function getThemeWithDefault(request: Request): Promise<Theme> {
  const theme = await getTheme(request);
  return theme || "light";
}