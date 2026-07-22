"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms once visible */
  delayMs?: number;
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
}

/**
 * Fade / slide-up on enter viewport. Disabled when prefers-reduced-motion.
 */
export function RevealOnScroll({
  children,
  className = "",
  delayMs = 0,
  rootMargin = "0px 0px -8% 0px",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setIsVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion, rootMargin]);

  const style: CSSProperties | undefined =
    !reduceMotion && delayMs > 0 && isVisible
      ? { transitionDelay: `${delayMs}ms` }
      : undefined;

  return (
    <div
      ref={ref}
      style={style}
      className={`reveal-on-scroll ${isVisible || reduceMotion ? "is-revealed" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
