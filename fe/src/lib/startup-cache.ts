import fs from 'fs';
import path from 'path';
import { Language } from '../proto/api';
import { CollectionWithoutBooks, HadithReferenceType } from '../proto/business_models';

interface StaticData {
  languages: Language[];
  collections: { [key: number]: CollectionWithoutBooks[] };
  referenceTypes: HadithReferenceType[];
}

const cachePath = process.env.STATIC_DATA_PATH || path.join(process.cwd(), 'preloaded-static-data.json');
let cached: StaticData | null = null;

function loadCache(): StaticData {
  if (!cached) {
    try {
      const raw = fs.readFileSync(cachePath, 'utf-8');
      cached = JSON.parse(raw) as StaticData;
    } catch (err) {
      console.error('Failed to load static data cache', err);
      cached = { languages: [], collections: {}, referenceTypes: [] };
    }
  }
  return cached;
}

export function getLanguagesFromCache(): Language[] {
  return loadCache().languages;
}

export function getCollectionsFromCache(language: Language): CollectionWithoutBooks[] {
  return loadCache().collections[language] || [];
}

export function getReferenceTypesFromCache(): HadithReferenceType[] {
  return loadCache().referenceTypes;
}

