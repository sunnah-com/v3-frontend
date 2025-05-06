'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'fe/hooks/use-auth';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackUrl?: string;
  message?: string;
}

export function ProtectedRoute({
  children,
  fallbackUrl = '/login',
  message = 'You need to be logged in to access this page',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Only check after initial loading is complete
    if (!isLoading && !isAuthenticated()) {
      // Show toast notification
      toast.error(message);
      
      // Store the current URL to redirect back after login
      const currentPath = window.location.pathname;
      const returnUrl = encodeURIComponent(currentPath);
      
      // Redirect to login page with return URL
      router.push(`${fallbackUrl}?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, isLoading, router, fallbackUrl, message]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Only render children if authenticated
  return isAuthenticated() ? <>{children}</> : null;
}
