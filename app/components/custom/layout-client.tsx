import { useEffect } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import type { Theme } from "~/lib/theme.server";

interface LayoutClientProps {
  children: React.ReactNode;
  theme: Theme;
}

export function LayoutClient({ children, theme }: LayoutClientProps) {
  // Fix for scroll position when clicking anchor links
  useEffect(() => {
    // Function to handle anchor link clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      // Check if this is an anchor link
      if (anchor.hash && anchor.hash.length > 1 && 
          // Ensure the link is to the current page
          (anchor.pathname === window.location.pathname || anchor.href.indexOf('#') !== -1)) {
        e.preventDefault();
        
        // Get target element
        const targetId = anchor.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (!targetElement) return;
        
        // Calculate header height
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 150; // Use 150px as fallback
        
        // Calculate position and scroll
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash
        history.pushState(null, '', anchor.hash);
      }
    };
    
    // Handle initial load with hash in URL
    const handleInitialHash = () => {
      if (window.location.hash) {
        setTimeout(() => {
          const targetId = window.location.hash.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (!targetElement) return;
          
          // Calculate header height
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 150; // Use 150px as fallback
          
          // Calculate position and scroll
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100); // Small delay to ensure DOM is fully rendered
      }
    };
    
    // Add click listener to all anchor links
    document.addEventListener('click', handleAnchorClick);
    
    // Handle initial page load with hash
    handleInitialHash();
    
    // Clean up event listener on unmount
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar theme={theme} />
      <main className="flex-grow scroll-compensated-content">
        {children}
      </main>
      <Footer />
    </div>
  );
} 