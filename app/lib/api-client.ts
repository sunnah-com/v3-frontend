/**
 * API client for making requests to the backend
 * Uses Protobuf for serialization of requests and responses for most endpoints,
 * and JSON for error responses and specific endpoints like telemetry.
 */

import { getCookie } from './cookies';
import { captureError } from './telemetry';
import { BinaryReader, BinaryWriter } from '@bufbuild/protobuf/wire';
import { fromBinary } from '@bufbuild/protobuf';
import type { HeadersFunction as Headers } from '@remix-run/node'; // Import type for headers

// Import Protobuf message types and encoders/decoders from npm package source files

// Import types and implementations from compiled JavaScript files
import type {
  User,
  UserSettings,
  Language,
} from '@suhaibinator/sunnah-v3-ts-proto/lib/api';

import type {
  EmailRegistrationRequest,
  EmailRegistrationResponse,
  EmailAuthRequest,
  EmailAuthResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  PasswordChangeRequest,
  PasswordChangeResponse,
  EmailVerificationRequest,
  PasswordResetCompleteRequest,
  OAuthCodeRequest,
  OAuthTokenResponse,
  AuthProvider,
} from '@suhaibinator/sunnah-v3-ts-proto/lib/auth';

import type {
  GetAllLanguagesRequest,
  GetAllLanguagesResponse,
  GetAllCollectionsRequest,
  GetAllCollectionsResponse,
  GetAllReferenceTypesRequest,
  GetAllReferenceTypesResponse,
  GetCollectionByIdRequest,
  GetCollectionByIdResponse,
  GetCollectionByNameRequest,
  GetCollectionByNameResponse,
  GetBookWithDetailedChaptersRequest,
  GetBookWithDetailedChaptersResponse,
  GetBookGroupsByCollectionIdRequest,
  GetBookGroupsByCollectionIdResponse,
  GetHadithRequest,
  GetHadithResponse,
  HadithReferenceIdentifier,
} from '@suhaibinator/sunnah-v3-ts-proto/lib/business_api';

// Import the actual implementations with encode/decode methods
import {
  User as UserImpl,
  UserSettings as UserSettingsImpl,
  Language as LanguageEnum,
} from '@suhaibinator/sunnah-v3-ts-proto/lib/api';

import {
  EmailRegistrationRequest as EmailRegistrationRequestImpl,
  EmailRegistrationResponse as EmailRegistrationResponseImpl,
  EmailAuthRequest as EmailAuthRequestImpl,
  EmailAuthResponse as EmailAuthResponseImpl,
  PasswordResetRequest as PasswordResetRequestImpl,
  PasswordResetResponse as PasswordResetResponseImpl,
  PasswordChangeRequest as PasswordChangeRequestImpl,
  PasswordChangeResponse as PasswordChangeResponseImpl,
  EmailVerificationRequest as EmailVerificationRequestImpl,
  PasswordResetCompleteRequest as PasswordResetCompleteRequestImpl,
  OAuthCodeRequest as OAuthCodeRequestImpl,
  OAuthTokenResponse as OAuthTokenResponseImpl,
  AuthProvider as AuthProviderEnum,
} from '@suhaibinator/sunnah-v3-ts-proto/lib/auth';

import {
  GetAllLanguagesRequest as GetAllLanguagesRequestImpl,
  GetAllLanguagesResponse as GetAllLanguagesResponseImpl,
  GetAllCollectionsRequest as GetAllCollectionsRequestImpl,
  GetAllCollectionsResponse as GetAllCollectionsResponseImpl,
  GetAllReferenceTypesRequest as GetAllReferenceTypesRequestImpl,
  GetAllReferenceTypesResponse as GetAllReferenceTypesResponseImpl,
  GetCollectionByIdRequest as GetCollectionByIdRequestImpl,
  GetCollectionByIdResponse as GetCollectionByIdResponseImpl,
  GetCollectionByNameRequest as GetCollectionByNameRequestImpl,
  GetCollectionByNameResponse as GetCollectionByNameResponseImpl,
  GetBookWithDetailedChaptersRequest as GetBookWithDetailedChaptersRequestImpl,
  GetBookWithDetailedChaptersResponse as GetBookWithDetailedChaptersResponseImpl,
  GetHadithRequest as GetHadithRequestImpl,
  GetHadithResponse as GetHadithResponseImpl,
  HadithReferenceIdentifier as HadithReferenceIdentifierImpl,
  GetBookGroupsByCollectionIdRequest as GetBookGroupsByCollectionIdRequestImpl,
  GetBookGroupsByCollectionIdResponse as GetBookGroupsByCollectionIdResponseImpl,
} from '@suhaibinator/sunnah-v3-ts-proto/lib/business_api';

