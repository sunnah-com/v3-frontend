import Link from "next/link";
import { Language } from "fe/proto/api";
import { CollectionWithoutBooks } from "fe/proto/business_models"; // Import API type
import { Collection } from "fe/types"; // Import frontend type
import { SearchBar } from "fe/components/search-bar";
import { getCollectionsWithISR } from "fe/lib/isr-data"; // Import the ISR function
import { CollectionCard } from "fe/components/collection-card";
import { Logo } from "fe/components/logo";
import { StructuredData } from "fe/components/structured-data";
import { generateWebsiteStructuredData } from "fe/lib/seo-utils";

export const dynamic = 'force-dynamic';

// Define metadata for the home page
export const metadata = {
  alternates: {
    canonical: '/',
  },
  title: "Sunnah.com - Sayings and Teachings of Prophet Muhammad (ﷺ)",
  openGraph: {
    title: "Sunnah.com - Sayings and Teachings of Prophet Muhammad (ﷺ)",
    description: "The Hadith of the Prophet Muhammad (ﷺ) at your fingertips. Search and browse authentic hadith collections.",
    url: '/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sunnah.com',
      },
    ],
  },
  twitter: {
    title: "Sunnah.com - Sayings and Teachings of Prophet Muhammad (ﷺ)",
    description: "The Hadith of the Prophet Muhammad (ﷺ) at your fingertips. Search and browse authentic hadith collections.",
  },
};

// Helper function to map API CollectionWithoutBooks to frontend Collection type
// (Same function as used in other files)
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

export default async function Home() {
  let collections: Collection[] = [];
  try {
    // Fetch collections using ISR
    const response = await getCollectionsWithISR(Language.LANGUAGE_ENGLISH); 
    // Convert API collections to frontend Collection type using the correct mapping
    if (response.collections) {
      collections = response.collections.map(mapCollectionWithoutBooksToCollection);
    } else {
      console.warn("No collections found in ISR response for Home page.");
    }
  } catch (error) {
    console.error("Failed to fetch collections using ISR for Home page:", error);
    // Proceed with empty collections array on error
  }

  // Featured collections (showing first 4)
  const featuredCollections = collections.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD structured data */}
      <StructuredData data={generateWebsiteStructuredData()} />
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <div className="flex justify-center mb-8">
          <Logo width={1024} colorVariable={'--primary'} className="mx-auto" />
        </div>
        <h1 className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground">
          The Hadith of the Prophet Muhammad <span className="arabic">(صلى الله عليه و سلم)</span> at your fingertips
        </h1>
        
        {/* Search Bar - Removed collections prop */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar />
        </div>

        <div className="flex justify-center space-x-4">
          <Link 
            href="/collections" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
          >
            Browse Collections
          </Link>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Collections</h2>
          <Link 
            href="/collections" 
            className="text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>
    </div>
  );
}
