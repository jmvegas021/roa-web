"use client";

import { useEffect, useRef } from "react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { HERO_MEDIA } from "@/lib/content/hero-media";
import { SITE } from "@/lib/content/team";

/**
 * Full-bleed video hero — brand-first; search is the primary action.
 * No CTA clutter, cards, or stats in the first viewport.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    function syncPlayback() {
      if (!video) return;
      if (media.matches) {
        video.pause();
        video.removeAttribute("autoplay");
      } else {
        void video.play().catch(() => {
          /* autoplay may be blocked; poster remains */
        });
      }
    }

    syncPlayback();
    media.addEventListener("change", syncPlayback);
    return () => media.removeEventListener("change", syncPlayback);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_MEDIA.posterSrc}
          aria-hidden
        >
          <source src={HERO_MEDIA.videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/92 via-stone-950/58 to-stone-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/45" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-20 pt-40 lg:px-10 lg:pb-28">
        <h1 className="animate-fade-up font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] text-stone-50">
          {SITE.office}
        </h1>
        <p className="animate-fade-up-delay-1 mt-3 text-xs uppercase tracking-[0.28em] text-gold">
          {SITE.brand}
          <span className="mx-3 text-stone-400">·</span>
          Salado · Belton · Temple · Georgetown
        </p>
        <p className="animate-fade-up-delay-2 mt-5 max-w-md text-base leading-relaxed text-stone-300 sm:text-lg">
          Precision representation for professionals across Central Texas.
        </p>
        <div className="animate-fade-up-delay-3 mt-10">
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
