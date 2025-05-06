/**
 * Authentication configuration
 * 
 * This file contains configuration for authentication features.
 * Enable or disable different authentication methods by setting the corresponding flag.
 */

export interface AuthConfig {
  /**
   * Email/password authentication
   */
  emailAuth: boolean;
  
  /**
   * OAuth providers
   */
  oauthProviders: {
    google: boolean;
    facebook: boolean;
    apple: boolean;
    github: boolean;
    x: boolean;
    discord: boolean;
    linkedin: boolean;
  };
}

/**
 * Default authentication configuration
 * 
 * Enable or disable authentication methods by changing these values.
 */
export const authConfig: AuthConfig = {
  // Email/password authentication
  emailAuth: true,
  
  // OAuth providers
  oauthProviders: {
    google: true,
    facebook: true,
    apple: true,
    github: true,
    x: false,
    discord: true,
    linkedin: true,
  },
};
