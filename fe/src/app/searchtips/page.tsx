import React from "react"

export const metadata = {
  title: "Search Tips | Next Sunnah",
  description: "Learn how to effectively search hadith using advanced search techniques",
}

export default function SearchTipsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Search Tips</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Basic Search</h2>
          <p className="mb-4">
            By default, our search engine looks for hadiths containing any of the words you type.
            For example, searching for <code className="bg-muted px-1 py-0.5 rounded">prayer mosque</code> will
            find hadiths that mention either &quot;prayer&quot; or &quot;mosque&quot; or both.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Advanced Search Techniques</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-primary/20 p-4">
              <h3 className="text-xl font-medium mb-2">Quotes</h3>
              <p className="mb-2">
                <code className="bg-muted px-1 py-0.5 rounded">&quot;pledge allegiance&quot;</code>
              </p>
              <p>
                Searches for the whole phrase instead of individual words.
              </p>
            </div>
            
            <div className="rounded-lg border border-primary/20 p-4">
              <h3 className="text-xl font-medium mb-2">Wildcards</h3>
              <p className="mb-2">
                <code className="bg-muted px-1 py-0.5 rounded">test*</code>
              </p>
              <p>
                Matches any set of one or more characters. For example test* would result in test, tester, testers, etc.
              </p>
            </div>
            
            <div className="rounded-lg border border-primary/20 p-4">
              <h3 className="text-xl font-medium mb-2">Fuzzy Search</h3>
              <p className="mb-2">
                <code className="bg-muted px-1 py-0.5 rounded">swore~</code>
              </p>
              <p>
                Finds terms that are similar in spelling. For example swore~ would result in swore, snore, score, etc.
              </p>
            </div>
            
            <div className="rounded-lg border border-primary/20 p-4">
              <h3 className="text-xl font-medium mb-2">Term Boosting</h3>
              <p className="mb-2">
                <code className="bg-muted px-1 py-0.5 rounded">pledge^4 hijrah</code>
              </p>
              <p>
                Boosts words with higher relevance. Here, the word pledge will have higher weight than hijrah.
              </p>
            </div>
            
            <div className="rounded-lg border border-primary/20 p-4 md:col-span-2">
              <h3 className="text-xl font-medium mb-2">Boolean Operators</h3>
              <p className="mb-2">
                <code className="bg-muted px-1 py-0.5 rounded">(&quot;pledge allegiance&quot; OR &quot;shelter&quot;) AND prayer</code>
              </p>
              <p>
                Create complex phrase and word queries by using Boolean logic. Operators include:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>AND</strong>: Both terms must be present</li>
                <li><strong>OR</strong>: Either term must be present</li>
                <li><strong>NOT</strong>: The following term must not be present</li>
                <li><strong>+</strong>: The following term must be present</li>
                <li><strong>-</strong>: The following term must not be present</li>
              </ul>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Search Examples</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-primary/20">
              <p className="font-medium">Find hadiths about prayer in the mosque:</p>
              <code className="bg-muted px-2 py-1 rounded block mt-2">prayer AND mosque</code>
            </div>
            
            <div className="p-4 rounded-lg border border-primary/20">
              <p className="font-medium">Find hadiths about fasting but not in Ramadan:</p>
              <code className="bg-muted px-2 py-1 rounded block mt-2">fasting NOT ramadan</code>
            </div>
            
            <div className="p-4 rounded-lg border border-primary/20">
              <p className="font-medium">Find hadiths with variations of &quot;pray&quot;:</p>
              <code className="bg-muted px-2 py-1 rounded block mt-2">pray*</code>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
