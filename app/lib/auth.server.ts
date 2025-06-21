import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { Session } from "@remix-run/node";
import { userApi } from "./api-client";
import type { User } from "@suhaibinator/sunnah-v3-ts-proto/lib/api";

// Session storage configuration
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "auth_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET || "default-secret-change-in-production"],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  },
});

// Auth session interface
export interface AuthSession {
  token: string;
  user: User;
}

// Get session from request
export async function getSession(request: Request): Promise<Session> {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// Get auth data from session
export async function getAuthSession(request: Request): Promise<AuthSession | null> {
  const session = await getSession(request);
  const token = session.get("token");
  const user = session.get("user");
  
  if (!token || !user) {
    return null;
  }
  
  return { token, user };
}

// Get current user from session or fetch from API
export async function getCurrentUser(request: Request): Promise<User | null> {
  const authSession = await getAuthSession(request);
  
  if (!authSession) {
    return null;
  }
  
  // Optionally refresh user data from API
  try {
    const user = await userApi.getCurrentUser(null);
    
    // Update session with fresh user data
    const session = await getSession(request);
    session.set("user", user);
    
    return user;
  } catch (error) {
    console.error("Failed to refresh user data:", error);
    // Return cached user data if API call fails
    return authSession.user;
  }
}

// Create auth session
export async function createAuthSession(
  request: Request,
  token: string,
  user: User,
  redirectTo: string = "/"
) {
  const session = await getSession(request);
  session.set("token", token);
  session.set("user", user);
  
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// Destroy auth session
export async function destroyAuthSession(request: Request, redirectTo: string = "/") {
  const session = await getSession(request);
  
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

// Require authenticated user (throws redirect if not authenticated)
export async function requireAuth(request: Request, redirectTo: string = "/login") {
  const authSession = await getAuthSession(request);
  
  if (!authSession) {
    throw redirect(redirectTo);
  }
  
  return authSession;
}

// Get auth headers for API requests
export function getAuthHeaders(authSession: AuthSession | null): Record<string, string> {
  if (!authSession?.token) {
    return {};
  }
  
  return {
    Authorization: `Bearer ${authSession.token}`,
  };
} 