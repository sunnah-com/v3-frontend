import React from 'react';
import { Form, useActionData, useNavigation, useSearchParams } from '@remix-run/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { OAuthLoginButtons } from './oauth-login-buttons';
import { AuthProvider, authProviderToJSON } from '@suhaibinator/sunnah-v3-ts-proto/lib/auth';
import { authConfig } from '~/config/auth-config';

interface RegisterFormProps {
  className?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ className = '' }) => {
  const actionData = useActionData<{ error?: string; success?: boolean }>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === 'submitting';
  const returnUrl = searchParams.get('returnUrl');

  // Custom provider selection handler to include return URL
  const handleProviderSelect = (provider: AuthProvider) => {
    const providerName = authProviderToJSON(provider)
      .replace("AUTH_PROVIDER_", "")
      .toLowerCase();

    // Include return URL in state parameter for OAuth flow
    const state = returnUrl ? encodeURIComponent(returnUrl) : "";
    window.location.href = `/api/auth/${providerName}/login?state=${state}`;
  };

  return (
    <div className={`w-full max-w-md mx-auto space-y-6 ${className}`}>
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
          <Form method="post" action="/auth/register">
            {returnUrl && (
              <input type="hidden" name="returnUrl" value={returnUrl} />
            )}
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              {actionData?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {actionData.error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-6 pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
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
                  href={`/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </a>
              </div>
            </CardFooter>
          </Form>
        </Card>
      )}
    </div>
  );
}; 