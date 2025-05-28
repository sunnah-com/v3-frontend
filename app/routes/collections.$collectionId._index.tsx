import { type MetaFunction, type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getCachedCollectionWithBooks, getCachedCollections } from "~/services/data-cache.server";
import { pluralize } from "~/lib/utils";
import type { Collection, Book } from "~/types";
import { SearchBar } from "~/components/search-bar";
import { StructuredData } from "~/components/structured-data";
import { generateCollectionStructuredData, generateBreadcrumbStructuredData } from "~/lib/seo-utils";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.collection) {
    return [{ title: "Collection Not Found - Sunnah.com" }];
  }

  const { collection } = data;
  const title = `${collection.name} - Sunnah.com`;
  const description = collection.description || `Browse hadiths from ${collection.name} on Sunnah.com`;
  
  return [
    { title },
    { name: "description", content: description },
    { name: "canonical", content: `/collections/${collection.id}` },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `/collections/${collection.id}` },
    { property: "og:type", content: "article" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:card", content: "summary" },
  ];
};

/**
 * Server-side loader function to fetch a specific collection with its books
 */
export async function loader({ params }: LoaderFunctionArgs) {
  const { collectionId } = params;
  
  if (!collectionId) {
    throw new Response("Collection ID is required", { status: 400 });
  }
  
  try {
    // Fetch collection details and all collections concurrently
    const [collectionData, allCollections] = await Promise.all([
      getCachedCollectionWithBooks(collectionId),
      getCachedCollections()
    ]);

    if (!collectionData) {
      throw new Response("Collection not found", { status: 404 });
    }
    
    const { collection, books } = collectionData;
    
    // Return the data as JSON with proper typing
    return json({ 
      collection: collection as Collection, 
      books: books as Book[],
      collections: allCollections.map(c => ({ id: c.id, name: c.name }))
    });
  } catch (error) {
    console.error(`Failed to fetch collection ${collectionId}:`, error);
    throw new Response("Error fetching collection", { status: 500 });
  }
}

export default function CollectionDetail() {
  const { collection, books, collections } = useLoaderData<typeof loader>();
  
  return (
    <div className="space-y-8">
      {/* JSON-LD structured data */}
      <StructuredData data={generateCollectionStructuredData(collection, books)} />
      
      {/* Breadcrumb structured data */}
      <StructuredData 
        data={generateBreadcrumbStructuredData([
          { name: 'Home', url: '/' },
          { name: collection.name, url: `/collections/${collection.id}` }
        ])} 
      />
      
      <div>
        <div className="flex flex-wrap items-center text-sm mb-4 text-muted-foreground">
          <Link to="/" className="hover:text-primary hover:underline">
            Home
          </Link>
          <span className="mx-2">»</span>
          <span className="text-primary">
            {collection.name}
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold">{collection.name}</h1>
          </div>
          
          {/* Desktop view: Arabic text with metadata below */}
          <div className="hidden md:flex flex-col items-end">
            <p className="arabic text-2xl font-medium">{collection.nameArabic}</p>
            <div className="text-sm text-muted-foreground mt-2">
              <div>{pluralize(collection.bookCount, 'Book', 'Books')}</div>
              <div>{pluralize(collection.hadithCount, 'Hadith', 'Hadiths')}</div>
            </div>
          </div>
          
          {/* Mobile view: Metadata and Arabic on same line */}
          <div className="flex md:hidden justify-between items-center mt-2">
            <div className="text-sm text-muted-foreground">
              <div>{pluralize(collection.bookCount, 'Book', 'Books')}</div>
              <div>{pluralize(collection.hadithCount, 'Hadith', 'Hadiths')}</div>
            </div>
            <p className="arabic text-2xl font-medium">{collection.nameArabic}</p>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4">
          {collection.description}
        </p>
        
        {/* More Information Link */}
        <div className="mb-6">
          <Link 
            to={`/collections/${collection.id}/info`}
            className="text-primary hover:underline inline-block"
          >
            More Information
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-2xl mb-8 md:mx-auto">
          <SearchBar collections={collections} />
        </div>
      </div>
      
      {/* Books List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Books</h2>
        
        <div className="grid gap-4">
          {books.map((book: Book) => (
            <Link 
              key={book.id} 
              to={`/collections/${collection.id}/${book.id}`}
              className="block p-4 rounded-lg border bg-card hover:border-primary transition-colors"
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-medium">{book.number}.</span>
                    <h3 className="font-medium">{book.name}</h3>
                  </div>
                  <p className="arabic text-right">{book.nameArabic}</p>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div>{pluralize(book.hadithCount, 'Hadith', 'Hadiths')}</div>
                    <div>{pluralize(book.chapterCount, 'Chapter', 'Chapters')}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {books.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              No books available for this collection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 