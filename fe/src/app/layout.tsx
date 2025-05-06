import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "../components/auth/auth-provider";
import { ErrorBoundary } from "../components/error-boundary";
import "./globals.css";
import { TelemetryProvider } from "fe/components/telemetry-provider";
import { LayoutClient } from "../components/custom";
import { Toaster } from "fe/components/ui/sonner";
import { StaticDataProvider } from "../contexts/static-data-context"; 
import { getLanguagesWithISR, getCollectionsWithISR, getReferenceTypesWithISR } from "../lib/isr-data"; 
import { Language } from "fe/proto/api";
import { CollectionWithoutBooks } from "fe/proto/business_models"; // Import API type
import { Collection } from "fe/types"; // Import frontend type

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sunnah.com'),
  title: "Sunnah.com - Sayings and Teachings of Prophet Muhammad (ﷺ)",
  description: "Hadith of the Prophet Muhammad (ﷺ) in several languages",
  keywords: ["hadith", "sunnah", "islam", "quran", "prophet muhammad", "islamic knowledge", "hadith collection"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Sunnah.com',
    title: 'Sunnah.com - Sayings and Teachings of Prophet Muhammad (ﷺ)',
    description: 'Hadith of the Prophet Muhammad (ﷺ) in several languages',
    images: [
      {
        url: '/og-image.jpg', // Create this image in public folder
        width: 1200,
        height: 630,
        alt: 'Sunnah.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunnah.com - Sayings and Teachings of Prophet Muhammad (ﷺ)',
    description: 'Hadith of the Prophet Muhammad (ﷺ) in several languages',
    images: ['/og-image.jpg'], // Same as OpenGraph image
    creator: '@sunnahcom',
    site: '@sunnahcom',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

// Set revalidation time for the data fetched in this layout
export const revalidate = 3600; // 1 hour

// Helper function to map API CollectionWithoutBooks to frontend Collection type
// (Same function as used in collections/page.tsx)
function mapCollectionWithoutBooksToCollection(apiCollection: CollectionWithoutBooks): Collection {
  return {
    id: apiCollection.id,
    name: apiCollection.translatedTitle, // Map translatedTitle to name
    nameArabic: apiCollection.title,      // Map title to nameArabic
    description: apiCollection.introduction || "", // Map introduction to description
    bookCount: apiCollection.numBooks,    // Map numBooks to bookCount
    hadithCount: apiCollection.numHadiths,  // Map numHadiths to hadithCount
  };
}

export default async function RootLayout({ // Make the layout async
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch static data using ISR functions
  // Fetch English collections for now, add Arabic or others if needed
  const [languagesResponse, collectionsEnResponse, referenceTypesResponse] = await Promise.all([
    getLanguagesWithISR(),
    getCollectionsWithISR(Language.LANGUAGE_ENGLISH),
    // getCollectionsWithISR(Language.LANGUAGE_ARABIC), // Uncomment if Arabic collections are needed globally
    getReferenceTypesWithISR()
  ]);

  // Prepare collections data for the context provider
  const collectionsData: { [key in Language]?: Collection[] } = {};
  if (collectionsEnResponse.collections) {
    collectionsData[Language.LANGUAGE_ENGLISH] = collectionsEnResponse.collections.map(mapCollectionWithoutBooksToCollection);
  }
  // Add logic here if Arabic or other language collections are fetched and need mapping

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Wrap the core content with the StaticDataProvider */}
          <StaticDataProvider
            languages={languagesResponse.languages}
            collections={collectionsData}
            referenceTypes={referenceTypesResponse.referenceTypes}
          >
            <AuthProvider>
              <TelemetryProvider>
                <ErrorBoundary>
                  <LayoutClient>
                    {children}
                    <Toaster position="top-right" />
                  </LayoutClient>
                </ErrorBoundary>
              </TelemetryProvider>
            </AuthProvider>
          </StaticDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
