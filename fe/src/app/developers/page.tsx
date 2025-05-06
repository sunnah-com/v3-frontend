import Link from "next/link";

export default function DevelopersPage() {
  // Repository links
  const repositories = [
    {
      id: 1,
      name: "The Sunnah.com website",
      language: "PHP",
      url: "https://github.com/sunnah-com/website"
    },
    {
      id: 2,
      name: "Sunnah.com API",
      language: "Python (Flask)",
      url: "https://github.com/sunnah-com/api"
    },
    {
      id: 3,
      name: "Corrections",
      language: "Python and JavaScript",
      url: "https://github.com/sunnah-com/corrections"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Developers</h1>
      
      <div className="prose dark:prose-invert max-w-none mb-12">
        <p className="text-lg mb-6">
          At <Link href="/" className="text-primary hover:underline">sunnah.com</Link> we are committed to providing an <Link href="/about" className="text-primary hover:underline">open platform for hadith</Link> that includes data and tools. To this end, we have an API for consumption and <a href="https://github.com/sunnah-com" className="text-primary hover:underline">several open-source projects</a> on which we invite contributions.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">API</h2>
        <p>
          Our API offers access to a portion of our data comprising the sunnah of the Prophet Muhammad (ﷺ). We will add to the data available as we complete manual checks of the data. API documentation is available at <a href="https://sunnah.stoplight.io/docs/api/" className="text-primary hover:underline">sunnah.stoplight.io/docs/api/</a>. You will need an API key to access this data; you can <a href="https://github.com/sunnah-com/api/issues/new?template=request-for-api-access.md&title=Request+for+API+access%3A+%5BYour+Name%5D" className="text-primary hover:underline">create an issue</a> on our GitHub repo to request one. You may also request an offline dump of hadith data if that is more suited to your needs (not available yet).
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contribute</h2>
        <p>
          We are excited that you are interested in contributing to the sunnah.com project! Our code repositories are hosted on GitHub:
        </p>
        
        <div className="mt-4 space-y-4">
          {repositories.map((repo) => (
            <div key={repo.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <a href={repo.url} className="font-medium text-primary hover:underline">{repo.name}</a>
                <p className="text-sm text-muted-foreground">{repo.language}</p>
              </div>
              <a 
                href={repo.url}
                className="mt-2 sm:mt-0 inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                View Repository
              </a>
            </div>
          ))}
        </div>
        
        <p className="mt-6">
          If you have any questions or want to contact the maintainers, <a href="https://github.com/sunnah-com/api/issues/new?template=request-for-api-access.md&title=Request+for+API+access%3A+%5BYour+Name%5D" className="text-primary hover:underline">create an issue</a> on GitHub or <Link href="/contact" className="text-primary hover:underline">send us a message</Link>! We will get back to you as soon as we can, in sha Allah.
        </p>
      </div>
    </div>
  );
}
