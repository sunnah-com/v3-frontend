// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v5.29.3
// source: auth.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "sunnahcom.auth.v1";

export enum AuthProvider {
  /** AUTH_PROVIDER_UNSPECIFIED - Default unspecified state */
  AUTH_PROVIDER_UNSPECIFIED = 0,
  /** AUTH_PROVIDER_GOOGLE - Google authentication */
  AUTH_PROVIDER_GOOGLE = 1,
  /** AUTH_PROVIDER_FACEBOOK - Facebook authentication */
  AUTH_PROVIDER_FACEBOOK = 2,
  /** AUTH_PROVIDER_TWITTER - X (formerly Twitter) authentication */
  AUTH_PROVIDER_TWITTER = 3,
  /** AUTH_PROVIDER_GITHUB - GitHub authentication */
  AUTH_PROVIDER_GITHUB = 4,
  /** AUTH_PROVIDER_DISCORD - Discord authentication */
  AUTH_PROVIDER_DISCORD = 5,
  /** AUTH_PROVIDER_APPLE - Apple authentication */
  AUTH_PROVIDER_APPLE = 6,
  /** AUTH_PROVIDER_LINKEDIN - LinkedIn authentication */
  AUTH_PROVIDER_LINKEDIN = 7,
  /** AUTH_PROVIDER_EMAIL - Email/password authentication */
  AUTH_PROVIDER_EMAIL = 8,
  /** AUTH_PROVIDER_PASSWORD_RESET - Password reset authentication */
  AUTH_PROVIDER_PASSWORD_RESET = 9,
  UNRECOGNIZED = -1,
}

export function authProviderFromJSON(object: any): AuthProvider {
  switch (object) {
    case 0:
    case "AUTH_PROVIDER_UNSPECIFIED":
      return AuthProvider.AUTH_PROVIDER_UNSPECIFIED;
    case 1:
    case "AUTH_PROVIDER_GOOGLE":
      return AuthProvider.AUTH_PROVIDER_GOOGLE;
    case 2:
    case "AUTH_PROVIDER_FACEBOOK":
      return AuthProvider.AUTH_PROVIDER_FACEBOOK;
    case 3:
    case "AUTH_PROVIDER_TWITTER":
      return AuthProvider.AUTH_PROVIDER_TWITTER;
    case 4:
    case "AUTH_PROVIDER_GITHUB":
      return AuthProvider.AUTH_PROVIDER_GITHUB;
    case 5:
    case "AUTH_PROVIDER_DISCORD":
      return AuthProvider.AUTH_PROVIDER_DISCORD;
    case 6:
    case "AUTH_PROVIDER_APPLE":
      return AuthProvider.AUTH_PROVIDER_APPLE;
    case 7:
    case "AUTH_PROVIDER_LINKEDIN":
      return AuthProvider.AUTH_PROVIDER_LINKEDIN;
    case 8:
    case "AUTH_PROVIDER_EMAIL":
      return AuthProvider.AUTH_PROVIDER_EMAIL;
    case 9:
    case "AUTH_PROVIDER_PASSWORD_RESET":
      return AuthProvider.AUTH_PROVIDER_PASSWORD_RESET;
    case -1:
    case "UNRECOGNIZED":
    default:
      return AuthProvider.UNRECOGNIZED;
  }
}

