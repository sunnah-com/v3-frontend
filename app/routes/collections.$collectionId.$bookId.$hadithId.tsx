import { type MetaFunction, type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { businessApi } from "~/lib/api-client";
import { Language } from "@suhaibinator/sunnah-v3-ts-proto/lib/api";
import {
  Collection, 
  Book, 
  Hadith, 
  apiDetailedHadithToHadith,
} from "~/types";
import { HadithCard } from "~/components/hadith-card";
import { StructuredData } from "~/components/structured-data";
import { generateHadithStructuredData, generateBreadcrumbStructuredData } from "~/lib/seo-utils";
import { getAllCollections } from "~/services/collections";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.hadith || !data.collection || !data.book) {
    return [{ title: "Hadith Not Found - Sunnah.com" }];
  }

  const { hadith, collection, book } = data;
  
  // Create a truncated description (max 160 chars for SEO best practices)
  const truncatedText = hadith.text.length > 157 
    ? hadith.text.substring(0, 157) + "..." 
    : hadith.text;
  
  const title = `Hadith ${hadith.number} - ${book.name} - ${collection.name} - Sunnah.com`;
  const description = truncatedText;
  const url = `/collections/${collection.id}/${book.id}/${hadith.id}`;
  
  return [
    { title },
    { name: "description", content: description },
    { name: "canonical", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "article" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:card", content: "summary" },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { collectionId, bookId, hadithId } = params;
  
  if (!collectionId || !bookId || !hadithId) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    // Fetch hadith details and collections concurrently
    const [hadithResponse, collections] = await Promise.all([
      businessApi.getHadithById(hadithId, Language.LANGUAGE_ENGLISH),
      getAllCollections()
    ]);

    if (!hadithResponse.hadith) {
      throw new Response("Not Found", { status: 404 });
    }
    
    // Convert API hadith to frontend Hadith type
    const hadith = apiDetailedHadithToHadith(hadithResponse.hadith);
    
    // Find the collection from the collections data
    const foundCollection = collections.find(c => c.id === collectionId);
    if (!foundCollection) {
      throw new Response("Collection Not Found", { status: 404 });
    }
    
    const collection: Collection = {
      id: foundCollection.id,
      name: foundCollection.name,
      nameArabic: foundCollection.nameArabic,
      description: foundCollection.description,
      bookCount: foundCollection.bookCount,
      hadithCount: foundCollection.hadithCount,
    };

    let book: Book | null = null;
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

    if (!book) {
      throw new Response("Book Not Found", { status: 404 });
    }

    return json({
      hadith,
      collection,
      book
    });
  } catch (error) {
    console.error("Failed to fetch hadith data:", error);
    throw new Response("Not Found", { status: 404 });
  }
}

export default function HadithPage() {
  const { hadith, collection, book } = useLoaderData<typeof loader>();

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
          <Link 
            to={`/collections/${collection.id}/${book.id}`}
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
} 