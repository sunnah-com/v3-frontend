import { authApi } from '../lib/api-client'; // Corrected path and import
import {
  EmailAuthRequest,
  EmailAuthResponse,
  EmailRegistrationRequest,
  EmailRegistrationResponse,
  PasswordChangeRequest,
  PasswordChangeResponse,
  PasswordResetCompleteRequest,
  PasswordResetRequest,
  PasswordResetResponse,
  EmailVerificationRequest,
  OAuthCodeRequest,
  OAuthTokenResponse,
  // EmailVerificationResponse is not directly returned by endpoints, EmailAuthResponse is used instead
} from '../proto/auth'; // Corrected path
// MessageFns is not needed here anymore
// Removed decodeProtoResponse helper function as it's handled by api-client now

/**
 * Logs in a user using email and password.
 * @param credentials - The user's email and password.
 * @returns The authentication response containing the token.
 * @throws {ApiRequestError} If the API request fails.
 */
export async function emailLogin(
  credentials: Pick<EmailAuthRequest, 'email' | 'password'>
): Promise<EmailAuthResponse> {
  // Use the specific authApi function
  return authApi.loginWithEmail(credentials.email, credentials.password);
}

/**
 * Registers a new user using email and password.
 * @param registrationDetails - The user's email and password for registration.
 * @returns The registration response indicating success.
 * @throws {ApiRequestError} If the API request fails.
 */
export async function emailRegister(
  registrationDetails: Pick<EmailRegistrationRequest, 'email' | 'password'>
): Promise<EmailRegistrationResponse> {
  // Use the specific authApi function
  return authApi.registerEmail(registrationDetails.email, registrationDetails.password);
}

/**
 * Changes the current user's password. Requires authentication.
 * @param passwords - The old and new passwords.
 * @returns The password change response indicating success.
 * @throws {ApiRequestError} If the API request fails (e.g., wrong old password, not authenticated).
 */
export async function changePassword(
  passwords: Pick<PasswordChangeRequest, 'oldPassword' | 'newPassword'>
): Promise<PasswordChangeResponse> {
  // Use the specific authApi function
  return authApi.changePassword(passwords.oldPassword, passwords.newPassword);
}

/**
 * Initiates the password reset process for a given email.
 * @param details - Object containing the user's email.
 * @returns The password reset response indicating if the process was initiated (always true for security).
 * @throws {ApiRequestError} If the API request fails (rare, usually network/server errors).
 */
export async function resetPassword(
  details: Pick<PasswordResetRequest, 'email'>
): Promise<PasswordResetResponse> {
  // Use the specific authApi function
  return authApi.requestPasswordReset(details.email);
}

/**
 * Completes the email verification process using a verification code.
 * @param details - Object containing the verification code.
 * @returns The authentication response containing a new token upon successful verification.
 * @throws {ApiRequestError} If the API request fails (e.g., invalid/expired code).
 */
export async function completeVerification(
  details: Pick<EmailVerificationRequest, 'verificationCode'>
): Promise<EmailAuthResponse> {
  // Use the specific authApi function
  return authApi.completeEmailVerification(details.verificationCode);
}

/**
 * Completes the password reset process using a verification code and a new password.
 * @param details - Object containing the verification code and the new password.
 * @returns The authentication response containing a new token upon successful reset.
 * @throws {ApiRequestError} If the API request fails (e.g., invalid/expired code, weak password).
 */
export async function completeReset(
  details: Pick<PasswordResetCompleteRequest, 'verificationCode' | 'newPassword'>
): Promise<EmailAuthResponse> {
  // Use the specific authApi function
  return authApi.completePasswordReset(details.verificationCode, details.newPassword);
}

/**
 * Handles OAuth authentication using a code returned from the OAuth provider.
 * @param details - Object containing the OAuth code and provider type.
 * @returns The authentication response containing a new token upon successful OAuth login.
 * @throws {ApiRequestError} If the API request fails (e.g., invalid code, expired code).
 */
export async function oauthLogin(
  details: Pick<OAuthCodeRequest, 'code' | 'provider'>
): Promise<OAuthTokenResponse> {
  // Use the specific authApi function
  // Note: The endpoint '/auth/oauth/login' might need verification based on actual backend routing
  return authApi.authenticateWithOAuth(details.code, details.provider);
}

// TODO: Add logout function if needed (might involve clearing cookies/local state)
