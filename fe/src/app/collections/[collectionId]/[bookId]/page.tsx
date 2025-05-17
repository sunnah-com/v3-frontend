import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers'; // Import headers function
import { businessApi } from 'fe/lib/api-client';
import { Language } from 'fe/proto/api';
import { pluralize } from 'fe/lib/utils';
import {
  Collection, 
  Book, 
  Chapter, 
  Hadith, 
  apiDetailedCollectionToCollection, 
  apiDetailedChapterToChapter,
  apiSimpleHadithToHadith
} from "fe/types";
import { SearchBar } from "fe/components/search-bar";
import { HadithCard } from "fe/components/hadith-card";
import { CategoryTabs } from "fe/components/category-tabs";
import { StructuredData } from "fe/components/structured-data";
import { generateBookStructuredData, generateBreadcrumbStructuredData } from "fe/lib/seo-utils";

interface BookPageProps {
  params: Promise<{
    collectionId: string;
    bookId: string;
  }>;
}

export async function generateMetadata(props: BookPageProps) {
  const params = await props.params;
  const requestHeaders = await headers(); // Await headers

  try {
    // Fetch collection details, passing headers
    const collectionResponse = await businessApi.getCollectionById(
      params.collectionId,
      Language.LANGUAGE_ENGLISH,
      requestHeaders, // Pass headers
    );
    if (!collectionResponse.collection) {
      return { title: 'Collection Not Found - Sunnah.com' };
    }

    // Fetch book details, passing headers
    const bookResponse = await businessApi.getBookWithDetailedChapters(
      params.bookId,
      Language.LANGUAGE_ENGLISH,
      requestHeaders, // Pass headers
    );
    if (!bookResponse.book) {
      return { title: 'Book Not Found - Sunnah.com' };
    }
    
    const collection = apiDetailedCollectionToCollection(collectionResponse.collection);
    
    // Create a Book object from the DetailedBookWithDetailedChapters
    const book: Book = {
      id: bookResponse.book.id,
      collectionId: params.collectionId,
      name: bookResponse.book.translatedTitle,
      nameArabic: bookResponse.book.title,
      hadithCount: 0, // Not directly available
      chapterCount: bookResponse.book.chapters?.length || 0,
      number: parseInt(bookResponse.book.bookNumber) || bookResponse.book.order,
    };
    
    const title = `${book.name} - ${collection.name} - Sunnah.com`;
    const description = `Read hadiths from ${book.name} in ${collection.name} on Sunnah.com`;
    
    return {
      title,
      description,
      alternates: {
        canonical: `/collections/${params.collectionId}/${params.bookId}`,
      },
      openGraph: {
        title,
        description,
        url: `/collections/${params.collectionId}/${params.bookId}`,
        type: 'article',
      },
      twitter: {
        title,
        description,
        card: 'summary',
      },
    };
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    return { title: "Book Not Found - Sunnah.com" };
  }
}

