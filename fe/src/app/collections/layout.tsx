import { ReactNode } from 'react'
import { Language } from 'fe/proto/api'
import { getCollectionsWithISR } from 'fe/lib/isr-data'
import { businessApi } from 'fe/lib/api-client'
import { Book, apiSimpleBookToBook } from 'fe/types'
import { HadithSidebar } from 'fe/components/hadith-sidebar'

interface LayoutProps {
  children: ReactNode
  params: { collectionId?: string; bookId?: string }
}

// Helper to map CollectionWithoutBooks to simplified Collection
function mapCollection(apiCollection: any): { id: string; name: string } {
  return {
    id: apiCollection.id,
    name: apiCollection.translatedTitle
  }
}

export default async function CollectionsLayout({ children, params }: LayoutProps) {
  const collectionsRes = await getCollectionsWithISR(Language.LANGUAGE_ENGLISH)
  const simpleCollections = collectionsRes.collections?.map(mapCollection) || []

  let books: Book[] = []
  if (params.collectionId) {
    const collectionRes = await businessApi.getCollectionById(
      params.collectionId,
      Language.LANGUAGE_ENGLISH
    )
    books = collectionRes.collection?.books?.map(b => apiSimpleBookToBook(b, params.collectionId!)) || []
  }

  return (
    <HadithSidebar
      collections={simpleCollections}
      books={books}
      activeCollectionId={params.collectionId}
      activeBookId={params.bookId}
    >
      {children}
    </HadithSidebar>
  )
}
