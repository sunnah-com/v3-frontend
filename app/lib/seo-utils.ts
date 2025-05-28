import { Collection, Book, Hadith } from "~/types";

/**
 * Utility functions for SEO optimization
 */

// Base URL for the site
export const siteUrl = 'https://sunnah.com';

/**
 * Generate WebSite structured data for the home page
 * @returns JSON-LD structured data for the home page
 */
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": `${siteUrl}/`,
    "name": "Sunnah.com",
    "description": "The Hadith of the Prophet Muhammad (ﷺ) at your fingertips",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sunnah.com",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/og-image.jpg`
      }
    }
  };
}

/**
 * Generate CollectionPage structured data for the collections page
 * @param collections Array of collections to include in the structured data
 * @returns JSON-LD structured data for the collections page
 */
export function generateCollectionsStructuredData(collections: Collection[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Hadith Collections - Sunnah.com",
    "description": "Browse authentic collections of hadith compiled by renowned scholars on Sunnah.com",
    "url": `${siteUrl}/collections`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": collections.map((collection, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Book",
          "name": collection.name,
          "alternateName": collection.nameArabic,
          "description": collection.description,
          "url": `${siteUrl}/collections/${collection.id}`,
          "numberOfPages": collection.bookCount,
        }
      }))
    }
  };
}

/**
 * Generate Book structured data for a collection page
 * @param collection Collection object
 * @param books Array of books in the collection
 * @returns JSON-LD structured data for the collection page
 */
export function generateCollectionStructuredData(collection: Collection, books: Book[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": collection.name,
    "alternateName": collection.nameArabic,
    "description": collection.description,
    "url": `${siteUrl}/collections/${collection.id}`,
    "author": {
      "@type": "Person",
      "name": collection.name.split(' ').slice(-1)[0] // Extract author name from collection title (e.g., "Sahih al-Bukhari" -> "Bukhari")
    },
    "numberOfPages": collection.bookCount,
    "inLanguage": ["en", "ar"],
    "publisher": {
      "@type": "Organization",
      "name": "Sunnah.com"
    },
    "workExample": books.slice(0, 5).map(book => ({
      "@type": "Book",
      "name": book.name,
      "alternateName": book.nameArabic,
      "url": `${siteUrl}/collections/${collection.id}/${book.id}`,
      "position": book.number
    }))
  };
}

/**
 * Generate Book structured data for a book page
 * @param collection Collection object
 * @param book Book object
 * @param chapters Array of chapters in the book
 * @returns JSON-LD structured data for the book page
 */
export function generateBookStructuredData(collection: Collection, book: Book, chapters: { id: string; name: string; nameArabic: string; number: number }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.name,
    "alternateName": book.nameArabic,
    "position": book.number,
    "url": `${siteUrl}/collections/${collection.id}/${book.id}`,
    "inLanguage": ["en", "ar"],
    "isPartOf": {
      "@type": "Book",
      "name": collection.name,
      "url": `${siteUrl}/collections/${collection.id}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sunnah.com"
    },
    "hasPart": chapters.map(chapter => ({
      "@type": "Chapter",
      "name": chapter.name,
      "alternateName": chapter.nameArabic,
      "position": chapter.number,
      "url": `${siteUrl}/collections/${collection.id}/${book.id}#chapter-${chapter.id}`
    }))
  };
}

/**
 * Generate Article structured data for a hadith page
 * @param collection Collection object
 * @param book Book object
 * @param hadith Hadith object
 * @returns JSON-LD structured data for the hadith page
 */
export function generateHadithStructuredData(collection: Collection, book: Book, hadith: Hadith) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Hadith ${hadith.number} - ${book.name} - ${collection.name}`,
    "description": hadith.text.substring(0, 160) + (hadith.text.length > 160 ? "..." : ""),
    "url": `${siteUrl}/collections/${collection.id}/${book.id}/${hadith.id}`,
    "inLanguage": ["en", "ar"],
    "position": hadith.number,
    "articleBody": hadith.text,
    "author": {
      "@type": "Person",
      "name": hadith.narrator || collection.name.split(' ').slice(-1)[0]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sunnah.com",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/og-image.jpg`
      }
    },
    "isPartOf": {
      "@type": "Book",
      "name": book.name,
      "url": `${siteUrl}/collections/${collection.id}/${book.id}`
    },
    "citation": hadith.reference || `${collection.name}, Book ${book.number}, Hadith ${hadith.number}`
  };
}

/**
 * Generate BreadcrumbList structured data
 * @param items Array of breadcrumb items with name and url
 * @returns JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${siteUrl}${item.url}`
    }))
  };
} 