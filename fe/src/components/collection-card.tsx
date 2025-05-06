"use client"

import Link from "next/link";
import { Collection } from "fe/types"; // Import Collection from our types
import { cn } from "fe/lib/utils";
import { useState, useRef, MouseEvent } from "react";

interface CollectionCardProps {
  collection: Collection; // Use our Collection type
  className?: string;
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    // Get the card's dimensions and position
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the card center (in percentage)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Set rotation values (inverted for natural feel)
    setRotation({
      x: -y * 10, // Rotate around X-axis (horizontal tilt)
      y: x * 10,  // Rotate around Y-axis (vertical tilt)
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <Link href={`/collections/${collection.id}`}>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovering 
            ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)` 
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: 'transform 0.2s ease'
        }}
        className={cn(
          "group relative overflow-hidden rounded-lg border bg-card p-6 text-card-foreground shadow will-change-transform",
          className
        )}
      >
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <h3 className="text-lg font-semibold tracking-tight">{collection.name}</h3>
            <p className="arabic text-xl font-medium text-right">{collection.nameArabic}</p>
          </div>
        </div>
        
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {collection.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{collection.bookCount} Books</span>
            <span>•</span>
            <span>{collection.hadithCount} Hadiths</span>
          </div>
          <div className="text-primary group-hover:underline">View Collection</div>
        </div>
      </div>
    </Link>
  )
}
