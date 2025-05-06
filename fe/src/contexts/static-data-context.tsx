'use client'; // This context will be used by client components

import React, { createContext, useContext, ReactNode } from 'react';
import { Language as ProtoLanguage } from 'fe/proto/api'; // Assuming Language enum is here
// Removed incorrect import: import { Collection as ApiCollection } from 'fe/proto/business_models';
import { HadithReferenceType as ApiReferenceType } from 'fe/proto/business_models'; // Assuming ReferenceType message is here
import { Collection } from 'fe/types'; // Your frontend Collection type

// Define the shape of the context data
interface StaticDataContextType {
  languages: ProtoLanguage[];
  collections: {
    // Store collections mapped by language enum value for easy access
    [key in ProtoLanguage]?: Collection[]; // Use frontend Collection type
  };
  referenceTypes: ApiReferenceType[];
}

// Create the context with a default null value
const StaticDataContext = createContext<StaticDataContextType | null>(null);

// Define the props for the provider component
interface StaticDataProviderProps {
  languages: ProtoLanguage[];
  // Pass collections already mapped by language
  collections: { [key in ProtoLanguage]?: Collection[] };
  referenceTypes: ApiReferenceType[];
  children: ReactNode;
}

/**
 * Provider component that makes static ISR data available via context.
 * This should wrap the application in the root layout.
 */
export function StaticDataProvider({
  languages,
  collections,
  referenceTypes,
  children,
}: StaticDataProviderProps) {
  const value = {
    languages,
    collections,
    referenceTypes,
  };

  return (
    <StaticDataContext.Provider value={value}>
      {children}
    </StaticDataContext.Provider>
  );
}

/**
 * Custom hook to easily access the static data context.
 * Throws an error if used outside of a StaticDataProvider.
 */
export function useStaticData(): StaticDataContextType {
  const context = useContext(StaticDataContext);
  if (context === null) {
    throw new Error('useStaticData must be used within a StaticDataProvider');
  }
  return context;
}
