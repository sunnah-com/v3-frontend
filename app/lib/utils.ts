import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Collection } from "~/types"

// Define the API types for collections
export interface CollectionWithoutBooks {
  id: string;
  title: string;
  translatedTitle: string;
  introduction?: string;
  numBooks: number;
  numHadiths: number;
}

export interface DetailedCollection {
  id: string;
  name: string;
  translatedName: string;
  introduction?: string;
  numBooks: number;
  numHadiths: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a singular or plural form of a word based on count
 * @param count The count to check
 * @param singular The singular form of the word
 * @param plural The plural form of the word
 * @returns The appropriate form based on count
 */
export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

/**
 * Map API collection types to frontend Collection type
 * This function handles both CollectionWithoutBooks and DetailedCollection
 */
export function mapCollectionToFrontend(apiCollection: CollectionWithoutBooks | DetailedCollection): Collection {
  // Check if it's a CollectionWithoutBooks type (has title and translatedTitle)
  if ('title' in apiCollection && 'translatedTitle' in apiCollection) {
    return {
      id: apiCollection.id,
      name: apiCollection.translatedTitle,
      nameArabic: apiCollection.title,
      description: apiCollection.introduction || "",
      bookCount: apiCollection.numBooks,
      hadithCount: apiCollection.numHadiths,
    };
  }
  
  // Otherwise it's a DetailedCollection type (has name and translatedName)
  return {
    id: apiCollection.id,
    name: (apiCollection as DetailedCollection).translatedName,
    nameArabic: (apiCollection as DetailedCollection).name,
    description: apiCollection.introduction || "",
    bookCount: apiCollection.numBooks,
    hadithCount: apiCollection.numHadiths,
  };
}
