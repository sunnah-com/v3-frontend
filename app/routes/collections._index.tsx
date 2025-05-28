import { type MetaFunction, type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getCachedCollections } from "~/services/data-cache.server";
import { pluralize } from "~/lib/utils";
import type { Collection } from "~/types";
import { SearchBar } from "~/components/search-bar";
import { StructuredData } from "~/components/structured-data";

export const meta: MetaFunction = () => {
  return [
    { title: "Hadith Collections - Sunnah.com" },
    { name: "description", content: "Browse authentic hadith collections including Sahih al-Bukhari, Sahih Muslim, and more on Sunnah.com" },
    { name: "canonical", content: "/collections" },
    { property: "og:title", content: "Hadith Collections - Sunnah.com" },
    { property: "og:description", content: "Browse authentic hadith collections including Sahih al-Bukhari, Sahih Muslim, and more on Sunnah.com" },
    { property: "og:url", content: "/collections" },
    { property: "og:type", content: "website" },
    { name: "twitter:title", content: "Hadith Collections - Sunnah.com" },
    { name: "twitter:description", content: "Browse authentic hadith collections including Sahih al-Bukhari, Sahih Muslim, and more on Sunnah.com" },
    { name: "twitter:card", content: "summary" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const collections = await getCachedCollections();
  
  return json({ 
    collections,
    collectionsForSearch: collections.map(c => ({ id: c.id, name: c.name }))
  });
}

export default function CollectionsIndex() {
  const { collections, collectionsForSearch } = useLoaderData<typeof loader>();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Hadith Collections</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse authentic hadith collections compiled by renowned Islamic scholars. 
          Each collection contains books, chapters, and thousands of verified hadiths.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <SearchBar collections={collectionsForSearch} />
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection: Collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.id}`}
            className="group p-6 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <div className="space-y-4">
              {/* Collection Header */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {collection.name}
                </h2>
                <p className="arabic text-lg text-muted-foreground">
                  {collection.nameArabic}
                </p>
              </div>

              {/* Description */}
              {collection.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {collection.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>{pluralize(collection.bookCount, 'Book', 'Books')}</span>
                  <span>{pluralize(collection.hadithCount, 'Hadith', 'Hadiths')}</span>
                </div>
                <span className="text-primary group-hover:underline">
                  Browse →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          <p>No collections available at the moment.</p>
        </div>
      )}
    </div>
  );
} 