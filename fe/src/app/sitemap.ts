import { MetadataRoute } from 'next';
import { businessApi } from 'fe/lib/api-client';
import { Language } from 'fe/proto/api';

// Define the base URL for the site
const baseUrl = 'https://sunnah.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Initialize the sitemap array with static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/searchtips`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/developers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Fetch collections
  try {
    const collectionsResponse = await businessApi.getAllCollections(Language.LANGUAGE_ENGLISH);
    
    if (collectionsResponse.collections) {
      // Add collection pages to sitemap
      const collectionRoutes = collectionsResponse.collections.map((collection) => ({
        url: `${baseUrl}/collections/${collection.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
      
      staticRoutes.push(...collectionRoutes);
      
      // For each collection, fetch books and add them to sitemap
      // Note: This could potentially be a large number of requests, so we're limiting to collections only
      // In a production environment, you might want to implement a more efficient approach
      // such as pre-generating this data or using a database query
      
      // Example of how to add books (commented out to avoid excessive API calls)
      /*
      for (const collection of collectionsResponse.collections) {
        const collectionResponse = await businessApi.getCollectionById(collection.id, Language.LANGUAGE_ENGLISH);
        
        if (collectionResponse.collection?.books) {
          const bookRoutes = collectionResponse.collection.books.map((book) => ({
            url: `${baseUrl}/collections/${collection.id}/${book.id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
          }));
          
          staticRoutes.push(...bookRoutes);
        }
      }
      */
    }
  } catch (error) {
    console.error('Failed to fetch collections for sitemap:', error);
    // Continue with static routes only
  }

  return staticRoutes;
}
