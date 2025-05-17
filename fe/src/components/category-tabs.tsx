'use client'

import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger } from 'fe/components/ui/tabs'

interface CategoryTabsProps {
  active: 'collections' | 'books' | 'hadiths'
  collectionId?: string
  bookId?: string
}

export function CategoryTabs({ active, collectionId, bookId }: CategoryTabsProps) {
  return (
    <Tabs defaultValue={active} className="mb-4">
      <TabsList>
        <TabsTrigger value="collections" asChild>
          <Link href="/collections">Collections</Link>
        </TabsTrigger>
        {collectionId && (
          <TabsTrigger value="books" asChild>
            <Link href={`/collections/${collectionId}`}>Books</Link>
          </TabsTrigger>
        )}
        {bookId && (
          <TabsTrigger value="hadiths" asChild>
            <Link href={`/collections/${collectionId}/${bookId}`}>Hadiths</Link>
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  )
}
