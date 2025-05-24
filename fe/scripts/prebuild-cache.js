#!/usr/bin/env node

/**
 * Pre-build script to cache static data
 * This allows building without backend dependency
 */

const fs = require('fs');
const path = require('path');

// Check if we should skip caching (e.g., in development)
if (process.env.SKIP_PREBUILD_CACHE === 'true') {
  console.log('Skipping pre-build cache generation');
  process.exit(0);
}

// Create cache directory
const cacheDir = path.join(__dirname, '..', '.next', 'cache', 'static-data');
fs.mkdirSync(cacheDir, { recursive: true });

// Default data structure for when backend is not available
const defaultData = {
  languages: [],
  collections: {
    LANGUAGE_ENGLISH: [],
    LANGUAGE_ARABIC: [],
  },
  referenceTypes: [],
  timestamp: new Date().toISOString(),
};

async function fetchAndCacheData() {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl || process.env.USE_DEFAULT_CACHE === 'true') {
    console.log('Using default static data cache');
    fs.writeFileSync(
      path.join(cacheDir, 'data.json'),
      JSON.stringify(defaultData, null, 2)
    );
    return;
  }

  try {
    console.log(`Fetching static data from ${apiUrl}...`);
    
    // Here you would make actual API calls to fetch the data
    // For now, we'll use the default data
    // In a real implementation, you'd use node-fetch or similar
    
    const cachedData = {
      ...defaultData,
      source: apiUrl,
    };
    
    fs.writeFileSync(
      path.join(cacheDir, 'data.json'),
      JSON.stringify(cachedData, null, 2)
    );
    
    console.log('Static data cached successfully');
  } catch (error) {
    console.error('Failed to fetch static data, using defaults:', error);
    fs.writeFileSync(
      path.join(cacheDir, 'data.json'),
      JSON.stringify(defaultData, null, 2)
    );
  }
}

fetchAndCacheData().catch(console.error);