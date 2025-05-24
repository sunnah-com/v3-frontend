import 'server-only';
import { Language } from "../proto/api";
import { unstable_cache } from 'next/cache';
import {
  GetAllLanguagesResponse,
  GetAllCollectionsResponse,
  GetAllReferenceTypesResponse
} from "fe/proto/business_api";

// Define a revalidation time
const REVALIDATE_TIME = 3600;

// Helper to determine if we should skip static generation
const shouldSkipStaticGeneration = () => {
  return process.env.SKIP_BUILD_STATIC_GENERATION === 'true';
};

// Dynamic import of business API to avoid build-time execution
async function getDynamicBusinessApi() {
  if (shouldSkipStaticGeneration()) {
    // Return mock data during build
    return {
      getAllLanguages: async () => ({ languages: [] }),
      getAllCollections: async () => ({ collections: [] }),
      getAllReferenceTypes: async () => ({ referenceTypes: [] }),
    };
  }
  
  const { businessApi } = await import('./api-client');
  return businessApi;
}

/**
 * Fetches all languages with dynamic loading
 */
export const getLanguagesWithISR = unstable_cache(
  async (): Promise<GetAllLanguagesResponse> => {
    console.log("Fetching languages via ISR cache wrapper...");
    const api = await getDynamicBusinessApi();
    return await api.getAllLanguages();
  },
  ['languages'],
  {
    revalidate: REVALIDATE_TIME,
    tags: ['languages']
  }
);

/**
 * Fetches all collections with dynamic loading
 */
export const getCollectionsWithISR = unstable_cache(
  async (language: Language): Promise<GetAllCollectionsResponse> => {
    console.log(`Fetching collections for language ${language} via ISR cache wrapper...`);
    const api = await getDynamicBusinessApi();
    return await api.getAllCollections(language);
  },
  ['collections'],
  {
    revalidate: REVALIDATE_TIME,
    tags: ['collections']
  }
);

/**
 * Fetches all reference types with dynamic loading
 */
export const getReferenceTypesWithISR = unstable_cache(
  async (): Promise<GetAllReferenceTypesResponse> => {
    console.log("Fetching reference types via ISR cache wrapper...");
    const api = await getDynamicBusinessApi();
    return await api.getAllReferenceTypes();
  },
  ['referenceTypes'],
  {
    revalidate: REVALIDATE_TIME,
    tags: ['referenceTypes']
  }
);