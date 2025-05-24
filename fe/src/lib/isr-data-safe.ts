import 'server-only';
import { businessApi } from "./api-client";
import { Language } from "../proto/api";
import { unstable_cache } from 'next/cache';
import {
  GetAllLanguagesResponse,
  GetAllCollectionsResponse,
  GetAllReferenceTypesResponse
} from "fe/proto/business_api";

// Define a revalidation time (e.g., 1 hour = 3600 seconds)
const REVALIDATE_TIME = 3600;

// Default empty responses for when API is unavailable
const EMPTY_LANGUAGES_RESPONSE: GetAllLanguagesResponse = {
  languages: [Language.LANGUAGE_ENGLISH, Language.LANGUAGE_ARABIC],
};

const EMPTY_COLLECTIONS_RESPONSE: GetAllCollectionsResponse = {
  collections: [],
};

const EMPTY_REFERENCE_TYPES_RESPONSE: GetAllReferenceTypesResponse = {
  referenceTypes: [],
};

/**
 * Wrapper to safely call API with fallback
 */
async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallback: T,
  errorContext: string
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    // During build time, if API is unavailable, return fallback
    if (process.env.NODE_ENV === 'production' && !process.env.INTERNAL_API_URL) {
      console.warn(`${errorContext}: API unavailable during build, using fallback data`);
      return fallback;
    }
    
    // Log error but don't fail the build
    console.error(`${errorContext}: API call failed`, error);
    
    // In development or if explicitly configured, throw the error
    if (process.env.FAIL_ON_API_ERROR === 'true') {
      throw error;
    }
    
    return fallback;
  }
}

/**
 * Fetches all languages using the business API, wrapped with unstable_cache for ISR.
 * Falls back to default languages if API is unavailable.
 */
export const getLanguagesWithISR = unstable_cache(
  async (): Promise<GetAllLanguagesResponse> => {
    console.log("Fetching languages via ISR cache wrapper...");
    return await safeApiCall(
      () => businessApi.getAllLanguages(),
      EMPTY_LANGUAGES_RESPONSE,
      'getLanguagesWithISR'
    );
  },
  ['languages'],
  {
    revalidate: REVALIDATE_TIME,
    tags: ['languages']
  }
);

/**
 * Fetches all collections for a given language using the business API, wrapped with unstable_cache for ISR.
 * Falls back to empty collections if API is unavailable.
 */
export const getCollectionsWithISR = unstable_cache(
  async (language: Language): Promise<GetAllCollectionsResponse> => {
    console.log(`Fetching collections for language ${language} via ISR cache wrapper...`);
    return await safeApiCall(
      () => businessApi.getAllCollections(language),
      EMPTY_COLLECTIONS_RESPONSE,
      `getCollectionsWithISR(${language})`
    );
  },
  ['collections'],
  {
    revalidate: REVALIDATE_TIME,
    tags: ['collections']
  }
);

/**
 * Fetches all reference types using the business API, wrapped with unstable_cache for ISR.
 * Falls back to empty reference types if API is unavailable.
 */
export const getReferenceTypesWithISR = unstable_cache(
  async (): Promise<GetAllReferenceTypesResponse> => {
    console.log("Fetching reference types via ISR cache wrapper...");
    return await safeApiCall(
      () => businessApi.getAllReferenceTypes(),
      EMPTY_REFERENCE_TYPES_RESPONSE,
      'getReferenceTypesWithISR'
    );
  },
  ['referenceTypes'],
  {
    revalidate: REVALIDATE_TIME,
    tags: ['referenceTypes']
  }
);