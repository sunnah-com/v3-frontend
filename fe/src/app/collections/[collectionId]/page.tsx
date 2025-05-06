import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers'; // Import headers function
import { businessApi } from 'fe/lib/api-client';
import { Language } from 'fe/proto/api';
import { pluralize } from 'fe/lib/utils';
import {
  Collection,
  Book,
  apiDetailedCollectionToCollection,
  apiSimpleBookToBook,
} from 'fe/types';
import { SearchBar } from "fe/components/search-bar"
import { StructuredData } from "fe/components/structured-data"
import { generateCollectionStructuredData, generateBreadcrumbStructuredData } from "fe/lib/seo-utils"

interface CollectionPageProps {
  params: Promise<{
    collectionId: string
  }>
}

export async function generateMetadata(props: CollectionPageProps) {
  const params = await props.params;
  const requestHeaders = await headers(); // Await headers

  try {
    // Fetch collection details from API, passing headers
    const response = await businessApi.getCollectionById(
      params.collectionId,
      Language.LANGUAGE_ENGLISH,
      requestHeaders, // Pass headers
    );

    if (!response.collection) {
      return {
        title: "Collection Not Found - Sunnah.com",
      };
    }
    
    const collection = apiDetailedCollectionToCollection(response.collection);
    const title = `${collection.name} - Sunnah.com`;
    const description = collection.description || `Browse hadiths from ${collection.name} on Sunnah.com`;
    
    return {
      title,
      description,
      alternates: {
        canonical: `/collections/${params.collectionId}`,
      },
      openGraph: {
        title,
        description,
        url: `/collections/${params.collectionId}`,
        type: 'article',
      },
      twitter: {
        title,
        description,
        card: 'summary',
      },
    };
  } catch (error) {
    console.error("Failed to fetch collection for metadata:", error);
    return {
      title: "Collection Not Found - Sunnah.com",
    };
  }
}

export default async function CollectionPage(props: CollectionPageProps) {
  const params = await props.params;
  
  // Fetch collection details from API
  let collection: Collection | null = null;
  let books: Book[] = [];
  const requestHeaders = await headers(); // Await headers

  try {
    // Fetch the specific collection, passing headers
    const collectionResponse = await businessApi.getCollectionById(
      params.collectionId,
      Language.LANGUAGE_ENGLISH,
      requestHeaders, // Pass headers
    );

    if (!collectionResponse.collection) {
      notFound();
    }
    
    collection = apiDetailedCollectionToCollection(collectionResponse.collection);
    
    // Extract books from the detailed collection
    books = collectionResponse.collection.books?.map(book => 
      apiSimpleBookToBook(book, params.collectionId)
    ) || [];
    
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    notFound();
  }
  
  if (!collection) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD structured data */}
      <StructuredData data={generateCollectionStructuredData(collection, books)} />
      
      {/* Breadcrumb structured data */}
      <StructuredData 
        data={generateBreadcrumbStructuredData([
          { name: 'Home', url: '/' },
          { name: collection.name, url: `/collections/${collection.id}` }
        ])} 
      />
      <div className="mb-8">
        <div className="flex flex-wrap items-center text-sm mb-4 text-muted-foreground">
          <Link href="/" className="hover:text-primary hover:underline">
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
            href={`/collections/${collection.id}/info`}
            className="text-primary hover:underline inline-block"
          >
            More Information
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-2xl mb-8 md:mx-auto">
          <SearchBar />
        </div>
      </div>
      
      {/* Books List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Books</h2>
        
        <div className="grid gap-4">
          {books.map((book) => (
            <Link 
              key={book.id} 
              href={`/collections/${collection.id}/${book.id}`}
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
  )
}
