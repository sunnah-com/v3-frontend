import Link from "next/link";
import { Hadith } from "fe/types";
import { HadithMetadata } from "./hadith-metadata";

// Utility function to properly render the PBUH symbol
const formatTextWithPBUH = (text: string) => {
  // Replace the PBUH symbol with a properly styled span
  return text.replace(/\(ﷺ\)/g, '(<span class="pbuh-symbol">ﷺ</span>)');
};

interface HadithCardProps {
  hadith: Hadith;
  collectionId: string;
  bookId: string;
  isLink?: boolean;
  truncateText?: boolean;
  layout?: "stacked" | "side-by-side";
  className?: string;
}

export function HadithCard({
  hadith,
  collectionId,
  bookId,
  isLink = true,
  truncateText = true,
  layout = "stacked",
  className = "",
}: HadithCardProps) {
  const content = (
    <div className={`p-6 rounded-lg border bg-card ${isLink ? "hover:border-primary transition-colors" : ""} ${className}`}>
      <div className="mb-2">
        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
          Hadith {hadith.number}
        </span>
      </div>

      {hadith.narrator && (
        <div className="text-primary font-medium mb-4">
          {hadith.narrator}
        </div>
      )}

      {layout === "stacked" ? (
        <>
          <div className="mb-4">
            <p
              className={truncateText ? "line-clamp-3" : ""}
              dangerouslySetInnerHTML={{
                __html: formatTextWithPBUH(hadith.text),
              }}
            />
          </div>

          <div className="arabic text-right mb-4">
            <p className={truncateText ? "line-clamp-3" : ""}>
              {hadith.textArabic}
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 mb-4">
          <div className="flex-1 text-lg leading-relaxed">
            <p
              dangerouslySetInnerHTML={{
                __html: formatTextWithPBUH(hadith.text),
              }}
            />
          </div>

          <div className="flex-1 arabic text-right text-xl leading-relaxed">
            <p>{hadith.textArabic}</p>
          </div>
        </div>
      )}

      <HadithMetadata hadith={hadith} />
    </div>
  );

  if (isLink) {
    return (
      <Link
        href={`/collections/${collectionId}/${bookId}/${hadith.id}`}
        className="block"
      >
        {content}
      </Link>
    );
  }

  return content;
}
