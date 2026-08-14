import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-28 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-gold">404</p>
      <h1 className="font-display mt-4 text-4xl text-stone-50">
        Journal piece not found
      </h1>
      <p className="mt-4 max-w-md text-stone-400">
        This article is unavailable. Browse the journal or request a private
        consult.
      </p>
      <div className="mt-8 flex gap-6 text-sm">
        <Link href="/blog" className="text-gold hover:underline">
          Journal
        </Link>
        <Link href="/contact" className="text-stone-400 hover:text-gold">
          Private consult
        </Link>
      </div>
    </div>
  );
}
