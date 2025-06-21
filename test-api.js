import { businessApi, Language } from './app/lib/api-client.js';

async function testBookIds() {
  try {
    // Get book groups for Bukhari (collection ID 1)
    const response = await businessApi.getBookGroupsByCollectionId(
      "1",
      Language.LANGUAGE_ENGLISH
    );
    
    console.log('Total book groups:', response.bookGroups.length);
    
    // Show first few books
    response.bookGroups.forEach((group, groupIndex) => {
      console.log(`\nBook Group ${groupIndex + 1}: ${group.translatedTitle}`);
      group.books?.slice(0, 3).forEach(book => {
        console.log(`  Book ID: ${book.id}, Number: ${book.bookNumber}, Title: ${book.translatedTitle}`);
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

testBookIds();