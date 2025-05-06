/**
 * API client for making requests to the backend
 * Uses Protobuf for serialization of requests and responses for most endpoints,
 * and JSON for error responses and specific endpoints like telemetry.
 */

import { getCookie } from './cookies';
import { captureError } from './telemetry';
import { BinaryReader } from '@bufbuild/protobuf/wire';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'; // Import type for headers

// Import Protobuf message types and encoders/decoders
import { User, UserSettings, Language } from "../proto/api";
import {
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
} from "fe/proto/auth";
import {
  GetAllLanguagesRequest,
  GetAllLanguagesResponse,
  GetAllCollectionsRequest,
  GetAllCollectionsResponse,
  GetAllReferenceTypesRequest,
  GetAllReferenceTypesResponse,
  GetCollectionByIdRequest,
  GetCollectionByIdResponse,
  GetBookWithDetailedChaptersRequest,
  GetBookWithDetailedChaptersResponse,
  GetHadithRequest,
  GetHadithResponse,
  HadithReferenceIdentifier,
} from "fe//proto/business_api";
import { MessageFns } from "../proto/business_models"; // Import MessageFns for type safety

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
  serverHeaders?: ReadonlyHeaders | null; // Incoming headers from server context (SSR/RSC)
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
    const cfConnectingIP = options.serverHeaders.get('cf-connecting-ip');
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
  const encodedData = requestEncoder.encode(requestData).finish();
  const response = await request(method, endpoint, {
    ...options, // Pass requiresAuth and serverHeaders down
    body: encodedData,
  });
  const arrayBuffer = await response.arrayBuffer();
  return responseDecoder.decode(new BinaryReader(new Uint8Array(arrayBuffer)));
}

/**
 * Authentication API client
 */