export function authProviderToJSON(object: AuthProvider): string {
  switch (object) {
    case AuthProvider.AUTH_PROVIDER_UNSPECIFIED:
      return "AUTH_PROVIDER_UNSPECIFIED";
    case AuthProvider.AUTH_PROVIDER_GOOGLE:
      return "AUTH_PROVIDER_GOOGLE";
    case AuthProvider.AUTH_PROVIDER_FACEBOOK:
      return "AUTH_PROVIDER_FACEBOOK";
    case AuthProvider.AUTH_PROVIDER_TWITTER:
      return "AUTH_PROVIDER_TWITTER";
    case AuthProvider.AUTH_PROVIDER_GITHUB:
      return "AUTH_PROVIDER_GITHUB";
    case AuthProvider.AUTH_PROVIDER_DISCORD:
      return "AUTH_PROVIDER_DISCORD";
    case AuthProvider.AUTH_PROVIDER_APPLE:
      return "AUTH_PROVIDER_APPLE";
    case AuthProvider.AUTH_PROVIDER_LINKEDIN:
      return "AUTH_PROVIDER_LINKEDIN";
    case AuthProvider.AUTH_PROVIDER_EMAIL:
      return "AUTH_PROVIDER_EMAIL";
    case AuthProvider.AUTH_PROVIDER_PASSWORD_RESET:
      return "AUTH_PROVIDER_PASSWORD_RESET";
    case AuthProvider.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum TokenType {
  /** TOKEN_TYPE_UNSPECIFIED - Default unspecified state */
  TOKEN_TYPE_UNSPECIFIED = 0,
  /** TOKEN_TYPE_AUTHENTICATION - Standard session authentication token */
  TOKEN_TYPE_AUTHENTICATION = 1,
  /** TOKEN_TYPE_EMAIL_VERIFICATION - Token for verifying email address */
  TOKEN_TYPE_EMAIL_VERIFICATION = 2,
  /** TOKEN_TYPE_PASSWORD_RESET - Token for initiating password reset */
  TOKEN_TYPE_PASSWORD_RESET = 3,
  UNRECOGNIZED = -1,
}

export function tokenTypeFromJSON(object: any): TokenType {
  switch (object) {
    case 0:
    case "TOKEN_TYPE_UNSPECIFIED":
      return TokenType.TOKEN_TYPE_UNSPECIFIED;
    case 1:
    case "TOKEN_TYPE_AUTHENTICATION":
      return TokenType.TOKEN_TYPE_AUTHENTICATION;
    case 2:
    case "TOKEN_TYPE_EMAIL_VERIFICATION":
      return TokenType.TOKEN_TYPE_EMAIL_VERIFICATION;
    case 3:
    case "TOKEN_TYPE_PASSWORD_RESET":
      return TokenType.TOKEN_TYPE_PASSWORD_RESET;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TokenType.UNRECOGNIZED;
  }
}

export function tokenTypeToJSON(object: TokenType): string {
  switch (object) {
    case TokenType.TOKEN_TYPE_UNSPECIFIED:
      return "TOKEN_TYPE_UNSPECIFIED";
    case TokenType.TOKEN_TYPE_AUTHENTICATION:
      return "TOKEN_TYPE_AUTHENTICATION";
    case TokenType.TOKEN_TYPE_EMAIL_VERIFICATION:
      return "TOKEN_TYPE_EMAIL_VERIFICATION";
    case TokenType.TOKEN_TYPE_PASSWORD_RESET:
      return "TOKEN_TYPE_PASSWORD_RESET";
    case TokenType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * --------------------
 * Email Registration Messages
 * --------------------
 */
export interface EmailRegistrationRequest {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

export interface EmailRegistrationResponse {
  /** Whether the registration was successful */
  success: boolean;
  /** Message indicating the result of the registration */
  message?: string | undefined;
}

/** Request for email/password authentication */
export interface EmailAuthRequest {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Response for email/password authentication
 * Uses the same response type as OAuth authentication
 */
export interface EmailAuthResponse {
  /** Generated token for the user */
  generatedToken: string;
}

/** Request to reset a password */
export interface PasswordResetRequest {
  /** Email address of the account */
  email: string;
}

/** Response to a password reset request */
export interface PasswordResetResponse {
  /** Whether the reset email was sent successfully */
  success: boolean;
}

/** Request to change a password */
export interface PasswordChangeRequest {
  /** Current password */
  oldPassword: string;
  /** New password */
  newPassword: string;
}

/** Response to a password change request */
export interface PasswordChangeResponse {
  /** Whether the password was changed successfully */
  success: boolean;
}

/** Request to complete password reset using a verification code and new password */
export interface PasswordResetCompleteRequest {
  /** Verification code sent to the email */
  verificationCode: string;
  /** The new password chosen by the user */
  newPassword: string;
}

/** Request to verify an email address using a verification code */
export interface EmailVerificationRequest {
  /** Verification code sent to the email - Renumbered field */
  verificationCode: string;
}

/**
 * Response for email verification processes
 * Used for both account creation and password reset flows:
 * - For account creation:
 *   * Success: returns true with no message
 *   * Failure: returns false with error details (e.g., expired code)
 * - For password reset:
 *   * Success: returns true with a new authentication token (in the EmailAuthResponse message used by the API endpoint).
 *   * Failure: returns false with failure reason.
 * Note: The API endpoint (`/auth/email/complete-reset`) actually returns an EmailAuthResponse containing the new authentication token on success, not this message directly.
 */
export interface EmailVerificationResponse {
  /** Verification success status */
  success: boolean;
  /** Optional result message or error details */
  message?: string | undefined;
}

export interface OAuthCodeRequest {
  /** OAuth code from the provider */
  code: string;
  /** OAuth provider */
  provider: AuthProvider;
}

export interface OAuthTokenResponse {
  /** Generated token for the user */
  generatedToken: string;
}

function createBaseEmailRegistrationRequest(): EmailRegistrationRequest {
  return { email: "", password: "" };
}

export const EmailRegistrationRequest: MessageFns<EmailRegistrationRequest> = {
  encode(message: EmailRegistrationRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.email !== "") {
      writer.uint32(10).string(message.email);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): EmailRegistrationRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmailRegistrationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EmailRegistrationRequest {
    return {
      email: isSet(object.email) ? globalThis.String(object.email) : "",
      password: isSet(object.password) ? globalThis.String(object.password) : "",
    };
  },

  toJSON(message: EmailRegistrationRequest): unknown {
    const obj: any = {};
    if (message.email !== "") {
      obj.email = message.email;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EmailRegistrationRequest>, I>>(base?: I): EmailRegistrationRequest {
    return EmailRegistrationRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EmailRegistrationRequest>, I>>(object: I): EmailRegistrationRequest {
    const message = createBaseEmailRegistrationRequest();
    message.email = object.email ?? "";
    message.password = object.password ?? "";
    return message;
  },
};

function createBaseEmailRegistrationResponse(): EmailRegistrationResponse {
  return { success: false, message: undefined };
}

export const EmailRegistrationResponse: MessageFns<EmailRegistrationResponse> = {
  encode(message: EmailRegistrationResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.success !== false) {
      writer.uint32(8).bool(message.success);
    }
    if (message.message !== undefined) {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): EmailRegistrationResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmailRegistrationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.success = reader.bool();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.message = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EmailRegistrationResponse {
    return {
      success: isSet(object.success) ? globalThis.Boolean(object.success) : false,
      message: isSet(object.message) ? globalThis.String(object.message) : undefined,
    };
  },

  toJSON(message: EmailRegistrationResponse): unknown {
    const obj: any = {};
    if (message.success !== false) {
      obj.success = message.success;
    }
    if (message.message !== undefined) {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EmailRegistrationResponse>, I>>(base?: I): EmailRegistrationResponse {
    return EmailRegistrationResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EmailRegistrationResponse>, I>>(object: I): EmailRegistrationResponse {
    const message = createBaseEmailRegistrationResponse();
    message.success = object.success ?? false;
    message.message = object.message ?? undefined;
    return message;
  },
};

function createBaseEmailAuthRequest(): EmailAuthRequest {
  return { email: "", password: "" };
}

export const EmailAuthRequest: MessageFns<EmailAuthRequest> = {
  encode(message: EmailAuthRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.email !== "") {
      writer.uint32(10).string(message.email);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): EmailAuthRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmailAuthRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EmailAuthRequest {
    return {
      email: isSet(object.email) ? globalThis.String(object.email) : "",
      password: isSet(object.password) ? globalThis.String(object.password) : "",
    };
  },

  toJSON(message: EmailAuthRequest): unknown {
    const obj: any = {};
    if (message.email !== "") {
      obj.email = message.email;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EmailAuthRequest>, I>>(base?: I): EmailAuthRequest {
    return EmailAuthRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EmailAuthRequest>, I>>(object: I): EmailAuthRequest {
    const message = createBaseEmailAuthRequest();
    message.email = object.email ?? "";
    message.password = object.password ?? "";
    return message;
  },
};

function createBaseEmailAuthResponse(): EmailAuthResponse {
  return { generatedToken: "" };
}

export const EmailAuthResponse: MessageFns<EmailAuthResponse> = {
  encode(message: EmailAuthResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.generatedToken !== "") {
      writer.uint32(10).string(message.generatedToken);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): EmailAuthResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmailAuthResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.generatedToken = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EmailAuthResponse {
    return { generatedToken: isSet(object.generatedToken) ? globalThis.String(object.generatedToken) : "" };
  },

  toJSON(message: EmailAuthResponse): unknown {
    const obj: any = {};
    if (message.generatedToken !== "") {
      obj.generatedToken = message.generatedToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EmailAuthResponse>, I>>(base?: I): EmailAuthResponse {
    return EmailAuthResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EmailAuthResponse>, I>>(object: I): EmailAuthResponse {
    const message = createBaseEmailAuthResponse();
    message.generatedToken = object.generatedToken ?? "";
    return message;
  },
};

function createBasePasswordResetRequest(): PasswordResetRequest {
  return { email: "" };
}

export const PasswordResetRequest: MessageFns<PasswordResetRequest> = {
  encode(message: PasswordResetRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.email !== "") {
      writer.uint32(10).string(message.email);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PasswordResetRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePasswordResetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.email = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PasswordResetRequest {
    return { email: isSet(object.email) ? globalThis.String(object.email) : "" };
  },

  toJSON(message: PasswordResetRequest): unknown {
    const obj: any = {};
    if (message.email !== "") {
      obj.email = message.email;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PasswordResetRequest>, I>>(base?: I): PasswordResetRequest {
    return PasswordResetRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PasswordResetRequest>, I>>(object: I): PasswordResetRequest {
    const message = createBasePasswordResetRequest();
    message.email = object.email ?? "";
    return message;
  },
};

function createBasePasswordResetResponse(): PasswordResetResponse {
  return { success: false };
}

export const PasswordResetResponse: MessageFns<PasswordResetResponse> = {
  encode(message: PasswordResetResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.success !== false) {
      writer.uint32(8).bool(message.success);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PasswordResetResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePasswordResetResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.success = reader.bool();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PasswordResetResponse {
    return { success: isSet(object.success) ? globalThis.Boolean(object.success) : false };
  },

  toJSON(message: PasswordResetResponse): unknown {
    const obj: any = {};
    if (message.success !== false) {
      obj.success = message.success;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PasswordResetResponse>, I>>(base?: I): PasswordResetResponse {
    return PasswordResetResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PasswordResetResponse>, I>>(object: I): PasswordResetResponse {
    const message = createBasePasswordResetResponse();
    message.success = object.success ?? false;
    return message;
  },
};

function createBasePasswordChangeRequest(): PasswordChangeRequest {
  return { oldPassword: "", newPassword: "" };
}

export const PasswordChangeRequest: MessageFns<PasswordChangeRequest> = {
  encode(message: PasswordChangeRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.oldPassword !== "") {
      writer.uint32(10).string(message.oldPassword);
    }
    if (message.newPassword !== "") {
      writer.uint32(18).string(message.newPassword);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PasswordChangeRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePasswordChangeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.oldPassword = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.newPassword = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PasswordChangeRequest {
    return {
      oldPassword: isSet(object.oldPassword) ? globalThis.String(object.oldPassword) : "",
      newPassword: isSet(object.newPassword) ? globalThis.String(object.newPassword) : "",
    };
  },

  toJSON(message: PasswordChangeRequest): unknown {
    const obj: any = {};
    if (message.oldPassword !== "") {
      obj.oldPassword = message.oldPassword;
    }
    if (message.newPassword !== "") {
      obj.newPassword = message.newPassword;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PasswordChangeRequest>, I>>(base?: I): PasswordChangeRequest {
    return PasswordChangeRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PasswordChangeRequest>, I>>(object: I): PasswordChangeRequest {
    const message = createBasePasswordChangeRequest();
    message.oldPassword = object.oldPassword ?? "";
    message.newPassword = object.newPassword ?? "";
    return message;
  },
};

function createBasePasswordChangeResponse(): PasswordChangeResponse {
  return { success: false };
}

export const PasswordChangeResponse: MessageFns<PasswordChangeResponse> = {
  encode(message: PasswordChangeResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.success !== false) {
      writer.uint32(8).bool(message.success);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PasswordChangeResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePasswordChangeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.success = reader.bool();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PasswordChangeResponse {
    return { success: isSet(object.success) ? globalThis.Boolean(object.success) : false };
  },

  toJSON(message: PasswordChangeResponse): unknown {
    const obj: any = {};
    if (message.success !== false) {
      obj.success = message.success;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PasswordChangeResponse>, I>>(base?: I): PasswordChangeResponse {
    return PasswordChangeResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PasswordChangeResponse>, I>>(object: I): PasswordChangeResponse {
    const message = createBasePasswordChangeResponse();
    message.success = object.success ?? false;
    return message;
  },
};

function createBasePasswordResetCompleteRequest(): PasswordResetCompleteRequest {
  return { verificationCode: "", newPassword: "" };
}

export const PasswordResetCompleteRequest: MessageFns<PasswordResetCompleteRequest> = {
  encode(message: PasswordResetCompleteRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.verificationCode !== "") {
      writer.uint32(10).string(message.verificationCode);
    }
    if (message.newPassword !== "") {
      writer.uint32(18).string(message.newPassword);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PasswordResetCompleteRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePasswordResetCompleteRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.verificationCode = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.newPassword = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PasswordResetCompleteRequest {
    return {
      verificationCode: isSet(object.verificationCode) ? globalThis.String(object.verificationCode) : "",
      newPassword: isSet(object.newPassword) ? globalThis.String(object.newPassword) : "",
    };
  },

  toJSON(message: PasswordResetCompleteRequest): unknown {
    const obj: any = {};
    if (message.verificationCode !== "") {
      obj.verificationCode = message.verificationCode;
    }
    if (message.newPassword !== "") {
      obj.newPassword = message.newPassword;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PasswordResetCompleteRequest>, I>>(base?: I): PasswordResetCompleteRequest {
    return PasswordResetCompleteRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PasswordResetCompleteRequest>, I>>(object: I): PasswordResetCompleteRequest {
    const message = createBasePasswordResetCompleteRequest();
    message.verificationCode = object.verificationCode ?? "";
    message.newPassword = object.newPassword ?? "";
    return message;
  },
};

function createBaseEmailVerificationRequest(): EmailVerificationRequest {
  return { verificationCode: "" };
}

export const EmailVerificationRequest: MessageFns<EmailVerificationRequest> = {
  encode(message: EmailVerificationRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.verificationCode !== "") {
      writer.uint32(10).string(message.verificationCode);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): EmailVerificationRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmailVerificationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.verificationCode = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EmailVerificationRequest {
    return { verificationCode: isSet(object.verificationCode) ? globalThis.String(object.verificationCode) : "" };
  },

  toJSON(message: EmailVerificationRequest): unknown {
    const obj: any = {};
    if (message.verificationCode !== "") {
      obj.verificationCode = message.verificationCode;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EmailVerificationRequest>, I>>(base?: I): EmailVerificationRequest {
    return EmailVerificationRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EmailVerificationRequest>, I>>(object: I): EmailVerificationRequest {
    const message = createBaseEmailVerificationRequest();
    message.verificationCode = object.verificationCode ?? "";
    return message;
  },
};

function createBaseEmailVerificationResponse(): EmailVerificationResponse {
  return { success: false, message: undefined };
}

export const EmailVerificationResponse: MessageFns<EmailVerificationResponse> = {
  encode(message: EmailVerificationResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.success !== false) {
      writer.uint32(8).bool(message.success);
    }
    if (message.message !== undefined) {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): EmailVerificationResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmailVerificationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.success = reader.bool();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.message = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EmailVerificationResponse {
    return {
      success: isSet(object.success) ? globalThis.Boolean(object.success) : false,
      message: isSet(object.message) ? globalThis.String(object.message) : undefined,
    };
  },

  toJSON(message: EmailVerificationResponse): unknown {
    const obj: any = {};
    if (message.success !== false) {
      obj.success = message.success;
    }
    if (message.message !== undefined) {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EmailVerificationResponse>, I>>(base?: I): EmailVerificationResponse {
    return EmailVerificationResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EmailVerificationResponse>, I>>(object: I): EmailVerificationResponse {
    const message = createBaseEmailVerificationResponse();
    message.success = object.success ?? false;
    message.message = object.message ?? undefined;
    return message;
  },
};

function createBaseOAuthCodeRequest(): OAuthCodeRequest {
  return { code: "", provider: 0 };
}

export const OAuthCodeRequest: MessageFns<OAuthCodeRequest> = {
  encode(message: OAuthCodeRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.code !== "") {
      writer.uint32(10).string(message.code);
    }
    if (message.provider !== 0) {
      writer.uint32(16).int32(message.provider);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): OAuthCodeRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOAuthCodeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.code = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.provider = reader.int32() as any;
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OAuthCodeRequest {
    return {
      code: isSet(object.code) ? globalThis.String(object.code) : "",
      provider: isSet(object.provider) ? authProviderFromJSON(object.provider) : 0,
    };
  },

  toJSON(message: OAuthCodeRequest): unknown {
    const obj: any = {};
    if (message.code !== "") {
      obj.code = message.code;
    }
    if (message.provider !== 0) {
      obj.provider = authProviderToJSON(message.provider);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OAuthCodeRequest>, I>>(base?: I): OAuthCodeRequest {
    return OAuthCodeRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OAuthCodeRequest>, I>>(object: I): OAuthCodeRequest {
    const message = createBaseOAuthCodeRequest();
    message.code = object.code ?? "";
    message.provider = object.provider ?? 0;
    return message;
  },
};

function createBaseOAuthTokenResponse(): OAuthTokenResponse {
  return { generatedToken: "" };
}

export const OAuthTokenResponse: MessageFns<OAuthTokenResponse> = {
  encode(message: OAuthTokenResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.generatedToken !== "") {
      writer.uint32(10).string(message.generatedToken);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): OAuthTokenResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOAuthTokenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.generatedToken = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OAuthTokenResponse {
    return { generatedToken: isSet(object.generatedToken) ? globalThis.String(object.generatedToken) : "" };
  },

  toJSON(message: OAuthTokenResponse): unknown {
    const obj: any = {};
    if (message.generatedToken !== "") {
      obj.generatedToken = message.generatedToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OAuthTokenResponse>, I>>(base?: I): OAuthTokenResponse {
    return OAuthTokenResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OAuthTokenResponse>, I>>(object: I): OAuthTokenResponse {
    const message = createBaseOAuthTokenResponse();
    message.generatedToken = object.generatedToken ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
