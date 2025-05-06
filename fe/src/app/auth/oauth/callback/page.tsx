'use client';

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "fe/hooks/use-auth";
import { oauthLogin } from "fe/services/auth";
import { ApiRequestError } from "fe/lib/api-client";
import { toastSuccess, toastError } from "fe/lib/toast-utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "fe/components/ui/card";
import { Button } from "fe/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { AuthProvider, authProviderFromJSON } from "fe/proto/auth";

// Component that uses useSearchParams must be wrapped in Suspense
function OAuthCallbackContent() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const provider = searchParams.get("provider");
  const state = searchParams.get("state"); // Can contain the return URL if it was passed
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // If already authenticated, redirect to return URL or home
    if (isAuthenticated()) {
      const redirectTo = state ? decodeURIComponent(state) : '/';
      router.push(redirectTo);
      return;
    }

    // If an error was returned from the OAuth provider
    if (error) {
      setStatus('error');
      const errorMsg = errorDescription || `OAuth error: ${error}`;
      setErrorMessage(errorMsg);
      toastError(errorMsg);
      return;
    }

    // If no code or provider is provided, show error
    if (!code || !provider) {
      setStatus('error');
      const errorMsg = 'Invalid OAuth response. Missing code or provider.';
      setErrorMessage(errorMsg);
      toastError(errorMsg);
      return;
    }

    // Determine the provider enum from the string
    const providerEnum = getProviderEnum(provider);
    if (providerEnum === AuthProvider.AUTH_PROVIDER_UNSPECIFIED) {
      setStatus('error');
      const errorMsg = `Unsupported OAuth provider: ${provider}`;
      setErrorMessage(errorMsg);
      toastError(errorMsg);
      return;
    }

    // Process the OAuth login
    const processOAuth = async () => {
      try {
        // Call the oauthLogin service function with the code and provider
        const response = await oauthLogin({ 
          code: code,
          provider: providerEnum
        });
        
        // If successful, login with the token
        if (response.generatedToken) {
          login(response.generatedToken);
          setStatus('success');
          
          // Show success toast
          toastSuccess('Successfully logged in');
          
          // Redirect to return URL or home after a short delay
          setTimeout(() => {
            const redirectTo = state ? decodeURIComponent(state) : '/';
            router.push(redirectTo);
          }, 3000);
        } else {
          throw new Error('No authentication token received');
        }
      } catch (error) {
        setStatus('error');
        
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
              setErrorMessage(details.error.message);
              toastError(details.error.message);
              // Log the trace_id for debugging
              if (details.error.trace_id) {
                console.error('OAuth error trace ID:', details.error.trace_id);
              }
            } else {
              setErrorMessage(error.message);
              toastError(error.message);
            }
          } else {
            setErrorMessage(error.message);
            toastError(error.message);
          }
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
          toastError(error.message);
        } else {
          const errorMsg = 'OAuth login failed. Please try again or use another login method.';
          setErrorMessage(errorMsg);
          toastError(errorMsg);
        }
      }
    };

    processOAuth();
  }, [code, error, errorDescription, provider, state, login, router, isAuthenticated]);

  // Helper function to convert string provider name to enum
  const getProviderEnum = (providerName: string): AuthProvider => {
    // Convert to uppercase and prefix with AUTH_PROVIDER_
    const enumKey = `AUTH_PROVIDER_${providerName.toUpperCase()}`;
    try {
      return authProviderFromJSON(enumKey);
    } catch (e) {
      console.error(`Failed to parse provider: ${providerName}`, e);
      return AuthProvider.AUTH_PROVIDER_UNSPECIFIED;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>OAuth Authentication</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Processing your login...'}
            {status === 'success' && 'Successfully authenticated!'}
            {status === 'error' && 'There was a problem with your OAuth login.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-center text-sm text-muted-foreground">
                Please wait while we process your login...
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center text-sm">
                You have successfully logged in.
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Redirecting you to the application...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-16 w-16 text-destructive" />
              <p className="text-center text-sm">
                {errorMessage}
              </p>
            </div>
          )}
        </CardContent>
        {status === 'error' && (
          <CardFooter className="flex justify-center">
            <div className="flex flex-col gap-4 w-full">
              <Button 
                onClick={() => router.push('/login')}
                className="w-full"
              >
                Go to Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                Go to Homepage
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

// Loading fallback for Suspense
function OAuthCallbackLoading() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>OAuth Authentication</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<OAuthCallbackLoading />}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
