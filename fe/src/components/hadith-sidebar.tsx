'use client'

import Link from 'next/link'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from 'fe/components/ui/sidebar'

interface SidebarCollection { id: string; name: string }
interface SidebarBook { id: string; name: string }
interface SidebarHadith { id: string; number: number }

interface HadithSidebarProps {
  collections: SidebarCollection[]
  books?: SidebarBook[]
  hadiths?: SidebarHadith[]
  activeCollectionId?: string
  activeBookId?: string
  activeHadithId?: string
  children?: React.ReactNode
}

export function HadithSidebar({
  collections,
  books = [],
  hadiths = [],
  activeCollectionId,
  activeBookId,
  activeHadithId,
  children
}: HadithSidebarProps) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <Sidebar className="border-r">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Collections</SidebarGroupLabel>
              <SidebarMenu>
                {collections.map(c => (
                  <SidebarMenuItem key={c.id}>
                    <SidebarMenuButton asChild isActive={c.id === activeCollectionId}>
                      <Link href={`/collections/${c.id}`}>{c.name}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
            {books.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>Books</SidebarGroupLabel>
                <SidebarMenu>
                  {books.map(b => (
                    <SidebarMenuItem key={b.id}>
                      <SidebarMenuButton asChild isActive={b.id === activeBookId}>
                        <Link href={`/collections/${activeCollectionId}/${b.id}`}>{b.name}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            )}
            {hadiths.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>Hadiths</SidebarGroupLabel>
                <SidebarMenu>
                  {hadiths.map(h => (
                    <SidebarMenuItem key={h.id}>
                      <SidebarMenuButton asChild isActive={h.id === activeHadithId}>
                        <Link href={`/collections/${activeCollectionId}/${activeBookId}/${h.id}`}>Hadith {h.number}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            )}
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  )
}