// Re-export Language enum for use in other files
export { LanguageEnum as Language };

// Environment variables for API URLs
const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"; // For CSR

// Determine INTERNAL_API_URL for SSR/SSG/Build/Runtime Server-Side requests.
// This relies on the INTERNAL_API_URL environment variable being set correctly
// in the respective environment (CI build, Docker build, Docker runtime).
const internalApiUrl =
  process.env.INTERNAL_API_URL || // Use explicitly set INTERNAL_API_URL if available
  (process.env.NODE_ENV === 'development' // Fallback for local development only (`next dev`)
    ? 'http://localhost:8080'
    : NEXT_PUBLIC_API_URL); // Final fallback to public URL if others aren't set (shouldn't happen in prod/ci)

const INTERNAL_API_URL = internalApiUrl;


const AUTH_TOKEN_COOKIE = "auth_token";

// HTTP methods type
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Request options interface
interface RequestOptions {
  headers?: Record<string, string>; // Headers to send *with* the request
  params?: Record<string, string>;
  body?: unknown;
  requiresAuth?: boolean;
  serverHeaders?: Headers | null; // Incoming headers from server context (SSR/RSC)
}

// Error response from the API
interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

/**
 * Custom error class for API errors
 */
export class ApiRequestError extends Error {
  status: number;
  details?: unknown;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiRequestError";
    this.status = error.status;
    this.details = error.details;
  }
}

/**
 * Base request function. Handles URL building, auth headers, error parsing (JSON),
 * and returns the raw Response object for further processing.
 */
async function request(
  method: HttpMethod,
  endpoint: string,
  options: RequestOptions = {},
): Promise<Response> {
  // Determine the base URL based on the execution context
  const isServer = typeof window === 'undefined';
  // Use the determined INTERNAL_API_URL for server-side, NEXT_PUBLIC_API_URL for client-side
  const baseUrl = isServer ? INTERNAL_API_URL : NEXT_PUBLIC_API_URL;

  const url = new URL(`${baseUrl}${endpoint}`);
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const headers: Record<string, string> = { ...options.headers };

  // If running on the server and serverHeaders are provided, forward CF-Connecting-IP
  if (isServer && options.serverHeaders) {
    const cfConnectingIP = options.serverHeaders instanceof Headers 
      ? options.serverHeaders.get('cf-connecting-ip') || options.serverHeaders.get('x-forwarded-for')
      : null;
    if (cfConnectingIP) {
      headers['CF-Connecting-IP'] = cfConnectingIP;
    }
    // You could forward other headers here if needed, e.g., User-Agent
    // const userAgent = options.serverHeaders.get('user-agent');
    // if (userAgent) {
    //   headers['User-Agent'] = userAgent;
    // }
  }

  // Only add Authorization header if requiresAuth is true and token exists
  if (options.requiresAuth) {
    const token = getCookie(AUTH_TOKEN_COOKIE);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      // Optional: Handle case where auth is required but no token exists
      // Could throw an error, redirect to login, etc. For now, just log a warning.
      console.warn(
        `API request to ${endpoint} requires authentication, but no token was found.`
      );
      // Depending on backend behavior, the request might fail anyway without the header.
    }
  }

  const requestOptions: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (method !== "GET" && options.body != null) {
    if (options.body instanceof Uint8Array) {
      headers["Content-Type"] = "application/protobuf";
      requestOptions.body = options.body;
    } else {
      headers["Content-Type"] = "application/json";
      requestOptions.body = JSON.stringify(options.body);
    }
  }
  requestOptions.headers = headers; // Assign potentially modified headers

  try {
    const response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      interface ErrorData {
        error?: { message?: string; trace_id?: string; [key: string]: unknown };
        message?: string;
        details?: unknown;
        [key: string]: unknown;
      }
      let errorData: ErrorData = { message: "" };
      try {
        errorData = await response.json();
      } catch (parseError) {
        errorData.message =
          response.statusText || "API error response is not valid JSON";
        console.error(
          "Failed to parse API error response as JSON:",
          parseError
        );
      }
      const errorMessage =
        errorData.error?.message || errorData.message || "An error occurred";
      const errorDetails = errorData.error || errorData.details;
      const apiError = new ApiRequestError({
        status: response.status,
        message: errorMessage,
        details: errorDetails,
      });
      captureError(apiError, { endpoint, method, status: apiError.status });
      throw apiError;
    }

    return response; // Return raw response on success
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }
    const networkError = new ApiRequestError({
      status: 0,
      message: error instanceof Error ? error.message : "Network error",
    });
    captureError(networkError, { endpoint, method });
    throw networkError;
  }
}

