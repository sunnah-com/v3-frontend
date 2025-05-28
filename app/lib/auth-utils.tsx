import React from 'react';
import { useAuth } from '~/components/auth/auth-provider';
import { LoginForm } from '~/components/auth/login-form';

/**
 * Higher-order component that requires authentication
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated()) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Authentication Required</h1>
              <p className="text-gray-600 mt-2">Please sign in to access this page.</p>
            </div>
            <LoginForm />
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

/**
 * Component that renders children only if user is authenticated
 */
interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

/**
 * Component that renders children only if user is NOT authenticated
 */
interface GuestGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated()) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

/**
 * Hook to check if user has specific permissions (extend as needed)
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated() || !user) {
      return false;
    }

    // Add your permission logic here
    // For example, check user roles, permissions, etc.
    // This is a placeholder implementation
    return true;
  };

  const isAdmin = (): boolean => {
    if (!isAuthenticated() || !user) {
      return false;
    }

    // Add your admin check logic here
    // For example, check if user has admin role
    return false; // Placeholder
  };

  return {
    hasPermission,
    isAdmin,
  };
} 