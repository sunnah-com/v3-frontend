import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AuthProvider } from '@suhaibinator/sunnah-v3-ts-proto/lib/auth';
import { authConfig } from '~/config/auth-config';

// Import icons from Lucide
import { 
  Mail,
  LucideIcon,
  Linkedin
} from 'lucide-react';
import { 
  SiFacebook, 
  SiGithub, 
  SiX,
  SiDiscord, 
  SiGoogle, 
  SiApple 
} from '@icons-pack/react-simple-icons';

interface OAuthLoginButtonsProps {
  returnUrl?: string;
  onProviderSelect: (provider: AuthProvider) => void;
}

// Map of provider to icon and style class
const providerConfig: Record<AuthProvider, { 
  icon: LucideIcon; 
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  label: string;
  enabled: boolean;
}> = {
  [AuthProvider.AUTH_PROVIDER_UNSPECIFIED]: { 
    icon: Mail, 
    variant: 'default',
    label: 'Email',
    enabled: false
  },
  [AuthProvider.AUTH_PROVIDER_GOOGLE]: { 
    icon: SiGoogle,
    variant: 'outline',
    label: 'Google',
    enabled: authConfig.oauthProviders.google
  },
  [AuthProvider.AUTH_PROVIDER_FACEBOOK]: { 
    icon: SiFacebook, 
    variant: 'outline',
    label: 'Facebook',
    enabled: authConfig.oauthProviders.facebook
  },
  [AuthProvider.AUTH_PROVIDER_TWITTER]: { 
    icon: SiX, 
    variant: 'outline',
    label: 'X',
    enabled: authConfig.oauthProviders.x
  },
  [AuthProvider.AUTH_PROVIDER_GITHUB]: { 
    icon: SiGithub, 
    variant: 'outline',
    label: 'GitHub',
    enabled: authConfig.oauthProviders.github
  },
  [AuthProvider.AUTH_PROVIDER_DISCORD]: { 
    icon: SiDiscord,
    variant: 'outline',
    label: 'Discord',
    enabled: authConfig.oauthProviders.discord
  },
  [AuthProvider.AUTH_PROVIDER_APPLE]: { 
    icon: SiApple,
    variant: 'outline',
    label: 'Apple',
    enabled: authConfig.oauthProviders.apple
  },
  [AuthProvider.AUTH_PROVIDER_LINKEDIN]: { 
    icon: Linkedin, 
    variant: 'outline',
    label: 'LinkedIn',
    enabled: authConfig.oauthProviders.linkedin
  },
  [AuthProvider.AUTH_PROVIDER_EMAIL]: { 
    icon: Mail, 
    variant: 'default',
    label: 'Email',
    enabled: false
  },
  [AuthProvider.AUTH_PROVIDER_PASSWORD_RESET]: { 
    icon: Mail, 
    variant: 'default',
    label: 'Password Reset',
    enabled: false
  },
  [AuthProvider.UNRECOGNIZED]: { 
    icon: Mail, 
    variant: 'default',
    label: 'Other',
    enabled: false
  },
};

export function OAuthLoginButtons({ onProviderSelect }: OAuthLoginButtonsProps) {
  // Get enabled providers
  const enabledProviders = Object.entries(providerConfig)
    .filter(([, config]) => config.enabled)
    .map(([key]) => parseInt(key) as AuthProvider);
  
  if (enabledProviders.length === 0) {
    return null;
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign in with</CardTitle>
        <CardDescription>Choose your preferred sign in method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {enabledProviders.map((provider) => {
            const config = providerConfig[provider];
            const Icon = config.icon;
            
            return (
              <Button
                key={provider}
                variant={config.variant}
                className="w-full"
                onClick={() => onProviderSelect(provider)}
              >
                <Icon className="mr-2 h-4 w-4" />
                Continue with {config.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 