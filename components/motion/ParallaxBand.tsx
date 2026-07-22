"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

interface ParallaxBandProps {
  children: ReactNode;
  /** Background image URL (absolute or withBasePath'd) */
  imageSrc: string;
  imageAlt?: string;
  className?: string;
  /** Overlay classes for readability */
  overlayClassName?: string;
  /** Max translate intensity in px (background moves opposite scroll) */
  intensity?: number;
}

/**
 * Scroll-linked background translateY. Disabled under reduced-motion
 * and for coarse pointers (touch) where parallax tends to jank.
 */
export function ParallaxBand({
  children,
  imageSrc,
  imageAlt = "",
  className = "",
  overlayClassName = "bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-stone-950/50",
  intensity = 48,
}: ParallaxBandProps) {
  const bandRef = useRef<HTMLElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const sync = () => setEnabled(!reduce.matches && !coarse.matches);
    sync();
    reduce.addEventListener("change", sync);
    coarse.addEventListener("change", sync);
    return () => {
      reduce.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setOffsetY(0);
      return;
    }

    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const band = bandRef.current;
        if (!band) return;
        const rect = band.getBoundingClientRect();
        const viewH = window.innerHeight || 1;
        const progress = (viewH / 2 - (rect.top + rect.height / 2)) / viewH;
        setOffsetY(progress * intensity);
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled, intensity]);

  const layerStyle: CSSProperties = {
    transform: enabled ? `translate3d(0, ${offsetY}px, 0) scale(1.12)` : "none",
    willChange: enabled ? "transform" : undefined,
  };

  return (
    <section ref={bandRef} className={`relative overflow-hidden ${className}`}>
      <div
        aria-hidden={imageAlt ? undefined : true}
        className="pointer-events-none absolute inset-0 -top-[8%] -bottom-[8%]"
        style={layerStyle}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- parallax layer needs plain img for transform */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
        />
      </div>
      <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
