'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { LoginButton, LoginButtonProps } from './login-button';

export interface SimpleLoginButtonProps extends Omit<LoginButtonProps, 'onClick'> {
  /**
   * The URL to redirect to for login
   * @default "/login"
   */
  loginUrl?: string;
}

/**
 * A simple login button that redirects to a dedicated login page
 */
export const SimpleLoginButton = React.forwardRef<HTMLButtonElement, SimpleLoginButtonProps>(
  (
    {
      loginUrl = '/login',
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      router.push(loginUrl);
    };
    
    return (
      <LoginButton
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

SimpleLoginButton.displayName = 'SimpleLoginButton';
