import 'server-only';
import { Language } from '../proto/api';
import {
  GetAllLanguagesResponse,
  GetAllCollectionsResponse,
  GetAllReferenceTypesResponse,
} from 'fe/proto/business_api';
import {
  getLanguagesFromCache,
  getCollectionsFromCache,
  getReferenceTypesFromCache,
} from './startup-cache';

/**
 * These helpers now read from the startup cache populated by
 * `preload-static-data.ts` instead of hitting the backend directly.
 */

export async function getLanguagesWithISR(): Promise<GetAllLanguagesResponse> {
  return { languages: getLanguagesFromCache() };
}

export async function getCollectionsWithISR(
  language: Language,
): Promise<GetAllCollectionsResponse> {
  return { collections: getCollectionsFromCache(language) };
}

export async function getReferenceTypesWithISR(): Promise<GetAllReferenceTypesResponse> {
  return { referenceTypes: getReferenceTypesFromCache() };
}

