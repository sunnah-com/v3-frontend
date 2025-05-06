import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <h1 className="text-6xl md:text-8xl font-bold text-primary">404</h1>

        <h2 className="text-3xl md:text-4xl font-bold">Page Not Found</h2>

        <div className="w-24 h-1 bg-primary mx-auto my-4"></div>

        <p className="text-xl text-muted-foreground max-w-lg">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="bg-muted p-6 rounded-lg my-8 max-w-2xl">
          <blockquote className="italic text-lg">
            &ldquo;Verily, with hardship comes ease.&rdquo;
            <footer className="text-right mt-2 text-muted-foreground">
              — Quran 94:6
            </footer>
          </blockquote>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>

          <Link
            href="/collections"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Browse Collections
          </Link>
        </div>

        <div className="mt-12 text-muted-foreground">
          <p>
            If you believe this is an error, please{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
