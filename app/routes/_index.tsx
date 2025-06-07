import { type MetaFunction, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getAllCollections } from "~/services/collections";
import { Logo } from "~/components/logo";
import { SearchBar } from "~/components/search-bar";
import { CollectionCard } from "~/components/collection-card";
import { StructuredData } from "~/components/structured-data";
import { generateWebsiteStructuredData } from "~/lib/seo-utils";
import type { Collection } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Sunnah.com - Sayings and Teachings of Prophet Muhammad (صلى الله عليه و سلم)" },
    { name: "description", content: "Hadith of the Prophet Muhammad (صلى الله عليه و سلم) in several languages" },
    { name: "canonical", content: "/" },
    { property: "og:title", content: "Sunnah.com - Sayings and Teachings of Prophet Muhammad (صلى الله عليه و سلم)" },
    { property: "og:description", content: "The Hadith of the Prophet Muhammad (صلى الله عليه و سلم) at your fingertips. Search and browse authentic hadith collections." },
    { property: "og:url", content: "/" },
    { property: "og:image", content: "/og-image.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "Sunnah.com" },
    { name: "twitter:title", content: "Sunnah.com - Sayings and Teachings of Prophet Muhammad (صلى الله عليه و سلم)" },
    { name: "twitter:description", content: "The Hadith of the Prophet Muhammad (صلى الله عليه و سلم) at your fingertips. Search and browse authentic hadith collections." },
  ];
};

/**
 * Server-side loader function to fetch collections data
 */
export async function loader() {
  try {
    // Fetch collections from the API
    const collections = await getAllCollections();
    
    // Featured collections (showing first 4)
    const featuredCollections = collections.slice(0, 4);
    
    // Return the data as JSON
    return json({ 
      collections,
      featuredCollections
    });
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    // Return empty collections in case of error
    return json({ collections: [], featuredCollections: [] });
  }
}

export default function Index() {
  // Get the data from the loader
  const { collections, featuredCollections } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD structured data */}
      <StructuredData data={generateWebsiteStructuredData()} />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <div className="flex justify-center mb-8">
          <Logo width={1024} colorVariable="--primary" className="mx-auto" />
        </div>
        <h1 className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground">
          The Hadith of the Prophet Muhammad <span className="arabic">(صلى الله عليه و سلم)</span> at your fingertips
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar collections={collections.map((c: Collection) => ({ id: c.id, name: c.name }))} />
        </div>

        <div className="flex justify-center space-x-4">
          <Link 
            to="/collections" 
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
            to="/collections" 
            className="text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCollections.map((collection: Collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>
    </div>
  );
}
