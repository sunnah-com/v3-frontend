'use client'

import Link from 'next/link';
import { FileText } from 'lucide-react'; // Import an icon
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger
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
        <Sidebar className="border-r" collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Collections</SidebarGroupLabel>
              <SidebarMenu>
                {collections.map(c => (
                  <SidebarMenuItem key={c.id}>
                    <SidebarMenuButton asChild isActive={c.id === activeCollectionId} tooltip={c.name}>
                      <Link href={`/collections/${c.id}`}>
                        <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span>{c.name}</span>
                      </Link>
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
                      <SidebarMenuButton asChild isActive={b.id === activeBookId} tooltip={b.name}>
                        <Link href={`/collections/${activeCollectionId}/${b.id}`}>
                          <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span>{b.name}</span>
                        </Link>
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
                      <SidebarMenuButton asChild isActive={h.id === activeHadithId} tooltip={`Hadith ${h.number}`}>
                        <Link href={`/collections/${activeCollectionId}/${activeBookId}/${h.id}`}>
                          <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span>Hadith {h.number}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            )}
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1">
          <div className="p-4"> {/* Added padding for the trigger */}
            <SidebarTrigger />
          </div>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
