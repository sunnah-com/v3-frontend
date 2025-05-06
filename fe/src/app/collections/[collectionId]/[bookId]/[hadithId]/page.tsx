// app/collections/[collectionId]/[bookId]/[hadithId]/page.tsx

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers'; // Import headers function
import { businessApi } from 'fe/lib/api-client';
import { getCollectionsWithISR } from 'fe/lib/isr-data'; // Import ISR function
import { Language } from 'fe/proto/api';
import { 
  Collection, 
  Book, 
  Hadith, 
  apiDetailedHadithToHadith,
} from "fe/types";
import { HadithCard } from "fe/components/hadith-card";
import { StructuredData } from "fe/components/structured-data";
import { generateHadithStructuredData, generateBreadcrumbStructuredData } from "fe/lib/seo-utils";

interface HadithParams {
  collectionId: string;
  bookId: string;
  hadithId: string;
}

interface HadithPageProps {
  params: Promise<HadithParams | Promise<HadithParams>>;
}

export async function generateMetadata(props: HadithPageProps) {
  const params = await props.params;
  const { collectionId, bookId, hadithId } = params;
  const requestHeaders = await headers(); // Await headers

  try {
    // Fetch hadith details - this includes collection, book, and chapter info, passing headers
    const hadithResponse = await businessApi.getHadithById(
      hadithId,
      Language.LANGUAGE_ENGLISH,
      requestHeaders, // Pass headers
    );
    // Fetch all collections using ISR (no headers needed here)
    const collectionsResponse = await getCollectionsWithISR(
      Language.LANGUAGE_ENGLISH,
    );

    if (!hadithResponse.hadith || !collectionsResponse.collections) {
      return { title: "Hadith Not Found - Sunnah.com" };
    }
    
    const hadith = apiDetailedHadithToHadith(hadithResponse.hadith);
    
    // Find the collection from the ISR data
    const currentCollection = collectionsResponse.collections.find(c => c.id === collectionId);
    const collectionName = currentCollection?.translatedTitle || collectionId; // Use translatedTitle, Fallback to ID if not found
    const bookName = hadithResponse.hadith.book?.translatedTitle || "";
    
    // Create a truncated description (max 160 chars for SEO best practices)
    const truncatedText = hadith.text.length > 157 
      ? hadith.text.substring(0, 157) + "..." 
      : hadith.text;
    
    const title = `Hadith ${hadith.number} - ${bookName} - ${collectionName} - Sunnah.com`;
    const description = truncatedText;
    const url = `/collections/${collectionId}/${bookId}/${hadithId}`;
    
    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
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
    return { title: "Hadith Not Found - Sunnah.com" };
  }
}

const HadithPage = async (props: HadithPageProps) => {
  const params = await props.params;
  const { collectionId, hadithId } = params;
  
  // Initialize variables
  let hadith: Hadith | null = null;
  let collection: Collection | null = null;
  let book: Book | null = null;
  const requestHeaders = await headers(); // Await headers

  try {
    // Fetch hadith details and collections concurrently
    const [hadithResponse, collectionsResponse] = await Promise.all([
      businessApi.getHadithById(
        hadithId,
        Language.LANGUAGE_ENGLISH,
        requestHeaders, // Pass headers for the direct API call
      ),
      getCollectionsWithISR(Language.LANGUAGE_ENGLISH), // Fetch collections using ISR (no headers needed)
    ]);

    if (!hadithResponse.hadith || !collectionsResponse.collections) {
      notFound();
    }
    
    // Convert API hadith to frontend Hadith type
    hadith = apiDetailedHadithToHadith(hadithResponse.hadith);
    
    // Find the full collection object from ISR data using collectionId from params
    const foundCollection = collectionsResponse.collections.find(c => c.id === collectionId);
    if (foundCollection) {
      // Map the found collection to the frontend Collection type
      // Assuming the ISR response structure matches the required fields or needs mapping
      collection = {
        id: foundCollection.id,
        name: foundCollection.translatedTitle, // Use translatedTitle for the translated name
        nameArabic: foundCollection.title, // Use title for the Arabic name
        description: foundCollection.introduction || "", // Use introduction for description
        bookCount: foundCollection.numBooks || 0, 
        hadithCount: foundCollection.numHadiths || 0, 
      };
    } else {
      // Handle case where collection isn't found in ISR data
      console.warn(`Collection with ID ${collectionId} not found in ISR data. Cannot construct collection details.`);
      // Removed the incorrect fallback logic that relied on hadithResponse.hadith.collection
    }

    if (hadithResponse.hadith.book) {
      book = {
        id: hadithResponse.hadith.book.id,
        collectionId: collectionId,
        name: hadithResponse.hadith.book.translatedTitle,
        nameArabic: hadithResponse.hadith.book.title,
        hadithCount: 0, // Not available in SimpleBook
        chapterCount: 0, // Not available in SimpleBook
        number: parseInt(hadithResponse.hadith.book.bookNumber) || 0,
      };
    }
    
  } catch (error) {
    console.error("Failed to fetch hadith:", error);
    notFound();
  }
  
  if (!hadith || !collection || !book) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD structured data */}
      <StructuredData data={generateHadithStructuredData(collection, book, hadith)} />
      
      {/* Breadcrumb structured data */}
      <StructuredData 
        data={generateBreadcrumbStructuredData([
          { name: 'Home', url: '/' },
          { name: collection.name, url: `/collections/${collection.id}` },
          { name: book.name, url: `/collections/${collection.id}/${book.id}` },
          { name: `Hadith ${hadith.number}`, url: `/collections/${collection.id}/${book.id}/${hadith.id}` }
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
          <Link 
            href={`/collections/${collection.id}/${book.id}`}
            className="hover:text-primary hover:underline"
          >
            {book.name} - {book.nameArabic}
          </Link>
          <span className="mx-2">»</span>
          <span className="text-primary">
            Hadith {hadith.number}
          </span>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Hadith {hadith.number}</h1>
        </div>
      </div>

      {/* Hadith Content */}
      <div className="max-w-4xl md:max-w-5xl mx-auto">
        <HadithCard
          hadith={hadith}
          collectionId={collection.id}
          bookId={book.id}
          isLink={false}
          truncateText={false}
          layout="side-by-side"
          className="mb-8"
        />

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-8">
          {/* Action buttons here... */}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12 pt-6 border-t">
          {/* Navigation links here... */}
        </div>
      </div>
    </div>
  );
};

export default HadithPage;
