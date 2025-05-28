import { userApi, authApi, userSettingsApi } from "~/lib/api-client";
import type { User, UserSettings } from "~/proto/api";
import type { AuthSession } from "~/lib/auth.server";

/**
 * Get current user from API
 */
export async function getCurrentUser(): Promise<User> {
  return userApi.getCurrentUser(null);
}

/**
 * Get user settings
 */
export async function getUserSettings(): Promise<UserSettings> {
  return userSettingsApi.getUserSettings(null);
}

/**
 * Update user settings
 */
export async function updateUserSettings(
  settings: Partial<Omit<UserSettings, 'id' | 'userId'>>
): Promise<UserSettings> {
  return userSettingsApi.updateUserSettings(settings, null);
}

/**
 * Login with email and password
 */
export async function loginWithEmail(
  email: string,
  password: string
) {
  return authApi.loginWithEmail(email, password, null);
}

/**
 * Register with email and password
 */
export async function registerWithEmail(
  email: string,
  password: string
) {
  return authApi.registerEmail(email, password, null);
}

/**
 * Request password reset
 */
export async function requestPasswordReset(
  email: string
) {
  return authApi.requestPasswordReset(email, null);
}

/**
 * Complete password reset
 */
export async function completePasswordReset(
  verificationCode: string,
  newPassword: string
) {
  return authApi.completePasswordReset(verificationCode, newPassword, null);
}

/**
 * Change password
 */
export async function changePassword(
  oldPassword: string,
  newPassword: string
) {
  return authApi.changePassword(oldPassword, newPassword, null);
}

/**
 * Complete email verification
 */
export async function completeEmailVerification(
  verificationCode: string
) {
  return authApi.completeEmailVerification(verificationCode, null);
} 