import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { getCachedCollectionWithBooks } from "~/services/data-cache.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { collectionId } = params;
  
  if (!collectionId) {
    throw new Response("Collection ID is required", { status: 400 });
  }

  try {
    const result = await getCachedCollectionWithBooks(collectionId);
    
    if (!result) {
      throw new Response("Collection not found", { status: 404 });
    }

    // Return only the books data formatted for the sidebar
    const books = result.books.map(book => ({
      id: book.id,
      name: book.name,
      nameArabic: book.nameArabic,
      number: book.number,
      hadithCount: book.hadithCount,
    }));

    return json({ books });
  } catch (error) {
    console.error(`Failed to fetch books for collection ${collectionId}:`, error);
    throw new Response("Error fetching books", { status: 500 });
  }
} 