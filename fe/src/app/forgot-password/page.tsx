'use client';

import { useState } from 'react';
import { toastSuccess, toastError } from 'fe/lib/toast-utils';
import { Button } from 'fe/components/ui/button';
import { Input } from 'fe/components/ui/input';
import { Label } from 'fe/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'fe/components/ui/card';
import { Mail, Loader2 } from 'lucide-react';
import { resetPassword } from 'fe/services/auth'; // Import the resetPassword service function

import { ApiRequestError } from 'fe/lib/api-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toastError('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({ email });
      toastSuccess('Password reset email sent. Please check your inbox (and spam folder).');
      // Optionally redirect or clear the form
      // setEmail(''); // Clear email field after successful request
      // router.push('/login'); // Redirect to login page
    } catch (error) {
      // Handle ApiRequestError with more detailed information
      if (error instanceof ApiRequestError) {
        interface ErrorDetails {
          error?: {
            message?: string;
            trace_id?: string;
          };
        }
        
        if (error.details) {
          const details = error.details as ErrorDetails;
          if (details.error?.message) {
            toastError(details.error.message);
            if (details.error.trace_id) {
              console.error('Password reset error trace ID:', details.error.trace_id);
            }
          } else {
            toastError(error.message || 'Failed to send reset email.');
          }
        } else {
          toastError(error.message || 'Failed to send reset email.');
        }
      } else if (error instanceof Error) {
        toastError(error.message || 'Failed to send reset email.');
      } else {
        toastError('Failed to send password reset email. Please try again.');
      }
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <h1 className="text-2xl font-bold mb-8">Forgot Password</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email address below and we&apos;ll send you a link to reset your password.
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
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
            <div className="text-center text-sm">
              Remembered your password?&nbsp;
              <a href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
