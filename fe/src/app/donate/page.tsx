export default function DonatePage() {
  // Donation tiers
  const donationTiers = [
    {
      id: 1,
      name: "Supporter",
      amount: "$10",
      period: "monthly",
      benefits: [
        "Support the maintenance of Sunnah.com",
        "Help make authentic hadith accessible to all"
      ]
    },
    {
      id: 2,
      name: "Sustainer",
      amount: "$25",
      period: "monthly",
      benefits: [
        "Support the maintenance of Sunnah.com",
        "Help make authentic hadith accessible to all",
        "Support new translations and content"
      ]
    },
    {
      id: 3,
      name: "Patron",
      amount: "$50",
      period: "monthly",
      benefits: [
        "Support the maintenance of Sunnah.com",
        "Help make authentic hadith accessible to all",
        "Support new translations and content",
        "Fund technical improvements and new features"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Support Our Mission</h1>
      
      <div className="prose dark:prose-invert max-w-none mb-12">
        <p className="text-lg mb-6">
          Sunnah.com is a non-profit project dedicated to making authentic hadith collections freely accessible to everyone around the world. Your donations help us maintain and improve our services.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Why Donate?</h2>
        <p>
          Your contributions directly support:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Server costs and technical infrastructure</li>
          <li>Development of new features and improvements</li>
          <li>Translation of hadith collections into more languages</li>
          <li>Scholarly verification and authentication of content</li>
          <li>Educational resources and tools</li>
        </ul>
        
        <p>
          As a non-profit project, we rely on the generosity of our community to continue our mission of spreading authentic knowledge of the Prophet&apos;s <span className="arabic">(صلى الله عليه و سلم)</span> teachings.
        </p>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Donation Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {donationTiers.map((tier) => (
            <div 
              key={tier.id} 
              className="border rounded-lg p-6 flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary hover:bg-card/50"
            >
              <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold mb-1">{tier.amount}</div>
              <div className="text-sm text-muted-foreground mb-4">{tier.period}</div>
              <ul className="space-y-2 mb-6 flex-grow">
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium w-full">
                Donate {tier.amount}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-muted p-6 rounded-lg mb-12">
        <h2 className="text-xl font-semibold mb-4">One-Time Donation</h2>
        <p className="mb-6">
          Prefer to make a one-time donation? Choose an amount below:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button className="bg-card border px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 hover:bg-card/80 hover:border-primary">$10</button>
          <button className="bg-card border px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 hover:bg-card/80 hover:border-primary">$25</button>
          <button className="bg-card border px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 hover:bg-card/80 hover:border-primary">$50</button>
          <button className="bg-card border px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 hover:bg-card/80 hover:border-primary">$100</button>
        </div>
        <div className="flex items-center border rounded-md overflow-hidden">
          <span className="bg-muted-foreground/10 px-3 py-2">$</span>
          <input 
            type="number" 
            placeholder="Other amount" 
            className="flex-grow px-3 py-2 bg-transparent focus:outline-none" 
          />
        </div>
        <button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium w-full">
          Donate Now
        </button>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">Other Ways to Support</h3>
        <p className="mb-4">
          If you&apos;d like to discuss other ways to support Sunnah.com, such as corporate sponsorships, 
          legacy giving, or in-kind donations, please contact us.
        </p>
        <a href="/contact" className="text-primary hover:underline">
          Contact our team
        </a>
      </div>
    </div>
  );
}
