import { Link, useLocation, useFetcher } from "@remix-run/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Book, Home, ChevronDown, ChevronRight, Loader2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "~/lib/utils";
import type { Collection } from "~/types";

interface SidebarBook {
  id: string;
  name: string;
  nameArabic: string;
  number: number;
  hadithCount: number;
}

interface SidebarCollection extends Collection {
  books?: SidebarBook[];
}

interface SidebarProps {
  collections: SidebarCollection[];
  className?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({
  collections: initialCollections,
  className,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose
}: SidebarProps) {
  const location = useLocation();
  const booksFetcher = useFetcher<{ books: SidebarBook[] }>();
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
  const [collectionsWithBooks, setCollectionsWithBooks] = useState<Map<string, SidebarBook[]>>(new Map());
  const [isMobile, setIsMobile] = useState(false);
  // Track which collection is currently being fetched
  const currentFetchingCollectionId = useRef<string | null>(null);
  // Ref to access current collections state without causing re-renders
  const collectionsWithBooksRef = useRef<Map<string, SidebarBook[]>>(new Map());

  // Update ref whenever state changes
  useEffect(() => {
    collectionsWithBooksRef.current = collectionsWithBooks;
  }, [collectionsWithBooks]);

  // Parse current route
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentCollectionId = pathSegments[1]; // /collections/[collectionId]
  const currentBookId = pathSegments[2]; // /collections/[collectionId]/[bookId]

  // Memoized function to fetch books for a collection
  const fetchBooksForCollection = useCallback((collectionId: string) => {
    // Find the collection to check its bookCount
    const collection = initialCollections.find(c => c.id === collectionId);

    if (!collection) {
      console.log(`❌ Collection ${collectionId} not found in initial collections`);
      return;
    }

    // If collection has 0 books, don't fetch - just mark it as having no books
    if (collection.bookCount === 0) {
      console.log(`📋 Collection ${collectionId} has 0 books, marking as empty without fetching`);
      setCollectionsWithBooks(prev => new Map(prev).set(collectionId, []));
      return;
    }

    // Use the ref to check current state instead of dependency
    const hasBooks = collectionsWithBooksRef.current.has(collectionId);
    const isCurrentlyFetching = currentFetchingCollectionId.current;

    if (!hasBooks && !isCurrentlyFetching) {
      console.log(`🔍 Fetching books for collection ${collectionId}...`);
      currentFetchingCollectionId.current = collectionId;
      booksFetcher.load(`/api/collections/${collectionId}/books`);
    } else if (hasBooks) {
      console.log(`📋 Books already cached for collection ${collectionId}`);
    }
  }, [booksFetcher, initialCollections]); // Remove collectionsWithBooks dependency

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-expand current collection (only if not collapsed)
  useEffect(() => {
    if (currentCollectionId && !isCollapsed) {
      setExpandedCollections(prev => new Set([...prev, currentCollectionId]));
    }
  }, [currentCollectionId, isCollapsed]);

  // Auto-fetch books for current collection when it gets expanded
  useEffect(() => {
    if (currentCollectionId && !isCollapsed && expandedCollections.has(currentCollectionId)) {
      // Use setTimeout to avoid any potential setState during render warnings
      const timeoutId = setTimeout(() => {
        fetchBooksForCollection(currentCollectionId);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [currentCollectionId, isCollapsed, expandedCollections, fetchBooksForCollection]);

  // Collapse expanded collections when sidebar is collapsed
  useEffect(() => {
    if (isCollapsed) {
      setExpandedCollections(new Set());
    }
  }, [isCollapsed]);

  // Initialize collections with preloaded books and mark zero-book collections (only on first load, preserve existing data)
  useEffect(() => {
    setCollectionsWithBooks(prev => {
      const newMap = new Map(prev); // Preserve existing books
      initialCollections.forEach(collection => {
        // Don't overwrite if we already have data for this collection
        if (!newMap.has(collection.id)) {
          if (collection.books && collection.books.length > 0) {
            // Add preloaded books
            newMap.set(collection.id, collection.books);
          } else if (collection.bookCount === 0) {
            // Mark collections with 0 books as empty (silently)
            newMap.set(collection.id, []);
          }
          // If bookCount > 0 but no preloaded books, leave it unmarked for dynamic fetching
        }
      });
      return newMap;
    });
  }, [initialCollections]);

  // Handle fetcher response
  useEffect(() => {
    if (booksFetcher.data && booksFetcher.state === 'idle' && currentFetchingCollectionId.current) {
      const collectionId = currentFetchingCollectionId.current;
      console.log(`📚 Successfully fetched books for collection ${collectionId}:`, booksFetcher.data.books.length, 'books');
      setCollectionsWithBooks(prev => new Map(prev).set(collectionId, booksFetcher.data!.books));
      currentFetchingCollectionId.current = null; // Clear the tracking
    }
  }, [booksFetcher.data, booksFetcher.state]);

  const toggleCollection = (collectionId: string) => {
    if (isCollapsed) {
      // If collapsed, expand sidebar first
      onToggleCollapse();
      return;
    }

    setExpandedCollections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(collectionId)) {
        newSet.delete(collectionId);
      } else {
        newSet.add(collectionId);

        // Load books if not already loaded
        fetchBooksForCollection(collectionId);
      }
      return newSet;
    });
  };

  const getCollectionBooks = (collectionId: string): SidebarBook[] => {
    return collectionsWithBooks.get(collectionId) || [];
  };

  const isLoadingBooks = (collectionId: string): boolean => {
    return booksFetcher.state === 'loading' && currentFetchingCollectionId.current === collectionId;
  };

  // Helper function to determine the collection link URL
  const getCollectionLinkUrl = (collection: Collection) => {
    const books = getCollectionBooks(collection.id);
    const isLoading = isLoadingBooks(collection.id);

    // If collection has 0 books according to bookCount, go to first chapter
    if (collection.bookCount === 0) {
      return `/collections/${collection.id}/1`;
    }

    // If no books are loaded/cached and it's not currently loading, go to book 1
    if (books.length === 0 && !isLoading) {
      console.log(`📖 Collection ${collection.id} has no books loaded, linking to book 1`);
      return `/collections/${collection.id}/1`;
    }

    console.log(`📚 Collection ${collection.id} has ${books.length} books loaded, linking to collection page`);
    return `/collections/${collection.id}`;
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-50 h-screen md:h-full border-r bg-background transition-all duration-300 ease-in-out resize-x overflow-auto",
      "md:relative md:translate-x-0",
      isCollapsed ? "w-16" : "w-64 min-w-[16rem] max-w-[32rem]",
      isMobile ? (isCollapsed ? "-translate-x-full" : "translate-x-0") : "translate-x-0",
      className
    )}>
      <div className="flex h-full flex-col">
        {/* Header with Toggle Button */}
        <div className="border-b p-4 flex items-center justify-between">
          {!isCollapsed ? (
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold text-lg hover:text-primary transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Sunnah.com</span>
            </Link>
          ) : (
            <Link
              to="/"
              className="flex items-center justify-center w-full hover:text-primary transition-colors"
              title="Sunnah.com"
            >
              <Home className="h-5 w-5" />
            </Link>
          )}

          {/* Toggle Button - Always visible on desktop */}
          {!isMobile && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-sm hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {!isCollapsed && (
              <h3 className="px-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Collections
              </h3>
            )}

            {initialCollections.map((collection) => {
              const isCurrentCollection = currentCollectionId === collection.id;
              const isExpanded = expandedCollections.has(collection.id);
              const books = getCollectionBooks(collection.id);
              const hasBooks = books.length > 0;
              const loadingBooks = isLoadingBooks(collection.id);

              return (
                <div key={collection.id} className="space-y-1">
                  {/* Collection Link */}
                  <div className="flex items-center">
                    <Link
                      to={getCollectionLinkUrl(collection)}
                      className={cn(
                        "flex-1 flex items-center gap-2 px-2 py-2 text-sm rounded-md transition-colors group",
                        isCurrentCollection
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                        isCollapsed && "justify-center"
                      )}
                      title={isCollapsed ? collection.name : undefined}
                    >
                      <Book className="h-4 w-4 shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 truncate">{collection.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {collection.bookCount}
                          </span>
                        </>
                      )}
                    </Link>

                    {/* Expand/Collapse Button - Only show when not collapsed and collection has books */}
                    {!isCollapsed && collection.bookCount > 0 && (
                      <button
                        onClick={() => toggleCollection(collection.id)}
                        disabled={loadingBooks}
                        className={cn(
                          "p-1 rounded-sm hover:bg-accent transition-colors disabled:opacity-50",
                          isCurrentCollection ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {loadingBooks ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Books List - Only show when expanded, not collapsed, and collection has books */}
                  {isExpanded && !isCollapsed && collection.bookCount > 0 && (
                    <div className="ml-6 space-y-1 border-l border-border pl-2">
                      {hasBooks ? (
                        books.map((book) => {
                          const isCurrentBook = currentBookId === book.id;

                          return (
                            <Link
                              key={book.id}
                              to={`/collections/${collection.id}/${book.id}`}
                              className={cn(
                                "block px-2 py-1.5 text-sm rounded-md transition-colors",
                                isCurrentBook
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate">
                                  {book.number}. {book.name}
                                </span>
                                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                  {book.hadithCount}
                                </span>
                              </div>
                            </Link>
                          );
                        })
                      ) : !loadingBooks ? (
                        <div className="px-2 py-1.5 text-xs text-muted-foreground">
                          No books available
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="border-t p-4 text-xs text-muted-foreground">
            <div className="text-center">
              {initialCollections.length} Collections Available
            </div>
          </div>
        )}
      </div>
    </aside>
  );
} 