import { type MetaFunction, type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { businessApi } from "~/lib/api-client";
import { Language } from "~/proto/api";
import { pluralize } from "~/lib/utils";
import {
  Collection, 
  Book, 
  Chapter, 
  Hadith, 
  apiDetailedCollectionToCollection, 
  apiDetailedChapterToChapter,
  apiSimpleHadithToHadith
} from "~/types";
import { SearchBar } from "~/components/search-bar";
import { HadithCard } from "~/components/hadith-card";
import { StructuredData } from "~/components/structured-data";
import { generateBookStructuredData, generateBreadcrumbStructuredData } from "~/lib/seo-utils";
import { getAllCollections } from "~/services/collections";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.collection || !data.book) {
    return [{ title: "Book Not Found - Sunnah.com" }];
  }

  const { collection, book } = data;
  const title = `${book.name} - ${collection.name} - Sunnah.com`;
  const description = `Read hadiths from ${book.name} in ${collection.name} on Sunnah.com`;
  
  return [
    { title },
    { name: "description", content: description },
    { name: "canonical", content: `/collections/${collection.id}/${book.id}` },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `/collections/${collection.id}/${book.id}` },
    { property: "og:type", content: "article" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:card", content: "summary" },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { collectionId, bookId } = params;
  
  if (!collectionId || !bookId) {
    console.error("❌ Missing required params:", { collectionId, bookId });
    throw new Response("Not Found", { status: 404 });
  }

  try {
    
    // Fetch collection details and book details concurrently
    const [collectionResponse, bookResponse, collections] = await Promise.all([
      businessApi.getCollectionById(collectionId, Language.LANGUAGE_ENGLISH),
      businessApi.getBookWithDetailedChapters(bookId, Language.LANGUAGE_ENGLISH),
      getAllCollections()
    ]);

    if (!collectionResponse.collection) {
      console.error(`❌ Collection not found: ${collectionId}`);
      throw new Response("Collection Not Found", { status: 404 });
    }

    if (!bookResponse.book) {
      console.error(`❌ Book not found: ${bookId} in collection: ${collectionId}`);
      throw new Response("Book Not Found", { status: 404 });
    }

    const collection = apiDetailedCollectionToCollection(collectionResponse.collection);
    
    // Create a Book object from the DetailedBookWithDetailedChapters
    const book: Book = {
      id: bookResponse.book.id,
      collectionId: collectionId,
      name: bookResponse.book.translatedTitle,
      nameArabic: bookResponse.book.title,
      hadithCount: 0, // Calculate from chapters
      chapterCount: bookResponse.book.chapters?.length || 0,
      number: parseInt(bookResponse.book.bookNumber) || bookResponse.book.order,
    };

    const chapters: Chapter[] = [];
    const chapterHadiths: Record<string, Hadith[]> = {};

    // Process chapters and hadiths
    if (bookResponse.book.chapters) {
      for (const apiChapter of bookResponse.book.chapters) {
        const chapter = apiDetailedChapterToChapter(apiChapter);
        chapters.push(chapter);
        
        // Process hadiths for this chapter
        if (apiChapter.hadiths) {
          const hadiths = apiChapter.hadiths.map(apiHadith => 
            apiSimpleHadithToHadith(apiHadith, collectionId, bookId, chapter.id)
          );
          chapterHadiths[chapter.id] = hadiths;
          
          // Update hadith count for the book
          book.hadithCount += hadiths.length;
        }
      }
    }

    return json({
      collection,
      book,
      chapters,
      chapterHadiths
    });
  } catch (error) {
    console.error("❌ Failed to fetch book data:", error);
    throw new Response("Not Found", { status: 404 });
  }
}

export default function BookPage() {
  
  try {
    const { collection, book, chapters, chapterHadiths } = useLoaderData<typeof loader>();
    
    // return <div>Book Page</div>;
    return (
      <div className="container mx-auto px-4 py-8">
        {/* JSON-LD structured data */}
        <StructuredData data={generateBookStructuredData(collection, book, chapters)} />
        
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
            <Link to="/" className="hover:text-primary hover:underline">
              Home
            </Link>
            <span className="mx-2">»</span>
            <Link 
              to={`/collections/${collection.id}`}
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

          {/* Search Bar */}
          <div className="max-w-2xl mb-8">
            <SearchBar />
          </div>
        </div>

        {/* Chapters and Hadiths */}
        <div className="space-y-12">
          {chapters.map((chapter) => {
            const hadiths = chapterHadiths[chapter.id] || [];

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
  } catch (error) {
    console.error("❌ Error in BookPage component:", error);
    throw error;
  }
} 