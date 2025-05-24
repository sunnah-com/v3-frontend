"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Book } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "fe/components/ui/sidebar"
import { cn } from "fe/lib/utils"
import { Collection } from "fe/types"
import { useEffect, useState } from "react"
import { useIsMobile } from "fe/hooks/use-mobile"

interface HadithSidebarProps {
  collections: Collection[]
  children: React.ReactNode
}

export function HadithSidebar({ 
  collections, 
  children 
}: HadithSidebarProps) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const isMobile = useIsMobile()
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set())

  // Parse current collection and book from pathname
  const pathParts = pathname.split('/')
  const currentCollectionId = pathParts[2]
  const currentBookId = pathParts[3]

  // Auto-expand current collection
  useEffect(() => {
    if (currentCollectionId) {
      setExpandedCollections(prev => new Set(prev).add(currentCollectionId))
    }
  }, [currentCollectionId])

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [pathname, isMobile, setOpenMobile])

  const toggleCollection = (collectionId: string) => {
    setExpandedCollections(prev => {
      const next = new Set(prev)
      if (next.has(collectionId)) {
        next.delete(collectionId)
      } else {
        next.add(collectionId)
      }
      return next
    })
  }

  return (
    <>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <Home className="size-4" />
                  <span className="font-semibold">Sunnah.com</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Collections</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {collections.map((collection) => {
                  const collectionPath = `/collections/${collection.id}`
                  const isCurrentCollection = currentCollectionId === collection.id
                  const isExpanded = expandedCollections.has(collection.id)
                  
                  return (
                    <SidebarMenuItem key={collection.id}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isCurrentCollection}
                        className="group"
                      >
                        <Link 
                          href={collectionPath}
                          onClick={(e) => {
                            // Allow expanding/collapsing without navigation when clicking the same collection
                            if (isCurrentCollection && !currentBookId) {
                              e.preventDefault()
                              toggleCollection(collection.id)
                            }
                          }}
                        >
                          <Book className="size-4 shrink-0" />
                          <span className="flex-1 truncate">{collection.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {collection.bookCount}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                      
                      {/* Show placeholder for books - will be populated dynamically later */}
                      {isCurrentCollection && isExpanded && (
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={collectionPath}>
                                <span className="text-xs text-muted-foreground">
                                  View all books →
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      
      <SidebarInset className="overflow-auto">
        <header className={cn(
          "sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "px-4 lg:px-6"
        )}>
          <SidebarTrigger 
            className={cn(
              "-ml-1",
              "hover:bg-accent",
              "data-[state=open]:bg-accent"
            )}
          />
          <div className="flex-1">
            {/* Breadcrumb navigation can be added here */}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </>
  )
}