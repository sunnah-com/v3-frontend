"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "fe/hooks/use-auth"; // Import useAuth
import { toastSuccess, toastError } from "fe/lib/toast-utils";
import { ApiRequestError } from "fe/lib/api-client";
import { Button } from "fe/components/ui/button";
import { Input } from "fe/components/ui/input";
import { Label } from "fe/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "fe/components/ui/card";
import { Mail, Lock, Loader2 } from "lucide-react";
import { emailRegister, emailLogin } from "fe/services/auth"; // Import the service functions
import { OAuthLoginButtons } from "fe/components/auth/oauth-login-buttons";
import { AuthProvider, authProviderToJSON } from "fe/proto/auth";
import { authConfig } from "fe/config/auth-config";

// Component that uses useSearchParams must be wrapped in Suspense
function SignupContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth(); // Get login function from auth context
  const returnUrl = searchParams.get("returnUrl");

  // Custom provider selection handler to include return URL
  const handleProviderSelect = (provider: AuthProvider) => {
    const providerName = authProviderToJSON(provider)
      .replace("AUTH_PROVIDER_", "")
      .toLowerCase();

    // Include return URL in state parameter for OAuth flow
    const state = returnUrl ? encodeURIComponent(returnUrl) : "";
    window.location.href = `/api/auth/${providerName}/login?state=${state}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toastError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toastError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Call the emailRegister service function and capture the response
      const registrationResponse = await emailRegister({ email, password });

      if (registrationResponse.success) {
        // Registration successful, now log in the user
        try {
          const loginResponse = await emailLogin({ email, password });

          // Log the user in using the token from the login response
          login(loginResponse.generatedToken);

          toastSuccess("Account created successfully! You are now logged in.");

          // Redirect to the return URL or dashboard
          const redirectTo = returnUrl
            ? decodeURIComponent(returnUrl)
            : "/dashboard";
          router.push(redirectTo);
        } catch (error) {
          // Handle login error after successful registration
          console.error("Login after registration failed:", error);
          toastError(
            "Account created but automatic login failed. Please log in manually."
          );
          router.push("/login");
        }
      } else {
        // Registration failed with a known reason
        throw new Error(registrationResponse.message || "Registration failed");
      }
    } catch (error) {
      // Handle ApiRequestError with more detailed information
      if (error instanceof ApiRequestError) {
        if (error.details) {
          // Create a properly typed interface for the error details structure
          interface ErrorDetails {
            error?: {
              message?: string;
              trace_id?: string;
            };
          }

          // Type-safe access to error details
          const details = error.details as ErrorDetails;
          if (details.error?.message) {
            // Display the specific error message from the backend
            toastError(details.error.message);
            // Log the trace_id for debugging
            if (details.error.trace_id) {
              console.error(
                "Registration error trace ID:",
                details.error.trace_id
              );
            }
          } else {
            // Fallback to the error message
            toastError(error.message);
          }
        } else {
          // Fallback to the error message
          toastError(error.message);
        }
      } else if (error instanceof Error) {
        toastError(error.message);
      } else {
        toastError("Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <h1 className="text-2xl font-bold mb-8">Create an account</h1>
      <div className="w-full max-w-md space-y-6">
        {/* OAuth Login Buttons */}
        <OAuthLoginButtons onProviderSelect={handleProviderSelect} />

        {/* Email Registration Form */}
        {authConfig.emailAuth && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Sign up with Email</CardTitle>
              <CardDescription>
                Create a new account with your email and password
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-6 pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
                <div className="text-center text-sm">
                  Already have an account?&nbsp;
                  <a
                    href="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </a>
                </div>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function SignupLoading() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <h1 className="text-2xl font-bold mb-8">Loading...</h1>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupContent />
    </Suspense>
  );
}
