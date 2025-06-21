import React, { createContext, useContext } from 'react';
import { useFetcher, useRouteLoaderData } from '@remix-run/react';
import type { User } from '@suhaibinator/sunnah-v3-ts-proto/lib/api';

// Auth context state interface
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Auth context interface
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (email: string, password: string) => void;
  isAuthenticated: () => boolean;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  initialUser = null 
}) => {
  // Use fetchers for auth actions
  const loginFetcher = useFetcher();
  const logoutFetcher = useFetcher();
  const registerFetcher = useFetcher();
  
  // Get user data from root loader (if available)
  const rootData = useRouteLoaderData('root') as { user?: User } | undefined;
  const user = rootData?.user || initialUser;
  
  // Determine loading state from fetchers
  const isLoading = 
    loginFetcher.state === 'submitting' ||
    logoutFetcher.state === 'submitting' ||
    registerFetcher.state === 'submitting';
  
  // Get error from fetchers
  const error = 
    (loginFetcher.data as { error?: string })?.error ||
    (registerFetcher.data as { error?: string })?.error ||
    null;

  // Check if the user is authenticated
  const isAuthenticated = (): boolean => {
    return !!user;
  };

  // Login function using fetcher
  const login = (email: string, password: string) => {
    loginFetcher.submit(
      { email, password },
      { method: 'post', action: '/auth/login' }
    );
  };

  // Register function using fetcher
  const register = (email: string, password: string) => {
    registerFetcher.submit(
      { email, password },
      { method: 'post', action: '/auth/register' }
    );
  };

  // Logout function using fetcher
  const logout = () => {
    logoutFetcher.submit(
      {},
      { method: 'post', action: '/auth/logout' }
    );
  };

  // Auth context value
  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    register,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 