import { businessApi } from "~/lib/api-client";
import { Language } from "~/proto/api";
import type { Collection } from "~/types";
import { apiDetailedCollectionToCollection, apiSimpleBookToBook } from "~/types";

// In-memory cache for development
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const CACHE_TTL = {
  COLLECTIONS: 60 * 60 * 1000, // 1 hour
  COLLECTION_DETAILS: 30 * 60 * 1000, // 30 minutes
  BOOKS: 30 * 60 * 1000, // 30 minutes
} as const;

function getCacheKey(type: string, ...args: string[]): string {
  return `${type}:${args.join(':')}`;
}

function isCacheValid(item: { timestamp: number; ttl: number }): boolean {
  return Date.now() - item.timestamp < item.ttl;
}

function setCache(key: string, data: any, ttl: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

function getCache<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item || !isCacheValid(item)) {
    cache.delete(key);
    return null;
  }
  return item.data as T;
}

/**
 * Get all collections with basic info - cached
 */
export async function getCachedCollections(): Promise<Collection[]> {
  const cacheKey = getCacheKey('collections', Language.LANGUAGE_ENGLISH.toString());
  
  // Try cache first
  const cached = getCache<Collection[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await businessApi.getAllCollections(Language.LANGUAGE_ENGLISH);
    const collections = response.collections?.map(apiCollection => ({
      id: apiCollection.id,
      name: apiCollection.translatedTitle,
      nameArabic: apiCollection.title,
      description: apiCollection.introduction || "",
      bookCount: apiCollection.numBooks,
      hadithCount: apiCollection.numHadiths,
    })) || [];

    setCache(cacheKey, collections, CACHE_TTL.COLLECTIONS);
    return collections;
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
}

/**
 * Get detailed collection with books - cached
 */
export async function getCachedCollectionWithBooks(collectionId: string) {
  const cacheKey = getCacheKey('collection_details', collectionId, Language.LANGUAGE_ENGLISH.toString());
  
  // Try cache first
  const cached = getCache<{ collection: any; books: any[] }>(cacheKey);
  if (cached) {
    console.log(`📋 Cache hit for collection ${collectionId}, books count:`, cached.books?.length || 0);
    return cached;
  }

  try {
    console.log(`🔍 Fetching collection ${collectionId} from API...`);
    const response = await businessApi.getCollectionById(collectionId, Language.LANGUAGE_ENGLISH);
    
    if (!response.collection) {
      console.log(`❌ No collection found for ID ${collectionId}`);
      return null;
    }

    const collection = apiDetailedCollectionToCollection(response.collection);
    const books = response.collection.books?.map((book: any) => 
      apiSimpleBookToBook(book, collectionId)
    ) || [];

    console.log(`✅ Fetched collection ${collectionId}: ${collection.name}, books: ${books.length}`);
    
    const result = { collection, books };
    setCache(cacheKey, result, CACHE_TTL.COLLECTION_DETAILS);
    return result;
  } catch (error) {
    console.error(`Failed to fetch collection ${collectionId}:`, error);
    return null;
  }
}

/**
 * Get collections with their books for the sidebar - cached and optimized
 */
export async function getCachedCollectionsWithBooks() {
  const cacheKey = getCacheKey('collections_with_books', Language.LANGUAGE_ENGLISH.toString());
  
  // Try cache first
  const cached = getCache(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // First get all collections
    const collections = await getCachedCollections();
    
    // For performance, we'll fetch books for the first few collections only
    // The rest will be loaded on-demand when expanded
    const PRELOAD_COUNT = 5;
    const priorityCollections = collections.slice(0, PRELOAD_COUNT);
    
    const collectionsWithBooks = await Promise.all(
      collections.map(async (collection, index) => {
        if (index < PRELOAD_COUNT) {
          // Preload books for priority collections
          const details = await getCachedCollectionWithBooks(collection.id);
          return {
            ...collection,
            books: details?.books?.map(book => ({
              id: book.id,
              name: book.name,
              nameArabic: book.nameArabic,
              number: book.number,
              hadithCount: book.hadithCount,
            })) || [],
          };
        } else {
          // Don't preload books for other collections
          return collection;
        }
      })
    );

    setCache(cacheKey, collectionsWithBooks, CACHE_TTL.COLLECTIONS);
    return collectionsWithBooks;
  } catch (error) {
    console.error('Failed to fetch collections with books:', error);
    return [];
  }
}

/**
 * Preload data for faster initial loads - call this during build
 */
export async function preloadCriticalData(): Promise<void> {
  console.log('Preloading critical data...');
  
  try {
    // Preload collections and their books
    await getCachedCollectionsWithBooks();
    console.log('✅ Critical data preloaded successfully');
  } catch (error) {
    console.error('❌ Failed to preload critical data:', error);
  }
}

/**
 * Clear all cache - useful for development
 */
export function clearCache(): void {
  cache.clear();
  console.log('Cache cleared');
} 