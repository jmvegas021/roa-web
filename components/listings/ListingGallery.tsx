"use client";

import Image from "next/image";
import { useState } from "react";
import { withBasePath } from "@/lib/site/basePath";

interface ListingGalleryProps {
  images: string[];
  alt: string;
}

export function ListingGallery({ images, alt }: ListingGalleryProps) {
  const safeImages =
    images.length > 0 ? images : [withBasePath("/images/listing-placeholder.svg")];
  const [active, setActive] = useState(0);

  return (
    <div className="w-full max-w-full min-w-0">
      <div className="relative aspect-[16/10] w-full max-w-full overflow-hidden bg-stone-800">
        <Image
          src={safeImages[active]}
          alt={`${alt} — photo ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover"
        />
      </div>
      {safeImages.length > 1 ? (
        <ul
          className="mt-4 flex max-w-full gap-3 overflow-x-auto pb-2"
          aria-label="Gallery thumbnails"
        >
          {safeImages.map((src, index) => (
            <li key={`${src}-${index}`} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === active}
                className={`relative h-20 w-28 overflow-hidden bg-stone-800 ${
                  index === active ? "ring-2 ring-gold" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
