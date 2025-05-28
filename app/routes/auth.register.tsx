import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { authApi, userApi } from "~/lib/api-client";
import { createAuthSession, getAuthSession } from "~/lib/auth.server";

// Redirect GET requests to the main register page
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  const redirectTo = searchParams ? `/register?${searchParams}` : '/register';
  throw redirect(redirectTo);
}

export async function action({ request }: ActionFunctionArgs) {
  // Check if user is already authenticated
  const existingAuth = await getAuthSession(request);
  if (existingAuth) {
    return json({ error: "Already authenticated" }, { status: 400 });
  }

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const returnUrl = formData.get("returnUrl");

  if (typeof email !== "string" || typeof password !== "string" || typeof confirmPassword !== "string") {
    return json({ error: "Email, password, and password confirmation are required" }, { status: 400 });
  }

  if (!email || !password || !confirmPassword) {
    return json({ error: "Please fill in all fields" }, { status: 400 });
  }

  // Password confirmation validation
  if (password !== confirmPassword) {
    return json({ error: "Passwords do not match" }, { status: 400 });
  }

  // Basic validation
  if (password.length < 8) {
    return json({ error: "Password must be at least 8 characters long" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  try {
    // Register with the API
    const registerResponse = await authApi.registerEmail(email, password, null);
    
    if (!registerResponse.success) {
      return json({ error: registerResponse.message || "Registration failed" }, { status: 400 });
    }

    // Registration successful, now log in the user to get the token
    const loginResponse = await authApi.loginWithEmail(email, password, null);
    
    // Get user data using the token
    // We need to temporarily set the token to get user data
    const userResponse = await userApi.getCurrentUser(null);

    // Create auth session and redirect
    const redirectTo = typeof returnUrl === "string" && returnUrl 
      ? decodeURIComponent(returnUrl) 
      : "/";
    
    return createAuthSession(request, loginResponse.generatedToken, userResponse, redirectTo);
  } catch (error) {
    console.error("Registration error:", error);
    
    let errorMessage = "Registration failed";
    
    // Handle different types of errors
    if (error instanceof Error) {
      // Check for specific error patterns
      if (error.message.includes("already exists") || error.message.includes("duplicate")) {
        errorMessage = "An account with this email already exists";
      } else if (error.message.includes("invalid email")) {
        errorMessage = "Please enter a valid email address";
      } else if (error.message.includes("password")) {
        errorMessage = "Password does not meet requirements";
      } else {
        errorMessage = error.message;
      }
    }
    
    return json({ error: errorMessage }, { status: 400 });
  }
} 