import { NextResponse } from 'next/server';
import { businessApi } from 'fe/lib/api-client';
import { languageFromJSON } from 'fe/proto/api';
import { headers } from 'next/headers';

// Cache the response for 1 hour
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type');
    const languageParam = searchParams.get('language');
    const language = languageParam ? languageFromJSON(languageParam) : undefined;
    
    // Get headers for forwarding
    const headersList = await headers();
    
    switch (dataType) {
      case 'languages':
        const languages = await businessApi.getAllLanguages(headersList);
        return NextResponse.json(languages);
        
      case 'collections':
        if (!language) {
          return NextResponse.json({ error: 'Language parameter required' }, { status: 400 });
        }
        const collections = await businessApi.getAllCollections(language, headersList);
        return NextResponse.json(collections);
        
      case 'referenceTypes':
        const referenceTypes = await businessApi.getAllReferenceTypes(headersList);
        return NextResponse.json(referenceTypes);
        
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching static data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}