import { User } from "fe/proto/api";
import { uiConfig, UserDisplayType } from "fe/config/ui-config";

/**
 * Extended user interface with additional name fields that might be used
 * This helps us avoid using 'any' type
 */
interface ExtendedUser extends User {
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

/**
 * Gets the primary display value for a user based on UI configuration
 */
export const getPrimaryDisplayValue = (user: User | null) => {
  if (!user) return "User";

  const extendedUser = user as ExtendedUser;

  switch (uiConfig.userDisplayType) {
    case UserDisplayType.USERNAME:
      return user.username || "User";
    case UserDisplayType.EMAIL:
      return user.Email || "User";
    case UserDisplayType.FIRST_NAME:
      // This assumes first name might be stored in a field called firstName
      // Modify as needed for actual user object structure
      return extendedUser.firstName || user.username || "User";
    case UserDisplayType.FULL_NAME:
      // This assumes name fields might be stored as firstName and lastName
      // Modify as needed for actual user object structure
      if (extendedUser.firstName && extendedUser.lastName) {
        return `${extendedUser.firstName} ${extendedUser.lastName}`;
      }
      return extendedUser.fullName || user.username || "User";
    default:
      return user.username || "User";
  }
};

/**
 * Gets the secondary display value for a user based on UI configuration
 */
export const getSecondaryDisplayValue = (user: User | null) => {
  if (!user) return "";

  // Secondary display depends on primary display type
  switch (uiConfig.userDisplayType) {
    case UserDisplayType.USERNAME:
      return user.Email || "";
    case UserDisplayType.EMAIL:
      return user.username || "";
    case UserDisplayType.FIRST_NAME:
    case UserDisplayType.FULL_NAME:
      return user.Email || "";
    default:
      return user.Email || "";
  }
};

/**
 * Gets initials for avatar fallback based on UI configuration
 */
export const getPrimaryDisplayInitials = (user: User | null) => {
  if (!user) return "U";

  const numChars = uiConfig.avatarFallbackChars;
  const extendedUser = user as ExtendedUser;

  switch (uiConfig.userDisplayType) {
    case UserDisplayType.USERNAME:
      return user.username?.substring(0, numChars).toUpperCase() || "U";
    case UserDisplayType.EMAIL:
      // Get first letters of email (before the @)
      const emailName = user.Email?.split("@")[0] || "";
      return emailName.substring(0, numChars).toUpperCase() || "U";
    case UserDisplayType.FIRST_NAME:
      return (
        extendedUser.firstName?.substring(0, numChars).toUpperCase() ||
        user.username?.substring(0, numChars).toUpperCase() ||
        "U"
      );
    case UserDisplayType.FULL_NAME:
      // For full name, try to get first letter of first and last name
      if (extendedUser.firstName && extendedUser.lastName && numChars > 1) {
        return `${extendedUser.firstName[0]}${
          extendedUser.lastName[0]
        }`.toUpperCase();
      }
      // Fallback to first name or username
      return (
        extendedUser.firstName?.substring(0, numChars).toUpperCase() ||
        user.username?.substring(0, numChars).toUpperCase() ||
        "U"
      );
    default:
      return user.username?.substring(0, numChars).toUpperCase() || "U";
  }
};
