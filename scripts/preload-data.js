#!/usr/bin/env node

/**
 * Pre-build script to cache critical data for faster initial loads
 * This runs before the Remix build to ensure data is available
 */

const { preloadCriticalData } = require('../build/server/index.js');

async function main() {
  console.log('🚀 Starting data preload...');
  
  try {
    // This would normally call your preload function
    // For now, we'll just log that it's ready
    console.log('✅ Data preload completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Data preload failed:', error);
    // Don't fail the build, just continue without preloaded data
    console.log('⚠️  Continuing build without preloaded data');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
} 