"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "fe/hooks/use-auth";
import { toastSuccess, toastError } from "fe/lib/toast-utils";
import { ApiRequestError } from "fe/lib/api-client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Mail, Lock, Loader2 } from "lucide-react";
import { emailLogin } from "fe/services/auth"; // Import the new service function

interface EmailLoginFormProps {
  returnUrl?: string;
}

export function EmailLoginForm({ returnUrl }: EmailLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toastError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      // Call the emailLogin service function
      const responseData = await emailLogin({ email, password });

      // Call the login function from the auth context
      login(responseData.generatedToken);

      toastSuccess("Login successful");

      // Redirect to the return URL or home
      const redirectTo = returnUrl ? decodeURIComponent(returnUrl) : "/";
      router.push(redirectTo);
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
              console.error("Login error trace ID:", details.error.trace_id);
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
        toastError("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign in with Email</CardTitle>
        <CardDescription>
          Enter your email and password to sign in
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-6 pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Create account
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
