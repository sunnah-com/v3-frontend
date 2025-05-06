export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">How to Provide Support</h1>
      
      <div className="bg-card rounded-lg p-8 shadow-sm mb-8">
        <p className="mb-6 text-lg">
          If you have found this site useful, please consider the following:
        </p>
        
        <ol className="space-y-6 list-decimal pl-6">
          <li className="text-lg">
            <p className="font-medium mb-2">Submit error reports for erroneous hadith that you see.</p>
            <p>This includes grammatical mistakes, spelling mistakes or any other type of corrections that are needed, especially in the English translations. This helps us in providing a better experience for everyone.</p>
          </li>
          
          <li className="text-lg">
            <p className="font-medium mb-2">Link to us as a hadith resource if you run a website of your own.</p>
            <p>This increases our visibility in search rankings.</p>
          </li>
          
          <li className="text-lg">
            <p className="font-medium mb-2">Submit feedback on how we can improve your experience on sunnah.com and volunteer your time by contacting us.</p>
            <a href="/contact" className="text-primary hover:underline">Contact us here</a>
          </li>
          
          <li className="text-lg">
            <p className="font-medium mb-2">Support the original translators and publishers of these works.</p>
            <p>They went through an incredibly painstaking and expensive process digitizing and translating these works for us, so please support them by purchasing the original hard copies.</p>
          </li>
          
          <li className="text-lg">
            <p className="font-medium mb-2">Donate and assist the poor and needy Muslims around the world by contributing to Islamic charities such as Islamic Relief.</p>
            <p>We know how important it is to assist those in need:</p>
            
            <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic">
              Abdullah bin &apos;Amr bin Al-&apos;as (May Allah be pleased with him) reported:<br />
              A man asked Messenger of Allah (peace be upon him), &quot;Which act in Islam is the best?&quot; He (peace be upon him) replied, &quot;To feed (the poor and the needy) and to greet those whom you know and those you do not know.&quot;<br />
              Bukhari &amp; Muslim
            </blockquote>
          </li>
        </ol>
        
        <div className="mt-8 bg-muted p-6 rounded-lg">
          <p className="mb-4">
            Therefore we highly encourage you, that if you find this site useful, to please buy the original works and also provide support for those Muslims who are starving and in dire need. This would be the most generous way of supporting our website and its mission.
          </p>
          
          <p className="mb-4">
            If you don&apos;t have much to give, every little bit helps those that are sick, hungry, thirsty, and cold:
          </p>
          
            <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic">
              Adi bin Hatim (May Allah be pleased with him) reported:<br />
              Messenger of Allah (peace be upon him) said, &quot;Guard yourselves against the Fire (of Hell) even if it be only with half a date-fruit (given in charity); and if you cannot afford even that, you should at least say a good word.&quot;<br />
              Bukhari &amp; Muslim
            </blockquote>
          
          <div className="mt-6 flex justify-center">
            <a 
              href="/donate" 
              className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium text-lg"
            >
              Donate Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