// Import MessageFns type from the package
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};

// Define MessageFns interface to match ts-proto's generated code exactly
interface MessageFns<T> {
  encode(message: T, writer?: import('@bufbuild/protobuf/wire').BinaryWriter): import('@bufbuild/protobuf/wire').BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}

/**
 * Helper function for making requests with Protobuf serialization/deserialization.
 */
async function requestProto<TReq, TRes>(
  method: HttpMethod,
  endpoint: string,
  requestData: TReq,
  requestEncoder: MessageFns<TReq>,
  responseDecoder: MessageFns<TRes>,
  options: Omit<RequestOptions, 'body'> = {}, // Includes requiresAuth and serverHeaders now
): Promise<TRes> {
  // Type assertion to handle protobuf version conflicts between local package and frontend
  const encodedData = (requestEncoder as any).encode(requestData).finish();
  const response = await request(method, endpoint, {
    ...options, // Pass requiresAuth and serverHeaders down
    body: encodedData,
  });
  
  const arrayBuffer = await response.arrayBuffer();
  
  // Ensure we have a valid ArrayBuffer
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error(`Empty or invalid response body from ${endpoint}`);
  }
  
  // Use the frontend's BinaryReader for decoding
  const reader = new BinaryReader(new Uint8Array(arrayBuffer));
  return (responseDecoder as any).decode(reader);
}

/**
 * Authentication API client
 */
