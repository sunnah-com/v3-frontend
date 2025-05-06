'use client';

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toastSuccess, toastError } from "fe/lib/toast-utils";
import { useAuth } from "fe/hooks/use-auth";
import { completeReset } from "fe/services/auth";
import { ApiRequestError } from "fe/lib/api-client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "fe/components/ui/card";
import { Button } from "fe/components/ui/button";
import { Input } from "fe/components/ui/input";
import { Label } from "fe/components/ui/label";
import { Loader2, CheckCircle, AlertCircle, Lock } from "lucide-react";

// Component that uses useSearchParams must be wrapped in Suspense
function ResetPasswordContent() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("token");
  
  // Define the status type to avoid TypeScript inference issues
  type StatusType = 'initial' | 'submitting' | 'success' | 'error';
  const [status, setStatus] = useState<StatusType>('initial');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated()) {
      router.push('/');
      return;
    }

    // If no code is provided, show error
    if (!code) {
      setStatus('error');
      setErrorMessage('No reset code provided. Please check your email link.');
    }
  }, [code, router, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (!password || !confirmPassword) {
      toastError('Please enter and confirm your new password');
      return;
    }
    
    if (password !== confirmPassword) {
      toastError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      toastError('Password must be at least 8 characters long');
      return;
    }
    
    // If no code is provided, show error
    if (!code) {
      setStatus('error');
      setErrorMessage('No reset code provided. Please check your email link.');
      return;
    }
    
    setStatus('submitting');
    
    try {
      // Call the completeReset service function with the code from URL and new password
      const response = await completeReset({ 
        verificationCode: code,
        newPassword: password
      });
      
      // If successful, login with the token
      if (response.generatedToken) {
        login(response.generatedToken);
        setStatus('success');
        
        // Show success toast
        toastSuccess('Password reset successfully! You are now logged in.');
        
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
              console.error('Password reset error trace ID:', details.error.trace_id);
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
        const errorMsg = 'Password reset failed. Please try again or contact support.';
        setErrorMessage(errorMsg);
        toastError(errorMsg);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            {status === 'initial' && 'Enter a new password for your account'}
            {status === 'submitting' && 'Processing your request...'}
            {status === 'success' && 'Your password has been reset successfully!'}
            {status === 'error' && 'There was a problem resetting your password.'}
          </CardDescription>
        </CardHeader>
        
        {/* Show the form in initial state, and don't render it if in submitting state */}
        {status === 'initial' && (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
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
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
            
            <CardFooter className="flex flex-col space-y-4 pt-4">
              {/* Fixed TypeScript narrowing issue by using a different approach */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={false} // We're in 'initial' state, so never disabled here
              >
                Reset Password
              </Button>
              
              <div className="text-center text-sm">
                <a href="/login" className="text-primary hover:underline font-medium">
                  Back to Login
                </a>
              </div>
            </CardFooter>
          </form>
        )}
        
        {status === 'submitting' && (
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-center text-sm text-muted-foreground">
                Please wait while we reset your password...
              </p>
            </div>
          </CardContent>
        )}
        
        {status === 'success' && (
          <>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="flex flex-col items-center gap-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="text-center text-sm">
                  Your password has been reset successfully. You are now logged in.
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Redirecting you to the homepage...
                </p>
              </div>
            </CardContent>
          </>
        )}
        
        {status === 'error' && (
          <>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="flex flex-col items-center gap-4">
                <AlertCircle className="h-16 w-16 text-destructive" />
                <p className="text-center text-sm">
                  {errorMessage}
                </p>
              </div>
            </CardContent>
            
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
          </>
        )}
      </Card>
    </div>
  );
}

// Loading fallback for Suspense
function ResetPasswordLoading() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>Loading reset password page...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
