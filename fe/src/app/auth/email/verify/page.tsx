'use client';

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "fe/hooks/use-auth";
import { completeVerification } from "fe/services/auth";
import { ApiRequestError } from "fe/lib/api-client";
import { toastSuccess, toastError } from "fe/lib/toast-utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "fe/components/ui/card";
import { Button } from "fe/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

// Component that uses useSearchParams must be wrapped in Suspense
function VerifyEmailContent() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("token");
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hasVerified, setHasVerified] = useState(false); // Add state flag

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated()) {
      router.push('/');
      return;
    }

    // If no code is provided, show error
    if (!code) {
      setStatus('error');
      const errorMsg = 'No verification code provided. Please check your email link.';
      setErrorMessage(errorMsg);
      toastError(errorMsg);
      return;
    }
    
    // Prevent effect from running again if verification already attempted
    if (hasVerified) {
      return;
    }

    // Verify the email
    const verifyEmail = async () => {
      // Prevent multiple calls even if effect re-runs rapidly
      if (hasVerified) return; 
      setHasVerified(true); // Set flag immediately before API call

      try {
        // Call the completeVerification service function with the code from URL
        const response = await completeVerification({ verificationCode: code });
        
        // If successful, login with the token
        if (response.generatedToken) {
          login(response.generatedToken);
          setStatus('success');
          
          // Show success toast
          toastSuccess('Email verified successfully! You are now logged in.');
          
          // Redirect to home after a short delay
          setTimeout(() => {
            router.push('/');
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
                console.error('Verification error trace ID:', details.error.trace_id);
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
          const errorMsg = 'Email verification failed. Please try again or contact support.';
          setErrorMessage(errorMsg);
          toastError(errorMsg);
        }
      }
    };

    verifyEmail();
  }, [code, login, router, isAuthenticated]);

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verifying your email address...'}
            {status === 'success' && 'Your email has been successfully verified!'}
            {status === 'error' && 'There was a problem verifying your email.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-center text-sm text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center text-sm">
                Your email has been verified successfully. You are now logged in.
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Redirecting you to the homepage...
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
        <CardFooter className="flex justify-center">
          {status === 'error' && (
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
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// Loading fallback for Suspense
function VerifyEmailLoading() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>Loading verification page...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
