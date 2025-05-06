import { Hadith } from "fe/types";

interface HadithMetadataProps {
  hadith: Hadith;
  className?: string;
}

export function HadithMetadata({
  hadith,
  className = "",
}: HadithMetadataProps) {
  // Only render if there's at least one metadata field
  if (
    !hadith.grade &&
    !hadith.reference &&
    !hadith.inBookReference &&
    !hadith.englishTranslation
  ) {
    return null;
  }

  return (
    <div className={`space-y-1 text-sm text-muted-foreground ${className}`}>
      {hadith.grade && (
        <div>
          <span className="font-semibold">Grade:</span>{" "}
          <span className="bg-secondary/10 text-secondary-foreground px-2 py-0.5 rounded">
            {hadith.grade}
          </span>
          {hadith.gradeSource && ` (${hadith.gradeSource})`}
        </div>
      )}
      {hadith.reference && (
        <div>
          <span className="font-semibold">Reference:</span> {hadith.reference}
        </div>
      )}
      {hadith.inBookReference && (
        <div>
          <span className="font-semibold">In-book reference:</span>{" "}
          {hadith.inBookReference}
        </div>
      )}
      {hadith.englishTranslation && (
        <div>
          <span className="font-semibold">English translation:</span>{" "}
          {hadith.englishTranslation}
        </div>
      )}
    </div>
  );
}
