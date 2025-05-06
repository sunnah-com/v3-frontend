export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Us</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        {/* Table of Contents */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Contents</h2>
          <ol className="list-decimal pl-6">
            <li><a href="#mission" className="text-primary hover:underline">Sunnah.com Mission</a></li>
            <li><a href="#about-hadith" className="text-primary hover:underline">About Hadith</a></li>
            <li><a href="#about-website" className="text-primary hover:underline">About The Website</a></li>
            <li><a href="#fonts" className="text-primary hover:underline">Fonts</a></li>
            <li><a href="#important-note" className="text-primary hover:underline">Important Note</a></li>
            <li><a href="#sources" className="text-primary hover:underline">Sources, Numbering, and Grading</a></li>
            <li><a href="#misc" className="text-primary hover:underline">Miscellaneous</a></li>
            <li><a href="#reproduction" className="text-primary hover:underline">Reproduction, Copying, Scraping</a></li>
          </ol>
        </div>
        
        {/* Section 1: Sunnah.com Mission */}
        <section id="mission">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Sunnah.com Mission</h2>
          <p>
            Our goal is to make authentic, comprehensive, and beneficial information pertaining to the sunnah of the Prophet Muhammad <span className="arabic">(صلى الله عليه و سلم)</span> accessible to as many people around the world as possible in order to facilitate research and promote its mainstream and broadly accepted understanding.
          </p>
          <p className="mt-4">
            Our work is guided by the following core values:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Authenticity:</strong> We strive to stay true to the text by checking and verifying our data and numbering with well-known printed editions.</li>
            <li><strong>Comprehensiveness:</strong> We aim to provide complete collections of hadith, their scholarly translations in as many languages as possible, explanations of hadith, information about hadith collectors and narrators, and resources on the sciences of hadith.</li>
            <li><strong>Usability and accessibility:</strong> We are committed to providing a simple and uncluttered user interface to view and search our data on a variety of devices. We will develop and provide tools and organizational aids to facilitate research and analysis of hadith, narrators, and chains of narration by specialists and students of knowledge. It is important to us to reduce connectivity barriers to accessing knowledge.</li>
            <li><strong>Open:</strong> We provide an open platform – including data and software – so that others can build on top of hadith data.</li>
          </ul>
        </section>
        
        {/* Section 2: About Hadith */}
        <section id="about-hadith">
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. About Hadith</h2>
          <p>
            Hadith are the transmitted narrations concerning the speech, actions, appearance, and approvals of the Messenger of Allah, the Prophet Muhammad (peace and blessings be upon him). Hundreds of thousands of these narrations have been carefully preserved, studied, and passed down through the centuries, with many of them having undergone a strict procedure to verify an authentic chain of transmission up to the Prophet (pbuh). Hadith form the textual core of the Sunnah, an important source for the derivation of Islamic jurisprudence second only to the Qur&apos;an. Hadith specialists have compiled hadith in various collections with differing criteria for inclusion, and not all hadith in all collections are necessarily authentic.
          </p>
        </section>
        
        {/* Section 3: About the Website */}
        <section id="about-website">
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. About the Website</h2>
          <p>
            The hadith collections currently available can be seen on the homepage. We are working on importing hadith from other major collections as well.
          </p>
          <p className="mt-4">
            We support full search of both the English text of the hadith as well as the Arabic through a powerful search engine based on Lucene. To improve your search experience, browse through our Search Tips and Lucene&apos;s query syntax to create custom and accurate search queries.
          </p>
        </section>
        
        {/* Section 4: Fonts */}
        <section id="fonts">
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Fonts</h2>
          <p>
            In order to best view the content on our website, we recommend downloading and installing the KFGQPC Uthman Taha Naskh font. Any Arabic font with a complete set of ligatures will also do. In particular, we use a Unicode character ﷺ to represent sallallahu `alaihi wa sallam. If you do not see the character in the previous sentence, your font does not fully support Arabic. For Urdu we recommend any Nastaliq font (such as Fajer Noori).
          </p>
        </section>
        
        {/* Section 5: Important Note */}
        <section id="important-note">
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Important Note</h2>
          <p>
            We feel compelled to make an observation here: this is not a fiqh or fatwa website. Hadith are made available on this website as a resource for research, personal study and understanding. The text of one or a few hadith alone are not taken as rulings by themselves; scholars have a sophisticated process using the principles of fiqh to come up with rulings. We do not advocate do-it-yourself fiqh using these hadith for those who are untrained in these principles. If you have a question on a specific ruling, please ask your local scholar.
          </p>
        </section>
        
        {/* Section 6: Sources, numbering, and grading */}
        <section id="sources">
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Sources, Numbering, and Grading</h2>
          <p>
            The Arabic text on our website is sourced from al-eman.com and hadith.al-islam.com (now defunct). For the English we use various translators, a full list of which will appear here shortly inshaAllah. The English has been through two iterations of cleaning (spelling corrections etc.). We have done our best to provide the most authentic and exact hadith possible.
          </p>
          <p className="mt-4">
            The reader will note differences in the numbering scheme in English and Arabic. The reason behind this is that the translator took a few liberties while translating, sometimes splitting or combining the Arabic books, and sometimes splitting or combining the hadith as well. This led to a new numbering for the English, while the numbering for the Arabic remained the same.
          </p>
          <p className="mt-4">
            On sunnah.com we realize that some people will have an English reference number that has been popularized due to the translation, and some others may consult an Arabic version. Sticking with one or the other is not an option due to the numerous errors and inconsistencies (the simplest of which is splitting and combination of hadith that have to be combined and unsplit respectively).
          </p>
          <p className="mt-4">
            We are moving toward unified reference numbering schemes corresponding to well-known scholars and publications (the numbering of Muhammad Fuad Abdul Baaqi is one such) slowly. You can see an example here.
          </p>
          <p className="mt-4">
            If the text and numbering in a book has been checked and verified, it will display a reference number in bold. Otherwise it means it is still in progress and the Arabic references numbers may not be exact in that case.
            We are working hard to add grade information for each hadith not in the Sahihain (Sahih al-Bukhari and Sahih Muslim). At this point we are displaying grade decisions by Shaykh al-Albani and Darussalam (Hafiz Zubair `Ali Za`i). Eventually we hope to have grade assignments from several other distinguished muhaddiths such as Shaykhs al-Arna&apos;ut, Ahmad Shakir, and Abu Ghuddah wherever applicable.
          </p>
        </section>
        
        {/* Section 7: Miscellaneous */}
        <section id="misc">
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Miscellaneous</h2>
          <p>
            We ask that you to keep all those people who worked on this website in your du&apos;a and help by supporting us.
          </p>
        </section>
        
        {/* Section 8: Reproduction, Copying, Scraping */}
        <section id="reproduction">
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Reproduction, Copying, Scraping</h2>
          <p>
            We do not permit the scraping of our data, nor mass reproduction of entire books or collections on other websites. Our data is undergoing continuous refinement and this website is designed as a central and up-to-date resource. If you would like a snapshot of hadith data, consider using our API. Reproducing individual hadith or selections of hadith for a teaching/didactic/presentation purpose is permitted.
          </p>
        </section>
      </div>
    </div>
  );
}