export default async function BookPage(props: BookPageProps) {
  const params = await props.params;
  
  // Initialize variables
  let collection: Collection | null = null;
  let book: Book | null = null;
  let chapters: Chapter[] = [];
  const chapterHadiths: Map<string, Hadith[]> = new Map();
  const requestHeaders = await headers(); // Await headers

  try {
    // Fetch collection details, passing headers
    const collectionResponse = await businessApi.getCollectionById(
      params.collectionId,
      Language.LANGUAGE_ENGLISH,
      requestHeaders, // Pass headers
    );
    if (!collectionResponse.collection) {
      notFound();
    }
    collection = apiDetailedCollectionToCollection(collectionResponse.collection);

    // Fetch book details with chapters and hadiths, passing headers
    const bookResponse = await businessApi.getBookWithDetailedChapters(
      params.bookId,
      Language.LANGUAGE_ENGLISH,
      requestHeaders, // Pass headers
    );
    if (!bookResponse.book) {
      notFound();
    }
    
    // Create a Book object
    book = {
      id: bookResponse.book.id,
      collectionId: params.collectionId,
      name: bookResponse.book.translatedTitle,
      nameArabic: bookResponse.book.title,
      hadithCount: 0, // Calculate from chapters
      chapterCount: bookResponse.book.chapters?.length || 0,
      number: parseInt(bookResponse.book.bookNumber) || bookResponse.book.order,
    };
    
    // Process chapters and hadiths
    if (bookResponse.book.chapters) {
      chapters = bookResponse.book.chapters.map(apiChapter => {
        const chapter = apiDetailedChapterToChapter(apiChapter);
        
        // Process hadiths for this chapter
        if (apiChapter.hadiths) {
          const hadiths = apiChapter.hadiths.map(apiHadith => 
            apiSimpleHadithToHadith(apiHadith, params.collectionId, params.bookId, chapter.id)
          );
          chapterHadiths.set(chapter.id, hadiths);
          
          // Update hadith count for the book
          book!.hadithCount += hadiths.length;
        }
        
        return chapter;
      });
    }

    // Removed fetching all collections here, as SearchBar gets it from context now
    // const allCollectionsResponse = await businessApi.getAllCollections(Language.LANGUAGE_ENGLISH);
    // allCollections = allCollectionsResponse.collections.map(apiSimpleCollectionToCollection);
  } catch (error) {
    console.error("Failed to fetch book data:", error);
    notFound();
  }
  
  if (!collection || !book) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD structured data */}
      <StructuredData data={generateBookStructuredData(collection, book, chapters)} />
      <CategoryTabs active="hadiths" collectionId={collection.id} bookId={book.id} />
      
      {/* Breadcrumb structured data */}
      <StructuredData 
        data={generateBreadcrumbStructuredData([
          { name: 'Home', url: '/' },
          { name: collection.name, url: `/collections/${collection.id}` },
          { name: book.name, url: `/collections/${collection.id}/${book.id}` }
        ])} 
      />
      <div className="mb-8">
        <div className="flex flex-wrap items-center text-sm mb-4 text-muted-foreground">
          <Link href="/" className="hover:text-primary hover:underline">
            Home
          </Link>
          <span className="mx-2">»</span>
          <Link 
            href={`/collections/${collection.id}`}
            className="hover:text-primary hover:underline"
          >
            {collection.name}
          </Link>
          <span className="mx-2">»</span>
          <span className="text-primary">
            {book.name} - {book.nameArabic}
          </span>
        </div>

        <div className="text-sm text-muted-foreground mb-1">
          {collection.name}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-0">
            {book.number}. {book.name}
          </h1>

          {/* Desktop view: Arabic text with metadata below */}
          <div className="hidden md:flex flex-col items-end">
            <p className="arabic text-2xl font-medium">{book.nameArabic}</p>
            <div className="text-sm text-muted-foreground mt-2 text-right">
              <div>
                {pluralize(book.hadithCount, 'Hadith', 'Hadiths')} • {pluralize(book.chapterCount, 'Chapter', 'Chapters')}
              </div>
            </div>
          </div>

          {/* Mobile view: Metadata and Arabic on same line */}
          <div className="flex md:hidden justify-between items-center w-full mt-2">
            <div className="text-sm text-muted-foreground">
              <div>{pluralize(book.hadithCount, 'Hadith', 'Hadiths')}</div>
              <div>{pluralize(book.chapterCount, 'Chapter', 'Chapters')}</div>
            </div>
            <p className="arabic text-2xl font-medium">{book.nameArabic}</p>
          </div>
        </div>

        {/* Search Bar - Removed collections prop */}
        <div className="max-w-2xl mb-8">
          <SearchBar />
        </div>
      </div>

      {/* Chapters and Hadiths */}
      <div className="space-y-12">
        {chapters.map((chapter) => {
          const hadiths = chapterHadiths.get(chapter.id) || [];

          return (
            <div key={chapter.id} className="border-t pt-8">
              <div className="mb-6">
                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4">
                  <h2 className="text-xl font-bold mb-2 md:mb-0">
                    Chapter {chapter.number}: {chapter.name}
                  </h2>
                  <p className="arabic text-lg text-right">
                    {chapter.nameArabic}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {hadiths.map((hadith) => (
                  <HadithCard
                    key={hadith.id}
                    hadith={hadith}
                    collectionId={collection.id}
                    bookId={book.id}
                    isLink={true}
                    truncateText={true}
                    layout="side-by-side"
                  />
                ))}

                {hadiths.length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    No hadiths available for this chapter.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {chapters.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No chapters available for this book.
          </div>
        )}
      </div>
    </div>
  );
}
