'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Mail, LogIn } from 'lucide-react';
import { LoginButton, LoginButtonProps } from './login-button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '../ui/dropdown-menu';
import { AuthProvider, authProviderToJSON } from 'fe/proto/auth';
import { useAuth } from 'fe/hooks/use-auth';

// OAuth provider icons (you may want to replace these with actual icons)
const providerIcons: Record<AuthProvider, React.ReactNode> = {
  [AuthProvider.AUTH_PROVIDER_UNSPECIFIED]: <LogIn />,
  [AuthProvider.AUTH_PROVIDER_GOOGLE]: <span className="text-[#4285F4]">G</span>,
  [AuthProvider.AUTH_PROVIDER_FACEBOOK]: <span className="text-[#1877F2]">f</span>,
  [AuthProvider.AUTH_PROVIDER_TWITTER]: <span className="text-[#1DA1F2]">𝕏</span>,
  [AuthProvider.AUTH_PROVIDER_GITHUB]: <span className="text-[#333]">GH</span>,
  [AuthProvider.AUTH_PROVIDER_DISCORD]: <span className="text-[#5865F2]">D</span>,
  [AuthProvider.AUTH_PROVIDER_APPLE]: <span>🍎</span>,
  [AuthProvider.AUTH_PROVIDER_LINKEDIN]: <span className="text-[#0A66C2]">in</span>,
  [AuthProvider.AUTH_PROVIDER_EMAIL]: <Mail />,
  [AuthProvider.AUTH_PROVIDER_PASSWORD_RESET]: <Mail />,
  [AuthProvider.UNRECOGNIZED]: <LogIn />,
};

// Helper function to get a human-readable provider name
const getProviderName = (provider: AuthProvider): string => {
  const name = authProviderToJSON(provider).replace('AUTH_PROVIDER_', '');
  return name.charAt(0) + name.slice(1).toLowerCase();
};

export interface DropdownLoginButtonProps extends Omit<LoginButtonProps, 'onClick'> {
  /**
   * The URL to redirect to for email/password login
   * @default "/login"
   */
  emailLoginUrl?: string;
  
  /**
   * The OAuth providers to display
   * @default [Google, Facebook, GitHub]
   */
  providers?: AuthProvider[];
  
  /**
   * Whether to show the email/password login option
   * @default true
   */
  showEmailLogin?: boolean;
  
  /**
   * Custom handler for OAuth provider selection
   */
  onProviderSelect?: (provider: AuthProvider) => void;
}

/**
 * A login button with a dropdown menu showing login options
 */
export const DropdownLoginButton = React.forwardRef<HTMLButtonElement, DropdownLoginButtonProps>(
  (
    {
      emailLoginUrl = '/login',
      providers = [
        AuthProvider.AUTH_PROVIDER_GOOGLE,
        AuthProvider.AUTH_PROVIDER_FACEBOOK,
        AuthProvider.AUTH_PROVIDER_GITHUB
      ],
      showEmailLogin = true,
      onProviderSelect,
      ...props
    },
    ref
  ) => {
    const { /* login, */ } = useAuth();
    const router = useRouter(); // Get router instance
    const [open, setOpen] = React.useState(false);

    // Handle OAuth provider selection
    const handleProviderSelect = (provider: AuthProvider) => {
      if (onProviderSelect) {
        onProviderSelect(provider);
      } else {
        // Default implementation - redirect to OAuth endpoint
        const providerName = authProviderToJSON(provider).replace('AUTH_PROVIDER_', '').toLowerCase();
        router.push(`/api/auth/${providerName}`); // Use router.push
      }
      setOpen(false);
    };
    
    // Handle email/password login
    const handleEmailLogin = () => {
      router.push(emailLoginUrl); // Use router.push
      setOpen(false);
    };
    
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <LoginButton ref={ref} {...props} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Login Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {showEmailLogin && (
            <DropdownMenuItem onClick={handleEmailLogin}>
              <Mail className="mr-2 h-4 w-4" />
              <span>Email & Password</span>
            </DropdownMenuItem>
          )}
          
          {showEmailLogin && providers.length > 0 && <DropdownMenuSeparator />}
          
          {providers.map((provider) => (
            <DropdownMenuItem 
              key={provider} 
              onClick={() => handleProviderSelect(provider)}
            >
              {providerIcons[provider]}
              <span className="ml-2">{getProviderName(provider)}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

DropdownLoginButton.displayName = 'DropdownLoginButton';
