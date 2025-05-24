import { getCollectionsWithISR } from "fe/lib/isr-data"
import { Language } from "fe/proto/api"
import { Collection } from "fe/types"
import { HadithSidebar } from "fe/components/hadith-sidebar"
import { SidebarProvider } from "fe/components/ui/sidebar"

import { CollectionWithoutBooks } from "fe/proto/business_models"

// Helper function to map API CollectionWithoutBooks to frontend Collection type
function mapCollectionWithoutBooksToCollection(apiCollection: CollectionWithoutBooks): Collection {
  return {
    id: apiCollection.id,
    name: apiCollection.translatedTitle,
    nameArabic: apiCollection.title,
    description: apiCollection.introduction || "",
    bookCount: apiCollection.numBooks,
    hadithCount: apiCollection.numHadiths,
  }
}

interface CollectionsLayoutProps {
  children: React.ReactNode
  params?: Promise<{ collectionId?: string; bookId?: string }>
}

export default async function CollectionsLayout({
  children,
}: CollectionsLayoutProps) {
  // Fetch all collections for the sidebar
  let collections: Collection[] = []
  try {
    const response = await getCollectionsWithISR(Language.LANGUAGE_ENGLISH)
    if (response.collections) {
      collections = response.collections.map(mapCollectionWithoutBooksToCollection)
    }
  } catch (error) {
    console.error("Failed to fetch collections for sidebar:", error)
  }

  // Note: We'll fetch collection details dynamically from the sidebar component
  // to avoid unnecessary API calls on every navigation

  return (
    <SidebarProvider 
      defaultOpen={true}
      className="min-h-screen"
    >
      <div className="relative flex min-h-screen">
        <HadithSidebar 
          collections={collections}
        >
          {children}
        </HadithSidebar>
      </div>
    </SidebarProvider>
  )
}