'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'fe/proto/api';
import { getCookie, setCookie, removeCookie } from 'fe/lib/cookies';
import { getCurrentUser } from 'fe/services/user'; // Import the new service function
import { ApiRequestError } from 'fe/lib/api-client';

// Auth token cookie name
const AUTH_TOKEN_COOKIE = 'auth_token';

// Auth context state interface
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Auth context interface
interface AuthContextType extends AuthState {
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  getAuthHeader: () => { Authorization: string } | undefined;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Auth state
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Check if the user is authenticated
  const isAuthenticated = (): boolean => {
    const token = getCookie(AUTH_TOKEN_COOKIE);
    return !!token && !!state.user;
  };

  // Get the auth header for API requests
  const getAuthHeader = () => {
    const token = getCookie(AUTH_TOKEN_COOKIE);
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  };

  // Login function
  const login = (token: string) => {
    // Set the auth token cookie
    setCookie(AUTH_TOKEN_COOKIE, token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Fetch the user data
    fetchUser();
  };

  // Logout function
  const logout = () => {
    // Remove the auth token cookie
    removeCookie(AUTH_TOKEN_COOKIE, { path: '/' });

    // Clear the user data
    setState({
      user: null,
      isLoading: false,
      error: null,
    });
  };

  // Fetch the current user data
  const fetchUser = async () => {
    const token = getCookie(AUTH_TOKEN_COOKIE);

    if (!token) {
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch the user data using the service function
      const user = await getCurrentUser();

      setState({
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      
      // If the token is invalid, clear it
      if (error instanceof Error && error.message.includes('401')) {
        removeCookie(AUTH_TOKEN_COOKIE, { path: '/' });
      }
      
      // Check for nested error structure
      let errorMessage = 'Failed to fetch user';
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
            errorMessage = details.error.message;
            // Log the trace_id for debugging
            if (details.error.trace_id) {
              console.error('Auth error trace ID:', details.error.trace_id);
            }
          } else {
            errorMessage = error.message;
          }
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setState({
        user: null,
        isLoading: false,
        error: errorMessage,
      });
    }
  };

  // Check for an existing token and fetch the user data on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Auth context value
  const value: AuthContextType = {
    ...state,
    login,
    logout,
    isAuthenticated,
    getAuthHeader,
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