export const authApi = {
  async registerEmail(
    email: string,
    password: string,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<EmailRegistrationResponse> {
    const requestData = EmailRegistrationRequest.create({ email, password });
    return requestProto(
      'POST',
      '/auth/email/create',
      requestData,
      EmailRegistrationRequest,
      EmailRegistrationResponse,
      { serverHeaders }, // Pass headers
    );
  },

  async loginWithEmail(
    email: string,
    password: string,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<EmailAuthResponse> {
    const requestData = EmailAuthRequest.create({ email, password });
    return requestProto(
      'POST',
      '/auth/email/login',
      requestData,
      EmailAuthRequest,
      EmailAuthResponse,
      { serverHeaders }, // Pass headers
    );
  },

  async changePassword(
    oldPassword: string,
    newPassword: string,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<PasswordChangeResponse> {
    const requestData = PasswordChangeRequest.create({
      oldPassword,
      newPassword,
    });
    return requestProto(
      'POST',
      '/auth/email/change-password',
      requestData,
      PasswordChangeRequest,
      PasswordChangeResponse,
      { requiresAuth: true, serverHeaders }, // Requires authentication, pass headers
    );
  },

  async requestPasswordReset(
    email: string,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<PasswordResetResponse> {
    const requestData = PasswordResetRequest.create({ email });
    return requestProto(
      'POST',
      '/auth/email/reset-password',
      requestData,
      PasswordResetRequest,
      PasswordResetResponse,
      { serverHeaders }, // Pass headers
    );
  },

  async completeEmailVerification(
    verificationCode: string,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<EmailAuthResponse> {
    const requestData = EmailVerificationRequest.create({ verificationCode });
    return requestProto(
      'POST',
      '/auth/email/complete-verification',
      requestData,
      EmailVerificationRequest,
      EmailAuthResponse, // Endpoint returns EmailAuthResponse on success
      { serverHeaders }, // Pass headers
    );
  },

  async completePasswordReset(
    verificationCode: string,
    newPassword: string,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<EmailAuthResponse> {
    const requestData = PasswordResetCompleteRequest.create({
      verificationCode,
      newPassword,
    });
    return requestProto(
      'POST',
      '/auth/email/complete-reset',
      requestData,
      PasswordResetCompleteRequest,
      EmailAuthResponse, // Endpoint returns EmailAuthResponse on success
      { serverHeaders }, // Pass headers
    );
  },

  // Note: OAuth endpoints are typically handled via redirects, but if there's a direct API call:
  async authenticateWithOAuth(
    code: string,
    provider: AuthProvider,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<OAuthTokenResponse> {
    const requestData = OAuthCodeRequest.create({ code, provider });
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
      OAuthCodeRequest,
      OAuthTokenResponse,
      { serverHeaders }, // Pass headers
    );
  },
};

/**
 * User API client
 */
export const userApi = {
  async getCurrentUser(
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<User> {
    // GET request, requires auth, expects Protobuf response
    const response = await request('GET', '/api/user/me', {
      requiresAuth: true,
      serverHeaders, // Pass headers
    });
    const arrayBuffer = await response.arrayBuffer();
    return User.decode(new BinaryReader(new Uint8Array(arrayBuffer)));
  },
};

/**
 * User Settings API client
 */
export const userSettingsApi = {
  async getUserSettings(
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<UserSettings> {
    // GET request, requires auth, expects Protobuf response
    const response = await request('GET', '/api/user/settings', {
      requiresAuth: true,
      serverHeaders, // Pass headers
    });
    const arrayBuffer = await response.arrayBuffer();
    return UserSettings.decode(new BinaryReader(new Uint8Array(arrayBuffer)));
  },

  async updateUserSettings(
    settings: Partial<Omit<UserSettings, 'id' | 'userId'>>,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<UserSettings> {
    // Backend ignores id and userId in request, only uses fields like darkMode, notifications, language
    const requestData = UserSettings.create({
      id: '', // Ignored by backend
      userId: '', // Ignored by backend
      ...settings,
    });
    return requestProto(
      'PUT',
      '/api/user/settings',
      requestData,
      UserSettings,
      UserSettings,
      { requiresAuth: true, serverHeaders }, // Requires authentication, pass headers
    );
  },
};

/**
 * Business API client (Hadith data)
 */
export const businessApi = {
  async getAllLanguages(
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<GetAllLanguagesResponse> {
    const requestData = GetAllLanguagesRequest.create({});
    return requestProto(
      'POST',
      '/api/languages',
      requestData,
      GetAllLanguagesRequest,
      GetAllLanguagesResponse,
      { serverHeaders }, // Pass headers
    );
  },

  async getAllCollections(
    language: Language,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<GetAllCollectionsResponse> {
    const requestData = GetAllCollectionsRequest.create({ language });
    return requestProto(
      'POST',
      '/api/collections',
      requestData,
      GetAllCollectionsRequest,
      GetAllCollectionsResponse,
      { serverHeaders }, // Pass headers
    );
  },

  async getAllReferenceTypes(
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<GetAllReferenceTypesResponse> {
    const requestData = GetAllReferenceTypesRequest.create({});
    return requestProto(
      'POST',
      '/api/reference-types',
      requestData,
      GetAllReferenceTypesRequest,
      GetAllReferenceTypesResponse,
      { serverHeaders }, // Pass headers
    );
  },

  async getCollectionById(
    collectionId: string,
    language: Language,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<GetCollectionByIdResponse> {
    const requestData = GetCollectionByIdRequest.create({
      collectionId,
      language,
    });
    return requestProto(
      'POST',
      '/api/collections/get-by-id',
      requestData,
      GetCollectionByIdRequest,
      GetCollectionByIdResponse,
      { serverHeaders }, // Pass headers
    );
  },

  async getBookWithDetailedChapters(
    bookId: string,
    language: Language,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<GetBookWithDetailedChaptersResponse> {
    const requestData = GetBookWithDetailedChaptersRequest.create({
      bookId,
      language,
    });
    return requestProto(
      'POST',
      '/api/books/get-detailed',
      requestData,
      GetBookWithDetailedChaptersRequest,
      GetBookWithDetailedChaptersResponse,
      { serverHeaders }, // Pass headers
    );
  },

  async getHadithById(
    hadithId: string,
    language: Language,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<GetHadithResponse> {
    const requestData = GetHadithRequest.create({ hadithId, language });
    return requestProto(
      'POST',
      '/api/hadiths/get',
      requestData,
      GetHadithRequest,
      GetHadithResponse,
      { serverHeaders }, // Pass headers
    );
  },

  async getHadithByReference(
    referenceTypeId: string,
    referenceValue: string,
    language: Language,
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
  ): Promise<GetHadithResponse> {
    const reference = HadithReferenceIdentifier.create({
      referenceTypeId,
      referenceValue,
    });
    const requestData = GetHadithRequest.create({ reference, language });
    return requestProto(
      'POST',
      '/api/hadiths/get',
      requestData,
      GetHadithRequest,
      GetHadithResponse,
      { serverHeaders }, // Pass headers
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
    serverHeaders?: ReadonlyHeaders | null, // Add optional serverHeaders
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
