import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authApi, userApi } from "~/lib/api-client";
import { createAuthSession, getAuthSession } from "~/lib/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  // Check if user is already authenticated
  const existingAuth = await getAuthSession(request);
  if (existingAuth) {
    return json({ error: "Already authenticated" }, { status: 400 });
  }

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    // Authenticate with the API
    const authResponse = await authApi.loginWithEmail(email, password, null);
    
    // Get user data
    const userResponse = await userApi.getCurrentUser(null);

    // Create auth session and redirect
    return createAuthSession(request, authResponse.generatedToken, userResponse, "/");
  } catch (error) {
    console.error("Login error:", error);
    
    let errorMessage = "Login failed";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return json({ error: errorMessage }, { status: 400 });
  }
} 