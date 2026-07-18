import Link from "next/link";
import { SITE } from "@/lib/content/team";
import { withBasePath } from "@/lib/site/basePath";

/** Exact ROA footer/header wordmark PNG (623×56). Do not replace with SVG paths. */
const LOGO_SRC = withBasePath("/images/realty-of-america-logo.png");
const LOGO_NATIVE_WIDTH = 623;
const LOGO_NATIVE_HEIGHT = 56;
const LOGO_ASPECT = LOGO_NATIVE_WIDTH / LOGO_NATIVE_HEIGHT;

interface BrandLogoProps {
  /** Rendered width in CSS pixels; height follows native aspect ratio. */
  width?: number;
  className?: string;
  priority?: boolean;
  /** When true, wraps logo in a home link. */
  linked?: boolean;
}

/**
 * Official ROA white horizontal logo for dark ink/navy chrome.
 * White lettering + teal triangle accents — no light plate.
 */
export function BrandLogo({
  width = 240,
  className = "",
  priority = false,
  linked = false,
}: BrandLogoProps) {
  const height = Math.round(width / LOGO_ASPECT);
  const image = (
    // Plain img: explicit width/height attrs prevent 0×0 collapse from w-auto.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="Realty of America"
      width={width}
      height={height}
      decoding="async"
      {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
      className={`block max-w-full ${className}`}
      style={{ width, height, maxWidth: "100%" }}
    />
  );

  if (!linked) return image;

  return (
    <Link
      href="/"
      className="inline-block max-w-full cursor-pointer focus-visible:outline-offset-4"
      aria-label="Realty of America — home"
    >
      {image}
    </Link>
  );
}

interface BrandLockupProps {
  logoWidth?: number;
  showOffice?: boolean;
  priority?: boolean;
  className?: string;
  officeClassName?: string;
}

/** Logo + Kevin Shoun office attribution for header / footer only (never hero). */
export function BrandLockup({
  logoWidth = 240,
  showOffice = true,
  priority = false,
  className = "",
  officeClassName = "mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-stone-400 sm:text-xs",
}: BrandLockupProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <BrandLogo width={logoWidth} priority={priority} linked />
      {showOffice ? (
        <p className={officeClassName}>{SITE.office}</p>
      ) : null}
    </div>
  );
}
