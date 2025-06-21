import type { Collection } from "~/types";
import { businessApi } from "~/lib/api-client";
import { Language } from "@suhaibinator/sunnah-v3-ts-proto/lib/api";
import { mapCollectionToFrontend } from "~/lib/utils";

// Mock collections data (temporary until protobuf implementation)
const MOCK_COLLECTIONS: any[] = [
  {
    id: "bukhari",
    translatedName: "Sahih al-Bukhari",
    name: "صحيح البخاري",
    introduction: "Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad al-Bukhari. The collection is recognized by the overwhelming majority of the Muslim world to be the most authentic collection of reports of the Sunnah of the Prophet Muhammad.",
    numBooks: 97,
    numHadiths: 7563
  },
  {
    id: "muslim",
    translatedName: "Sahih Muslim",
    name: "صحيح مسلم",
    introduction: "Sahih Muslim is a collection of hadith compiled by Imam Muslim ibn al-Hajjaj. It is considered to be one of the most authentic collections of hadith, alongside Sahih al-Bukhari.",
    numBooks: 54,
    numHadiths: 7563
  },
  {
    id: "nasai",
    translatedName: "Sunan an-Nasa'i",
    name: "سنن النسائي",
    introduction: "Sunan an-Nasa'i is one of the six major hadith collections. It was compiled by Imam Ahmad an-Nasa'i.",
    numBooks: 52,
    numHadiths: 5761
  },
  {
    id: "abudawud",
    translatedName: "Sunan Abi Dawud",
    name: "سنن أبي داود",
    introduction: "Sunan Abi Dawud is a collection of hadith compiled by Imam Abu Dawud Sulayman ibn al-Ash'ath as-Sijistani. It is widely considered to be among the six canonical collections of hadith.",
    numBooks: 43,
    numHadiths: 5274
  }
];

/**
 * Get all collections
 * @returns Promise resolving to collection data
 */
export async function getAllCollections(): Promise<Collection[]> {
  try {
    // Fetch from the real API
    const response = await businessApi.getAllCollections(Language.LANGUAGE_ENGLISH);
    
    // Transform API response to our frontend model
    if (response.collections && response.collections.length > 0) {
      return response.collections.map(mapCollectionToFrontend);
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    
    // Fallback to mock data in case of error
    return MOCK_COLLECTIONS.map(mapCollectionToFrontend);
  }
}

/**
 * Get a specific collection by ID
 * @param id Collection ID
 * @returns Promise resolving to collection data or null if not found
 */
export async function getCollectionById(id: string): Promise<Collection | null> {
  try {
    // Fetch from the real API
    const response = await businessApi.getCollectionById(id, Language.LANGUAGE_ENGLISH);
    
    // Transform API response to our frontend model
    if (response.collection) {
      return mapCollectionToFrontend(response.collection);
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch collection ${id}:`, error);
    
    // Fallback to mock data in case of error
    const collection = MOCK_COLLECTIONS.find(c => c.id === id);
    return collection ? mapCollectionToFrontend(collection) : null;
  }
} 