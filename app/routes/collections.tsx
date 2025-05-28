import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Sidebar } from "~/components/sidebar";
import { getCachedCollectionsWithBooks } from "~/services/data-cache.server";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  // Get collections with books for the sidebar
  const collections = await getCachedCollectionsWithBooks();
  
  return json({ collections });
}

export default function CollectionsLayout() {
  const { collections } = useLoaderData<typeof loader>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, sidebar should be closed by default
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={cn(
          "fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-background border shadow-sm",
          isSidebarOpen && "hidden"
        )}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile close button when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="fixed top-4 right-4 z-50 lg:hidden p-2 rounded-md bg-background border shadow-sm"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Mobile backdrop */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        collections={collections as any[]}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
        className={cn(
          isMobile ? (isSidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        )}
      />

      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        // Adjust margin based on sidebar state
        !isMobile && (isCollapsed ? "lg:ml-0" : "lg:ml-0"), // Sidebar is relative, so no margin needed
        isMobile && "ml-0" // No margin on mobile since sidebar is fixed
      )}>
        <div className="container mx-auto px-4 py-8 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
} 