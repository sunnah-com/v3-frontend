import Link from "next/link"
import { notFound } from "next/navigation"
import { businessApi } from "fe/lib/api-client"
import { Language } from "fe/proto/api"
import { Collection, apiDetailedCollectionToCollection } from "fe/types"

interface CollectionInfoPageProps {
  params: Promise<{
    collectionId: string
  }>
}

export async function generateMetadata(props: CollectionInfoPageProps) {
  const params = await props.params;
  
  try {
    // Fetch collection details from API
    const response = await businessApi.getCollectionById(params.collectionId, Language.LANGUAGE_ENGLISH);
    
    if (!response.collection) {
      return {
        title: "Collection Not Found - Sunnah.com",
      };
    }
    
    const collection = apiDetailedCollectionToCollection(response.collection);
    
    return {
      title: `${collection.name} Information - Sunnah.com`,
      description: `Detailed information about ${collection.name}`,
    };
  } catch (error) {
    console.error("Failed to fetch collection for metadata:", error);
    return {
      title: "Collection Not Found - Sunnah.com",
    };
  }
}

export default async function CollectionInfoPage(props: CollectionInfoPageProps) {
  const params = await props.params;
  
  // Fetch collection details from API
  let collection: Collection | null = null;
  
  try {
    // Fetch the specific collection
    const collectionResponse = await businessApi.getCollectionById(params.collectionId, Language.LANGUAGE_ENGLISH);
    
    if (!collectionResponse.collection) {
      notFound();
    }
    
    collection = apiDetailedCollectionToCollection(collectionResponse.collection);
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    notFound();
  }
  
  if (!collection) {
    notFound();
  }

  // Additional information for each collection
  const additionalInfo: Record<string, { author: string; period: string; methodology: string; significance: string }> = {
    "bukhari": {
      author: "Imam Muhammad ibn Ismail al-Bukhari (194-256 AH / 810-870 AD)",
      period: "Compiled during the 3rd century AH (9th century AD)",
      methodology: "Imam Bukhari applied stringent criteria for accepting hadith, requiring direct, continuous chains of narrators known for their impeccable character and memory.",
      significance: "Sahih al-Bukhari is considered the most authentic book after the Quran. It contains 7,563 hadith (including repetitions) selected from over 600,000 that Imam Bukhari examined during his 16-year journey across the Islamic world."
    },
    "muslim": {
      author: "Imam Muslim ibn al-Hajjaj (206-261 AH / 821-875 AD)",
      period: "Compiled during the 3rd century AH (9th century AD)",
      methodology: "Imam Muslim applied rigorous standards similar to Bukhari's, focusing on hadith with continuous chains of reliable narrators.",
      significance: "Sahih Muslim is regarded as the second most authentic hadith collection. It contains approximately 7,500 hadith, carefully arranged by subject matter for easier reference."
    },
    "nasai": {
      author: "Imam Ahmad ibn Shu'ayb an-Nasa'i (215-303 AH / 830-915 AD)",
      period: "Compiled during the late 3rd century AH (9th century AD)",
      methodology: "Imam Nasa'i focused on subtle differences in the chains of narration and text, providing valuable insights into hadith criticism.",
      significance: "Sunan an-Nasa'i is known for its high standard of authenticity and detailed commentary on legal issues, containing approximately 5,700 hadith."
    },
    "abudawud": {
      author: "Imam Abu Dawud Sulayman ibn al-Ash'ath (202-275 AH / 817-889 AD)",
      period: "Compiled during the 3rd century AH (9th century AD)",
      methodology: "Imam Abu Dawud collected hadith specifically focused on legal rulings, noting the strengths and weaknesses of various narrations.",
      significance: "Sunan Abi Dawud contains approximately 5,300 hadith and is particularly valued by scholars of Islamic jurisprudence for its practical legal applications."
    },
    "tirmidhi": {
      author: "Imam Abu Isa Muhammad at-Tirmidhi (209-279 AH / 824-892 AD)",
      period: "Compiled during the 3rd century AH (9th century AD)",
      methodology: "Imam Tirmidhi categorized hadith by their level of authenticity and noted differences of opinion among jurists.",
      significance: "Jami' at-Tirmidhi contains approximately 4,000 hadith and is distinguished by its commentary on the opinions of early jurists and scholars."
    },
    "ibnmajah": {
      author: "Imam Muhammad ibn Yazid Ibn Majah (209-273 AH / 824-887 AD)",
      period: "Compiled during the 3rd century AH (9th century AD)",
      methodology: "Imam Ibn Majah included hadith not found in other major collections, with varying levels of authenticity.",
      significance: "Sunan Ibn Majah contains approximately 4,300 hadith and completes what is known as the 'Six Books' (Kutub al-Sittah) of hadith."
    },
    "malik": {
      author: "Imam Malik ibn Anas (93-179 AH / 711-795 AD)",
      period: "Compiled during the 2nd century AH (8th century AD)",
      methodology: "Imam Malik recorded the practice of Madinah's scholars and residents, considering it a living tradition from the Prophet's time.",
      significance: "Muwatta Malik is the earliest surviving hadith collection, containing approximately 1,600 narrations and forming the basis of Maliki jurisprudence."
    },
    "nawawi40": {
      author: "Imam Yahya ibn Sharaf an-Nawawi (631-676 AH / 1233-1277 AD)",
      period: "Compiled during the 7th century AH (13th century AD)",
      methodology: "Imam Nawawi selected 42 comprehensive hadith that cover the fundamental principles of Islam.",
      significance: "An-Nawawi's 40 Hadith is a concise collection that serves as an introduction to the core teachings of Islam, widely memorized and studied throughout the Muslim world."
    }
  };

  // Default information if specific collection details are not available
  const collectionInfo = additionalInfo[collection.id] || {
    author: "Information not available",
    period: "Information not available",
    methodology: "Information not available",
    significance: "Information not available"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href={`/collections/${collection.id}`} 
          className="text-primary hover:underline mb-4 inline-block"
        >
          ← Back to Collection
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold">{collection.name}</h1>
          </div>
          
          {/* Desktop view: Arabic text with metadata below */}
          <div className="hidden md:flex flex-col items-end">
            <p className="arabic text-2xl font-medium">{collection.nameArabic}</p>
            <div className="text-sm text-muted-foreground mt-2">
              <div>{collection.bookCount} Books</div>
              <div>{collection.hadithCount} Hadiths</div>
            </div>
          </div>
          
          {/* Mobile view: Metadata and Arabic on same line */}
          <div className="flex md:hidden justify-between items-center mt-2">
            <div className="text-sm text-muted-foreground">
              <div>{collection.bookCount} Books</div>
              <div>{collection.hadithCount} Hadiths</div>
            </div>
            <p className="arabic text-2xl font-medium">{collection.nameArabic}</p>
          </div>
        </div>
        
        <div className="space-y-8 mt-8">
          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-lg">{collection.description}</p>
          </section>
          
          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold mb-4">Author</h2>
            <p className="text-lg">{collectionInfo.author}</p>
          </section>
          
          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold mb-4">Historical Period</h2>
            <p className="text-lg">{collectionInfo.period}</p>
          </section>
          
          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold mb-4">Methodology</h2>
            <p className="text-lg">{collectionInfo.methodology}</p>
          </section>
          
          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold mb-4">Significance</h2>
            <p className="text-lg">{collectionInfo.significance}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
