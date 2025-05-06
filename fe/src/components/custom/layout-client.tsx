'use client';

import { useEffect } from "react";
import { Footer } from "./footer";
import { Navbar } from "./navbar";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  // Fix for scroll position when clicking anchor links
  useEffect(() => {
    // Function to handle anchor link clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      // Check if this is an internal anchor link
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      // Prevent default scroll
      e.preventDefault();
      
      // Get the target element
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (!targetElement) return;
      
      // Calculate header height - get the Navbar element
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 150; // Use 150px as fallback
      
      // Calculate the position to scroll to
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20; // Extra 20px padding
      
      // Smooth scroll to the target
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer/>
    </div>
  );
}
