import 'server-only'; // Ensure this module is only used on the server
import { businessApi } from "./api-client";
import { Language } from "../proto/api";
import { unstable_cache } from 'next/cache';
import {
  GetAllLanguagesResponse,
  GetAllCollectionsResponse,
  GetAllReferenceTypesResponse
} from "fe/proto/business_api";

// Define a revalidation time (e.g., 1 hour = 3600 seconds)
// Consider making this configurable via environment variables if needed
const REVALIDATE_TIME = 3600;

/**
 * Fetches all languages using the business API, wrapped with unstable_cache for ISR.
 * @returns {Promise<GetAllLanguagesResponse>} A promise resolving to the languages response.
 */
export const getLanguagesWithISR = unstable_cache(
  async (): Promise<GetAllLanguagesResponse> => {
    console.log("Fetching languages via ISR cache wrapper..."); // Add logging for debugging
    return await businessApi.getAllLanguages();
  },
  ['languages'], // Cache key parts: Ensures this specific function call is cached uniquely
  {
    revalidate: REVALIDATE_TIME, // Revalidate the cache every hour
    tags: ['languages'] // Tag for potential on-demand revalidation
  }
);

/**
 * Fetches all collections for a given language using the business API, wrapped with unstable_cache for ISR.
 * @param {Language} language - The language for which to fetch collections.
 * @returns {Promise<GetAllCollectionsResponse>} A promise resolving to the collections response.
 */
export const getCollectionsWithISR = unstable_cache(
  async (language: Language): Promise<GetAllCollectionsResponse> => {
    console.log(`Fetching collections for language ${language} via ISR cache wrapper...`); // Add logging
    // The 'language' parameter automatically becomes part of the cache key,
    // ensuring different languages have separate cache entries.
    return await businessApi.getAllCollections(language);
  },
  ['collections'], // Base cache key part
  {
    revalidate: REVALIDATE_TIME,
    tags: ['collections'] // Tag for on-demand revalidation (general)
    // Note: Removed language-specific tag `collections-${language}` due to scope issues.
    // Revalidating 'collections' will invalidate cache for all languages.
  }
);

/**
 * Fetches all reference types using the business API, wrapped with unstable_cache for ISR.
 * @returns {Promise<GetAllReferenceTypesResponse>} A promise resolving to the reference types response.
 */
export const getReferenceTypesWithISR = unstable_cache(
  async (): Promise<GetAllReferenceTypesResponse> => {
    console.log("Fetching reference types via ISR cache wrapper..."); // Add logging
    return await businessApi.getAllReferenceTypes();
  },
  ['referenceTypes'], // Cache key parts
  {
    revalidate: REVALIDATE_TIME,
    tags: ['referenceTypes'] // Tag for on-demand revalidation
  }
);

// Add more wrapped functions here as needed for other static data types