export const authApi = {
  async registerEmail(
    email: string,
    password: string,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<EmailRegistrationResponse> {
    const requestData = EmailRegistrationRequestImpl.create({ email, password });
    return requestProto(
      'POST',
      '/auth/email/create',
      requestData,
      EmailRegistrationRequestImpl as any,
      EmailRegistrationResponseImpl as any,
      { serverHeaders }, // Pass headers
    );
  },

  async loginWithEmail(
    email: string,
    password: string,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<EmailAuthResponse> {
    const requestData = EmailAuthRequestImpl.create({ email, password });
    return requestProto(
      'POST',
      '/auth/email/login',
      requestData,
      EmailAuthRequestImpl as any,
      EmailAuthResponseImpl as any,
      { serverHeaders }, // Pass headers
    );
  },

  async changePassword(
    oldPassword: string,
    newPassword: string,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<PasswordChangeResponse> {
    const requestData = PasswordChangeRequestImpl.create({
      oldPassword,
      newPassword,
    });
    return requestProto(
      'POST',
      '/auth/email/change-password',
      requestData,
      PasswordChangeRequestImpl as any,
      PasswordChangeResponseImpl as any,
      { requiresAuth: true, serverHeaders }, // Requires authentication, pass headers
    );
  },

  async requestPasswordReset(
    email: string,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<PasswordResetResponse> {
    const requestData = PasswordResetRequestImpl.create({ email });
    return requestProto(
      'POST',
      '/auth/email/reset-password',
      requestData,
      PasswordResetRequestImpl as any,
      PasswordResetResponseImpl as any,
      { serverHeaders }, // Pass headers
    );
  },

  async completeEmailVerification(
    verificationCode: string,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<EmailAuthResponse> {
    const requestData = EmailVerificationRequestImpl.create({ verificationCode });
    return requestProto(
      'POST',
      '/auth/email/complete-verification',
      requestData,
      EmailVerificationRequestImpl as any,
      EmailAuthResponseImpl as any, // Endpoint returns EmailAuthResponse on success
      { serverHeaders }, // Pass headers
    );
  },

  async completePasswordReset(
    verificationCode: string,
    newPassword: string,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<EmailAuthResponse> {
    const requestData = PasswordResetCompleteRequestImpl.create({
      verificationCode,
      newPassword,
    });
    return requestProto(
      'POST',
      '/auth/email/complete-reset',
      requestData,
      PasswordResetCompleteRequestImpl as any,
      EmailAuthResponseImpl as any, // Endpoint returns EmailAuthResponse on success
      { serverHeaders }, // Pass headers
    );
  },

  // Note: OAuth endpoints are typically handled via redirects, but if there's a direct API call:
  async authenticateWithOAuth(
    code: string,
    provider: AuthProvider,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<OAuthTokenResponse> {
    const requestData = OAuthCodeRequestImpl.create({ code, provider });
    // Assuming an endpoint like '/auth/oauth/callback' or similar based on docs/authentication.md
    // The exact endpoint might need confirmation if it's different from a standard callback handler.
    // Let's assume '/auth/oauth/token' for now if it exchanges code for token directly via API.
    // If it's just a redirect handler, this function might not be needed here.
    // Revisit based on actual OAuth flow implementation.
    // For now, using a placeholder endpoint.
    return requestProto(
      'POST',
      '/auth/oauth/token', // Placeholder: Verify actual endpoint if direct API call exists
      requestData,
      OAuthCodeRequestImpl as any,
      OAuthTokenResponseImpl as any,
      { serverHeaders }, // Pass headers
    );
  },
};

/**
 * User API client
 */
export const userApi = {
  async getCurrentUser(
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<User> {
    // GET request, requires auth, expects Protobuf response
    const response = await request('GET', '/api/user/me', {
      requiresAuth: true,
      serverHeaders, // Pass headers
    });
    const arrayBuffer = await response.arrayBuffer();
    const reader = new BinaryReader(new Uint8Array(arrayBuffer));
    return (UserImpl as any).decode(reader);
  },
};

/**
 * User Settings API client
 */
export const userSettingsApi = {
  async getUserSettings(
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<UserSettings> {
    // GET request, requires auth, expects Protobuf response
    const response = await request('GET', '/api/user/settings', {
      requiresAuth: true,
      serverHeaders, // Pass headers
    });
    const arrayBuffer = await response.arrayBuffer();
    const reader = new BinaryReader(new Uint8Array(arrayBuffer));
    return (UserSettingsImpl as any).decode(reader);
  },

  async updateUserSettings(
    settings: Partial<Omit<UserSettings, 'id' | 'userId'>>,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<UserSettings> {
    // Backend ignores id and userId in request, only uses fields like darkMode, notifications, language
    const requestData = UserSettingsImpl.create({
      id: '', // Ignored by backend
      userId: '', // Ignored by backend
      ...settings,
    });
    return requestProto(
      'PUT',
      '/api/user/settings',
      requestData,
      UserSettingsImpl as any,
      UserSettingsImpl as any,
      { requiresAuth: true, serverHeaders }, // Requires authentication, pass headers
    );
  },
};

/**
 * Business API client (Hadith data)
 */
export const businessApi = {
  async getAllLanguages(
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<GetAllLanguagesResponse> {
    const requestData = GetAllLanguagesRequestImpl.create({});
    return requestProto(
      'POST',
      '/api/languages',
      requestData,
      GetAllLanguagesRequestImpl as any,
      GetAllLanguagesResponseImpl as any,
      { serverHeaders }, // Pass headers
    );
  },

  async getAllCollections(
    language: Language,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<GetAllCollectionsResponse> {
    const requestData = GetAllCollectionsRequestImpl.create({ language });
    return requestProto(
      'POST',
      '/api/collections',
      requestData,
      GetAllCollectionsRequestImpl as any,
      GetAllCollectionsResponseImpl as any,
      { serverHeaders }, // Pass headers
    );
  },

  async getAllReferenceTypes(
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<GetAllReferenceTypesResponse> {
    const requestData = GetAllReferenceTypesRequestImpl.create({});
    return requestProto(
      'POST',
      '/api/reference-types',
      requestData,
      GetAllReferenceTypesRequestImpl as any,
      GetAllReferenceTypesResponseImpl as any,
      { serverHeaders }, // Pass headers
    );
  },

  async getCollectionById(
    collectionId: string,
    language: Language,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<GetCollectionByIdResponse> {
    const requestData = GetCollectionByIdRequestImpl.create({
      collectionId,
      language,
    });
    return requestProto(
      'POST',
      '/api/collections/get-by-id',
      requestData,
      GetCollectionByIdRequestImpl as any,
      GetCollectionByIdResponseImpl as any,
      { serverHeaders }, // Pass headers
    );
  },

  async getCollectionByName(
    collectionName: string,
    language: Language,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<GetCollectionByNameResponse> {
    const requestData = GetCollectionByNameRequestImpl.create({
      collectionName,
      language,
    });
    return requestProto(
      'POST',
      '/api/collections/get-by-name',
      requestData,
      GetCollectionByNameRequestImpl as any,
      GetCollectionByNameResponseImpl as any,
      { serverHeaders }, // Pass headers
    );
  },

  // Helper method that tries to get collection by ID (if numeric) or by name (if string)
  async getCollection(
    identifier: string,
    language: Language,
    serverHeaders?: Headers | null,
  ): Promise<GetCollectionByIdResponse | GetCollectionByNameResponse> {
    // If the identifier is numeric, treat it as an ID
    if (/^\d+$/.test(identifier)) {
      return this.getCollectionById(identifier, language, serverHeaders);
    } else {
      // Otherwise, treat it as a name
      return this.getCollectionByName(identifier, language, serverHeaders);
    }
  },

  async getBookWithDetailedChapters(
    bookId: string,
    language: Language,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<GetBookWithDetailedChaptersResponse> {
    const requestData = GetBookWithDetailedChaptersRequestImpl.create({
      bookId,
      language,
    });
    return requestProto(
      'POST',
      '/api/books/get-detailed',
      requestData,
      GetBookWithDetailedChaptersRequestImpl as any,
      GetBookWithDetailedChaptersResponseImpl as any,
      { serverHeaders }, // Pass headers
    );
  },

  async getHadithById(
    hadithId: string,
    language: Language,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<GetHadithResponse> {
    const requestData = GetHadithRequestImpl.create({ hadithId, language });
    return requestProto(
      'POST',
      '/api/hadiths/get',
      requestData,
      GetHadithRequestImpl as any,
      GetHadithResponseImpl as any,
      { serverHeaders }, // Pass headers
    );
  },

  async getHadithByReference(
    referenceTypeId: number,
    referenceValue: string,
    language: Language,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<GetHadithResponse> {
    const reference = HadithReferenceIdentifierImpl.create({
      referenceTypeId,
      referenceValue,
    });
    const requestData = GetHadithRequestImpl.create({ reference, language });
    return requestProto(
      'POST',
      '/api/hadiths/get',
      requestData,
      GetHadithRequestImpl as any,
      GetHadithResponseImpl as any,
      { serverHeaders }, // Pass headers
    );
  },

  async getBookGroupsByCollectionId(
    collectionId: string,
    language: Language,
    serverHeaders?: Headers | null,
  ): Promise<GetBookGroupsByCollectionIdResponse> {
    const requestData = GetBookGroupsByCollectionIdRequestImpl.create({
      collectionId,
      language,
    });
    return requestProto(
      'POST',
      '/api/collections/get-book-groups',
      requestData,
      GetBookGroupsByCollectionIdRequestImpl as any,
      GetBookGroupsByCollectionIdResponseImpl as any,
      { serverHeaders },
    );
  },
};

/**
 * Telemetry API client
 * Note: This uses JSON as specified in the API documentation.
 */
export const telemetryApi = {
  async sendTelemetry(
    data: unknown,
    serverHeaders?: Headers | null, // Add optional serverHeaders
  ): Promise<{ status: string }> {
    // Use the base 'request' function which handles JSON body automatically
    const response = await request('POST', '/api/faro/collect', {
      body: data, // Sent as JSON
      headers: { 'Content-Type': 'application/json' }, // Explicitly set, though 'request' would infer it
      serverHeaders, // Pass headers
    });
    // Expecting a JSON response like {"status":"success"}
    return response.json();
  },
};

// Note: The generic 'api' object has been removed as requested.
