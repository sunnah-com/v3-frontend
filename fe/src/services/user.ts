import { userApi } from '../lib/api-client'; // Corrected path and import
import { User } from '../proto/api'; // Corrected path

/**
 * Fetches the currently authenticated user's data.
 * @returns The user object.
 * @throws {ApiRequestError} If the API request fails (e.g., not authenticated).
 */
export async function getCurrentUser(): Promise<User> {
  // Use the specific userApi function which handles decoding
  return userApi.getCurrentUser();
}

// Add other user-related API functions here (e.g., updateUserProfile)
