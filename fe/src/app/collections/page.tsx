import { getCollectionsWithISR } from "fe/lib/isr-data"; // Import ISR function
import { Language } from "fe/proto/api";
import { CollectionWithoutBooks } from "fe/proto/business_models"; // Import the API type
import { Collection } from "fe/types"; // Import the frontend type
import { CollectionCard } from "fe/components/collection-card";
import { SearchBar } from "fe/components/search-bar";
import { StructuredData } from "fe/components/structured-data";
import { generateCollectionsStructuredData } from "fe/lib/seo-utils";

export const metadata = {
  title: "Hadith Collections - Sunnah.com",
  description: "Browse authentic collections of hadith compiled by renowned scholars on Sunnah.com",
  alternates: {
    canonical: '/collections',
  },
  openGraph: {
    title: "Hadith Collections - Sunnah.com",
    description: "Browse authentic collections of hadith compiled by renowned scholars on Sunnah.com",
    url: '/collections',
  },
  twitter: {
    title: "Hadith Collections - Sunnah.com",
    description: "Browse authentic collections of hadith compiled by renowned scholars on Sunnah.com",
  },
};

export const dynamic = 'force-dynamic';

// Helper function to map API CollectionWithoutBooks to frontend Collection type
function mapCollectionWithoutBooksToCollection(apiCollection: CollectionWithoutBooks): Collection {
  return {
    id: apiCollection.id,
    name: apiCollection.translatedTitle, // Map translatedTitle to name
    nameArabic: apiCollection.title,      // Map title to nameArabic
    description: apiCollection.introduction || "", // Map introduction to description
    bookCount: apiCollection.numBooks,    // Map numBooks to bookCount
    hadithCount: apiCollection.numHadiths,  // Map numHadiths to hadithCount
  };
}

// TODO: Add proper error handling for API call
// TODO: Get language dynamically (e.g., from user settings or context)
export default async function CollectionsPage() {
  let collections: Collection[] = [];
  try {
    // Fetch collections using ISR
    const response = await getCollectionsWithISR(Language.LANGUAGE_ENGLISH); 
    // Convert API collections to frontend Collection type using the correct mapping
    if (response.collections) {
      collections = response.collections.map(mapCollectionWithoutBooksToCollection);
    } else {
      console.warn("No collections found in ISR response.");
    }
  } catch (error) {
    console.error("Failed to fetch collections using ISR:", error);
    // Optionally, render an error state or return notFound()
    // For now, we'll proceed with an empty array
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD structured data */}
      <StructuredData data={generateCollectionsStructuredData(collections)} />
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Hadith Collections</h1>
        <p className="text-muted-foreground mb-6">
          Browse through authentic collections of hadith compiled by renowned scholars.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mb-8">
          <SearchBar />
        </div>
      </div>
      
      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>

      {/* Information Section */}
      <div className="mt-12 p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">About Hadith Collections</h2>
        <p className="text-muted-foreground mb-4">
          Hadith are the collected sayings, actions, and silent approvals of Prophet Muhammad (صلى الله عليه و سلم).
          These collections were meticulously compiled by scholars who dedicated their lives to preserving
          the authentic teachings of Islam.
        </p>
        <p className="text-muted-foreground">
          The most authentic collections are known as &quot;Sahih&quot; (authentic), with Sahih al-Bukhari and
          Sahih Muslim being the most highly regarded. Other important collections include the &quot;Sunan&quot;
          works of Abu Dawud, at-Tirmidhi, an-Nasa&apos;i, and Ibn Majah, which together with the two Sahih
          collections form the &quot;Six Books&quot; (Kutub al-Sittah).
        </p>
      </div>
    </div>
  )
}
