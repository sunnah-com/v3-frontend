import {
  DetailedCollection,
  SimpleBook,
  DetailedChapter,
  SimpleHadith,
  DetailedHadith
} from "fe/proto/business_models";

// Collection (e.g., Sahih al-Bukhari)
export interface Collection {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  bookCount: number;
  hadithCount: number;
}

// Book (e.g., Book of Revelation)
export interface Book {
  id: string;
  collectionId: string;
  name: string;
  nameArabic: string;
  hadithCount: number;
  chapterCount: number;
  number: number;
}

// Chapter
export interface Chapter {
  id: string;
  bookId: string;
  name: string;
  nameArabic: string;
  number: number;
}

// Hadith
export interface Hadith {
  id: string;
  collectionId: string;
  bookId: string;
  chapterId: string;
  number: number;
  text: string;
  textArabic: string;
  grade?: string;
  gradeSource?: string;
  narrator?: string;
  reference?: string;
  inBookReference?: string;
  englishTranslation?: string;
}

// Adapter functions to convert from API types to frontend types


/**
 * Convert a DetailedCollection from the API to the frontend Collection type
 */
export function apiDetailedCollectionToCollection(apiCollection: DetailedCollection): Collection {
  return {
    id: apiCollection.id,
    name: apiCollection.translatedName,
    nameArabic: apiCollection.name,
    description: apiCollection.introduction || "", // Use introduction as description
    bookCount: apiCollection.numBooks,
    hadithCount: apiCollection.numHadiths,
  };
}

/**
 * Convert SimpleBook from the API to the frontend Book type
 */
export function apiSimpleBookToBook(apiBook: SimpleBook, collectionId: string): Book {
  return {
    id: apiBook.id,
    collectionId: collectionId,
    name: apiBook.translatedTitle,
    nameArabic: apiBook.title,
    hadithCount: apiBook.numHadiths || 0, // Use numHadiths if available
    chapterCount: apiBook.numChapters || 0, // Use numChapters if available
    number: parseInt(apiBook.bookNumber) || apiBook.order, // Use bookNumber if parseable, otherwise order
  };
}

/**
 * Convert DetailedChapter from the API to the frontend Chapter type
 */
export function apiDetailedChapterToChapter(apiChapter: DetailedChapter): Chapter {
  return {
    id: apiChapter.id,
    bookId: apiChapter.book?.id || "",
    name: apiChapter.translatedTitle,
    nameArabic: apiChapter.title,
    number: parseInt(apiChapter.chapterNumber) || apiChapter.order,
  };
}

/**
 * Convert SimpleHadith from the API to the frontend Hadith type
 */
export function apiSimpleHadithToHadith(
  apiHadith: SimpleHadith, 
  collectionId: string, 
  bookId: string, 
  chapterId: string
): Hadith {
  // Find reference values if available
  const inBookRef = apiHadith.references?.find(ref => ref.id === "InBook");
  const overallRef = apiHadith.references?.find(ref => ref.id === "Overall");
  
  // Find grade if available
  const grade = apiHadith.gradings && apiHadith.gradings.length > 0 
    ? apiHadith.gradings[0].grade 
    : undefined;
  
  const gradeSource = apiHadith.gradings && apiHadith.gradings.length > 0 
    ? apiHadith.gradings[0].grader?.translatedName 
    : undefined;

  return {
    id: apiHadith.id,
    collectionId,
    bookId,
    chapterId,
    number: parseInt(apiHadith.hadithNumber) || apiHadith.order,
    text: apiHadith.translatedText,
    textArabic: apiHadith.arabicText,
    grade,
    gradeSource,
    reference: overallRef?.value,
    inBookReference: inBookRef?.value,
    englishTranslation: "", // Not directly available
  };
}

/**
 * Convert DetailedHadith from the API to the frontend Hadith type
 */
export function apiDetailedHadithToHadith(apiHadith: DetailedHadith): Hadith {
  // Find reference values if available
  const inBookRef = apiHadith.references?.find(ref => ref.id === "InBook");
  const overallRef = apiHadith.references?.find(ref => ref.id === "Overall");
  
  // Find grade if available
  const grade = apiHadith.gradings && apiHadith.gradings.length > 0 
    ? apiHadith.gradings[0].grade 
    : undefined;
  
  const gradeSource = apiHadith.gradings && apiHadith.gradings.length > 0 
    ? apiHadith.gradings[0].grader?.translatedName 
    : undefined;

  return {
    id: apiHadith.id,
    collectionId: apiHadith.collectionId || "",
    bookId: apiHadith.book?.id || "",
    chapterId: apiHadith.chapter?.id || "",
    number: parseInt(apiHadith.hadithNumber) || apiHadith.order,
    text: apiHadith.translatedText,
    textArabic: apiHadith.arabicText,
    grade,
    gradeSource,
    reference: overallRef?.value,
    inBookReference: inBookRef?.value,
    englishTranslation: "", // Not directly available
  };
}
