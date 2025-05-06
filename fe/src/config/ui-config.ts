/**
 * UI configuration
 * 
 * This file contains configuration for UI components and display preferences.
 */

/**
 * UserDisplayType enum defines what information to display as the primary user identifier
 */
export enum UserDisplayType {
  /**
   * Display the username (e.g., "user123")
   */
  USERNAME = "username",
  
  /**
   * Display the email address (e.g., "user@example.com")
   */
  EMAIL = "email",
  
  /**
   * Display the first name only (e.g., "John")
   */
  FIRST_NAME = "firstName",
  
  /**
   * Display full name (e.g., "John Doe")
   */
  FULL_NAME = "fullName"
}

export interface UiConfig {
  /**
   * The primary identifier to display for users in the UI
   */
  userDisplayType: UserDisplayType;
  
  /**
   * The number of characters to use in avatar fallbacks (1 or 2)
   */
  avatarFallbackChars: 1 | 2;

  /**
   * Toast notification configuration
   */
  toast: {
    /**
     * Duration in milliseconds for success toasts
     */
    successDuration: number;
    
    /**
     * Duration in milliseconds for error toasts
     */
    errorDuration: number;
  };
}

/**
 * Default UI configuration
 */
export const uiConfig: UiConfig = {
  // What to display as the primary user identifier
  userDisplayType: UserDisplayType.USERNAME,
  
  // Number of characters to use in avatar fallbacks
  avatarFallbackChars: 2,
  
  // Toast notification configuration
  // Success toasts display for 1/3 of the time of error toasts
  toast: {
    successDuration: 750,    // 2 seconds
    errorDuration: 2000       // 6 seconds
  }
};
