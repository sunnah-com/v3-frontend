'use client';

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "fe/hooks/use-auth";
import { OAuthLoginButtons } from 'fe/components/auth/oauth-login-buttons';
import { EmailLoginForm } from 'fe/components/auth/email-login-form';
import { AuthProvider, authProviderToJSON } from 'fe/proto/auth';
import { authConfig } from 'fe/config/auth-config';

// Component that uses useSearchParams must be wrapped in Suspense
function LoginContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const errorParam = searchParams.get("error");

  // Show error toast if login failed (e.g., from OAuth redirect)
  useEffect(() => {
    if (errorParam) {
      // Decode the error message if needed, provide a generic fallback
      const errorMessage = errorParam
        ? decodeURIComponent(errorParam)
        : "Login failed. Please try again.";
      // Use a more specific message or mapping based on known error codes if available
      toast.error(`Login Error: ${errorMessage}`);
      // Optional: remove the error param from URL without reloading
      // router.replace('/login', undefined); // Or keep it for debugging
    }
  }, [errorParam, router]);

  // If already authenticated, redirect to return URL or home
  useEffect(() => {
    if (isAuthenticated()) {
      const redirectTo = returnUrl ? decodeURIComponent(returnUrl) : '/';
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, returnUrl]);
  
  // Custom provider selection handler to include return URL
  const handleProviderSelect = (provider: AuthProvider) => {
    const providerName = authProviderToJSON(provider)
      .replace('AUTH_PROVIDER_', '')
      .toLowerCase();
    
    // Include return URL in state parameter for OAuth flow
    const state = returnUrl ? encodeURIComponent(returnUrl) : '';
    window.location.href = `/api/auth/${providerName}/login?state=${state}`;
  };
  
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <h1 className="text-2xl font-bold mb-8">Log in to your account</h1>
      <div className="w-full max-w-md space-y-6">
        {/* OAuth Login Buttons */}
        <OAuthLoginButtons onProviderSelect={handleProviderSelect} />
        
        {/* Email Login Form (if enabled) */}
        {authConfig.emailAuth && (
          <EmailLoginForm returnUrl={returnUrl ? decodeURIComponent(returnUrl) : undefined} />
        )}
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function LoginLoading() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <h1 className="text-2xl font-bold mb-8">Loading...</h1>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}
