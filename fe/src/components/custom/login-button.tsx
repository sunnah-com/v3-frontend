'use client';

import * as React from 'react';
import { User, LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from 'fe/lib/utils';
import { useIsMobile } from 'fe/hooks/use-mobile';
import { useAuth } from 'fe/hooks/use-auth';

export interface LoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The text to display on the button
   * @default "Login"
   */
  text?: string;

  /**
   * The icon to display on the button
   * @default <LogIn />
   */
  icon?: React.ReactNode;

  /**
   * Whether to show only the icon on mobile devices
   * @default true
   */
  iconOnlyOnMobile?: boolean;

  /**
   * The variant of the button
   * @default "default"
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

  /**
   * The size of the button
   * @default "default"
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /**
   * Whether the button is in a navbar
   * @default false
   */
  inNavbar?: boolean;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Children elements
   */
  children?: React.ReactNode;
}

/**
 * Base login button component that handles common login button functionality
 */
export const LoginButton = React.forwardRef<HTMLButtonElement, LoginButtonProps>(
  (
    {
      text = 'Login',
      icon = <LogIn />,
      iconOnlyOnMobile = true,
      variant = 'default',
      size = 'default',
      inNavbar = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const { isAuthenticated, user } = useAuth();

    // If user is authenticated, show user info or avatar instead
    if (isAuthenticated() && user) {
      return (
        <Button
          ref={ref}
          variant={variant}
          size={size}
          className={cn(
            inNavbar,
            className
          )}
          {...props}
        >
          {isMobile ? (
            <User />
          ) : (
            <>
              <User />
              {user.username || 'Account'}
            </>
          )}
          {children}
        </Button>
      );
    }

    // Show login button
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          inNavbar,
          className
        )}
        {...props}
      >
        {icon}
        {(!isMobile || !iconOnlyOnMobile) && text}
        {children}
      </Button>
    );
  }
);

LoginButton.displayName = 'LoginButton';
