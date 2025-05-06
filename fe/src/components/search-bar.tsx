"use client";

// Removed duplicate imports below
import { useState, useEffect, useMemo } from "react"; // Kept this line with useMemo
import { Search, Filter, HelpCircle, ExternalLink, Check } from "lucide-react"; // Kept this line
import Link from "next/link"; // Kept this line
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "fe/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "fe/components/ui/dialog";
import { useStaticData } from "../contexts/static-data-context"; // Import the hook
import { Language } from "fe/proto/api"; // Import Language enum

interface SearchBarProps {
  size?: "default" | "compact";
  // Removed collections prop: collections?: Collection[]
}

export function SearchBar({ size = "default" }: SearchBarProps) {
  // Removed collections from props
  const { collections: collectionsByLang } = useStaticData(); // Get data from context
  const [query, setQuery] = useState("");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [tempSelectedCollections, setTempSelectedCollections] = useState<
    string[]
  >([]);
  const [open, setOpen] = useState(false);

  // Get English collections from the context data, default to empty array
  const collections = useMemo(
    () => collectionsByLang?.[Language.LANGUAGE_ENGLISH] || [],
    [collectionsByLang]
  );

  // Initialize temporary selections when dialog opens
  useEffect(() => {
    if (open) {
      setTempSelectedCollections([...selectedCollections]);
    }
  }, [open, selectedCollections]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would redirect to search results
    console.log(
      "Search query:",
      query,
      "Selected collections:",
      selectedCollections
    );
  };

  const isCompact = size === "compact";

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <Search
          className={`absolute left-2 top-1/2 ${
            isCompact ? "h-3.5 w-3.5" : "h-4 w-4"
          } -translate-y-1/2 text-primary`}
        />
        <input
          type="text"
          placeholder={isCompact ? "Search hadith..." : "Search ..."}
          className={`w-full rounded-md border ${
            isCompact
              ? "border-primary/30 bg-background py-1.5"
              : "border-primary/20 bg-card py-3"
          } ${
            isCompact ? "pl-8" : "pl-10"
          } pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className={`rounded-md border border-primary/20 ${
                isCompact ? "px-2 py-0.5" : "px-3 py-1"
              } text-xs font-medium flex items-center gap-1 hover:bg-primary/10 transition-colors ${
                selectedCollections.length > 0 ? "bg-primary/5" : ""
              }`}
            >
              <Filter className={`${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
              {!isCompact && (
                <>
                  <span className="hidden md:inline">Filter</span>
                  {selectedCollections.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-xs">
                      {selectedCollections.length}
                    </span>
                  )}
                </>
              )}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Collections</DialogTitle>
            </DialogHeader>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {collections.map((collection) => {
                const isSelected = tempSelectedCollections.includes(
                  collection.id
                );
                return (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => {
                      setTempSelectedCollections((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== collection.id)
                          : [...prev, collection.id]
                      );
                    }}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-primary/20 hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="h-3 w-3" />
                    )}
                    {collection.name}
                  </button>
                );
              })}
            </div>
            <DialogFooter className="mt-6 flex justify-between sm:justify-between">
              <button
                type="button"
                onClick={() => setTempSelectedCollections([])}
                className="rounded-md border border-primary/20 px-4 py-2 text-xs font-medium hover:bg-primary/5 transition-colors"
              >
                Clear
              </button>
              <DialogClose asChild>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCollections(tempSelectedCollections)
                  }
                  className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`rounded-md border border-primary/20 ${
                isCompact ? "px-2 py-0.5" : "px-3 py-1"
              } text-xs font-medium flex items-center gap-1 hover:bg-primary/10 transition-colors`}
              aria-label="Search Tips"
            >
              <HelpCircle className={`${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
              {!isCompact && <span className="hidden md:inline">Tips</span>}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-3">
              <h3 className="font-medium">Search Tips</h3>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">
                    Quotes e.g. &quot;pledge allegiance&quot;
                  </p>
                  <p className="text-muted-foreground">
                    Searches for the whole phrase instead of individual words
                  </p>
                </div>

                <div>
                  <p className="font-medium">Wildcards e.g. test*</p>
                  <p className="text-muted-foreground">
                    Matches any set of one or more characters. For example test*
                    would result in test, tester, testers, etc.
                  </p>
                </div>

                <div>
                  <p className="font-medium">Fuzzy Search e.g. swore~</p>
                  <p className="text-muted-foreground">
                    Finds terms that are similar in spelling. For example swore~
                    would result in swore, snore, score, etc.
                  </p>
                </div>

                <div>
                  <p className="font-medium">
                    Term Boosting e.g. pledge^4 hijrah
                  </p>
                  <p className="text-muted-foreground">
                    Boosts words with higher relevance. Here, the word pledge
                    will have higher weight than hijrah
                  </p>
                </div>

                <div>
                  <p className="font-medium">
                    Boolean Operators e.g. (&quot;pledge allegiance&quot; OR
                    &quot;shelter&quot;) AND prayer
                  </p>
                  <p className="text-muted-foreground">
                    Create complex phrase and word queries by using Boolean
                    logic.
                  </p>
                </div>

                <Link
                  href="/searchtips"
                  className="flex items-center gap-1 text-primary hover:underline mt-2 font-medium"
                >
                  More <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <button
          type="submit"
          className={`rounded-md bg-primary ${
            isCompact ? "p-1" : "p-1.5"
          } flex items-center justify-center text-primary-foreground`}
          aria-label="Search"
        >
          <Search className={`${isCompact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
          {!isCompact && <span className="hidden md:inline">Search</span>}
        </button>
      </div>
    </form>
  );
}
