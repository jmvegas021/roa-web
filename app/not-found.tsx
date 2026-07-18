import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-28 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-gold">404</p>
      <h1 className="font-display mt-4 text-5xl text-stone-50">Page not found</h1>
      <p className="mt-4 max-w-md text-stone-400">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 text-xs uppercase tracking-[0.2em] text-gold hover:underline"
      >
        Return home
      </Link>
    </div>
  );
}
