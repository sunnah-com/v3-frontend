export default function NewsPage() {
  // Sample news items - in a real application, these would come from a database or API
  const newsItems = [
    {
      id: 1,
      title: "New Hadith Collection Added",
      date: "March 5, 2025",
      summary: "We're excited to announce the addition of a new hadith collection to our platform. The collection includes over 1,000 authenticated hadiths with both English and Arabic translations.",
      link: "#"
    },
    {
      id: 2,
      title: "Website Redesign Launch",
      date: "February 20, 2025",
      summary: "We've completely redesigned Sunnah.com to improve user experience and make it easier to navigate through our extensive hadith collections. The new design is more accessible and responsive across all devices.",
      link: "#"
    },
    {
      id: 3,
      title: "Mobile App Coming Soon",
      date: "January 15, 2025",
      summary: "We're developing a mobile application for Sunnah.com that will allow users to access hadith collections offline. The app will be available for both iOS and Android devices.",
      link: "#"
    },
    {
      id: 4,
      title: "Community Translation Project",
      date: "December 10, 2024",
      summary: "We're launching a community-driven translation project to make hadith collections available in more languages. If you're fluent in multiple languages and interested in contributing, please contact us.",
      link: "#"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">News & Updates</h1>
      
      <div className="space-y-10">
        {newsItems.map((item) => (
          <div key={item.id} className="border-b pb-8">
            <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{item.date}</p>
            <p className="mb-4">{item.summary}</p>
            <a href={item.link} className="text-primary hover:underline">Read more</a>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
        <p className="mb-6">
          Follow us on social media to stay updated with the latest news and announcements.
        </p>
        <div className="flex justify-center space-x-6">
          <a 
            href="https://www.facebook.com/Sunnahcom-104172848076350"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
            aria-label="Facebook"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a 
            href="https://www.instagram.com/_sunnahcom/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a 
            href="https://x.com/SunnahCom"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
            aria-label="X (Twitter)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
